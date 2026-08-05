<?php

namespace App\Repositories;

use App\Models\AuditLog;

class AuditLogRepository extends BaseRepository
{
    public function __construct(AuditLog $model)
    {
        parent::__construct($model);
    }

    public function paginateWithFilters(int $perPage = 20, array $filters = [])
    {
        $query = $this->model->with('user:id,name,username')->orderByDesc('created_at');

        if (!empty($filters['module'])) {
            $query->where('module', $filters['module']);
        }

        if (!empty($filters['action'])) {
            $query->where('action', $filters['action']);
        }

        if (!empty($filters['user_id'])) {
            $query->where('user_id', $filters['user_id']);
        }

        if (!empty($filters['date_from'])) {
            $query->whereDate('created_at', '>=', $filters['date_from']);
        }

        if (!empty($filters['date_to'])) {
            $query->whereDate('created_at', '<=', $filters['date_to']);
        }

        return $query->paginate($perPage);
    }

    public function getDistinctModules()
    {
        return $this->model->whereNotNull('module')->distinct()->pluck('module');
    }

    public function getDistinctActions()
    {
        return $this->model->distinct()->pluck('action');
    }
}