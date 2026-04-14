<?php

namespace App\Http\Controllers;

use App\Models\Participant;
use App\Models\Criterion;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        return Inertia::render('Dashboard', [
            'totalParticipants' => Participant::forActivePeriod()->count(),
            'totalActiveCriteria' => Criterion::forActivePeriod()->where('is_active', true)->count(),
        ]);
    }
}
