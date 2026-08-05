<?php

namespace App\Core;

use App\Repositories\Contracts\BaseRepositoryInterface;

abstract class BaseService
{
    protected BaseRepositoryInterface $repository;

    public function __construct(BaseRepositoryInterface $repository)
    {
        $this->repository = $repository;
    }

    public function all(array $columns = ['*'])
    {
        return $this->repository->all($columns);
    }

    public function paginate(int $perPage = 15, array $columns = ['*'])
    {
        return $this->repository->paginate($perPage, $columns);
    }

    public function find(int $id, array $columns = ['*'])
    {
        return $this->repository->find($id, $columns);
    }

    public function findOrFail(int $id, array $columns = ['*'])
    {
        return $this->repository->findOrFail($id, $columns);
    }

    public function create(array $data)
    {
        return $this->repository->create($data);
    }

    public function update(int $id, array $data)
    {
        return $this->repository->update($id, $data);
    }

    public function delete(int $id)
    {
        return $this->repository->delete($id);
    }
}