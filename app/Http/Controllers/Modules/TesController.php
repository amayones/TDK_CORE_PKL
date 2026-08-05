<?php

namespace App\Http\Controllers\Modules;

use App\Http\Controllers\Controller;
use App\Http\Requests\Modules\StoreTesRequest;
use App\Http\Requests\Modules\UpdateTesRequest;
use App\Services\Modules\TesService;
use Illuminate\Http\Request;

class TesController extends Controller
{
    protected TesService $service;

    public function __construct(TesService $service)
    {
        $this->service = $service;
    }

    public function index(Request $request)
    {
        $perPage = (int) $request->get('per_page', 15);
        $search = $request->get('search');

        $data = $this->service->list($perPage, $search);

        return $this->success($data, 'Data berhasil dimuat');
    }

    public function show(int $id)
    {
        $item = $this->service->findOrFail($id);

        return $this->success($item, 'Detail berhasil dimuat');
    }

    public function store(StoreTesRequest $request)
    {
        $item = $this->service->createItem($request->validated());

        return $this->success($item, 'Data berhasil dibuat', 201);
    }

    public function update(UpdateTesRequest $request, int $id)
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