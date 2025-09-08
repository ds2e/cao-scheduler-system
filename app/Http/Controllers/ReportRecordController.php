<?php

namespace App\Http\Controllers;

use App\Enums\UserRoles;
use App\Models\ReportRecord;
use App\Http\Requests\StoreReportRecordRequest;
use App\Http\Requests\UpdateReportRecordRequest;
use App\Models\User;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ReportRecordController extends Controller
{
    use AuthorizesRequests;
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $validated = $request->validate([
            'userID'   => 'nullable|integer|exists:users,id',
            'interval' => 'nullable|integer',
        ]);
        // Get role ranks that can be assigned tasks
        $users = User::whereIn('role_id', UserRoles::taskAssignable())->get();

        // Try to get parameters from request
        if(isset($validated['interval'])){
            $year = (int) ($validated['interval']);
        }
        else {
            $year = now()->year;
        }

        // Fallback user: first user that is task-assignable
        if (!isset($validated['userID'])) {
            if (count($users) <= 0) {
                abort(404, 'No eligible users found.');
            }
            $fallbackUser = $users[0];

            $userId = $fallbackUser->id;
        }
        else {
            $userId = $validated['userID'];
        }

        // --- TASKS (via pivot table) ---
        $tasks = DB::table('tasks')
            ->join('task_user', 'tasks.id', '=', 'task_user.task_id')
            ->select(
                DB::raw('MONTH(tasks.date_start) as month'),
                DB::raw('SUM(TIMESTAMPDIFF(SECOND, CONCAT(tasks.date_start, " ", tasks.time_start), CONCAT(tasks.date_end, " ", tasks.time_end))) / 3600 as total_hours')
            )
            ->where('task_user.user_id', $userId)
            ->whereYear('tasks.date_start', $year)
            ->groupBy('month')
            ->orderBy('month')
            ->get()
            ->pluck('total_hours', 'month')
            ->toArray();

        // --- RECORDS (direct user_id) ---
        $records = DB::table('report_records')
            ->select(
                DB::raw('MONTH(date) as month'),
                DB::raw('SUM(duration) / 3600 as total_hours')
            )
            ->where('user_id', $userId)
            ->whereYear('date', $year)
            ->groupBy('month')
            ->orderBy('month')
            ->get()
            ->pluck('total_hours', 'month')
            ->toArray();

        // --- Ensure all 12 months are present ---
        $months = collect(range(1, 12))->mapWithKeys(function ($m) use ($tasks, $records) {
            return [
                $m => [
                    'tasks_hours'   => $tasks[$m]   ?? 0,
                    'records_hours' => $records[$m] ?? 0,
                ]
            ];
        });

        return inertia('Records/Records', [
            'users' => $users,
            'user'    => User::findOrFail($userId),
            'year'    => (int) $year,
            'months'  => $months,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreReportRecordRequest $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(ReportRecord $reportRecord)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(ReportRecord $reportRecord)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateReportRecordRequest $request, ReportRecord $reportRecord)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(ReportRecord $reportRecord)
    {
        //
    }
}
