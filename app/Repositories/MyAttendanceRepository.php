<?php

namespace App\Repositories;

use App\Models\MyAttendance;

class MyAttendanceRepository extends BaseRepository
{
    public function __construct(MyAttendance $model)
    {
        parent::__construct($model);
    }

    public function paginateWithSearch(int $perPage = 15, ?string $search = null, ?string $status = null, ?int $pesertaPklId = null)
    {
        $query = $this->model->with(['pesertaPkl', 'approver'])->orderByDesc('attendance_date');

        if ($search) {
            $query->whereHas('pesertaPkl', function ($p) use ($search) {
                $p->where('full_name', 'like', "%{$search}%");
            });
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