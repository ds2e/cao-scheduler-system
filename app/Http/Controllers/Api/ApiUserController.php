<?php

namespace App\Http\Controllers\Api;

use Illuminate\Routing\Controller;
use App\Http\Resources\Api\ApiUserResource;
use App\Models\User;
use Illuminate\Http\Request;

class ApiUserController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:sanctum')->except(['index']);
        $this->authorizeResource(User::class, 'user');
    }

    public function index()
    {
        $users = User::all();
        return ApiUserResource::collection($users);
    }

    /**
     * Show the profile for a given user.
     */
    public function show(string $id)
    {
        $user = User::findOrFail($id);
        return new ApiUserResource($user);
    }

        /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

        /**
     * Show the form for editing the specified resource.
     */
    public function edit(User $user)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, User $user)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(User $user)
    {
        //
    }
}
