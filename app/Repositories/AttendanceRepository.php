<?php

namespace App\Repositories;

use App\Models\Attendance;

class AttendanceRepository extends BaseRepository
{
    public function __construct(Attendance $model)
    {
        parent::__construct($model);
    }

    public function paginateWithSearch(int $perPage = 15, ?string $search = null, ?string $status = null, ?string $dateFrom = null, ?string $dateTo = null)
    {
        $query = $this->model->with(['pesertaPkl', 'approver'])->orderByDesc('date');

        if ($search) {
            $query->whereHas('pesertaPkl', function ($p) use ($search) {
                $p->where('full_name', 'like', "%{$search}%");
            });
        }

        if ($status) {
            $query->where('status', $status);
        }

        if ($dateFrom) {
            $query->where('date', '>=', $dateFrom);
        }

        if ($dateTo) {
            $query->where('date', '<=', $dateTo);
        }

        return $query->paginate($perPage);
    }
}