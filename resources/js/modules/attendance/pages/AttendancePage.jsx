import { useState, useEffect, useCallback } from 'react';
import { Plus, Pencil, Trash2, Search, Loader2, CheckCircle } from 'lucide-react';
import { fetchAttendanceList, fetchOptions, createAttendance, updateAttendance, deleteAttendance, approveAttendance } from '../services/attendanceService';
import AttendanceFormModal from '../components/AttendanceFormModal';
import { useMenu } from '../../../core/MenuContext';

const STATUS_BADGE = {
    present: 'bg-green-100 text-green-700',
    sick: 'bg-yellow-100 text-yellow-700',
    leave: 'bg-blue-100 text-blue-700',
    absent: 'bg-red-100 text-red-700',
};

const STATUS_LABEL = {
    present: 'Hadir',
    sick: 'Sakit',
    leave: 'Izin',
    absent: 'Absen',
};

export default function AttendancePage() {
    const { hasPermission } = useMenu();
    const [items, setItems] = useState(null);
    const [options, setOptions] = useState([]);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [dateFrom, setDateFrom] = useState('');
    const [dateTo, setDateTo] = useState('');
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    const loadItems = useCallback(async (searchTerm = '', status = '', from = '', to = '') => {
        setLoading(true);
        try {
            const data = await fetchAttendanceList({ search: searchTerm, status, date_from: from, date_to: to });
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
        loadItems(search, statusFilter, dateFrom, dateTo);
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
                await updateAttendance(editingItem.id, form);
                window.__APP__.alert('Absensi berhasil diupdate', 'success');
            } else {
                await createAttendance(form);
                window.__APP__.alert('Absensi berhasil ditambahkan', 'success');
            }
            setModalOpen(false);
            loadItems(search, statusFilter, dateFrom, dateTo);
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (item) => {
        const confirmed = await window.__APP__.confirm({
            type: 'danger',
            title: 'Hapus Absensi',
            message: `Apakah Anda yakin ingin menghapus absensi "${item.peserta_pkl?.full_name}" tanggal ${item.date}?`,
            confirmText: 'Ya, Hapus',
            cancelText: 'Batal'
        });
        if (!confirmed) return;
        await deleteAttendance(item.id);
        window.__APP__.alert('Absensi berhasil dihapus', 'success');
        loadItems(search, statusFilter, dateFrom, dateTo);
    };

    const handleApprove = async (item) => {
        const confirmed = await window.__APP__.confirm({
            type: 'info',
            title: 'Setujui Absensi',
            message: `Setujui absensi "${item.peserta_pkl?.full_name}" tanggal ${item.date}?`,
            confirmText: 'Ya, Setujui',
            cancelText: 'Batal'
        });
        if (!confirmed) return;
        await approveAttendance(item.id);
        window.__APP__.alert('Absensi disetujui', 'success');
        loadItems(search, statusFilter, dateFrom, dateTo);
    };

    return (
        <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                <div>
                    <h2 className="text-lg font-semibold text-gray-800">Absensi</h2>
                    <p className="text-gray-500 text-sm">Rekap kehadiran harian peserta PKL.</p>
                </div>
                {hasPermission('attendance', 'can_create') && (
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
                    placeholder="Cari nama peserta..."
                    className="border border-gray-300 rounded px-3 py-2 text-sm w-full max-w-sm"
                />
                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="border border-gray-300 rounded px-3 py-2 text-sm"
                >
                    <option value="">Semua Status</option>
                    <option value="present">Hadir</option>
                    <option value="sick">Sakit</option>
                    <option value="leave">Izin</option>
                    <option value="absent">Absen</option>
                </select>
                <input
                    type="date"
                    value={dateFrom}
                    onChange={(e) => setDateFrom(e.target.value)}
                    className="border border-gray-300 rounded px-3 py-2 text-sm"
                    placeholder="Dari tanggal"
                />
                <input
                    type="date"
                    value={dateTo}
                    onChange={(e) => setDateTo(e.target.value)}
                    className="border border-gray-300 rounded px-3 py-2 text-sm"
                    placeholder="Sampai tanggal"
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
                                    <th className="px-4 py-3">Tanggal</th>
                                    <th className="px-4 py-3">Peserta</th>
                                    <th className="px-4 py-3">Status</th>
                                    <th className="px-4 py-3">Catatan</th>
                                    <th className="px-4 py-3">Disetujui</th>
                                    <th className="px-4 py-3 text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {items?.data?.length === 0 && (
                                    <tr>
                                        <td colSpan={6} className="text-center py-6 text-gray-400">
                                            Belum ada data absensi.
                                        </td>
                                    </tr>
                                )}
                                {items?.data?.map((item) => (
                                    <tr key={item.id} className="border-t border-gray-100">
                                        <td className="px-4 py-3 text-gray-600">
                                            {item.date?.substring(0, 10)}
                                        </td>
                                        <td className="px-4 py-3 font-medium">
                                            {item.peserta_pkl?.full_name || '-'}
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className={`px-2 py-1 rounded text-xs ${STATUS_BADGE[item.status]}`}>
                                                {STATUS_LABEL[item.status]}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-gray-500 text-xs">
                                            {item.notes || '-'}
                                        </td>
                                        <td className="px-4 py-3 text-xs">
                                            {item.approved_at ? (
                                                <span className="text-green-700">
                                                    {item.approver?.name || 'Ya'}
                                                </span>
                                            ) : (
                                                <span className="text-gray-400">Belum</span>
                                            )}
                                        </td>
                                        <td className="px-4 py-3 text-right whitespace-nowrap">
                                            {hasPermission('attendance', 'can_edit') && !item.approved_at && (
                                                <button onClick={() => openEditModal(item)} className="text-blue-600 hover:text-blue-800 mr-3">
                                                    <Pencil size={16} />
                                                </button>
                                            )}
                                            {hasPermission('attendance', 'can_edit') && !item.approved_at && (
                                                <button onClick={() => handleApprove(item)} className="text-green-600 hover:text-green-800 mr-3">
                                                    <CheckCircle size={16} />
                                                </button>
                                            )}
                                            {hasPermission('attendance', 'can_delete') && !item.approved_at && (
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

            <AttendanceFormModal
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