<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Auth\Events\PasswordReset;
use Illuminate\Http\Request;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Str;

class UserSettingController extends Controller
{
    use AuthorizesRequests;

    public function displayUserSetting(Request $request)
    {
        return inertia('Setting/Setting');
    }

    public function displayUserSettingSecurity(Request $request)
    {
        return inertia('Setting/Security/Security');
    }

    public function handleUserSettingSecurityChangePassword(Request $request)
    {
        $validated = Validator::make($request->all(), [
            'targetData.email' => 'required|email|exists:users,email',
            'targetData.password' => 'required|string|min:8|confirmed',
            'authorData.id' => 'required|exists:users,id'
        ], [
            'targetData.email.*' => 'Credential Mismatch',

            'targetData.password.required' => 'Password is required.',
            'targetData.password.string' => 'Password must be a valid string.',
            'targetData.password.min' => 'Password must be at least 8 characters long.',
            'targetData.password.confirmed' => 'Password confirmation does not match.',

            'authorData.*' => 'Credential Mismatch',
        ])->validate();

        $user = User::find($validated['authorData']['id']);
        if (!$user || $user->email !== $validated['targetData']['email']) {
            throw ValidationException::withMessages([
                'error' => 'Credential Mismatch'
            ]);
        }

        // Manual password reset (no token)
        $user->forceFill([
            'password' => Hash::make($validated['targetData']['password']),
            'remember_token' => Str::random(60),
        ])->save();

        event(new PasswordReset($user));

        return back()->with('success', 'Password updated successfully.');
    }
}
