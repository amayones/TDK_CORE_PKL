<?php

namespace App\Repositories;

use App\Models\MyTask;

class MyTaskRepository extends BaseRepository
{
    public function __construct(MyTask $model)
    {
        parent::__construct($model);
    }

    public function paginateWithSearch(int $perPage = 15, ?string $search = null, ?string $status = null, ?int $pesertaPklId = null)
    {
        $query = $this->model->with(['taskAssignment'])->orderByDesc('created_at');

        if ($search) {
            $query->where('title', 'like', "%{$search}%");
        }

        if ($status) {
            $query->where('status', $status);
        }

        if ($pesertaPklId) {
            $query->where('peserta_pkl_id', $pesertaPklId);
        }

        return $query->paginate($perPage);
    }
}