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
        post(route('pipeline.copeland.process', period.id));
    };

    const pairwiseMatrix = copelandPayload?.pairwise_matrix || [];
    const participantLabels = copelandPayload?.participant_labels || {};
    const participantIds = Object.keys(participantLabels).map(Number);

    const getCellColor = (val: number) => {
        if (val === 1) return 'bg-emerald-100 text-emerald-800 font-black';
        if (val === -1) return 'bg-rose-100 text-rose-800 font-black';
        return 'bg-slate-50 text-slate-400';
    };

    const getCellLabel = (val: number) => {
        if (val === 1) return 'W';
        if (val === -1) return 'L';
        return '—';
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl sm:rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-amber-200/50">
                <h3 className="text-xl sm:text-2xl font-black tracking-tight">Copeland Score</h3>
                <p className="text-amber-100 text-sm mt-2 max-w-xl">
                    Metode Copeland membandingkan semua pasangan peserta secara head-to-head berdasarkan skor EDAS.
                    Peringkat final ditentukan dari selisih jumlah menang dan kalah (Net Wins).
                </p>
            </div>

            {!hasResult && (
                <div className="bg-white rounded-2xl border border-slate-200 p-8 sm:p-12 shadow-sm text-center space-y-6">
                    <div className="w-20 h-20 mx-auto bg-amber-50 text-amber-500 rounded-3xl flex items-center justify-center">
                        <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                    </div>
                    <div>
                        <h4 className="text-lg font-black text-slate-900">Siap Menghitung Copeland</h4>
                        <p className="text-sm text-slate-500 mt-2 max-w-md mx-auto">
                            Proses ini akan membuat perbandingan berpasangan (pairwise) dari Appraisal Score EDAS dan menentukan peringkat final.
                        </p>
                    </div>
                    <ProcessButton
                        processing={processing}
                        onClick={handleProcess}
                        label="Jalankan Copeland Score"
                        loadingLabel="Menghitung..."
                        variant="success"
                    />
                </div>
            )}

            {hasResult && (
                <div className="space-y-6">
                    {/* Pairwise Comparison Matrix */}
                    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                            <h4 className="font-black text-slate-900 text-sm uppercase tracking-wider">Matriks Perbandingan Berpasangan</h4>
                            <div className="flex items-center gap-3 text-[10px] font-bold">
                                <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-emerald-100 border border-emerald-200" /> Win</span>
                                <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-rose-100 border border-rose-200" /> Loss</span>
                                <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-slate-50 border border-slate-200" /> Tie/Self</span>
                            </div>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-xs">
                                <thead>
                                    <tr className="bg-slate-50">
                                        <th className="py-3 px-3 text-left text-[10px] font-bold text-slate-500 uppercase tracking-wider sticky left-0 bg-slate-50 z-10 min-w-[120px]">
                                            vs
                                        </th>
                                        {pairwiseMatrix.map((row: any) => (
                                            <th key={row.participant_id} className="py-3 px-2 text-center text-[10px] font-bold text-slate-500 uppercase tracking-wider min-w-[60px]">
                                                {row.participant_name?.split(' ')[0]}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {pairwiseMatrix.map((row: any) => (
                                        <tr key={row.participant_id} className="hover:bg-slate-50/50 transition-colors">
                                            <td className="py-2 px-3 font-bold text-slate-700 whitespace-nowrap sticky left-0 bg-white z-10 border-r border-slate-100">
                                                {row.participant_name}
                                            </td>
                                            {participantIds.map((colId: number) => {
                                                const val = row.comparisons[colId] ?? 0;
                                                const isSelf = row.participant_id === colId;
                                                return (
                                                    <td key={colId} className={`py-2 px-2 text-center ${isSelf ? 'bg-slate-100' : ''}`}>
                                                        <span className={`inline-flex items-center justify-center w-8 h-8 rounded-lg text-xs ${isSelf ? 'text-slate-300' : getCellColor(val)}`}>
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
                    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                        <div className="px-6 py-4 border-b border-slate-100">
                            <h4 className="font-black text-slate-900 text-sm uppercase tracking-wider">Rangkuman Copeland Score</h4>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead className="bg-slate-50">
                                    <tr>
                                        <th className="py-3 px-4 text-center text-[10px] font-bold text-slate-500 uppercase tracking-wider w-20">Rank</th>
                                        <th className="py-3 px-4 text-left text-[10px] font-bold text-slate-500 uppercase tracking-wider">Peserta</th>
                                        <th className="py-3 px-4 text-center text-[10px] font-bold text-slate-500 uppercase tracking-wider">Win</th>
                                        <th className="py-3 px-4 text-center text-[10px] font-bold text-slate-500 uppercase tracking-wider">Loss</th>
                                        <th className="py-3 px-4 text-center text-[10px] font-bold text-slate-500 uppercase tracking-wider">Net Score</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {(copelandPayload.rankings || []).map((r: any) => (
                                        <tr key={r.participant_id} className="hover:bg-slate-50/50 transition-colors">
                                            <td className="py-4 px-4 text-center">
                                                <span className={`inline-flex items-center justify-center w-9 h-9 rounded-xl text-xs font-black ${
                                                    r.final_rank === 1 ? 'bg-amber-100 text-amber-700 ring-2 ring-amber-300' :
                                                    r.final_rank === 2 ? 'bg-slate-100 text-slate-600 ring-2 ring-slate-300' :
                                                    r.final_rank === 3 ? 'bg-orange-50 text-orange-600 ring-2 ring-orange-200' :
                                                    'bg-white text-slate-400 border border-slate-200'
                                                }`}>
                                                    {r.final_rank}
                                                </span>
                                            </td>
                                            <td className="py-4 px-4 font-bold text-slate-700">{r.participant_name}</td>
                                            <td className="py-4 px-4 text-center">
                                                <span className="font-bold text-emerald-600">{r.wins}</span>
                                            </td>
                                            <td className="py-4 px-4 text-center">
                                                <span className="font-bold text-rose-500">{r.losses}</span>
                                            </td>
                                            <td className="py-4 px-4 text-center">
                                                <span className={`text-lg font-black ${r.copeland_score > 0 ? 'text-indigo-600' : r.copeland_score < 0 ? 'text-rose-500' : 'text-slate-400'}`}>
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
                    <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-6 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-emerald-500 text-white rounded-xl flex items-center justify-center">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <div>
                                <p className="font-bold text-emerald-800 text-sm">Copeland Score Selesai</p>
                                <p className="text-emerald-600 text-xs mt-0.5">Peringkat akhir telah ditentukan.</p>
                            </div>
                        </div>
                        <button onClick={() => onNavigateStep(5)} className="px-5 py-2.5 bg-emerald-600 text-white text-xs font-bold rounded-xl hover:bg-emerald-700 transition-all">
                            Lihat Hasil Akhir →
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
