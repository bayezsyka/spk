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
        post(route('pipeline.edas.process', period.route_key));
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
        <div className="space-y-5">
            {/* Header */}
            <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
                <h3 className="text-lg font-semibold text-slate-900">Kalkulasi EDAS</h3>
                <p className="text-slate-500 text-sm mt-1 max-w-xl">
                    Evaluation based on Distance from Average Solution (EDAS) menghitung skor evaluasi setiap peserta
                    berdasarkan jarak positif (PDA) dan negatif (NDA) dari solusi rata-rata.
                </p>
            </div>

            {!hasResult && (
                <div className="bg-white rounded-xl border border-slate-200 p-10 shadow-sm text-center space-y-5">
                    <div className="w-16 h-16 mx-auto bg-slate-100 text-slate-400 rounded-xl flex items-center justify-center">
                        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                    </div>
                    <div>
                        <h4 className="text-base font-medium text-slate-900">Siap Menghitung EDAS</h4>
                        <p className="text-sm text-slate-500 mt-1.5 max-w-md mx-auto">
                            Proses akan membangun matriks keputusan, menghitung solusi rata-rata, dan menghasilkan matriks PDA/NDA.
                        </p>
                    </div>
                    <div className="flex items-center justify-center gap-4 pt-2">
                        <button
                            onClick={() => onNavigateStep(2)}
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
                            label="Jalankan EDAS"
                            loadingLabel="Menghitung..."
                        />
                    </div>
                </div>
            )}

            {hasResult && (
                <div className="space-y-5">
                    {/* Average Solution */}
                    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
                        <h4 className="font-medium text-slate-900 text-sm mb-3">Solusi Rata-rata (AV)</h4>
                        <div className="flex flex-wrap gap-2">
                            {Object.entries(edasPayload.average_solution || {}).map(([code, val]: any) => (
                                <div key={code} className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-center min-w-[80px]">
                                    <p className="text-[10px] font-medium text-slate-400 uppercase">{code}</p>
                                    <p className="text-sm font-semibold text-slate-800 mt-0.5">{Number(val).toFixed(2)}</p>
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
                    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
                        <div className="px-5 py-3 border-b border-slate-100">
                            <h4 className="font-medium text-slate-900 text-sm">Appraisal Score (AS)</h4>
                        </div>
                        <div className="divide-y divide-slate-50">
                            {(edasPayload.appraisal_scores || []).map((entry: any, i: number) => (
                                <div key={entry.participant_id} className="flex items-center gap-3 px-5 py-3 hover:bg-slate-50/50 transition-colors">
                                    <span className={`w-7 h-7 rounded-md flex items-center justify-center text-xs font-medium ${
                                        i === 0 ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                                        i === 1 ? 'bg-slate-100 text-slate-600 border border-slate-200' :
                                        i === 2 ? 'bg-orange-50 text-orange-600 border border-orange-200' :
                                        'bg-white text-slate-400 border border-slate-200'
                                    }`}>
                                        {i + 1}
                                    </span>
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-slate-700">{entry.participant_name}</p>
                                    </div>
                                    <p className="text-sm font-mono font-medium text-indigo-600">{Number(entry.score).toFixed(6)}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Navigate */}
                    <div className="flex items-center justify-between">
                        <button
                            onClick={() => onNavigateStep(2)}
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
                                EDAS selesai
                            </span>
                            <button
                                onClick={() => onNavigateStep(4)}
                                className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
                            >
                                Lanjut ke Copeland
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
