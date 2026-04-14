<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ParticipantController;
use App\Http\Controllers\CriteriaController;
use App\Http\Controllers\CalculationController;
use App\Http\Controllers\RankingController;
use App\Http\Controllers\AssessmentPeriodController;
use App\Http\Controllers\ParticipantExcelController;
use App\Http\Controllers\Pipeline\PipelineController;
use App\Http\Controllers\Pipeline\SetupStepController;
use App\Http\Controllers\Pipeline\ScoringStepController;
use App\Http\Controllers\Pipeline\BwmStepController;
use App\Http\Controllers\Pipeline\EdasStepController;
use App\Http\Controllers\Pipeline\CopelandStepController;
use App\Http\Controllers\Pipeline\ResultStepController;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', [DashboardController::class, 'index'])->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // ── Assessment Periods ──────────────────────────
    Route::post('periods/switch', [AssessmentPeriodController::class, 'switch'])->name('periods.switch');
    Route::resource('periods', AssessmentPeriodController::class);

    // ── Pipeline Routes (Core SPK Flow) ─────────────
    Route::prefix('pipeline/{period}')->name('pipeline.')->group(function () {
        // Main wizard view (single page, step rendered by React)
        Route::get('/', [PipelineController::class, 'index'])->name('index');

        // Step 1: Setup — Criteria CRUD
        Route::post('/setup/criteria', [SetupStepController::class, 'storeCriteria'])->name('setup.criteria.store');
        Route::put('/setup/criteria/{criterion}', [SetupStepController::class, 'updateCriteria'])->name('setup.criteria.update');
        Route::delete('/setup/criteria/{criterion}', [SetupStepController::class, 'destroyCriteria'])->name('setup.criteria.destroy');
        Route::post('/setup/complete', [SetupStepController::class, 'complete'])->name('setup.complete');

        // Step 2: Scoring
        Route::post('/scoring/save', [ScoringStepController::class, 'saveScores'])->name('scoring.save');
        Route::post('/scoring/auto-populate', [ScoringStepController::class, 'autoPopulate'])->name('scoring.autoPopulate');
        Route::post('/scoring/complete', [ScoringStepController::class, 'complete'])->name('scoring.complete');

        // Step 3: BWM (with step guard)
        Route::post('/bwm/process', [BwmStepController::class, 'process'])
            ->middleware('pipeline.step:3')
            ->name('bwm.process');

        // Step 4: EDAS (with step guard)
        Route::post('/edas/process', [EdasStepController::class, 'process'])
            ->middleware('pipeline.step:4')
            ->name('edas.process');

        // Step 5: Copeland (with step guard)
        Route::post('/copeland/process', [CopelandStepController::class, 'process'])
            ->middleware('pipeline.step:5')
            ->name('copeland.process');

        // Step 6: Result
        Route::get('/result', [ResultStepController::class, 'show'])
            ->name('result');
    });

    // ── Participants (standalone CRUD — still useful) ──
    Route::get('participants/template', [ParticipantExcelController::class, 'template'])->name('participants.template');
    Route::post('participants/import', [ParticipantExcelController::class, 'import'])->name('participants.import');
    Route::resource('participants', ParticipantController::class);

    // ── Criteria & Weights (read-only views) ────────
    Route::get('criteria', [CriteriaController::class, 'index'])->name('criteria.index');
    Route::get('criteria/weights', [CriteriaController::class, 'weights'])->name('criteria.weights');

    // ── Legacy Calculation Routes (kept for backward compat) ──
    Route::get('calculations/edas', [CalculationController::class, 'edas'])->name('calculations.edas');
    Route::post('calculations/edas', [CalculationController::class, 'processEdas'])->name('calculations.process-edas');
    Route::get('calculations/copeland', [CalculationController::class, 'copeland'])->name('calculations.copeland');
    Route::post('calculations/copeland', [CalculationController::class, 'processCopeland'])->name('calculations.process-copeland');

    // ── Rankings ────────────────────────────────────
    Route::get('rankings', [RankingController::class, 'index'])->name('rankings.index');
});

require __DIR__.'/auth.php';
