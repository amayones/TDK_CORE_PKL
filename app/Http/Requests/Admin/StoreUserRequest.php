<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class StoreUserRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'group_id'  => ['required', 'exists:groups,id'],
            'username'  => ['required', 'string', 'max:100'],
            'name'      => ['required', 'string', 'max:255'],
            'email'     => ['required', 'email', 'max:255'],
            'password'  => ['required', 'string', 'min:6'],
            'is_active' => ['boolean'],
        ];
    }
}