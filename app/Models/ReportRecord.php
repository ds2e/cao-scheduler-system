<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ReportRecord extends Model
{
    /** @use HasFactory<\Database\Factories\ReportRecordFactory> */
    use HasFactory;

    protected $fillable = [
        'user_id',
        'date',
        'time_start',
        'time_end',
        'duration',
        'notice'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
