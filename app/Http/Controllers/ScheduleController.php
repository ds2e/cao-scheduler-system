<?php

namespace App\Http\Controllers;

use App\Enums\UserRoles;
use App\Models\ReportRecord;
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
use Illuminate\Support\Facades\DB;
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

        // Tasks
        $tasks = Task::with('users')
            ->whereBetween('date_start', [$startDate, $endDate])
            ->get();

        // Todos
        $todoJobs = TodoJob::whereBetween('date', [$startDate, $endDate])
            ->get();

        // Records 
        $reportRecords = ReportRecord::with('user')
            ->whereBetween('date_start', [$startDate, $endDate])
            ->get();

        // show all users for admin to assign task
        $users = User::whereIn('role_id', UserRoles::taskAssignable())->get();

        return inertia('Schedule/Schedule', [
            'view' => $view,
            'taskCategories' => $taskCategories,
            'tasks' => $tasks,
            'todoJobs' => $todoJobs,
            'reportRecords' => $reportRecords,
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
            'todoJobs.*.notice' => 'nullable|string',
            'todoJobs.*.date' => 'required|date',
            'todoJobs.*.todo_id' => 'required|exists:todos,id',
            'date' => 'required|date',
        ])->validate();

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

    public function updateReportRecords(Request $request)
    {
        $this->authorize('update', Schedule::class);

        $validated = Validator::make($request->all(), [
            'reportRecords' => 'nullable|array',
            'reportRecords.*.id' => 'required|integer|exists:users,id',
            'reportRecords.*.records' => 'required|array|min:1',
            'reportRecords.*.records.*.id' => 'nullable|integer|exists:report_records,id',
            'reportRecords.*.records.*.date_start' => 'required|date',
            'reportRecords.*.records.*.time_start' => 'required|date_format:H:i:s',
            'reportRecords.*.records.*.date_end' => 'required|date',
            'reportRecords.*.records.*.time_end' => 'required|date_format:H:i:s',
            'reportRecords.*.records.*.duration' => 'required|integer|min:0',
            'reportRecords.*.records.*.notice' => 'nullable|string',
            'date' => 'required|date',
        ])->after(function ($validator) {
            $data = $validator->getData();

            if (!isset($data['reportRecords'])) {
                return;
            }

            foreach ($data['reportRecords'] as $userIndex => $userData) {
                foreach ($userData['records'] as $recordIndex => $record) {
                    $dateStart = Carbon::parse($record['date_start']);
                    $dateEnd = Carbon::parse($record['date_end']);

                    // Combine date + time
                    $startDateTime = Carbon::parse($record['date_start'] . ' ' . $record['time_start']);
                    $endDateTime = Carbon::parse($record['date_end'] . ' ' . $record['time_end']);

                    // 1️⃣ date_end must be same or after date_start
                    if ($dateEnd->lt($dateStart)) {
                        $validator->errors()->add(
                            "reportRecords.$userIndex.records.$recordIndex.date_end",
                            'The date_end must be the same or after date_start.'
                        );
                    }

                    // 2️⃣ end datetime must be strictly after start datetime
                    if ($endDateTime->lte($startDateTime)) {
                        $validator->errors()->add(
                            "reportRecords.$userIndex.records.$recordIndex.time_end",
                            'The end date/time must be after the start date/time.'
                        );
                    }
                }
            }
        })->validate();

        $reportDate = $validated['date'];
        $reportRecords = $validated['reportRecords'];

        DB::beginTransaction();

        try {
            // Step 1: Collect user IDs from the request
            $incomingUserIds = collect($reportRecords)->pluck('id')->all();

            // Step 2: Get all users who have records for the given date
            $usersWithRecordsOnDate = ReportRecord::whereDate('date_start', $reportDate)
                ->pluck('user_id')
                ->unique()
                ->all();

            // Step 3: Determine which users should have their records deleted
            $usersToDelete = array_diff($usersWithRecordsOnDate, $incomingUserIds);

            // Step 4: Delete all records for users not included in the new data
            if (!empty($usersToDelete)) {
                ReportRecord::whereIn('user_id', $usersToDelete)
                    ->whereDate('date_start', $reportDate)
                    ->delete();
            }

            // Step 5: Continue with your existing logic to update/create/delete individual records
            foreach ($reportRecords as $userRecord) {
                $userId = $userRecord['id'];
                $records = $userRecord['records'];

                $user = User::find($userId);
                if (!$user) {
                    throw new \Exception("User not found");
                }

                $existingRecords = ReportRecord::where('user_id', $userId)
                    ->whereDate('date_start', $reportDate)
                    ->get()
                    ->keyBy('id');

                $processedRecordIds = [];

                foreach ($records as $recordData) {
                    if (isset($recordData['id']) && $recordData['id']) {
                        $recordId = $recordData['id'];
                        if (!$existingRecords->has($recordId)) {
                            throw new \Exception("Some records do not belong to user {$user->name}");
                        }

                        $record = $existingRecords->get($recordId);
                        $record->update([
                            'date_start' => $recordData['date_start'],
                            'time_start' => $recordData['time_start'],
                            'date_end' => $recordData['date_end'],
                            'time_end' => $recordData['time_end'],
                            'duration' => $recordData['duration'],
                            'notice' => $recordData['notice'] ?? null,
                        ]);
                        $processedRecordIds[] = $recordId;
                    } else {
                        $newRecord = ReportRecord::create([
                            'user_id' => $userId,
                            'date_start' => $recordData['date_start'],
                            'time_start' => $recordData['time_start'],
                            'date_end' => $recordData['date_end'],
                            'time_end' => $recordData['time_end'],
                            'duration' => $recordData['duration'],
                            'notice' => $recordData['notice'] ?? null,
                        ]);
                        $processedRecordIds[] = $newRecord->id;
                    }
                }

                // Delete any records not present in the updated list
                $recordsToDelete = $existingRecords->keys()->diff($processedRecordIds);
                if ($recordsToDelete->isNotEmpty()) {
                    ReportRecord::whereIn('id', $recordsToDelete)->delete();
                }
            }

            DB::commit();

            return back()->with('success', 'Report records updated.');
        } catch (\Exception $e) {
            DB::rollback();
            return response()->json([
                'success' => false,
                'message' => 'Failed to update records: ' . $e->getMessage()
            ], 500);
        }

        return back()->with('success', 'Report records updated.');
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
