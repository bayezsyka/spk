<?php

namespace App\Http\Controllers\Pipeline;

use App\Http\Controllers\Controller;
use App\Models\AssessmentPeriod;
use App\Models\BwmComparison;
use App\Models\CalculationRun;
use App\Models\CriterionWeight;
use App\Models\Criterion;
use App\Services\BWM\BwmWeightService;
use Illuminate\Http\Request;

class BwmStepController extends Controller
{
    /**
     * Process BWM weight calculation from user-provided comparison data.
     */
    public function process(Request $request, AssessmentPeriod $period, BwmWeightService $bwmService)
    {
        $validated = $request->validate([
            'best_criterion_id' => 'required|exists:criteria,id',
            'worst_criterion_id' => 'required|exists:criteria,id|different:best_criterion_id',
            'best_to_others' => 'required|array',
            'others_to_worst' => 'required|array',
        ]);

        // Store/update BWM comparison preferences
        BwmComparison::updateOrCreate(
            ['assessment_period_id' => $period->id],
            [
                'best_criterion_id' => $validated['best_criterion_id'],
                'worst_criterion_id' => $validated['worst_criterion_id'],
                'best_to_others' => $validated['best_to_others'],
                'others_to_worst' => $validated['others_to_worst'],
            ]
        );

        // Calculate weights using the BWM service
        $criteria = Criterion::where('assessment_period_id', $period->id)
            ->orderBy('sort_order')
            ->get();

        $result = $bwmService->calculateFromComparisons(
            $criteria,
            $validated['best_to_others'],
            $validated['others_to_worst']
        );

        // Store weights per criterion
        foreach ($result['weights'] as $criterionId => $weight) {
            CriterionWeight::updateOrCreate(
                [
                    'criterion_id' => $criterionId,
                    'assessment_period_id' => $period->id,
                ],
                [
                    'weight_value' => $weight,
                    'source_method' => 'BWM',
                    'consistency_ratio' => $result['consistency_ratio'] ?? null,
                ]
            );
        }

        // Update BWM comparison with consistency index
        BwmComparison::where('assessment_period_id', $period->id)
            ->update(['consistency_index' => $result['consistency_ratio'] ?? null]);

        // Store calculation run with full intermediate payload
        CalculationRun::create([
            'assessment_period_id' => $period->id,
            'run_code' => 'BWM-' . $period->id . '-' . time(),
            'method_stage' => 'BWM',
            'description' => 'BWM weight calculation for ' . $period->name,
            'stage_payload' => $result,
            'executed_at' => now(),
        ]);

        // Advance pipeline to step 4 (EDAS)
        $period->markStepCompleted(3);

        return back()->with('success', 'Pembobotan BWM berhasil dihitung. Lanjut ke kalkulasi EDAS.');
    }
}
