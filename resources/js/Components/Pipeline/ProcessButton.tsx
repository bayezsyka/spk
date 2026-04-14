interface Props {
    processing: boolean;
    onClick: () => void;
    label?: string;
    loadingLabel?: string;
    disabled?: boolean;
    variant?: 'primary' | 'success';
}

export default function ProcessButton({
    processing,
    onClick,
    label = 'Mulai Proses',
    loadingLabel = 'Memproses...',
    disabled = false,
    variant = 'primary',
}: Props) {
    const variants = {
        primary: 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-200 focus:ring-indigo-500',
        success: 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-200 focus:ring-emerald-500',
    };

    return (
        <button
            onClick={onClick}
            disabled={processing || disabled}
            className={`
                relative inline-flex items-center gap-3 px-8 py-4 rounded-2xl
                text-white text-sm font-black uppercase tracking-wider
                shadow-xl transition-all duration-200
                focus:outline-none focus:ring-4 focus:ring-offset-2
                disabled:opacity-60 disabled:cursor-not-allowed
                ${!processing && !disabled ? `${variants[variant]} hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]` : variants[variant]}
            `}
        >
            {/* Loading spinner */}
            {processing && (
                <svg className="animate-spin h-5 w-5 text-white/80" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
            )}

            {/* Rocket icon when not processing */}
            {!processing && (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
            )}

            <span>{processing ? loadingLabel : label}</span>

            {/* Animated pulse ring when ready */}
            {!processing && !disabled && (
                <span className="absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-indigo-400 to-violet-400 opacity-0 animate-pulse" style={{ animationDuration: '3s' }} />
            )}
        </button>
    );
}
