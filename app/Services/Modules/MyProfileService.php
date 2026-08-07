<?php

namespace App\Services\Modules;

use App\Core\BaseService;
use App\Repositories\MyProfileRepository;
use App\Models\AuditLog;

class MyProfileService extends BaseService
{
    protected MyProfileRepository $myProfileRepository;

    public function __construct(MyProfileRepository $myProfileRepository)
    {
        parent::__construct($myProfileRepository);
        $this->myProfileRepository = $myProfileRepository;
    }

    public function list(int $perPage = 15, ?string $search = null, ?int $userId = null)
    {
        return $this->myProfileRepository->paginateWithSearch($perPage, $search, $userId);
    }

    public function createItem(array $data)
    {
        $data['user_id'] = $data['user_id'] ?? auth()->id();
        
        $item = $this->myProfileRepository->create($data);

        AuditLog::record(
            action: 'CREATE',
            module: 'my-profile',
            description: "Membuat profil: {$item->full_name}",
            newData: $item->toArray()
        );

        return $item;
    }

    public function updateItem(int $id, array $data)
    {
        $item = $this->myProfileRepository->find($id);
        $oldData = $item->toArray();

        $updated = $this->myProfileRepository->update($id, $data);

        AuditLog::record(
            action: 'UPDATE',
            module: 'my-profile',
            description: "Mengubah profil: {$updated->full_name}",
            oldData: $oldData,
            newData: $updated->toArray()
        );

        return $updated;
    }

    public function deleteItem(int $id)
    {
        $item = $this->myProfileRepository->find($id);
        $oldData = $item->toArray();

        $this->myProfileRepository->delete($id);

        AuditLog::record(
            action: 'DELETE',
            module: 'my-profile',
            description: "Menghapus profil: {$item->full_name}",
            oldData: $oldData
        );

        return true;
    }

    public function activateItem(int $id)
    {
        $item = $this->myProfileRepository->find($id);
        $oldData = $item->toArray();

        $updated = $this->myProfileRepository->update($id, [
            'status' => 'active'
        ]);

        AuditLog::record(
            action: 'ACTIVATE',
            module: 'my-profile',
            description: "Mengaktifkan profil: {$item->full_name}",
            oldData: $oldData,
            newData: $updated->toArray()
        );

        return $updated;
    }
}