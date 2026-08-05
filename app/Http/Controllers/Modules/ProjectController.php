<?php

namespace App\Http\Controllers\Modules;

use App\Http\Controllers\Controller;
use App\Http\Requests\Modules\StoreProjectRequest;
use App\Http\Requests\Modules\UpdateProjectRequest;
use App\Services\Modules\ProjectService;
use Illuminate\Http\Request;

class ProjectController extends Controller
{
    protected ProjectService $service;

    public function __construct(ProjectService $service)
    {
        $this->service = $service;
    }

    public function index(Request $request)
    {
        $perPage = (int) $request->get('per_page', 15);
        $search = $request->get('search');

        $projects = $this->service->list($perPage, $search);

        return $this->success($projects, 'Data project berhasil dimuat');
    }

    public function show(int $id)
    {
        $project = $this->service->findOrFail($id);

        return $this->success($project, 'Detail project berhasil dimuat');
    }

    public function store(StoreProjectRequest $request)
    {
        $project = $this->service->createProject($request->validated());

        return $this->success($project, 'Project berhasil dibuat', 201);
    }

    public function update(UpdateProjectRequest $request, int $id)
    {
        $project = $this->service->updateProject($id, $request->validated());

        return $this->success($project, 'Project berhasil diperbarui');
    }

    public function destroy(int $id)
    {
        $this->service->deleteProject($id);

        return $this->success(null, 'Project berhasil dihapus');
    }
}