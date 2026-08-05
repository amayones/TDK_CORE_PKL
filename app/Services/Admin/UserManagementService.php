<?php

namespace App\Services\Admin;

use App\Core\BaseService;
use App\Repositories\UserRepository;
use App\Models\AuditLog;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class UserManagementService extends BaseService
{
    protected UserRepository $userRepository;

    public function __construct(UserRepository $userRepository)
    {
        parent::__construct($userRepository);
        $this->userRepository = $userRepository;
    }

    public function list(int $perPage = 15, ?string $search = null)
    {
        return $this->userRepository->paginateWithGroup($perPage, $search);
    }

    public function detail(int $id)
    {
        return $this->userRepository->findWithGroup($id);
    }

    public function createUser(array $data)
    {
        if ($this->userRepository->isUsernameTaken($data['username'])) {
            throw ValidationException::withMessages([
                'username' => ['Username sudah digunakan.'],
            ]);
        }

        if ($this->userRepository->isEmailTaken($data['email'])) {
            throw ValidationException::withMessages([
                'email' => ['Email sudah digunakan.'],
            ]);
        }

        $user = $this->userRepository->create([
            'group_id'  => $data['group_id'],
            'username'  => $data['username'],
            'name'      => $data['name'],
            'email'     => $data['email'],
            'password'  => Hash::make($data['password']),
            'is_active' => $data['is_active'] ?? true,
        ]);

        AuditLog::record(
            action: 'CREATE',
            module: 'user-management',
            description: "Membuat user baru: {$user->username}",
            newData: $user->toArray()
        );

        return $user;
    }

    public function updateUser(int $id, array $data)
    {
        $user = $this->userRepository->findWithGroup($id);
        $oldData = $user->toArray();

        if ($this->userRepository->isUsernameTaken($data['username'], $id)) {
            throw ValidationException::withMessages([
                'username' => ['Username sudah digunakan.'],
            ]);
        }

        if ($this->userRepository->isEmailTaken($data['email'], $id)) {
            throw ValidationException::withMessages([
                'email' => ['Email sudah digunakan.'],
            ]);
        }

        $updateData = [
            'group_id'  => $data['group_id'],
            'username'  => $data['username'],
            'name'      => $data['name'],
            'email'     => $data['email'],
            'is_active' => $data['is_active'] ?? true,
        ];

        if (!empty($data['password'])) {
            $updateData['password'] = Hash::make($data['password']);
        }

        $updated = $this->userRepository->update($id, $updateData);

        AuditLog::record(
            action: 'UPDATE',
            module: 'user-management',
            description: "Mengubah user: {$updated->username}",
            oldData: $oldData,
            newData: $updated->toArray()
        );

        return $updated;
    }

    public function deleteUser(int $id)
    {
        $user = $this->userRepository->findWithGroup($id);
        $oldData = $user->toArray();

        $this->userRepository->delete($id);

        AuditLog::record(
            action: 'DELETE',
            module: 'user-management',
            description: "Menghapus user: {$user->username}",
            oldData: $oldData
        );

        return true;
    }
}