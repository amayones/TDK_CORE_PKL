<?php

namespace App\Services\Modules;

use App\Core\BaseService;
use App\Repositories\TesRepository;
use App\Models\AuditLog;

class TesService extends BaseService
{
    protected TesRepository $tesRepository;

    public function __construct(TesRepository $tesRepository)
    {
        parent::__construct($tesRepository);
        $this->tesRepository = $tesRepository;
    }

    public function list(int $perPage = 15, ?string $search = null)
    {
        return $this->tesRepository->paginateWithSearch($perPage, $search);
    }

    public function createItem(array $data)
    {
        $item = $this->tesRepository->create($data);

        AuditLog::record(
            action: 'CREATE',
            module: 'tes',
            description: "Membuat data baru: {$item->name}",
            newData: $item->toArray()
        );

        return $item;
    }

    public function updateItem(int $id, array $data)
    {
        $item = $this->tesRepository->find($id);
        $oldData = $item->toArray();

        $updated = $this->tesRepository->update($id, $data);

        AuditLog::record(
            action: 'UPDATE',
            module: 'tes',
            description: "Mengubah data: {$updated->name}",
            oldData: $oldData,
            newData: $updated->toArray()
        );

        return $updated;
    }

    public function deleteItem(int $id)
    {
        $item = $this->tesRepository->find($id);
        $oldData = $item->toArray();

        $this->tesRepository->delete($id);

        AuditLog::record(
            action: 'DELETE',
            module: 'tes',
            description: "Menghapus data: {$item->name}",
            oldData: $oldData
        );

        return true;
    }
}