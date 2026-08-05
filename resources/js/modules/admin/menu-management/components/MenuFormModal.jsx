import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

export default function MenuFormModal({ isOpen, onClose, onSubmit, topLevelMenus, initialData, submitting }) {
    const [form, setForm] = useState({
        parent_id: '',
        module_key: '',
        name: '',
        icon: '',
        route_path: '',
        frontend_path: '',
        backend_controller: '',
        backend_service: '',
        backend_repository: '',
        sort_order: 0,
        is_active: true,
    });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (initialData) {
            setForm({
                parent_id: initialData.parent_id || '',
                module_key: initialData.module_key || '',
                name: initialData.name || '',
                icon: initialData.icon || '',
                route_path: initialData.route_path || '',
                frontend_path: initialData.frontend_path || '',
                backend_controller: initialData.backend_controller || '',
                backend_service: initialData.backend_service || '',
                backend_repository: initialData.backend_repository || '',
                sort_order: initialData.sort_order || 0,
                is_active: initialData.is_active ?? true,
            });
        } else {
            setForm({
                parent_id: '', module_key: '', name: '', icon: '', route_path: '',
                frontend_path: '', backend_controller: '', backend_service: '',
                backend_repository: '', sort_order: 0, is_active: true,
            });
        }
        setErrors({});
    }, [initialData, isOpen]);

    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: name === 'module_key' ? value.toLowerCase().replace(/[^a-z0-9\-]/g, '') : (type === 'checkbox' ? checked : value),
        }));
    };

    const autoFillPaths = () => {
        if (!form.module_key) return;
        const studify = form.module_key.split('-').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join('');
        setForm((prev) => ({
            ...prev,
            frontend_path: `resources/js/modules/${form.module_key}/pages/`,
            backend_controller: `app/Http/Controllers/Modules/${studify}Controller.php`,
            backend_service: `app/Services/Modules/${studify}Service.php`,
            backend_repository: `app/Repositories/${studify}Repository.php`,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});
        try {
            await onSubmit(form);
        } catch (err) {
            if (err.response?.status === 422) {
                setErrors(err.response.data.errors || {});
            }
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 overflow-y-auto py-8">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-lg">
                <div className="flex justify-between items-center px-6 py-4 border-b">
                    <h3 className="font-semibold text-gray-800">
                        {initialData ? 'Edit Menu' : 'Tambah Menu'}
                    </h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="px-6 py-4 space-y-4 max-h-[70vh] overflow-y-auto">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Menu Induk (opsional)</label>
                        <select
                            name="parent_id"
                            value={form.parent_id}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                        >
                            <option value="">-- Tidak Ada (Menu Utama) --</option>
                            {topLevelMenus.filter(m => m.id !== initialData?.id).map((m) => (
                                <option key={m.id} value={m.id}>{m.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Module Key</label>
                            <div className="flex gap-1">
                                <input
                                    type="text"
                                    name="module_key"
                                    value={form.module_key}
                                    onChange={handleChange}
                                    placeholder="finance-report"
                                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                                    required
                                />
                            </div>
                            {errors.module_key && <p className="text-red-600 text-xs mt-1">{errors.module_key[0]}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Nama Menu</label>
                            <input
                                type="text"
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                                required
                            />
                            {errors.name && <p className="text-red-600 text-xs mt-1">{errors.name[0]}</p>}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Icon (lucide-react)</label>
                            <input
                                type="text"
                                name="icon"
                                value={form.icon}
                                onChange={handleChange}
                                placeholder="FileText"
                                className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Route Path</label>
                            <input
                                type="text"
                                name="route_path"
                                value={form.route_path}
                                onChange={handleChange}
                                placeholder="/finance/report"
                                className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                                required
                            />
                            {errors.route_path && <p className="text-red-600 text-xs mt-1">{errors.route_path[0]}</p>}
                        </div>
                    </div>

                    <div className="flex justify-between items-center pt-2 border-t">
                        <span className="text-xs text-gray-500">Path Lokasi File (bisa auto-generate)</span>
                        <button
                            type="button"
                            onClick={autoFillPaths}
                            className="text-xs text-blue-600 hover:underline"
                        >
                            Auto-generate dari Module Key
                        </button>
                    </div>

                    <div>
                        <label className="block text-xs text-gray-500 mb-1">Frontend Path</label>
                        <input
                            type="text"
                            name="frontend_path"
                            value={form.frontend_path}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded px-3 py-2 text-xs font-mono"
                        />
                    </div>
                    <div>
                        <label className="block text-xs text-gray-500 mb-1">Backend Controller</label>
                        <input
                            type="text"
                            name="backend_controller"
                            value={form.backend_controller}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded px-3 py-2 text-xs font-mono"
                        />
                    </div>
                    <div>
                        <label className="block text-xs text-gray-500 mb-1">Backend Service</label>
                        <input
                            type="text"
                            name="backend_service"
                            value={form.backend_service}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded px-3 py-2 text-xs font-mono"
                        />
                    </div>
                    <div>
                        <label className="block text-xs text-gray-500 mb-1">Backend Repository</label>
                        <input
                            type="text"
                            name="backend_repository"
                            value={form.backend_repository}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded px-3 py-2 text-xs font-mono"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Urutan</label>
                            <input
                                type="number"
                                name="sort_order"
                                value={form.sort_order}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                            />
                        </div>
                        <div className="flex items-center gap-2 mt-6">
                            <input
                                type="checkbox"
                                name="is_active"
                                checked={form.is_active}
                                onChange={handleChange}
                                id="menu_is_active"
                            />
                            <label htmlFor="menu_is_active" className="text-sm text-gray-700">Menu Aktif</label>
                        </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-2 border-t">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm rounded border border-gray-300 text-gray-600 hover:bg-gray-50"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            disabled={submitting}
                            className="px-4 py-2 text-sm rounded bg-blue-700 text-white hover:bg-blue-800 disabled:opacity-50"
                        >
                            {submitting ? 'Menyimpan...' : 'Simpan'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}