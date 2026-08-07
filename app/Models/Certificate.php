<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Certificate extends Model
{
    use HasFactory;

    protected $fillable = [
        'peserta_pkl_id',
        'certificate_number',
        'issue_date',
        'expiry_date',
        'title',
        'description',
        'status',
        'issued_by',
        'issued_at',
    ];

    protected $casts = [
        'issue_date' => 'date',
        'expiry_date' => 'date',
        'issued_at' => 'datetime',
    ];

    public function pesertaPkl()
    {
        return $this->belongsTo(PesertaPkl::class);
    }

    public function issuer()
    {
        return $this->belongsTo(User::class, 'issued_by');
    }
}
