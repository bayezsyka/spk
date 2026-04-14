<?php

namespace App\Http\Controllers\Pipeline;

use App\Http\Controllers\Controller;
use App\Models\AssessmentPeriod;
use App\Models\Criterion;
use App\Models\CriterionSubscale;
use Illuminate\Http\Request;

class SetupStepController extends Controller
{
    /**
     * Store a new criterion for the given assessment period.
     */
    public function storeCriteria(Request $request, AssessmentPeriod $period)
    {
        $validated = $request->validate([
            'code' => 'required|string|max:10',
            'name' => 'required|string|max:255',
            'attribute_type' => 'required|in:benefit,cost',
            'input_type' => 'required|in:numeric,categorical',
            'description' => 'nullable|string',
            'subscales' => 'nullable|array',
            'subscales.*.label' => 'required_with:subscales|string',
            'subscales.*.numeric_value' => 'required_with:subscales|numeric',
        ]);

        // Check unique code within this period
        $exists = Criterion::where('assessment_period_id', $period->id)
            ->where('code', $validated['code'])
            ->exists();

        if ($exists) {
            return back()->withErrors(['code' => 'Kode kriteria sudah digunakan di periode ini.']);
        }

        $maxOrder = Criterion::where('assessment_period_id', $period->id)->max('sort_order') ?? 0;

        $criterion = Criterion::create([
            'assessment_period_id' => $period->id,
            'code' => $validated['code'],
            'name' => $validated['name'],
            'attribute_type' => $validated['attribute_type'],
            'input_type' => $validated['input_type'],
            'description' => $validated['description'] ?? null,
            'sort_order' => $maxOrder + 1,
        ]);

        // Create subscales if input is categorical
        if (!empty($validated['subscales'])) {
            foreach ($validated['subscales'] as $index => $subscale) {
                CriterionSubscale::create([
                    'criterion_id' => $criterion->id,
                    'label' => $subscale['label'],
                    'numeric_value' => $subscale['numeric_value'],
                    'order_no' => $index + 1,
                ]);
            }
        }

        return back()->with('success', "Kriteria '{$criterion->name}' berhasil ditambahkan.");
    }

    /**
     * Update an existing criterion.
     */
    public function updateCriteria(Request $request, AssessmentPeriod $period, Criterion $criterion)
    {
        $validated = $request->validate([
            'code' => 'required|string|max:10',
            'name' => 'required|string|max:255',
            'attribute_type' => 'required|in:benefit,cost',
            'input_type' => 'required|in:numeric,categorical',
            'description' => 'nullable|string',
        ]);

        // Check unique code within this period (excluding self)
        $exists = Criterion::where('assessment_period_id', $period->id)
            ->where('code', $validated['code'])
            ->where('id', '!=', $criterion->id)
            ->exists();

        if ($exists) {
            return back()->withErrors(['code' => 'Kode kriteria sudah digunakan di periode ini.']);
        }

        $criterion->update($validated);

        return back()->with('success', "Kriteria '{$criterion->name}' berhasil diperbarui.");
    }

    /**
     * Delete a criterion.
     */
    public function destroyCriteria(AssessmentPeriod $period, Criterion $criterion)
    {
        $name = $criterion->name;
        $criterion->delete();

        return back()->with('success', "Kriteria '{$name}' berhasil dihapus.");
    }

    /**
     * Mark Step 1 (Setup) as complete and advance pipeline.
     */
    public function complete(AssessmentPeriod $period)
    {
        $criteriaCount = Criterion::where('assessment_period_id', $period->id)->count();

        if ($criteriaCount < 2) {
            return back()->with('error', 'Minimal 2 kriteria diperlukan untuk melanjutkan.');
        }

        $period->markStepCompleted(1);

        return back()->with('success', 'Konfigurasi selesai. Lanjut ke input peserta & nilai.');
    }
}
