import Breadcrumbs from '@/Components/Breadcrumbs';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { useState, useRef } from 'react';
import Modal from '@/Components/Modal';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';

export default function Index({ participants, filters, active_period }: any) {
    const { data, links, meta } = participants;
    const [search, setSearch] = useState(filters.search || '');
    const [isImportModalOpen, setIsImportModalOpen] = useState(false);
    const fileInput = useRef<HTMLInputElement>(null);

    const { data: importData, setData: setImportData, post: postImport, processing: importing, reset: resetImport } = useForm({
        file: null as File | null,
    });

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(route('participants.index'), { search }, { preserveState: true });
    };

    const handleDelete = (id: number) => {
        if (confirm('Apakah Anda yakin ingin menghapus data peserta ini? Semua data terkait (skor) juga akan terhapus.')) {
            router.delete(route('participants.destroy', id));
        }
    };

    const handleImport = (e: React.FormEvent) => {
        e.preventDefault();
        postImport(route('participants.import'), {
            onSuccess: () => {
                setIsImportModalOpen(false);
                resetImport();
            },
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <Breadcrumbs items={[{ label: 'Peserta' }]} />
                        <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">
                            Daftar Peserta
                        </h2>
                        <p className="text-slate-500 mt-1 text-sm">
                            Kelola data kandidat atau peserta yang akan dinilai pada periode <span className="font-semibold text-indigo-600">{active_period?.name}</span>.
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <button 
                            onClick={() => setIsImportModalOpen(true)}
                            className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-slate-700 text-sm font-bold rounded-xl border border-slate-200 shadow-sm hover:bg-slate-50 transition-all active:scale-95"
                        >
                            <svg className="w-4 h-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                            </svg>
                            Import XLSX
                        </button>
                        <Link 
                            href={route('participants.create')} 
                            className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white text-sm font-bold rounded-xl shadow-lg shadow-indigo-200 hover:bg-indigo-700 hover:-translate-y-0.5 transition-all active:scale-95"
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                            </svg>
                            Tambah Peserta
                        </Link>
                    </div>
                </div>
            }
        >
            <Head title="Daftar Peserta" />

            <div className="space-y-6">
                {/* Filters & Search */}
                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-center gap-4">
                    <form onSubmit={handleSearch} className="relative w-full md:w-96">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Cari nama peserta..."
                            className="block w-full pl-10 pr-3 py-2 border border-slate-200 rounded-xl leading-5 bg-slate-50 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-all"
                        />
                    </form>
                    <div className="text-sm text-slate-500 font-medium">
                        Menampilkan <span className="text-slate-900">{data.length}</span> dari <span className="text-slate-900">{meta?.total || data.length}</span> data
                    </div>
                </div>

                {/* Table Card */}
                <div className="bg-white overflow-hidden shadow-sm border border-slate-200 rounded-2xl">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50/80 border-b border-slate-200">
                                <tr>
                                    <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Nama Lengkap</th>
                                    <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Pre-Test</th>
                                    <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Wawancara</th>
                                    <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Raport</th>
                                    <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Domisili</th>
                                    <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Kesiapan</th>
                                    <th className="py-4 px-6 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {data.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="py-12 text-center text-slate-400 space-y-3">
                                            <div className="flex justify-center text-slate-200">
                                                <svg className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                                                </svg>
                                            </div>
                                            <p className="text-lg font-medium">Belum ada data peserta</p>
                                            <p className="text-sm">Gunakan fitur "Import XLSX" untuk memuat data sekaligus.</p>
                                        </td>
                                    </tr>
                                ) : data.map((p: any) => (
                                    <tr key={p.id} className="hover:bg-slate-50/50 transition-colors group">
                                        <td className="py-4 px-6 whitespace-nowrap">
                                            <div className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{p.full_name}</div>
                                            <div className="text-[10px] text-slate-400 uppercase tracking-widest mt-0.5">ID: #{p.id.toString().padStart(4, '0')}</div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <span className="text-sm font-bold text-slate-700">{p.pre_test_score}</span>
                                        </td>
                                        <td className="py-4 px-6">
                                            <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded-md text-[10px] font-bold border border-indigo-100">
                                                {p.interview_grade}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6 text-sm font-bold text-slate-700">
                                            {p.report_score}
                                        </td>
                                        <td className="py-4 px-6 text-sm text-slate-500 font-medium whitespace-nowrap">
                                            {p.domicile_distance_km} km
                                        </td>
                                        <td className="py-4 px-6">
                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{p.work_readiness_grade}</span>
                                        </td>
                                        <td className="py-4 px-6 text-right space-x-1 whitespace-nowrap">
                                            <Link 
                                                href={route('participants.edit', p.id)} 
                                                className="inline-flex items-center p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                                                title="Edit Data"
                                            >
                                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                </svg>
                                            </Link>
                                            <button 
                                                onClick={() => handleDelete(p.id)} 
                                                className="inline-flex items-center p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                                                title="Hapus Data"
                                            >
                                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    
                    {/* Pagination */}
                    {links && links.length > 3 && (
                        <div className="bg-slate-50 border-t border-slate-200 px-6 py-4 flex items-center justify-center gap-2">
                            {links.map((link: any, i: number) => (
                                <Link 
                                    key={i} 
                                    href={link.url || '#'} 
                                    className={`
                                        min-w-[40px] h-10 flex items-center justify-center px-4 rounded-xl text-sm font-bold transition-all
                                        ${link.active ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'}
                                        ${!link.url && 'opacity-30 cursor-not-allowed pointer-events-none'}
                                    `}
                                    dangerouslySetInnerHTML={{ __html: link.label }} 
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* Import Modal */}
                <Modal show={isImportModalOpen} onClose={() => setIsImportModalOpen(false)} maxWidth="md">
                    <form onSubmit={handleImport} className="p-8">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center">
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2a4 4 0 00-4-4H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="text-xl font-black text-slate-900 leading-tight">Import Data Peserta</h3>
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Format: Excel (.xlsx)</p>
                            </div>
                        </div>

                        <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl p-8 mb-6 text-center">
                            <input 
                                type="file" 
                                className="hidden" 
                                ref={fileInput} 
                                accept=".xlsx,.xls"
                                onChange={(e) => setImportData('file', e.target.files ? e.target.files[0] : null)}
                            />
                            {importData.file ? (
                                <div className="space-y-4">
                                    <div className="inline-flex py-1 px-3 bg-emerald-50 text-emerald-700 text-[10px] font-black rounded-lg border border-emerald-100">FILE TERPILIH</div>
                                    <p className="text-sm font-bold text-slate-700 truncate">{importData.file.name}</p>
                                    <button type="button" onClick={() => setImportData('file', null)} className="text-xs font-bold text-rose-500 hover:underline">Hapus & Ganti</button>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <p className="text-sm text-slate-500 font-medium">Klik tombol di bawah untuk memilih file Excel template yang sudah diisi.</p>
                                    <button 
                                        type="button"
                                        onClick={() => fileInput.current?.click()}
                                        className="inline-flex px-6 py-2.5 bg-white border border-slate-200 text-slate-700 text-xs font-black rounded-xl hover:bg-slate-50 transition-all"
                                    >
                                        PILIH FILE EXCEL
                                    </button>
                                </div>
                            )}
                        </div>

                        <div className="space-y-4">
                            <a 
                                href={route('participants.template')} 
                                className="flex items-center justify-between p-4 bg-indigo-50 border border-indigo-100 rounded-2xl group transition-all"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-white text-indigo-600 rounded-lg flex items-center justify-center shadow-sm">
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                        </svg>
                                    </div>
                                    <div>
                                        <div className="text-[10px] font-black text-indigo-400 uppercase tracking-widest leading-none mb-1">Butuh Template?</div>
                                        <div className="text-xs font-bold text-indigo-900">Download Template (.xlsx)</div>
                                    </div>
                                </div>
                                <svg className="w-4 h-4 text-indigo-300 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                                </svg>
                            </a>

                            <div className="flex gap-3">
                                <SecondaryButton onClick={() => setIsImportModalOpen(false)} className="flex-1 justify-center rounded-xl py-3 border-transparent bg-slate-100 text-slate-600">Batal</SecondaryButton>
                                <PrimaryButton className="flex-1 justify-center rounded-xl py-3 bg-indigo-600 hover:bg-indigo-700 font-black" disabled={importing || !importData.file}>
                                    {importing ? 'MEMPROSES...' : 'MULAI IMPORT'}
                                </PrimaryButton>
                            </div>
                        </div>
                    </form>
                </Modal>
            </div>
        </AuthenticatedLayout>
    );
}
