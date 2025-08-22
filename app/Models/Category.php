<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    /** @use HasFactory<\Database\Factories\CategoryFactory> */
    use HasFactory;

    protected $connection = 'mysql_waiter';

    protected $fillable = [
        'name',
        'icon',
        'priority'
    ];

    public function subCategories()
    {
        return $this->hasMany(SubCategory::class, 'category_id');
    }
}
