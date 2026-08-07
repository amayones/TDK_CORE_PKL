<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Evaluation extends Model
{
    use HasFactory;

    protected $fillable = [
        'peserta_pkl_id',
        'evaluator_id',
        'project_id',
        'period_start',
        'period_end',
        'score_attitude',
        'score_skills',
        'score_knowledge',
        'score_communication',
        'score_teamwork',
        'total_score',
        'strengths',
        'improvements',
        'overall_notes',
        'status',
    ];

    protected $casts = [
        'period_start' => 'date',
        'period_end'   => 'date',
    ];

    public function pesertaPkl()
    {
        return $this->belongsTo(PesertaPkl::class);
    }

    public function evaluator()
    {
        return $this->belongsTo(User::class, 'evaluator_id');
    }

    public function project()
    {
        return $this->belongsTo(Project::class);
    }
}
