<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Bill extends Model
{
    /** @use HasFactory<\Database\Factories\BillFactory> */
    use HasFactory;

    protected $fillable = [
        'order_id'
    ];

    public function order()
    {
        return $this->belongsTo(Order::class);
    }

    public function billItems()
    {
        return $this->hasMany(BillItem::class);
    }
}
