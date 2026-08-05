import { useState, useEffect, useCallback } from 'react';
import { Plus, Pencil, Trash2, Loader2 } from 'lucide-react';
import { fetchSettings, createSetting, updateSetting, deleteSetting } from '../services/systemSettingService';
import SettingFormModal from '../components/SettingFormModal';

export default function SystemSettingPage() {
    const [settings, setSettings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [editingSetting, setEditingSetting] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    const loadSettings = useCallback(async () => {
        setLoading(true);
        try {
            const data = await fetchSettings();
            setSettings(data);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadSettings();
    }, [loadSettings]);

    const openCreateModal = () => {
        setEditingSetting(null);
        setModalOpen(true);
    };

    const openEditModal = (setting) => {
        setEditingSetting(setting);
        setModalOpen(true);
    };

    const handleSubmit = async (form) => {
        setSubmitting(true);
        try {
            if (editingSetting) {
                await updateSetting(editingSetting.id, form);
            } else {
                await createSetting(form);
            }
            setModalOpen(false);
            loadSettings();
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (setting) => {
        if (!confirm(`Hapus setting "${setting.key}"?`)) return;
        await deleteSetting(setting.id);
        loadSettings();
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-lg font-semibold text-gray-800">System Setting</h2>
                    <p className="text-gray-500 text-sm">Kelola pengaturan konfigurasi aplikasi.</p>
                </div>
                <button
                    onClick={openCreateModal}
                    className="flex items-center gap-2 bg-blue-700 text-white px-4 py-2 rounded text-sm hover:bg-blue-800"
                >
                    <Plus size={16} /> Tambah Setting
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
                                <th className="px-4 py-3">Key</th>
                                <th className="px-4 py-3">Label</th>
                                <th className="px-4 py-3">Value</th>
                                <th className="px-4 py-3">Tipe</th>
                                <th className="px-4 py-3 text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {settings.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="text-center py-6 text-gray-400">
                                        Tidak ada data setting.
                                    </td>
                                </tr>
                            )}
                            {settings.map((setting) => (
                                <tr key={setting.id} className="border-t border-gray-100">
                                    <td className="px-4 py-3">
                                        <code className="bg-gray-100 px-2 py-1 rounded text-xs">{setting.key}</code>
                                    </td>
                                    <td className="px-4 py-3">{setting.label || '-'}</td>
                                    <td className="px-4 py-3 text-gray-600 max-w-xs truncate">{setting.value || '-'}</td>
                                    <td className="px-4 py-3">
                                        <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs">
                                            {setting.type}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        <button
                                            onClick={() => openEditModal(setting)}
                                            className="text-blue-600 hover:text-blue-800 mr-3"
                                        >
                                            <Pencil size={16} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(setting)}
                                            className="text-red-600 hover:text-red-800"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            <SettingFormModal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                onSubmit={handleSubmit}
                initialData={editingSetting}
                submitting={submitting}
            />
        </div>
    );
}