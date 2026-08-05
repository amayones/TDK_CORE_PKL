<?php

namespace App\Repositories\Contracts;

interface BaseRepositoryInterface
{
    public function all(array $columns = ['*']);

    public function paginate(int $perPage = 15, array $columns = ['*']);

    public function find(int $id, array $columns = ['*']);

    public function findOrFail(int $id, array $columns = ['*']);

    public function create(array $data);

    public function update(int $id, array $data);

    public function delete(int $id);

    public function findBy(string $field, $value, array $columns = ['*']);

    public function findWhere(array $criteria, array $columns = ['*']);
}