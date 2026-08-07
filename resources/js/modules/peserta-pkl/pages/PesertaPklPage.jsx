import { useState, useEffect, useCallback } from 'react';
import { Plus, Pencil, Trash2, Search, Loader2 } from 'lucide-react';
import { fetchPesertaPklList, fetchUserOptions, createPesertaPkl, updatePesertaPkl, deletePesertaPkl } from '../services/pesertaPklService';
import PesertaPklFormModal from '../components/PesertaPklFormModal';
import { useMenu } from '../../../core/MenuContext';

const STATUS_BADGE = {
    active: 'bg-green-100 text-green-700',
    completed: 'bg-blue-100 text-blue-700',
    dropped: 'bg-red-100 text-red-700',
};

const STATUS_LABEL = {
    active: 'Aktif',
    completed: 'Selesai',
    dropped: 'Dibatalkan',
};

export default function PesertaPklPage() {
    const { hasPermission } = useMenu();
    const [items, setItems] = useState(null);
    const [userOptions, setUserOptions] = useState([]);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    const loadItems = useCallback(async (searchTerm = '', status = '') => {
        setLoading(true);
        try {
            const data = await fetchPesertaPklList({ search: searchTerm, status });
            setItems(data);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadItems();
        fetchUserOptions().then(setUserOptions);
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
                await updatePesertaPkl(editingItem.id, form);
                window.__APP__.alert('Data berhasil diupdate', 'success');
            } else {
                await createPesertaPkl(form);
                window.__APP__.alert('Data berhasil ditambahkan', 'success');
            }
            setModalOpen(false);
            loadItems(search, statusFilter);
            fetchUserOptions().then(setUserOptions);
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (item) => {
        const confirmed = await window.__APP__.confirm({
            type: 'danger',
            title: 'Hapus Peserta PKL',
            message: `Apakah Anda yakin ingin menghapus data "${item.full_name}"?`,
            confirmText: 'Ya, Hapus',
            cancelText: 'Batal'
        });
        if (!confirmed) return;
        await deletePesertaPkl(item.id);
        window.__APP__.alert('Data berhasil dihapus', 'success');
        loadItems(search, statusFilter);
    };

    return (
        <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                <div>
                    <h2 className="text-lg font-semibold text-gray-800">Data Peserta PKL</h2>
                    <p className="text-gray-500 text-sm">Kelola biodata peserta magang/PKL.</p>
                </div>
                {hasPermission('peserta-pkl', 'can_create') && (
                    <button
                        onClick={openCreateModal}
                        className="flex items-center justify-center gap-2 bg-blue-700 text-white px-4 py-2 rounded text-sm hover:bg-blue-800 w-full sm:w-auto"
                    >
                        <Plus size={16} /> Tambah Peserta
                    </button>
                )}
            </div>

            <form onSubmit={handleSearch} className="flex flex-wrap gap-2">
                <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Cari nama, sekolah, atau NIM..."
                    className="border border-gray-300 rounded px-3 py-2 text-sm w-full max-w-sm"
                />
                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="border border-gray-300 rounded px-3 py-2 text-sm"
                >
                    <option value="">Semua Status</option>
                    <option value="active">Aktif</option>
                    <option value="completed">Selesai</option>
                    <option value="dropped">Dibatalkan</option>
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
                                    <th className="px-4 py-3">Nama</th>
                                    <th className="px-4 py-3">Asal Sekolah/Kampus</th>
                                    <th className="px-4 py-3">Periode</th>
                                    <th className="px-4 py-3">Pembimbing</th>
                                    <th className="px-4 py-3">Status</th>
                                    <th className="px-4 py-3 text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {items?.data?.length === 0 && (
                                    <tr>
                                        <td colSpan={6} className="text-center py-6 text-gray-400">
                                            Belum ada data peserta PKL.
                                        </td>
                                    </tr>
                                )}
                                {items?.data?.map((item) => (
                                    <tr key={item.id} className="border-t border-gray-100">
                                        <td className="px-4 py-3">
                                            {item.full_name}
                                            {item.user && (
                                                <span className="block text-xs text-gray-400">@{item.user.username}</span>
                                            )}
                                        </td>
                                        <td className="px-4 py-3 text-gray-600">
                                            {item.institution_name}
                                            {item.major && <span className="block text-xs text-gray-400">{item.major}</span>}
                                        </td>
                                        <td className="px-4 py-3 text-gray-500 text-xs">
                                            {item.start_date?.substring(0, 10)} — {item.end_date?.substring(0, 10)}
                                        </td>
                                        <td className="px-4 py-3 text-gray-500 text-xs">
                                            {item.mentor_name || '-'}
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className={`px-2 py-1 rounded text-xs ${STATUS_BADGE[item.status]}`}>
                                                {STATUS_LABEL[item.status]}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-right whitespace-nowrap">
                                            {hasPermission('peserta-pkl', 'can_edit') && (
                                                <button onClick={() => openEditModal(item)} className="text-blue-600 hover:text-blue-800 mr-3">
                                                    <Pencil size={16} />
                                                </button>
                                            )}
                                            {hasPermission('peserta-pkl', 'can_delete') && (
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

            <PesertaPklFormModal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                onSubmit={handleSubmit}
                userOptions={userOptions}
                initialData={editingItem}
                submitting={submitting}
            />
        </div>
    );
}