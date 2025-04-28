<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Routing\Controller;

class UserController extends Controller
{
    use AuthorizesRequests; // <-- THIS LINE!

    public function index(){
        $users = User::latest()->get();
        return inertia('Users/Users', [
            'users' => $users
        ]);
    }
    /**
     * Show the profile for a given user.
     */
    public function show(User $user)
    {
        $this->authorize('view', $user);
        $user = User::findOrFail($user->id);
        return inertia('Users/Index/Index', [
            'user' => $user
        ]);
    }

    public function store(Request $request){
        dd($request);
    }
}
