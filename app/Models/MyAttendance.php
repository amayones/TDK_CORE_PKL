<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MyAttendance extends Model
{
    use HasFactory;

    protected $fillable = [
        'peserta_pkl_id',
        'attendance_date',
        'check_in',
        'check_out',
        'status',
        'notes',
        'approved_by',
        'approved_at',
    ];

    protected $casts = [
        'attendance_date' => 'date',
        'approved_at' => 'datetime',
    ];

    public function pesertaPkl()
    {
        return $this->belongsTo(PesertaPkl::class);
    }

    public function approver()
    {
        return $this->belongsTo(User::class, 'approved_by');
    }
}
