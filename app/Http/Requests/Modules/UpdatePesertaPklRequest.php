<?php

namespace App\Http\Requests\Modules;

use Illuminate\Foundation\Http\FormRequest;

class UpdatePesertaPklRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'user_id'          => ['nullable', 'exists:users,id'],
            'full_name'        => ['required', 'string', 'max:255'],
            'student_number'   => ['nullable', 'string', 'max:50'],
            'institution_name' => ['required', 'string', 'max:255'],
            'major'            => ['nullable', 'string', 'max:255'],
            'phone'            => ['nullable', 'string', 'max:20'],
            'address'          => ['nullable', 'string'],
            'supervisor_name'  => ['nullable', 'string', 'max:255'],
            'mentor_name'      => ['nullable', 'string', 'max:255'],
            'start_date'       => ['required', 'date'],
            'end_date'         => ['required', 'date', 'after_or_equal:start_date'],
            'status'           => ['required', 'in:active,completed,dropped'],
            'notes'            => ['nullable', 'string'],
        ];
    }
}