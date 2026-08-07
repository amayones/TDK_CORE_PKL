<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Services\Admin\MenuAccessManagementService;
use App\Models\Group;
use Illuminate\Http\Request;

class MenuAccessManagementController extends Controller
{
    protected MenuAccessManagementService $service;

    public function __construct(MenuAccessManagementService $service)
    {
        $this->service = $service;
    }

    public function groups()
    {
        $groups = Group::where('is_active', true)->get(['id', 'code', 'name']);

        return $this->success($groups, 'Data group berhasil dimuat');
    }

    public function matrix(int $groupId)
    {
        $data = $this->service->getMatrixForGroup($groupId);

        return $this->success($data, 'Matrix hak akses berhasil dimuat');
    }

    public function save(Request $request, int $groupId)
    {
        $validated = $request->validate([
            'permissions'               => ['required', 'array'],
            'permissions.*.menu_id'     => ['required', 'exists:menus,id'],
            'permissions.*.module_key'  => ['nullable', 'string'],
            'permissions.*.can_view'    => ['boolean'],
            'permissions.*.can_create'  => ['boolean'],
            'permissions.*.can_edit'    => ['boolean'],
            'permissions.*.can_delete'  => ['boolean'],
            'permissions.*.locked'      => ['boolean'],
        ]);

        $this->service->saveMatrix($groupId, $validated['permissions']);

        return $this->success(null, 'Hak akses berhasil disimpan');
    }
}