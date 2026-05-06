<?php

namespace App\Http\Controllers\Pipeline;

use App\Http\Controllers\Controller;
use App\Models\AssessmentPeriod;
use App\Models\Participant;
use App\Models\Criterion;
use App\Models\CalculationRun;
use App\Models\CriterionWeight;
use App\Services\EDAS\EdasCalculationService;
use InvalidArgumentException;

class EdasStepController extends Controller
{
    /**
     * Process EDAS calculation using the period's participants, criteria, and BWM weights.
     */
    public function process(AssessmentPeriod $period, EdasCalculationService $edasService)
    {
        // Gather data
        $participants = Participant::where('assessment_period_id', $period->id)
            ->with('scores.criterion')
            ->get();

        $criteria = Criterion::where('assessment_period_id', $period->id)
            ->orderBy('sort_order')
            ->get();

        $weights = CriterionWeight::where('assessment_period_id', $period->id)
            ->with('criterion')
            ->get()
            ->mapWithKeys(fn($w) => [$w->criterion->code => $w->weight_value])
            ->toArray();

        try {
            $result = $edasService->calculateWithMatrices($participants, $criteria, $weights);
        } catch (InvalidArgumentException $exception) {
            return back()->with('error', $exception->getMessage());
        }

        CalculationRun::create([
            'assessment_period_id' => $period->id,
            'run_code' => 'EDAS-' . $period->id . '-' . time(),
            'method_stage' => 'EDAS',
            'description' => 'EDAS calculation for ' . $period->name,
            'stage_payload' => $result,
            'executed_at' => now(),
        ]);

        $period->markStepCompleted(4);

        return back()->with('success', 'Kalkulasi EDAS berhasil. Matriks PDA/NDA tersedia untuk review.');
    }
}
