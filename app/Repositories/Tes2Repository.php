<?php

namespace App\Repositories;

use App\Models\Tes2;

class Tes2Repository extends BaseRepository
{
    public function __construct(Tes2 $model)
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