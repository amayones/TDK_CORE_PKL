import { useState, useEffect } from 'react';
import { Users, ShieldCheck, ListTree, History, Loader2 } from 'lucide-react';
import { fetchDashboardSummary } from '../services/dashboardService';

function StatCard({ icon: Icon, label, value, color }) {
    return (
        <div className="bg-white rounded-lg shadow p-5 flex items-center gap-4">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${color}`}>
                <Icon size={22} className="text-white" />
            </div>
            <div>
                <p className="text-2xl font-bold text-gray-800">{value}</p>
                <p className="text-sm text-gray-500">{label}</p>
            </div>
        </div>
    );
}

export default function DashboardPage() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchDashboardSummary()
            .then(setData)
            .catch(() => setError('Gagal memuat data dashboard.'))
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <Loader2 className="animate-spin text-blue-700" size={32} />
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-100 text-red-700 px-4 py-3 rounded">
                {error}
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-lg font-semibold text-gray-800">Dashboard</h2>
                <p className="text-gray-500 text-sm">Ringkasan data sistem TDK Core PKL.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    icon={Users}
                    label="Total User"
                    value={data.summary.total_users}
                    color="bg-blue-600"
                />
                <StatCard
                    icon={ShieldCheck}
                    label="Total Group"
                    value={data.summary.total_groups}
                    color="bg-emerald-600"
                />
                <StatCard
                    icon={ListTree}
                    label="Total Menu"
                    value={data.summary.total_menus}
                    color="bg-amber-600"
                />
                <StatCard
                    icon={History}
                    label="Total Audit Log"
                    value={data.summary.total_audit_logs}
                    color="bg-purple-600"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg shadow p-5">
                    <h3 className="font-semibold text-gray-800 mb-3">User per Group</h3>
                    <div className="space-y-2">
                        {data.users_by_group.map((group) => (
                            <div key={group.id} className="flex justify-between text-sm border-b border-gray-100 pb-2">
                                <span className="text-gray-600">{group.name}</span>
                                <span className="font-semibold text-gray-800">{group.users_count} user</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow p-5">
                    <h3 className="font-semibold text-gray-800 mb-3">Aktivitas Terbaru</h3>
                    <div className="space-y-3">
                        {data.recent_logs.length === 0 && (
                            <p className="text-sm text-gray-400">Belum ada aktivitas.</p>
                        )}
                        {data.recent_logs.map((log) => (
                            <div key={log.id} className="text-sm border-b border-gray-100 pb-2">
                                <p className="text-gray-700">
                                    <span className="font-medium">{log.user}</span> — {log.action}
                                    {log.module && <span className="text-gray-400"> ({log.module})</span>}
                                </p>
                                <p className="text-xs text-gray-400">{log.created_at}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}