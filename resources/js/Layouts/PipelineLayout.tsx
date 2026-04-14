import { Link, usePage } from '@inertiajs/react';
import Dropdown from '@/Components/Dropdown';
import ApplicationLogo from '@/Components/ApplicationLogo';
import { PropsWithChildren } from 'react';

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

    const stepProgress = Math.round(((pipelineState.currentStep - 1) / 5) * 100);

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
                                <span className="font-bold text-sm text-slate-900 hidden sm:block tracking-tight">SmartSPK</span>
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
                                    Step {pipelineState.currentStep}/6
                                </span>
                                <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest sm:hidden">
                                    {pipelineState.currentStep}/6
                                </span>
                            </div>

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
                                        <Dropdown.Link href={route('profile.edit')}>Profile</Dropdown.Link>
                                        <Dropdown.Link href={route('logout')} method="post" as="button">
                                            Log Out
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
        </div>
    );
}
