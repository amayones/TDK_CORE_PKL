<?php

namespace App\Http\Controllers\Modules;

use App\Http\Controllers\Controller;
use App\Http\Requests\Modules\StoreMyTaskRequest;
use App\Http\Requests\Modules\UpdateMyTaskRequest;
use App\Services\Modules\MyTaskService;
use Illuminate\Http\Request;

class MyTaskController extends Controller
{
    protected MyTaskService $service;

    public function __construct(MyTaskService $service)
    {
        $this->service = $service;
    }

    public function index(Request $request)
    {
        $perPage = (int) $request->get('per_page', 15);
        $search = $request->get('search');
        $status = $request->get('status');

        $pesertaPklId = null;
        if (auth()->user()->pesertaPkl) {
            $pesertaPklId = auth()->user()->pesertaPkl->id;
        }

        $data = $this->service->list($perPage, $search, $status, $pesertaPklId);

        return $this->success($data, 'Data berhasil dimuat');
    }

    public function show(int $id)
    {
        $item = $this->service->findOrFail($id);

        return $this->success($item, 'Detail berhasil dimuat');
    }

    public function store(StoreMyTaskRequest $request)
    {
        $item = $this->service->createItem($request->validated());

        return $this->success($item, 'Data berhasil dibuat', 201);
    }

    public function update(UpdateMyTaskRequest $request, int $id)
    {
        $item = $this->service->updateItem($id, $request->validated());

        return $this->success($item, 'Data berhasil diperbarui');
    }

    public function destroy(int $id)
    {
        $this->service->deleteItem($id);

        return $this->success(null, 'Data berhasil dihapus');
    }
}