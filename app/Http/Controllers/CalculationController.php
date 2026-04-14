<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Participant;
use App\Models\CalculationRun;
use App\Models\CalculationResult;
use App\Services\BWM\BwmWeightService;
use App\Services\EDAS\EdasCalculationService;
use App\Services\Copeland\CopelandScoreService;

class CalculationController extends Controller
{
    public function edas()
    {
        return Inertia::render('Calculations/EDAS');
    }

    public function processEdas(BwmWeightService $bwmService, EdasCalculationService $edasService)
    {
        $participants = Participant::all()->toArray();
        $weights = $bwmService->getFinalWeights();
        
        $edasResults = $edasService->calculate($participants, $weights);

        // Normally we'd store these results temporarily or into $request->session() 
        // For foundation, we just return back with placeholder success
        return redirect()->back()->with('success', 'Proses EDAS berhasil dijalankan. Siap untuk proses Copeland.');
    }

    public function copeland()
    {
        return Inertia::render('Calculations/Copeland');
    }

    public function processCopeland(BwmWeightService $bwmService, EdasCalculationService $edasService, CopelandScoreService $copelandService)
    {
        // For dummy purpose, run EDAS first then Copeland
        $participants = Participant::all()->toArray();
        $weights = $bwmService->getFinalWeights();
        $edasResults = $edasService->calculate($participants, $weights);
        
        $finalResults = $copelandService->rank($edasResults);

        $run = CalculationRun::create([
            'run_code' => 'RUN-' . time(),
            'method_stage' => 'COMPLETED',
            'description' => 'Dummy combined calculation run',
            'executed_at' => now(),
        ]);

        foreach ($finalResults as $result) {
            CalculationResult::create([
                'calculation_run_id' => $run->id,
                'participant_id' => $result['participant_id'],
                'edas_score' => $result['edas_score'],
                'copeland_score' => $result['copeland_score'],
                'final_rank' => $result['final_rank'],
            ]);
        }

        return redirect()->route('rankings.index')->with('success', 'Proses Copeland Score selesai dan perankingan berhasil disimpan.');
    }
}
