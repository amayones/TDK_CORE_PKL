import { useState, useEffect, useCallback } from 'react';
import { Plus, Pencil, Trash2, Search, Loader2, Users } from 'lucide-react';
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
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">User Management</h2>
                    <p className="text-gray-400 text-sm mt-1">Kelola user, group, dan status akun dalam satu tempat.</p>
                </div>
                {hasPermission('user-management', 'can_create') && (
                    <button
                        onClick={openCreateModal}
                        className="flex items-center gap-2 text-white px-4 py-2 rounded-xl text-sm font-medium shadow-sm hover:opacity-90 transition-opacity shrink-0"
                        style={{ background: 'linear-gradient(135deg, #30AFFF, #CFECF3)' }}
                    >
                        <Plus size={16} /> Tambah User
                    </button>
                )}
            </div>

            {/* Search + Table Card */}
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                {/* Search bar */}
                <div className="px-5 py-4 border-b border-gray-100 flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
                    <form onSubmit={handleSearch} className="flex gap-2 w-full sm:max-w-sm">
                        <div className="relative flex-1">
                            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Cari nama, username, atau email..."
                                className="w-full border border-gray-200 rounded-xl pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#30AFFF]"
                            />
                        </div>
                        <button
                            type="submit"
                            className="text-white px-4 py-2 rounded-xl text-sm font-medium hover:opacity-90 transition-opacity"
                            style={{ background: 'linear-gradient(135deg, #30AFFF, #CFECF3)' }}
                        >
                            Cari
                        </button>
                    </form>
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                        <Users size={15} />
                        <span>{users?.data?.length ?? 0} user</span>
                    </div>
                </div>

                {/* Table */}
                {loading ? (
                    <div className="flex justify-center py-14">
                        <Loader2 className="animate-spin" size={28} style={{ color: '#30AFFF' }} />
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wide">
                                    <th className="px-5 py-3 text-left font-semibold">User</th>
                                    <th className="px-5 py-3 text-left font-semibold">Username</th>
                                    <th className="px-5 py-3 text-left font-semibold">Email</th>
                                    <th className="px-5 py-3 text-left font-semibold">Group</th>
                                    <th className="px-5 py-3 text-left font-semibold">Status</th>
                                    <th className="px-5 py-3 text-right font-semibold">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {users?.data?.length === 0 && (
                                    <tr>
                                        <td colSpan={6} className="text-center py-12 text-gray-400">
                                            Tidak ada data user.
                                        </td>
                                    </tr>
                                )}
                                {users?.data?.map((user) => (
                                    <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                                        {/* Nama dengan avatar */}
                                        <td className="px-5 py-3.5">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
                                                    style={{ background: 'linear-gradient(135deg, #30AFFF, #CFECF3)' }}>
                                                    {user.name?.charAt(0)?.toUpperCase()}
                                                </div>
                                                <span className="font-medium text-gray-800">{user.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-5 py-3.5 text-gray-500">{user.username}</td>
                                        <td className="px-5 py-3.5 text-gray-500">{user.email}</td>
                                        {/* Group badge */}
                                        <td className="px-5 py-3.5">
                                            {user.group?.name ? (
                                                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-50 text-blue-600 border border-blue-100">
                                                    {user.group.name}
                                                </span>
                                            ) : (
                                                <span className="text-gray-400">-</span>
                                            )}
                                        </td>
                                        {/* Status badge */}
                                        <td className="px-5 py-3.5">
                                            <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${
                                                user.is_active
                                                    ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                                                    : 'bg-gray-100 text-gray-500 border border-gray-200'
                                            }`}>
                                                <span className={`w-1.5 h-1.5 rounded-full ${user.is_active ? 'bg-emerald-500' : 'bg-gray-400'}`} />
                                                {user.is_active ? 'Aktif' : 'Nonaktif'}
                                            </span>
                                        </td>
                                        {/* Aksi */}
                                        <td className="px-5 py-3.5 text-right">
                                            <div className="flex items-center justify-end gap-1">
                                                {hasPermission('user-management', 'can_edit') && (
                                                    <button
                                                        onClick={() => openEditModal(user)}
                                                        className="p-1.5 rounded-lg text-blue-500 hover:bg-blue-50 transition-colors"
                                                        title="Edit"
                                                    >
                                                        <Pencil size={15} />
                                                    </button>
                                                )}
                                                {hasPermission('user-management', 'can_delete') && (
                                                    <button
                                                        onClick={() => handleDelete(user)}
                                                        className="p-1.5 rounded-lg text-red-400 hover:bg-red-50 transition-colors"
                                                        title="Hapus"
                                                    >
                                                        <Trash2 size={15} />
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
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
