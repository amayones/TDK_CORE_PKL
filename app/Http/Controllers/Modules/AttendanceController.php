<?php

namespace App\Http\Controllers\Modules;

use App\Http\Controllers\Controller;
use App\Http\Requests\Modules\StoreAttendanceRequest;
use App\Http\Requests\Modules\UpdateAttendanceRequest;
use App\Services\Modules\AttendanceService;
use Illuminate\Http\Request;

class AttendanceController extends Controller
{
    protected AttendanceService $service;

    public function __construct(AttendanceService $service)
    {
        $this->service = $service;
    }

    public function index(Request $request)
    {
        $perPage = (int) $request->get('per_page', 15);
        $search = $request->get('search');
        $status = $request->get('status');
        $dateFrom = $request->get('date_from');
        $dateTo = $request->get('date_to');

        $data = $this->service->list($perPage, $search, $status, $dateFrom, $dateTo);

        return $this->success($data, 'Data berhasil dimuat');
    }

    public function options()
    {
        $data = $this->service->pesertaPklOptions();

        return $this->success($data, 'Options berhasil dimuat');
    }

    public function approve(int $id)
    {
        $item = $this->service->approveItem($id);

        return $this->success($item, 'Absensi disetujui');
    }

    public function show(int $id)
    {
        $item = $this->service->findOrFail($id);

        return $this->success($item, 'Detail berhasil dimuat');
    }

    public function store(StoreAttendanceRequest $request)
    {
        $item = $this->service->createItem($request->validated());

        return $this->success($item, 'Data berhasil dibuat', 201);
    }

    public function update(UpdateAttendanceRequest $request, int $id)
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