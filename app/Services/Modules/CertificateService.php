<?php

namespace App\Services\Modules;

use App\Core\BaseService;
use App\Repositories\CertificateRepository;
use App\Models\AuditLog;

class CertificateService extends BaseService
{
    protected CertificateRepository $certificateRepository;

    public function __construct(CertificateRepository $certificateRepository)
    {
        parent::__construct($certificateRepository);
        $this->certificateRepository = $certificateRepository;
    }

    public function list(int $perPage = 15, ?string $search = null, ?string $status = null)
    {
        return $this->certificateRepository->paginateWithSearch($perPage, $search, $status);
    }

    public function pesertaPklOptions()
    {
        return \App\Models\PesertaPkl::orderBy('full_name')
            ->get(['id', 'full_name', 'institution_name']);
    }

    public function createItem(array $data)
    {
        $data['issued_by'] = auth()->id();
        $data['issued_at'] = now();
        $item = $this->certificateRepository->create($data);

        AuditLog::record(
            action: 'CREATE',
            module: 'certificate',
            description: "Menerbitkan sertifikat: {$item->certificate_number}",
            newData: $item->toArray()
        );

        return $item;
    }

    public function updateItem(int $id, array $data)
    {
        $item = $this->certificateRepository->find($id);
        $oldData = $item->toArray();

        $updated = $this->certificateRepository->update($id, $data);

        AuditLog::record(
            action: 'UPDATE',
            module: 'certificate',
            description: "Mengubah sertifikat: {$updated->certificate_number}",
            oldData: $oldData,
            newData: $updated->toArray()
        );

        return $updated;
    }

    public function issueItem(int $id)
    {
        $item = $this->certificateRepository->find($id);
        $oldData = $item->toArray();

        $updated = $this->certificateRepository->update($id, [
            'status' => 'issued',
            'issued_by' => auth()->id(),
            'issued_at' => now(),
        ]);

        AuditLog::record(
            action: 'ISSUE',
            module: 'certificate',
            description: "Menerbitkan sertifikat: {$item->certificate_number}",
            oldData: $oldData,
            newData: $updated->toArray()
        );

        return $updated;
    }

    public function deleteItem(int $id)
    {
        $item = $this->certificateRepository->find($id);
        $oldData = $item->toArray();

        $this->certificateRepository->delete($id);

        AuditLog::record(
            action: 'DELETE',
            module: 'certificate',
            description: "Menghapus sertifikat: {$item->certificate_number}",
            oldData: $oldData
        );

        return true;
    }
}