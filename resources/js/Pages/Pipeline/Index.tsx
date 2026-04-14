import { Head, usePage } from '@inertiajs/react';
import PipelineLayout from '@/Layouts/PipelineLayout';
import StepIndicator from '@/Components/Pipeline/StepIndicator';
import SetupStep from './Steps/SetupStep';
import ScoringStep from './Steps/ScoringStep';
import BwmStep from './Steps/BwmStep';
import EdasStep from './Steps/EdasStep';
import CopelandStep from './Steps/CopelandStep';
import ResultStep from './Steps/ResultStep';
import { useState } from 'react';

const STEPS = [
    { key: 'setup',    label: 'Konfigurasi',        icon: '⚙️', description: 'Kriteria & Setup' },
    { key: 'scoring',  label: 'Input Nilai',         icon: '📝', description: 'Peserta & Skor' },
    { key: 'bwm',      label: 'Pembobotan',          icon: '⚖️', description: 'Best-Worst Method' },
    { key: 'edas',     label: 'EDAS',                icon: '📊', description: 'PDA/NDA Matrix' },
    { key: 'copeland', label: 'Copeland',            icon: '🏆', description: 'Pairwise Score' },
    { key: 'result',   label: 'Hasil Akhir',         icon: '🎯', description: 'Ranking Final' },
];

export default function PipelineIndex({ period, pipelineState, stepData, completedRuns, finalResults }: any) {
    const { flash } = usePage<any>().props;
    const [activeStep, setActiveStep] = useState(Math.min(pipelineState.currentStep - 1, 5));
    const [isTransitioning, setIsTransitioning] = useState(false);

    const goToStep = (index: number) => {
        if (index > pipelineState.currentStep - 1 && index > activeStep) {
            // Can only go up to the current unlocked step
            if (index > pipelineState.currentStep) return;
        }
        setIsTransitioning(true);
        setTimeout(() => {
            setActiveStep(index);
            setIsTransitioning(false);
        }, 200);
    };

    const StepComponents = [SetupStep, ScoringStep, BwmStep, EdasStep, CopelandStep, ResultStep];
    const ActiveStepComponent = StepComponents[activeStep];

    return (
        <PipelineLayout period={period} pipelineState={pipelineState}>
            <Head title={`Pipeline — ${period.name}`} />

            <div className="space-y-6">
                {/* Flash Messages */}
                {(flash as any)?.success && (
                    <div className="bg-emerald-50 border border-emerald-100 text-emerald-700 px-6 py-4 rounded-2xl flex items-center gap-3 shadow-sm animate-fade-in">
                        <svg className="w-5 h-5 text-emerald-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="font-bold text-sm">{(flash as any).success}</span>
                    </div>
                )}
                {(flash as any)?.error && (
                    <div className="bg-rose-50 border border-rose-100 text-rose-700 px-6 py-4 rounded-2xl flex items-center gap-3 shadow-sm animate-fade-in">
                        <svg className="w-5 h-5 text-rose-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="font-bold text-sm">{(flash as any).error}</span>
                    </div>
                )}

                {/* Step Indicator */}
                <StepIndicator
                    steps={STEPS}
                    activeStep={activeStep}
                    completedStep={pipelineState.currentStep - 1}
                    onStepClick={goToStep}
                />

                {/* Step Content with Transition */}
                <div className={`
                    transition-all duration-200 ease-in-out
                    ${isTransitioning ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}
                `}>
                    <ActiveStepComponent
                        period={period}
                        stepData={stepData}
                        completedRuns={completedRuns}
                        pipelineState={pipelineState}
                        finalResults={finalResults}
                        onNavigateStep={goToStep}
                    />
                </div>
            </div>
        </PipelineLayout>
    );
}
