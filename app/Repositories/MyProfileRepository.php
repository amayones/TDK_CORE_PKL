<?php

namespace App\Repositories;

use App\Models\MyProfile;

class MyProfileRepository extends BaseRepository
{
    public function __construct(MyProfile $model)
    {
        parent::__construct($model);
    }

    public function paginateWithSearch(int $perPage = 15, ?string $search = null, ?int $userId = null)
    {
        $query = $this->model->with(['user'])->orderByDesc('id');

        if ($search) {
            $query->where('full_name', 'like', "%{$search}%");
        }

        if ($userId) {
            $query->where('user_id', $userId);
        }

        return $query->paginate($perPage);
    }
}