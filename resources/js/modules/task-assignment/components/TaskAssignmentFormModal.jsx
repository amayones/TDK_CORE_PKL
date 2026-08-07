import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const PRIORITY_OPTIONS = [
    { value: 'low', label: 'Rendah' },
    { value: 'medium', label: 'Sedang' },
    { value: 'high', label: 'Tinggi' },
    { value: 'urgent', label: 'Urgent' },
];

const STATUS_OPTIONS = [
    { value: 'pending', label: 'Menunggu' },
    { value: 'in_progress', label: 'Dikerjakan' },
    { value: 'completed', label: 'Selesai' },
    { value: 'rejected', label: 'Ditolak' },
];

export default function TaskAssignmentFormModal({ isOpen, onClose, onSubmit, options, initialData, submitting }) {
    const [form, setForm] = useState({
        peserta_pkl_id: '', project_id: '', title: '', description: '',
        priority: 'medium', status: 'pending', due_date: '', review_notes: '',
    });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (initialData) {
            setForm({
                peserta_pkl_id: initialData.peserta_pkl_id || '',
                project_id: initialData.project_id || '',
                title: initialData.title || '',
                description: initialData.description || '',
                priority: initialData.priority || 'medium',
                status: initialData.status || 'pending',
                due_date: initialData.due_date?.substring(0, 10) || '',
                review_notes: initialData.review_notes || '',
            });
        } else {
            setForm({
                peserta_pkl_id: '', project_id: '', title: '', description: '',
                priority: 'medium', status: 'pending', due_date: '', review_notes: '',
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
            await onSubmit({ ...form, project_id: form.project_id || null });
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
                        {initialData ? 'Edit Tugas' : 'Tambah Tugas'}
                    </h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="px-6 py-4 space-y-4 max-h-[75vh] overflow-y-auto">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Judul Tugas</label>
                        <input type="text" name="title" value={form.title} onChange={handleChange}
                            className="w-full border border-gray-300 rounded px-3 py-2 text-sm" required />
                        {errors.title && <p className="text-red-600 text-xs mt-1">{errors.title[0]}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Peserta PKL <span className="text-red-500">*</span></label>
                            <select name="peserta_pkl_id" value={form.peserta_pkl_id} onChange={handleChange}
                                className="w-full border border-gray-300 rounded px-3 py-2 text-sm" required>
                                <option value="">-- Pilih Peserta --</option>
                                {options.peserta_pkls?.map((p) => (
                                    <option key={p.id} value={p.id}>{p.full_name} ({p.institution_name})</option>
                                ))}
                            </select>
                            {errors.peserta_pkl_id && <p className="text-red-600 text-xs mt-1">{errors.peserta_pkl_id[0]}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Proyek (opsional)</label>
                            <select name="project_id" value={form.project_id} onChange={handleChange}
                                className="w-full border border-gray-300 rounded px-3 py-2 text-sm">
                                <option value="">-- Tidak Ada --</option>
                                {options.projects?.map((p) => (
                                    <option key={p.id} value={p.id}>{p.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
                        <textarea name="description" value={form.description} onChange={handleChange} rows={3}
                            className="w-full border border-gray-300 rounded px-3 py-2 text-sm" />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Prioritas</label>
                            <select name="priority" value={form.priority} onChange={handleChange}
                                className="w-full border border-gray-300 rounded px-3 py-2 text-sm">
                                {PRIORITY_OPTIONS.map((p) => (
                                    <option key={p.value} value={p.value}>{p.label}</option>
                                ))}
                            </select>
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
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Tenggat Waktu</label>
                        <input type="date" name="due_date" value={form.due_date} onChange={handleChange}
                            className="w-full border border-gray-300 rounded px-3 py-2 text-sm" required />
                        {errors.due_date && <p className="text-red-600 text-xs mt-1">{errors.due_date[0]}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Catatan Review</label>
                        <textarea name="review_notes" value={form.review_notes} onChange={handleChange} rows={2}
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