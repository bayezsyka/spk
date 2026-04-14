<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AssessmentPeriod extends Model
{
    protected $guarded = [];

    protected $casts = [
        'is_active' => 'boolean',
        'start_date' => 'date',
        'end_date' => 'date',
        'current_step' => 'integer',
        'pipeline_meta' => 'array',
    ];

    /* ── Relationships ────────────────────────────── */

    public function criteria()
    {
        return $this->hasMany(Criterion::class);
    }

    public function participants()
    {
        return $this->hasMany(Participant::class);
    }

    public function calculationRuns()
    {
        return $this->hasMany(CalculationRun::class);
    }

    public function bwmComparison()
    {
        return $this->hasOne(BwmComparison::class);
    }

    public function criterionWeights()
    {
        return $this->hasMany(CriterionWeight::class);
    }

    /* ── Pipeline Helpers ─────────────────────────── */

    /**
     * Get the pipeline step names mapped by number.
     */
    public static function stepNames(): array
    {
        return [
            1 => 'setup',
            2 => 'scoring',
            3 => 'bwm',
            4 => 'edas',
            5 => 'copeland',
            6 => 'completed',
        ];
    }

    /**
     * Get a human-readable label for the current pipeline status.
     */
    public function getPipelineStatusLabelAttribute(): string
    {
        return match ($this->pipeline_status) {
            'setup'     => 'Konfigurasi Awal',
            'scoring'   => 'Input Nilai',
            'bwm'       => 'Pembobotan BWM',
            'edas'      => 'Kalkulasi EDAS',
            'copeland'  => 'Copeland Score',
            'completed' => 'Selesai',
            default     => 'Tidak Diketahui',
        };
    }

    /**
     * Check if a given step number has been completed.
     */
    public function hasCompletedStep(int $step): bool
    {
        return $this->current_step > $step;
    }

    /**
     * Check if a given step can currently be accessed.
     */
    public function canAccessStep(int $step): bool
    {
        return $this->current_step >= $step;
    }

    /**
     * Record a step completion timestamp in pipeline_meta.
     */
    public function markStepCompleted(int $step): void
    {
        $meta = $this->pipeline_meta ?? [];
        $meta["step_{$step}_completed_at"] = now()->toIso8601String();

        $nextStep = min($step + 1, 6);
        $stepNames = self::stepNames();

        $this->update([
            'current_step' => max($this->current_step, $nextStep),
            'pipeline_status' => $stepNames[$nextStep] ?? 'completed',
            'pipeline_meta' => $meta,
        ]);
    }

    /**
     * Build the access map for all pipeline steps.
     */
    public function getPipelineAccessMap(): array
    {
        return [
            'setup'    => true,
            'scoring'  => $this->current_step >= 2,
            'bwm'      => $this->current_step >= 3,
            'edas'     => $this->current_step >= 4,
            'copeland' => $this->current_step >= 5,
            'result'   => $this->current_step >= 6,
        ];
    }
}
