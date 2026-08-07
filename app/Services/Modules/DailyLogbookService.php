<?php

namespace App\Services\Modules;

use App\Core\BaseService;
use App\Repositories\DailyLogbookRepository;
use App\Models\AuditLog;

class DailyLogbookService extends BaseService
{
    protected DailyLogbookRepository $dailyLogbookRepository;

    public function __construct(DailyLogbookRepository $dailyLogbookRepository)
    {
        parent::__construct($dailyLogbookRepository);
        $this->dailyLogbookRepository = $dailyLogbookRepository;
    }

    public function list(int $perPage = 15, ?string $search = null, ?string $status = null, ?int $pesertaPklId = null)
    {
        return $this->dailyLogbookRepository->paginateWithSearch($perPage, $search, $status, $pesertaPklId);
    }

    public function createItem(array $data)
    {
        $data['peserta_pkl_id'] = $data['peserta_pkl_id'] ?? auth()->user()->pesertaPkl?->id;
        
        if (!$data['peserta_pkl_id']) {
            throw new \Exception('Anda bukan peserta PKL');
        }

        $item = $this->dailyLogbookRepository->create($data);

        AuditLog::record(
            action: 'CREATE',
            module: 'daily-logbook',
            description: "Membuat logbook: {$item->log_date}",
            newData: $item->toArray()
        );

        return $item;
    }

    public function updateItem(int $id, array $data)
    {
        $item = $this->dailyLogbookRepository->find($id);
        $oldData = $item->toArray();

        $updated = $this->dailyLogbookRepository->update($id, $data);

        AuditLog::record(
            action: 'UPDATE',
            module: 'daily-logbook',
            description: "Mengubah logbook: {$updated->log_date}",
            oldData: $oldData,
            newData: $updated->toArray()
        );

        return $updated;
    }

    public function deleteItem(int $id)
    {
        $item = $this->dailyLogbookRepository->find($id);
        $oldData = $item->toArray();

        $this->dailyLogbookRepository->delete($id);

        AuditLog::record(
            action: 'DELETE',
            module: 'daily-logbook',
            description: "Menghapus logbook: {$item->log_date}",
            oldData: $oldData
        );

        return true;
    }

    public function submitItem(int $id)
    {
        $item = $this->dailyLogbookRepository->find($id);
        $oldData = $item->toArray();

        $updated = $this->dailyLogbookRepository->update($id, [
            'status' => 'submitted'
        ]);

        AuditLog::record(
            action: 'SUBMIT',
            module: 'daily-logbook',
            description: "Mengajukan logbook: {$item->log_date}",
            oldData: $oldData,
            newData: $updated->toArray()
        );

        return $updated;
    }
}