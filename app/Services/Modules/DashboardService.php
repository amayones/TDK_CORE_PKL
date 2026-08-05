<?php

namespace App\Services\Modules;

use App\Repositories\DashboardRepository;

class DashboardService
{
    protected DashboardRepository $dashboardRepository;

    public function __construct(DashboardRepository $dashboardRepository)
    {
        $this->dashboardRepository = $dashboardRepository;
    }

    public function getDashboardData(): array
    {
        return [
            'summary'          => $this->dashboardRepository->getSummary(),
            'recent_logs'      => $this->dashboardRepository->getRecentAuditLogs()->map(function ($log) {
                return [
                    'id'          => $log->id,
                    'action'      => $log->action,
                    'module'      => $log->module,
                    'description' => $log->description,
                    'user'        => $log->user?->name ?? 'System',
                    'created_at'  => $log->created_at->diffForHumans(),
                ];
            }),
            'users_by_group'   => $this->dashboardRepository->getUsersByGroup(),
        ];
    }
}