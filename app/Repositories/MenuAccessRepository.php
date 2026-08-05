<?php

namespace App\Repositories;

use App\Models\MenuAccess;

class MenuAccessRepository extends BaseRepository
{
    public function __construct(MenuAccess $model)
    {
        parent::__construct($model);
    }

    public function getByGroupId(int $groupId)
    {
        return $this->model->where('group_id', $groupId)->get()->keyBy('menu_id');
    }

    public function upsertAccess(int $groupId, int $menuId, array $permissions)
    {
        return $this->model->updateOrCreate(
            ['group_id' => $groupId, 'menu_id' => $menuId],
            $permissions
        );
    }

    public function removeAccess(int $groupId, int $menuId): bool
    {
        return $this->model->where('group_id', $groupId)->where('menu_id', $menuId)->delete() > 0;
    }
}