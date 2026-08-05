<?php

namespace App\Services\Admin;

use App\Repositories\AuditLogRepository;

class AuditLogService
{
    protected AuditLogRepository $auditLogRepository;

    public function __construct(AuditLogRepository $auditLogRepository)
    {
        $this->auditLogRepository = $auditLogRepository;
    }

    public function list(int $perPage = 20, array $filters = [])
    {
        return $this->auditLogRepository->paginateWithFilters($perPage, $filters);
    }

    public function detail(int $id)
    {
        return $this->auditLogRepository->find($id, ['*']);
    }

    public function getFilterOptions(): array
    {
        return [
            'modules' => $this->auditLogRepository->getDistinctModules(),
            'actions' => $this->auditLogRepository->getDistinctActions(),
        ];
    }
}