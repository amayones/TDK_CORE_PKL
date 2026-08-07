<?php

namespace App\Http\Requests\Modules;

use Illuminate\Foundation\Http\FormRequest;

class StoreMyProfileRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'full_name'           => ['required', 'string', 'max:255'],
            'email'               => ['nullable', 'email', 'max:255'],
            'phone'               => ['nullable', 'string', 'max:50'],
            'address'             => ['nullable', 'string'],
            'institution_name'    => ['nullable', 'string', 'max:255'],
            'institution_address' => ['nullable', 'string'],
            'start_date'          => ['nullable', 'date'],
            'end_date'            => ['nullable', 'date', 'after_or_equal:start_date'],
            'status'              => ['required', 'in:active,completed,terminated'],
            'notes'               => ['nullable', 'string'],
        ];
    }
}