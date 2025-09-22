<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Item extends Model
{
    /** @use HasFactory<\Database\Factories\ItemFactory> */
    use HasFactory;

    public $timestamps = false;

    protected $connection = 'mysql_waiter';

    protected $fillable = [
        'code',
        'name',
        'price',
        'class',
        'category_id'
    ];

    protected $casts = [
        'price' => 'decimal:2',
    ];

    public function category()
    {
        return $this->belongsTo(Category::class, 'category_id');
    }
}
