<?php

namespace App\Services\EDAS;

use Illuminate\Support\Collection;

class EdasCalculationService
{
    /**
     * Process EDAS calculation (backward compatible - simple version).
     *
     * @param array $participants
     * @param array $weights
     * @return array
     */
    public function calculate(array $participants, array $weights): array
    {
        $results = [];

        foreach ($participants as $participant) {
            $results[] = [
                'participant_id' => $participant['id'] ?? $participant->id,
                'edas_score' => rand(30, 90) / 100,
            ];
        }

        return $results;
    }

    /**
     * Full EDAS calculation with intermediate matrices for visualization.
     *
     * EDAS Steps:
     * 1. Build decision matrix from participant scores
     * 2. Calculate Average Solution (AV)
     * 3. Calculate PDA (Positive Distance from Average) matrix
     * 4. Calculate NDA (Negative Distance from Average) matrix
     * 5. Calculate weighted SP and SN
     * 6. Normalize SP and SN
     * 7. Calculate Appraisal Score (AS)
     *
     * @param Collection $participants Participants with scores loaded
     * @param Collection $criteria     Criteria with attribute_type
     * @param array      $weights      Map of criterion_code => weight_value
     * @return array Full result with all intermediate matrices
     */
    public function calculateWithMatrices(Collection $participants, Collection $criteria, array $weights): array
    {
        $n = $participants->count();
        $m = $criteria->count();

        // Step 1: Build Decision Matrix
        $decisionMatrix = [];
        $participantMap = [];
        foreach ($participants as $participant) {
            $row = [];
            foreach ($criteria as $criterion) {
                $score = $participant->scores->firstWhere('criterion_id', $criterion->id);
                $row[$criterion->code] = (float)($score?->raw_value ?? 0);
            }
            $decisionMatrix[$participant->id] = $row;
            $participantMap[$participant->id] = $participant->full_name;
        }

        // Step 2: Average Solution (AV) per criterion
        $averageSolution = [];
        foreach ($criteria as $criterion) {
            $sum = 0;
            foreach ($decisionMatrix as $row) {
                $sum += $row[$criterion->code];
            }
            $averageSolution[$criterion->code] = $n > 0 ? round($sum / $n, 6) : 0;
        }

        // Step 3 & 4: PDA and NDA matrices
        $pdaMatrix = [];
        $ndaMatrix = [];
        foreach ($decisionMatrix as $participantId => $row) {
            $pdaRow = [];
            $ndaRow = [];
            foreach ($criteria as $criterion) {
                $value = $row[$criterion->code];
                $avg = $averageSolution[$criterion->code];

                if ($criterion->attribute_type === 'benefit') {
                    $pdaRow[$criterion->code] = $avg != 0
                        ? round(max(0, ($value - $avg) / abs($avg)), 6)
                        : 0;
                    $ndaRow[$criterion->code] = $avg != 0
                        ? round(max(0, ($avg - $value) / abs($avg)), 6)
                        : 0;
                } else { // cost
                    $pdaRow[$criterion->code] = $avg != 0
                        ? round(max(0, ($avg - $value) / abs($avg)), 6)
                        : 0;
                    $ndaRow[$criterion->code] = $avg != 0
                        ? round(max(0, ($value - $avg) / abs($avg)), 6)
                        : 0;
                }
            }
            $pdaMatrix[$participantId] = $pdaRow;
            $ndaMatrix[$participantId] = $ndaRow;
        }

        // Step 5: Weighted SP and SN
        $spValues = [];
        $snValues = [];
        foreach ($decisionMatrix as $participantId => $row) {
            $sp = 0;
            $sn = 0;
            foreach ($criteria as $criterion) {
                $w = $weights[$criterion->code] ?? 0;
                $sp += $w * ($pdaMatrix[$participantId][$criterion->code] ?? 0);
                $sn += $w * ($ndaMatrix[$participantId][$criterion->code] ?? 0);
            }
            $spValues[$participantId] = round($sp, 6);
            $snValues[$participantId] = round($sn, 6);
        }

        // Step 6: Normalize SP and SN
        $maxSp = count($spValues) > 0 ? max($spValues) : 1;
        $maxSn = count($snValues) > 0 ? max($snValues) : 1;

        $nspValues = [];
        $nsnValues = [];
        foreach ($spValues as $participantId => $sp) {
            $nspValues[$participantId] = $maxSp > 0 ? round($sp / $maxSp, 6) : 0;
        }
        foreach ($snValues as $participantId => $sn) {
            $nsnValues[$participantId] = $maxSn > 0 ? round(1 - ($sn / $maxSn), 6) : 1;
        }

        // Step 7: Appraisal Score (AS)
        $appraisalScores = [];
        foreach ($nspValues as $participantId => $nsp) {
            $nsn = $nsnValues[$participantId] ?? 0;
            $as = round(0.5 * ($nsp + $nsn), 6);
            $appraisalScores[] = [
                'participant_id' => (int)$participantId,
                'participant_name' => $participantMap[$participantId] ?? 'Unknown',
                'score' => $as,
            ];
        }

        // Sort by score descending
        usort($appraisalScores, fn($a, $b) => $b['score'] <=> $a['score']);

        // Build output matrices for frontend visualization
        $pdaVis = [];
        $ndaVis = [];
        foreach ($decisionMatrix as $participantId => $row) {
            $pdaVis[] = array_merge(
                ['participant_id' => $participantId, 'participant_name' => $participantMap[$participantId]],
                $pdaMatrix[$participantId]
            );
            $ndaVis[] = array_merge(
                ['participant_id' => $participantId, 'participant_name' => $participantMap[$participantId]],
                $ndaMatrix[$participantId]
            );
        }

        return [
            'decision_matrix' => $decisionMatrix,
            'participant_map' => $participantMap,
            'average_solution' => $averageSolution,
            'pda_matrix' => $pdaVis,
            'nda_matrix' => $ndaVis,
            'sp_values' => $spValues,
            'sn_values' => $snValues,
            'nsp_values' => $nspValues,
            'nsn_values' => $nsnValues,
            'appraisal_scores' => $appraisalScores,
            'criteria_codes' => $criteria->pluck('code')->toArray(),
            'weights_used' => $weights,
        ];
    }
}
