<?php

namespace App\Services\Modules;

use App\Core\BaseService;
use App\Repositories\Tes2Repository;
use App\Models\AuditLog;

class Tes2Service extends BaseService
{
    protected Tes2Repository $tes2Repository;

    public function __construct(Tes2Repository $tes2Repository)
    {
        parent::__construct($tes2Repository);
        $this->tes2Repository = $tes2Repository;
    }

    public function list(int $perPage = 15, ?string $search = null)
    {
        return $this->tes2Repository->paginateWithSearch($perPage, $search);
    }

    public function createItem(array $data)
    {
        $item = $this->tes2Repository->create($data);

        AuditLog::record(
            action: 'CREATE',
            module: 'tes2',
            description: "Membuat data baru: {$item->name}",
            newData: $item->toArray()
        );

        return $item;
    }

    public function updateItem(int $id, array $data)
    {
        $item = $this->tes2Repository->find($id);
        $oldData = $item->toArray();

        $updated = $this->tes2Repository->update($id, $data);

        AuditLog::record(
            action: 'UPDATE',
            module: 'tes2',
            description: "Mengubah data: {$updated->name}",
            oldData: $oldData,
            newData: $updated->toArray()
        );

        return $updated;
    }

    public function deleteItem(int $id)
    {
        $item = $this->tes2Repository->find($id);
        $oldData = $item->toArray();

        $this->tes2Repository->delete($id);

        AuditLog::record(
            action: 'DELETE',
            module: 'tes2',
            description: "Menghapus data: {$item->name}",
            oldData: $oldData
        );

        return true;
    }
}