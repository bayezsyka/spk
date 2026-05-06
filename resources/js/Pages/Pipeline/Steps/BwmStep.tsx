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
        router.post(route('pipeline.bwm.process', period.route_key), {
            best_criterion_id: bestId,
            worst_criterion_id: worstId,
            best_to_others: bestToOthers,
            others_to_worst: othersToWorst,
        }, {
            onFinish: () => setProcessing(false),
        });
    };

    return (
        <div className="space-y-5">
            {/* Header */}
            <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
                <h3 className="text-lg font-semibold text-slate-900">Pembobotan BWM</h3>
                <p className="text-slate-500 text-sm mt-1 max-w-xl">
                    Best-Worst Method (BWM) menentukan bobot prioritas setiap kriteria.
                    Pilih kriteria terbaik & terburuk, lalu berikan nilai preferensi (1-9) untuk setiap perbandingan.
                </p>
            </div>

            {/* BWM Input Form */}
            {!hasResult && (
                <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-6">
                    {/* Best & Worst Selection */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div>
                            <label className="block text-xs font-medium text-slate-600 mb-1.5">
                                Kriteria Terbaik (Best)
                            </label>
                            <select
                                value={bestId}
                                onChange={e => setBestId(Number(e.target.value))}
                                className="w-full rounded-lg border-slate-300 bg-white py-2.5 text-sm focus:ring-indigo-500 focus:border-indigo-500"
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
                            <label className="block text-xs font-medium text-slate-600 mb-1.5">
                                Kriteria Terburuk (Worst)
                            </label>
                            <select
                                value={worstId}
                                onChange={e => setWorstId(Number(e.target.value))}
                                className="w-full rounded-lg border-slate-300 bg-white py-2.5 text-sm focus:ring-indigo-500 focus:border-indigo-500"
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
                            <h4 className="text-sm font-medium text-slate-900 mb-3">
                                Preferensi: Best → Others <span className="text-xs text-slate-400">(1 = sama penting, 9 = sangat lebih penting)</span>
                            </h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                {criteria.filter((c: any) => c.id !== bestId).map((c: any) => (
                                    <div key={c.id} className="flex items-center gap-3 bg-slate-50 rounded-lg p-3 border border-slate-100">
                                        <span className="w-9 h-9 rounded-md bg-white border border-slate-200 flex items-center justify-center text-xs font-medium text-slate-600 shrink-0">
                                            {c.code}
                                        </span>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs font-medium text-slate-700 truncate">{c.name}</p>
                                            <input
                                                type="range"
                                                min={1}
                                                max={9}
                                                value={bestToOthers[c.id] || 1}
                                                onChange={e => setBestToOthers(prev => ({ ...prev, [c.id]: Number(e.target.value) }))}
                                                className="w-full h-1 bg-indigo-100 rounded-full appearance-none cursor-pointer accent-indigo-600 mt-1.5"
                                            />
                                        </div>
                                        <span className="text-sm font-semibold text-indigo-600 w-6 text-center">
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
                            <h4 className="text-sm font-medium text-slate-900 mb-3">
                                Preferensi: Others → Worst <span className="text-xs text-slate-400">(1 = sama penting, 9 = sangat lebih penting)</span>
                            </h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                {criteria.filter((c: any) => c.id !== worstId).map((c: any) => (
                                    <div key={c.id} className="flex items-center gap-3 bg-slate-50 rounded-lg p-3 border border-slate-100">
                                        <span className="w-9 h-9 rounded-md bg-white border border-slate-200 flex items-center justify-center text-xs font-medium text-slate-600 shrink-0">
                                            {c.code}
                                        </span>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs font-medium text-slate-700 truncate">{c.name}</p>
                                            <input
                                                type="range"
                                                min={1}
                                                max={9}
                                                value={othersToWorst[c.id] || 1}
                                                onChange={e => setOthersToWorst(prev => ({ ...prev, [c.id]: Number(e.target.value) }))}
                                                className="w-full h-1 bg-violet-100 rounded-full appearance-none cursor-pointer accent-violet-600 mt-1.5"
                                            />
                                        </div>
                                        <span className="text-sm font-semibold text-violet-600 w-6 text-center">
                                            {othersToWorst[c.id] || 1}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Process Button */}
                    {bestId && worstId && (
                        <div className="flex items-center justify-between pt-2">
                            <button
                                onClick={() => onNavigateStep(1)}
                                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
                            >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 17l-5-5m0 0l5-5m-5 5h12" />
                                </svg>
                                Kembali
                            </button>
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
                <div className="space-y-5">
                    {/* Weight Results */}
                    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                        <h4 className="font-medium text-slate-900 text-sm mb-5">Bobot Hasil BWM</h4>
                        <div className="space-y-3">
                            {bwmData.weights?.map((w: any) => {
                                const percentage = (w.weight_value * 100);
                                return (
                                    <div key={w.id} className="flex items-center gap-3">
                                        <span className="w-9 h-9 rounded-md bg-indigo-50 text-indigo-600 flex items-center justify-center text-xs font-medium border border-indigo-100 shrink-0">
                                            {w.criterion?.code}
                                        </span>
                                        <div className="flex-1">
                                            <div className="flex justify-between items-center mb-1">
                                                <span className="text-xs font-medium text-slate-700">{w.criterion?.name}</span>
                                                <span className="text-xs font-semibold text-indigo-600">{percentage.toFixed(1)}%</span>
                                            </div>
                                            <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-indigo-500 rounded-full transition-all duration-500"
                                                    style={{ width: `${percentage}%` }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {bwmData.runPayload?.consistency_ratio !== undefined && (
                            <div className="mt-5 p-3 bg-slate-50 rounded-lg border border-slate-100 flex items-center gap-3">
                                <span className="text-xs text-slate-500">Consistency Ratio:</span>
                                <span className={`text-sm font-semibold ${bwmData.runPayload.consistency_ratio <= 0.1 ? 'text-emerald-600' : 'text-amber-600'}`}>
                                    {bwmData.runPayload.consistency_ratio.toFixed(4)}
                                </span>
                                {bwmData.runPayload.consistency_ratio <= 0.1 && (
                                    <span className="text-[10px] font-medium bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded border border-emerald-200">Konsisten</span>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Navigate */}
                    <div className="flex items-center justify-between">
                        <button
                            onClick={() => onNavigateStep(1)}
                            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 17l-5-5m0 0l5-5m-5 5h12" />
                            </svg>
                            Kembali
                        </button>
                        <div className="flex items-center gap-3">
                            <span className="text-sm text-emerald-600 font-medium flex items-center gap-1.5">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                BWM selesai
                            </span>
                            <button
                                onClick={() => onNavigateStep(3)}
                                className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
                            >
                                Lanjut ke EDAS
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
