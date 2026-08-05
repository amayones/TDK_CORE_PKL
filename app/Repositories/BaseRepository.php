<?php

namespace App\Repositories;

use App\Repositories\Contracts\BaseRepositoryInterface;
use Illuminate\Database\Eloquent\Model;

abstract class BaseRepository implements BaseRepositoryInterface
{
    protected Model $model;

    public function __construct(Model $model)
    {
        $this->model = $model;
    }

    public function all(array $columns = ['*'])
    {
        return $this->model->select($columns)->get();
    }

    public function paginate(int $perPage = 15, array $columns = ['*'])
    {
        return $this->model->select($columns)->paginate($perPage);
    }

    public function find(int $id, array $columns = ['*'])
    {
        return $this->model->select($columns)->find($id);
    }

    public function findOrFail(int $id, array $columns = ['*'])
    {
        return $this->model->select($columns)->findOrFail($id);
    }

    public function create(array $data)
    {
        return $this->model->create($data);
    }

    public function update(int $id, array $data)
    {
        $record = $this->model->findOrFail($id);
        $record->update($data);
        return $record;
    }

    public function delete(int $id)
    {
        $record = $this->model->findOrFail($id);
        return $record->delete();
    }

    public function findBy(string $field, $value, array $columns = ['*'])
    {
        return $this->model->select($columns)->where($field, $value)->first();
    }

    public function findWhere(array $criteria, array $columns = ['*'])
    {
        $query = $this->model->select($columns);

        foreach ($criteria as $field => $value) {
            $query->where($field, $value);
        }

        return $query->get();
    }
}