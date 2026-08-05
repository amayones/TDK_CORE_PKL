import { useState, useEffect, useCallback } from 'react';
import { Plus, Pencil, Trash2, Loader2 } from 'lucide-react';
import { fetchInventoryList, createInventory, updateInventory, deleteInventory } from '../services/inventoryService';
import InventoryFormModal from '../components/InventoryFormModal';

export default function InventoryPage() {
    const [items, setItems] = useState(null);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    const loadItems = useCallback(async () => {
        setLoading(true);
        try {
            const data = await fetchInventoryList();
            setItems(data);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadItems();
    }, [loadItems]);

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
                await updateInventory(editingItem.id, form);
                window.__APP__.alert('Data inventory berhasil diupdate', 'success');
            } else {
                await createInventory(form);
                window.__APP__.alert('Data inventory berhasil ditambahkan', 'success');
            }
            setModalOpen(false);
            loadItems();
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (item) => {
        const confirmed = await window.__APP__.confirm({
            type: 'danger',
            title: 'Hapus Data Inventory',
            message: `Apakah Anda yakin ingin menghapus data "${item.name}"?`,
            confirmText: 'Ya, Hapus',
            cancelText: 'Batal'
        });
        if (!confirmed) return;
        await deleteInventory(item.id);
        window.__APP__.alert('Data inventory berhasil dihapus', 'success');
        loadItems();
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-lg font-semibold text-gray-800">Inventory</h2>
                    <p className="text-gray-500 text-sm">Kelola data inventory.</p>
                </div>
                <button
                    onClick={openCreateModal}
                    className="flex items-center gap-2 bg-blue-700 text-white px-4 py-2 rounded text-sm hover:bg-blue-800"
                >
                    <Plus size={16} /> Tambah Data
                </button>
            </div>

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
                                <th className="px-4 py-3">Deskripsi</th>
                                <th className="px-4 py-3 text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items?.data?.length === 0 && (
                                <tr>
                                    <td colSpan={3} className="text-center py-6 text-gray-400">
                                        Belum ada data.
                                    </td>
                                </tr>
                            )}
                            {items?.data?.map((item) => (
                                <tr key={item.id} className="border-t border-gray-100">
                                    <td className="px-4 py-3">{item.name}</td>
                                    <td className="px-4 py-3 text-gray-500">{item.description || '-'}</td>
                                    <td className="px-4 py-3 text-right">
                                        <button onClick={() => openEditModal(item)} className="text-blue-600 hover:text-blue-800 mr-3">
                                            <Pencil size={16} />
                                        </button>
                                        <button onClick={() => handleDelete(item)} className="text-red-600 hover:text-red-800">
                                            <Trash2 size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            <InventoryFormModal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                onSubmit={handleSubmit}
                initialData={editingItem}
                submitting={submitting}
            />
        </div>
    );
}