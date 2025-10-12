<?php

namespace App\Enums;

enum OrderStatuses: string
{
    case Preparing = 'Preparing';
    case Served = 'Served';
    case Paid = 'Paid';
}
