<?php

namespace App\Services\BWM;

use Illuminate\Support\Collection;

class BwmWeightService
{
    /**
     * Calculate and return the final theoretical weights based on BWM.
     * Currently returns dummy weights for backward compatibility.
     *
     * @return array
     */
    public function getFinalWeights(): array
    {
        return [
            'C1' => 0.20,
            'C2' => 0.25,
            'C3' => 0.20,
            'C4' => 0.15,
            'C5' => 0.20,
        ];
    }

    /**
     * Calculate weights from BWM comparison vectors.
     *
     * This uses a simplified BWM approach:
     * 1. The user selects the Best and Worst criteria.
     * 2. The user provides "Best-to-Others" (BO) preference vector.
     * 3. The user provides "Others-to-Worst" (OW) preference vector.
     * 4. We solve for optimal weights w* that minimize the maximum
     *    |w_B / w_j - a_Bj| and |w_j / w_W - a_jW| for all j.
     *
     * For simplicity, we use the linear approximation method:
     *   w_j = 1 / (a_Bj * sum(1/a_Bk for all k))
     *
     * @param Collection $criteria Ordered list of Criterion models
     * @param array $bestToOthers  Map of criterion_id => preference value (1-9)
     * @param array $othersToWorst Map of criterion_id => preference value (1-9)
     * @return array{weights: array, consistency_ratio: float, details: array}
     */
    public function calculateFromComparisons(
        Collection $criteria,
        array $bestToOthers,
        array $othersToWorst
    ): array {
        $n = $criteria->count();

        // Calculate weights using linear BWM approximation
        // w_j = 1 / (a_Bj) normalized to sum = 1
        $rawWeights = [];
        $sumInverse = 0;

        foreach ($criteria as $criterion) {
            $boValue = (float)($bestToOthers[$criterion->id] ?? 1);
            $inverse = 1.0 / max($boValue, 0.001);
            $rawWeights[$criterion->id] = $inverse;
            $sumInverse += $inverse;
        }

        // Normalize to sum = 1
        $weights = [];
        foreach ($rawWeights as $criterionId => $raw) {
            $weights[$criterionId] = round($raw / max($sumInverse, 0.001), 6);
        }

        // Calculate consistency ratio (simplified)
        // CI = (max eigenvalue - n) / (n - 1)  
        // For BWM: ξ* (ksi) approximation
        $consistencyRatio = $this->calculateConsistencyRatio(
            $criteria, $weights, $bestToOthers, $othersToWorst
        );

        // Build detailed output for visualization
        $details = [
            'criteria_codes' => $criteria->pluck('code', 'id')->toArray(),
            'criteria_names' => $criteria->pluck('name', 'id')->toArray(),
            'best_to_others_input' => $bestToOthers,
            'others_to_worst_input' => $othersToWorst,
            'raw_inverse_values' => $rawWeights,
            'normalized_weights' => $weights,
        ];

        return [
            'weights' => $weights,
            'consistency_ratio' => $consistencyRatio,
            'details' => $details,
        ];
    }

    /**
     * Calculate consistency ratio for BWM.
     * Uses the simplified approach based on maximum absolute deviation.
     */
    private function calculateConsistencyRatio(
        Collection $criteria,
        array $weights,
        array $bestToOthers,
        array $othersToWorst
    ): float {
        // Find best and worst criterion (the ones with preference value = 1)
        $bestId = null;
        $worstId = null;
        $minBo = PHP_INT_MAX;
        $maxBo = 0;

        foreach ($bestToOthers as $id => $val) {
            if ((int)$val <= $minBo) {
                $minBo = (int)$val;
                $bestId = $id;
            }
            if ((int)$val >= $maxBo) {
                $maxBo = (int)$val;
            }
        }

        foreach ($othersToWorst as $id => $val) {
            if ((int)$val <= 1) {
                $worstId = $id;
            }
        }

        if (!$bestId || !$worstId) return 0;

        $wBest = $weights[$bestId] ?? 0;
        $wWorst = $weights[$worstId] ?? 0;

        // Max deviation calculation
        $maxDeviation = 0;
        foreach ($criteria as $criterion) {
            $wJ = $weights[$criterion->id] ?? 0;
            $aBj = (float)($bestToOthers[$criterion->id] ?? 1);
            $aJw = (float)($othersToWorst[$criterion->id] ?? 1);

            if ($wJ > 0) {
                $dev1 = abs(($wBest / max($wJ, 0.0001)) - $aBj);
                $dev2 = abs(($wJ / max($wWorst, 0.0001)) - $aJw);
                $maxDeviation = max($maxDeviation, $dev1, $dev2);
            }
        }

        // Consistency Index table for BWM (for a_BW values 1-9)
        $ciTable = [1 => 0, 2 => 0.44, 3 => 1.00, 4 => 1.63, 5 => 2.30, 6 => 3.00, 7 => 3.73, 8 => 4.47, 9 => 5.23];
        $aBW = (int)($bestToOthers[$worstId] ?? 1);
        $ciMax = $ciTable[min($aBW, 9)] ?? 0;

        return $ciMax > 0 ? round($maxDeviation / $ciMax, 4) : 0;
    }
}
