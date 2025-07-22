<?php

namespace App\Http\Controllers\Api;

use App\Enums\UserRoles;
use App\Http\Controllers\Controller;
use App\Http\Resources\Api\ApiUserResource;
use App\Http\Resources\Api\ApiWorkResource;
use App\Models\ReportRecord;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class ApiWorkController extends Controller
{
    public function index(Request $request)
    {
        $authHeader = $request->header('Authorization');

        if (!$authHeader || !Str::startsWith($authHeader, 'Bearer ') || Str::after($authHeader, 'Bearer ') !== base64_encode(config('app.work_api_key'))) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        // if ($request->query('key') !== base64_encode(config('app.work_api_key'))) {
        //     return response()->json(['error' => 'Unauthorized'], 401);
        // }

        // MasterPassword hardcoded, should be implement to be changable by Admin/SuperAdmin
        $masterPassword = 'D0nn3rB@lk3n';
        $hashedMasterPassword = Hash::make($masterPassword);
        $masterData = [
            'password' => $hashedMasterPassword,
        ];

        $today = Carbon::today()->toDateString();
        $users = User::whereIn('role_id', UserRoles::taskAssignable())->get();
        // Eager load tasks for today to reduce DB hits
        $users->load(['tasks' => function ($query) use ($today) {
            $query->whereDate('date_start', $today);
        }]);

        return response()->json([
            'users' => ApiUserResource::collection($users),
            'master' => $masterData,
        ]);
    }

    public function store(Request $request)
    {
        $authHeader = $request->header('Authorization');

        if (!$authHeader || !Str::startsWith($authHeader, 'Bearer ') || Str::after($authHeader, 'Bearer ') !== base64_encode(config('app.work_api_key'))) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        // if ($request->query('key') !== base64_encode(config('app.work_api_key'))) {
        //     return response()->json(['error' => 'Unauthorized'], 401);
        // }

        $mainValidator = Validator::make($request->all(), [
            'dayRecords' => 'required|array',
            'date' => 'required|date'
        ]);

        if ($mainValidator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $mainValidator->errors()
            ], 422);
        }

        $recordDate = Carbon::parse($request->input('date'))->format('d/m/Y');
        $saved = [];
        $failed = [];

        DB::beginTransaction();

        try {
            foreach ($request->input('dayRecords') as $index => $record) {
                $validator = Validator::make($record, [
                    'id' => 'required|integer',
                    'user_id'    => 'required|integer|exists:users,id',
                    'date'       => 'required|date',
                    'time_start' => 'required|date_format:H:i:s',
                    'time_end'   => 'required|date_format:H:i:s|after:time_start',
                    'status'     => 'required|string',
                    'duration'   => 'required|integer|min:0',
                    'notice'     => 'nullable|string',
                ]);

                if ($validator->fails()) {
                    $failed[] = [
                        'record' => $record,
                        'errors' => $validator->errors()->all()
                    ];
                    continue;
                }

                if ($record['status'] !== 'Uncommitted') {
                    continue; // Skip committed entries
                }

                try {
                    $savedRecord = ReportRecord::create([
                        'user_id'    => $record['user_id'],
                        'date'       => $record['date'],
                        'time_start' => $record['time_start'],
                        'time_end'   => $record['time_end'],
                        'duration'   => $record['duration'],
                        'notice'     => $record['notice'],
                    ]);
                    $saved[] = [
                        'id' => $record['id'] ?? null,
                        'user_id' => $savedRecord->user_id,
                        'date' => $savedRecord->date,
                    ];
                } catch (\Exception $e) {
                    $failed[] = [
                        'record' => $record,
                        'errors' => ['Database error: ' . $e->getMessage()]
                    ];
                }
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => "Processed records for $recordDate.",
                'saved'   => $saved,
                'failed'  => $failed
            ], 200);
        } catch (\Exception $e) {
            DB::rollBack();

            return response()->json([
                'success' => false,
                'error'   => 'Transaction failed: ' . $e->getMessage()
            ], 500);
        }
    }
}
