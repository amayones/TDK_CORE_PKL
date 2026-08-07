<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TaskAssignment extends Model
{
    use HasFactory;

    protected $fillable = [
        'peserta_pkl_id',
        'assigned_by',
        'project_id',
        'title',
        'description',
        'priority',
        'status',
        'due_date',
        'submitted_at',
        'review_notes',
    ];

    protected $casts = [
        'due_date'     => 'date',
        'submitted_at' => 'datetime',
    ];

    public function pesertaPkl()
    {
        return $this->belongsTo(PesertaPkl::class);
    }

    public function assigner()
    {
        return $this->belongsTo(User::class, 'assigned_by');
    }

    public function project()
    {
        return $this->belongsTo(Project::class);
    }
}
