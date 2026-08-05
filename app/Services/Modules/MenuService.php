<?php

namespace App\Services\Modules;

use App\Core\BaseService;
use App\Repositories\MenuRepository;
use App\Models\User;

class MenuService extends BaseService
{
    protected MenuRepository $menuRepository;

    public function __construct(MenuRepository $menuRepository)
    {
        parent::__construct($menuRepository);
        $this->menuRepository = $menuRepository;
    }

    public function getMenuForUser(User $user)
    {
        if (!$user->group) {
            return collect();
        }

        $isAdmin = $user->isAdmin();
        $menus = $this->menuRepository->getMenusByGroupId($user->group_id, $isAdmin);

        return $menus->map(function ($menu) use ($user, $isAdmin) {
            return $this->formatMenu($menu, $user, $isAdmin);
        });
    }

    private function formatMenu($menu, User $user, bool $isAdmin): array
    {
        $permissions = $isAdmin
            ? ['can_view' => true, 'can_create' => true, 'can_edit' => true, 'can_delete' => true]
            : $this->getPermissionsArray($menu, $user->group_id);

        return [
            'id'             => $menu->id,
            'module_key'     => $menu->module_key,
            'name'           => $menu->name,
            'icon'           => $menu->icon,
            'route_path'     => $menu->route_path,
            'frontend_path'  => $menu->frontend_path,
            'permissions'    => $permissions,
            'children'       => $menu->children->map(function ($child) use ($user, $isAdmin) {
                return $this->formatMenu($child, $user, $isAdmin);
            })->values(),
        ];
    }

    private function getPermissionsArray($menu, int $groupId): array
    {
        $access = $menu->menuAccess->firstWhere('group_id', $groupId);

        return [
            'can_view'   => $access->can_view ?? false,
            'can_create' => $access->can_create ?? false,
            'can_edit'   => $access->can_edit ?? false,
            'can_delete' => $access->can_delete ?? false,
        ];
    }
}