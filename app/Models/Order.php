<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Enums\OrderStatuses;

class Order extends Model
{
    /** @use HasFactory<\Database\Factories\OrderFactory> */
    use HasFactory;

    protected $fillable = [
        'table_id',
        'status'
    ];

    protected $casts = [
        'status' => OrderStatuses::class,
    ];

    public function table()
    {
        return $this->belongsTo(Table::class);
    }

    public function orderItems()
    {
        return $this->hasMany(OrderItem::class);
    }

    public function bills()
    {
        return $this->hasMany(Bill::class);
    }
}
