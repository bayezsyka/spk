<?php

namespace App\Services\Participants;

use App\Models\AssessmentPeriod;
use App\Models\Criterion;
use App\Models\Participant;
use App\Models\ParticipantScore;
use Illuminate\Support\Collection;
use Illuminate\Support\Str;
use InvalidArgumentException;

class ParticipantScoreSyncService
{
    /**
     * Field mapping for the fixed five core criteria.
     */
    private const FIELD_MAP = [
        'C1' => 'pre_test_score',
        'C2' => 'interview_grade',
        'C3' => 'report_score',
        'C4' => 'domicile_distance_km',
        'C5' => 'work_readiness_grade',
    ];

    public function syncParticipant(Participant $participant, ?Collection $criteria = null): int
    {
        $criteria ??= Criterion::where('assessment_period_id', $participant->assessment_period_id)
            ->with('subscales')
            ->orderBy('sort_order')
            ->get();

        $count = 0;

        foreach ($criteria as $criterion) {
            $field = self::FIELD_MAP[$criterion->code] ?? null;

            if (!$field) {
                continue;
            }

            $rawValue = $this->resolveCriterionValue($criterion, $participant->{$field});

            ParticipantScore::updateOrCreate(
                [
                    'participant_id' => $participant->id,
                    'criterion_id' => $criterion->id,
                ],
                [
                    'raw_value' => $rawValue,
                ]
            );

            $count++;
        }

        return $count;
    }

    public function syncPeriod(AssessmentPeriod $period): int
    {
        $criteria = Criterion::where('assessment_period_id', $period->id)
            ->with('subscales')
            ->orderBy('sort_order')
            ->get();

        $participants = $period->participants()->get();
        $count = 0;

        foreach ($participants as $participant) {
            $count += $this->syncParticipant($participant, $criteria);
        }

        return $count;
    }

    public function resolveCriterionValue(Criterion $criterion, mixed $value): float
    {
        if ($criterion->input_type === 'categorical') {
            return $this->resolveCategoricalValue($criterion, $value);
        }

        return (float) $value;
    }

    public function resolveCategoricalValue(Criterion $criterion, mixed $value): float
    {
        $normalizedInput = $this->normalizeLabel($value);

        if ($normalizedInput === '') {
            throw new InvalidArgumentException("Nilai untuk kriteria {$criterion->name} belum diisi.");
        }

        $criterion->loadMissing('subscales');

        foreach ($criterion->subscales as $subscale) {
            if ($this->normalizeLabel($subscale->label) === $normalizedInput) {
                return (float) $subscale->numeric_value;
            }
        }

        $allowedLabels = $criterion->subscales
            ->pluck('label')
            ->filter()
            ->values()
            ->implode(', ');

        throw new InvalidArgumentException(
            "Label \"{$value}\" tidak cocok dengan subskala {$criterion->name}. Gunakan salah satu dari: {$allowedLabels}."
        );
    }

    public function normalizeLabel(mixed $value): string
    {
        return Str::of((string) $value)
            ->squish()
            ->lower()
            ->value();
    }
}
