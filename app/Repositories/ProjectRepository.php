<?php

namespace App\Repositories;

use App\Models\Project;

class ProjectRepository extends BaseRepository
{
    public function __construct(Project $model)
    {
        parent::__construct($model);
    }

    public function paginateWithCreator(int $perPage = 15, ?string $search = null)
    {
        $query = $this->model->with('creator:id,name')->orderByDesc('id');

        if ($search) {
            $query->where('name', 'like', "%{$search}%");
        }

        return $query->paginate($perPage);
    }
}