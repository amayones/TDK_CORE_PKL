<?php

namespace App\Http\Requests\Modules;

use Illuminate\Foundation\Http\FormRequest;

class StoreTaskAssignmentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'peserta_pkl_id' => ['required', 'exists:peserta_pkls,id'],
            'project_id'     => ['nullable', 'exists:projects,id'],
            'title'          => ['required', 'string', 'max:255'],
            'description'    => ['nullable', 'string'],
            'priority'       => ['required', 'in:low,medium,high,urgent'],
            'status'         => ['required', 'in:pending,in_progress,completed,rejected'],
            'due_date'       => ['required', 'date'],
            'review_notes'   => ['nullable', 'string'],
        ];
    }
}