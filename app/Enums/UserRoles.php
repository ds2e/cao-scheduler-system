<?php

namespace App\Enums;

enum UserRoles: string
{
    case Mitarbeiter = 'Mitarbeiter';
    case Moderator = 'Moderator';
    case Admin = 'Admin';
    case SuperAdmin = 'Super Admin';

    public static function fromId(int $id): ?self
    {
        return match ($id) {
            1 => self::Mitarbeiter,
            2 => self::Moderator,
            3 => self::Admin,
            4 => self::SuperAdmin,
            default => null,
        };
    }

    public function rank(): int
    {
        return match ($this) {
            self::Mitarbeiter => 1,
            self::Moderator => 2,
            self::Admin => 3,
            self::SuperAdmin => 4,
        };
    }

    public static function taskAssignable(): array
    {
        return array_map(
            fn(self $role) => $role->rank(),
            array_filter(self::cases(), fn(self $role) => $role !== self::SuperAdmin)
        );
    }

    public function requiresConfirmation(): bool
    {
        return in_array($this, [self::Admin, self::SuperAdmin], true);
    }
}
