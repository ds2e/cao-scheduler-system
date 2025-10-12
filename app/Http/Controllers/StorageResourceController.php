<?php

namespace App\Http\Controllers;

use App\Models\ReportRecord;
use App\Models\StorageResource;
use App\Models\Task;
use App\Models\TodoJob;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Support\Facades\DB;

class StorageResourceController extends Controller
{
    use AuthorizesRequests;

    public function index()
    {
        $this->authorize('viewAny', StorageResource::class);

        $tables = DB::select("SHOW TABLE STATUS");

        $results = collect($tables)->map(function ($table) {
            return [
                'table_name' => $table->Name,
                'table_size_mb' => round(($table->Data_length + $table->Index_length) / 1024 / 1024, 2),
            ];
        })->sortByDesc('table_size_mb')->values();

        return inertia('StorageResource/StorageResource', [
            'storage_tables' => $results
        ]);
    }

    public function handleStorageResourceAction(Request $request)
    {
        $this->authorize('update', StorageResource::class);

        $validated = $request->validate([
            'action'   => 'string'
        ]);

        switch ($validated['action']) {
            case 'cleanup-records':
                // Get today's date minus 3 days
                $cutoffDate = Carbon::today()->subDays(3);

                // Delete tasks older than cutoff date
                Task::where('date_start', '<', $cutoffDate->toDateString())->delete();
                ReportRecord::where('date', '<', $cutoffDate->toDateString())->delete();
                TodoJob::where('date', '<', $cutoffDate->toDateString())->delete();
                break;

            default:
                abort(400, 'Ungültige Aktion!');
                break;
        }
    }
}
