<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SubCategory extends Model
{
    /** @use HasFactory<\Database\Factories\SubCategoryFactory> */
    use HasFactory;

    protected $connection = 'mysql_waiter';

    protected $fillable = [
        'name',
        'color',
        'category_id'
    ];

    public function category()
    {
        return $this->belongsTo(Category::class, 'category_id');
    }

    public function items()
    {
        return $this->hasMany(Item::class, 'sub_category_id');
    }
}
