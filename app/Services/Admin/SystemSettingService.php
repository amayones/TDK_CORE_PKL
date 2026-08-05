<?php

namespace App\Services\Admin;

use App\Core\BaseService;
use App\Repositories\SystemSettingRepository;
use App\Models\AuditLog;
use App\Models\SystemSetting;
use Illuminate\Support\Facades\Cache;
use Illuminate\Validation\ValidationException;

class SystemSettingService extends BaseService
{
    protected SystemSettingRepository $settingRepository;

    public function __construct(SystemSettingRepository $settingRepository)
    {
        parent::__construct($settingRepository);
        $this->settingRepository = $settingRepository;
    }

    public function list()
    {
        return $this->settingRepository->getAllOrdered();
    }

    public function createSetting(array $data)
    {
        if ($this->settingRepository->isKeyTaken($data['key'])) {
            throw ValidationException::withMessages([
                'key' => ['Key sudah digunakan.'],
            ]);
        }

        $setting = $this->settingRepository->create($data);
        Cache::forget("system_setting_{$setting->key}");

        AuditLog::record(
            action: 'CREATE',
            module: 'system-setting',
            description: "Membuat setting baru: {$setting->key}",
            newData: $setting->toArray()
        );

        return $setting;
    }

    public function updateSetting(int $id, array $data)
    {
        $setting = $this->settingRepository->find($id);
        $oldData = $setting->toArray();
        $oldKey = $setting->key;

        if ($this->settingRepository->isKeyTaken($data['key'], $id)) {
            throw ValidationException::withMessages([
                'key' => ['Key sudah digunakan.'],
            ]);
        }

        $updated = $this->settingRepository->update($id, $data);
        Cache::forget("system_setting_{$oldKey}");
        Cache::forget("system_setting_{$updated->key}");

        AuditLog::record(
            action: 'UPDATE',
            module: 'system-setting',
            description: "Mengubah setting: {$updated->key}",
            oldData: $oldData,
            newData: $updated->toArray()
        );

        return $updated;
    }

    public function deleteSetting(int $id)
    {
        $setting = $this->settingRepository->find($id);
        $oldData = $setting->toArray();

        $this->settingRepository->delete($id);
        Cache::forget("system_setting_{$setting->key}");

        AuditLog::record(
            action: 'DELETE',
            module: 'system-setting',
            description: "Menghapus setting: {$setting->key}",
            oldData: $oldData
        );

        return true;
    }
}