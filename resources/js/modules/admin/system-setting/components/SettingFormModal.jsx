import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

export default function SettingFormModal({ isOpen, onClose, onSubmit, initialData, submitting }) {
    const [form, setForm] = useState({
        key: '',
        value: '',
        type: 'string',
        label: '',
        description: '',
    });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (initialData) {
            setForm({
                key: initialData.key || '',
                value: initialData.value || '',
                type: initialData.type || 'string',
                label: initialData.label || '',
                description: initialData.description || '',
            });
        } else {
            setForm({ key: '', value: '', type: 'string', label: '', description: '' });
        }
        setErrors({});
    }, [initialData, isOpen]);

    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: name === 'key' ? value.toLowerCase().replace(/[^a-z0-9_]/g, '') : value,
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
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
                <div className="flex justify-between items-center px-6 py-4 border-b">
                    <h3 className="font-semibold text-gray-800">
                        {initialData ? 'Edit Setting' : 'Tambah Setting'}
                    </h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="px-6 py-4 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Key</label>
                        <input
                            type="text"
                            name="key"
                            value={form.key}
                            onChange={handleChange}
                            placeholder="app_name"
                            className="w-full border border-gray-300 rounded px-3 py-2 text-sm font-mono"
                            required
                        />
                        {errors.key && <p className="text-red-600 text-xs mt-1">{errors.key[0]}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Label</label>
                        <input
                            type="text"
                            name="label"
                            value={form.label}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Tipe</label>
                        <select
                            name="type"
                            value={form.type}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                        >
                            <option value="string">String</option>
                            <option value="number">Number</option>
                            <option value="boolean">Boolean</option>
                            <option value="json">JSON</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Value</label>
                        <textarea
                            name="value"
                            value={form.value}
                            onChange={handleChange}
                            rows={2}
                            className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
                        <textarea
                            name="description"
                            value={form.description}
                            onChange={handleChange}
                            rows={2}
                            className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                        />
                    </div>

                    <div className="flex justify-end gap-2 pt-2">
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