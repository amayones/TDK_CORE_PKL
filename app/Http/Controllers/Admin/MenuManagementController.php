<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreMenuRequest;
use App\Http\Requests\Admin\UpdateMenuRequest;
use App\Services\Admin\MenuManagementService;
use Illuminate\Http\Request;

class MenuManagementController extends Controller
{
    protected MenuManagementService $service;

    public function __construct(MenuManagementService $service)
    {
        $this->service = $service;
    }

    public function index(Request $request)
    {
        $menus = $this->service->listAll();

        return $this->success($menus, 'Data menu berhasil dimuat');
    }

    public function topLevelOptions()
    {
        $menus = $this->service->listTopLevel();

        return $this->success($menus, 'Data menu induk berhasil dimuat');
    }

    public function show(int $id)
    {
        $menu = $this->service->findOrFail($id);

        return $this->success($menu, 'Detail menu berhasil dimuat');
    }

    public function store(StoreMenuRequest $request)
    {
        $menu = $this->service->createMenu($request->validated());

        return $this->success($menu, 'Menu berhasil dibuat', 201);
    }

    public function update(UpdateMenuRequest $request, int $id)
    {
        $menu = $this->service->updateMenu($id, $request->validated());

        return $this->success($menu, 'Menu berhasil diperbarui');
    }

    public function destroy(int $id)
    {
        $this->service->deleteMenu($id);

        return $this->success(null, 'Menu berhasil dihapus');
    }

    public function generateModule(Request $request)
    {
        $request->validate([
            'module_key' => 'required|string|alpha_dash|unique:menus,module_key',
            'studly_name' => 'required|string|alpha',
            'table_name' => 'required|string|alpha',
        ]);

        $this->service->generateModule(
            $request->module_key,
            $request->studly_name,
            $request->table_name
        );

        return $this->success(null, 'Module berhasil dibuat');
    }
}
