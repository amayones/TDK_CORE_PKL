<?php

namespace App\Services\Modules;

use App\Core\BaseService;
use App\Repositories\PesertaPklRepository;
use App\Models\AuditLog;

class PesertaPklService extends BaseService
{
    protected PesertaPklRepository $pesertaPklRepository;

    public function __construct(PesertaPklRepository $pesertaPklRepository)
    {
        parent::__construct($pesertaPklRepository);
        $this->pesertaPklRepository = $pesertaPklRepository;
    }

    public function list(int $perPage = 15, ?string $search = null, ?string $status = null)
    {
        return $this->pesertaPklRepository->paginateWithSearch($perPage, $search, $status);
    }

    public function userOptions()
    {
        return \App\Models\User::where('is_active', true)
            ->orderBy('name')
            ->get(['id', 'name', 'username']);
    }

    public function createItem(array $data)
    {
        $item = $this->pesertaPklRepository->create($data);

        AuditLog::record(
            action: 'CREATE',
            module: 'peserta-pkl',
            description: "Membuat data peserta PKL: {$item->full_name}",
            newData: $item->toArray()
        );

        return $item;
    }

    public function updateItem(int $id, array $data)
    {
        $item = $this->pesertaPklRepository->find($id);
        $oldData = $item->toArray();

        $updated = $this->pesertaPklRepository->update($id, $data);

        AuditLog::record(
            action: 'UPDATE',
            module: 'peserta-pkl',
            description: "Mengubah data peserta PKL: {$updated->full_name}",
            oldData: $oldData,
            newData: $updated->toArray()
        );

        return $updated;
    }

    public function deleteItem(int $id)
    {
        $item = $this->pesertaPklRepository->find($id);
        $oldData = $item->toArray();

        $this->pesertaPklRepository->delete($id);

        AuditLog::record(
            action: 'DELETE',
            module: 'peserta-pkl',
            description: "Menghapus data peserta PKL: {$item->full_name}",
            oldData: $oldData
        );

        return true;
    }
}