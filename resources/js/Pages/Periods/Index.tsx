import Breadcrumbs from '@/Components/Breadcrumbs';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { useState } from 'react';
import Modal from '@/Components/Modal';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';

export default function Index({ periods, active_period_id }: any) {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        description: '',
        start_date: '',
        end_date: '',
        is_active: false
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('periods.store'), {
            onSuccess: () => {
                setIsCreateModalOpen(false);
                reset();
            }
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <Breadcrumbs items={[{ label: 'Manajemen Periode' }]} />
                        <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">
                            Sesi Penilaian
                        </h2>
                        <p className="text-slate-500 mt-1 text-sm">
                            Kelola sesi atau periode penilaian SPK yang berbeda untuk berbagai kebutuhan seleksi.
                        </p>
                    </div>
                    <div>
                        <button 
                            onClick={() => setIsCreateModalOpen(true)}
                            className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white text-sm font-bold rounded-xl shadow-lg shadow-indigo-200 hover:bg-indigo-700 hover:-translate-y-0.5 transition-all active:scale-95"
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                            </svg>
                            Sesi Baru
                        </button>
                    </div>
                </div>
            }
        >
            <Head title="Manajemen Periode" />

            <div className="space-y-6 text-slate-900 pb-20">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {periods.map((period: any) => (
                        <div 
                            key={period.id} 
                            className={`bg-white rounded-[2rem] p-8 border ${active_period_id === period.id ? 'border-indigo-500 ring-2 ring-indigo-100 shadow-xl shadow-indigo-100' : 'border-slate-200 shadow-sm'} transition-all group`}
                        >
                            <div className="flex justify-between items-start mb-6">
                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${active_period_id === period.id ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-500 group-hover:bg-indigo-50 group-hover:text-indigo-600'} transition-all`}>
                                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                {active_period_id === period.id && (
                                    <span className="px-3 py-1 bg-indigo-50 text-indigo-700 text-[10px] font-black uppercase tracking-widest rounded-full border border-indigo-100">
                                        AKTIF SEKARANG
                                    </span>
                                )}
                            </div>
                            
                            <h3 className="text-xl font-black text-slate-900 mb-2 truncate">{period.name}</h3>
                            <p className="text-sm text-slate-500 line-clamp-2 h-10 mb-6 leading-relaxed">
                                {period.description || 'Tidak ada deskripsi untuk periode ini.'}
                            </p>
                            
                            <div className="space-y-3 mb-8">
                                <div className="flex items-center gap-3 text-xs font-bold text-slate-400">
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <span>Mulai: {period.start_date || '-'}</span>
                                </div>
                                <div className="flex items-center gap-3 text-xs font-bold text-slate-400">
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span>Status: {period.is_active ? 'Siap Digunakan' : 'Draft'}</span>
                                </div>
                            </div>
                            
                            <div className="flex gap-2">
                                <Link 
                                    href={route('dashboard')} 
                                    className={`flex-1 text-center py-3 rounded-xl text-xs font-black transition-all ${active_period_id === period.id ? 'bg-indigo-600 text-white hover:bg-indigo-700' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                                >
                                    {active_period_id === period.id ? 'KELOLA DATA' : 'PILIH PERIODE'}
                                </Link>
                            </div>
                        </div>
                    ))}
                    
                    {/* Empty State / Add Card */}
                    <button 
                        onClick={() => setIsCreateModalOpen(true)}
                        className="bg-slate-50 border-4 border-dashed border-slate-200 rounded-[2rem] p-8 flex flex-col items-center justify-center text-slate-400 hover:border-indigo-300 hover:text-indigo-400 transition-all group min-h-[320px]"
                    >
                        <div className="w-16 h-16 rounded-full bg-white border-4 border-slate-200 flex items-center justify-center mb-4 group-hover:border-indigo-100 transition-all">
                            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                            </svg>
                        </div>
                        <span className="font-black text-sm uppercase tracking-widest">Tambah Sesi Baru</span>
                    </button>
                </div>

                <Modal show={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} maxWidth="2xl">
                    <form onSubmit={submit} className="p-8">
                        <h3 className="text-2xl font-black text-slate-900 mb-2">Buat Periode Baru</h3>
                        <p className="text-slate-500 text-sm mb-8 font-medium">Buat wadah baru untuk variabel penilaian SPK yang berbeda.</p>
                        
                        <div className="space-y-6">
                            <div>
                                <InputLabel htmlFor="name" value="Nama Sesi / Periode" className="text-xs font-black text-slate-500 uppercase tracking-widest mb-2" />
                                <TextInput
                                    id="name"
                                    type="text"
                                    className="block w-full bg-slate-50 border-slate-200 rounded-2xl py-4"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    placeholder="Contoh: Seleksi Calon Karyawan 2024 - Tahap II"
                                    required
                                />
                                <InputError message={errors.name} className="mt-2" />
                            </div>

                            <div>
                                <InputLabel htmlFor="description" value="Deskripsi (Opsional)" className="text-xs font-black text-slate-500 uppercase tracking-widest mb-2" />
                                <textarea
                                    id="description"
                                    className="block w-full bg-slate-50 border-slate-200 rounded-2xl py-4 focus:ring-indigo-500 focus:border-indigo-500 transition-all min-h-[100px]"
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    placeholder="Jelaskan tujuan dari sesi penilaian ini..."
                                />
                                <InputError message={errors.description} className="mt-2" />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <InputLabel htmlFor="start_date" value="Tanggal Mulai" className="text-xs font-black text-slate-500 uppercase tracking-widest mb-2" />
                                    <TextInput id="start_date" type="date" className="block w-full bg-slate-50 border-slate-200 rounded-2xl" value={data.start_date} onChange={(e) => setData('start_date', e.target.value)} />
                                </div>
                                <div>
                                    <InputLabel htmlFor="end_date" value="Tanggal Selesai" className="text-xs font-black text-slate-500 uppercase tracking-widest mb-2" />
                                    <TextInput id="end_date" type="date" className="block w-full bg-slate-50 border-slate-200 rounded-2xl" value={data.end_date} onChange={(e) => setData('end_date', e.target.value)} />
                                </div>
                            </div>
                        </div>

                        <div className="mt-10 flex justify-end gap-3">
                            <SecondaryButton onClick={() => setIsCreateModalOpen(false)} className="rounded-xl px-6">Batal</SecondaryButton>
                            <PrimaryButton className="rounded-xl px-10 py-3 bg-indigo-600 hover:bg-indigo-700 font-black shadow-lg shadow-indigo-100" disabled={processing}>
                                Simpan Sesi
                            </PrimaryButton>
                        </div>
                    </form>
                </Modal>
            </div>
        </AuthenticatedLayout>
    );
}
