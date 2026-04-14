<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Criterion extends Model
{
    protected $guarded = [];

    public function subscales()
    {
        return $this->hasMany(CriterionSubscale::class);
    }

    public function weights()
    {
        return $this->hasMany(CriterionWeight::class);
    }
}
