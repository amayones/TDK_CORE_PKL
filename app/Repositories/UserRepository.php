<?php

namespace App\Repositories;

use App\Models\User;

class UserRepository extends BaseRepository
{
    public function __construct(User $model)
    {
        parent::__construct($model);
    }

    public function paginateWithGroup(int $perPage = 15, ?string $search = null)
    {
        $query = $this->model->with('group')->orderByDesc('id');

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('username', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            });
        }

        return $query->paginate($perPage);
    }

    public function findWithGroup(int $id)
    {
        return $this->model->with('group')->findOrFail($id);
    }

    public function isUsernameTaken(string $username, ?int $exceptId = null): bool
    {
        $query = $this->model->where('username', $username);
        if ($exceptId) {
            $query->where('id', '!=', $exceptId);
        }
        return $query->exists();
    }

    public function isEmailTaken(string $email, ?int $exceptId = null): bool
    {
        $query = $this->model->where('email', $email);
        if ($exceptId) {
            $query->where('id', '!=', $exceptId);
        }
        return $query->exists();
    }
}