<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class AssessmentPeriodController extends Controller
{
    public function switch(Request $request)
    {
        $request->validate([
            'period_id' => 'required|exists:assessment_periods,id'
        ]);

        session(['active_period_id' => $request->period_id]);

        return back()->with('success', 'Periode aktif berhasil diubah.');
    }

    public function index()
    {
        $periods = \App\Models\AssessmentPeriod::latest()->get();
        return \Inertia\Inertia::render('Periods/Index', [
            'periods' => $periods
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date',
            'is_active' => 'boolean',
        ]);

        if ($validated['is_active'] ?? false) {
            \App\Models\AssessmentPeriod::where('is_active', true)->update(['is_active' => false]);
        }

        $period = \App\Models\AssessmentPeriod::create($validated);
        
        // Auto select if it's the only one
        if (\App\Models\AssessmentPeriod::count() === 1) {
            session(['active_period_id' => $period->id]);
        }

        return redirect()->route('periods.index')->with('success', 'Periode berhasil dibuat.');
    }
}
