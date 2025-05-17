<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\Password;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Auth\Events\PasswordReset;
use Illuminate\Support\Str;

class AuthController extends Controller
{
    public function showLogin()
    {
        if (Auth::check()) {
            // User is already logged in, redirect
            return redirect()->route('dashboard');
        }

        return inertia('Login/Login');
    }

    public function requestLogin(Request $request)
    {
        $validated = $request->validate([
            'email' => 'required|email',
            'password' => 'required|string'
        ]);

        $user = User::where('email', $validated['email'])->first();

        if (!$user || !Hash::check($validated['password'], $user->password)) {
            throw ValidationException::withMessages([
                'error' => 'Incorrect Credentials'
            ]);
        }

        $request->session()->regenerate();
        Auth::login($user);

        if (!isset($user->email_verified_at)) {
            return redirect()->route('verification.notice');
            // return inertia('Auth/VerifyEmail');
        }

        return redirect()->route('dashboard');
    }

    public function requestLogout(Request $request)
    {
        Auth::logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect()->route('home');
    }

    public function showForgotPassword()
    {
        return inertia('Auth/ForgotPassword');
    }

    public function handleForgotPassword(Request $request)
    {
        $request->validate(['email' => 'required|email']);

        $status = Password::sendResetLink($request->only('email'));

        return back()->with('status', __($status));
    }

    public function showResetPassword(string $token, Request $request)
    {
        $email = $request->query('email');

        if (!$email || !$token) {
            abort(404);
        }

        // Look up the record
        $record = DB::table('password_reset_tokens')->where('email', $email)->first();

        if (!$record) {
            abort(404);
        }

        // Check token validity (compare hashes)
        $isValid = Hash::check($token, $record->token);

        // Check if token expired (default: 60 minutes)
        $isExpired = Carbon::parse($record->created_at)->addMinutes(60)->isPast();

        if (!$isValid || $isExpired) {
            abort(403, 'Reset link is invalid or has expired.');
        }

        return inertia('Auth/ResetPassword', [
            'token' => $token,
            'email' => $request->query('email'),
        ]);
    }

    public function handleResetPassword(Request $request)
    {
        $request->validate([
            'token' => 'required',
            'email' => 'required|email',
            'password' => 'required|min:8|confirmed',
        ]);

        $status = Password::reset(
            $request->only('email', 'password', 'password_confirmation', 'token'),
            function ($user, $password) {
                $user->forceFill([
                    'password' => Hash::make($password),
                    'remember_token' => Str::random(60),
                ])->save();

                event(new PasswordReset($user));
            }
        );

        return $status === Password::PASSWORD_RESET
            ? redirect()->route('login')->with('status', __($status))
            : back()->withErrors(['email' => [__($status)]]);
    }
}
