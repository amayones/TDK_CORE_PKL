<?php

namespace App\Repositories;

use App\Models\Testing;

class TestingRepository extends BaseRepository
{
    public function __construct(Testing $model)
    {
        parent::__construct($model);
    }

    public function paginateWithSearch(int $perPage = 15, ?string $search = null)
    {
        $query = $this->model->orderByDesc('id');

        if ($search) {
            $query->where('name', 'like', "%{$search}%");
        }

        return $query->paginate($perPage);
    }
}