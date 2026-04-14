<?php

namespace App\Http\Controllers\Pipeline;

use App\Http\Controllers\Controller;
use App\Models\AssessmentPeriod;
use App\Models\Criterion;
use App\Models\Participant;
use App\Models\CalculationRun;
use App\Models\CriterionWeight;
use App\Services\PipelineStateService;
use Inertia\Inertia;

class PipelineController extends Controller
{
    public function __construct(
        private PipelineStateService $pipelineService
    ) {}

    /**
     * Main pipeline view — renders the wizard shell.
     * The React component handles step navigation internally.
     */
    public function index(AssessmentPeriod $period)
    {
        // Set as active period in session
        session(['active_period_id' => $period->id]);

        // Gather criteria with relationships
        $criteria = Criterion::where('assessment_period_id', $period->id)
            ->with(['subscales', 'weights' => fn($q) => $q->where('assessment_period_id', $period->id)])
            ->orderBy('sort_order')
            ->orderBy('code')
            ->get();

        // Gather participants with scores
        $participants = Participant::where('assessment_period_id', $period->id)
            ->with('scores.criterion')
            ->latest()
            ->get();

        // Gather calculation runs
        $bwmRun = CalculationRun::where('assessment_period_id', $period->id)
            ->where('method_stage', 'BWM')->latest()->first();
        $edasRun = CalculationRun::where('assessment_period_id', $period->id)
            ->where('method_stage', 'EDAS')->latest()->first();
        $copelandRun = CalculationRun::where('assessment_period_id', $period->id)
            ->where('method_stage', 'COPELAND')->latest()->first();

        // Build comprehensive step validation status
        $stepStatus = $this->pipelineService->getFullStatus($period);

        // BWM comparison if exists
        $bwmComparison = $period->bwmComparison;

        return Inertia::render('Pipeline/Index', [
            'period' => $period,
            'pipelineState' => [
                'currentStep' => $period->current_step,
                'status' => $period->pipeline_status,
                'statusLabel' => $period->pipeline_status_label,
                'meta' => $period->pipeline_meta,
                'stepStatus' => $stepStatus,
            ],
            'stepData' => [
                'setup' => [
                    'criteria' => $criteria,
                    'criteriaCount' => $criteria->count(),
                ],
                'scoring' => [
                    'participants' => $participants,
                    'participantCount' => $participants->count(),
                    'criteriaForScoring' => $criteria->map(fn($c) => [
                        'id' => $c->id,
                        'code' => $c->code,
                        'name' => $c->name,
                        'input_type' => $c->input_type,
                        'attribute_type' => $c->attribute_type,
                        'subscales' => $c->subscales,
                    ]),
                ],
                'bwm' => [
                    'comparison' => $bwmComparison,
                    'runPayload' => $bwmRun?->stage_payload,
                    'weights' => CriterionWeight::where('assessment_period_id', $period->id)
                        ->with('criterion')
                        ->get(),
                ],
                'edas' => [
                    'runPayload' => $edasRun?->stage_payload,
                ],
                'copeland' => [
                    'runPayload' => $copelandRun?->stage_payload,
                ],
            ],
            'completedRuns' => [
                'bwm' => $bwmRun,
                'edas' => $edasRun,
                'copeland' => $copelandRun,
            ],
            'finalResults' => $copelandRun
                ? $copelandRun->results()->with('participant')->orderBy('final_rank')->get()
                : [],
        ]);
    }
}
