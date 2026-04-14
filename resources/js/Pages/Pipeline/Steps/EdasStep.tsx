import { useForm } from '@inertiajs/react';
import ProcessButton from '@/Components/Pipeline/ProcessButton';
import HeatmapMatrix from '@/Components/Pipeline/HeatmapMatrix';

interface Props {
    period: any;
    stepData: any;
    pipelineState: any;
    completedRuns: any;
    onNavigateStep: (step: number) => void;
}

export default function EdasStep({ period, stepData, pipelineState, completedRuns, onNavigateStep }: Props) {
    const edasPayload = stepData.edas?.runPayload;
    const hasResult = !!edasPayload;

    const { post, processing } = useForm();

    const handleProcess = () => {
        post(route('pipeline.edas.process', period.id));
    };

    // Build heatmap data from EDAS payload
    const criteriaHeaders = edasPayload?.criteria_codes || [];

    const pdaRows = (edasPayload?.pda_matrix || []).map((row: any) => ({
        label: row.participant_name,
        values: criteriaHeaders.map((code: string) => row[code] || 0),
    }));

    const ndaRows = (edasPayload?.nda_matrix || []).map((row: any) => ({
        label: row.participant_name,
        values: criteriaHeaders.map((code: string) => row[code] || 0),
    }));

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl sm:rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-blue-200/50">
                <h3 className="text-xl sm:text-2xl font-black tracking-tight">Kalkulasi EDAS</h3>
                <p className="text-blue-100 text-sm mt-2 max-w-xl">
                    Evaluation based on Distance from Average Solution (EDAS) menghitung skor evaluasi setiap peserta
                    berdasarkan jarak positif (PDA) dan negatif (NDA) dari solusi rata-rata.
                </p>
            </div>

            {!hasResult && (
                <div className="bg-white rounded-2xl border border-slate-200 p-8 sm:p-12 shadow-sm text-center space-y-6">
                    <div className="w-20 h-20 mx-auto bg-blue-50 text-blue-500 rounded-3xl flex items-center justify-center">
                        <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                    </div>
                    <div>
                        <h4 className="text-lg font-black text-slate-900">Siap Menghitung EDAS</h4>
                        <p className="text-sm text-slate-500 mt-2 max-w-md mx-auto">
                            Proses ini akan membangun matriks keputusan, menghitung solusi rata-rata, dan menghasilkan matriks PDA/NDA untuk setiap peserta.
                        </p>
                    </div>
                    <ProcessButton
                        processing={processing}
                        onClick={handleProcess}
                        label="Jalankan Kalkulasi EDAS"
                        loadingLabel="Menghitung matriks..."
                    />
                </div>
            )}

            {hasResult && (
                <div className="space-y-6">
                    {/* Average Solution */}
                    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                        <h4 className="font-black text-slate-900 text-sm uppercase tracking-wider mb-4">Solusi Rata-rata (AV)</h4>
                        <div className="flex flex-wrap gap-3">
                            {Object.entries(edasPayload.average_solution || {}).map(([code, val]: any) => (
                                <div key={code} className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 text-center min-w-[90px]">
                                    <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest">{code}</p>
                                    <p className="text-lg font-black text-blue-700 mt-1">{Number(val).toFixed(2)}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* PDA Matrix Heatmap */}
                    <HeatmapMatrix
                        title="Matriks PDA (Positive Distance from Average)"
                        headers={criteriaHeaders}
                        rows={pdaRows}
                        colorScale="green-red"
                    />

                    {/* NDA Matrix Heatmap */}
                    <HeatmapMatrix
                        title="Matriks NDA (Negative Distance from Average)"
                        headers={criteriaHeaders}
                        rows={ndaRows}
                        colorScale="blue-orange"
                    />

                    {/* Appraisal Scores */}
                    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                        <div className="px-6 py-4 border-b border-slate-100">
                            <h4 className="font-black text-slate-900 text-sm uppercase tracking-wider">Appraisal Score (AS)</h4>
                        </div>
                        <div className="divide-y divide-slate-50">
                            {(edasPayload.appraisal_scores || []).map((entry: any, i: number) => (
                                <div key={entry.participant_id} className="flex items-center gap-4 px-6 py-4 hover:bg-slate-50/50 transition-colors">
                                    <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black ${
                                        i === 0 ? 'bg-amber-100 text-amber-700' :
                                        i === 1 ? 'bg-slate-100 text-slate-600' :
                                        i === 2 ? 'bg-orange-50 text-orange-600' :
                                        'bg-white text-slate-400 border border-slate-200'
                                    }`}>
                                        {i + 1}
                                    </span>
                                    <div className="flex-1">
                                        <p className="text-sm font-bold text-slate-700">{entry.participant_name}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-mono font-black text-indigo-600">{Number(entry.score).toFixed(6)}</p>
                                    </div>
                                    {/* Visual bar */}
                                    <div className="w-24 h-2 bg-slate-100 rounded-full overflow-hidden hidden sm:block">
                                        <div
                                            className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full"
                                            style={{ width: `${(entry.score / Math.max(...(edasPayload.appraisal_scores || []).map((e: any) => e.score), 0.01)) * 100}%` }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
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
                                <p className="font-bold text-emerald-800 text-sm">Kalkulasi EDAS Selesai</p>
                                <p className="text-emerald-600 text-xs mt-0.5">Matriks PDA/NDA dan Appraisal Score tersedia.</p>
                            </div>
                        </div>
                        <button onClick={() => onNavigateStep(4)} className="px-5 py-2.5 bg-emerald-600 text-white text-xs font-bold rounded-xl hover:bg-emerald-700 transition-all">
                            Lanjut ke Copeland →
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
