import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const STATUS_OPTIONS = [
    { value: 'active', label: 'Aktif' },
    { value: 'completed', label: 'Selesai' },
    { value: 'dropped', label: 'Dibatalkan' },
];

export default function PesertaPklFormModal({ isOpen, onClose, onSubmit, userOptions, initialData, submitting }) {
    const [form, setForm] = useState({
        user_id: '', full_name: '', student_number: '', institution_name: '',
        major: '', phone: '', address: '', supervisor_name: '', mentor_name: '',
        start_date: '', end_date: '', status: 'active', notes: '',
    });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (initialData) {
            setForm({
                user_id: initialData.user_id || '',
                full_name: initialData.full_name || '',
                student_number: initialData.student_number || '',
                institution_name: initialData.institution_name || '',
                major: initialData.major || '',
                phone: initialData.phone || '',
                address: initialData.address || '',
                supervisor_name: initialData.supervisor_name || '',
                mentor_name: initialData.mentor_name || '',
                start_date: initialData.start_date?.substring(0, 10) || '',
                end_date: initialData.end_date?.substring(0, 10) || '',
                status: initialData.status || 'active',
                notes: initialData.notes || '',
            });
        } else {
            setForm({
                user_id: '', full_name: '', student_number: '', institution_name: '',
                major: '', phone: '', address: '', supervisor_name: '', mentor_name: '',
                start_date: '', end_date: '', status: 'active', notes: '',
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
            await onSubmit({ ...form, user_id: form.user_id || null });
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
                        {initialData ? 'Edit Data Peserta PKL' : 'Tambah Peserta PKL'}
                    </h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="px-6 py-4 space-y-4 max-h-[75vh] overflow-y-auto">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Hubungkan ke Akun Login (opsional)
                        </label>
                        <select
                            name="user_id" value={form.user_id} onChange={handleChange}
                            className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                        >
                            <option value="">-- Tidak Dihubungkan --</option>
                            {userOptions.map((u) => (
                                <option key={u.id} value={u.id}>{u.name} ({u.username})</option>
                            ))}
                        </select>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label>
                            <input type="text" name="full_name" value={form.full_name} onChange={handleChange}
                                className="w-full border border-gray-300 rounded px-3 py-2 text-sm" required />
                            {errors.full_name && <p className="text-red-600 text-xs mt-1">{errors.full_name[0]}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">NIM/NISN</label>
                            <input type="text" name="student_number" value={form.student_number} onChange={handleChange}
                                className="w-full border border-gray-300 rounded px-3 py-2 text-sm" />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Asal Sekolah/Kampus</label>
                            <input type="text" name="institution_name" value={form.institution_name} onChange={handleChange}
                                className="w-full border border-gray-300 rounded px-3 py-2 text-sm" required />
                            {errors.institution_name && <p className="text-red-600 text-xs mt-1">{errors.institution_name[0]}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Jurusan</label>
                            <input type="text" name="major" value={form.major} onChange={handleChange}
                                className="w-full border border-gray-300 rounded px-3 py-2 text-sm" />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">No. HP</label>
                            <input type="text" name="phone" value={form.phone} onChange={handleChange}
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
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Alamat</label>
                        <textarea name="address" value={form.address} onChange={handleChange} rows={2}
                            className="w-full border border-gray-300 rounded px-3 py-2 text-sm" />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Guru/Dosen Pembimbing</label>
                            <input type="text" name="supervisor_name" value={form.supervisor_name} onChange={handleChange}
                                className="w-full border border-gray-300 rounded px-3 py-2 text-sm" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Pembimbing Perusahaan</label>
                            <input type="text" name="mentor_name" value={form.mentor_name} onChange={handleChange}
                                className="w-full border border-gray-300 rounded px-3 py-2 text-sm" />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Mulai</label>
                            <input type="date" name="start_date" value={form.start_date} onChange={handleChange}
                                className="w-full border border-gray-300 rounded px-3 py-2 text-sm" required />
                            {errors.start_date && <p className="text-red-600 text-xs mt-1">{errors.start_date[0]}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Selesai</label>
                            <input type="date" name="end_date" value={form.end_date} onChange={handleChange}
                                className="w-full border border-gray-300 rounded px-3 py-2 text-sm" required />
                            {errors.end_date && <p className="text-red-600 text-xs mt-1">{errors.end_date[0]}</p>}
                        </div>
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