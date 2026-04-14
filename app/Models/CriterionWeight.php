<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CriterionWeight extends Model
{
    protected $guarded = [];

    public function criterion()
    {
        return $this->belongsTo(Criterion::class);
    }
}
