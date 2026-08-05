<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Services\Admin\AuditLogService;
use Illuminate\Http\Request;

class AuditLogController extends Controller
{
    protected AuditLogService $service;

    public function __construct(AuditLogService $service)
    {
        $this->service = $service;
    }

    public function index(Request $request)
    {
        $perPage = (int) $request->get('per_page', 20);

        $filters = $request->only(['module', 'action', 'user_id', 'date_from', 'date_to']);

        $logs = $this->service->list($perPage, $filters);

        return $this->success($logs, 'Data audit log berhasil dimuat');
    }

    public function show(int $id)
    {
        $log = $this->service->detail($id);

        return $this->success($log, 'Detail audit log berhasil dimuat');
    }

    public function filterOptions()
    {
        $options = $this->service->getFilterOptions();

        return $this->success($options, 'Opsi filter berhasil dimuat');
    }
}