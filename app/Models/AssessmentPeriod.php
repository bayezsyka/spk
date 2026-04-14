<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AssessmentPeriod extends Model
{
    protected $guarded = [];

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
}
