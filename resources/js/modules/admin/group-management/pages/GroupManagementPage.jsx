import { useState, useEffect, useCallback } from 'react';
import { Plus, Pencil, Trash2, Search, Loader2 } from 'lucide-react';
import { fetchGroupsList, createGroup, updateGroup, deleteGroup } from '../services/groupService';
import GroupFormModal from '../components/GroupFormModal';

export default function GroupManagementPage() {
    const [groups, setGroups] = useState(null);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [editingGroup, setEditingGroup] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [deleteError, setDeleteError] = useState('');

    const loadGroups = useCallback(async (searchTerm = '') => {
        setLoading(true);
        try {
            const data = await fetchGroupsList({ search: searchTerm });
            setGroups(data);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadGroups();
    }, [loadGroups]);

    const handleSearch = (e) => {
        e.preventDefault();
        loadGroups(search);
    };

    const openCreateModal = () => {
        setEditingGroup(null);
        setModalOpen(true);
    };

    const openEditModal = (group) => {
        setEditingGroup(group);
        setModalOpen(true);
    };

    const handleSubmit = async (form) => {
        setSubmitting(true);
        try {
            if (editingGroup) {
                await updateGroup(editingGroup.id, form);
            } else {
                await createGroup(form);
            }
            setModalOpen(false);
            loadGroups(search);
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (group) => {
        if (!confirm(`Hapus group "${group.name}"?`)) return;
        setDeleteError('');
        try {
            await deleteGroup(group.id);
            loadGroups(search);
        } catch (err) {
            const message = err.response?.data?.errors?.code?.[0] || 'Gagal menghapus group.';
            setDeleteError(message);
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-lg font-semibold text-gray-800">Group Management</h2>
                    <p className="text-gray-500 text-sm">Kelola group hak akses.</p>
                </div>
                <button
                    onClick={openCreateModal}
                    className="flex items-center gap-2 bg-blue-700 text-white px-4 py-2 rounded text-sm hover:bg-blue-800"
                >
                    <Plus size={16} /> Tambah Group
                </button>
            </div>

            {deleteError && (
                <div className="bg-red-100 text-red-700 text-sm px-4 py-2 rounded">
                    {deleteError}
                </div>
            )}

            <form onSubmit={handleSearch} className="flex gap-2">
                <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Cari kode atau nama group..."
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
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50 text-gray-600 text-left">
                            <tr>
                                <th className="px-4 py-3">Kode</th>
                                <th className="px-4 py-3">Nama</th>
                                <th className="px-4 py-3">Deskripsi</th>
                                <th className="px-4 py-3">Jumlah User</th>
                                <th className="px-4 py-3">Status</th>
                                <th className="px-4 py-3 text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {groups?.data?.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="text-center py-6 text-gray-400">
                                        Tidak ada data group.
                                    </td>
                                </tr>
                            )}
                            {groups?.data?.map((group) => (
                                <tr key={group.id} className="border-t border-gray-100">
                                    <td className="px-4 py-3">
                                        <code className="bg-gray-100 px-2 py-1 rounded text-xs">{group.code}</code>
                                    </td>
                                    <td className="px-4 py-3">{group.name}</td>
                                    <td className="px-4 py-3 text-gray-500">{group.description || '-'}</td>
                                    <td className="px-4 py-3">{group.users_count} user</td>
                                    <td className="px-4 py-3">
                                        <span className={`px-2 py-1 rounded text-xs ${
                                            group.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                                        }`}>
                                            {group.is_active ? 'Aktif' : 'Nonaktif'}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        <button
                                            onClick={() => openEditModal(group)}
                                            className="text-blue-600 hover:text-blue-800 mr-3"
                                        >
                                            <Pencil size={16} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(group)}
                                            className="text-red-600 hover:text-red-800"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            <GroupFormModal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                onSubmit={handleSubmit}
                initialData={editingGroup}
                submitting={submitting}
            />
        </div>
    );
}