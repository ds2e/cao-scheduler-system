<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TaskCategory extends Model
{
    /** @use HasFactory<\Database\Factories\TaskCategoryFactory> */
    use HasFactory;

    protected $fillable = [
        'name',
        'color'
    ];

    public function tasks()
    {
        return $this->hasMany(Task::class, 'task_category_id');
    }
}
