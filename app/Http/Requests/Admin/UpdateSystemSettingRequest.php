<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class UpdateSystemSettingRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'key'         => ['required', 'string', 'max:100', 'regex:/^[a-z0-9_]+$/'],
            'value'       => ['nullable', 'string'],
            'type'        => ['required', 'in:string,number,boolean,json'],
            'label'       => ['nullable', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
        ];
    }

    public function messages(): array
    {
        return [
            'key.regex' => 'Key hanya boleh huruf kecil, angka, dan underscore, contoh: app_name',
        ];
    }
}