<?php

namespace App\Http\Requests\Modules;

use Illuminate\Foundation\Http\FormRequest;

class StoreMyTaskRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'task_assignment_id' => ['nullable', 'exists:task_assignments,id'],
            'title'              => ['required', 'string', 'max:255'],
            'description'        => ['nullable', 'string'],
            'status'             => ['required', 'in:pending,in_progress,completed'],
            'progress'           => ['nullable', 'integer', 'min:0', 'max:100'],
            'notes'              => ['nullable', 'string'],
        ];
    }
}