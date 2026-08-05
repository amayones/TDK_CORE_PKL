<?php

namespace App\Http\Controllers\Modules;

use App\Http\Controllers\Controller;
use App\Services\Modules\DashboardService;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    protected DashboardService $dashboardService;

    public function __construct(DashboardService $dashboardService)
    {
        $this->dashboardService = $dashboardService;
    }

    public function summary(Request $request)
    {
        $data = $this->dashboardService->getDashboardData();

        return $this->success($data, 'Data dashboard berhasil dimuat');
    }
}