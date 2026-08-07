<?php

namespace App\Http\Requests\Modules;

use Illuminate\Foundation\Http\FormRequest;

class StoreAttendanceRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'peserta_pkl_id' => ['required', 'exists:peserta_pkls,id'],
            'date'           => ['required', 'date'],
            'status'         => ['required', 'in:present,sick,leave,absent'],
            'notes'          => ['nullable', 'string'],
        ];
    }
}