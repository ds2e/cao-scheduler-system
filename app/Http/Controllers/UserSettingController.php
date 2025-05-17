<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

class UserSettingController extends Controller
{
    use AuthorizesRequests;

    public function displayUserSetting(Request $request){
        $this->authorize('view', User::class);
    }
}
