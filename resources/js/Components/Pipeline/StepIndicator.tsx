interface Step {
    key: string;
    label: string;
    icon: string;
    description: string;
}

interface Props {
    steps: Step[];
    activeStep: number;
    completedStep: number;
    onStepClick: (index: number) => void;
}

export default function StepIndicator({ steps, activeStep, completedStep, onStepClick }: Props) {
    return (
        <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200 p-4 sm:p-8 shadow-sm">
            <div className="relative">
                {/* Background Track — hidden on mobile */}
                <div className="hidden sm:block absolute top-6 left-[40px] right-[40px] h-0.5 bg-slate-100" />
                {/* Progress Track */}
                <div
                    className="hidden sm:block absolute top-6 left-[40px] h-0.5 bg-gradient-to-r from-indigo-500 to-violet-500 transition-all duration-700 ease-out rounded-full"
                    style={{ width: `${(completedStep / Math.max(steps.length - 1, 1)) * (100 - (80 / steps.length))}%` }}
                />

                <div className="relative flex flex-col sm:flex-row sm:justify-between gap-3 sm:gap-0">
                    {steps.map((step, index) => {
                        const isCompleted = index < completedStep;
                        const isActive = index === activeStep;
                        const isLocked = index > completedStep;

                        return (
                            <button
                                key={step.key}
                                onClick={() => !isLocked && onStepClick(index)}
                                disabled={isLocked}
                                className={`
                                    flex sm:flex-col items-center gap-3 sm:gap-0 transition-all duration-200
                                    px-3 py-2 sm:p-0 rounded-xl sm:rounded-none
                                    ${isActive ? 'bg-indigo-50 sm:bg-transparent' : ''}
                                    ${isLocked ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}
                                    ${!isLocked && !isActive ? 'hover:bg-slate-50 sm:hover:bg-transparent' : ''}
                                `}
                            >
                                {/* Step Circle */}
                                <div className={`
                                    relative w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl flex items-center justify-center
                                    text-base sm:text-lg font-black border-2 transition-all duration-300 shrink-0
                                    ${isActive
                                        ? 'bg-indigo-600 border-indigo-600 text-white sm:scale-110 shadow-xl shadow-indigo-200/50'
                                        : isCompleted
                                            ? 'bg-emerald-500 border-emerald-500 text-white'
                                            : 'bg-white border-slate-200 text-slate-400'
                                    }
                                    ${!isLocked && !isActive ? 'group-hover:border-indigo-300 group-hover:scale-105' : ''}
                                `}>
                                    {isCompleted ? (
                                        <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                        </svg>
                                    ) : (
                                        <span>{step.icon}</span>
                                    )}

                                    {/* Lock icon for locked steps */}
                                    {isLocked && (
                                        <div className="absolute -top-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 bg-slate-300 rounded-full flex items-center justify-center">
                                            <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                            </svg>
                                        </div>
                                    )}
                                </div>

                                {/* Labels */}
                                <div className="sm:text-center">
                                    <span className={`
                                        block text-[10px] sm:mt-3 font-black uppercase tracking-widest
                                        ${isActive ? 'text-indigo-600' : isCompleted ? 'text-emerald-600' : 'text-slate-400'}
                                    `}>
                                        {step.label}
                                    </span>
                                    <span className={`
                                        block text-[9px] font-medium mt-0.5
                                        ${isActive ? 'text-indigo-400' : 'text-slate-300'}
                                    `}>
                                        {step.description}
                                    </span>
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
