import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const STATUS_OPTIONS = [
    { value: 'planning', label: 'Perencanaan' },
    { value: 'in_progress', label: 'Berjalan' },
    { value: 'completed', label: 'Selesai' },
    { value: 'on_hold', label: 'Ditunda' },
];

export default function ProjectFormModal({ isOpen, onClose, onSubmit, initialData, submitting }) {
    const [form, setForm] = useState({
        name: '', description: '', status: 'planning', start_date: '', end_date: '',
    });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (initialData) {
            setForm({
                name: initialData.name || '',
                description: initialData.description || '',
                status: initialData.status || 'planning',
                start_date: initialData.start_date?.substring(0, 10) || '',
                end_date: initialData.end_date?.substring(0, 10) || '',
            });
        } else {
            setForm({ name: '', description: '', status: 'planning', start_date: '', end_date: '' });
        }
        setErrors({});
    }, [initialData, isOpen]);

    if (!isOpen) return null;

    const handleChange = (e) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
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
                        {initialData ? 'Edit Project' : 'Tambah Project'}
                    </h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="px-6 py-4 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nama Project</label>
                        <input
                            type="text" name="name" value={form.name} onChange={handleChange}
                            className="w-full border border-gray-300 rounded px-3 py-2 text-sm" required
                        />
                        {errors.name && <p className="text-red-600 text-xs mt-1">{errors.name[0]}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
                        <textarea
                            name="description" value={form.description} onChange={handleChange} rows={3}
                            className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                        <select
                            name="status" value={form.status} onChange={handleChange}
                            className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                        >
                            {STATUS_OPTIONS.map((s) => (
                                <option key={s.value} value={s.value}>{s.label}</option>
                            ))}
                        </select>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Mulai</label>
                            <input
                                type="date" name="start_date" value={form.start_date} onChange={handleChange}
                                className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Selesai</label>
                            <input
                                type="date" name="end_date" value={form.end_date} onChange={handleChange}
                                className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                            />
                            {errors.end_date && <p className="text-red-600 text-xs mt-1">{errors.end_date[0]}</p>}
                        </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-2">
                        <button type="button" onClick={onClose} className="px-4 py-2 text-sm rounded border border-gray-300 text-gray-600 hover:bg-gray-50">
                            Batal
                        </button>
                        <button type="submit" disabled={submitting} className="px-4 py-2 text-sm rounded bg-blue-700 text-white hover:bg-blue-800 disabled:opacity-50">
                            {submitting ? 'Menyimpan...' : 'Simpan'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}