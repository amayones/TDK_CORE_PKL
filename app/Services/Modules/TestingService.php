<?php

namespace App\Services\Modules;

use App\Core\BaseService;
use App\Repositories\TestingRepository;
use App\Models\AuditLog;

class TestingService extends BaseService
{
    protected TestingRepository $testingRepository;

    public function __construct(TestingRepository $testingRepository)
    {
        parent::__construct($testingRepository);
        $this->testingRepository = $testingRepository;
    }

    public function list(int $perPage = 15, ?string $search = null)
    {
        return $this->testingRepository->paginateWithSearch($perPage, $search);
    }

    public function createItem(array $data)
    {
        $item = $this->testingRepository->create($data);

        AuditLog::record(
            action: 'CREATE',
            module: 'testing',
            description: "Membuat data baru: {$item->name}",
            newData: $item->toArray()
        );

        return $item;
    }

    public function updateItem(int $id, array $data)
    {
        $item = $this->testingRepository->find($id);
        $oldData = $item->toArray();

        $updated = $this->testingRepository->update($id, $data);

        AuditLog::record(
            action: 'UPDATE',
            module: 'testing',
            description: "Mengubah data: {$updated->name}",
            oldData: $oldData,
            newData: $updated->toArray()
        );

        return $updated;
    }

    public function deleteItem(int $id)
    {
        $item = $this->testingRepository->find($id);
        $oldData = $item->toArray();

        $this->testingRepository->delete($id);

        AuditLog::record(
            action: 'DELETE',
            module: 'testing',
            description: "Menghapus data: {$item->name}",
            oldData: $oldData
        );

        return true;
    }
}