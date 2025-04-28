<?php

namespace App\Http\Controllers;

use App\Models\Task;
use App\Models\User;
use Illuminate\Http\Request;

class ScheduleController extends Controller
{
    public function index()
    {
        // show all tasks with user for admin/moderator interaction

        // show all tasks with their assigned users
        $tasks = Task::with('users')->get();

        // show all users with their assigned tasks
        $users = User::with('tasks')->get();

        return inertia('Schedule/Schedule', [
            'tasks' => $tasks,
            'users' => $users,
        ]);
    }
}
