<?php

namespace App\Services\Admin;

use App\Repositories\MenuAccessRepository;
use App\Models\Menu;
use App\Models\Group;
use App\Models\AuditLog;
use Illuminate\Support\Facades\DB;

class MenuAccessManagementService
{
    protected MenuAccessRepository $menuAccessRepository;

    public function __construct(MenuAccessRepository $menuAccessRepository)
    {
        $this->menuAccessRepository = $menuAccessRepository;
    }

    // Menu-menu admin yang selalu terkunci untuk GROUP_ADMIN (tidak bisa diubah)
    protected const ADMIN_PROTECTED_MENUS = [
        'dashboard',
        'user-management',
        'group-management',
        'menu-management',
        'menu-access-management',
        'system-setting',
        'audit-log',
    ];

    public function getProtectedAdminMenus(): array
    {
        return self::ADMIN_PROTECTED_MENUS;
    }

    public function getMatrixForGroup(int $groupId): array
    {
        $group = Group::findOrFail($groupId);
        $allMenus = Menu::orderBy('sort_order')->get();
        $existingAccess = $this->menuAccessRepository->getByGroupId($groupId);
        $isAdminGroup = $group->code === 'GROUP_ADMIN';

        $matrix = $allMenus->map(function ($menu) use ($existingAccess, $isAdminGroup) {
            $access = $existingAccess->get($menu->id);
            $isProtected = $isAdminGroup && in_array($menu->module_key, self::ADMIN_PROTECTED_MENUS);

            // Untuk GROUP_ADMIN, menu protected admin selalu full access & terkunci
            if ($isProtected) {
                $canView = true;
                $canCreate = true;
                $canEdit = true;
                $canDelete = true;
            } else {
                $canView = $access->can_view ?? false;
                $canCreate = $access->can_create ?? false;
                $canEdit = $access->can_edit ?? false;
                $canDelete = $access->can_delete ?? false;
            }

            return [
                'menu_id'     => $menu->id,
                'menu_name'   => $menu->name,
                'module_key'  => $menu->module_key,
                'parent_id'   => $menu->parent_id,
                'can_view'    => $canView,
                'can_create'  => $canCreate,
                'can_edit'    => $canEdit,
                'can_delete'  => $canDelete,
                'locked'      => $isProtected,
            ];
        });

        return [
            'group' => [
                'id'   => $group->id,
                'code' => $group->code,
                'name' => $group->name,
            ],
            'matrix' => $matrix,
            'protected_menus' => self::ADMIN_PROTECTED_MENUS,
        ];
    }

    public function saveMatrix(int $groupId, array $permissions): void
    {
        $group = Group::findOrFail($groupId);
        $isAdminGroup = $group->code === 'GROUP_ADMIN';

        DB::transaction(function () use ($groupId, $permissions, $isAdminGroup) {
            foreach ($permissions as $item) {
                // Untuk GROUP_ADMIN, lewati menu admin yang terlindungi (selalu full access)
                if ($isAdminGroup && in_array($item['module_key'], self::ADMIN_PROTECTED_MENUS)) {
                    continue;
                }

                // Pastikan menu admin terlindungi tetap punya full access
                if ($isAdminGroup) {
                    $this->menuAccessRepository->upsertAccess($groupId, $item['menu_id'], [
                        'can_view'   => true,
                        'can_create' => true,
                        'can_edit'   => true,
                        'can_delete' => true,
                    ]);
                    continue;
                }

                $hasAnyPermission = $item['can_view'] || $item['can_create'] || $item['can_edit'] || $item['can_delete'];

                if ($hasAnyPermission) {
                    $this->menuAccessRepository->upsertAccess($groupId, $item['menu_id'], [
                        'can_view'   => $item['can_view'],
                        'can_create' => $item['can_create'],
                        'can_edit'   => $item['can_edit'],
                        'can_delete' => $item['can_delete'],
                    ]);
                } else {
                    $this->menuAccessRepository->removeAccess($groupId, $item['menu_id']);
                }
            }
        });

        AuditLog::record(
            action: 'UPDATE',
            module: 'menu-access-management',
            description: "Mengubah hak akses menu untuk group ID: {$groupId}",
            newData: ['group_id' => $groupId, 'permissions' => $permissions]
        );
    }
}