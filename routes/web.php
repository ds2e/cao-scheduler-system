<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\ItemController;
use App\Http\Controllers\MasterController;
use App\Http\Controllers\ReportRecordController;
use App\Http\Controllers\ReservationController;
use App\Http\Controllers\RestaurantMenuController;
use App\Http\Controllers\ScheduleController;
use App\Http\Controllers\StorageResourceController;
use App\Http\Controllers\TableController;
use App\Http\Controllers\TodoController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\UserSettingController;
use App\Http\Controllers\WorkController;
use App\Models\TaskCategory;
use Illuminate\Http\Request as HttpRequest;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Models\User;
use Illuminate\Auth\Events\Verified;

Route::get('/', function () {
    return Inertia::render('Home');
})->name('home');

// Route::get('/maintainance', function () {
//     return Inertia::render('Maintainance');
// })->name('maintainance');

Route::get('/login', [AuthController::class, 'showLogin'])->name('login');
Route::post('/login', [AuthController::class, 'requestLogin'])->middleware('throttle:5,1')->name('request.login');

Route::middleware('auth')->group(function () {
    Route::post('/logout', [AuthController::class, 'requestLogout'])->name('logout');
    Route::middleware('verified')->group(function () {
        Route::get('/dashboard', [UserController::class, 'handleRoleBasedView'])->name('dashboard');
        Route::prefix('dashboard')->name('dashboard.')->group(function () {

            // Admin Route for managing resources
            Route::prefix('manage')->name('manage.')->group(function () {
                Route::resource('users', UserController::class)->except(['create', 'edit', 'show']);
                Route::resource('todos', TodoController::class)->except(['create', 'edit', 'show']);
                Route::prefix('menu')->name('menu.')->group(function () {
                    Route::get('/', function () {
                        return redirect('/dashboard/manage/menu/items');
                    });

                    Route::resource('items', ItemController::class)->except(['create', 'edit', 'show']);
                    Route::resource('categories', CategoryController::class)->except(['create', 'edit', 'show']);
                    Route::resource('tables', TableController::class)->except(['create', 'edit', 'show']);
                    // Route::any('{any}', function () {
                    //     return Inertia::render('Maintainance');
                    // })->where('any', '.*');
                });
                Route::resource('records', ReportRecordController::class)->except(['create', 'edit', 'show']);
                Route::resource('devices', MasterController::class)->except(['create', 'edit', 'show']);
                // Route::resource('taskCategories', TaskCategory::class)->except(['create', 'edit', 'show']);

                // Super Admin Route for managing storage and database
                Route::get('storage', [StorageResourceController::class, 'index']);
                Route::post('storage', [StorageResourceController::class, 'handleStorageResourceAction']);
            });

            // Profile
            Route::get('profile/{user}', [UserController::class, 'show'])->name('show.profile');

            // Schedule + TodoJob
            Route::get('schedule', [ScheduleController::class, 'handleScheduleRoleBasedView'])->name('show.schedule');
            Route::post('schedule', [ScheduleController::class, 'updateSchedule'])->name('update.schedule');
            Route::post('schedule/todo', [ScheduleController::class, 'updateScheduleTodoJob'])->name('update.schedule.todoJob');
            Route::post('schedule/report', [ScheduleController::class, 'updateReportRecords'])->name('update.schedule.report');

            // Reservation
            Route::resource('reservation', ReservationController::class)->except(['create', 'edit', 'show']);

            // User Setting
            // Route::get('setting', [UserSettingController::class, 'displayUserSetting'])->name('show.setting');
            Route::get('setting/security', [UserSettingController::class, 'displayUserSettingSecurity'])->name('show.setting.security');
            Route::post('setting/security/reset-password', [UserSettingController::class, 'handleUserSettingSecurityChangePassword'])->middleware('throttle:5,1')->name('update.setting.security.password');
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
    })->middleware('throttle:5,1')->name('verification.send');
});

Route::get('/dQ7mZ-pT9wKx2jR~aY3nF_6Ls', [WorkController::class, 'show'])->name('show.workHome');
Route::post('/dQ7mZ-pT9wKx2jR~aY3nF_6Ls/login', [WorkController::class, 'loginWork'])->name('login.work');
Route::post('/dQ7mZ-pT9wKx2jR~aY3nF_6Ls/logout', [WorkController::class, 'logoutWork'])->name('logout.work');
Route::get('/dQ7mZ-pT9wKx2jR~aY3nF_6Ls/work', [WorkController::class, 'showWork'])->name('show.work');

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
