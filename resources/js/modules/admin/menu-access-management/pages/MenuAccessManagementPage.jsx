import { useState, useEffect, useCallback } from 'react';
import { Loader2, Save, ShieldAlert } from 'lucide-react';
import { fetchAccessGroups, fetchAccessMatrix, saveAccessMatrix } from '../services/menuAccessService';

export default function MenuAccessManagementPage() {
    const [groups, setGroups] = useState([]);
    const [selectedGroupId, setSelectedGroupId] = useState('');
    const [groupInfo, setGroupInfo] = useState(null);
    const [matrix, setMatrix] = useState([]);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [saveMessage, setSaveMessage] = useState('');

    useEffect(() => {
        fetchAccessGroups().then((data) => {
            setGroups(data);
            const internGroup = data.find(g => g.code === 'GROUP_INTERN');
            if (internGroup) setSelectedGroupId(internGroup.id);
        });
    }, []);

    const loadMatrix = useCallback(async (groupId) => {
        if (!groupId) return;
        setLoading(true);
        setSaveMessage('');
        try {
            const data = await fetchAccessMatrix(groupId);
            setGroupInfo(data.group);
            setMatrix(data.matrix);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (selectedGroupId) {
            loadMatrix(selectedGroupId);
        }
    }, [selectedGroupId, loadMatrix]);

    const togglePermission = (menuId, field) => {
        setMatrix((prev) =>
            prev.map((item) =>
                item.menu_id === menuId ? { ...item, [field]: !item[field] } : item
            )
        );
    };

    const handleSave = async () => {
        setSaving(true);
        setSaveMessage('');
        try {
            await saveAccessMatrix(selectedGroupId, matrix);
            setSaveMessage('Hak akses berhasil disimpan.');
        } catch (err) {
            setSaveMessage('Gagal menyimpan hak akses.');
        } finally {
            setSaving(false);
        }
    };

    const isAdminGroup = groupInfo?.code === 'GROUP_ADMIN';

    return (
        <div className="space-y-4">
            <div>
                <h2 className="text-lg font-semibold text-gray-800">Menu Access Management</h2>
                <p className="text-gray-500 text-sm">Atur hak akses menu untuk setiap group.</p>
            </div>

            <div className="bg-white rounded-lg shadow p-5 space-y-4">
                <div className="max-w-xs">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Pilih Group</label>
                    <select
                        value={selectedGroupId}
                        onChange={(e) => setSelectedGroupId(e.target.value)}
                        className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                    >
                        <option value="">-- Pilih Group --</option>
                        {groups.map((g) => (
                            <option key={g.id} value={g.id}>{g.name}</option>
                        ))}
                    </select>
                </div>

                {isAdminGroup && (
                    <div className="flex items-center gap-2 bg-amber-50 text-amber-700 text-sm px-4 py-3 rounded">
                        <ShieldAlert size={18} />
                        Group Administrator selalu memiliki akses penuh ke seluruh menu dan tidak dapat diubah.
                    </div>
                )}

                {saveMessage && (
                    <div className={`text-sm px-4 py-2 rounded ${
                        saveMessage.includes('berhasil') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                        {saveMessage}
                    </div>
                )}

                {loading ? (
                    <div className="flex justify-center py-10">
                        <Loader2 className="animate-spin text-blue-700" size={28} />
                    </div>
                ) : selectedGroupId && (
                    <>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead className="bg-gray-50 text-gray-600 text-left">
                                    <tr>
                                        <th className="px-4 py-3">Menu</th>
                                        <th className="px-4 py-3 text-center">Lihat</th>
                                        <th className="px-4 py-3 text-center">Tambah</th>
                                        <th className="px-4 py-3 text-center">Ubah</th>
                                        <th className="px-4 py-3 text-center">Hapus</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {matrix.map((item) => (
                                        <tr key={item.menu_id} className="border-t border-gray-100">
                                            <td className="px-4 py-3">
                                                {item.parent_id && <span className="text-gray-300 mr-1">↳</span>}
                                                {item.menu_name}
                                            </td>
                                            {['can_view', 'can_create', 'can_edit', 'can_delete'].map((field) => (
                                                <td key={field} className="px-4 py-3 text-center">
                                                    <input
                                                        type="checkbox"
                                                        checked={item[field]}
                                                        onChange={() => togglePermission(item.menu_id, field)}
                                                        disabled={isAdminGroup}
                                                        className="w-4 h-4"
                                                    />
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {!isAdminGroup && (
                            <div className="flex justify-end pt-2">
                                <button
                                    onClick={handleSave}
                                    disabled={saving}
                                    className="flex items-center gap-2 bg-blue-700 text-white px-4 py-2 rounded text-sm hover:bg-blue-800 disabled:opacity-50"
                                >
                                    <Save size={16} />
                                    {saving ? 'Menyimpan...' : 'Simpan Hak Akses'}
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}