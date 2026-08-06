import { useState, useEffect } from 'react';
import { Users, ShieldCheck, ListTree, History, Loader2, TrendingUp, Activity } from 'lucide-react';
import { fetchDashboardSummary } from '../services/dashboardService';

function StatCard({ icon: Icon, label, value, gradient, iconBg }) {
    return (
        <div className="relative rounded-2xl p-5 overflow-hidden shadow-sm" style={{ background: gradient }}>
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-white text-opacity-80 text-xs font-medium uppercase tracking-wide mb-1">{label}</p>
                    <p className="text-3xl font-bold text-white">{value}</p>
                </div>
                <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: iconBg }}>
                    <Icon size={20} className="text-white" />
                </div>
            </div>
            <div className="mt-4 flex items-center gap-1">
                <TrendingUp size={13} className="text-white opacity-70" />
                <span className="text-white text-opacity-70 text-xs">Data sistem aktif</span>
            </div>
        </div>
    );
}

function ActionBadge({ action }) {
    const map = {
        CREATE: { bg: 'bg-emerald-100', text: 'text-emerald-700' },
        UPDATE: { bg: 'bg-blue-100', text: 'text-blue-700' },
        DELETE: { bg: 'bg-red-100', text: 'text-red-700' },
        LOGIN:  { bg: 'bg-purple-100', text: 'text-purple-700' },
    };
    const style = map[action] || { bg: 'bg-gray-100', text: 'text-gray-600' };
    return (
        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${style.bg} ${style.text}`}>
            {action}
        </span>
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
                <Loader2 className="animate-spin" size={32} style={{ color: '#30AFFF' }} />
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl border border-red-200">
                {error}
            </div>
        );
    }

    const maxUsers = Math.max(...data.users_by_group.map(g => g.users_count), 1);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h2 className="text-xl font-bold text-gray-800">Dashboard</h2>
                <p className="text-gray-400 text-sm mt-0.5">Ringkasan data sistem TDK Core PKL.</p>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    icon={Users}
                    label="Total User"
                    value={data.summary.total_users}
                    gradient="linear-gradient(135deg, #30AFFF, #6DD5FA)"
                    iconBg="rgba(255,255,255,0.25)"
                />
                <StatCard
                    icon={ShieldCheck}
                    label="Total Group"
                    value={data.summary.total_groups}
                    gradient="linear-gradient(135deg, #11998e, #38ef7d)"
                    iconBg="rgba(255,255,255,0.25)"
                />
                <StatCard
                    icon={ListTree}
                    label="Total Menu"
                    value={data.summary.total_menus}
                    gradient="linear-gradient(135deg, #f7971e, #ffd200)"
                    iconBg="rgba(255,255,255,0.25)"
                />
                <StatCard
                    icon={History}
                    label="Total Audit Log"
                    value={data.summary.total_audit_logs}
                    gradient="linear-gradient(135deg, #a855f7, #ec4899)"
                    iconBg="rgba(255,255,255,0.25)"
                />
            </div>

            {/* Bottom Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* User per Group — bar chart style */}
                <div className="bg-white rounded-2xl shadow-sm p-6">
                    <div className="flex items-center justify-between mb-5">
                        <div>
                            <h3 className="font-semibold text-gray-800">User per Group</h3>
                            <p className="text-xs text-gray-400 mt-0.5">Distribusi user berdasarkan group</p>
                        </div>
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #30AFFF, #CFECF3)' }}>
                            <Activity size={15} className="text-white" />
                        </div>
                    </div>
                    <div className="space-y-3">
                        {data.users_by_group.map((group, i) => {
                            const pct = Math.round((group.users_count / maxUsers) * 100);
                            const colors = [
                                'linear-gradient(90deg, #30AFFF, #CFECF3)',
                                'linear-gradient(90deg, #11998e, #38ef7d)',
                                'linear-gradient(90deg, #f7971e, #ffd200)',
                                'linear-gradient(90deg, #a855f7, #ec4899)',
                                'linear-gradient(90deg, #f43f5e, #fb923c)',
                            ];
                            return (
                                <div key={group.id}>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="text-gray-600 font-medium">{group.name}</span>
                                        <span className="text-gray-800 font-bold">{group.users_count} user</span>
                                    </div>
                                    <div className="w-full bg-gray-100 rounded-full h-2">
                                        <div
                                            className="h-2 rounded-full transition-all duration-500"
                                            style={{ width: `${pct}%`, background: colors[i % colors.length] }}
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Aktivitas Terbaru */}
                <div className="bg-white rounded-2xl shadow-sm p-6">
                    <div className="flex items-center justify-between mb-5">
                        <div>
                            <h3 className="font-semibold text-gray-800">Aktivitas Terbaru</h3>
                            <p className="text-xs text-gray-400 mt-0.5">Log aktivitas sistem terkini</p>
                        </div>
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #a855f7, #ec4899)' }}>
                            <History size={15} className="text-white" />
                        </div>
                    </div>
                    <div className="space-y-3">
                        {data.recent_logs.length === 0 && (
                            <p className="text-sm text-gray-400">Belum ada aktivitas.</p>
                        )}
                        {data.recent_logs.map((log) => (
                            <div key={log.id} className="flex items-start gap-3 pb-3 border-b border-gray-50 last:border-0 last:pb-0">
                                <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-white text-xs font-bold"
                                    style={{ background: 'linear-gradient(135deg, #30AFFF, #CFECF3)' }}>
                                    {log.user?.charAt(0)?.toUpperCase() || '?'}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <span className="text-sm font-medium text-gray-700">{log.user}</span>
                                        <ActionBadge action={log.action} />
                                        {log.module && (
                                            <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">{log.module}</span>
                                        )}
                                    </div>
                                    <p className="text-xs text-gray-400 mt-0.5">{log.created_at}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
}
