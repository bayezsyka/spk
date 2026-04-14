<?php

namespace App\Http\Controllers;

use App\Models\Criterion;
use App\Models\CriterionWeight;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CriteriaController extends Controller
{
    public function index()
    {
        $criteria = Criterion::orderBy('code')->get();
        return Inertia::render('Criteria/Index', [
            'criteria' => $criteria,
        ]);
    }

    public function weights()
    {
        $weights = CriterionWeight::with('criterion')->get();
        return Inertia::render('Criteria/Weights', [
            'weights' => $weights,
        ]);
    }
}
