import { useForm } from '@inertiajs/react';
import ProcessButton from '@/Components/Pipeline/ProcessButton';

interface Props {
    period: any;
    stepData: any;
    pipelineState: any;
    completedRuns: any;
    onNavigateStep: (step: number) => void;
}

export default function CopelandStep({ period, stepData, pipelineState, completedRuns, onNavigateStep }: Props) {
    const copelandPayload = stepData.copeland?.runPayload;
    const hasResult = !!copelandPayload;

    const { post, processing } = useForm();

    const handleProcess = () => {
        post(route('pipeline.copeland.process', period.route_key));
    };

    const pairwiseMatrix = copelandPayload?.pairwise_matrix || [];
    const participantLabels = copelandPayload?.participant_labels || {};
    const participantIds = Object.keys(participantLabels).map(Number);

    const getCellColor = (val: number) => {
        if (val === 1) return 'bg-emerald-50 text-emerald-700 font-medium';
        if (val === -1) return 'bg-rose-50 text-rose-700 font-medium';
        return 'bg-slate-50 text-slate-400';
    };

    const getCellLabel = (val: number) => {
        if (val === 1) return 'W';
        if (val === -1) return 'L';
        return '—';
    };

    return (
        <div className="space-y-5">
            {/* Header */}
            <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
                <h3 className="text-lg font-semibold text-slate-900">Copeland Score</h3>
                <p className="text-slate-500 text-sm mt-1 max-w-xl">
                    Metode Copeland membandingkan semua pasangan peserta secara head-to-head berdasarkan skor EDAS.
                    Peringkat final ditentukan dari selisih jumlah menang dan kalah (Net Wins).
                </p>
            </div>

            {!hasResult && (
                <div className="bg-white rounded-xl border border-slate-200 p-10 shadow-sm text-center space-y-5">
                    <div className="w-16 h-16 mx-auto bg-slate-100 text-slate-400 rounded-xl flex items-center justify-center">
                        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                    </div>
                    <div>
                        <h4 className="text-base font-medium text-slate-900">Siap Menghitung Copeland</h4>
                        <p className="text-sm text-slate-500 mt-1.5 max-w-md mx-auto">
                            Perbandingan berpasangan dari Appraisal Score EDAS akan dijalankan.
                        </p>
                    </div>
                    <div className="flex items-center justify-center gap-4 pt-2">
                        <button
                            onClick={() => onNavigateStep(3)}
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
                            label="Jalankan Copeland"
                            loadingLabel="Menghitung..."
                            variant="success"
                        />
                    </div>
                </div>
            )}

            {hasResult && (
                <div className="space-y-5">
                    {/* Pairwise Matrix */}
                    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
                        <div className="px-5 py-3 border-b border-slate-100 flex items-center justify-between">
                            <h4 className="font-medium text-slate-900 text-sm">Matriks Perbandingan Berpasangan</h4>
                            <div className="flex items-center gap-3 text-xs text-slate-500">
                                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-emerald-100 border border-emerald-200" /> Win</span>
                                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-rose-100 border border-rose-200" /> Loss</span>
                                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-slate-50 border border-slate-200" /> Tie</span>
                            </div>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-xs">
                                <thead>
                                    <tr className="bg-slate-50">
                                        <th className="py-2.5 px-3 text-left text-xs font-medium text-slate-500 sticky left-0 bg-slate-50 z-10 min-w-[120px]">
                                            vs
                                        </th>
                                        {pairwiseMatrix.map((row: any) => (
                                            <th key={row.participant_id} className="py-2.5 px-2 text-center text-xs font-medium text-slate-500 min-w-[55px]">
                                                {row.participant_name?.split(' ')[0]}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {pairwiseMatrix.map((row: any) => (
                                        <tr key={row.participant_id} className="hover:bg-slate-50/50 transition-colors">
                                            <td className="py-2 px-3 font-medium text-slate-700 whitespace-nowrap sticky left-0 bg-white z-10 border-r border-slate-100">
                                                {row.participant_name}
                                            </td>
                                            {participantIds.map((colId: number) => {
                                                const val = row.comparisons[colId] ?? 0;
                                                const isSelf = row.participant_id === colId;
                                                return (
                                                    <td key={colId} className={`py-2 px-2 text-center ${isSelf ? 'bg-slate-100' : ''}`}>
                                                        <span className={`inline-flex items-center justify-center w-7 h-7 rounded text-xs ${isSelf ? 'text-slate-300' : getCellColor(val)}`}>
                                                            {isSelf ? '—' : getCellLabel(val)}
                                                        </span>
                                                    </td>
                                                );
                                            })}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Copeland Score Summary */}
                    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
                        <div className="px-5 py-3 border-b border-slate-100">
                            <h4 className="font-medium text-slate-900 text-sm">Rangkuman Copeland Score</h4>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead className="bg-slate-50">
                                    <tr>
                                        <th className="py-2.5 px-4 text-center text-xs font-medium text-slate-500 w-16">Rank</th>
                                        <th className="py-2.5 px-4 text-left text-xs font-medium text-slate-500">Peserta</th>
                                        <th className="py-2.5 px-4 text-center text-xs font-medium text-slate-500">Win</th>
                                        <th className="py-2.5 px-4 text-center text-xs font-medium text-slate-500">Loss</th>
                                        <th className="py-2.5 px-4 text-right text-xs font-medium text-slate-500">Net</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {(copelandPayload.rankings || []).map((r: any) => (
                                        <tr key={r.participant_id} className="hover:bg-slate-50/50 transition-colors">
                                            <td className="py-3 px-4 text-center">
                                                <span className={`inline-flex items-center justify-center w-7 h-7 rounded-md text-xs font-medium ${
                                                    r.final_rank === 1 ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                                                    r.final_rank === 2 ? 'bg-slate-100 text-slate-600 border border-slate-200' :
                                                    r.final_rank === 3 ? 'bg-orange-50 text-orange-600 border border-orange-200' :
                                                    'bg-white text-slate-400 border border-slate-200'
                                                }`}>
                                                    {r.final_rank}
                                                </span>
                                            </td>
                                            <td className="py-3 px-4 font-medium text-slate-700">{r.participant_name}</td>
                                            <td className="py-3 px-4 text-center font-medium text-emerald-600">{r.wins}</td>
                                            <td className="py-3 px-4 text-center font-medium text-rose-500">{r.losses}</td>
                                            <td className="py-3 px-4 text-right">
                                                <span className={`font-semibold ${r.copeland_score > 0 ? 'text-indigo-600' : r.copeland_score < 0 ? 'text-rose-500' : 'text-slate-400'}`}>
                                                    {r.copeland_score > 0 ? '+' : ''}{r.copeland_score}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Navigate */}
                    <div className="flex items-center justify-between">
                        <button
                            onClick={() => onNavigateStep(3)}
                            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 17l-5-5m0 0l5-5m-5 5h12" />
                            </svg>
                            Kembali
                        </button>
                        <button
                            onClick={() => onNavigateStep(5)}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
                        >
                            Lihat Hasil Akhir
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                            </svg>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
