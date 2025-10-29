<?php

namespace App\Http\Controllers;

use App\Enums\UserRoles;
use App\Models\ReportRecord;
use App\Http\Requests\StoreReportRecordRequest;
use App\Http\Requests\UpdateReportRecordRequest;
use App\Models\User;
use Carbon\Carbon;
use Carbon\CarbonPeriod;
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

        // Determine year
        $year = isset($validated['interval']) ? (int) $validated['interval'] : now()->year;

        // Determine user ID (fallback to first assignable)
        if (!isset($validated['userID'])) {
            if ($users->isEmpty()) {
                abort(404, 'No eligible users found.');
            }
            $userId = $users->first()->id;
        } else {
            $userId = $validated['userID'];
        }

        // --- Monthly aggregates (existing logic) ---
        $tasks = DB::table('tasks')
            ->join('task_user', 'tasks.id', '=', 'task_user.task_id')
            ->select(
                DB::raw('MONTH(tasks.date_start) as month'),
                DB::raw('SUM(TIMESTAMPDIFF(SECOND, CONCAT(tasks.date_start, " ", tasks.time_start), CONCAT(tasks.date_end, " ", tasks.time_end))) / 3600 as total_hours')
            )
            ->where('task_user.user_id', $userId)
            ->whereYear('tasks.date_start', $year)
            ->groupBy('month')
            ->pluck('total_hours', 'month')
            ->toArray();

        $records = DB::table('report_records')
            ->select(
                DB::raw('MONTH(date_start) as month'),
                DB::raw('SUM(duration) / 3600 as total_hours')
            )
            ->where('user_id', $userId)
            ->whereYear('date_start', $year)
            ->groupBy('month')
            ->pluck('total_hours', 'month')
            ->toArray();

        // --- Daily breakdowns ---
        $dailyTasks = DB::table('tasks')
            ->join('task_user', 'tasks.id', '=', 'task_user.task_id')
            ->select(
                'tasks.date_start as date',
                DB::raw('SUM(TIMESTAMPDIFF(SECOND, CONCAT(tasks.date_start, " ", tasks.time_start), CONCAT(tasks.date_end, " ", tasks.time_end))) / 3600 as total_hours')
            )
            ->where('task_user.user_id', $userId)
            ->whereYear('tasks.date_start', $year)
            ->groupBy('tasks.date_start')
            ->pluck('total_hours', 'date')
            ->toArray();

        $dailyRecords = DB::table('report_records')
            ->select('date_start', DB::raw('SUM(duration) / 3600 as total_hours'))
            ->where('user_id', $userId)
            ->whereYear('date_start', $year)
            ->groupBy('date_start')
            ->pluck('total_hours', 'date_start')
            ->toArray();

        // --- Build months structure ---
        $months = collect(range(1, 12))->map(function ($monthNum) use ($year, $tasks, $records, $dailyTasks, $dailyRecords) {
            // Carbon period for each day in the month
            $days = CarbonPeriod::create("{$year}-{$monthNum}-01", now()->setYear($year)->month($monthNum)->endOfMonth());

            // German month name
            $monthName = Carbon::createFromDate($year, $monthNum, 1)
                ->locale('de')
                ->translatedFormat('F'); // e.g. "Januar"

            // Build daily details
            $details = collect($days)->map(function (Carbon $day) use ($dailyTasks, $dailyRecords) {
                $dateStr = $day->format('Y-m-d');
                return [
                    'dateString'   => $day->format('d.m.Y'),
                    'task_hours'   => (float) ($dailyTasks[$dateStr] ?? 0),
                    'record_hours' => (float) ($dailyRecords[$dateStr] ?? 0),
                ];
            })->values();

            return [
                'monthName'    => $monthName,
                'tasks_hours'  => round((float) ($tasks[$monthNum] ?? 0), 2),
                'records_hours' => round((float) ($records[$monthNum] ?? 0), 2),
                'details'      => $details,
            ];
        })->values();

        return inertia('Records/Records', [
            'users'  => $users,
            'user'   => User::findOrFail($userId),
            'year'   => (int) $year,
            'months' => $months,
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
