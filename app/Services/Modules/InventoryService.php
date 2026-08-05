<?php

namespace App\Services\Modules;

use App\Core\BaseService;
use App\Repositories\InventoryRepository;
use App\Models\AuditLog;

class InventoryService extends BaseService
{
    protected InventoryRepository $inventoryRepository;

    public function __construct(InventoryRepository $inventoryRepository)
    {
        parent::__construct($inventoryRepository);
        $this->inventoryRepository = $inventoryRepository;
    }

    public function list(int $perPage = 15, ?string $search = null)
    {
        return $this->inventoryRepository->paginateWithSearch($perPage, $search);
    }

    public function createItem(array $data)
    {
        $item = $this->inventoryRepository->create($data);

        AuditLog::record(
            action: 'CREATE',
            module: 'inventory',
            description: "Membuat data baru: {$item->name}",
            newData: $item->toArray()
        );

        return $item;
    }

    public function updateItem(int $id, array $data)
    {
        $item = $this->inventoryRepository->find($id);
        $oldData = $item->toArray();

        $updated = $this->inventoryRepository->update($id, $data);

        AuditLog::record(
            action: 'UPDATE',
            module: 'inventory',
            description: "Mengubah data: {$updated->name}",
            oldData: $oldData,
            newData: $updated->toArray()
        );

        return $updated;
    }

    public function deleteItem(int $id)
    {
        $item = $this->inventoryRepository->find($id);
        $oldData = $item->toArray();

        $this->inventoryRepository->delete($id);

        AuditLog::record(
            action: 'DELETE',
            module: 'inventory',
            description: "Menghapus data: {$item->name}",
            oldData: $oldData
        );

        return true;
    }
}