<?php

namespace App\Repositories;

use App\Models\SystemSetting;

class SystemSettingRepository extends BaseRepository
{
    public function __construct(SystemSetting $model)
    {
        parent::__construct($model);
    }

    public function getAllOrdered()
    {
        return $this->model->orderBy('key')->get();
    }

    public function isKeyTaken(string $key, ?int $exceptId = null): bool
    {
        $query = $this->model->where('key', $key);
        if ($exceptId) {
            $query->where('id', '!=', $exceptId);
        }
        return $query->exists();
    }
}