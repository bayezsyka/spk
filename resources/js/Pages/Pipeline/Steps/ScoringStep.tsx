import { router, Link } from '@inertiajs/react';

interface Props {
    period: any;
    stepData: any;
    pipelineState: any;
    onNavigateStep: (step: number) => void;
}

export default function ScoringStep({ period, stepData, pipelineState, onNavigateStep }: Props) {
    const participants = stepData.scoring?.participants || [];
    const criteria = stepData.scoring?.criteriaForScoring || [];
    const isCompleted = pipelineState.currentStep > 2;

    const handleAutoPopulate = () => {
        router.post(route('pipeline.scoring.autoPopulate', period.id));
    };

    const handleComplete = () => {
        router.post(route('pipeline.scoring.complete', period.id));
    };

    // Check if all participants have scores
    const allScored = participants.length >= 3 && participants.every((p: any) =>
        p.scores?.length >= criteria.length && p.scores.every((s: any) => s.raw_value !== null)
    );

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                            Input Peserta & Nilai
                        </h3>
                        <p className="text-slate-500 text-sm mt-1">
                            Kelola data peserta dan pastikan semua nilai skor terisi lengkap sebelum melanjutkan ke pembobotan.
                        </p>
                    </div>
                    <div className="flex gap-3 flex-wrap">
                        <button
                            onClick={handleAutoPopulate}
                            className="inline-flex items-center gap-2 px-5 py-2.5 bg-violet-600 text-white text-sm font-bold rounded-xl shadow-lg shadow-violet-200 hover:bg-violet-700 transition-all active:scale-95"
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            Auto Sinkron Skor
                        </button>
                        <Link
                            href={route('participants.index')}
                            className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-slate-700 text-sm font-bold rounded-xl border border-slate-200 hover:bg-slate-50 transition-all active:scale-95"
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            Kelola Peserta
                        </Link>
                    </div>
                </div>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Peserta</p>
                    <p className="text-3xl font-black text-slate-900 mt-1">{participants.length}</p>
                    <p className="text-[10px] font-medium text-slate-400 mt-1">Min. 3 diperlukan</p>
                </div>
                <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Kriteria</p>
                    <p className="text-3xl font-black text-slate-900 mt-1">{criteria.length}</p>
                    <p className="text-[10px] font-medium text-slate-400 mt-1">Parameter penilaian</p>
                </div>
                <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm col-span-2 sm:col-span-1">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Status Skor</p>
                    <p className={`text-3xl font-black mt-1 ${allScored ? 'text-emerald-600' : 'text-amber-600'}`}>
                        {allScored ? '✓' : '…'}
                    </p>
                    <p className="text-[10px] font-medium text-slate-400 mt-1">{allScored ? 'Semua Lengkap' : 'Belum Lengkap'}</p>
                </div>
            </div>

            {/* Scoring Matrix Table */}
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                    <h4 className="font-black text-slate-900 text-sm uppercase tracking-wider">Matriks Keputusan</h4>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        {participants.length} × {criteria.length}
                    </span>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                                <th className="py-3 px-4 text-left text-[10px] font-bold text-slate-500 uppercase tracking-wider sticky left-0 bg-slate-50 z-10">
                                    Peserta
                                </th>
                                {criteria.map((c: any) => (
                                    <th key={c.id} className="py-3 px-4 text-center text-[10px] font-bold text-slate-500 uppercase tracking-wider min-w-[90px]">
                                        <div>{c.code}</div>
                                        <div className="font-medium normal-case text-[9px] text-slate-400 mt-0.5">{c.name}</div>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {participants.length === 0 ? (
                                <tr>
                                    <td colSpan={criteria.length + 1} className="py-16 text-center text-slate-400">
                                        <p className="font-bold">Belum ada peserta</p>
                                        <p className="text-xs mt-1">Tambahkan peserta melalui halaman "Kelola Peserta" atau import Excel.</p>
                                    </td>
                                </tr>
                            ) : participants.map((p: any) => (
                                <tr key={p.id} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="py-3 px-4 font-bold text-slate-700 whitespace-nowrap text-xs sticky left-0 bg-white z-10 border-r border-slate-100">
                                        <div>{p.full_name}</div>
                                        <div className="text-[9px] text-slate-400 font-medium mt-0.5">ID: #{String(p.id).padStart(4, '0')}</div>
                                    </td>
                                    {criteria.map((c: any) => {
                                        const score = p.scores?.find((s: any) => s.criterion_id === c.id);
                                        const hasValue = score?.raw_value !== null && score?.raw_value !== undefined;
                                        return (
                                            <td key={c.id} className="py-3 px-4 text-center">
                                                {hasValue ? (
                                                    <span className="font-mono text-xs font-bold text-slate-700 bg-slate-50 px-2 py-1 rounded-lg">
                                                        {Number(score.raw_value).toFixed(1)}
                                                    </span>
                                                ) : (
                                                    <span className="text-[10px] font-bold text-rose-400 bg-rose-50 px-2 py-1 rounded-lg">
                                                        KOSONG
                                                    </span>
                                                )}
                                            </td>
                                        );
                                    })}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Complete / Navigate */}
            {allScored && !isCompleted && (
                <div className="flex justify-end">
                    <button
                        onClick={handleComplete}
                        className="inline-flex items-center gap-3 px-8 py-4 bg-indigo-600 text-white font-black rounded-2xl shadow-xl shadow-indigo-200 hover:bg-indigo-700 hover:-translate-y-0.5 transition-all active:scale-[0.98] uppercase text-sm tracking-wider"
                    >
                        Lanjut ke Pembobotan BWM
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
                            <p className="font-bold text-emerald-800 text-sm">Input Nilai Selesai</p>
                            <p className="text-emerald-600 text-xs mt-0.5">{participants.length} peserta × {criteria.length} kriteria terverifikasi.</p>
                        </div>
                    </div>
                    <button onClick={() => onNavigateStep(2)} className="px-5 py-2.5 bg-emerald-600 text-white text-xs font-bold rounded-xl hover:bg-emerald-700 transition-all">
                        Lanjut →
                    </button>
                </div>
            )}
        </div>
    );
}
