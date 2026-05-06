interface Step {
    key: string;
    label: string;
    stepNumber: number;
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
        <div className="bg-white rounded-xl border border-slate-200 p-3 sm:p-5 shadow-sm">
            <div className="relative">
                {/* Background Track — hidden on mobile */}
                <div className="hidden sm:block absolute top-5 left-[40px] right-[40px] h-px bg-slate-200" />
                {/* Progress Track */}
                <div
                    className="hidden sm:block absolute top-5 left-[40px] h-px bg-indigo-500 transition-all duration-500 ease-out"
                    style={{ width: `${(completedStep / Math.max(steps.length - 1, 1)) * (100 - (80 / steps.length))}%` }}
                />

                <div className="relative flex flex-col sm:flex-row sm:justify-between gap-1.5 sm:gap-0">
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
                                    flex sm:flex-col items-center gap-2.5 sm:gap-0 transition-all duration-150
                                    px-3 py-2 sm:p-0 rounded-lg sm:rounded-none
                                    ${isActive ? 'bg-indigo-50/70 sm:bg-transparent' : ''}
                                    ${isLocked ? 'opacity-35 cursor-not-allowed' : 'cursor-pointer'}
                                    ${!isLocked && !isActive ? 'hover:bg-slate-50 sm:hover:bg-transparent' : ''}
                                `}
                            >
                                {/* Step Circle */}
                                <div className={`
                                    relative w-9 h-9 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center
                                    text-xs font-semibold border transition-all duration-200 shrink-0
                                    ${isActive
                                        ? 'bg-indigo-600 border-indigo-600 text-white sm:scale-105 shadow-md shadow-indigo-200/50'
                                        : isCompleted
                                            ? 'bg-emerald-500 border-emerald-500 text-white'
                                            : 'bg-white border-slate-200 text-slate-400'
                                    }
                                `}>
                                    {isCompleted ? (
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                                        </svg>
                                    ) : (
                                        <span>{step.stepNumber}</span>
                                    )}
                                </div>

                                {/* Labels */}
                                <div className="sm:text-center">
                                    <span className={`
                                        block text-[10px] sm:mt-2.5 font-semibold uppercase tracking-wider
                                        ${isActive ? 'text-indigo-600' : isCompleted ? 'text-emerald-600' : 'text-slate-400'}
                                    `}>
                                        {step.label}
                                    </span>
                                    <span className={`
                                        hidden sm:block text-[9px] font-medium mt-0.5
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
