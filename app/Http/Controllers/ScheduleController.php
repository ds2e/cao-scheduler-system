<?php

namespace App\Http\Controllers;

use App\Enums\UserRoles;
use App\Models\Schedule;
use App\Models\Task;
use App\Models\TaskCategory;
use App\Models\Todo;
use App\Models\TodoJob;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;


class ScheduleController extends Controller
{
    use AuthorizesRequests;

    public function handleScheduleRoleBasedView(Request $request)
    {
        $user = Auth::user();
        $role = UserRoles::fromId($user->role_id);

        return match ($role) {
            UserRoles::Mitarbeiter => $this->show($request),
            UserRoles::Moderator => $this->show($request),
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

        $view = $request->query('view');

        $validator = Validator::make(['view' => $view], [
            'view' => [
                'nullable',
                'regex:/^\d{4}-\d{2}$/',
                function ($attribute, $value, $fail) use ($view) {
                    if (!self::isValidYearMonth($view)) {
                        $fail('The ' . $attribute . ' is not a valid year-month.');
                    }
                },
            ],
        ]);

        if ($validator->fails()) {
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
        $todos = Todo::all();

        $tasks = Task::with('users')
            ->whereBetween('date_start', [$startDate, $endDate])
            ->get();

        $todoJobs = TodoJob::whereBetween('date', [$startDate, $endDate])
            ->get();

        // show all users for admin to assign task
        $users = User::whereIn('role_id', UserRoles::taskAssignable())->get();

        return inertia('Schedule/Schedule', [
            'view' => $view,
            'taskCategories' => $taskCategories,
            'tasks' => $tasks,
            'todoJobs' => $todoJobs,
            'todos' => $todos,
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
            'tasks.*.date_start' => 'required|date',
            'tasks.*.date_end' => 'required|date',
            'tasks.*.time_start' => ['required', 'date_format:H:i:s'],
            'tasks.*.time_end' => ['required', 'date_format:H:i:s'],
            'tasks.*.task_category_id' => 'required|exists:task_categories,id',
            'date' => 'required|date',
        ])->after(function ($validator) use ($request) {
            foreach ($request->input('tasks', []) as $index => $task) {
                $ds = $task['date_start'] ?? null;
                $de = $task['date_end'] ?? null;
                $ts = $task['time_start'] ?? null;
                $te = $task['time_end'] ?? null;

                if ($ds && $de && $ts && $te) {
                    $start = strtotime("$ds $ts");
                    $end = strtotime("$de $te");

                    if ($start > $end) {
                        $validator->errors()->add("tasks.$index.time_end", 'The end datetime must be after the start datetime.');
                    }
                }
            }
        })->validate();

        $tasks = $validated['tasks'] ?? [];

        // Get IDs of tasks in the request (if they exist)
        $taskIdsInRequest = collect($tasks)
            ->pluck('id')
            ->filter()
            ->toArray();

        // Delete tasks not present in the request but exist for the date
        Task::where('date_start', $validated['date'])
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
                'date_start' => $taskData['date_start'],
                'date_end' => $taskData['date_end'],
                'time_start' => $taskData['time_start'],
                'time_end' => $taskData['time_end'],
                'task_category_id' => $taskData['task_category_id'],
            ])->save();

            $userIds = collect($taskData['users'])->pluck('id')->toArray();
            $task->users()->sync($userIds);
        }

        return back()->with('success', 'Schedule updated.');
    }

    public function updateScheduleTodoJob(Request $request)
    {
        $this->authorize('update', Schedule::class);

        $validated = Validator::make($request->all(), [
            'todoJobs' => 'nullable|array',
            'todoJobs.*.id' => 'nullable|exists:todo_jobs,id',
            // 'todoJobs.*.users' => 'required|array|min:1',
            // 'todoJobs.*.users.*.id' => 'required|exists:users,id',
            'todoJobs.*.notice' => 'nullable|string',
            'todoJobs.*.date' => 'required|date',
            'todoJobs.*.todo_id' => 'required|exists:todos,id',
            'date' => 'required|date',
        ])->validate();

        // dd($validated);

        $todoJobs = $validated['todoJobs'] ?? [];

        // Get IDs of tasks in the request (if they exist)
        $todoJobIdsInRequest = collect($todoJobs)
            ->pluck('id')
            ->filter()
            ->toArray();

        // Delete tasks not present in the request but exist for the date
        TodoJob::where('date', $validated['date'])
            ->when(
                $todoJobIdsInRequest,
                fn($query) =>
                $query->whereNotIn('id', $todoJobIdsInRequest)
            )
            ->delete();

        // Upsert tasks
        foreach ($todoJobs as $todoJobData) {
            $todoJob = isset($todoJobData['id'])
                ? TodoJob::find($todoJobData['id'])
                : new TodoJob();

            $todoJob->fill([
                'notice' => $todoJobData['notice'] ?? '',
                'date' => $todoJobData['date'],
                'todo_id' => $todoJobData['todo_id'],
            ])->save();
        }

        return back()->with('success', 'Todo list updated.');
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
            ->whereBetween('date_start', [$startDate, $endDate])
            ->get();

        $todoJobs = TodoJob::with('todo')
            ->whereBetween('date', [$startDate, $endDate])
            ->get();

        return inertia('Schedule/UserSchedule', [
            'view' => $view,
            'taskCategories' => $taskCategories,
            'tasks' => $tasks,
            'todoJobs' => $todoJobs,
            'userID' => $userID
        ]);
    }
}
