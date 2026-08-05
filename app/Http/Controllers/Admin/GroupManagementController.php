<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreGroupRequest;
use App\Http\Requests\Admin\UpdateGroupRequest;
use App\Services\Admin\GroupManagementService;
use Illuminate\Http\Request;

class GroupManagementController extends Controller
{
    protected GroupManagementService $service;

    public function __construct(GroupManagementService $service)
    {
        $this->service = $service;
    }

    public function index(Request $request)
    {
        $perPage = (int) $request->get('per_page', 15);
        $search = $request->get('search');

        $groups = $this->service->list($perPage, $search);

        return $this->success($groups, 'Data group berhasil dimuat');
    }

    public function show(int $id)
    {
        $group = $this->service->findOrFail($id);

        return $this->success($group, 'Detail group berhasil dimuat');
    }

    public function store(StoreGroupRequest $request)
    {
        $group = $this->service->createGroup($request->validated());

        return $this->success($group, 'Group berhasil dibuat', 201);
    }

    public function update(UpdateGroupRequest $request, int $id)
    {
        $group = $this->service->updateGroup($id, $request->validated());

        return $this->success($group, 'Group berhasil diperbarui');
    }

    public function destroy(int $id)
    {
        $this->service->deleteGroup($id);

        return $this->success(null, 'Group berhasil dihapus');
    }
}