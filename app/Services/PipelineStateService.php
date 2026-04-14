<?php

namespace App\Services;

use App\Models\AssessmentPeriod;
use App\Models\Criterion;
use App\Models\Participant;
use App\Models\CalculationRun;
use App\Models\CriterionWeight;
use App\Models\ParticipantScore;

class PipelineStateService
{
    /**
     * Validate whether all prerequisites for a given step are met.
     *
     * @return array{valid: bool, message: string, data?: array}
     */
    public function validateStep(AssessmentPeriod $period, int $step): array
    {
        return match ($step) {
            1 => $this->validateSetup($period),
            2 => $this->validateScoring($period),
            3 => $this->validateBwm($period),
            4 => $this->validateEdas($period),
            5 => $this->validateCopeland($period),
            6 => $this->validateResult($period),
            default => ['valid' => false, 'message' => 'Tahap tidak valid.'],
        };
    }

    /**
     * Build a comprehensive status report for all steps.
     */
    public function getFullStatus(AssessmentPeriod $period): array
    {
        $steps = [];
        for ($i = 1; $i <= 6; $i++) {
            $steps[$i] = array_merge(
                $this->validateStep($period, $i),
                [
                    'step' => $i,
                    'completed' => $period->hasCompletedStep($i),
                    'accessible' => $period->canAccessStep($i),
                ]
            );
        }
        return $steps;
    }

    /**
     * Step 1: Requires at least 2 criteria configured for the period.
     */
    private function validateSetup(AssessmentPeriod $period): array
    {
        $criteriaCount = Criterion::where('assessment_period_id', $period->id)->count();

        return [
            'valid' => $criteriaCount >= 2,
            'message' => $criteriaCount >= 2
                ? "{$criteriaCount} kriteria terkonfigurasi"
                : "Minimal 2 kriteria diperlukan (saat ini: {$criteriaCount})",
            'data' => ['criteria_count' => $criteriaCount],
        ];
    }

    /**
     * Step 2: Requires at least 3 participants with fully completed scores.
     */
    private function validateScoring(AssessmentPeriod $period): array
    {
        $criteriaCount = Criterion::where('assessment_period_id', $period->id)->count();
        $participantCount = Participant::where('assessment_period_id', $period->id)->count();

        // A participant is "fully scored" when all their criteria have non-null raw_value
        $fullyScored = 0;
        if ($criteriaCount > 0 && $participantCount > 0) {
            $fullyScored = Participant::where('assessment_period_id', $period->id)
                ->whereDoesntHave('scores', function ($q) {
                    $q->whereNull('raw_value');
                })
                ->whereHas('scores', function ($q) {}, '>=', $criteriaCount)
                ->count();
        }

        $valid = $participantCount >= 3 && $fullyScored === $participantCount;

        return [
            'valid' => $valid,
            'message' => $valid
                ? "{$participantCount} peserta dengan skor lengkap"
                : "{$fullyScored}/{$participantCount} peserta memiliki skor lengkap (min. 3 peserta)",
            'data' => compact('participantCount', 'fullyScored', 'criteriaCount'),
        ];
    }

    /**
     * Step 3: BWM weights must have been computed.
     */
    private function validateBwm(AssessmentPeriod $period): array
    {
        $hasRun = CalculationRun::where('assessment_period_id', $period->id)
            ->where('method_stage', 'BWM')
            ->exists();

        $weightCount = CriterionWeight::where('assessment_period_id', $period->id)->count();

        return [
            'valid' => $hasRun && $weightCount > 0,
            'message' => $hasRun
                ? "Bobot BWM telah dihitung ({$weightCount} bobot)"
                : 'BWM belum diproses',
            'data' => ['has_run' => $hasRun, 'weight_count' => $weightCount],
        ];
    }

    /**
     * Step 4: EDAS calculation must have been completed.
     */
    private function validateEdas(AssessmentPeriod $period): array
    {
        $run = CalculationRun::where('assessment_period_id', $period->id)
            ->where('method_stage', 'EDAS')
            ->latest()
            ->first();

        return [
            'valid' => (bool) $run,
            'message' => $run
                ? 'Matriks EDAS telah dihitung'
                : 'EDAS belum diproses',
            'data' => ['run' => $run],
        ];
    }

    /**
     * Step 5: Copeland scoring must have been completed.
     */
    private function validateCopeland(AssessmentPeriod $period): array
    {
        $run = CalculationRun::where('assessment_period_id', $period->id)
            ->where('method_stage', 'COPELAND')
            ->latest()
            ->first();

        return [
            'valid' => (bool) $run,
            'message' => $run
                ? 'Copeland Score dihitung'
                : 'Copeland belum diproses',
            'data' => ['run' => $run],
        ];
    }

    /**
     * Step 6: Same as Copeland — final results exist.
     */
    private function validateResult(AssessmentPeriod $period): array
    {
        return $this->validateCopeland($period);
    }
}
