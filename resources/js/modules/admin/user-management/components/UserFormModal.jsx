import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

export default function UserFormModal({ isOpen, onClose, onSubmit, groups, initialData, submitting }) {
    const [form, setForm] = useState({
        group_id: '',
        username: '',
        name: '',
        email: '',
        password: '',
        is_active: true,
    });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (initialData) {
            setForm({
                group_id: initialData.group_id || '',
                username: initialData.username || '',
                name: initialData.name || '',
                email: initialData.email || '',
                password: '',
                is_active: initialData.is_active ?? true,
            });
        } else {
            setForm({ group_id: '', username: '', name: '', email: '', password: '', is_active: true });
        }
        setErrors({});
    }, [initialData, isOpen]);

    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
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
                        {initialData ? 'Edit User' : 'Tambah User'}
                    </h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="px-6 py-4 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Group</label>
                        <select
                            name="group_id"
                            value={form.group_id}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                            required
                        >
                            <option value="">Pilih Group</option>
                            {groups.map((g) => (
                                <option key={g.id} value={g.id}>{g.name}</option>
                            ))}
                        </select>
                        {errors.group_id && <p className="text-red-600 text-xs mt-1">{errors.group_id[0]}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                        <input
                            type="text"
                            name="username"
                            value={form.username}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                            required
                        />
                        {errors.username && <p className="text-red-600 text-xs mt-1">{errors.username[0]}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label>
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
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                            required
                        />
                        {errors.email && <p className="text-red-600 text-xs mt-1">{errors.email[0]}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Password {initialData && <span className="text-gray-400">(kosongkan jika tidak diubah)</span>}
                        </label>
                        <input
                            type="password"
                            name="password"
                            value={form.password}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                            required={!initialData}
                        />
                        {errors.password && <p className="text-red-600 text-xs mt-1">{errors.password[0]}</p>}
                    </div>

                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            name="is_active"
                            checked={form.is_active}
                            onChange={handleChange}
                            id="is_active"
                        />
                        <label htmlFor="is_active" className="text-sm text-gray-700">User Aktif</label>
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