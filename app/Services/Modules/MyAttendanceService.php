<?php

namespace App\Services\Modules;

use App\Core\BaseService;
use App\Repositories\MyAttendanceRepository;
use App\Models\AuditLog;

class MyAttendanceService extends BaseService
{
    protected MyAttendanceRepository $myAttendanceRepository;

    public function __construct(MyAttendanceRepository $myAttendanceRepository)
    {
        parent::__construct($myAttendanceRepository);
        $this->myAttendanceRepository = $myAttendanceRepository;
    }

    public function list(int $perPage = 15, ?string $search = null, ?string $status = null, ?int $pesertaPklId = null)
    {
        return $this->myAttendanceRepository->paginateWithSearch($perPage, $search, $status, $pesertaPklId);
    }

    public function createItem(array $data)
    {
        $item = $this->myAttendanceRepository->create($data);

        AuditLog::record(
            action: 'CREATE',
            module: 'my-attendance',
            description: "Membuat absensi: {$item->attendance_date}",
            newData: $item->toArray()
        );

        return $item;
    }

    public function updateItem(int $id, array $data)
    {
        $item = $this->myAttendanceRepository->find($id);
        $oldData = $item->toArray();

        $updated = $this->myAttendanceRepository->update($id, $data);

        AuditLog::record(
            action: 'UPDATE',
            module: 'my-attendance',
            description: "Mengubah absensi: {$updated->attendance_date}",
            oldData: $oldData,
            newData: $updated->toArray()
        );

        return $updated;
    }

    public function deleteItem(int $id)
    {
        $item = $this->myAttendanceRepository->find($id);
        $oldData = $item->toArray();

        $this->myAttendanceRepository->delete($id);

        AuditLog::record(
            action: 'DELETE',
            module: 'my-attendance',
            description: "Menghapus absensi: {$item->attendance_date}",
            oldData: $oldData
        );

        return true;
    }

    public function approveItem(int $id)
    {
        $item = $this->myAttendanceRepository->find($id);
        $oldData = $item->toArray();

        $updated = $this->myAttendanceRepository->update($id, [
            'approved_by' => auth()->id(),
            'approved_at' => now(),
        ]);

        AuditLog::record(
            action: 'APPROVE',
            module: 'my-attendance',
            description: "Menyetujui absensi: {$item->attendance_date}",
            oldData: $oldData,
            newData: $updated->toArray()
        );

        return $updated;
    }
}