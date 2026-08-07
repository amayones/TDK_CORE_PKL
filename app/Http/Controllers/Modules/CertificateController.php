<?php

namespace App\Http\Controllers\Modules;

use App\Http\Controllers\Controller;
use App\Http\Requests\Modules\StoreCertificateRequest;
use App\Http\Requests\Modules\UpdateCertificateRequest;
use App\Services\Modules\CertificateService;
use Illuminate\Http\Request;

class CertificateController extends Controller
{
    protected CertificateService $service;

    public function __construct(CertificateService $service)
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
        $data = $this->service->pesertaPklOptions();

        return $this->success($data, 'Options berhasil dimuat');
    }

    public function issue(int $id)
    {
        $item = $this->service->issueItem($id);

        return $this->success($item, 'Sertifikat diterbitkan');
    }

    public function show(int $id)
    {
        $item = $this->service->findOrFail($id);

        return $this->success($item, 'Detail berhasil dimuat');
    }

    public function store(StoreCertificateRequest $request)
    {
        $item = $this->service->createItem($request->validated());

        return $this->success($item, 'Data berhasil dibuat', 201);
    }

    public function update(UpdateCertificateRequest $request, int $id)
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