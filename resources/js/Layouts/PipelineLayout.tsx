import { Link, usePage, router } from '@inertiajs/react';
import Dropdown from '@/Components/Dropdown';
import ApplicationLogo from '@/Components/ApplicationLogo';
import Modal from '@/Components/Modal';
import DangerButton from '@/Components/DangerButton';
import SecondaryButton from '@/Components/SecondaryButton';
import { PropsWithChildren, useState } from 'react';

interface PipelineLayoutProps {
    period: any;
    pipelineState: any;
}

export default function PipelineLayout({
    period,
    pipelineState,
    children,
}: PropsWithChildren<PipelineLayoutProps>) {
    const { auth } = usePage().props as any;
    const user = auth.user;
    const [confirmingReset, setConfirmingReset] = useState(false);

    const stepProgress = Math.round(((pipelineState.currentStep - 1) / 5) * 100);

    const handleReset = () => {
        router.post(route('periods.reset', period.route_key), {}, {
            onFinish: () => setConfirmingReset(false),
        });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30">
            {/* Compact Top Bar */}
            <nav className="border-b border-slate-200/80 bg-white/80 backdrop-blur-xl sticky top-0 z-50">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-14 justify-between items-center">
                        <div className="flex items-center gap-4 sm:gap-6">
                            <Link href={route('dashboard')} className="flex items-center gap-2 group">
                                <div className="p-1.5 bg-indigo-600 rounded-lg group-hover:bg-indigo-700 transition-colors">
                                    <ApplicationLogo className="block h-4 w-auto fill-current text-white" />
                                </div>
                                <span className="font-bold text-sm text-slate-900 hidden sm:block tracking-tight">SPK LPKS</span>
                            </Link>

                            <div className="h-6 w-px bg-slate-200 hidden sm:block" />

                            {/* Breadcrumb */}
                            <div className="hidden sm:flex items-center gap-2 text-xs font-medium text-slate-400">
                                <Link href={route('dashboard')} className="hover:text-slate-600 transition-colors">
                                    Dashboard
                                </Link>
                                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                                <Link href={route('periods.index')} className="hover:text-slate-600 transition-colors">
                                    Periode
                                </Link>
                                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                                <span className="text-indigo-600 font-bold truncate max-w-[200px]">
                                    {period.name}
                                </span>
                            </div>
                        </div>

                        {/* Right: Pipeline Status + User */}
                        <div className="flex items-center gap-3 sm:gap-4">
                            {/* Pipeline Progress Pill */}
                            <div className="flex items-center gap-2 px-3 py-1.5 bg-indigo-50 rounded-full border border-indigo-100">
                                <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
                                <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest hidden sm:inline">
                                    Tahap {pipelineState.currentStep}/6
                                </span>
                                <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest sm:hidden">
                                    {pipelineState.currentStep}/6
                                </span>
                            </div>

                            {/* Reset Button */}
                            <button
                                onClick={() => setConfirmingReset(true)}
                                className="flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-100 rounded-full transition-all"
                                title="Reset alur untuk periode ini"
                            >
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                                <span className="hidden lg:inline uppercase tracking-widest">RESET ALUR</span>
                            </button>

                            {/* Mini progress bar */}
                            <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden hidden sm:block">
                                <div
                                    className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full transition-all duration-700 ease-out"
                                    style={{ width: `${stepProgress}%` }}
                                />
                            </div>

                            {/* User Dropdown */}
                            <div className="relative">
                                <Dropdown>
                                    <Dropdown.Trigger>
                                        <button className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center border border-slate-200 hover:border-indigo-300 transition-colors focus:outline-none">
                                            <span className="text-xs font-bold text-slate-600">{user.name.charAt(0)}</span>
                                        </button>
                                    </Dropdown.Trigger>
                                    <Dropdown.Content>
                                        <div className="px-4 py-2 border-b border-slate-100">
                                            <p className="text-sm font-bold text-slate-900">{user.name}</p>
                                            <p className="text-[10px] text-slate-400">{user.email}</p>
                                        </div>
                                        <Dropdown.Link href={route('profile.edit')}>Profil</Dropdown.Link>
                                        <Dropdown.Link href={route('logout')} method="post" as="button">
                                            Keluar
                                        </Dropdown.Link>
                                    </Dropdown.Content>
                                </Dropdown>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main className="py-6 sm:py-8">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    {children}
                </div>
            </main>
            {/* Reset Confirmation Modal */}
            <Modal show={confirmingReset} onClose={() => setConfirmingReset(false)}>
                <div className="p-6">
                    <h2 className="text-lg font-bold text-slate-900">
                        Reset Seluruh Alur Penilaian?
                    </h2>
                    <p className="mt-2 text-sm text-slate-500">
                        Tindakan ini akan menghapus seluruh data peserta, nilai kriteria, dan hasil perhitungan (BWM, EDAS, Copeland) untuk periode <span className="font-bold text-slate-900">{period.name}</span>. 
                        Data kriteria inti tidak akan dihapus. Tindakan ini tidak dapat dibatalkan.
                    </p>
                    <div className="mt-6 flex justify-end gap-3">
                        <SecondaryButton onClick={() => setConfirmingReset(false)}>
                            Batal
                        </SecondaryButton>
                        <DangerButton onClick={handleReset}>
                            Ya, Reset Sekarang
                        </DangerButton>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
