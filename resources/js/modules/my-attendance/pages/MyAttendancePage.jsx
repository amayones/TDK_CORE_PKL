import { useState, useEffect, useCallback } from 'react';
import { Plus, Pencil, Trash2, Search, Loader2, Clock, Check } from 'lucide-react';
import { fetchMyAttendanceList, createMyAttendance, updateMyAttendance, deleteMyAttendance, approveMyAttendance } from '../services/myAttendanceService';
import MyAttendanceFormModal from '../components/MyAttendanceFormModal';
import { useMenu } from '../../../core/MenuContext';
import { useAuth } from '../../../core/AuthContext';

const STATUS_BADGE = {
    hadir: 'bg-green-100 text-green-700',
    izin: 'bg-blue-100 text-blue-700',
    sakit: 'bg-orange-100 text-orange-700',
    alpha: 'bg-red-100 text-red-700',
};

const STATUS_LABEL = {
    hadir: 'Hadir',
    izin: 'Izin',
    sakit: 'Sakit',
    alpha: 'Alpha',
};

export default function MyAttendancePage() {
    const { hasPermission } = useMenu();
    const { user } = useAuth();
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
            const data = await fetchMyAttendanceList({ search: searchTerm, status });
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
                await updateMyAttendance(editingItem.id, form);
                window.__APP__.alert('Absensi berhasil diupdate', 'success');
            } else {
                await createMyAttendance(form);
                window.__APP__.alert('Absensi berhasil ditambahkan', 'success');
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
            title: 'Hapus Absensi',
            message: `Apakah Anda yakin ingin menghapus absensi "${item.attendance_date}"?`,
            confirmText: 'Ya, Hapus',
            cancelText: 'Batal'
        });
        if (!confirmed) return;
        await deleteMyAttendance(item.id);
        window.__APP__.alert('Absensi berhasil dihapus', 'success');
        loadItems(search, statusFilter);
    };

    const handleApprove = async (item) => {
        const confirmed = await window.__APP__.confirm({
            type: 'success',
            title: 'Setujui Absensi',
            message: `Setujui absensi "${item.attendance_date}"?`,
            confirmText: 'Ya, Setujui',
            cancelText: 'Batal'
        });
        if (!confirmed) return;
        await approveMyAttendance(item.id);
        window.__APP__.alert('Absensi berhasil disetujui', 'success');
        loadItems(search, statusFilter);
    };

    return (
        <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                <div>
                    <h2 className="text-lg font-semibold text-gray-800">My Attendance</h2>
                    <p className="text-gray-500 text-sm">Kelola kehadiran dan absensi Anda.</p>
                </div>
                {hasPermission('my-attendance', 'can_create') && (
                    <button
                        onClick={openCreateModal}
                        className="flex items-center justify-center gap-2 bg-blue-700 text-white px-4 py-2 rounded text-sm hover:bg-blue-800 w-full sm:w-auto"
                    >
                        <Plus size={16} /> Tambah Absensi
                    </button>
                )}
            </div>

            <form onSubmit={handleSearch} className="flex flex-wrap gap-2">
                <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Cari..."
                    className="border border-gray-300 rounded px-3 py-2 text-sm w-full max-w-sm"
                />
                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="border border-gray-300 rounded px-3 py-2 text-sm"
                >
                    <option value="">Semua Status</option>
                    <option value="hadir">Hadir</option>
                    <option value="izin">Izin</option>
                    <option value="sakit">Sakit</option>
                    <option value="alpha">Alpha</option>
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
                                    <th className="px-4 py-3">Tanggal</th>
                                    <th className="px-4 py-3">Check In</th>
                                    <th className="px-4 py-3">Check Out</th>
                                    <th className="px-4 py-3">Status</th>
                                    <th className="px-4 py-3">Disetujui</th>
                                    <th className="px-4 py-3 text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {items?.data?.length === 0 && (
                                    <tr>
                                        <td colSpan={6} className="text-center py-6 text-gray-400">
                                            Belum ada absensi.
                                        </td>
                                    </tr>
                                )}
                                {items?.data?.map((item) => (
                                    <tr key={item.id} className="border-t border-gray-100">
                                        <td className="px-4 py-3 text-xs">
                                            {item.attendance_date?.substring(0, 10)}
                                        </td>
                                        <td className="px-4 py-3 text-xs">
                                            {item.check_in || '-'}
                                        </td>
                                        <td className="px-4 py-3 text-xs">
                                            {item.check_out || '-'}
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className={`px-2 py-1 rounded text-xs ${STATUS_BADGE[item.status]}`}>
                                                {STATUS_LABEL[item.status]}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-xs">
                                            {item.approved_by ? (
                                                <span className="text-green-600">
                                                    <Check size={14} /> {item.approver?.full_name || 'Disetujui'}
                                                </span>
                                            ) : (
                                                <span className="text-gray-400">Belum</span>
                                            )}
                                        </td>
                                        <td className="px-4 py-3 text-right whitespace-nowrap">
                                            {hasPermission('my-attendance', 'can_edit') && (
                                                <button onClick={() => openEditModal(item)} className="text-blue-600 hover:text-blue-800 mr-3">
                                                    <Pencil size={16} />
                                                </button>
                                            )}
                                            {!item.approved_by && hasPermission('my-attendance', 'can_edit') && (
                                                <button onClick={() => handleApprove(item)} className="text-green-600 hover:text-green-800 mr-3" title="Setujui">
                                                    <Check size={16} />
                                                </button>
                                            )}
                                            {hasPermission('my-attendance', 'can_delete') && (
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

            <MyAttendanceFormModal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                onSubmit={handleSubmit}
                initialData={editingItem}
                submitting={submitting}
            />
        </div>
    );
}
