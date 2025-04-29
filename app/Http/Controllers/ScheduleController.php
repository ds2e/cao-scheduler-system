<?php

namespace App\Http\Controllers;

use App\Models\Task;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ScheduleController extends Controller
{

    public function index()
    {
        // show all tasks with user for admin/moderator interaction

        // show all tasks with their assigned users
        $tasks = Task::with('users')->get();

        // show all users with their assigned tasks
        $users = User::all();

        return inertia('Schedule/Schedule', [
            'tasks' => $tasks,
            'users' => $users,
        ]);
    }

    // public function update(Request $request, Task $task)
    // {
    //     dd($request);
    // }

    public function updateSchedule(Request $request)
    {
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
        Task::whereDate('time', $validated['date'])
            ->when($taskIdsInRequest, fn($query) =>
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
}
