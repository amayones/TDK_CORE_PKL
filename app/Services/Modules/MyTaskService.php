<?php

namespace App\Services\Modules;

use App\Core\BaseService;
use App\Repositories\MyTaskRepository;
use App\Models\AuditLog;

class MyTaskService extends BaseService
{
    protected MyTaskRepository $myTaskRepository;

    public function __construct(MyTaskRepository $myTaskRepository)
    {
        parent::__construct($myTaskRepository);
        $this->myTaskRepository = $myTaskRepository;
    }

    public function list(int $perPage = 15, ?string $search = null, ?string $status = null, ?int $pesertaPklId = null)
    {
        return $this->myTaskRepository->paginateWithSearch($perPage, $search, $status, $pesertaPklId);
    }

    public function createItem(array $data)
    {
        $item = $this->myTaskRepository->create($data);

        AuditLog::record(
            action: 'CREATE',
            module: 'my-task',
            description: "Membuat task: {$item->title}",
            newData: $item->toArray()
        );

        return $item;
    }

    public function updateItem(int $id, array $data)
    {
        $item = $this->myTaskRepository->find($id);
        $oldData = $item->toArray();

        if (isset($data['status']) && $data['status'] === 'completed' && !$item->completed_at) {
            $data['completed_at'] = now();
        }

        $updated = $this->myTaskRepository->update($id, $data);

        AuditLog::record(
            action: 'UPDATE',
            module: 'my-task',
            description: "Mengubah task: {$updated->title}",
            oldData: $oldData,
            newData: $updated->toArray()
        );

        return $updated;
    }

    public function deleteItem(int $id)
    {
        $item = $this->myTaskRepository->find($id);
        $oldData = $item->toArray();

        $this->myTaskRepository->delete($id);

        AuditLog::record(
            action: 'DELETE',
            module: 'my-task',
            description: "Menghapus task: {$item->title}",
            oldData: $oldData
        );

        return true;
    }
}