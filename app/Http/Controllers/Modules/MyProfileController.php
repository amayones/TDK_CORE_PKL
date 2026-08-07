<?php

namespace App\Http\Controllers\Modules;

use App\Http\Controllers\Controller;
use App\Http\Requests\Modules\StoreMyProfileRequest;
use App\Http\Requests\Modules\UpdateMyProfileRequest;
use App\Services\Modules\MyProfileService;
use Illuminate\Http\Request;

class MyProfileController extends Controller
{
    protected MyProfileService $service;

    public function __construct(MyProfileService $service)
    {
        $this->service = $service;
    }

    public function index(Request $request)
    {
        $perPage = (int) $request->get('per_page', 15);
        $search = $request->get('search');

        $userId = auth()->id();
        $data = $this->service->list($perPage, $search, $userId);

        return $this->success($data, 'Data berhasil dimuat');
    }

    public function store(StoreMyProfileRequest $request)
    {
        $item = $this->service->createItem($request->validated());

        return $this->success($item, 'Data berhasil dibuat', 201);
    }

    public function update(UpdateMyProfileRequest $request, int $id)
    {
        $item = $this->service->updateItem($id, $request->validated());

        return $this->success($item, 'Data berhasil diperbarui');
    }

    public function activate(int $id)
    {
        $item = $this->service->activateItem($id);

        return $this->success($item, 'Profil berhasil diaktifkan');
    }

    public function destroy(int $id)
    {
        $this->service->deleteItem($id);

        return $this->success(null, 'Data berhasil dihapus');
    }
}