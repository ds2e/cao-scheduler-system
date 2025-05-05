<?php

namespace App\Policies;

use App\Enums\UserRoles;
use App\Models\User;

class SchedulePolicy
{
    /**
     * Create a new policy instance.
     */
    public function __construct()
    {
        //
    }

    public function viewAny(User $user): bool
    {
        return in_array($user->role?->name, [
            UserRoles::Moderator->value,
            UserRoles::Admin->value,
            UserRoles::SuperAdmin->value,
        ]);
    }

    public function update(User $user): bool
    {
        return in_array($user->role?->name, [
            UserRoles::Moderator->value,
            UserRoles::Admin->value,
            UserRoles::SuperAdmin->value,
        ]);
    }
}
