<?php

namespace App\Http\Requests\Modules;

use Illuminate\Foundation\Http\FormRequest;

class UpdateEvaluationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'peserta_pkl_id'       => ['required', 'exists:peserta_pkls,id'],
            'project_id'           => ['nullable', 'exists:projects,id'],
            'period_start'         => ['required', 'date'],
            'period_end'           => ['required', 'date', 'after_or_equal:period_start'],
            'score_attitude'       => ['nullable', 'integer', 'min:0', 'max:100'],
            'score_skills'         => ['nullable', 'integer', 'min:0', 'max:100'],
            'score_knowledge'      => ['nullable', 'integer', 'min:0', 'max:100'],
            'score_communication'  => ['nullable', 'integer', 'min:0', 'max:100'],
            'score_teamwork'       => ['nullable', 'integer', 'min:0', 'max:100'],
            'strengths'            => ['nullable', 'string'],
            'improvements'         => ['nullable', 'string'],
            'overall_notes'        => ['nullable', 'string'],
            'status'               => ['required', 'in:draft,submitted,reviewed'],
        ];
    }
}