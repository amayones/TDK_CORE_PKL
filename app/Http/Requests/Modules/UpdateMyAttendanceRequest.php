<?php

namespace App\Http\Requests\Modules;

use Illuminate\Foundation\Http\FormRequest;

class UpdateMyAttendanceRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'attendance_date' => ['required', 'date'],
            'check_in'        => ['nullable', 'date_format:H:i'],
            'check_out'       => ['nullable', 'date_format:H:i'],
            'status'          => ['required', 'in:hadir,izin,sakit,alpha'],
            'notes'           => ['nullable', 'string'],
        ];
    }
}