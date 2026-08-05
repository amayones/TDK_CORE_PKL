<?php

namespace App\Repositories;

use App\Models\Tes;

class TesRepository extends BaseRepository
{
    public function __construct(Tes $model)
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