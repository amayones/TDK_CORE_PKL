import { useState, useEffect, useCallback } from 'react';
import { Plus, Pencil, Trash2, Search, Loader2, User, RefreshCw } from 'lucide-react';
import { fetchMyProfileList, createMyProfile, updateMyProfile, deleteMyProfile, activateMyProfile } from '../services/myProfileService';
import MyProfileFormModal from '../components/MyProfileFormModal';
import { useMenu } from '../../../core/MenuContext';

const STATUS_BADGE = {
    active: 'bg-green-100 text-green-700',
    completed: 'bg-blue-100 text-blue-700',
    terminated: 'bg-red-100 text-red-700',
};

const STATUS_LABEL = {
    active: 'Active',
    completed: 'Completed',
    terminated: 'Terminated',
};

export default function MyProfilePage() {
    const { hasPermission } = useMenu();
    const [items, setItems] = useState(null);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    const loadItems = useCallback(async (searchTerm = '') => {
        setLoading(true);
        try {
            const data = await fetchMyProfileList({ search: searchTerm });
            setItems(data);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadItems();
    }, [loadItems]);

    const handleSearch = (e) => {
        e.preventDefault();
        loadItems(search);
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
                await updateMyProfile(editingItem.id, form);
                window.__APP__.alert('Profil berhasil diupdate', 'success');
            } else {
                await createMyProfile(form);
                window.__APP__.alert('Profil berhasil dibuat', 'success');
            }
            setModalOpen(false);
            loadItems(search);
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (item) => {
        const confirmed = await window.__APP__.confirm({
            type: 'danger',
            title: 'Hapus Profil',
            message: `Apakah Anda yakin ingin menghapus profil "${item.full_name}"?`,
            confirmText: 'Ya, Hapus',
            cancelText: 'Batal'
        });
        if (!confirmed) return;
        await deleteMyProfile(item.id);
        window.__APP__.alert('Profil berhasil dihapus', 'success');
        loadItems(search);
    };

    const handleActivate = async (item) => {
        const confirmed = await window.__APP__.confirm({
            type: 'success',
            title: 'Aktifkan Profil',
            message: `Aktifkan profil "${item.full_name}"?`,
            confirmText: 'Ya, Aktifkan',
            cancelText: 'Batal'
        });
        if (!confirmed) return;
        await activateMyProfile(item.id);
        window.__APP__.alert('Profil berhasil diaktifkan', 'success');
        loadItems(search);
    };

    return (
        <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                <div>
                    <h2 className="text-lg font-semibold text-gray-800">My Profile</h2>
                    <p className="text-gray-500 text-sm">Lihat dan kelola profil Anda.</p>
                </div>
                {hasPermission('my-profile', 'can_create') && (
                    <button
                        onClick={openCreateModal}
                        className="flex items-center justify-center gap-2 bg-blue-700 text-white px-4 py-2 rounded text-sm hover:bg-blue-800 w-full sm:w-auto"
                    >
                        <Plus size={16} /> Tambah Profil
                    </button>
                )}
            </div>

            <form onSubmit={handleSearch} className="flex flex-wrap gap-2">
                <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Cari nama..."
                    className="border border-gray-300 rounded px-3 py-2 text-sm w-full max-w-sm"
                />
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
                                    <th className="px-4 py-3">Institusi</th>
                                    <th className="px-4 py-3">Periode</th>
                                    <th className="px-4 py-3">Status</th>
                                    <th className="px-4 py-3 text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {items?.data?.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="text-center py-6 text-gray-400">
                                            Belum ada profil.
                                        </td>
                                    </tr>
                                )}
                                {items?.data?.map((item) => (
                                    <tr key={item.id} className="border-t border-gray-100">
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-2">
                                                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                                                    <User size={16} className="text-blue-700" />
                                                </div>
                                                <div>
                                                    <div className="font-medium text-xs">{item.full_name}</div>
                                                    <div className="text-gray-500 text-xs">{item.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-gray-600 text-xs">
                                            {item.institution_name || '-'}
                                        </td>
                                        <td className="px-4 py-3 text-gray-500 text-xs">
                                            {item.start_date && item.end_date 
                                                ? `${item.start_date?.substring(0, 10)} - ${item.end_date?.substring(0, 10)}`
                                                : item.start_date?.substring(0, 10) || '-'
                                            }
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className={`px-2 py-1 rounded text-xs ${STATUS_BADGE[item.status]}`}>
                                                {STATUS_LABEL[item.status]}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-right whitespace-nowrap">
                                            {hasPermission('my-profile', 'can_edit') && (
                                                <button onClick={() => openEditModal(item)} className="text-blue-600 hover:text-blue-800 mr-3">
                                                    <Pencil size={16} />
                                                </button>
                                            )}
                                            {item.status !== 'active' && hasPermission('my-profile', 'can_edit') && (
                                                <button onClick={() => handleActivate(item)} className="text-green-600 hover:text-green-800 mr-3" title="Aktifkan">
                                                    <RefreshCw size={16} />
                                                </button>
                                            )}
                                            {hasPermission('my-profile', 'can_delete') && (
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

            <MyProfileFormModal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                onSubmit={handleSubmit}
                initialData={editingItem}
                submitting={submitting}
            />
        </div>
    );
}