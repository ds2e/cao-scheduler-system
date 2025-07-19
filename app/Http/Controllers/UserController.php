<?php

namespace App\Http\Controllers;

use App\Enums\UserRoles;
use App\Http\Requests\UpdateUserRequest;
use App\Models\Role;
use App\Models\Task;
use App\Models\Todo;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Routing\Controller;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;
use Illuminate\Support\Facades\Mail;
use Illuminate\Auth\Events\Registered;

class UserController extends Controller
{
    use AuthorizesRequests;
    // public function __construct()
    // {
    //     $this->authorizeResource(User::class, 'user');
    // }

    public function index()
    {
        $this->authorize('viewAny', User::class);

        $roles = Role::all()->keyBy('id');

        $users = User::latest()->paginate(5);

        return inertia('Users/Users', [
            'users' => $users,
            'roles' => $roles->values()
        ]);
    }
    /**
     * Show the profile for a given user.
     */
    public function show(User $user)
    {
        $this->authorize('view', $user);

        $user = User::with('role')->findOrFail($user->id);

        $startDate = now()->subMonth()->startOfMonth()->toDateString();
        $endDate = now()->addMonth()->endOfMonth()->toDateString();

        $tasks = Task::with('users')
            ->whereBetween('date_start', [$startDate, $endDate])
            ->whereHas('users', function ($query) use ($user) {
                $query->where('users.id', $user->id);
            })
            ->get();
        
        return inertia('Users/Index/Index', [
            'user' => $user,
            'tasks' => $tasks
        ]);
    }

    public function update(UpdateUserRequest $request, User $user)
    {
        $this->authorize('update', $user);

        $validated = $request->validated();

        $userData = $validated['currentSelectedUserData'];

        $enteredPIN = $userData['PIN'];

        // Find the user
        $user = User::findOrFail($userData['id']);

        // Decrypt current user's PIN for comparison
        try {
            $currentPIN = $user->PIN;
            // Crypt::decryptString($user->PIN);
        } catch (\Exception $e) {
            $currentPIN = null;
        }

        $isNewPIN = $enteredPIN !== $currentPIN;

        // Check if the entered PIN is already used by someone else
        $pinExists = User::get()->contains(function ($u) use ($enteredPIN, $user) {
            try {
                return $u->id !== $user->id && $u->PIN === $enteredPIN;
                // $u->id !== $user->id && Crypt::decryptString($u->PIN) === $enteredPIN;
            } catch (\Exception $e) {
                return false;
            }
        });

        if ($isNewPIN && $pinExists) {
            return back()->withErrors(['PIN' => 'This PIN is already in use.']);
        }

        // Update the user's userData
        DB::transaction(function () use ($user, $userData, $enteredPIN) {

            $user->name = $userData['name'];
            $user->email = $userData['email'];
            $user->PIN = $enteredPIN;
            // $user->PIN = Crypt::encryptString($enteredPIN);
            $user->role_id = $userData['role_id'];
            $user->updated_at = now();

            $user->save();
        });

        return back()->with('success', 'User updated.');
    }

    public function destroy(Request $request, User $user)
    {
        $this->authorize('delete', $user);

        $validated = Validator::make($request->all(), [
            'currentSelectedUserData.id' => ['required', 'integer', Rule::exists('users', 'id')]
        ])->validate();

        $userData = $validated['currentSelectedUserData'];

        $user = User::findOrFail($userData['id']);
        $user->delete(); // ✅ This triggers model events

        return back()->with('success', 'User deleted.');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request, User $user)
    {
        $this->authorize('create', $user);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users',
            'password' => 'required|string|min:8|confirmed',
        ]);

        do {
            $rand_PIN = str_pad((string)rand(0, 9999), 4, '0', STR_PAD_LEFT);
        } while (
            User::get()->contains(function ($u) use ($rand_PIN) {
                try {
                    return $u->PIN === $rand_PIN;
                    // Crypt::decryptString($u->PIN) === $rand_PIN;
                } catch (\Exception $e) {
                    return false; // Ignore broken/missing PINs
                }
            })
        );

        $validated['password'] = Hash::make($validated['password']);
        // $validated['PIN'] = Crypt::encryptString($rand_PIN);
        $validated['PIN'] = $rand_PIN;
        $validated['role_id'] = Role::where('name', UserRoles::Mitarbeiter->value)->first()->id;

        $user = User::create($validated);

        Mail::raw('Testing email for prod', function ($message) use ($validated) {
            $message->to($validated['email'])->subject('Test Email');
        });
        event(new Registered($user));
        $user->sendEmailVerificationNotification();

        return back()->with('success', 'User created.');
    }

    // DASHBOARD VIEW
    public function handleRoleBasedView(Request $request)
    {
        $user = Auth::user();
        $role = UserRoles::fromId($user->role_id);
        return match ($role) {
            // View specific to Mitarbeiter and Moderator
            UserRoles::Mitarbeiter, UserRoles::Moderator => (function () use ($user) {
                // $tasks_num = Task::where('user_id', $user->id)->count();
                return inertia('Dashboard/UserDashboard', [
                    // 'tasks_num' => $tasks_num,
                ]);
            })(),

            // View specific to Admin and SuperAdmin
            UserRoles::Admin, UserRoles::SuperAdmin => (function () use ($user) {
                $users_num = User::count();
                $todos_num = Todo::count();

                // Get current date
                $now = Carbon::now();

                // Get first and last day of current month
                $startDate = $now->copy()->startOfMonth();
                $endDate = $now->copy()->endOfMonth();

                // Fetch all tasks in the current month
                $tasks = Task::whereBetween('date_start', [$startDate->toDateString(), $endDate->toDateString()])
                    ->get();

                $tasks_num = Task::whereBetween('date_start', [$startDate->toDateString(), $endDate->toDateString()])
                    ->count();

                $tasksByDate = $tasks->groupBy('date_start');

                $totalHours = 0;
                $daysWithWork = $tasksByDate->count(); // Only counts days with at least one task

                foreach ($tasksByDate as $date => $dayTasks) {
                    foreach ($dayTasks as $task) {
                        $start = Carbon::createFromFormat('H:i:s', $task->time_start);
                        $end = Carbon::createFromFormat('H:i:s', $task->time_end);

                        // Handle overnight tasks
                        if ($end->lessThan($start)) {
                            $end->addDay();
                        }

                        $totalHours += $end->diffInSeconds($start, true) / 3600; // Convert to hours
                    }
                }

                $averageHoursPerDay = $daysWithWork > 0 ? $totalHours / $daysWithWork : 0;

                return inertia('Dashboard/AdminDashboard', [
                    'users_num' => $users_num,
                    'tasks_num' => $tasks_num,
                    'todos_num' => $todos_num,
                    'avg_hpd' => round($averageHoursPerDay, 2),
                ]);
            })(),
            default => inertia('Error', ['status' => 406]),
        };
    }
}
