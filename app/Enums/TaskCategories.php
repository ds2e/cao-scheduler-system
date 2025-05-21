<?php

namespace App\Enums;

enum TaskCategories: string
{
    case Leiter = 'Leiter';
    case Bar = 'Bar';
    case Kueche = 'Küche';
    case Service = 'Service';
    case Springer = 'Springer';
    case Sonstiges = 'Sonstiges';

    public static function fromId(int $id): ?self
    {
        return match ($id) {
            1 => self::Leiter,
            2 => self::Bar,
            3 => self::Kueche,
            4 => self::Service,
            5 => self::Springer,
            6 => self::Sonstiges,
            default => null,
        };
    }

    public function color(): string
    {
        return match ($this) {
            self::Leiter => '#59168b',
            self::Bar => '#1c398e',
            self::Kueche => '#733e0a',
            self::Service => '#82181a',
            self::Springer => '#0d542b',
            self::Sonstiges => '#101828'
        };
    }
}
