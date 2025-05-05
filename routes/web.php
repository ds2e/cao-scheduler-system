<?php

use App\Enums\UserRoles;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ScheduleController;
use App\Http\Controllers\TaskController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Home');
});


Route::get('/login', [AuthController::class, 'showLogin'])->name('show.login');
Route::get('/register', [AuthController::class, 'showRegister'])->name('show.register');
Route::post('/login', [AuthController::class, 'requestLogin'])->name('login');
Route::post('/register', [AuthController::class, 'requestRegister'])->name('register');

Route::middleware('auth')->group(function () {
    
    Route::post('/logout', [AuthController::class, 'requestLogout'])->name('logout');

    Route::get('/dashboard', function () {
        $user = Auth::user();
        $role = UserRoles::fromId($user->role_id);
        return match ($role) {
            UserRoles::Mitarbeiter => Inertia::render('Dashboard/UserDashboard'),
            UserRoles::Moderator => Inertia::render('Dashboard/AdminDashboard'),
            UserRoles::Admin => Inertia::render('Dashboard/AdminDashboard'),
            UserRoles::SuperAdmin => Inertia::render('Dashboard/AdminDashboard'),
            default => Inertia::render('Error', ['status' => 406]),
        };
    })->name('dashboard');
    Route::prefix('dashboard')->name('dashboard.')->group(function () {
        Route::get('schedule', [ScheduleController::class, 'handleRoleBasedView'])->name('show.schedule');
        Route::post('schedule', [ScheduleController::class, 'updateSchedule'])->name('update.schedule');
        // Route::resource('tasks', TaskController::class)->only(['update']);
        Route::resource('users', UserController::class)->except(['create', 'edit']);
    });
});

Route::fallback(function () {
    return Inertia::render('Error', ['status' => 404]);
});
