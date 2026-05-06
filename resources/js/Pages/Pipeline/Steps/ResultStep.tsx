import RankBadge from '@/Components/Pipeline/RankBadge';
import PipelineActionBar from '@/Components/Pipeline/PipelineActionBar';

interface Props {
    period: any;
    stepData: any;
    pipelineState: any;
    completedRuns: any;
    finalResults: any[];
    onNavigateStep: (step: number) => void;
}

export default function ResultStep({ period, completedRuns, finalResults, onNavigateStep }: Props) {
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
                <p className="text-sm text-slate-500">Selesaikan seluruh tahapan perhitungan untuk menampilkan peringkat akhir.</p>
            </div>
        );
    }

    return (
        <div className="space-y-5">
            <PipelineActionBar
                title="Hasil Akhir Penilaian"
                subtitle={`Langkah 5: Hasil integrasi BWM, EDAS, dan Copeland untuk periode ${period.name}`}
                onBack={() => onNavigateStep(4)}
                actions={
                    <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-100 flex items-center gap-1.5">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                        </svg>
                        PENILAIAN SELESAI
                    </span>
                }
            />

            <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
                <div>
                    <h3 className="text-lg font-semibold text-slate-900">Ringkasan Eksekusi</h3>
                    {copelandRun && (
                        <div className="mt-2 flex flex-wrap gap-3 text-xs text-slate-400">
                            <span className="bg-slate-50 px-2.5 py-1 rounded border border-slate-200">
                                Kode Run: {copelandRun.run_code}
                            </span>
                            <span className="bg-slate-50 px-2.5 py-1 rounded border border-slate-200">
                                Dieksekusi: {new Date(copelandRun.executed_at).toLocaleString('id-ID')}
                            </span>
                        </div>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {results.slice(0, 3).map((result: any, index: number) => {
                    const styles = [
                        'bg-indigo-600 text-white border-indigo-700',
                        'bg-white text-slate-900 border-slate-200',
                        'bg-white text-slate-900 border-slate-200',
                    ];

                    return (
                        <div key={result.id} className={`relative overflow-hidden rounded-xl p-6 border shadow-sm ${styles[index]}`}>
                            <div className="absolute top-0 right-0 font-semibold opacity-5 text-7xl -mr-3 -mt-3 select-none">
                                #{index + 1}
                            </div>
                            <div className="relative z-10">
                                <RankBadge rank={index + 1} size="lg" />
                                <div className={`text-[10px] font-medium uppercase tracking-wider mt-3 ${index === 0 ? 'text-indigo-200' : 'text-slate-400'}`}>
                                    Peringkat {index + 1}
                                </div>
                                <h4 className="text-lg font-semibold mt-1 truncate">{result.participant?.full_name}</h4>
                                <div className={`text-xs mt-2 ${index === 0 ? 'text-indigo-200' : 'text-slate-500'}`}>
                                    EDAS: <span className="font-mono">{result.edas_score != null ? Number(result.edas_score).toFixed(4) : '-'}</span>
                                    <span className="mx-1.5">|</span>
                                    Copeland: <span className="font-mono font-semibold">{result.copeland_score > 0 ? '+' : ''}{result.copeland_score}</span>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="bg-white overflow-hidden border border-slate-200 rounded-xl shadow-sm">
                <div className="px-5 py-3 border-b border-slate-100 flex items-center justify-between">
                    <h4 className="font-medium text-slate-900 text-sm">Tabel Peringkat Lengkap</h4>
                    <span className="text-xs text-slate-400">{results.length} peserta</span>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                                <th className="py-3 px-5 text-center text-xs font-medium text-slate-500 w-20">Peringkat</th>
                                <th className="py-3 px-5 text-xs font-medium text-slate-500">Peserta</th>
                                <th className="py-3 px-5 text-right text-xs font-medium text-slate-500">Skor EDAS</th>
                                <th className="py-3 px-5 text-center text-xs font-medium text-slate-500">M / K / I</th>
                                <th className="py-3 px-5 text-right text-xs font-medium text-slate-500">Skor Copeland</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {results.map((result: any) => (
                                <tr key={result.id} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="py-3.5 px-5 text-center">
                                        <RankBadge rank={result.final_rank} size="sm" />
                                    </td>
                                    <td className="py-3.5 px-5 font-medium text-slate-900 text-sm">{result.participant?.full_name}</td>
                                    <td className="py-3.5 px-5 text-right font-mono text-xs text-slate-500">
                                        {result.edas_score != null ? Number(result.edas_score).toFixed(6) : '-'}
                                    </td>
                                    <td className="py-3.5 px-5 text-center text-xs">
                                        <span className="text-emerald-600 font-medium">{result.copeland_wins ?? '-'}</span>
                                        <span className="text-slate-300 mx-1">/</span>
                                        <span className="text-rose-500 font-medium">{result.copeland_losses ?? '-'}</span>
                                        <span className="text-slate-300 mx-1">/</span>
                                        <span className="text-slate-500 font-medium">{result.extra_payload?.ties ?? '-'}</span>
                                    </td>
                                    <td className="py-3.5 px-5 text-right">
                                        <span className={`font-semibold ${
                                            result.copeland_score > 0 ? 'text-indigo-600' :
                                            result.copeland_score < 0 ? 'text-rose-500' : 'text-slate-400'
                                        }`}>
                                            {result.copeland_score > 0 ? '+' : ''}{result.copeland_score}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5 flex items-center justify-center">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-emerald-500 text-white rounded-lg flex items-center justify-center">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <div>
                        <p className="font-medium text-emerald-800 text-sm">Alur Penilaian Selesai</p>
                        <p className="text-emerald-600 text-xs mt-0.5">Seluruh tahap untuk "{period.name}" berhasil diselesaikan.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
