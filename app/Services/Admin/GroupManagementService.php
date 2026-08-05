<?php

namespace App\Services\Admin;

use App\Core\BaseService;
use App\Repositories\GroupRepository;
use App\Models\AuditLog;
use Illuminate\Validation\ValidationException;

class GroupManagementService extends BaseService
{
    protected GroupRepository $groupRepository;

    public function __construct(GroupRepository $groupRepository)
    {
        parent::__construct($groupRepository);
        $this->groupRepository = $groupRepository;
    }

    public function list(int $perPage = 15, ?string $search = null)
    {
        return $this->groupRepository->paginateWithUserCount($perPage, $search);
    }

    public function createGroup(array $data)
    {
        if ($this->groupRepository->isCodeTaken($data['code'])) {
            throw ValidationException::withMessages([
                'code' => ['Kode group sudah digunakan.'],
            ]);
        }

        $group = $this->groupRepository->create($data);

        AuditLog::record(
            action: 'CREATE',
            module: 'group-management',
            description: "Membuat group baru: {$group->name}",
            newData: $group->toArray()
        );

        return $group;
    }

    public function updateGroup(int $id, array $data)
    {
        $group = $this->groupRepository->find($id);
        $oldData = $group->toArray();

        if ($this->groupRepository->isCodeTaken($data['code'], $id)) {
            throw ValidationException::withMessages([
                'code' => ['Kode group sudah digunakan.'],
            ]);
        }

        $updated = $this->groupRepository->update($id, $data);

        AuditLog::record(
            action: 'UPDATE',
            module: 'group-management',
            description: "Mengubah group: {$updated->name}",
            oldData: $oldData,
            newData: $updated->toArray()
        );

        return $updated;
    }

    public function deleteGroup(int $id)
    {
        $group = $this->groupRepository->find($id);

        if (in_array($group->code, ['GROUP_ADMIN', 'GROUP_INTERN'])) {
            throw ValidationException::withMessages([
                'code' => ['Group bawaan sistem tidak dapat dihapus.'],
            ]);
        }

        if ($this->groupRepository->hasUsers($id)) {
            throw ValidationException::withMessages([
                'code' => ['Group masih memiliki user terdaftar. Pindahkan user terlebih dahulu.'],
            ]);
        }

        $oldData = $group->toArray();
        $this->groupRepository->delete($id);

        AuditLog::record(
            action: 'DELETE',
            module: 'group-management',
            description: "Menghapus group: {$group->name}",
            oldData: $oldData
        );

        return true;
    }
}