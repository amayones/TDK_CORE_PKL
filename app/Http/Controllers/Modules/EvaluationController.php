<?php

namespace App\Http\Controllers\Modules;

use App\Http\Controllers\Controller;
use App\Http\Requests\Modules\StoreEvaluationRequest;
use App\Http\Requests\Modules\UpdateEvaluationRequest;
use App\Services\Modules\EvaluationService;
use Illuminate\Http\Request;

class EvaluationController extends Controller
{
    protected EvaluationService $service;

    public function __construct(EvaluationService $service)
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

    public function options()
    {
        $data = [
            'peserta_pkls' => $this->service->pesertaPklOptions(),
            'projects' => $this->service->projectOptions(),
        ];

        return $this->success($data, 'Options berhasil dimuat');
    }

    public function show(int $id)
    {
        $item = $this->service->findOrFail($id);

        return $this->success($item, 'Detail berhasil dimuat');
    }

    public function store(StoreEvaluationRequest $request)
    {
        $item = $this->service->createItem($request->validated());

        return $this->success($item, 'Data berhasil dibuat', 201);
    }

    public function update(UpdateEvaluationRequest $request, int $id)
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