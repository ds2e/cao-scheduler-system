<?php

namespace App\Http\Controllers\Api;

use App\Enums\UserRoles;
use App\Http\Controllers\Controller;
use App\Http\Resources\Api\ApiUserResource;
use App\Http\Resources\Api\ApiWorkResource;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class ApiWorkController extends Controller
{
    public function index(Request $request)
    {
        if ($request->query('key') !== base64_encode(config('app.work_api_key'))) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        $masterPassword = 'ADMINcaoleipzigde1996';
        $hashedMasterPassword = Hash::make($masterPassword);

        $users = User::whereIn('role_id', UserRoles::taskAssignable())->get();
        $masterData = [
            'password' => $hashedMasterPassword,
        ];

        return response()->json([
            'users' => ApiUserResource::collection($users),
            'master' => $masterData,
        ]);
    }

    public function store(Request $request)
    {
        if ($request->query('key') !== base64_encode(config('app.work_api_key'))) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        // Validate request 
    }
}
