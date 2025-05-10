<?php

namespace App\Http\Controllers;

use App\Enums\UserRoles;
use App\Models\Role;
use App\Models\Task;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Routing\Controller;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\Hash;

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

        $users = User::latest()->paginate(5)->through(function ($user) {
            try {
                $user->PIN = Crypt::decryptString($user->PIN);
            } catch (\Exception $e) {
                $user->PIN = null; // fallback if decryption fails
            }
            return $user;
        });
        $roles = Role::all();
        return inertia('Users/Users', [
            'users' => $users,
            'roles' => $roles
        ]);
    }
    /**
     * Show the profile for a given user.
     */
    public function show(User $user)
    {
        $this->authorize('view', $user);

        $user = User::with('role')->findOrFail($user->id);
        $role = UserRoles::fromId($user->role_id);

        $startDate = now()->subMonth()->startOfMonth()->toDateString();
        $endDate = now()->addMonth()->endOfMonth()->toDateString();

        $tasks = Task::with('users')
            ->whereBetween('date_start', [$startDate, $endDate])
            ->whereHas('users', function ($query) use ($user) {
                $query->where('users.id', $user->id);
            })
            ->get();

        // Conditionally hide the PIN
        if (in_array($role, [UserRoles::Admin, UserRoles::SuperAdmin])) {
            try {
                $user->PIN = Crypt::decryptString($user->PIN);
            } catch (\Exception $e) {
                $user->PIN = null; // fallback if decryption fails
            }
        } else {
            $user->makeHidden(['PIN']);
        }

        return inertia('Users/Index/Index', [
            'user' => $user,
            'tasks' => $tasks
        ]);
    }

    public function update(Request $request, User $user)
    {
        $this->authorize('update', $user);

        // Validate the request
        $validated = $request->validate([
            'id' => ['required', 'integer', Rule::exists('users', 'id')],
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255'],
            'PIN' => ['required', 'digits:4'],
            'role_id' => ['required', 'integer', Rule::exists('roles', 'id')],
        ]);

        $enteredPIN = $validated['PIN'];

        // Find the user
        $user = User::findOrFail($validated['id']);

        // Decrypt current user's PIN for comparison
        try {
            $currentPIN = Crypt::decryptString($user->PIN);
        } catch (\Exception $e) {
            $currentPIN = null;
        }

        $isNewPIN = $enteredPIN !== $currentPIN;

        // Check if the entered PIN is already used by someone else
        $pinExists = User::get()->contains(function ($u) use ($enteredPIN, $user) {
            try {
                return $u->id !== $user->id && Crypt::decryptString($u->PIN) === $enteredPIN;
            } catch (\Exception $e) {
                return false;
            }
        });

        if ($isNewPIN && $pinExists) {
            return back()->withErrors(['PIN' => 'This PIN is already in use.']);
        }

        // Update the user's data
        $user->name = $validated['name'];
        $user->email = $validated['email'];
        $user->PIN = Crypt::encryptString($enteredPIN);
        $user->role_id = $validated['role_id'];
        $user->updated_at = now();

        $user->save();

        return back()->with('success', 'User updated.');
    }

    public function destroy(Request $request, User $user)
    {
        $this->authorize('delete', $user);

        $validated = $request->validate([
            'id' => ['required', 'integer', Rule::exists('users', 'id')]
        ]);

        $user = User::findOrFail($validated['id']);
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
                    return Crypt::decryptString($u->PIN) === $rand_PIN;
                } catch (\Exception $e) {
                    return false; // Ignore broken/missing PINs
                }
            })
        );

        $validated['password'] = Hash::make($validated['password']);
        $validated['PIN'] = Crypt::encryptString($rand_PIN);
        $validated['role_id'] = Role::where('name', UserRoles::Mitarbeiter->value)->first()->id;

        User::create($validated);

        return back()->with('success', 'User created.');
    }
}
