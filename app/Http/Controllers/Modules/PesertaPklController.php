<?php

namespace App\Http\Controllers\Modules;

use App\Http\Controllers\Controller;
use App\Http\Requests\Modules\StorePesertaPklRequest;
use App\Http\Requests\Modules\UpdatePesertaPklRequest;
use App\Services\Modules\PesertaPklService;
use Illuminate\Http\Request;

class PesertaPklController extends Controller
{
    protected PesertaPklService $service;

    public function __construct(PesertaPklService $service)
    {
        $this->service = $service;
    }

    public function index(Request $request)
    {
        $perPage = (int) $request->get('per_page', 15);
        $search = $request->get('search');
        $status = $request->get('status');

        $data = $this->service->list($perPage, $search, $status);

        return $this->success($data, 'Data berhasil dimuat');
    }

    public function userOptions()
    {
        $data = $this->service->userOptions();

        return $this->success($data, 'User options berhasil dimuat');
    }

    public function show(int $id)
    {
        $item = $this->service->findOrFail($id);

        return $this->success($item, 'Detail berhasil dimuat');
    }

    public function store(StorePesertaPklRequest $request)
    {
        $item = $this->service->createItem($request->validated());

        return $this->success($item, 'Data berhasil dibuat', 201);
    }

    public function update(UpdatePesertaPklRequest $request, int $id)
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