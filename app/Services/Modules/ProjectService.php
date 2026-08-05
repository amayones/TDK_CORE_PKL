<?php

namespace App\Services\Modules;

use App\Core\BaseService;
use App\Repositories\ProjectRepository;
use App\Models\AuditLog;

class ProjectService extends BaseService
{
    protected ProjectRepository $projectRepository;

    public function __construct(ProjectRepository $projectRepository)
    {
        parent::__construct($projectRepository);
        $this->projectRepository = $projectRepository;
    }

    public function list(int $perPage = 15, ?string $search = null)
    {
        return $this->projectRepository->paginateWithCreator($perPage, $search);
    }

    public function createProject(array $data)
    {
        $data['created_by'] = auth()->id();

        $project = $this->projectRepository->create($data);

        AuditLog::record(
            action: 'CREATE',
            module: 'project-management',
            description: "Membuat project baru: {$project->name}",
            newData: $project->toArray()
        );

        return $project;
    }

    public function updateProject(int $id, array $data)
    {
        $project = $this->projectRepository->find($id);
        $oldData = $project->toArray();

        $updated = $this->projectRepository->update($id, $data);

        AuditLog::record(
            action: 'UPDATE',
            module: 'project-management',
            description: "Mengubah project: {$updated->name}",
            oldData: $oldData,
            newData: $updated->toArray()
        );

        return $updated;
    }

    public function deleteProject(int $id)
    {
        $project = $this->projectRepository->find($id);
        $oldData = $project->toArray();

        $this->projectRepository->delete($id);

        AuditLog::record(
            action: 'DELETE',
            module: 'project-management',
            description: "Menghapus project: {$project->name}",
            oldData: $oldData
        );

        return true;
    }
}