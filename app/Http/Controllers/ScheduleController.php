<?php

namespace App\Http\Controllers;

use App\Enums\UserRoles;
use App\Models\Schedule;
use App\Models\Task;
use App\Models\TaskCategory;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;


class ScheduleController extends Controller
{
    use AuthorizesRequests;

    public function handleRoleBasedView(Request $request)
    {
        $user = Auth::user();
        $role = UserRoles::fromId($user->role_id);

        return match ($role) {
            UserRoles::Mitarbeiter => $this->show($request),
            UserRoles::Moderator => $this->index($request),
            UserRoles::Admin => $this->index($request),
            UserRoles::SuperAdmin => $this->index($request),
            default => inertia('Error', ['status' => 406]),
        };
    }

    private static function isValidYearMonth(string $view): bool
    {
        try {
            $date = Carbon::createFromFormat('Y-m', $view);
            return $date && $date->format('Y-m') === $view;
        } catch (\Exception $e) {
            return false;
        }
    }

    private function index(Request $request)
    {
        $this->authorize('viewAny', Schedule::class);

        // Fetch view query param (expected format: YYYY-MM)
        $view = $request->query('view', now()->format('Y-m')); // Default to current month

        if (!preg_match('/^\d{4}-\d{2}$/', $view) || !self::isValidYearMonth($view)) {
            $view = now()->format('Y-m');
        }

        // Parse the start and end of the selected month
        try {
            $baseDate = Carbon::createFromFormat('Y-m', $view)->startOfMonth();
        
            $startDate = $baseDate->copy()->subMonth()->startOfMonth()->toDateString();
            $endDate = $baseDate->copy()->addMonth()->endOfMonth()->toDateString();
        } catch (\Exception $e) {
            // fallback if view is invalid
            $baseDate = now()->startOfMonth();
            $startDate = $baseDate->copy()->subMonth()->startOfMonth()->toDateString();
            $endDate = $baseDate->copy()->addMonth()->endOfMonth()->toDateString();
        }

        $taskCategories = TaskCategory::all();

        $tasks = Task::with('users')
            ->whereBetween('time', [$startDate, $endDate])
            ->get();

        // show all users for admin to assign task
        $users = User::whereIn('role_id', UserRoles::taskAssignable())->get();

        return inertia('Schedule/Schedule', [
            'view' => $view, // optional default
            'taskCategories' => $taskCategories,
            'tasks' => $tasks,
            'users' => $users,
        ]);
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
            'tasks.*.task_category_id' => 'required|exists:task_categories,id',
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
                'task_category_id' => $taskData['task_category_id'],
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
        $endDate = now()->addDays(14)->toDateString();   // 14 days ahead

        $view = $request->query('view', now()->format('Y-m')); // Default to current month

        if (!preg_match('/^\d{4}-\d{2}$/', $view) || !self::isValidYearMonth($view)) {
            $view = now()->format('Y-m');
        }

        $taskCategories = TaskCategory::all();

        $tasks = Task::with('users')
            ->whereBetween('time', [$startDate, $endDate])
            ->get();

        return inertia('Schedule/UserSchedule', [
            'view' => $view,
            'taskCategories' => $taskCategories,
            'tasks' => $tasks,
            'userID' => $userID
        ]);
    }
}
