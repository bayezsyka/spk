import Breadcrumbs from '@/Components/Breadcrumbs';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage, Link } from '@inertiajs/react';

export default function Index({ results, latestRun, active_period }: any) {
    const { flash } = usePage<any>().props;

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <Breadcrumbs items={[{ label: 'Hasil Perankingan' }]} />
                        <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">
                            Peringkat Akhir
                        </h2>
                        <p className="text-slate-500 mt-1 text-sm">
                            Urutan prioritas peserta berdasarkan integrasi metode EDAS-Copeland periode <span className="font-semibold text-indigo-600">{active_period?.name}</span>.
                        </p>
                    </div>
                </div>
            }
        >
            <Head title="Ranking Akhir" />

            <div className="space-y-6 text-slate-900 pb-12">
                {flash?.success && (
                    <div className="bg-emerald-50 border border-emerald-100 text-emerald-700 px-6 py-4 rounded-2xl flex items-center gap-3 shadow-sm animate-in fade-in slide-in-from-top-4 duration-300">
                        <svg className="w-5 h-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="font-bold text-sm tracking-tight">{flash.success}</span>
                    </div>
                )}
                
                {latestRun ? (
                    <>
                        {/* Summary Header */}
                        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-center gap-4">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center">
                                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                    </svg>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">Kode Sesi Kalkulasi</span>
                                    <span className="text-lg font-black text-indigo-600">{latestRun.run_code}</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 text-sm font-medium text-slate-500">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Waktu Eksekusi: <span className="text-slate-900 font-bold">{new Date(latestRun.executed_at).toLocaleString()}</span>
                            </div>
                        </div>

                        {/* Top 3 Spotlight (Optional but cool) */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {results.slice(0, 3).map((r: any, idx: number) => (
                                <div key={r.id} className={`relative overflow-hidden rounded-3xl p-8 border ${idx === 0 ? 'bg-indigo-600 text-white border-indigo-700 shadow-xl shadow-indigo-200' : 'bg-white text-slate-900 border-slate-200 shadow-sm'}`}>
                                    <div className={`absolute top-0 right-0 p-4 font-black ${idx === 0 ? 'text-indigo-500 opacity-30 text-8xl -mr-4 -mt-4' : 'text-slate-50 text-6xl -mr-2 -mt-2'}`}>
                                        #{idx + 1}
                                    </div>
                                    <div className={`text-xs font-bold uppercase tracking-widest mb-4 ${idx === 0 ? 'text-indigo-200' : 'text-slate-400'}`}>
                                        Peringkat Ke-{idx + 1}
                                    </div>
                                    <h4 className="text-xl font-black mb-1 truncate relative z-10">{r.participant?.full_name}</h4>
                                    <div className={`text-sm font-medium ${idx === 0 ? 'text-indigo-100' : 'text-slate-500'}`}>Skor Akhir: <span className="font-bold">{Number(r.copeland_score).toFixed(4)}</span></div>
                                </div>
                            ))}
                        </div>

                        {/* Full Table */}
                        <div className="bg-white overflow-hidden shadow-xl shadow-slate-200/50 border border-slate-200 rounded-3xl">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="bg-slate-50 border-b border-slate-200">
                                        <tr>
                                            <th className="py-4 px-8 text-xs font-bold text-slate-500 uppercase tracking-wider text-center w-24">Rank</th>
                                            <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Peserta</th>
                                            <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">EDAS Score</th>
                                            <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Copeland Score</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {results.map((r: any) => (
                                            <tr key={r.id} className="hover:bg-slate-50/50 transition-colors group">
                                                <td className="py-5 px-8 text-center">
                                                    <span className={`
                                                        inline-flex items-center justify-center w-10 h-10 rounded-xl font-black text-sm
                                                        ${r.final_rank === 1 ? 'bg-amber-100 text-amber-700 ring-2 ring-amber-400' : 
                                                          r.final_rank === 2 ? 'bg-slate-100 text-slate-600 ring-2 ring-slate-300' : 
                                                          r.final_rank === 3 ? 'bg-orange-50 text-orange-700 ring-2 ring-orange-200' : 
                                                          'bg-white text-slate-400 border border-slate-200'}
                                                    `}>
                                                        {r.final_rank}
                                                    </span>
                                                </td>
                                                <td className="py-5 px-6">
                                                    <div className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                                                        {r.participant?.full_name}
                                                    </div>
                                                    <div className="text-[10px] text-slate-400 uppercase tracking-widest mt-0.5">
                                                        Peserta Penilaian
                                                    </div>
                                                </td>
                                                <td className="py-5 px-6 text-right font-mono text-xs font-bold text-slate-500 tracking-tight">
                                                    {r.edas_score != null ? Number(r.edas_score).toFixed(6) : '-'}
                                                </td>
                                                <td className="py-5 px-6 text-right font-mono text-sm font-black text-indigo-600 tracking-tight">
                                                    {r.copeland_score != null ? Number(r.copeland_score).toFixed(6) : '-'}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="bg-white rounded-[40px] p-20 text-center border-4 border-dashed border-slate-100 text-slate-400">
                        <div className="flex justify-center mb-6">
                            <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center text-slate-200">
                                <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                </svg>
                            </div>
                        </div>
                        <h3 className="text-2xl font-black text-slate-900 mb-2">Belum Ada Hasil Kalkulasi</h3>
                        <p className="max-w-md mx-auto mb-8 text-neutral-500 leading-relaxed font-medium">
                            Silakan lakukan proses perhitungan EDAS dan Copeland untuk menampilkan peringkat peserta pada periode penilaian ini.
                        </p>
                        <Link 
                            href={route('calculations.edas')} 
                            className="inline-flex items-center gap-2 px-8 py-4 bg-indigo-600 text-white font-black rounded-2xl shadow-xl shadow-indigo-100 hover:bg-indigo-700 hover:-translate-y-1 transition-all"
                        >
                            Proses Kalkulasi Sekarang
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                            </svg>
                        </Link>
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
