<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Item extends Model
{
    /** @use HasFactory<\Database\Factories\ItemFactory> */
    use HasFactory;

    protected $connection = 'mysql_waiter';

    protected $fillable = [
        'code',
        'name',
        'price',
        'class',
        'sub_category_id'
    ];

    public function subCategory()
    {
        return $this->belongsTo(SubCategory::class, 'sub_category_id');
    }
}
