<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TodoJob extends Model
{
    /** @use HasFactory<\Database\Factories\TodoJobFactory> */
    use HasFactory;

    protected $fillable = [
        'date',
        'notice',
        'todo_id'
    ];

    public function todo()
    {
        return $this->belongsTo(Todo::class, 'todo_id');
    }
}
