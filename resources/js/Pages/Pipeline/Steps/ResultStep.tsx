import RankBadge from '@/Components/Pipeline/RankBadge';

interface Props {
    period: any;
    stepData: any;
    pipelineState: any;
    completedRuns: any;
    finalResults: any[];
    onNavigateStep: (step: number) => void;
}

export default function ResultStep({ period, stepData, pipelineState, completedRuns, finalResults }: Props) {
    const results = finalResults || [];
    const copelandRun = completedRuns?.copeland;

    if (!results.length) {
        return (
            <div className="bg-white rounded-3xl p-16 text-center border-4 border-dashed border-slate-100">
                <div className="w-24 h-24 mx-auto bg-slate-50 rounded-full flex items-center justify-center text-slate-200 mb-6">
                    <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                </div>
                <h3 className="text-2xl font-black text-slate-900 mb-2">Belum Ada Hasil</h3>
                <p className="text-sm text-slate-500">Selesaikan semua tahap perhitungan untuk menampilkan peringkat akhir.</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 rounded-2xl sm:rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-emerald-200/50 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -mr-20 -mt-20" />
                <div className="absolute bottom-0 left-1/2 w-32 h-32 bg-white/5 rounded-full -mb-16" />
                <div className="relative z-10">
                    <h3 className="text-xl sm:text-2xl font-black tracking-tight">🎯 Hasil Peringkat Akhir</h3>
                    <p className="text-emerald-100 text-sm mt-2">
                        Integrasi hasil metode BWM + EDAS + Copeland untuk periode <span className="font-bold text-white">{period.name}</span>
                    </p>
                    {copelandRun && (
                        <div className="mt-4 flex flex-wrap gap-4 text-xs">
                            <span className="bg-white/10 px-3 py-1.5 rounded-lg font-bold">
                                Kode: {copelandRun.run_code}
                            </span>
                            <span className="bg-white/10 px-3 py-1.5 rounded-lg font-bold">
                                Waktu: {new Date(copelandRun.executed_at).toLocaleString('id-ID')}
                            </span>
                        </div>
                    )}
                </div>
            </div>

            {/* Top 3 Spotlight */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
                {results.slice(0, 3).map((r: any, idx: number) => {
                    const bgStyles = [
                        'bg-gradient-to-br from-indigo-600 to-violet-600 text-white border-indigo-700 shadow-xl shadow-indigo-200/50',
                        'bg-white text-slate-900 border-slate-200 shadow-lg shadow-slate-200/30',
                        'bg-white text-slate-900 border-slate-200 shadow-lg shadow-slate-200/30',
                    ];
                    const textStyles = [
                        'text-indigo-200',
                        'text-slate-400',
                        'text-slate-400',
                    ];
                    return (
                        <div key={r.id} className={`relative overflow-hidden rounded-2xl sm:rounded-3xl p-6 sm:p-8 border ${bgStyles[idx]}`}>
                            <div className={`absolute top-0 right-0 p-4 font-black opacity-10 text-7xl sm:text-8xl -mr-4 -mt-4 select-none`}>
                                #{idx + 1}
                            </div>
                            <div className="relative z-10">
                                <RankBadge rank={idx + 1} size="lg" />
                                <div className={`text-[10px] font-bold uppercase tracking-widest mt-4 ${textStyles[idx]}`}>
                                    Peringkat Ke-{idx + 1}
                                </div>
                                <h4 className="text-lg sm:text-xl font-black mt-1 truncate">{r.participant?.full_name}</h4>
                                <div className={`text-xs font-bold mt-2 ${idx === 0 ? 'text-indigo-200' : 'text-slate-500'}`}>
                                    EDAS: <span className="font-mono">{r.edas_score != null ? Number(r.edas_score).toFixed(4) : '-'}</span>
                                    <span className="mx-2">•</span>
                                    Copeland: <span className="font-mono font-black">{r.copeland_score > 0 ? '+' : ''}{r.copeland_score}</span>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Full Ranking Table */}
            <div className="bg-white overflow-hidden shadow-xl shadow-slate-200/50 border border-slate-200 rounded-2xl sm:rounded-3xl">
                <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
                    <h4 className="font-black text-slate-900 text-sm uppercase tracking-wider">Tabel Peringkat Lengkap</h4>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        {results.length} Peserta
                    </span>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                                <th className="py-4 px-6 text-center text-xs font-bold text-slate-500 uppercase tracking-wider w-24">Rank</th>
                                <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Peserta</th>
                                <th className="py-4 px-6 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">EDAS Score</th>
                                <th className="py-4 px-6 text-center text-xs font-bold text-slate-500 uppercase tracking-wider">W/L</th>
                                <th className="py-4 px-6 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">Copeland</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {results.map((r: any) => (
                                <tr key={r.id} className="hover:bg-slate-50/50 transition-colors group">
                                    <td className="py-5 px-6 text-center">
                                        <RankBadge rank={r.final_rank} size="sm" />
                                    </td>
                                    <td className="py-5 px-6">
                                        <div className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                                            {r.participant?.full_name}
                                        </div>
                                    </td>
                                    <td className="py-5 px-6 text-right font-mono text-xs font-bold text-slate-500">
                                        {r.edas_score != null ? Number(r.edas_score).toFixed(6) : '-'}
                                    </td>
                                    <td className="py-5 px-6 text-center">
                                        <span className="text-emerald-600 font-bold">{r.copeland_wins ?? '-'}</span>
                                        <span className="text-slate-300 mx-1">/</span>
                                        <span className="text-rose-500 font-bold">{r.copeland_losses ?? '-'}</span>
                                    </td>
                                    <td className="py-5 px-6 text-right">
                                        <span className={`text-lg font-black ${
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
            <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-2xl p-6 sm:p-8 text-center">
                <div className="text-4xl mb-3">🎉</div>
                <h4 className="text-lg font-black text-emerald-900">Pipeline Analisis Selesai</h4>
                <p className="text-sm text-emerald-700 mt-2 max-w-md mx-auto">
                    Seluruh tahap pemrosesan SPK untuk periode "{period.name}" telah berhasil diselesaikan.
                </p>
            </div>
        </div>
    );
}
