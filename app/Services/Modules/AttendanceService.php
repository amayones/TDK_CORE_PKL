<?php

namespace App\Services\Modules;

use App\Core\BaseService;
use App\Repositories\AttendanceRepository;
use App\Models\AuditLog;

class AttendanceService extends BaseService
{
    protected AttendanceRepository $attendanceRepository;

    public function __construct(AttendanceRepository $attendanceRepository)
    {
        parent::__construct($attendanceRepository);
        $this->attendanceRepository = $attendanceRepository;
    }

    public function list(int $perPage = 15, ?string $search = null, ?string $status = null, ?string $dateFrom = null, ?string $dateTo = null)
    {
        return $this->attendanceRepository->paginateWithSearch($perPage, $search, $status, $dateFrom, $dateTo);
    }

    public function pesertaPklOptions()
    {
        return \App\Models\PesertaPkl::orderBy('full_name')
            ->get(['id', 'full_name', 'institution_name']);
    }

    public function createItem(array $data)
    {
        $item = $this->attendanceRepository->create($data);

        AuditLog::record(
            action: 'CREATE',
            module: 'attendance',
            description: "Mencatat absensi: {$item->pesertaPkl->full_name} ({$item->date})",
            newData: $item->toArray()
        );

        return $item;
    }

    public function updateItem(int $id, array $data)
    {
        $item = $this->attendanceRepository->find($id);
        $oldData = $item->toArray();

        $updated = $this->attendanceRepository->update($id, $data);

        AuditLog::record(
            action: 'UPDATE',
            module: 'attendance',
            description: "Mengubah absensi: {$updated->pesertaPkl->full_name} ({$updated->date})",
            oldData: $oldData,
            newData: $updated->toArray()
        );

        return $updated;
    }

    public function approveItem(int $id)
    {
        $item = $this->attendanceRepository->find($id);
        $oldData = $item->toArray();

        $updated = $this->attendanceRepository->update($id, [
            'approved_by' => auth()->id(),
            'approved_at' => now(),
        ]);

        AuditLog::record(
            action: 'APPROVE',
            module: 'attendance',
            description: "Menyetujui absensi: {$item->pesertaPkl->full_name} ({$item->date})",
            oldData: $oldData,
            newData: $updated->toArray()
        );

        return $updated;
    }

    public function deleteItem(int $id)
    {
        $item = $this->attendanceRepository->find($id);
        $oldData = $item->toArray();

        $this->attendanceRepository->delete($id);

        AuditLog::record(
            action: 'DELETE',
            module: 'attendance',
            description: "Menghapus absensi: {$item->pesertaPkl->full_name} ({$item->date})",
            oldData: $oldData
        );

        return true;
    }
}