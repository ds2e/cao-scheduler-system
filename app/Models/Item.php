<?php

namespace App\Models;

use App\Enums\ItemTypes;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Item extends Model
{
    /** @use HasFactory<\Database\Factories\ItemFactory> */
    use HasFactory;

    public $timestamps = false;

    protected $connection = 'mysql_waiter';

    protected $fillable = [
        'id',
        'code',
        'name',
        'price',
        'item_class',
        'type',
        'category_id'
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'type' => ItemTypes::class,
    ];

    protected static function booted()
    {
        static::addGlobalScope('ordered', function ($query) {
            $query->orderBy('code')
                ->orderByRaw("name COLLATE utf8mb4_unicode_ci ASC");
        });
    }

    public function category()
    {
        return $this->belongsTo(Category::class, 'category_id');
    }

    public function itemClass()
    {
        return $this->belongsTo(ItemClass::class, 'item_class');
    }

    public function orderItems()
    {
        return $this->hasMany(OrderItem::class);
    }
}
