<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\TaskController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Home');
});


Route::get('/login', [AuthController::class, 'showLogin'])->name('show.login');
Route::get('/register', [AuthController::class, 'showRegister'])->name('show.register');
Route::post('/login', [AuthController::class, 'requestLogin'])->name('login');
Route::post('/register', [AuthController::class, 'requestRegister'])->name('register');

Route::middleware('auth')->group(function(){
    Route::post('/logout', [AuthController::class, 'requestLogout'])->name('logout');

    Route::get('/dashboard', function(){
        return inertia('Dashboard/Dashboard');
    })->name('dashboard');
    Route::prefix('dashboard')->name('dashboard.')->group(function () {
        Route::resource('schedule', TaskController::class);
        Route::resource('users', UserController::class)->only(['index', 'show']);
    });
});

Route::fallback(function(){
    return Inertia::render('Error', ['status'=> 404]);
});

// Route::resource('users', UserController::class);
// Route::get('/user/{id}', [UserController::class, 'show']);