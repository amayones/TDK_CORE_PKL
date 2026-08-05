import { X } from 'lucide-react';

export default function LogDetailModal({ isOpen, onClose, log }) {
    if (!isOpen || !log) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-lg">
                <div className="flex justify-between items-center px-6 py-4 border-b">
                    <h3 className="font-semibold text-gray-800">Detail Aktivitas</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <X size={20} />
                    </button>
                </div>

                <div className="px-6 py-4 space-y-3 max-h-[70vh] overflow-y-auto text-sm">
                    <div>
                        <span className="text-gray-500 block text-xs">User</span>
                        <span className="text-gray-800">{log.user?.name || 'System'}</span>
                    </div>
                    <div>
                        <span className="text-gray-500 block text-xs">Aksi</span>
                        <span className="text-gray-800">{log.action}</span>
                    </div>
                    <div>
                        <span className="text-gray-500 block text-xs">Modul</span>
                        <span className="text-gray-800">{log.module || '-'}</span>
                    </div>
                    <div>
                        <span className="text-gray-500 block text-xs">Deskripsi</span>
                        <span className="text-gray-800">{log.description || '-'}</span>
                    </div>
                    <div>
                        <span className="text-gray-500 block text-xs">IP Address</span>
                        <span className="text-gray-800">{log.ip_address || '-'}</span>
                    </div>
                    <div>
                        <span className="text-gray-500 block text-xs">Waktu</span>
                        <span className="text-gray-800">{log.created_at}</span>
                    </div>

                    {log.old_data && (
                        <div>
                            <span className="text-gray-500 block text-xs mb-1">Data Sebelumnya</span>
                            <pre className="bg-gray-50 border border-gray-200 rounded p-3 text-xs overflow-x-auto">
                                {JSON.stringify(log.old_data, null, 2)}
                            </pre>
                        </div>
                    )}

                    {log.new_data && (
                        <div>
                            <span className="text-gray-500 block text-xs mb-1">Data Baru</span>
                            <pre className="bg-gray-50 border border-gray-200 rounded p-3 text-xs overflow-x-auto">
                                {JSON.stringify(log.new_data, null, 2)}
                            </pre>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}