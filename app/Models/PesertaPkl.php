<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PesertaPkl extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'full_name',
        'student_number',
        'institution_name',
        'major',
        'phone',
        'address',
        'supervisor_name',
        'mentor_name',
        'start_date',
        'end_date',
        'status',
        'notes',
    ];

    protected $casts = [
        'start_date' => 'date',
        'end_date'   => 'date',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}