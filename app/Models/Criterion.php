<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

use App\Traits\ScopedByPeriod;

class Criterion extends Model
{
    use ScopedByPeriod;

    protected $guarded = [];

    public function assessmentPeriod()
    {
        return $this->belongsTo(AssessmentPeriod::class);
    }

    public function subscales()
    {
        return $this->hasMany(CriterionSubscale::class);
    }

    public function weights()
    {
        return $this->hasMany(CriterionWeight::class);
    }
}
