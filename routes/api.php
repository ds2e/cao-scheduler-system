<?php

use App\Http\Controllers\Api\ApiAuthController;
use App\Http\Controllers\Api\ApiUserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::post('/login', [ApiAuthController::class, 'login']);
Route::post('/logout', [ApiAuthController::class, 'logout'])->middleware('auth:sanctum');

Route::apiResource('users', ApiUserController::class);

// Route::middleware('auth:sanctum')->group(function(){
//     Route::get('/dashboard', function(){
//         return inertia('Dashboard/Dashboard');
//     })->name('dashboard');
//     Route::resource('users',UserController::class);
// });
