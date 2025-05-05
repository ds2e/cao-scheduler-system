<?php

namespace App\Http\Controllers;

use App\Enums\UserRoles;
use App\Models\Role;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function showRegister()
    {
        return inertia('Register/Register');
    }

    public function showLogin()
    {
        if (Auth::check()) {
            // User is already logged in, redirect
            return redirect()->route('dashboard');
        }

        return inertia('Login/Login');
    }

    public function requestRegister(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users',
            'password' => 'required|string|min:8|confirmed'
        ]);

        $validated['password'] = Hash::make($validated['password']);
        $validated['role_id'] = Role::where('name', UserRoles::Mitarbeiter->value)->first()->id;

        $user = User::create($validated);

        Auth::login($user);

        return redirect()->route('dashboard');
    }

    public function requestLogin(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required|string'
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'error' => 'Incorrect Credentials'
            ]);
        }

        $request->session()->regenerate();
        Auth::login($user);

        return redirect()->route('dashboard');
    }

    public function requestLogout(Request $request)
    {
        Auth::logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect()->route('show.login');
    }
}
