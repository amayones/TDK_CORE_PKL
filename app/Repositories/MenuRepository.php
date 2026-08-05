<?php

namespace App\Repositories;

use App\Models\Menu;

class MenuRepository extends BaseRepository
{
    public function __construct(Menu $model)
    {
        parent::__construct($model);
    }

    public function getMenusByGroupId(int $groupId, bool $isAdmin = false)
    {
        if ($isAdmin) {
            return Menu::active()
                ->topLevel()
                ->orderBy('sort_order')
                ->with(['children' => function ($query) {
                    $query->active();
                }])
                ->get();
        }

        return Menu::active()
            ->topLevel()
            ->orderBy('sort_order')
            ->whereHas('menuAccess', function ($query) use ($groupId) {
                $query->where('group_id', $groupId)->where('can_view', true);
            })
            ->with(['children' => function ($query) use ($groupId) {
                $query->active()
                    ->whereHas('menuAccess', function ($q) use ($groupId) {
                        $q->where('group_id', $groupId)->where('can_view', true);
                    });
            }])
            ->get();
    }

    public function getMenuPermissions(int $groupId, int $menuId)
    {
        return $this->model->find($menuId)
            ?->menuAccess()
            ->where('group_id', $groupId)
            ->first();
    }
}