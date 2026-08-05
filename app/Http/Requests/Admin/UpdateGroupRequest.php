<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class UpdateGroupRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'code'        => ['required', 'string', 'max:50', 'regex:/^[A-Z_]+$/'],
            'name'        => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'is_active'   => ['boolean'],
        ];
    }

    public function messages(): array
    {
        return [
            'code.regex' => 'Kode group hanya boleh huruf kapital dan underscore, contoh: GROUP_FINANCE',
        ];
    }
}