<?php

namespace App\Enums;

enum TaskCategories: string
{
    case Bar = 'Bar';
    case Kueche = 'Küche';
    case Service = 'Service';
    case Springer = 'Springer';
    case Sonstiges = 'Sonstiges';

    public static function fromId(int $id): ?self
    {
        return match ($id) {
            1 => self::Bar,
            2 => self::Kueche,
            3 => self::Service,
            4 => self::Springer,
            5 => self::Sonstiges,
            default => null,
        };
    }
}
