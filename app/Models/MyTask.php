<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MyTask extends Model
{
    use HasFactory;

    protected $fillable = [
        'peserta_pkl_id',
        'task_assignment_id',
        'title',
        'description',
        'status',
        'progress',
        'notes',
        'completed_at',
    ];

    protected $casts = [
        'completed_at' => 'datetime',
    ];

    public function pesertaPkl()
    {
        return $this->belongsTo(PesertaPkl::class);
    }

    public function taskAssignment()
    {
        return $this->belongsTo(TaskAssignment::class);
    }
}
