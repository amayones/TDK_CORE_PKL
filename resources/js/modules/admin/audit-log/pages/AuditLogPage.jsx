import { useState, useEffect, useCallback } from 'react';
import { Loader2, Eye, Filter } from 'lucide-react';
import { fetchAuditLogs, fetchFilterOptions, fetchAuditLogDetail } from '../services/auditLogService';
import LogDetailModal from '../components/LogDetailModal';

export default function AuditLogPage() {
    const [logs, setLogs] = useState(null);
    const [filterOptions, setFilterOptions] = useState({ modules: [], actions: [] });
    const [filters, setFilters] = useState({ module: '', action: '', date_from: '', date_to: '' });
    const [loading, setLoading] = useState(true);
    const [selectedLog, setSelectedLog] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);

    const loadLogs = useCallback(async (activeFilters = {}) => {
        setLoading(true);
        try {
            const data = await fetchAuditLogs(activeFilters);
            setLogs(data);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadLogs();
        fetchFilterOptions().then(setFilterOptions);
    }, [loadLogs]);

    const handleFilterChange = (e) => {
        setFilters((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const applyFilters = (e) => {
        e.preventDefault();
        loadLogs(filters);
    };

    const resetFilters = () => {
        setFilters({ module: '', action: '', date_from: '', date_to: '' });
        loadLogs({});
    };

    const openDetail = async (log) => {
        const detail = await fetchAuditLogDetail(log.id);
        setSelectedLog(detail);
        setModalOpen(true);
    };

    const actionBadgeColor = (action) => {
        const map = {
            CREATE: 'bg-green-100 text-green-700',
            UPDATE: 'bg-blue-100 text-blue-700',
            DELETE: 'bg-red-100 text-red-700',
            LOGIN: 'bg-purple-100 text-purple-700',
            LOGOUT: 'bg-gray-100 text-gray-600',
        };
        return map[action] || 'bg-gray-100 text-gray-600';
    };

    return (
        <div className="space-y-4">
            <div>
                <h2 className="text-lg font-semibold text-gray-800">Audit Log</h2>
                <p className="text-gray-500 text-sm">Riwayat aktivitas seluruh user di sistem.</p>
            </div>

            <form onSubmit={applyFilters} className="bg-white rounded-lg shadow p-4 flex flex-wrap gap-3 items-end">
                <div>
                    <label className="block text-xs text-gray-500 mb-1">Modul</label>
                    <select
                        name="module"
                        value={filters.module}
                        onChange={handleFilterChange}
                        className="border border-gray-300 rounded px-3 py-2 text-sm"
                    >
                        <option value="">Semua Modul</option>
                        {filterOptions.modules.map((m) => (
                            <option key={m} value={m}>{m}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="block text-xs text-gray-500 mb-1">Aksi</label>
                    <select
                        name="action"
                        value={filters.action}
                        onChange={handleFilterChange}
                        className="border border-gray-300 rounded px-3 py-2 text-sm"
                    >
                        <option value="">Semua Aksi</option>
                        {filterOptions.actions.map((a) => (
                            <option key={a} value={a}>{a}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="block text-xs text-gray-500 mb-1">Dari Tanggal</label>
                    <input
                        type="date"
                        name="date_from"
                        value={filters.date_from}
                        onChange={handleFilterChange}
                        className="border border-gray-300 rounded px-3 py-2 text-sm"
                    />
                </div>
                <div>
                    <label className="block text-xs text-gray-500 mb-1">Sampai Tanggal</label>
                    <input
                        type="date"
                        name="date_to"
                        value={filters.date_to}
                        onChange={handleFilterChange}
                        className="border border-gray-300 rounded px-3 py-2 text-sm"
                    />
                </div>
                <button
                    type="submit"
                    className="flex items-center gap-2 bg-blue-700 text-white px-4 py-2 rounded text-sm hover:bg-blue-800"
                >
                    <Filter size={16} /> Filter
                </button>
                <button
                    type="button"
                    onClick={resetFilters}
                    className="text-sm text-gray-500 hover:text-gray-700 px-3 py-2"
                >
                    Reset
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
                                <th className="px-4 py-3">Waktu</th>
                                <th className="px-4 py-3">User</th>
                                <th className="px-4 py-3">Aksi</th>
                                <th className="px-4 py-3">Modul</th>
                                <th className="px-4 py-3">Deskripsi</th>
                                <th className="px-4 py-3 text-right">Detail</th>
                            </tr>
                        </thead>
                        <tbody>
                            {logs?.data?.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="text-center py-6 text-gray-400">
                                        Tidak ada data aktivitas.
                                    </td>
                                </tr>
                            )}
                            {logs?.data?.map((log) => (
                                <tr key={log.id} className="border-t border-gray-100">
                                    <td className="px-4 py-3 text-gray-500 text-xs whitespace-nowrap">
                                        {new Date(log.created_at).toLocaleString('id-ID')}
                                    </td>
                                    <td className="px-4 py-3">{log.user?.name || 'System'}</td>
                                    <td className="px-4 py-3">
                                        <span className={`px-2 py-1 rounded text-xs ${actionBadgeColor(log.action)}`}>
                                            {log.action}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-gray-500">{log.module || '-'}</td>
                                    <td className="px-4 py-3 text-gray-600 max-w-xs truncate">{log.description || '-'}</td>
                                    <td className="px-4 py-3 text-right">
                                        <button
                                            onClick={() => openDetail(log)}
                                            className="text-blue-600 hover:text-blue-800"
                                        >
                                            <Eye size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            <LogDetailModal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                log={selectedLog}
            />
        </div>
    );
}