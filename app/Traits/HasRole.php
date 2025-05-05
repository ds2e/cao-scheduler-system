<?php
namespace App\Traits;

use App\Enums\UserRoles;
use App\Models\Role;

trait HasRole
{
    public function hasRole(UserRoles $role): bool
    {
        return $this->role?->name === $role->value;
    }

    public function isAdmin(): bool
    {
        return $this->hasRole(UserRoles::Moderator) || $this->hasRole(UserRoles::Admin) || $this->hasRole(UserRoles::SuperAdmin);
    }

    public function isSuperAdmin(): bool
    {
        return $this->hasRole(UserRoles::SuperAdmin);
    }

    /**
     * RANKING System
     * using for Ranking traverse check
     * Suppose to be other trait but ok...
     */
    public function isHigherRank(UserRoles $user_role, UserRoles $target_role){
        return $user_role->rank() > $target_role->rank();
    }

    public function isLowerRank(UserRoles $user_role, UserRoles $target_role){
        return $user_role->rank() < $target_role->rank();
    }

    public function isEqualRank(UserRoles $user_role, UserRoles $target_role){
        return $user_role->rank() == $target_role->rank();
    }
}