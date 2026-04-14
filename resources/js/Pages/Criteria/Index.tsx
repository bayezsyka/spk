import Breadcrumbs from '@/Components/Breadcrumbs';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function Index({ criteria, active_period }: any) {
    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <Breadcrumbs items={[{ label: 'Kriteria Penilaian' }]} />
                        <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">
                            Kriteria Penilaian
                        </h2>
                        <p className="text-slate-500 mt-1 text-sm">
                            Parameter dan bobot yang digunakan untuk mengevaluasi alternatif pada periode <span className="font-semibold text-indigo-600">{active_period?.name}</span>.
                        </p>
                    </div>
                </div>
            }
        >
            <Head title="Kriteria Penilaian" />

            <div className="space-y-6 text-slate-900">
                {/* Info Card */}
                <div className="bg-indigo-600 rounded-3xl p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl shadow-indigo-200">
                    <div className="space-y-2">
                        <h3 className="text-xl font-bold">Definisi Kriteria</h3>
                        <p className="text-indigo-100 text-sm max-w-xl">
                            Setiap kriteria memiliki sifat (Benefit/Cost) dan tipe data yang menentukan bagaimana algoritma SPK memproses nilai tersebut dalam perhitungan EDAS & Copeland.
                        </p>
                    </div>
                    <div className="shrink-0">
                        <Link href={route('criteria.weights')} className="px-6 py-3 bg-white text-indigo-600 font-bold rounded-xl hover:bg-indigo-50 transition-colors shadow-sm">
                            Lihat Pembobotan BWM
                        </Link>
                    </div>
                </div>

                {/* Table Card */}
                <div className="bg-white overflow-hidden shadow-sm border border-slate-200 rounded-2xl">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50 border-b border-slate-200">
                                <tr>
                                    <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Kode</th>
                                    <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Parameter Kriteria</th>
                                    <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Sifat Kriteria</th>
                                    <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Format Input</th>
                                    <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {criteria.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="py-12 text-center text-slate-400">
                                            Belum ada data kriteria untuk periode ini.
                                        </td>
                                    </tr>
                                ) : criteria.map((c: any) => (
                                    <tr key={c.id} className="hover:bg-slate-50/50 transition-colors group">
                                        <td className="py-4 px-6">
                                            <span className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center font-bold text-slate-600 text-sm border border-slate-200 group-hover:bg-indigo-600 group-hover:text-white group-hover:border-indigo-600 transition-all">
                                                {c.code}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="font-bold text-slate-900">{c.name}</div>
                                            <div className="text-[10px] text-slate-400 mt-0.5">{c.description || 'Tidak ada deskripsi'}</div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                                c.attribute_type === 'benefit' 
                                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' 
                                                : 'bg-amber-50 text-amber-700 border border-amber-100'
                                            }`}>
                                                <span className={`w-1.5 h-1.5 rounded-full ${c.attribute_type === 'benefit' ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
                                                {c.attribute_type}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6 uppercase text-[10px] font-bold text-slate-500 tracking-widest">
                                            {c.input_type}
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="flex items-center gap-2">
                                                <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                                                <span className="text-xs font-medium text-slate-600">Aktif</span>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
