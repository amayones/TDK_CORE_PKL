<?php

namespace App\Http\Controllers\Modules;

use App\Http\Controllers\Controller;
use App\Services\Modules\MenuService;
use Illuminate\Http\Request;

class MenuController extends Controller
{
    protected MenuService $menuService;

    public function __construct(MenuService $menuService)
    {
        $this->menuService = $menuService;
    }

    public function mySidebar(Request $request)
    {
        $user = $request->user();

        $menus = $this->menuService->getMenuForUser($user);

        return $this->success($menus, 'Menu berhasil dimuat');
    }
}