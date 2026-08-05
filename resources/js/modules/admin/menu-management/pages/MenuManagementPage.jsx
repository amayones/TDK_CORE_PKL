import { useState, useEffect, useCallback } from 'react';
import { Plus, Pencil, Trash2, Loader2 } from 'lucide-react';
import { fetchAllMenus, fetchTopLevelMenus, createMenu, updateMenu, deleteMenu } from '../services/menuManagementService';
import MenuFormModal from '../components/MenuFormModal';
import { useMenu } from '../../../../core/MenuContext';

export default function MenuManagementPage() {
    const { hasPermission } = useMenu();
    const [menus, setMenus] = useState([]);
    const [topLevelMenus, setTopLevelMenus] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [editingMenu, setEditingMenu] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [deleteError, setDeleteError] = useState('');
    const [generateModalOpen, setGenerateModalOpen] = useState(false);
    const [generating, setGenerating] = useState(false);
    const [genForm, setGenForm] = useState({ module_key: '', studly_name: '', table_name: '' });

    const loadData = useCallback(async () => {
        setLoading(true);
        try {
            const [menusData, topLevelData] = await Promise.all([
                fetchAllMenus(),
                fetchTopLevelMenus(),
            ]);
            setMenus(menusData);
            setTopLevelMenus(topLevelData);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const openCreateModal = () => {
        setEditingMenu(null);
        setModalOpen(true);
    };

    const openEditModal = (menu) => {
        setEditingMenu(menu);
        setModalOpen(true);
    };

    const handleSubmit = async (form) => {
        setSubmitting(true);
        try {
            const payload = { ...form, parent_id: form.parent_id || null };
            if (editingMenu) {
                await updateMenu(editingMenu.id, payload);
                window.__APP__.alert('Menu berhasil diupdate', 'success');
            } else {
                await createMenu(payload);
                window.__APP__.alert('Menu berhasil ditambahkan', 'success');
            }
            setModalOpen(false);
            loadData();
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (menu) => {
        const confirmed = await window.__APP__.confirm({
            type: 'danger',
            title: 'Hapus Menu',
            message: `Apakah Anda yakin ingin menghapus menu "${menu.name}"?`,
            confirmText: 'Ya, Hapus',
            cancelText: 'Batal'
        });
        if (!confirmed) return;
        setDeleteError('');
        try {
            await deleteMenu(menu.id);
            window.__APP__.alert('Menu berhasil dihapus', 'success');
            loadData();
        } catch (err) {
            const message = err.response?.data?.errors?.module_key?.[0] || 'Gagal menghapus menu.';
            setDeleteError(message);
        }
    };

    const handleGenerateModule = async (e) => {
        e.preventDefault();
        setGenerating(true);
        try {
            await window.__APP__.axios.post('/admin/menus/generate-module', genForm);
            window.__APP__.alert('Module berhasil dibuat', 'success');
            setGenerateModalOpen(false);
            setGenForm({ module_key: '', studly_name: '', table_name: '' });
        } catch (err) {
            const msg = err.response?.data?.message || 'Gagal membuat module.';
            window.__APP__.alert(msg, 'error');
        } finally {
            setGenerating(false);
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-lg font-semibold text-gray-800">Menu Management</h2>
                    <p className="text-gray-500 text-sm">Kelola struktur menu sidebar aplikasi.</p>
                </div>
                {hasPermission('menu-management', 'can_create') && (
                    <div className="flex gap-2">
                        <button
                            onClick={openCreateModal}
                            className="flex items-center gap-2 bg-blue-700 text-white px-4 py-2 rounded text-sm hover:bg-blue-800"
                        >
                            <Plus size={16} /> Tambah Menu
                        </button>
                        <button
                            onClick={() => setGenerateModalOpen(true)}
                            className="flex items-center gap-2 bg-green-700 text-white px-4 py-2 rounded text-sm hover:bg-green-800"
                        >
                            <Plus size={16} /> Generate Module
                        </button>
                    </div>
                )}
            </div>

            {deleteError && (
                <div className="bg-red-100 text-red-700 text-sm px-4 py-2 rounded">
                    {deleteError}
                </div>
            )}

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
                                <th className="px-4 py-3">Module Key</th>
                                <th className="px-4 py-3">Route Path</th>
                                <th className="px-4 py-3">Induk</th>
                                <th className="px-4 py-3">Urutan</th>
                                <th className="px-4 py-3">Status</th>
                                <th className="px-4 py-3 text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {menus.length === 0 && (
                                <tr>
                                    <td colSpan={7} className="text-center py-6 text-gray-400">
                                        Tidak ada data menu.
                                    </td>
                                </tr>
                            )}
                            {menus.map((menu) => (
                                <tr key={menu.id} className="border-t border-gray-100">
                                    <td className="px-4 py-3">
                                        {menu.parent_id && <span className="text-gray-300 mr-1">↳</span>}
                                        {menu.name}
                                    </td>
                                    <td className="px-4 py-3">
                                        <code className="bg-gray-100 px-2 py-1 rounded text-xs">{menu.module_key}</code>
                                    </td>
                                    <td className="px-4 py-3 text-gray-500 text-xs">{menu.route_path}</td>
                                    <td className="px-4 py-3 text-gray-500">{menu.parent?.name || '-'}</td>
                                    <td className="px-4 py-3">{menu.sort_order}</td>
                                    <td className="px-4 py-3">
                                        <span className={`px-2 py-1 rounded text-xs ${
                                            menu.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                                        }`}>
                                            {menu.is_active ? 'Aktif' : 'Nonaktif'}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        {hasPermission('menu-management', 'can_edit') && (
                                            <button
                                                onClick={() => openEditModal(menu)}
                                                className="text-blue-600 hover:text-blue-800 mr-3"
                                            >
                                                <Pencil size={16} />
                                            </button>
                                        )}
                                        {hasPermission('menu-management', 'can_delete') && (
                                            <button
                                                onClick={() => handleDelete(menu)}
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

            <MenuFormModal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                onSubmit={handleSubmit}
                topLevelMenus={topLevelMenus}
                initialData={editingMenu}
                submitting={submitting}
            />

            {generateModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg">
                        <h3 className="text-lg font-semibold mb-4">Generate Module Baru</h3>
                        <form onSubmit={handleGenerateModule} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Module Key</label>
                                <input
                                    type="text"
                                    required
                                    value={genForm.module_key}
                                    onChange={(e) => setGenForm({ ...genForm, module_key: e.target.value })}
                                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                                    placeholder="contoh: inventory"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Studly Name</label>
                                <input
                                    type="text"
                                    required
                                    value={genForm.studly_name}
                                    onChange={(e) => setGenForm({ ...genForm, studly_name: e.target.value })}
                                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                                    placeholder="contoh: Inventory"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Table Name</label>
                                <input
                                    type="text"
                                    required
                                    value={genForm.table_name}
                                    onChange={(e) => setGenForm({ ...genForm, table_name: e.target.value })}
                                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                                    placeholder="contoh: inventory"
                                />
                            </div>
                            <div className="flex justify-end gap-2">
                                <button
                                    type="button"
                                    onClick={() => setGenerateModalOpen(false)}
                                    className="px-4 py-2 text-sm border border-gray-300 rounded hover:bg-gray-50"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={generating}
                                    className="px-4 py-2 text-sm bg-green-700 text-white rounded hover:bg-green-800 disabled:opacity-50"
                                >
                                    {generating ? 'Membuat...' : 'Generate Module'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
