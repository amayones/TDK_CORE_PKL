<?php

namespace App\Repositories;

use App\Models\Group;

class GroupRepository extends BaseRepository
{
    public function __construct(Group $model)
    {
        parent::__construct($model);
    }

    public function paginateWithUserCount(int $perPage = 15, ?string $search = null)
    {
        $query = $this->model->withCount('users')->orderByDesc('id');

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('code', 'like', "%{$search}%");
            });
        }

        return $query->paginate($perPage);
    }

    public function isCodeTaken(string $code, ?int $exceptId = null): bool
    {
        $query = $this->model->where('code', $code);
        if ($exceptId) {
            $query->where('id', '!=', $exceptId);
        }
        return $query->exists();
    }

    public function hasUsers(int $id): bool
    {
        return $this->model->find($id)?->users()->exists() ?? false;
    }
}