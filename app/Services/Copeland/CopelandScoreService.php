<?php

namespace App\Services\Copeland;

class CopelandScoreService
{
    /**
     * Process Copeland Score and determine final rank (backward compatible).
     *
     * @param array $edasResults
     * @return array
     */
    public function rank(array $edasResults): array
    {
        usort($edasResults, function($a, $b) {
            return $b['edas_score'] <=> $a['edas_score'];
        });

        $ranked = [];
        foreach ($edasResults as $index => $result) {
            $ranked[] = [
                'participant_id' => $result['participant_id'],
                'edas_score' => $result['edas_score'],
                'copeland_score' => 1.0 - ($index * 0.1),
                'final_rank' => $index + 1,
            ];
        }

        return $ranked;
    }

    /**
     * Full Copeland scoring with pairwise comparison matrix.
     *
     * Copeland Method:
     * 1. Create pairwise comparison matrix (each participant vs every other)
     * 2. For each pair (i, j): if AS_i > AS_j → win for i, loss for j
     * 3. Copeland Score = wins - losses
     * 4. Rank by Copeland Score descending
     *
     * @param array $appraisalScores Array of ['participant_id', 'participant_name', 'score']
     * @return array{pairwise_matrix: array, rankings: array, participant_labels: array}
     */
    public function rankWithPairwise(array $appraisalScores): array
    {
        $n = count($appraisalScores);

        // Build indexed arrays for easy access
        $participants = [];
        foreach ($appraisalScores as $entry) {
            $participants[$entry['participant_id']] = [
                'id' => $entry['participant_id'],
                'name' => $entry['participant_name'],
                'edas_score' => $entry['score'],
            ];
        }
        $ids = array_keys($participants);

        // Step 1: Pairwise Comparison Matrix
        // pairwise[i][j] = 1 if i wins, -1 if i loses, 0 if tie
        $pairwise = [];
        $wins = array_fill_keys($ids, 0);
        $losses = array_fill_keys($ids, 0);
        $ties = array_fill_keys($ids, 0);

        foreach ($ids as $i) {
            $pairwise[$i] = [];
            foreach ($ids as $j) {
                if ($i === $j) {
                    $pairwise[$i][$j] = 0; // No self-comparison
                    continue;
                }

                $scoreI = $participants[$i]['edas_score'];
                $scoreJ = $participants[$j]['edas_score'];

                if ($scoreI > $scoreJ) {
                    $pairwise[$i][$j] = 1;   // i wins
                    $wins[$i]++;
                } elseif ($scoreI < $scoreJ) {
                    $pairwise[$i][$j] = -1;  // i loses
                    $losses[$i]++;
                } else {
                    $pairwise[$i][$j] = 0;   // tie
                    $ties[$i]++;
                }
            }
        }

        // Step 2: Calculate Copeland Scores
        $copelandScores = [];
        foreach ($ids as $id) {
            $copelandScores[$id] = $wins[$id] - $losses[$id];
        }

        // Step 3: Rank by Copeland Score descending
        arsort($copelandScores);

        $rankings = [];
        $rank = 1;
        foreach ($copelandScores as $id => $copScore) {
            $rankings[] = [
                'participant_id' => $id,
                'participant_name' => $participants[$id]['name'],
                'edas_score' => $participants[$id]['edas_score'],
                'copeland_score' => $copScore,
                'wins' => $wins[$id],
                'losses' => $losses[$id],
                'ties' => $ties[$id],
                'final_rank' => $rank++,
            ];
        }

        // Build participant label map for the pairwise matrix display
        $participantLabels = [];
        foreach ($participants as $id => $p) {
            $participantLabels[$id] = $p['name'];
        }

        // Build matrix in display-friendly format
        $pairwiseDisplay = [];
        foreach ($ids as $i) {
            $row = [
                'participant_id' => $i,
                'participant_name' => $participants[$i]['name'],
                'comparisons' => [],
            ];
            foreach ($ids as $j) {
                $row['comparisons'][$j] = $pairwise[$i][$j];
            }
            $pairwiseDisplay[] = $row;
        }

        return [
            'pairwise_matrix' => $pairwiseDisplay,
            'rankings' => $rankings,
            'participant_labels' => $participantLabels,
            'summary' => [
                'total_participants' => $n,
                'total_comparisons' => $n * ($n - 1) / 2,
            ],
        ];
    }
}
