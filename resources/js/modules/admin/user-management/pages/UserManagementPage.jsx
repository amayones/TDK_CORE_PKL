import { useState, useEffect, useCallback } from 'react';
import { Plus, Pencil, Trash2, Search, Loader2 } from 'lucide-react';
import { fetchUsers, fetchGroups, createUser, updateUser, deleteUser } from '../services/userService';
import UserFormModal from '../components/UserFormModal';
import { useMenu } from '../../../../core/MenuContext';

export default function UserManagementPage() {
    const { hasPermission } = useMenu();
    const [users, setUsers] = useState(null);
    const [groups, setGroups] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    const loadUsers = useCallback(async (searchTerm = '') => {
        setLoading(true);
        try {
            const data = await fetchUsers({ search: searchTerm });
            setUsers(data);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadUsers();
        fetchGroups().then(setGroups);
    }, [loadUsers]);

    const handleSearch = (e) => {
        e.preventDefault();
        loadUsers(search);
    };

    const openCreateModal = () => {
        setEditingUser(null);
        setModalOpen(true);
    };

    const openEditModal = (user) => {
        setEditingUser(user);
        setModalOpen(true);
    };

    const handleSubmit = async (form) => {
        setSubmitting(true);
        try {
            if (editingUser) {
                await updateUser(editingUser.id, form);
                window.__APP__.alert('User berhasil diupdate', 'success');
            } else {
                await createUser(form);
                window.__APP__.alert('User berhasil ditambahkan', 'success');
            }
            setModalOpen(false);
            loadUsers(search);
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (user) => {
        const confirmed = await window.__APP__.confirm({
            type: 'danger',
            title: 'Hapus User',
            message: `Apakah Anda yakin ingin menghapus user "${user.name}"?`,
            confirmText: 'Ya, Hapus',
            cancelText: 'Batal'
        });
        if (!confirmed) return;
        await deleteUser(user.id);
        window.__APP__.alert('User berhasil dihapus', 'success');
        loadUsers(search);
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-lg font-semibold text-gray-800">User Management</h2>
                    <p className="text-gray-500 text-sm">Kelola user dan akses group.</p>
                </div>
                {hasPermission('user-management', 'can_create') && (
                    <button
                        onClick={openCreateModal}
                        className="flex items-center gap-2 bg-blue-700 text-white px-4 py-2 rounded text-sm hover:bg-blue-800"
                    >
                        <Plus size={16} /> Tambah User
                    </button>
                )}
            </div>

            <form onSubmit={handleSearch} className="flex gap-2">
                <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Cari nama, username, atau email..."
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
                                <th className="px-4 py-3">Nama</th>
                                <th className="px-4 py-3">Username</th>
                                <th className="px-4 py-3">Email</th>
                                <th className="px-4 py-3">Group</th>
                                <th className="px-4 py-3">Status</th>
                                <th className="px-4 py-3 text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users?.data?.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="text-center py-6 text-gray-400">
                                        Tidak ada data user.
                                    </td>
                                </tr>
                            )}
                            {users?.data?.map((user) => (
                                <tr key={user.id} className="border-t border-gray-100">
                                    <td className="px-4 py-3">{user.name}</td>
                                    <td className="px-4 py-3">{user.username}</td>
                                    <td className="px-4 py-3">{user.email}</td>
                                    <td className="px-4 py-3">{user.group?.name || '-'}</td>
                                    <td className="px-4 py-3">
                                        <span className={`px-2 py-1 rounded text-xs ${
                                            user.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                                        }`}>
                                            {user.is_active ? 'Aktif' : 'Nonaktif'}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        {hasPermission('user-management', 'can_edit') && (
                                            <button
                                                onClick={() => openEditModal(user)}
                                                className="text-blue-600 hover:text-blue-800 mr-3"
                                            >
                                                <Pencil size={16} />
                                            </button>
                                        )}
                                        {hasPermission('user-management', 'can_delete') && (
                                            <button
                                                onClick={() => handleDelete(user)}
                                                className="text-red-600 hover:text-red-800"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            <UserFormModal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                onSubmit={handleSubmit}
                groups={groups}
                initialData={editingUser}
                submitting={submitting}
            />
        </div>
    );
}