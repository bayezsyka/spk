import RankBadge from '@/Components/Pipeline/RankBadge';

interface Props {
    period: any;
    stepData: any;
    pipelineState: any;
    completedRuns: any;
    finalResults: any[];
    onNavigateStep: (step: number) => void;
}

export default function ResultStep({ period, stepData, pipelineState, completedRuns, finalResults, onNavigateStep }: Props) {
    const results = finalResults || [];
    const copelandRun = completedRuns?.copeland;

    if (!results.length) {
        return (
            <div className="bg-white rounded-xl p-12 text-center border border-slate-200 shadow-sm">
                <div className="w-16 h-16 mx-auto bg-slate-100 text-slate-300 rounded-xl flex items-center justify-center mb-4">
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-1">Belum Ada Hasil</h3>
                <p className="text-sm text-slate-500">Selesaikan semua tahap perhitungan untuk menampilkan peringkat akhir.</p>
            </div>
        );
    }

    return (
        <div className="space-y-5">
            {/* Header */}
            <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
                <div>
                    <h3 className="text-lg font-semibold text-slate-900">Hasil Peringkat Akhir</h3>
                    <p className="text-slate-500 text-sm mt-1">
                        Integrasi BWM + EDAS + Copeland untuk periode <span className="font-medium text-indigo-600">{period.name}</span>
                    </p>
                    {copelandRun && (
                        <div className="mt-3 flex flex-wrap gap-3 text-xs text-slate-400">
                            <span className="bg-slate-50 px-2.5 py-1 rounded border border-slate-200">
                                Kode: {copelandRun.run_code}
                            </span>
                            <span className="bg-slate-50 px-2.5 py-1 rounded border border-slate-200">
                                {new Date(copelandRun.executed_at).toLocaleString('id-ID')}
                            </span>
                        </div>
                    )}
                </div>
            </div>

            {/* Top 3 Spotlight */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {results.slice(0, 3).map((r: any, idx: number) => {
                    const bgStyles = [
                        'bg-indigo-600 text-white border-indigo-700',
                        'bg-white text-slate-900 border-slate-200',
                        'bg-white text-slate-900 border-slate-200',
                    ];
                    return (
                        <div key={r.id} className={`relative overflow-hidden rounded-xl p-6 border shadow-sm ${bgStyles[idx]}`}>
                            <div className="absolute top-0 right-0 font-semibold opacity-5 text-7xl -mr-3 -mt-3 select-none">
                                #{idx + 1}
                            </div>
                            <div className="relative z-10">
                                <RankBadge rank={idx + 1} size="lg" />
                                <div className={`text-[10px] font-medium uppercase tracking-wider mt-3 ${idx === 0 ? 'text-indigo-200' : 'text-slate-400'}`}>
                                    Peringkat Ke-{idx + 1}
                                </div>
                                <h4 className="text-lg font-semibold mt-1 truncate">{r.participant?.full_name}</h4>
                                <div className={`text-xs mt-2 ${idx === 0 ? 'text-indigo-200' : 'text-slate-500'}`}>
                                    EDAS: <span className="font-mono">{r.edas_score != null ? Number(r.edas_score).toFixed(4) : '-'}</span>
                                    <span className="mx-1.5">·</span>
                                    Copeland: <span className="font-mono font-semibold">{r.copeland_score > 0 ? '+' : ''}{r.copeland_score}</span>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Full Ranking Table */}
            <div className="bg-white overflow-hidden border border-slate-200 rounded-xl shadow-sm">
                <div className="px-5 py-3 border-b border-slate-100 flex items-center justify-between">
                    <h4 className="font-medium text-slate-900 text-sm">Tabel Peringkat Lengkap</h4>
                    <span className="text-xs text-slate-400">{results.length} Peserta</span>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                                <th className="py-3 px-5 text-center text-xs font-medium text-slate-500 w-20">Rank</th>
                                <th className="py-3 px-5 text-xs font-medium text-slate-500">Peserta</th>
                                <th className="py-3 px-5 text-right text-xs font-medium text-slate-500">EDAS Score</th>
                                <th className="py-3 px-5 text-center text-xs font-medium text-slate-500">W/L</th>
                                <th className="py-3 px-5 text-right text-xs font-medium text-slate-500">Copeland</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {results.map((r: any) => (
                                <tr key={r.id} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="py-3.5 px-5 text-center">
                                        <RankBadge rank={r.final_rank} size="sm" />
                                    </td>
                                    <td className="py-3.5 px-5 font-medium text-slate-900 text-sm">{r.participant?.full_name}</td>
                                    <td className="py-3.5 px-5 text-right font-mono text-xs text-slate-500">
                                        {r.edas_score != null ? Number(r.edas_score).toFixed(6) : '-'}
                                    </td>
                                    <td className="py-3.5 px-5 text-center text-xs">
                                        <span className="text-emerald-600 font-medium">{r.copeland_wins ?? '-'}</span>
                                        <span className="text-slate-300 mx-1">/</span>
                                        <span className="text-rose-500 font-medium">{r.copeland_losses ?? '-'}</span>
                                    </td>
                                    <td className="py-3.5 px-5 text-right">
                                        <span className={`font-semibold ${
                                            r.copeland_score > 0 ? 'text-indigo-600' :
                                            r.copeland_score < 0 ? 'text-rose-500' : 'text-slate-400'
                                        }`}>
                                            {r.copeland_score > 0 ? '+' : ''}{r.copeland_score}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Completion Banner */}
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-emerald-500 text-white rounded-lg flex items-center justify-center">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <div>
                        <p className="font-medium text-emerald-800 text-sm">Pipeline Analisis Selesai</p>
                        <p className="text-emerald-600 text-xs mt-0.5">Seluruh tahap untuk "{period.name}" berhasil diselesaikan.</p>
                    </div>
                </div>
                <button
                    onClick={() => onNavigateStep(4)}
                    className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
                >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 17l-5-5m0 0l5-5m-5 5h12" />
                    </svg>
                    Kembali
                </button>
            </div>
        </div>
    );
}
