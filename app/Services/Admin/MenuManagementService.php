<?php

namespace App\Services\Admin;

use App\Core\BaseService;
use App\Repositories\MenuRepository;
use App\Models\AuditLog;
use App\Models\Menu;
use Illuminate\Validation\ValidationException;

class MenuManagementService extends BaseService
{
    protected MenuRepository $menuRepository;

    public function __construct(MenuRepository $menuRepository)
    {
        parent::__construct($menuRepository);
        $this->menuRepository = $menuRepository;
    }

    public function listAll()
    {
        return Menu::with('parent')->orderBy('sort_order')->get();
    }

    public function listTopLevel()
    {
        return Menu::topLevel()->orderBy('sort_order')->get(['id', 'name']);
    }

    public function createMenu(array $data)
    {
        if (Menu::where('module_key', $data['module_key'])->exists()) {
            throw ValidationException::withMessages([
                'module_key' => ['Module key sudah digunakan.'],
            ]);
        }

        $menu = $this->menuRepository->create($data);

        AuditLog::record(
            action: 'CREATE',
            module: 'menu-management',
            description: "Membuat menu baru: {$menu->name}",
            newData: $menu->toArray()
        );

        return $menu;
    }

    public function updateMenu(int $id, array $data)
    {
        $menu = $this->menuRepository->find($id);
        $oldData = $menu->toArray();

        if (Menu::where('module_key', $data['module_key'])->where('id', '!=', $id)->exists()) {
            throw ValidationException::withMessages([
                'module_key' => ['Module key sudah digunakan.'],
            ]);
        }

        if (isset($data['parent_id']) && $data['parent_id'] == $id) {
            throw ValidationException::withMessages([
                'parent_id' => ['Menu tidak dapat menjadi parent dirinya sendiri.'],
            ]);
        }

        $updated = $this->menuRepository->update($id, $data);

        AuditLog::record(
            action: 'UPDATE',
            module: 'menu-management',
            description: "Mengubah menu: {$updated->name}",
            oldData: $oldData,
            newData: $updated->toArray()
        );

        return $updated;
    }

    public function deleteMenu(int $id)
    {
        $menu = $this->menuRepository->find($id);

        $protectedKeys = [
            'dashboard', 'user-management', 'group-management',
            'menu-management', 'menu-access-management',
            'system-setting', 'audit-log',
        ];

        if (in_array($menu->module_key, $protectedKeys)) {
            throw ValidationException::withMessages([
                'module_key' => ['Menu bawaan sistem tidak dapat dihapus.'],
            ]);
        }

        if ($menu->children()->exists()) {
            throw ValidationException::withMessages([
                'module_key' => ['Menu ini masih memiliki sub-menu. Hapus sub-menu terlebih dahulu.'],
            ]);
        }

        $oldData = $menu->toArray();
        $this->menuRepository->delete($id);

        AuditLog::record(
            action: 'DELETE',
            module: 'menu-management',
            description: "Menghapus menu: {$menu->name}",
            oldData: $oldData
        );

        return true;
    }
}