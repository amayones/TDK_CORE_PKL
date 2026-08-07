<?php

namespace App\Http\Requests\Modules;

use Illuminate\Foundation\Http\FormRequest;

class StoreDailyLogbookRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'log_date'     => ['required', 'date'],
            'activities'   => ['required', 'string'],
            'challenges'   => ['nullable', 'string'],
            'next_plan'    => ['nullable', 'string'],
            'hours_worked' => ['nullable', 'integer', 'min:0', 'max:24'],
            'status'       => ['required', 'in:draft,submitted,reviewed'],
        ];
    }
}