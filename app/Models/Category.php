<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    /** @use HasFactory<\Database\Factories\CategoryFactory> */
    use HasFactory;

    public $timestamps = false;

    protected $connection = 'mysql_waiter'; // since you’re using a custom connection

    protected $fillable = [
        'name',
        'icon',
        'priority',
        'sub_category_from',
    ];

    // Parent category (belongsTo itself)
    public function parent()
    {
        return $this->belongsTo(Category::class, 'sub_category_from');
    }

    // Subcategories (hasMany of itself)
    public function subcategories()
    {
        return $this->hasMany(Category::class, 'sub_category_from');
    }

    public function items()
    {
        return $this->hasMany(Item::class, 'category_id');
    }
}
