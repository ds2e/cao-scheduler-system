<?php

namespace App\Policies;

use App\Models\StorageResource;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class StorageResourcePolicy
{
    /**
     * Create a new policy instance.
     */
    public function viewAny(User $user): Response
    {
        if ($user->isSuperAdmin()) {
            return Response::allow();
        }

        return Response::denyWithStatus(403);
    }

    public function update(User $user): Response
    {
        if ($user->isSuperAdmin()) {
            return Response::allow();
        }

        return Response::denyWithStatus(403);
    }
}
