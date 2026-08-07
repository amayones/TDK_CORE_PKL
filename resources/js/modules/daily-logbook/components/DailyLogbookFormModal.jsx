import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const STATUS_OPTIONS = [
    { value: 'draft', label: 'Draft' },
    { value: 'submitted', label: 'Diajukan' },
    { value: 'reviewed', label: 'Direview' },
];

export default function DailyLogbookFormModal({ isOpen, onClose, onSubmit, initialData, submitting }) {
    const [form, setForm] = useState({
        log_date: '', activities: '', challenges: '', next_plan: '', hours_worked: '', status: 'draft',
    });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (initialData) {
            setForm({
                log_date: initialData.log_date?.substring(0, 10) || '',
                activities: initialData.activities || '',
                challenges: initialData.challenges || '',
                next_plan: initialData.next_plan || '',
                hours_worked: initialData.hours_worked || '',
                status: initialData.status || 'draft',
            });
        } else {
            setForm({
                log_date: '', activities: '', challenges: '', next_plan: '', hours_worked: '', status: 'draft',
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
                        {initialData ? 'Edit Logbook' : 'Tambah Logbook'}
                    </h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="px-6 py-4 space-y-4 max-h-[75vh] overflow-y-auto">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal <span className="text-red-500">*</span></label>
                        <input type="date" name="log_date" value={form.log_date} onChange={handleChange}
                            className="w-full border border-gray-300 rounded px-3 py-2 text-sm" required />
                        {errors.log_date && <p className="text-red-600 text-xs mt-1">{errors.log_date[0]}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Aktivitas Harian <span className="text-red-500">*</span></label>
                        <textarea name="activities" value={form.activities} onChange={handleChange} rows={4}
                            className="w-full border border-gray-300 rounded px-3 py-2 text-sm" required />
                        {errors.activities && <p className="text-red-600 text-xs mt-1">{errors.activities[0]}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Jam Kerja</label>
                            <input type="number" name="hours_worked" value={form.hours_worked} onChange={handleChange}
                                min="0" max="24"
                                className="w-full border border-gray-300 rounded px-3 py-2 text-sm" />
                            {errors.hours_worked && <p className="text-red-600 text-xs mt-1">{errors.hours_worked[0]}</p>}
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
                        <label className="block text-sm font-medium text-gray-700 mb-1">Kendala</label>
                        <textarea name="challenges" value={form.challenges} onChange={handleChange} rows={2}
                            className="w-full border border-gray-300 rounded px-3 py-2 text-sm" />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Rencana Selanjutnya</label>
                        <textarea name="next_plan" value={form.next_plan} onChange={handleChange} rows={2}
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