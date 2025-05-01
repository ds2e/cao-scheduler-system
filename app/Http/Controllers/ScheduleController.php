<?php

namespace App\Http\Controllers;

use App\Enums\UserRoles;
use App\Models\Schedule;
use App\Models\Task;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;


class ScheduleController extends Controller
{
    use AuthorizesRequests;

    private function index(Request $request)
    {
        $this->authorize('viewAny', Schedule::class);

        // show all tasks within 7 days with their assigned users
        $startDate = now()->subDays(7)->toDateString(); // 7 days ago
        $endDate = now()->addDays(7)->toDateString();   // 7 days ahead

        $tasks = Task::with('users')
            ->whereBetween('time', [$startDate, $endDate])
            ->get();

        // show all users for admin to assign task
        $users = User::where('role_id', UserRoles::User->rank())->get();

        return inertia('Schedule/Schedule', [
            'view' => $request->query('view', 'timeTable'), // optional default
            'tasks' => $tasks,
            'users' => $users,
        ]);
    }

    public function handleRoleBasedView(Request $request)
    {
        $user = Auth::user();
        $role = UserRoles::fromId($user->role_id);


        return match ($role) {
            UserRoles::User => 
            // dd($role),
            $this->show($request),
            UserRoles::Admin => $this->index($request),
            default => inertia('Error', ['status' => 406]),
        };
    }

    public function updateSchedule(Request $request)
    {
        $this->authorize('update', Schedule::class);

        $validated = Validator::make($request->all(), [
            'tasks' => 'nullable|array',
            'tasks.*.id' => 'nullable|exists:tasks,id',
            'tasks.*.users' => 'required|array|min:1',
            'tasks.*.users.*.id' => 'required|exists:users,id',
            'tasks.*.description' => 'nullable|string',
            'tasks.*.time' => 'required|date',
            'date' => 'required|date', // explicitly validate `date`
        ])->validate();

        $tasks = $request->tasks ?? [];

        // Get IDs of tasks in the request (if they exist)
        $taskIdsInRequest = collect($tasks)
            ->pluck('id')
            ->filter()
            ->toArray();

        // Delete tasks not present in the request but exist for the date
        Task::where('time', $validated['date'])
            ->when(
                $taskIdsInRequest,
                fn($query) =>
                $query->whereNotIn('id', $taskIdsInRequest)
            )
            ->delete();

        // Upsert tasks
        foreach ($tasks as $taskData) {
            $task = isset($taskData['id'])
                ? Task::find($taskData['id'])
                : new Task();

            $task->fill([
                'description' => $taskData['description'] ?? '',
                'time' => $taskData['time'],
            ])->save();

            $userIds = collect($taskData['users'])->pluck('id')->toArray();
            $task->users()->sync($userIds);
        }

        return back()->with('success', 'Schedule updated.');
    }

    /**
     * Display the specified resource.
     */
    private function show(Request $request)
    {
        // $this->authorize('view', Schedule::class);
        $userID = Auth::user()->id;

        // show all tasks within 7 days with their assigned users
        $startDate = now()->subDays(7)->toDateString(); // 7 days ago
        $endDate = now()->addDays(7)->toDateString();   // 7 days ahead

        $tasks = Task::with('users')
            ->whereBetween('time', [$startDate, $endDate])
            ->whereHas('users', function ($query) use ($userID) {
                $query->where('users.id', $userID);
            })
            ->get();

        return inertia('Schedule/UserSchedule', [
            'view' => $request->query('view', 'timeTable'), // optional default
            'tasks' => $tasks,
            'userID' => $userID 
        ]);
        
    }
}
