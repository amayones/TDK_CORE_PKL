<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreSystemSettingRequest;
use App\Http\Requests\Admin\UpdateSystemSettingRequest;
use App\Services\Admin\SystemSettingService;

class SystemSettingController extends Controller
{
    protected SystemSettingService $service;

    public function __construct(SystemSettingService $service)
    {
        $this->service = $service;
    }

    public function index()
    {
        $settings = $this->service->list();

        return $this->success($settings, 'Data setting berhasil dimuat');
    }

    public function store(StoreSystemSettingRequest $request)
    {
        $setting = $this->service->createSetting($request->validated());

        return $this->success($setting, 'Setting berhasil dibuat', 201);
    }

    public function update(UpdateSystemSettingRequest $request, int $id)
    {
        $setting = $this->service->updateSetting($id, $request->validated());

        return $this->success($setting, 'Setting berhasil diperbarui');
    }

    public function destroy(int $id)
    {
        $this->service->deleteSetting($id);

        return $this->success(null, 'Setting berhasil dihapus');
    }
}