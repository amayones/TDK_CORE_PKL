import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const STATUS_OPTIONS = [
    { value: 'draft', label: 'Draft' },
    { value: 'submitted', label: 'Dikirim' },
    { value: 'reviewed', label: 'Direview' },
];

export default function EvaluationFormModal({ isOpen, onClose, onSubmit, options, initialData, submitting }) {
    const [form, setForm] = useState({
        peserta_pkl_id: '', project_id: '', period_start: '', period_end: '',
        score_attitude: '', score_skills: '', score_knowledge: '',
        score_communication: '', score_teamwork: '',
        strengths: '', improvements: '', overall_notes: '', status: 'draft',
    });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (initialData) {
            setForm({
                peserta_pkl_id: initialData.peserta_pkl_id || '',
                project_id: initialData.project_id || '',
                period_start: initialData.period_start?.substring(0, 10) || '',
                period_end: initialData.period_end?.substring(0, 10) || '',
                score_attitude: initialData.score_attitude || '',
                score_skills: initialData.score_skills || '',
                score_knowledge: initialData.score_knowledge || '',
                score_communication: initialData.score_communication || '',
                score_teamwork: initialData.score_teamwork || '',
                strengths: initialData.strengths || '',
                improvements: initialData.improvements || '',
                overall_notes: initialData.overall_notes || '',
                status: initialData.status || 'draft',
            });
        } else {
            setForm({
                peserta_pkl_id: '', project_id: '', period_start: '', period_end: '',
                score_attitude: '', score_skills: '', score_knowledge: '',
                score_communication: '', score_teamwork: '',
                strengths: '', improvements: '', overall_notes: '', status: 'draft',
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
                        {initialData ? 'Edit Evaluasi' : 'Tambah Evaluasi'}
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
                                {options.peserta_pkls?.map((p) => (
                                    <option key={p.id} value={p.id}>{p.full_name}</option>
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

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Periode Awal <span className="text-red-500">*</span></label>
                            <input type="date" name="period_start" value={form.period_start} onChange={handleChange}
                                className="w-full border border-gray-300 rounded px-3 py-2 text-sm" required />
                            {errors.period_start && <p className="text-red-600 text-xs mt-1">{errors.period_start[0]}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Periode Akhir <span className="text-red-500">*</span></label>
                            <input type="date" name="period_end" value={form.period_end} onChange={handleChange}
                                className="w-full border border-gray-300 rounded px-3 py-2 text-sm" required />
                            {errors.period_end && <p className="text-red-600 text-xs mt-1">{errors.period_end[0]}</p>}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nilai (0-100)</label>
                        <div className="grid grid-cols-5 gap-2">
                            {['score_attitude', 'score_skills', 'score_knowledge', 'score_communication', 'score_teamwork'].map((field) => (
                                <div key={field}>
                                    <input type="number" name={field} value={form[field]} onChange={handleChange}
                                        min="0" max="100"
                                        className="w-full border border-gray-300 rounded px-2 py-1 text-xs"
                                        placeholder={field.replace('score_', '').substring(0, 3)} />
                                </div>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Kekuatan</label>
                        <textarea name="strengths" value={form.strengths} onChange={handleChange} rows={2}
                            className="w-full border border-gray-300 rounded px-3 py-2 text-sm" />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Perbaikan</label>
                        <textarea name="improvements" value={form.improvements} onChange={handleChange} rows={2}
                            className="w-full border border-gray-300 rounded px-3 py-2 text-sm" />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Catatan Umum</label>
                        <textarea name="overall_notes" value={form.overall_notes} onChange={handleChange} rows={2}
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