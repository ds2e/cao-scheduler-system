<?php

use App\Enums\UserRoles;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ScheduleController;
use App\Http\Controllers\TaskController;
use App\Http\Controllers\TodoController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\UserSettingController;
use App\Models\TaskCategory;
use Illuminate\Foundation\Auth\EmailVerificationRequest;
use Illuminate\Http\Request as HttpRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Models\User;
use Illuminate\Auth\Events\Verified;

Route::get('/', function () {
    return Inertia::render('Home');
})->name('home');

Route::get('/login', [AuthController::class, 'showLogin'])->name('login');
Route::post('/login', [AuthController::class, 'requestLogin'])->name('request.login');

Route::middleware('auth')->group(function () {
    Route::post('/logout', [AuthController::class, 'requestLogout'])->name('logout');
    Route::middleware('verified')->group(function () {
        Route::get('/dashboard', function () {
            $user = Auth::user();
            $role = UserRoles::fromId($user->role_id);
            return match ($role) {
                UserRoles::Mitarbeiter => Inertia::render('Dashboard/UserDashboard'),
                UserRoles::Moderator => Inertia::render('Dashboard/UserDashboard'),
                UserRoles::Admin => Inertia::render('Dashboard/AdminDashboard'),
                UserRoles::SuperAdmin => Inertia::render('Dashboard/AdminDashboard'),
                default => Inertia::render('Error', ['status' => 406]),
            };
        })->name('dashboard');
        Route::prefix('dashboard')->name('dashboard.')->group(function () {
            Route::get('schedule', [ScheduleController::class, 'handleRoleBasedView'])->name('show.schedule');
            Route::post('schedule', [ScheduleController::class, 'updateSchedule'])->name('update.schedule');
            Route::post('schedule/todo', [ScheduleController::class, 'updateScheduleTodoJob'])->name('update.schedule.todoJob');
            // Route::resource('tasks', TaskController::class)->only(['update']);
            Route::prefix('manage')->name('manage.')->group(function () {
                Route::resource('users', UserController::class)->except(['create', 'edit', 'show']);
                Route::resource('todos', TodoController::class)->except(['create', 'edit', 'show']);
                Route::resource('taskCategories', TaskCategory::class)->except(['create', 'edit', 'show']);
            });
            Route::get('profile/{user}', [UserController::class, 'show'])->name('show.profile');
            Route::get('setting', [UserSettingController::class, 'displayUserSetting'])->name('show.setting');
        });
    });

    // Show verification page only if NOT verified
    Route::get('/email/verify', function (HttpRequest $request) {
        if ($request->user()->hasVerifiedEmail()) {
            return redirect()->route('dashboard');
        }

        return Inertia::render('Auth/VerifyEmail');
    })->name('verification.notice');

    // Resend verification email only if NOT verified
    Route::post('/email/verification-notification', function (HttpRequest $request) {
        if ($request->user()->hasVerifiedEmail()) {
            return redirect()->route('dashboard');
        }

        $request->user()->sendEmailVerificationNotification();

        return back()->with('status', 'verification-link-sent');
    })->middleware('throttle:6,1')->name('verification.send');
});

// Custom Handle verification links
Route::get('/email/verify/{id}/{hash}', function ($id, $hash) {
    $user = User::findOrFail($id);

    // Check hash is valid
    if (!hash_equals((string) $hash, sha1($user->getEmailForVerification()))) {
        abort(403, 'Invalid verification link.');
    }

    // Mark as verified if not already
    if (!$user->hasVerifiedEmail()) {
        $user->markEmailAsVerified();
        event(new Verified($user));
    }

    return redirect()->route('login')->with('success', 'Email verified. You can now log in.');
})->middleware('signed')->name('verification.verify');


// Request reset form
Route::get('/forgot-password', [AuthController::class, 'showForgotPassword'])->name('password.request');

// Submit email to get reset link
Route::post('/forgot-password', [AuthController::class, 'handleForgotPassword'])->middleware('throttle:5,1')->name('password.email');

// Reset form (with token from email)
Route::get('/reset-password/{token}', [AuthController::class, 'showResetPassword'])->name('password.reset');

// Submit new password
Route::post('/reset-password', [AuthController::class, 'handleResetPassword'])->middleware('throttle:5,1')->name('password.update');


// 404 Page
Route::fallback(function () {
    return Inertia::render('Error', ['status' => 404]);
});
