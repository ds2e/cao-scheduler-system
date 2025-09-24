<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ItemClass extends Model
{
    /** @use HasFactory<\Database\Factories\ItemClassFactory> */
    use HasFactory;

    public $timestamps = false;

    protected $connection = 'mysql_waiter';

    protected $fillable = [
        'name',
        'rate'
    ];

    protected $casts = [
        'rate' => 'decimal:2',
    ];

    public function items()
    {
        return $this->hasMany(Item::class, 'item_class');
    }
}
