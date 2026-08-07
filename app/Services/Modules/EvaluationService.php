<?php

namespace App\Services\Modules;

use App\Core\BaseService;
use App\Repositories\EvaluationRepository;
use App\Models\AuditLog;

class EvaluationService extends BaseService
{
    protected EvaluationRepository $evaluationRepository;

    public function __construct(EvaluationRepository $evaluationRepository)
    {
        parent::__construct($evaluationRepository);
        $this->evaluationRepository = $evaluationRepository;
    }

    public function list(int $perPage = 15, ?string $search = null, ?string $status = null)
    {
        return $this->evaluationRepository->paginateWithSearch($perPage, $search, $status);
    }

    public function pesertaPklOptions()
    {
        return \App\Models\PesertaPkl::orderBy('full_name')
            ->get(['id', 'full_name', 'institution_name']);
    }

    public function projectOptions()
    {
        return \App\Models\Project::orderBy('name')
            ->get(['id', 'name']);
    }

    public function createItem(array $data)
    {
        $data['evaluator_id'] = auth()->id();
        $data['total_score'] = $this->calculateTotalScore($data);
        $item = $this->evaluationRepository->create($data);

        AuditLog::record(
            action: 'CREATE',
            module: 'evaluation',
            description: "Mengevaluasi: {$item->pesertaPkl->full_name}",
            newData: $item->toArray()
        );

        return $item;
    }

    public function updateItem(int $id, array $data)
    {
        $item = $this->evaluationRepository->find($id);
        $oldData = $item->toArray();

        $data['total_score'] = $this->calculateTotalScore($data);
        $updated = $this->evaluationRepository->update($id, $data);

        AuditLog::record(
            action: 'UPDATE',
            module: 'evaluation',
            description: "Mengubah evaluasi: {$updated->pesertaPkl->full_name}",
            oldData: $oldData,
            newData: $updated->toArray()
        );

        return $updated;
    }

    public function deleteItem(int $id)
    {
        $item = $this->evaluationRepository->find($id);
        $oldData = $item->toArray();

        $this->evaluationRepository->delete($id);

        AuditLog::record(
            action: 'DELETE',
            module: 'evaluation',
            description: "Menghapus evaluasi: {$item->pesertaPkl->full_name}",
            oldData: $oldData
        );

        return true;
    }

    private function calculateTotalScore(array $data): ?int
    {
        $scores = array_filter([
            $data['score_attitude'] ?? null,
            $data['score_skills'] ?? null,
            $data['score_knowledge'] ?? null,
            $data['score_communication'] ?? null,
            $data['score_teamwork'] ?? null,
        ]);

        if (empty($scores)) return null;

        return (int) ceil(array_sum($scores) / count($scores));
    }
}