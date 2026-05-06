import { useForm, router } from '@inertiajs/react';
import { useState } from 'react';
import StatusBadge from '@/Components/UI/StatusBadge';
import ConfirmModal from '@/Components/UI/ConfirmModal';
import EmptyState from '@/Components/UI/EmptyState';

interface Props {
    period: any;
    stepData: any;
    pipelineState: any;
    onNavigateStep: (step: number) => void;
}

export default function SetupStep({ period, stepData, pipelineState, onNavigateStep }: Props) {
    const criteria = stepData.setup?.criteria || [];
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [deleteTarget, setDeleteTarget] = useState<any>(null);

    const { data, setData, post, put, processing, errors, reset } = useForm({
        code: '',
        name: '',
        attribute_type: 'benefit' as 'benefit' | 'cost',
        input_type: 'numeric' as 'numeric' | 'categorical',
        description: '',
        subscales: [] as { label: string; numeric_value: string }[],
    });

    const startEdit = (c: any) => {
        setEditingId(c.id);
        setShowForm(true);
        setData({
            code: c.code,
            name: c.name,
            attribute_type: c.attribute_type,
            input_type: c.input_type,
            description: c.description || '',
            subscales: c.subscales?.map((s: any) => ({
                label: s.label,
                numeric_value: String(s.numeric_value),
            })) || [],
        });
    };

    const cancelForm = () => {
        setShowForm(false);
        setEditingId(null);
        reset();
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingId) {
            const criterion = criteria.find((c: any) => c.id === editingId);
            put(route('pipeline.setup.criteria.update', [period.route_key, criterion.route_key]), {
                onSuccess: () => cancelForm(),
            });
        } else {
            post(route('pipeline.setup.criteria.store', period.route_key), {
                onSuccess: () => cancelForm(),
            });
        }
    };

    const handleDelete = () => {
        if (!deleteTarget) return;
        router.delete(route('pipeline.setup.criteria.destroy', [period.route_key, deleteTarget.route_key]), {
            onSuccess: () => setDeleteTarget(null),
        });
    };

    const handleComplete = () => {
        router.post(route('pipeline.setup.complete', period.route_key));
    };

    const addSubscale = () => {
        setData('subscales', [...data.subscales, { label: '', numeric_value: '' }]);
    };

    const removeSubscale = (index: number) => {
        setData('subscales', data.subscales.filter((_, i) => i !== index));
    };

    const updateSubscale = (index: number, field: 'label' | 'numeric_value', value: string) => {
        const updated = [...data.subscales];
        updated[index] = { ...updated[index], [field]: value };
        setData('subscales', updated);
    };

    const isCompleted = pipelineState.currentStep > 1;

    return (
        <div className="space-y-5">
            {/* Header */}
            <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h3 className="text-lg font-semibold text-slate-900">
                            Konfigurasi Kriteria
                        </h3>
                        <p className="text-slate-500 text-sm mt-1">
                            Tentukan parameter penilaian untuk periode <span className="font-medium text-indigo-600">{period.name}</span>.
                        </p>
                    </div>
                    {!showForm && (
                        <button
                            onClick={() => { setEditingId(null); setShowForm(true); }}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            Tambah Kriteria
                        </button>
                    )}
                </div>
            </div>

            {/* Add/Edit Criteria Form */}
            {showForm && (
                <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                    <h4 className="font-medium text-slate-900 mb-4">
                        {editingId ? 'Edit Kriteria' : 'Tambah Kriteria Baru'}
                    </h4>
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div>
                                <label className="block text-xs font-medium text-slate-600 mb-1.5">Kode</label>
                                <input
                                    type="text"
                                    value={data.code}
                                    onChange={e => setData('code', e.target.value)}
                                    placeholder="C1"
                                    className="w-full rounded-lg border-slate-300 bg-white py-2.5 text-sm focus:ring-indigo-500 focus:border-indigo-500"
                                />
                                {errors.code && <p className="text-rose-600 text-xs mt-1">{errors.code}</p>}
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-slate-600 mb-1.5">Nama</label>
                                <input
                                    type="text"
                                    value={data.name}
                                    onChange={e => setData('name', e.target.value)}
                                    placeholder="Pre Test"
                                    className="w-full rounded-lg border-slate-300 bg-white py-2.5 text-sm focus:ring-indigo-500 focus:border-indigo-500"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-slate-600 mb-1.5">Sifat</label>
                                <select
                                    value={data.attribute_type}
                                    onChange={e => setData('attribute_type', e.target.value as any)}
                                    className="w-full rounded-lg border-slate-300 bg-white py-2.5 text-sm focus:ring-indigo-500 focus:border-indigo-500"
                                >
                                    <option value="benefit">Benefit (semakin tinggi semakin baik)</option>
                                    <option value="cost">Cost (semakin rendah semakin baik)</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-slate-600 mb-1.5">Format Input</label>
                                <select
                                    value={data.input_type}
                                    onChange={e => setData('input_type', e.target.value as any)}
                                    className="w-full rounded-lg border-slate-300 bg-white py-2.5 text-sm focus:ring-indigo-500 focus:border-indigo-500"
                                >
                                    <option value="numeric">Numerik</option>
                                    <option value="categorical">Kategorikal (Subskala)</option>
                                </select>
                            </div>
                        </div>

                        {/* Subscales editor for categorical */}
                        {data.input_type === 'categorical' && (
                            <div className="border-t border-slate-100 pt-4">
                                <div className="flex items-center justify-between mb-3">
                                    <label className="text-xs font-medium text-slate-600">Subskala</label>
                                    <button type="button" onClick={addSubscale} className="text-xs font-medium text-indigo-600 hover:text-indigo-700">
                                        + Tambah Subskala
                                    </button>
                                </div>
                                <div className="space-y-2">
                                    {data.subscales.map((s, i) => (
                                        <div key={i} className="flex items-center gap-3">
                                            <input
                                                type="text"
                                                value={s.label}
                                                onChange={e => updateSubscale(i, 'label', e.target.value)}
                                                placeholder="Label (mis: Sangat Baik)"
                                                className="flex-1 rounded-lg border-slate-300 bg-white py-2 text-sm focus:ring-indigo-500 focus:border-indigo-500"
                                            />
                                            <input
                                                type="number"
                                                value={s.numeric_value}
                                                onChange={e => updateSubscale(i, 'numeric_value', e.target.value)}
                                                placeholder="Nilai"
                                                className="w-24 rounded-lg border-slate-300 bg-white py-2 text-sm focus:ring-indigo-500 focus:border-indigo-500"
                                            />
                                            <button type="button" onClick={() => removeSubscale(i)} className="p-1.5 text-slate-400 hover:text-rose-500 transition-colors">
                                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </button>
                                        </div>
                                    ))}
                                    {data.subscales.length === 0 && (
                                        <p className="text-xs text-slate-400 py-2">Belum ada subskala. Klik "Tambah Subskala" di atas.</p>
                                    )}
                                </div>
                            </div>
                        )}

                        <div className="flex gap-3 justify-end pt-2">
                            <button type="button" onClick={cancelForm} className="px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors">
                                Batal
                            </button>
                            <button type="submit" disabled={processing} className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50">
                                {processing ? 'Menyimpan...' : (editingId ? 'Simpan Perubahan' : 'Simpan Kriteria')}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Criteria Table */}
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                                <th className="py-3 px-5 text-xs font-medium text-slate-500 uppercase tracking-wider">Kode</th>
                                <th className="py-3 px-5 text-xs font-medium text-slate-500 uppercase tracking-wider">Parameter</th>
                                <th className="py-3 px-5 text-xs font-medium text-slate-500 uppercase tracking-wider">Sifat</th>
                                <th className="py-3 px-5 text-xs font-medium text-slate-500 uppercase tracking-wider">Format</th>
                                <th className="py-3 px-5 text-xs font-medium text-slate-500 uppercase tracking-wider text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {criteria.length === 0 ? (
                                <tr>
                                    <td colSpan={5}>
                                        <EmptyState
                                            title="Belum ada kriteria"
                                            description="Tambahkan minimal 2 kriteria untuk melanjutkan pipeline."
                                        />
                                    </td>
                                </tr>
                            ) : criteria.map((c: any) => (
                                <tr key={c.id} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="py-3 px-5">
                                        <span className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-slate-100 text-slate-600 text-xs font-semibold border border-slate-200">
                                            {c.code}
                                        </span>
                                    </td>
                                    <td className="py-3 px-5">
                                        <div className="font-medium text-slate-900 text-sm">{c.name}</div>
                                        {c.subscales?.length > 0 && (
                                            <div className="mt-1 flex flex-wrap gap-1">
                                                {c.subscales.map((s: any) => (
                                                    <span key={s.id} className="text-[9px] font-medium bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded">
                                                        {s.label} ({s.numeric_value})
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </td>
                                    <td className="py-3 px-5">
                                        <StatusBadge variant={c.attribute_type}>
                                            {c.attribute_type}
                                        </StatusBadge>
                                    </td>
                                    <td className="py-3 px-5">
                                        <StatusBadge variant={c.input_type}>
                                            {c.input_type}
                                        </StatusBadge>
                                    </td>
                                    <td className="py-3 px-5 text-right">
                                        <div className="flex items-center justify-end gap-1">
                                            <button
                                                onClick={() => startEdit(c)}
                                                className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors"
                                                title="Edit"
                                            >
                                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                </svg>
                                            </button>
                                            <button
                                                onClick={() => setDeleteTarget(c)}
                                                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
                                                title="Hapus"
                                            >
                                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between">
                <div />
                {criteria.length >= 2 && !isCompleted && (
                    <button
                        onClick={handleComplete}
                        className="inline-flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors text-sm"
                    >
                        Lanjut ke Input Nilai
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                    </button>
                )}
                {isCompleted && (
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 text-sm text-emerald-700">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <span className="font-medium">{criteria.length} kriteria terkonfigurasi</span>
                        </div>
                        <button
                            onClick={() => onNavigateStep(1)}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
                        >
                            Lanjut
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                            </svg>
                        </button>
                    </div>
                )}
            </div>

            {/* Delete Confirmation Modal */}
            <ConfirmModal
                show={!!deleteTarget}
                onClose={() => setDeleteTarget(null)}
                onConfirm={handleDelete}
                title="Hapus Kriteria"
                message={`Apakah Anda yakin ingin menghapus kriteria "${deleteTarget?.name}"? Semua data terkait termasuk subskala akan ikut terhapus.`}
            />
        </div>
    );
}
