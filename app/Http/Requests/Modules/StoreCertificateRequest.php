<?php

namespace App\Http\Requests\Modules;

use Illuminate\Foundation\Http\FormRequest;

class StoreCertificateRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'peserta_pkl_id'    => ['required', 'exists:peserta_pkls,id'],
            'certificate_number'=> ['required', 'string', 'max:255', 'unique:certificates,certificate_number'],
            'issue_date'        => ['required', 'date'],
            'expiry_date'       => ['nullable', 'date', 'after_or_equal:issue_date'],
            'title'             => ['required', 'string', 'max:255'],
            'description'       => ['nullable', 'string'],
            'status'            => ['required', 'in:pending,issued,expired'],
        ];
    }
}