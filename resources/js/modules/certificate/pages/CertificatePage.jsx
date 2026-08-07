import { useState, useEffect, useCallback } from 'react';
import { Plus, Pencil, Trash2, Search, Loader2, Award } from 'lucide-react';
import { fetchCertificateList, fetchOptions, createCertificate, updateCertificate, deleteCertificate, issueCertificate } from '../services/certificateService';
import CertificateFormModal from '../components/CertificateFormModal';
import { useMenu } from '../../../core/MenuContext';

const STATUS_BADGE = {
    pending: 'bg-yellow-100 text-yellow-700',
    issued: 'bg-green-100 text-green-700',
    expired: 'bg-red-100 text-red-700',
};

const STATUS_LABEL = {
    pending: 'Pending',
    issued: 'Diterbitkan',
    expired: 'Kedaluwarsa',
};

export default function CertificatePage() {
    const { hasPermission } = useMenu();
    const [items, setItems] = useState(null);
    const [options, setOptions] = useState([]);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    const loadItems = useCallback(async (searchTerm = '', status = '') => {
        setLoading(true);
        try {
            const data = await fetchCertificateList({ search: searchTerm, status });
            setItems(data);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadItems();
        fetchOptions().then(setOptions);
    }, [loadItems]);

    const handleSearch = (e) => {
        e.preventDefault();
        loadItems(search, statusFilter);
    };

    const openCreateModal = () => {
        setEditingItem(null);
        setModalOpen(true);
    };

    const openEditModal = (item) => {
        setEditingItem(item);
        setModalOpen(true);
    };

    const handleSubmit = async (form) => {
        setSubmitting(true);
        try {
            if (editingItem) {
                await updateCertificate(editingItem.id, form);
                window.__APP__.alert('Sertifikat berhasil diupdate', 'success');
            } else {
                await createCertificate(form);
                window.__APP__.alert('Sertifikat berhasil dibuat', 'success');
            }
            setModalOpen(false);
            loadItems(search, statusFilter);
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (item) => {
        const confirmed = await window.__APP__.confirm({
            type: 'danger',
            title: 'Hapus Sertifikat',
            message: `Apakah Anda yakin ingin menghapus sertifikat "${item.certificate_number}"?`,
            confirmText: 'Ya, Hapus',
            cancelText: 'Batal'
        });
        if (!confirmed) return;
        await deleteCertificate(item.id);
        window.__APP__.alert('Sertifikat berhasil dihapus', 'success');
        loadItems(search, statusFilter);
    };

    const handleIssue = async (item) => {
        const confirmed = await window.__APP__.confirm({
            type: 'info',
            title: 'Terbitkan Sertifikat',
            message: `Terbitkan sertifikat "${item.certificate_number}" untuk ${item.peserta_pkl?.full_name}?`,
            confirmText: 'Ya, Terbitkan',
            cancelText: 'Batal'
        });
        if (!confirmed) return;
        await issueCertificate(item.id);
        window.__APP__.alert('Sertifikat diterbitkan', 'success');
        loadItems(search, statusFilter);
    };

    return (
        <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                <div>
                    <h2 className="text-lg font-semibold text-gray-800">Sertifikat</h2>
                    <p className="text-gray-500 text-sm">Manajemen sertifikat peserta PKL.</p>
                </div>
                {hasPermission('certificate', 'can_create') && (
                    <button
                        onClick={openCreateModal}
                        className="flex items-center justify-center gap-2 bg-blue-700 text-white px-4 py-2 rounded text-sm hover:bg-blue-800 w-full sm:w-auto"
                    >
                        <Plus size={16} /> Tambah Sertifikat
                    </button>
                )}
            </div>

            <form onSubmit={handleSearch} className="flex flex-wrap gap-2">
                <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Cari nama peserta..."
                    className="border border-gray-300 rounded px-3 py-2 text-sm w-full max-w-sm"
                />
                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="border border-gray-300 rounded px-3 py-2 text-sm"
                >
                    <option value="">Semua Status</option>
                    <option value="pending">Pending</option>
                    <option value="issued">Diterbitkan</option>
                    <option value="expired">Kedaluwarsa</option>
                </select>
                <button type="submit" className="bg-gray-200 px-3 py-2 rounded text-sm hover:bg-gray-300">
                    <Search size={16} />
                </button>
            </form>

            <div className="bg-white rounded-lg shadow overflow-hidden">
                {loading ? (
                    <div className="flex justify-center py-10">
                        <Loader2 className="animate-spin text-blue-700" size={28} />
                    </div>
                ) : (
                    <div className="table-responsive">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-50 text-gray-600 text-left">
                                <tr>
                                    <th className="px-4 py-3">No. Sertifikat</th>
                                    <th className="px-4 py-3">Peserta</th>
                                    <th className="px-4 py-3">Judul</th>
                                    <th className="px-4 py-3">Tanggal Terbit</th>
                                    <th className="px-4 py-3">Status</th>
                                    <th className="px-4 py-3 text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {items?.data?.length === 0 && (
                                    <tr>
                                        <td colSpan={6} className="text-center py-6 text-gray-400">
                                            Belum ada data sertifikat.
                                        </td>
                                    </tr>
                                )}
                                {items?.data?.map((item) => (
                                    <tr key={item.id} className="border-t border-gray-100">
                                        <td className="px-4 py-3 font-medium text-xs">
                                            {item.certificate_number}
                                        </td>
                                        <td className="px-4 py-3">
                                            {item.peserta_pkl?.full_name || '-'}
                                        </td>
                                        <td className="px-4 py-3 text-gray-600 text-xs">
                                            {item.title}
                                        </td>
                                        <td className="px-4 py-3 text-gray-500 text-xs">
                                            {item.issue_date?.substring(0, 10)}
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className={`px-2 py-1 rounded text-xs ${STATUS_BADGE[item.status]}`}>
                                                {STATUS_LABEL[item.status]}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-right whitespace-nowrap">
                                            {hasPermission('certificate', 'can_edit') && item.status === 'pending' && (
                                                <button onClick={() => handleIssue(item)} className="text-green-600 hover:text-green-800 mr-3" title="Terbitkan">
                                                    <Award size={16} />
                                                </button>
                                            )}
                                            {hasPermission('certificate', 'can_edit') && item.status === 'pending' && (
                                                <button onClick={() => openEditModal(item)} className="text-blue-600 hover:text-blue-800 mr-3">
                                                    <Pencil size={16} />
                                                </button>
                                            )}
                                            {hasPermission('certificate', 'can_delete') && item.status === 'pending' && (
                                                <button onClick={() => handleDelete(item)} className="text-red-600 hover:text-red-800">
                                                    <Trash2 size={16} />
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            <CertificateFormModal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                onSubmit={handleSubmit}
                options={options}
                initialData={editingItem}
                submitting={submitting}
            />
        </div>
    );
}