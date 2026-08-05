<?php

namespace App\Repositories;

use App\Models\User;
use App\Models\Group;
use App\Models\Menu;
use App\Models\AuditLog;

class DashboardRepository
{
    public function getSummary(): array
    {
        return [
            'total_users'      => User::count(),
            'total_active_users' => User::where('is_active', true)->count(),
            'total_groups'     => Group::count(),
            'total_menus'      => Menu::count(),
            'total_audit_logs' => AuditLog::count(),
        ];
    }

    public function getRecentAuditLogs(int $limit = 5)
    {
        return AuditLog::with('user:id,name,username')
            ->orderByDesc('created_at')
            ->limit($limit)
            ->get();
    }

    public function getUsersByGroup()
    {
        return Group::withCount('users')->get(['id', 'name', 'code']);
    }
}