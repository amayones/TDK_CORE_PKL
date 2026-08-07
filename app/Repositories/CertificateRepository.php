<?php

namespace App\Repositories;

use App\Models\Certificate;

class CertificateRepository extends BaseRepository
{
    public function __construct(Certificate $model)
    {
        parent::__construct($model);
    }

    public function paginateWithSearch(int $perPage = 15, ?string $search = null, ?string $status = null)
    {
        $query = $this->model->with(['pesertaPkl', 'issuer'])->orderByDesc('issue_date');

        if ($search) {
            $query->whereHas('pesertaPkl', function ($p) use ($search) {
                $p->where('full_name', 'like', "%{$search}%");
            });
        }

        if ($status) {
            $query->where('status', $status);
        }

        return $query->paginate($perPage);
    }
}