<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreUserRequest;
use App\Http\Requests\Admin\UpdateUserRequest;
use App\Services\Admin\UserManagementService;
use App\Models\Group;
use Illuminate\Http\Request;

class UserManagementController extends Controller
{
    protected UserManagementService $service;

    public function __construct(UserManagementService $service)
    {
        $this->service = $service;
    }

    public function index(Request $request)
    {
        $perPage = (int) $request->get('per_page', 15);
        $search = $request->get('search');

        $users = $this->service->list($perPage, $search);

        return $this->success($users, 'Data user berhasil dimuat');
    }

    public function show(int $id)
    {
        $user = $this->service->detail($id);

        return $this->success($user, 'Detail user berhasil dimuat');
    }

    public function store(StoreUserRequest $request)
    {
        $user = $this->service->createUser($request->validated());

        return $this->success($user, 'User berhasil dibuat', 201);
    }

    public function update(UpdateUserRequest $request, int $id)
    {
        $user = $this->service->updateUser($id, $request->validated());

        return $this->success($user, 'User berhasil diperbarui');
    }

    public function destroy(int $id)
    {
        $this->service->deleteUser($id);

        return $this->success(null, 'User berhasil dihapus');
    }

    public function groups()
    {
        $groups = Group::where('is_active', true)->get(['id', 'code', 'name']);

        return $this->success($groups, 'Data group berhasil dimuat');
    }
}