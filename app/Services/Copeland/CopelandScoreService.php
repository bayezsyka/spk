<?php

namespace App\Services\Copeland;

use InvalidArgumentException;

class CopelandScoreService
{
    /**
     * Copeland ranking using pairwise comparison on EDAS appraisal scores.
     */
    public function rankWithPairwise(array $appraisalScores): array
    {
        if (count($appraisalScores) < 2) {
            throw new InvalidArgumentException('Minimal dua peserta diperlukan untuk menghitung Copeland.');
        }

        $participants = [];

        foreach ($appraisalScores as $entry) {
            $participantId = (int) ($entry['participant_id'] ?? 0);

            if ($participantId === 0 || !isset($entry['score'])) {
                throw new InvalidArgumentException('Data Appraisal Score EDAS tidak valid.');
            }

            $participants[$participantId] = [
                'id' => $participantId,
                'name' => (string) ($entry['participant_name'] ?? 'Peserta'),
                'edas_score' => (float) $entry['score'],
            ];
        }

        $participantIds = array_keys($participants);
        $pairwise = [];
        $wins = array_fill_keys($participantIds, 0);
        $losses = array_fill_keys($participantIds, 0);
        $ties = array_fill_keys($participantIds, 0);

        foreach ($participantIds as $leftId) {
            $pairwise[$leftId] = [];

            foreach ($participantIds as $rightId) {
                if ($leftId === $rightId) {
                    $pairwise[$leftId][$rightId] = 0;
                    continue;
                }

                $leftScore = $participants[$leftId]['edas_score'];
                $rightScore = $participants[$rightId]['edas_score'];

                if ($leftScore > $rightScore) {
                    $pairwise[$leftId][$rightId] = 1;
                    $wins[$leftId]++;
                } elseif ($leftScore < $rightScore) {
                    $pairwise[$leftId][$rightId] = -1;
                    $losses[$leftId]++;
                } else {
                    $pairwise[$leftId][$rightId] = 0;
                    $ties[$leftId]++;
                }
            }
        }

        $rankingRows = [];

        foreach ($participantIds as $participantId) {
            $rankingRows[] = [
                'participant_id' => $participantId,
                'participant_name' => $participants[$participantId]['name'],
                'edas_score' => $participants[$participantId]['edas_score'],
                'wins' => $wins[$participantId],
                'losses' => $losses[$participantId],
                'ties' => $ties[$participantId],
                'copeland_score' => $wins[$participantId] - $losses[$participantId],
            ];
        }

        usort($rankingRows, function (array $left, array $right) {
            foreach ([
                $right['copeland_score'] <=> $left['copeland_score'],
                $right['edas_score'] <=> $left['edas_score'],
                $right['wins'] <=> $left['wins'],
                $left['losses'] <=> $right['losses'],
                strcmp($left['participant_name'], $right['participant_name']),
            ] as $comparison) {
                if ($comparison !== 0) {
                    return $comparison;
                }
            }

            return 0;
        });

        $displayRank = 0;
        $position = 0;
        $previous = null;

        foreach ($rankingRows as &$row) {
            $position++;

            if (
                $previous !== null &&
                $row['copeland_score'] === $previous['copeland_score'] &&
                abs($row['edas_score'] - $previous['edas_score']) < 0.000001
            ) {
                $row['final_rank'] = $displayRank;
            } else {
                $displayRank = $position;
                $row['final_rank'] = $displayRank;
            }

            $previous = $row;
        }
        unset($row);

        $pairwiseDisplay = [];
        $participantLabels = [];
        $orderedParticipantIds = array_column($rankingRows, 'participant_id');

        foreach ($orderedParticipantIds as $participantId) {
            $participantLabels[$participantId] = $participants[$participantId]['name'];
            $pairwiseDisplay[] = [
                'participant_id' => $participantId,
                'participant_name' => $participants[$participantId]['name'],
                'comparisons' => $pairwise[$participantId],
            ];
        }

        return [
            'pairwise_matrix' => $pairwiseDisplay,
            'rankings' => $rankingRows,
            'participant_labels' => $participantLabels,
            'summary' => [
                'total_participants' => count($participantIds),
                'total_comparisons' => (count($participantIds) * (count($participantIds) - 1)) / 2,
            ],
        ];
    }
}
