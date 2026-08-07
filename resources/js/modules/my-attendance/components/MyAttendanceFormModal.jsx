import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const STATUS_OPTIONS = [
    { value: 'hadir', label: 'Hadir' },
    { value: 'izin', label: 'Izin' },
    { value: 'sakit', label: 'Sakit' },
    { value: 'alpha', label: 'Alpha' },
];

export default function MyAttendanceFormModal({ isOpen, onClose, onSubmit, initialData, submitting }) {
    const [form, setForm] = useState({
        attendance_date: '', check_in: '', check_out: '', status: 'hadir', notes: '',
    });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (initialData) {
            setForm({
                attendance_date: initialData.attendance_date?.substring(0, 10) || '',
                check_in: initialData.check_in || '',
                check_out: initialData.check_out || '',
                status: initialData.status || 'hadir',
                notes: initialData.notes || '',
            });
        } else {
            setForm({
                attendance_date: new Date().toISOString().split('T')[0],
                check_in: '', check_out: '', status: 'hadir', notes: '',
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
                        {initialData ? 'Edit Absensi' : 'Tambah Absensi'}
                    </h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="px-6 py-4 space-y-4 max-h-[75vh] overflow-y-auto">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Absensi <span className="text-red-500">*</span></label>
                        <input type="date" name="attendance_date" value={form.attendance_date} onChange={handleChange}
                            className="w-full border border-gray-300 rounded px-3 py-2 text-sm" required />
                        {errors.attendance_date && <p className="text-red-600 text-xs mt-1">{errors.attendance_date[0]}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Check In</label>
                            <input type="time" name="check_in" value={form.check_in} onChange={handleChange}
                                className="w-full border border-gray-300 rounded px-3 py-2 text-sm" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Check Out</label>
                            <input type="time" name="check_out" value={form.check_out} onChange={handleChange}
                                className="w-full border border-gray-300 rounded px-3 py-2 text-sm" />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Status <span className="text-red-500">*</span></label>
                        <select name="status" value={form.status} onChange={handleChange}
                            className="w-full border border-gray-300 rounded px-3 py-2 text-sm">
                            {STATUS_OPTIONS.map((s) => (
                                <option key={s.value} value={s.value}>{s.label}</option>
                            ))}
                        </select>
                        {errors.status && <p className="text-red-600 text-xs mt-1">{errors.status[0]}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Catatan</label>
                        <textarea name="notes" value={form.notes} onChange={handleChange} rows={3}
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
