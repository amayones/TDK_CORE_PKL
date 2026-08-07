import { useState, useEffect, useCallback } from 'react';
import { Plus, Pencil, Trash2, Search, Loader2, CheckCircle2 } from 'lucide-react';
import { fetchMyTaskList, createMyTask, updateMyTask, deleteMyTask, completeMyTask } from '../services/myTaskService';
import MyTaskFormModal from '../components/MyTaskFormModal';
import { useMenu } from '../../../core/MenuContext';

const STATUS_BADGE = {
    pending: 'bg-gray-100 text-gray-600',
    in_progress: 'bg-blue-100 text-blue-700',
    completed: 'bg-green-100 text-green-700',
};

const STATUS_LABEL = {
    pending: 'Pending',
    in_progress: 'In Progress',
    completed: 'Completed',
};

export default function MyTaskPage() {
    const { hasPermission } = useMenu();
    const [items, setItems] = useState(null);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    const loadItems = useCallback(async (searchTerm = '', status = '') => {
        setLoading(true);
        try {
            const data = await fetchMyTaskList({ search: searchTerm, status });
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
                await updateMyTask(editingItem.id, form);
                window.__APP__.alert('Task berhasil diupdate', 'success');
            } else {
                await createMyTask(form);
                window.__APP__.alert('Task berhasil ditambahkan', 'success');
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
            title: 'Hapus Task',
            message: `Apakah Anda yakin ingin menghapus task "${item.title}"?`,
            confirmText: 'Ya, Hapus',
            cancelText: 'Batal'
        });
        if (!confirmed) return;
        await deleteMyTask(item.id);
        window.__APP__.alert('Task berhasil dihapus', 'success');
        loadItems(search, statusFilter);
    };

    const handleComplete = async (item) => {
        const confirmed = await window.__APP__.confirm({
            type: 'success',
            title: 'Selesaikan Task',
            message: `Tandai task "${item.title}" sebagai completed?`,
            confirmText: 'Ya, Selesaikan',
            cancelText: 'Batal'
        });
        if (!confirmed) return;
        await completeMyTask(item.id);
        window.__APP__.alert('Task berhasil diselesaikan', 'success');
        loadItems(search, statusFilter);
    };

    return (
        <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                <div>
                    <h2 className="text-lg font-semibold text-gray-800">My Task</h2>
                    <p className="text-gray-500 text-sm">Kelola tugas yang diberikan kepada Anda.</p>
                </div>
                {hasPermission('my-task', 'can_create') && (
                    <button
                        onClick={openCreateModal}
                        className="flex items-center justify-center gap-2 bg-blue-700 text-white px-4 py-2 rounded text-sm hover:bg-blue-800 w-full sm:w-auto"
                    >
                        <Plus size={16} /> Tambah Task
                    </button>
                )}
            </div>

            <form onSubmit={handleSearch} className="flex flex-wrap gap-2">
                <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Cari task..."
                    className="border border-gray-300 rounded px-3 py-2 text-sm w-full max-w-sm"
                />
                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="border border-gray-300 rounded px-3 py-2 text-sm"
                >
                    <option value="">Semua Status</option>
                    <option value="pending">Pending</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
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
                                    <th className="px-4 py-3">Task</th>
                                    <th className="px-4 py-3">Progress</th>
                                    <th className="px-4 py-3">Status</th>
                                    <th className="px-4 py-3 text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {items?.data?.length === 0 && (
                                    <tr>
                                        <td colSpan={4} className="text-center py-6 text-gray-400">
                                            Belum ada task.
                                        </td>
                                    </tr>
                                )}
                                {items?.data?.map((item) => (
                                    <tr key={item.id} className="border-t border-gray-100">
                                        <td className="px-4 py-3">
                                            <div className="font-medium text-xs">{item.title}</div>
                                            <div className="text-gray-500 text-xs mt-1">{item.description}</div>
                                            {item.task_assignment_id && (
                                                <span className="text-xs text-gray-400 mt-1 inline-block">
                                                    Dari: {item.taskAssignment?.title || 'Task Assignment'}
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-2">
                                                <div className="flex-1 bg-gray-200 rounded-full h-2 max-w-[100px]">
                                                    <div 
                                                        className="bg-blue-600 h-2 rounded-full" 
                                                        style={{ width: `${item.progress}%` }}
                                                    />
                                                </div>
                                                <span className="text-xs text-gray-600">{item.progress}%</span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className={`px-2 py-1 rounded text-xs ${STATUS_BADGE[item.status]}`}>
                                                {STATUS_LABEL[item.status]}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-right whitespace-nowrap">
                                            {hasPermission('my-task', 'can_edit') && item.status !== 'completed' && (
                                                <>
                                                    <button onClick={() => openEditModal(item)} className="text-blue-600 hover:text-blue-800 mr-3">
                                                        <Pencil size={16} />
                                                    </button>
                                                    <button onClick={() => handleComplete(item)} className="text-green-600 hover:text-green-800 mr-3" title="Selesaikan">
                                                        <CheckCircle2 size={16} />
                                                    </button>
                                                </>
                                            )}
                                            {hasPermission('my-task', 'can_delete') && item.status !== 'completed' && (
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

            <MyTaskFormModal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                onSubmit={handleSubmit}
                initialData={editingItem}
                submitting={submitting}
            />
        </div>
    );
}