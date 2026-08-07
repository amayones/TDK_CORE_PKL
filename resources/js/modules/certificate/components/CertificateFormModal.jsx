import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const STATUS_OPTIONS = [
    { value: 'pending', label: 'Pending' },
    { value: 'issued', label: 'Diterbitkan' },
    { value: 'expired', label: 'Kedaluwarsa' },
];

export default function CertificateFormModal({ isOpen, onClose, onSubmit, options, initialData, submitting }) {
    const [form, setForm] = useState({
        peserta_pkl_id: '', certificate_number: '', issue_date: '', expiry_date: '',
        title: '', description: '', status: 'pending',
    });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (initialData) {
            setForm({
                peserta_pkl_id: initialData.peserta_pkl_id || '',
                certificate_number: initialData.certificate_number || '',
                issue_date: initialData.issue_date?.substring(0, 10) || '',
                expiry_date: initialData.expiry_date?.substring(0, 10) || '',
                title: initialData.title || '',
                description: initialData.description || '',
                status: initialData.status || 'pending',
            });
        } else {
            setForm({
                peserta_pkl_id: '', certificate_number: '', issue_date: '', expiry_date: '',
                title: '', description: '', status: 'pending',
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
                        {initialData ? 'Edit Sertifikat' : 'Tambah Sertifikat'}
                    </h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="px-6 py-4 space-y-4 max-h-[75vh] overflow-y-auto">
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Peserta PKL <span className="text-red-500">*</span></label>
                            <select name="peserta_pkl_id" value={form.peserta_pkl_id} onChange={handleChange}
                                className="w-full border border-gray-300 rounded px-3 py-2 text-sm" required>
                                <option value="">-- Pilih Peserta --</option>
                                {options.map((p) => (
                                    <option key={p.id} value={p.id}>{p.full_name}</option>
                                ))}
                            </select>
                            {errors.peserta_pkl_id && <p className="text-red-600 text-xs mt-1">{errors.peserta_pkl_id[0]}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">No. Sertifikat <span className="text-red-500">*</span></label>
                            <input type="text" name="certificate_number" value={form.certificate_number} onChange={handleChange}
                                className="w-full border border-gray-300 rounded px-3 py-2 text-sm" required />
                            {errors.certificate_number && <p className="text-red-600 text-xs mt-1">{errors.certificate_number[0]}</p>}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Terbit <span className="text-red-500">*</span></label>
                            <input type="date" name="issue_date" value={form.issue_date} onChange={handleChange}
                                className="w-full border border-gray-300 rounded px-3 py-2 text-sm" required />
                            {errors.issue_date && <p className="text-red-600 text-xs mt-1">{errors.issue_date[0]}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Expired</label>
                            <input type="date" name="expiry_date" value={form.expiry_date} onChange={handleChange}
                                className="w-full border border-gray-300 rounded px-3 py-2 text-sm" />
                            {errors.expiry_date && <p className="text-red-600 text-xs mt-1">{errors.expiry_date[0]}</p>}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Judul <span className="text-red-500">*</span></label>
                        <input type="text" name="title" value={form.title} onChange={handleChange}
                            className="w-full border border-gray-300 rounded px-3 py-2 text-sm" required />
                        {errors.title && <p className="text-red-600 text-xs mt-1">{errors.title[0]}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
                        <textarea name="description" value={form.description} onChange={handleChange} rows={2}
                            className="w-full border border-gray-300 rounded px-3 py-2 text-sm" />
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