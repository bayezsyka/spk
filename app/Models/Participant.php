<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

use App\Traits\ScopedByPeriod;

class Participant extends Model
{
    use ScopedByPeriod;

    protected $guarded = [];

    public function assessmentPeriod()
    {
        return $this->belongsTo(AssessmentPeriod::class);
    }

    public function scores()
    {
        return $this->hasMany(ParticipantScore::class);
    }
}
