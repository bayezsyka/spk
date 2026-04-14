<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CalculationRun extends Model
{
    protected $guarded = [];

    public function results()
    {
        return $this->hasMany(CalculationResult::class);
    }
}
