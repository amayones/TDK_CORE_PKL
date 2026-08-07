<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DailyLogbook extends Model
{
    use HasFactory;

    protected $fillable = [
        'peserta_pkl_id',
        'log_date',
        'activities',
        'challenges',
        'next_plan',
        'hours_worked',
        'status',
        'reviewed_by',
        'reviewed_at',
    ];

    protected $casts = [
        'log_date' => 'date',
        'reviewed_at' => 'datetime',
    ];

    public function pesertaPkl()
    {
        return $this->belongsTo(PesertaPkl::class);
    }

    public function reviewer()
    {
        return $this->belongsTo(User::class, 'reviewed_by');
    }
}
