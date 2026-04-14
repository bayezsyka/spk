import Breadcrumbs from '@/Components/Breadcrumbs';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function Dashboard({ totalParticipants, totalActiveCriteria, active_period }: any) {
    return (
        <AuthenticatedLayout
            header={
                <div>
                    <Breadcrumbs items={[]} />
                    <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">
                        Dashboard Utama
                    </h2>
                    <p className="text-slate-500 mt-1 text-sm">
                        Ringkasan data dan kontrol cepat untuk sistem pendukung keputusan.
                    </p>
                </div>
            }
        >
            <Head title="Dashboard" />

            <div className="space-y-8">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xl shadow-slate-200/50 group hover:border-indigo-500 transition-all">
                        <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                        </div>
                        <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest">Total Peserta</h3>
                        <div className="mt-2 flex items-baseline gap-2">
                            <span className="text-4xl font-extrabold text-slate-900">{totalParticipants}</span>
                            <span className="text-xs text-slate-400 font-medium">Kandidat</span>
                        </div>
                        <Link href={route('participants.index')} className="mt-6 flex items-center gap-2 text-sm font-bold text-indigo-600 hover:gap-3 transition-all">
                            Kelola Peserta
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                            </svg>
                        </Link>
                    </div>

                    <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xl shadow-slate-200/50 group hover:border-emerald-500 transition-all">
                        <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-emerald-600 group-hover:text-white transition-all">
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                            </svg>
                        </div>
                        <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest">Kriteria Aktif</h3>
                        <div className="mt-2 flex items-baseline gap-2">
                            <span className="text-4xl font-extrabold text-slate-900">{totalActiveCriteria}</span>
                            <span className="text-xs text-slate-400 font-medium">Parameter</span>
                        </div>
                        <Link href={route('criteria.index')} className="mt-6 flex items-center gap-2 text-sm font-bold text-emerald-600 hover:gap-3 transition-all">
                            Konfigurasi Kriteria
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                            </svg>
                        </Link>
                    </div>

                    <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xl shadow-slate-200/50 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500"></div>
                        <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest relative z-10">Periode Aktif</h3>
                        <div className="mt-3 relative z-10">
                            <div className="text-xl font-bold text-slate-900 leading-tight">{active_period?.name || 'Tidak ada sesi aktif'}</div>
                            <div className="mt-2 text-[10px] font-bold py-1 px-2.5 bg-indigo-50 text-indigo-700 rounded-lg inline-block border border-indigo-100">
                                SEDANG BERJALAN
                            </div>
                        </div>
                        <div className="mt-6 relative z-10 space-y-3">
                            <Link href={route('rankings.index')} className="block w-full text-center px-4 py-3 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-colors">
                                Hasil Perankingan
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Quick Actions / Getting Started */}
                <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="p-8 border-b border-slate-100 flex items-center justify-between">
                        <h3 className="text-xl font-bold text-slate-900">Alur Perhitungan SPK</h3>
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Metode: BWM + EDAS + COPELAND</span>
                    </div>
                    <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="space-y-4">
                            <div className="text-4xl font-black text-slate-100">01</div>
                            <h4 className="font-bold text-slate-900 uppercase text-xs tracking-wider">Tahap Pembobotan</h4>
                            <p className="text-sm text-slate-500 leading-relaxed uppercase">Menentukan bobot prioritas setiap kriteria menggunakan metode Best-Worst Method (BWM).</p>
                        </div>
                        <div className="space-y-4 border-l border-slate-100 pl-8">
                            <div className="text-4xl font-black text-slate-100">02</div>
                            <h4 className="font-bold text-slate-900 uppercase text-xs tracking-wider">Kalkulasi EDAS</h4>
                            <p className="text-sm text-slate-500 leading-relaxed uppercase">Menghitung skor evaluasi setiap alternatif berdasarkan jarak rata-rata solusi (EDAS).</p>
                            <Link href={route('calculations.edas')} className="inline-flex py-1.5 px-3 bg-indigo-50 text-indigo-700 rounded-lg text-[10px] font-bold hover:bg-indigo-100 transition-colors">MULAI PROSES EDAS</Link>
                        </div>
                        <div className="space-y-4 border-l border-slate-100 pl-8">
                            <div className="text-4xl font-black text-slate-100">03</div>
                            <h4 className="font-bold text-slate-900 uppercase text-xs tracking-wider">Copeland Scoring</h4>
                            <p className="text-sm text-slate-500 leading-relaxed uppercase">Agregasi hasil akhir dan penentuan peringkat final menggunakan sistem perbandingan Copeland.</p>
                            <Link href={route('calculations.copeland')} className="inline-flex py-1.5 px-3 bg-emerald-50 text-emerald-700 rounded-lg text-[10px] font-bold hover:bg-emerald-100 transition-colors">MULAI PROSES COPELAND</Link>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
