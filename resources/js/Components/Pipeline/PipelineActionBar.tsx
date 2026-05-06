import { ReactNode } from 'react';

interface Props {
    title: string;
    subtitle?: string;
    onBack?: () => void;
    guide?: ReactNode;
    actions?: ReactNode;
}

export default function PipelineActionBar({ title, subtitle, onBack, guide, actions }: Props) {
    return (
        <div className="sticky top-[56px] -mt-2 -mx-1 px-1 py-3 z-30 pointer-events-none">
            <div className="bg-white/80 backdrop-blur-xl rounded-xl p-4 border border-slate-200 shadow-lg shadow-slate-200/50 flex items-center justify-between pointer-events-auto">
                <div className="flex items-center gap-3">
                    {onBack && (
                        <button
                            onClick={onBack}
                            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all"
                            title="Kembali"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                        </button>
                    )}
                    <div>
                        <h3 className="text-base font-bold text-slate-900 leading-none">{title}</h3>
                        {subtitle && <p className="text-[11px] text-slate-500 mt-1 hidden sm:block">{subtitle}</p>}
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    {guide}
                    {actions}
                </div>
            </div>
        </div>
    );
}
