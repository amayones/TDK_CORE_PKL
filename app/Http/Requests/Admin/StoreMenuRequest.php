<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class StoreMenuRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'parent_id'           => ['nullable', 'exists:menus,id'],
            'module_key'          => ['required', 'string', 'max:100', 'regex:/^[a-z0-9\-]+$/'],
            'name'                => ['required', 'string', 'max:255'],
            'icon'                => ['nullable', 'string', 'max:100'],
            'route_path'          => ['required', 'string', 'max:255'],
            'frontend_path'       => ['nullable', 'string', 'max:255'],
            'backend_controller'  => ['nullable', 'string', 'max:255'],
            'backend_service'     => ['nullable', 'string', 'max:255'],
            'backend_repository'  => ['nullable', 'string', 'max:255'],
            'sort_order'          => ['integer'],
            'is_active'           => ['boolean'],
        ];
    }

    public function messages(): array
    {
        return [
            'module_key.regex' => 'Module key hanya boleh huruf kecil, angka, dan tanda hubung, contoh: finance-report',
        ];
    }
}