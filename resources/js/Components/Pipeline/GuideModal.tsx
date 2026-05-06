import Modal from '@/Components/Modal';
import SecondaryButton from '@/Components/SecondaryButton';
import { PipelineGuideContent } from './pipelineGuides';

interface GuideModalProps {
    open: boolean;
    onClose: () => void;
    title: string;
    content: PipelineGuideContent;
}

export default function GuideModal({ open, onClose, title, content }: GuideModalProps) {
    return (
        <Modal show={open} onClose={onClose} maxWidth="4xl">
            <div className="flex flex-col max-h-[90vh]">
                {/* Fixed Header */}
                <div className="p-6 sm:p-8 border-b border-slate-100 bg-slate-50/50">
                    <div className="flex items-start justify-between gap-6">
                        <div className="flex-1">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shrink-0 shadow-lg shadow-indigo-200">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-500/80">Panduan Tahap</p>
                                    <h2 className="text-xl font-bold text-slate-900 tracking-tight">{title}</h2>
                                </div>
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={onClose}
                            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-400 transition-all hover:border-slate-300 hover:text-slate-600 hover:bg-white shadow-sm"
                            aria-label="Tutup panduan"
                        >
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18 18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                    {content.summary && (
                        <p className="mt-4 text-sm leading-relaxed text-slate-500 max-w-3xl">{content.summary}</p>
                    )}
                </div>

                {/* Scrollable Body */}
                <div className="flex-1 overflow-y-auto p-6 sm:p-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {content.sections.map((section) => (
                            <div key={section.title} className="group relative rounded-2xl border border-slate-200 bg-white p-5 transition-all hover:border-indigo-200 hover:shadow-md hover:shadow-indigo-500/5">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
                                    <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">{section.title}</h3>
                                </div>
                                <ul className="space-y-3">
                                    {section.items.map((item) => (
                                        <li key={item} className="flex gap-3 text-[13px] leading-relaxed text-slate-600">
                                            <svg className="w-4 h-4 mt-0.5 text-emerald-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                                            </svg>
                                            <span>{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>

                    {content.note && (
                        <div className="mt-8 rounded-2xl border border-amber-200 bg-amber-50/50 p-4 text-sm text-amber-800 flex gap-3">
                            <svg className="w-5 h-5 text-amber-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                            <p className="italic font-medium leading-relaxed">{content.note}</p>
                        </div>
                    )}
                </div>

                {/* Fixed Footer */}
                <div className="p-4 sm:p-6 border-t border-slate-100 bg-slate-50/50 flex justify-end">
                    <SecondaryButton onClick={onClose} className="!px-8 !py-2.5">Tutup</SecondaryButton>
                </div>
            </div>
        </Modal>
    );
}
