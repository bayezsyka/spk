import { router, Link } from '@inertiajs/react';
import EmptyState from '@/Components/UI/EmptyState';
import PipelineActionBar from '@/Components/Pipeline/PipelineActionBar';

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
        router.post(route('pipeline.scoring.autoPopulate', period.route_key));
    };

    const handleComplete = () => {
        router.post(route('pipeline.scoring.complete', period.route_key));
    };

    // Check if all participants have scores
    const allScored = participants.length >= 3 && participants.every((p: any) =>
        p.scores?.length >= criteria.length && p.scores.every((s: any) => s.raw_value !== null)
    );

    return (
        <div className="space-y-5">
            <PipelineActionBar
                title="Input Peserta & Nilai"
                subtitle="Langkah 2: Kelola data peserta dan pastikan semua skor terisi"
                onBack={() => onNavigateStep(0)}
                actions={
                    <div className="flex items-center gap-2">
                         <button
                            onClick={handleAutoPopulate}
                            className="hidden sm:inline-flex items-center gap-2 px-4 py-2 bg-violet-50 text-violet-700 text-xs font-bold rounded-lg hover:bg-violet-100 transition-all border border-violet-100"
                        >
                            Sinkron Skor
                        </button>
                        {allScored && !isCompleted && (
                            <button
                                onClick={handleComplete}
                                className="inline-flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white text-sm font-bold rounded-lg hover:bg-indigo-700 transition-all shadow-md shadow-indigo-100"
                            >
                                <span>Lanjut ke BWM</span>
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                </svg>
                            </button>
                        )}
                        {isCompleted && (
                            <button
                                onClick={() => onNavigateStep(2)}
                                className="inline-flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white text-sm font-bold rounded-lg hover:bg-indigo-700 transition-all shadow-md shadow-indigo-100"
                            >
                                <span>Lanjut</span>
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                </svg>
                            </button>
                        )}
                    </div>
                }
            />

            {/* Header */}
            <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h3 className="text-lg font-semibold text-slate-900">
                            Manajemen Peserta
                        </h3>
                        <p className="text-slate-500 text-sm mt-1">
                            Kelola data peserta dan nilai kriteria untuk periode ini.
                        </p>
                    </div>
                    <div className="flex gap-2 flex-wrap">
                        <Link
                            href={route('participants.index')}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-white text-slate-700 text-sm font-medium rounded-lg border border-slate-300 hover:bg-slate-50 transition-colors"
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            Kelola Semua Peserta
                        </Link>
                    </div>
                </div>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-3 gap-4">
                <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
                    <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">Total Peserta</p>
                    <p className="text-2xl font-semibold text-slate-900 mt-1">{participants.length}</p>
                    <p className="text-[10px] text-slate-400 mt-1">Min. 3 diperlukan</p>
                </div>
                <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
                    <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">Kriteria</p>
                    <p className="text-2xl font-semibold text-slate-900 mt-1">{criteria.length}</p>
                    <p className="text-[10px] text-slate-400 mt-1">Parameter penilaian</p>
                </div>
                <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
                    <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">Status</p>
                    <p className={`text-2xl font-semibold mt-1 ${allScored ? 'text-emerald-600' : 'text-amber-600'}`}>
                        {allScored ? 'Lengkap' : 'Belum'}
                    </p>
                    <p className="text-[10px] text-slate-400 mt-1">{allScored ? 'Semua skor terisi' : 'Masih ada kosong'}</p>
                </div>
            </div>

            {/* Scoring Matrix Table */}
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
                <div className="px-5 py-3 border-b border-slate-100 flex items-center justify-between">
                    <h4 className="font-medium text-slate-900 text-sm">Matriks Keputusan</h4>
                    <span className="text-xs text-slate-400">
                        {participants.length} x {criteria.length}
                    </span>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                                <th className="py-3 px-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider sticky left-0 bg-slate-50 z-10">
                                    Peserta
                                </th>
                                {criteria.map((c: any) => (
                                    <th key={c.id} className="py-3 px-4 text-center text-xs font-medium text-slate-500 uppercase tracking-wider min-w-[80px]">
                                        <div>{c.code}</div>
                                        <div className="font-normal normal-case text-[9px] text-slate-400 mt-0.5">{c.name}</div>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {participants.length === 0 ? (
                                <tr>
                                    <td colSpan={criteria.length + 1}>
                                        <EmptyState
                                            title="Belum ada peserta"
                                            description="Tambahkan peserta melalui halaman Kelola Peserta atau import Excel."
                                        />
                                    </td>
                                </tr>
                            ) : participants.map((p: any) => (
                                <tr key={p.id} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="py-3 px-4 font-medium text-slate-700 whitespace-nowrap text-xs sticky left-0 bg-white z-10 border-r border-slate-100">
                                        {p.full_name}
                                    </td>
                                    {criteria.map((c: any) => {
                                        const score = p.scores?.find((s: any) => s.criterion_id === c.id);
                                        const hasValue = score?.raw_value !== null && score?.raw_value !== undefined;
                                        return (
                                            <td key={c.id} className="py-3 px-4 text-center">
                                                {hasValue ? (
                                                    <span className="font-mono text-xs text-slate-700 bg-slate-50 px-2 py-0.5 rounded">
                                                        {Number(score.raw_value).toFixed(1)}
                                                    </span>
                                                ) : (
                                                    <span className="text-[10px] text-rose-400 bg-rose-50 px-2 py-0.5 rounded">
                                                        --
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

            <div className="flex items-center justify-center p-4">
                 <div className="text-xs text-slate-400 italic">Gunakan bar navigasi di bagian atas untuk melanjutkan ke tahap berikutnya.</div>
            </div>
        </div>
    );
}
