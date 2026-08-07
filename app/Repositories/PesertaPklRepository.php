<?php

namespace App\Repositories;

use App\Models\PesertaPkl;

class PesertaPklRepository extends BaseRepository
{
    public function __construct(PesertaPkl $model)
    {
        parent::__construct($model);
    }

    public function paginateWithSearch(int $perPage = 15, ?string $search = null, ?string $status = null)
    {
        $query = $this->model->with('user')->orderByDesc('id');

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('full_name', 'like', "%{$search}%")
                  ->orWhere('institution_name', 'like', "%{$search}%")
                  ->orWhere('student_number', 'like', "%{$search}%");
            });
        }

        if ($status) {
            $query->where('status', $status);
        }

        return $query->paginate($perPage);
    }
}