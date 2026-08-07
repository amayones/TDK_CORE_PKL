<?php

namespace App\Services\Modules;

use App\Core\BaseService;
use App\Repositories\TaskAssignmentRepository;
use App\Models\AuditLog;

class TaskAssignmentService extends BaseService
{
    protected TaskAssignmentRepository $taskAssignmentRepository;

    public function __construct(TaskAssignmentRepository $taskAssignmentRepository)
    {
        parent::__construct($taskAssignmentRepository);
        $this->taskAssignmentRepository = $taskAssignmentRepository;
    }

    public function list(int $perPage = 15, ?string $search = null, ?string $status = null)
    {
        return $this->taskAssignmentRepository->paginateWithSearch($perPage, $search, $status);
    }

    public function pesertaPklOptions()
    {
        return \App\Models\PesertaPkl::orderBy('full_name')
            ->get(['id', 'full_name', 'institution_name', 'status']);
    }

    public function projectOptions()
    {
        return \App\Models\Project::orderBy('name')
            ->get(['id', 'name']);
    }

    public function createItem(array $data)
    {
        $data['assigned_by'] = auth()->id();
        $item = $this->taskAssignmentRepository->create($data);

        AuditLog::record(
            action: 'CREATE',
            module: 'task-assignment',
            description: "Menugaskan: {$item->title}",
            newData: $item->toArray()
        );

        return $item;
    }

    public function updateItem(int $id, array $data)
    {
        $item = $this->taskAssignmentRepository->find($id);
        $oldData = $item->toArray();

        $updated = $this->taskAssignmentRepository->update($id, $data);

        AuditLog::record(
            action: 'UPDATE',
            module: 'task-assignment',
            description: "Mengubah tugas: {$updated->title}",
            oldData: $oldData,
            newData: $updated->toArray()
        );

        return $updated;
    }

    public function deleteItem(int $id)
    {
        $item = $this->taskAssignmentRepository->find($id);
        $oldData = $item->toArray();

        $this->taskAssignmentRepository->delete($id);

        AuditLog::record(
            action: 'DELETE',
            module: 'task-assignment',
            description: "Menghapus tugas: {$item->title}",
            oldData: $oldData
        );

        return true;
    }
}