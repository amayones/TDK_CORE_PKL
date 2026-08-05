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

    public function getMatrixForGroup(int $groupId): array
    {
        $group = Group::findOrFail($groupId);
        $allMenus = Menu::orderBy('sort_order')->get();
        $existingAccess = $this->menuAccessRepository->getByGroupId($groupId);

        $matrix = $allMenus->map(function ($menu) use ($existingAccess) {
            $access = $existingAccess->get($menu->id);

            return [
                'menu_id'     => $menu->id,
                'menu_name'   => $menu->name,
                'module_key'  => $menu->module_key,
                'parent_id'   => $menu->parent_id,
                'can_view'    => $access->can_view ?? false,
                'can_create'  => $access->can_create ?? false,
                'can_edit'    => $access->can_edit ?? false,
                'can_delete'  => $access->can_delete ?? false,
            ];
        });

        return [
            'group' => [
                'id'   => $group->id,
                'code' => $group->code,
                'name' => $group->name,
            ],
            'matrix' => $matrix,
        ];
    }

    public function saveMatrix(int $groupId, array $permissions): void
    {
        $group = Group::findOrFail($groupId);

        if ($group->code === 'GROUP_ADMIN') {
            // Admin selalu full access, tidak bisa diubah lewat matrix.
            return;
        }

        DB::transaction(function () use ($groupId, $permissions) {
            foreach ($permissions as $item) {
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