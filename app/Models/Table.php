<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Table extends Model
{
    /** @use HasFactory<\Database\Factories\TableFactory> */
    use HasFactory;

    public $timestamps = false;

    protected $connection = 'mysql_waiter';

    protected $fillable = [
        'type',
        'name',
    ];

    public function orders()
    {
        return $this->hasMany(Order::class);
    }
}
