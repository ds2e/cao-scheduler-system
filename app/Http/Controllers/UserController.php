<?php

namespace App\Http\Controllers;

use App\Models\Role;
use App\Models\Task;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Routing\Controller;
use Illuminate\Validation\Rule;

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

        $users = User::latest()->get();
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

    public function update(Request $request, User $user)
    {
        $this->authorize('update', $user);

        // Validate the request
        $validated = $request->validate([
            'id' => ['required', 'integer', Rule::exists('users', 'id')],
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255'],
            'role_id' => ['required', 'integer', Rule::exists('roles', 'id')],
        ]);

        // Find the user
        $user = User::findOrFail($validated['id']);

        // Update the user's data
        $user->name = $validated['name'];
        $user->email = $validated['email'];
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
}
