import { useForm, router } from '@inertiajs/react';
import { useState } from 'react';

interface Props {
    period: any;
    stepData: any;
    pipelineState: any;
    onNavigateStep: (step: number) => void;
}

export default function SetupStep({ period, stepData, pipelineState, onNavigateStep }: Props) {
    const criteria = stepData.setup?.criteria || [];
    const [showForm, setShowForm] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        code: '',
        name: '',
        attribute_type: 'benefit' as 'benefit' | 'cost',
        input_type: 'numeric' as 'numeric' | 'categorical',
        description: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('pipeline.setup.criteria.store', period.id), {
            onSuccess: () => {
                reset();
                setShowForm(false);
            },
        });
    };

    const handleDelete = (criterionId: number) => {
        if (confirm('Hapus kriteria ini? Data terkait akan ikut terhapus.')) {
            router.delete(route('pipeline.setup.criteria.destroy', [period.id, criterionId]));
        }
    };

    const handleComplete = () => {
        router.post(route('pipeline.setup.complete', period.id));
    };

    const isCompleted = pipelineState.currentStep > 1;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                            Konfigurasi Kriteria
                        </h3>
                        <p className="text-slate-500 text-sm mt-1">
                            Tentukan parameter penilaian yang digunakan untuk mengevaluasi peserta pada periode <span className="font-bold text-indigo-600">{period.name}</span>.
                        </p>
                    </div>
                    <div className="flex gap-3">
                        {!showForm && (
                            <button
                                onClick={() => setShowForm(true)}
                                className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white text-sm font-bold rounded-xl shadow-lg shadow-indigo-200 hover:bg-indigo-700 hover:-translate-y-0.5 transition-all active:scale-95"
                            >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                                </svg>
                                Tambah Kriteria
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Add Criteria Form */}
            {showForm && (
                <div className="bg-white rounded-2xl border border-indigo-200 p-6 shadow-sm animate-in slide-in-from-top-2 duration-200">
                    <h4 className="font-bold text-slate-900 mb-4">Tambah Kriteria Baru</h4>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div>
                                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5">Kode</label>
                                <input
                                    type="text"
                                    value={data.code}
                                    onChange={e => setData('code', e.target.value)}
                                    placeholder="C1"
                                    className="w-full rounded-xl border-slate-200 bg-slate-50 py-3 text-sm focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                                />
                                {errors.code && <p className="text-rose-500 text-xs mt-1 font-medium">{errors.code}</p>}
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5">Nama</label>
                                <input
                                    type="text"
                                    value={data.name}
                                    onChange={e => setData('name', e.target.value)}
                                    placeholder="Pre Test"
                                    className="w-full rounded-xl border-slate-200 bg-slate-50 py-3 text-sm focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5">Sifat</label>
                                <select
                                    value={data.attribute_type}
                                    onChange={e => setData('attribute_type', e.target.value as any)}
                                    className="w-full rounded-xl border-slate-200 bg-slate-50 py-3 text-sm focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                                >
                                    <option value="benefit">Benefit (↑ semakin baik)</option>
                                    <option value="cost">Cost (↓ semakin baik)</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5">Format Input</label>
                                <select
                                    value={data.input_type}
                                    onChange={e => setData('input_type', e.target.value as any)}
                                    className="w-full rounded-xl border-slate-200 bg-slate-50 py-3 text-sm focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                                >
                                    <option value="numeric">Numerik</option>
                                    <option value="categorical">Kategorikal (Subskala)</option>
                                </select>
                            </div>
                        </div>
                        <div className="flex gap-3 justify-end">
                            <button type="button" onClick={() => { setShowForm(false); reset(); }} className="px-5 py-2.5 text-sm font-bold text-slate-600 bg-slate-100 rounded-xl hover:bg-slate-200 transition-all">
                                Batal
                            </button>
                            <button type="submit" disabled={processing} className="px-5 py-2.5 text-sm font-bold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 transition-all disabled:opacity-50 shadow-lg shadow-indigo-200">
                                {processing ? 'Menyimpan...' : 'Simpan Kriteria'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Criteria Table */}
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50/80 border-b border-slate-200">
                            <tr>
                                <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Kode</th>
                                <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Parameter</th>
                                <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Sifat</th>
                                <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Format</th>
                                <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {criteria.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="py-16 text-center text-slate-400">
                                        <div className="space-y-3">
                                            <svg className="w-12 h-12 mx-auto text-slate-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                            </svg>
                                            <p className="font-bold text-sm">Belum ada kriteria</p>
                                            <p className="text-xs">Tambahkan minimal 2 kriteria untuk melanjutkan.</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : criteria.map((c: any) => (
                                <tr key={c.id} className="hover:bg-slate-50/50 transition-colors group">
                                    <td className="py-4 px-6">
                                        <span className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center font-bold text-slate-600 text-sm border border-slate-200 group-hover:bg-indigo-600 group-hover:text-white group-hover:border-indigo-600 transition-all">
                                            {c.code}
                                        </span>
                                    </td>
                                    <td className="py-4 px-6">
                                        <div className="font-bold text-slate-900">{c.name}</div>
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
                                    <td className="py-4 px-6">
                                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                            c.attribute_type === 'benefit'
                                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                                                : 'bg-amber-50 text-amber-700 border border-amber-100'
                                        }`}>
                                            <span className={`w-1.5 h-1.5 rounded-full ${c.attribute_type === 'benefit' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                                            {c.attribute_type}
                                        </span>
                                    </td>
                                    <td className="py-4 px-6 uppercase text-[10px] font-bold text-slate-500 tracking-widest">
                                        {c.input_type}
                                    </td>
                                    <td className="py-4 px-6 text-right">
                                        <button
                                            onClick={() => handleDelete(c.id)}
                                            className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                                            title="Hapus"
                                        >
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Complete Step Button */}
            {criteria.length >= 2 && !isCompleted && (
                <div className="flex justify-end">
                    <button
                        onClick={handleComplete}
                        className="inline-flex items-center gap-3 px-8 py-4 bg-indigo-600 text-white font-black rounded-2xl shadow-xl shadow-indigo-200 hover:bg-indigo-700 hover:-translate-y-0.5 transition-all active:scale-[0.98] uppercase text-sm tracking-wider"
                    >
                        Lanjut ke Input Nilai
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                    </button>
                </div>
            )}

            {isCompleted && (
                <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-6 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-emerald-500 text-white rounded-xl flex items-center justify-center">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <div>
                            <p className="font-bold text-emerald-800 text-sm">Tahap Konfigurasi Selesai</p>
                            <p className="text-emerald-600 text-xs mt-0.5">{criteria.length} kriteria terkonfigurasi.</p>
                        </div>
                    </div>
                    <button
                        onClick={() => onNavigateStep(1)}
                        className="px-5 py-2.5 bg-emerald-600 text-white text-xs font-bold rounded-xl hover:bg-emerald-700 transition-all"
                    >
                        Lanjut →
                    </button>
                </div>
            )}
        </div>
    );
}
