import { router } from '@inertiajs/react';
import { useState } from 'react';
import ProcessButton from '@/Components/Pipeline/ProcessButton';

interface Props {
    period: any;
    stepData: any;
    pipelineState: any;
    completedRuns: any;
    onNavigateStep: (step: number) => void;
}

export default function BwmStep({ period, stepData, pipelineState, completedRuns, onNavigateStep }: Props) {
    const criteria = stepData.setup?.criteria || [];
    const bwmData = stepData.bwm;
    const hasResult = !!bwmData?.runPayload;

    const [bestId, setBestId] = useState<number | ''>(bwmData?.comparison?.best_criterion_id || '');
    const [worstId, setWorstId] = useState<number | ''>(bwmData?.comparison?.worst_criterion_id || '');
    const [processing, setProcessing] = useState(false);

    // Initialize comparison vectors
    const initVector = (savedValues: any) => {
        const vec: Record<number, number> = {};
        criteria.forEach((c: any) => { vec[c.id] = savedValues?.[c.id] || 1; });
        return vec;
    };

    const [bestToOthers, setBestToOthers] = useState<Record<number, number>>(initVector(bwmData?.comparison?.best_to_others));
    const [othersToWorst, setOthersToWorst] = useState<Record<number, number>>(initVector(bwmData?.comparison?.others_to_worst));

    const handleProcess = () => {
        setProcessing(true);
        router.post(route('pipeline.bwm.process', period.id), {
            best_criterion_id: bestId,
            worst_criterion_id: worstId,
            best_to_others: bestToOthers,
            others_to_worst: othersToWorst,
        }, {
            onFinish: () => setProcessing(false),
        });
    };

    const isCompleted = pipelineState.currentStep > 3;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-gradient-to-r from-indigo-600 to-violet-600 rounded-2xl sm:rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-indigo-200/50">
                <h3 className="text-xl sm:text-2xl font-black tracking-tight">Pembobotan BWM</h3>
                <p className="text-indigo-100 text-sm mt-2 max-w-xl">
                    Best-Worst Method (BWM) menentukan bobot prioritas setiap kriteria.
                    Pilih kriteria terbaik & terburuk, lalu berikan nilai preferensi (1-9) untuk setiap perbandingan.
                </p>
            </div>

            {/* BWM Input Form */}
            {!hasResult && (
                <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-8">
                    {/* Best & Worst Selection */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">
                                🏆 Kriteria Terbaik (Best)
                            </label>
                            <select
                                value={bestId}
                                onChange={e => setBestId(Number(e.target.value))}
                                className="w-full rounded-xl border-slate-200 bg-slate-50 py-3 text-sm focus:ring-indigo-500 focus:border-indigo-500"
                            >
                                <option value="">Pilih kriteria terbaik...</option>
                                {criteria.map((c: any) => (
                                    <option key={c.id} value={c.id} disabled={c.id === worstId}>
                                        {c.code} — {c.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">
                                📉 Kriteria Terburuk (Worst)
                            </label>
                            <select
                                value={worstId}
                                onChange={e => setWorstId(Number(e.target.value))}
                                className="w-full rounded-xl border-slate-200 bg-slate-50 py-3 text-sm focus:ring-indigo-500 focus:border-indigo-500"
                            >
                                <option value="">Pilih kriteria terburuk...</option>
                                {criteria.map((c: any) => (
                                    <option key={c.id} value={c.id} disabled={c.id === bestId}>
                                        {c.code} — {c.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Best-to-Others Vector */}
                    {bestId && (
                        <div>
                            <h4 className="text-sm font-black text-slate-900 mb-4">
                                Preferensi: Best → Others <span className="text-xs font-medium text-slate-400">(1 = sama penting, 9 = sangat lebih penting)</span>
                            </h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {criteria.filter((c: any) => c.id !== bestId).map((c: any) => (
                                    <div key={c.id} className="flex items-center gap-3 bg-slate-50 rounded-xl p-4 border border-slate-100">
                                        <span className="w-10 h-10 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-xs font-bold text-slate-600 shrink-0">
                                            {c.code}
                                        </span>
                                        <div className="flex-1">
                                            <p className="text-xs font-bold text-slate-700 truncate">{c.name}</p>
                                            <input
                                                type="range"
                                                min={1}
                                                max={9}
                                                value={bestToOthers[c.id] || 1}
                                                onChange={e => setBestToOthers(prev => ({ ...prev, [c.id]: Number(e.target.value) }))}
                                                className="w-full h-1.5 bg-indigo-100 rounded-full appearance-none cursor-pointer accent-indigo-600 mt-1"
                                            />
                                        </div>
                                        <span className="text-lg font-black text-indigo-600 w-8 text-center">
                                            {bestToOthers[c.id] || 1}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Others-to-Worst Vector */}
                    {worstId && (
                        <div>
                            <h4 className="text-sm font-black text-slate-900 mb-4">
                                Preferensi: Others → Worst <span className="text-xs font-medium text-slate-400">(1 = sama penting, 9 = sangat lebih penting)</span>
                            </h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {criteria.filter((c: any) => c.id !== worstId).map((c: any) => (
                                    <div key={c.id} className="flex items-center gap-3 bg-slate-50 rounded-xl p-4 border border-slate-100">
                                        <span className="w-10 h-10 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-xs font-bold text-slate-600 shrink-0">
                                            {c.code}
                                        </span>
                                        <div className="flex-1">
                                            <p className="text-xs font-bold text-slate-700 truncate">{c.name}</p>
                                            <input
                                                type="range"
                                                min={1}
                                                max={9}
                                                value={othersToWorst[c.id] || 1}
                                                onChange={e => setOthersToWorst(prev => ({ ...prev, [c.id]: Number(e.target.value) }))}
                                                className="w-full h-1.5 bg-violet-100 rounded-full appearance-none cursor-pointer accent-violet-600 mt-1"
                                            />
                                        </div>
                                        <span className="text-lg font-black text-violet-600 w-8 text-center">
                                            {othersToWorst[c.id] || 1}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Process Button */}
                    {bestId && worstId && (
                        <div className="flex justify-end pt-4">
                            <ProcessButton
                                processing={processing}
                                onClick={handleProcess}
                                label="Hitung Bobot BWM"
                                loadingLabel="Menghitung..."
                            />
                        </div>
                    )}
                </div>
            )}

            {/* Results Display */}
            {hasResult && (
                <div className="space-y-6">
                    {/* Weight Results */}
                    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                        <h4 className="font-black text-slate-900 text-sm uppercase tracking-wider mb-6">Bobot Hasil BWM</h4>
                        <div className="space-y-4">
                            {bwmData.weights?.map((w: any) => {
                                const percentage = (w.weight_value * 100);
                                return (
                                    <div key={w.id} className="flex items-center gap-4">
                                        <span className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-xs font-bold border border-indigo-100 shrink-0">
                                            {w.criterion?.code}
                                        </span>
                                        <div className="flex-1">
                                            <div className="flex justify-between items-center mb-1">
                                                <span className="text-xs font-bold text-slate-700">{w.criterion?.name}</span>
                                                <span className="text-xs font-black text-indigo-600">{percentage.toFixed(1)}%</span>
                                            </div>
                                            <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full transition-all duration-700 ease-out"
                                                    style={{ width: `${percentage}%` }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {bwmData.runPayload?.consistency_ratio !== undefined && (
                            <div className="mt-6 p-4 bg-slate-50 rounded-xl border border-slate-100">
                                <div className="flex items-center gap-2">
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Consistency Ratio (CR):</span>
                                    <span className={`text-sm font-black ${bwmData.runPayload.consistency_ratio <= 0.1 ? 'text-emerald-600' : 'text-amber-600'}`}>
                                        {bwmData.runPayload.consistency_ratio.toFixed(4)}
                                    </span>
                                    {bwmData.runPayload.consistency_ratio <= 0.1 && (
                                        <span className="text-[10px] font-bold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded border border-emerald-100">KONSISTEN</span>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Navigate */}
                    <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-6 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-emerald-500 text-white rounded-xl flex items-center justify-center">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <div>
                                <p className="font-bold text-emerald-800 text-sm">Pembobotan BWM Selesai</p>
                                <p className="text-emerald-600 text-xs mt-0.5">Bobot telah dihitung dan siap digunakan untuk EDAS.</p>
                            </div>
                        </div>
                        <button onClick={() => onNavigateStep(3)} className="px-5 py-2.5 bg-emerald-600 text-white text-xs font-bold rounded-xl hover:bg-emerald-700 transition-all">
                            Lanjut ke EDAS →
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
