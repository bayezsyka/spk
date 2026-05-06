import { useForm, router } from '@inertiajs/react';
import { useState } from 'react';
import StatusBadge from '@/Components/UI/StatusBadge';
import EmptyState from '@/Components/UI/EmptyState';
import PipelineActionBar from '@/Components/Pipeline/PipelineActionBar';

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

    const { data, setData, put, processing, errors, reset } = useForm({
        code: '',
        name: '',
        attribute_type: 'benefit' as 'benefit' | 'cost',
        input_type: 'numeric' as 'numeric' | 'categorical',
        description: '',
        subscales: [] as { label: string; numeric_value: string }[],
    });

    const startEdit = (criterion: any) => {
        setEditingId(criterion.id);
        setShowForm(true);
        setData({
            code: criterion.code,
            name: criterion.name,
            attribute_type: criterion.attribute_type,
            input_type: criterion.input_type,
            description: criterion.description || '',
            subscales: criterion.subscales?.map((subscale: any) => ({
                label: subscale.label,
                numeric_value: String(subscale.numeric_value),
            })) || [],
        });
    };

    const cancelForm = () => {
        setShowForm(false);
        setEditingId(null);
        reset();
    };

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();

        if (!editingId) {
            return;
        }

        const criterion = criteria.find((item: any) => item.id === editingId);

        put(route('pipeline.setup.criteria.update', [period.route_key, criterion.route_key]), {
            onSuccess: () => cancelForm(),
        });
    };

    const handleComplete = () => {
        router.post(route('pipeline.setup.complete', period.route_key));
    };

    const addSubscale = () => {
        setData('subscales', [...data.subscales, { label: '', numeric_value: '' }]);
    };

    const removeSubscale = (index: number) => {
        setData('subscales', data.subscales.filter((_, currentIndex) => currentIndex !== index));
    };

    const updateSubscale = (index: number, field: 'label' | 'numeric_value', value: string) => {
        const updated = [...data.subscales];
        updated[index] = { ...updated[index], [field]: value };
        setData('subscales', updated);
    };

    const isCompleted = pipelineState.currentStep > 1;

    return (
        <div className="space-y-5">
            <PipelineActionBar
                title="Konfigurasi Kriteria"
                subtitle={`Langkah 1: Mengatur kriteria inti untuk periode ${period.name}`}
                actions={
                    <>
                        {criteria.length >= 5 && !isCompleted && (
                            <button
                                onClick={handleComplete}
                                className="inline-flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white text-sm font-bold rounded-lg hover:bg-indigo-700 transition-all shadow-md shadow-indigo-100"
                            >
                                <span>Lanjut ke Input Nilai</span>
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                </svg>
                            </button>
                        )}
                        {isCompleted && (
                            <button
                                onClick={() => onNavigateStep(1)}
                                className="inline-flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white text-sm font-bold rounded-lg hover:bg-indigo-700 transition-all shadow-md shadow-indigo-100"
                            >
                                <span>Lanjut</span>
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                </svg>
                            </button>
                        )}
                    </>
                }
            />

            <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h4 className="text-sm font-semibold text-slate-900 uppercase tracking-wider">Informasi Kriteria</h4>
                        <p className="text-slate-500 text-sm mt-1">
                            Sistem ini menggunakan kriteria inti yang telah ditentukan. Kode C1 sampai C5 tidak dapat diubah.
                        </p>
                    </div>
                </div>
            </div>

            {showForm && (
                <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                    <h4 className="font-medium text-slate-900 mb-4">Edit Kriteria</h4>
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div>
                                <label className="block text-xs font-medium text-slate-600 mb-1.5">Kode</label>
                                <input
                                    type="text"
                                    value={data.code}
                                    disabled
                                    className="w-full rounded-lg border-slate-300 bg-slate-100 py-2.5 text-sm text-slate-500"
                                />
                                {errors.code && <p className="text-rose-600 text-xs mt-1">{errors.code}</p>}
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-slate-600 mb-1.5">Nama</label>
                                <input
                                    type="text"
                                    value={data.name}
                                    onChange={(event) => setData('name', event.target.value)}
                                    className="w-full rounded-lg border-slate-300 bg-white py-2.5 text-sm focus:ring-indigo-500 focus:border-indigo-500"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-slate-600 mb-1.5">Sifat</label>
                                <input
                                    type="text"
                                    value={data.attribute_type === 'benefit' ? 'Benefit' : 'Cost'}
                                    disabled
                                    className="w-full rounded-lg border-slate-300 bg-slate-100 py-2.5 text-sm text-slate-500"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-slate-600 mb-1.5">Format Input</label>
                                <input
                                    type="text"
                                    value={data.input_type === 'numeric' ? 'Numerik' : 'Kategorikal'}
                                    disabled
                                    className="w-full rounded-lg border-slate-300 bg-slate-100 py-2.5 text-sm text-slate-500"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-slate-600 mb-1.5">Deskripsi</label>
                            <textarea
                                value={data.description}
                                onChange={(event) => setData('description', event.target.value)}
                                className="w-full rounded-lg border-slate-300 bg-white py-2.5 text-sm focus:ring-indigo-500 focus:border-indigo-500 min-h-[90px]"
                            />
                        </div>

                        {data.input_type === 'categorical' && (
                            <div className="border-t border-slate-100 pt-4">
                                <div className="flex items-center justify-between mb-3">
                                    <label className="text-xs font-medium text-slate-600">Subskala</label>
                                    <button type="button" onClick={addSubscale} className="text-xs font-medium text-indigo-600 hover:text-indigo-700">
                                        + Tambah Subskala
                                    </button>
                                </div>
                                <div className="space-y-2">
                                    {data.subscales.map((subscale, index) => (
                                        <div key={index} className="flex items-center gap-3">
                                            <input
                                                type="text"
                                                value={subscale.label}
                                                onChange={(event) => updateSubscale(index, 'label', event.target.value)}
                                                placeholder="Label subskala"
                                                className="flex-1 rounded-lg border-slate-300 bg-white py-2 text-sm focus:ring-indigo-500 focus:border-indigo-500"
                                            />
                                            <input
                                                type="number"
                                                value={subscale.numeric_value}
                                                onChange={(event) => updateSubscale(index, 'numeric_value', event.target.value)}
                                                placeholder="Nilai"
                                                className="w-24 rounded-lg border-slate-300 bg-white py-2 text-sm focus:ring-indigo-500 focus:border-indigo-500"
                                            />
                                            <button type="button" onClick={() => removeSubscale(index)} className="p-1.5 text-slate-400 hover:text-rose-500 transition-colors">
                                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="flex gap-3 justify-end pt-2">
                            <button type="button" onClick={cancelForm} className="px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors">
                                Batal
                            </button>
                            <button type="submit" disabled={processing} className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50">
                                {processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

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
                                            title="Kriteria belum tersedia"
                                            description="Template kriteria inti belum terbentuk pada periode ini."
                                        />
                                    </td>
                                </tr>
                            ) : criteria.map((criterion: any) => (
                                <tr key={criterion.id} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="py-3 px-5">
                                        <span className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-slate-100 text-slate-600 text-xs font-semibold border border-slate-200">
                                            {criterion.code}
                                        </span>
                                    </td>
                                    <td className="py-3 px-5">
                                        <div className="font-medium text-slate-900 text-sm">{criterion.name}</div>
                                        {criterion.subscales?.length > 0 && (
                                            <div className="mt-1 flex flex-wrap gap-1">
                                                {criterion.subscales.map((subscale: any) => (
                                                    <span key={subscale.id} className="text-[9px] font-medium bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded">
                                                        {subscale.label} ({subscale.numeric_value})
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </td>
                                    <td className="py-3 px-5">
                                        <StatusBadge variant={criterion.attribute_type}>
                                            {criterion.attribute_type}
                                        </StatusBadge>
                                    </td>
                                    <td className="py-3 px-5">
                                        <StatusBadge variant={criterion.input_type}>
                                            {criterion.input_type}
                                        </StatusBadge>
                                    </td>
                                    <td className="py-3 px-5 text-right">
                                        <button
                                            onClick={() => startEdit(criterion)}
                                            className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors"
                                            title="Edit"
                                        >
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                            </svg>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="flex items-center justify-center p-4">
                <div className="text-xs text-slate-400 italic">Gunakan bar navigasi di bagian atas untuk melanjutkan ke tahap berikutnya.</div>
            </div>
        </div>
    );
}
