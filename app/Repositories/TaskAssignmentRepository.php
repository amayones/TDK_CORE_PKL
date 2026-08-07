<?php

namespace App\Repositories;

use App\Models\TaskAssignment;

class TaskAssignmentRepository extends BaseRepository
{
    public function __construct(TaskAssignment $model)
    {
        parent::__construct($model);
    }

    public function paginateWithSearch(int $perPage = 15, ?string $search = null, ?string $status = null)
    {
        $query = $this->model->with(['pesertaPkl', 'assigner', 'project'])->orderByDesc('id');

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhereHas('pesertaPkl', function ($p) use ($search) {
                      $p->where('full_name', 'like', "%{$search}%");
                  });
            });
        }

        if ($status) {
            $query->where('status', $status);
        }

        return $query->paginate($perPage);
    }
}