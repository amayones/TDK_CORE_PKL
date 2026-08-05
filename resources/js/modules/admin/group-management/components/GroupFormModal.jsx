import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

export default function GroupFormModal({ isOpen, onClose, onSubmit, initialData, submitting }) {
    const [form, setForm] = useState({
        code: '',
        name: '',
        description: '',
        is_active: true,
    });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (initialData) {
            setForm({
                code: initialData.code || '',
                name: initialData.name || '',
                description: initialData.description || '',
                is_active: initialData.is_active ?? true,
            });
        } else {
            setForm({ code: '', name: '', description: '', is_active: true });
        }
        setErrors({});
    }, [initialData, isOpen]);

    if (!isOpen) return null;

    const isSystemGroup = initialData && ['GROUP_ADMIN', 'GROUP_INTERN'].includes(initialData.code);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: name === 'code' ? value.toUpperCase().replace(/[^A-Z_]/g, '') : (type === 'checkbox' ? checked : value),
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
                        {initialData ? 'Edit Group' : 'Tambah Group'}
                    </h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="px-6 py-4 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Kode Group {isSystemGroup && <span className="text-gray-400">(bawaan sistem)</span>}
                        </label>
                        <input
                            type="text"
                            name="code"
                            value={form.code}
                            onChange={handleChange}
                            placeholder="GROUP_FINANCE"
                            className="w-full border border-gray-300 rounded px-3 py-2 text-sm disabled:bg-gray-100"
                            required
                            disabled={isSystemGroup}
                        />
                        {errors.code && <p className="text-red-600 text-xs mt-1">{errors.code[0]}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nama Group</label>
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

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
                        <textarea
                            name="description"
                            value={form.description}
                            onChange={handleChange}
                            rows={3}
                            className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                        />
                    </div>

                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            name="is_active"
                            checked={form.is_active}
                            onChange={handleChange}
                            id="group_is_active"
                        />
                        <label htmlFor="group_is_active" className="text-sm text-gray-700">Group Aktif</label>
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