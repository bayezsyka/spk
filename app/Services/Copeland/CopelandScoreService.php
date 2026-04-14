<?php

namespace App\Services\Copeland;

class CopelandScoreService
{
    /**
     * Process Copeland Score and determine final rank.
     * 
     * @param array $edasResults
     * @return array
     */
    public function rank(array $edasResults): array
    {
        // TODO: Implement actual Copeland Score logic in the future here

        // For now, sort based on edas_score descending
        usort($edasResults, function($a, $b) {
            return $b['edas_score'] <=> $a['edas_score'];
        });

        $ranked = [];
        foreach ($edasResults as $index => $result) {
            $ranked[] = [
                'participant_id' => $result['participant_id'],
                'edas_score' => $result['edas_score'],
                'copeland_score' => 1.0 - ($index * 0.1), // Dummy copeland score
                'final_rank' => $index + 1,
            ];
        }

        return $ranked;
    }
}
