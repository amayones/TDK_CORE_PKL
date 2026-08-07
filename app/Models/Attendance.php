<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Attendance extends Model
{
    use HasFactory;

    protected $fillable = [
        'peserta_pkl_id',
        'date',
        'status',
        'notes',
        'approved_by',
        'approved_at',
    ];

    protected $casts = [
        'date'       => 'date',
        'approved_at'=> 'datetime',
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
