<?php

namespace App\Http\Controllers;

use App\Models\ReportRecord;
use App\Models\StorageResource;
use App\Models\Task;
use App\Models\TodoJob;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Support\Facades\DB;

class StorageResourceController extends Controller
{
    use AuthorizesRequests;

    private static function isValidYearMonthDay(string $value): bool
    {
        try {
            $date = Carbon::createFromFormat('!Y-m-d', $value);
            return $date && $date->format('Y-m-d') === $value;
        } catch (\Exception $e) {
            return false;
        }
    }

    public function index()
    {
        $this->authorize('viewAny', StorageResource::class);

        $tables = DB::select("SHOW TABLE STATUS");
        $users = User::all();

        $results = collect($tables)->map(function ($table) {
            return [
                'table_name' => $table->Name,
                'table_size_mb' => round(($table->Data_length + $table->Index_length) / 1024 / 1024, 2),
            ];
        })->sortByDesc('table_size_mb')->values();

        return inertia('StorageResource/StorageResource', [
            'storage_tables' => $results,
            'users' => $users
        ]);
    }

    public function handleStorageResourceAction(Request $request)
    {
        $this->authorize('update', StorageResource::class);

        $validated = $request->validate([
            'action'   => 'string',
        ]);

        switch ($validated['action']) {
            case 'cleanup-records':
                $validatedPayload = $request->validate([
                    'payload' => 'required',
                    'payload.date' => 'required',
                    'payload.users' => ['required', 'array', 'min:1'],   // must be non-empty
                    'payload.users.*.id' => ['required', 'integer', 'exists:users,id'],
                ]);

                if (!$this->isValidYearMonthDay($validatedPayload['payload']['date'])) {
                    abort(404, 'Ungültige Payload!');
                }

                $userIds = collect($validatedPayload['payload']['users'])
                    ->pluck('id')
                    ->toArray();

                $cutoffDate = Carbon::parse($validatedPayload['payload']['date']);

                // Delete tasks older than cutoff date
                // 1. Delete pivot rows for selected users on old tasks
                DB::table('task_user')
                    ->whereIn('user_id', $userIds)
                    ->whereExists(function ($query) use ($cutoffDate) {
                        $query->select(DB::raw(1))
                            ->from('tasks')
                            ->whereColumn('tasks.id', 'task_user.task_id')
                            ->where('tasks.date_start', '<', $cutoffDate->toDateString());
                    })
                    ->delete();

                // 2. After deletion, remove tasks with no remaining users
                $tasksToDelete = Task::where('date_start', '<', $cutoffDate->toDateString())
                    ->whereDoesntHave('users')
                    ->pluck('id')
                    ->toArray();

                Task::whereIn('id', $tasksToDelete)->delete();

                ReportRecord::where('date_start', '<', $cutoffDate->toDateString())
                    ->whereIn('user_id', $userIds)
                    ->delete();
                TodoJob::where('date', '<', $cutoffDate->toDateString())->delete();
                break;

            default:
                abort(400, 'Ungültige Aktion!');
                break;
        }
    }
}
