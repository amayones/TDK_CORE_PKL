import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const STATUS_OPTIONS = [
    { value: 'active', label: 'Active' },
    { value: 'completed', label: 'Completed' },
    { value: 'terminated', label: 'Terminated' },
];

export default function MyProfileFormModal({ isOpen, onClose, onSubmit, initialData, submitting }) {
    const [form, setForm] = useState({
        full_name: '', email: '', phone: '', address: '', institution_name: '', institution_address: '', start_date: '', end_date: '', status: 'active', notes: '',
    });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (initialData) {
            setForm({
                full_name: initialData.full_name || '',
                email: initialData.email || '',
                phone: initialData.phone || '',
                address: initialData.address || '',
                institution_name: initialData.institution_name || '',
                institution_address: initialData.institution_address || '',
                start_date: initialData.start_date?.substring(0, 10) || '',
                end_date: initialData.end_date?.substring(0, 10) || '',
                status: initialData.status || 'active',
                notes: initialData.notes || '',
            });
        } else {
            setForm({
                full_name: '', email: '', phone: '', address: '', institution_name: '', institution_address: '', start_date: '', end_date: '', status: 'active', notes: '',
            });
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
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 overflow-y-auto py-8">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl">
                <div className="flex justify-between items-center px-6 py-4 border-b">
                    <h3 className="font-semibold text-gray-800">
                        {initialData ? 'Edit Profil' : 'Tambah Profil'}
                    </h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="px-6 py-4 space-y-4 max-h-[75vh] overflow-y-auto">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap <span className="text-red-500">*</span></label>
                        <input type="text" name="full_name" value={form.full_name} onChange={handleChange}
                            className="w-full border border-gray-300 rounded px-3 py-2 text-sm" required />
                        {errors.full_name && <p className="text-red-600 text-xs mt-1">{errors.full_name[0]}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                            <input type="email" name="email" value={form.email} onChange={handleChange}
                                className="w-full border border-gray-300 rounded px-3 py-2 text-sm" />
                            {errors.email && <p className="text-red-600 text-xs mt-1">{errors.email[0]}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Telepon</label>
                            <input type="text" name="phone" value={form.phone} onChange={handleChange}
                                className="w-full border border-gray-300 rounded px-3 py-2 text-sm" />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Alamat</label>
                        <textarea name="address" value={form.address} onChange={handleChange} rows={2}
                            className="w-full border border-gray-300 rounded px-3 py-2 text-sm" />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nama Institusi</label>
                        <input type="text" name="institution_name" value={form.institution_name} onChange={handleChange}
                            className="w-full border border-gray-300 rounded px-3 py-2 text-sm" />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Alamat Institusi</label>
                        <textarea name="institution_address" value={form.institution_address} onChange={handleChange} rows={2}
                            className="w-full border border-gray-300 rounded px-3 py-2 text-sm" />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Mulai</label>
                            <input type="date" name="start_date" value={form.start_date} onChange={handleChange}
                                className="w-full border border-gray-300 rounded px-3 py-2 text-sm" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Selesai</label>
                            <input type="date" name="end_date" value={form.end_date} onChange={handleChange}
                                className="w-full border border-gray-300 rounded px-3 py-2 text-sm" />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                        <select name="status" value={form.status} onChange={handleChange}
                            className="w-full border border-gray-300 rounded px-3 py-2 text-sm">
                            {STATUS_OPTIONS.map((s) => (
                                <option key={s.value} value={s.value}>{s.label}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Catatan</label>
                        <textarea name="notes" value={form.notes} onChange={handleChange} rows={2}
                            className="w-full border border-gray-300 rounded px-3 py-2 text-sm" />
                    </div>

                    <div className="flex justify-end gap-2 pt-2 border-t">
                        <button type="button" onClick={onClose}
                            className="px-4 py-2 text-sm rounded border border-gray-300 text-gray-600 hover:bg-gray-50">
                            Batal
                        </button>
                        <button type="submit" disabled={submitting}
                            className="px-4 py-2 text-sm rounded bg-blue-700 text-white hover:bg-blue-800 disabled:opacity-50">
                            {submitting ? 'Menyimpan...' : 'Simpan'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}