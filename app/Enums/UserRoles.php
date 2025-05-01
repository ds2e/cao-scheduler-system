<?php

namespace App\Enums;

enum UserRoles: string
{
    case User = 'User';
    case Admin = 'Admin';
    case SuperAdmin = 'Super Admin';

    public static function fromId(int $id): ?self
    {
        return match ($id) {
            1 => self::User,
            2 => self::Admin,
            3 => self::SuperAdmin,
            default => null,
        };
    }

    public function rank(): int
    {
        return match ($this) {
            self::User => 1,
            self::Admin => 2,
            self::SuperAdmin => 3,
        };
    }
}
