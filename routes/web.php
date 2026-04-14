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

    // Participants
    Route::get('participants/template', [ParticipantExcelController::class, 'template'])->name('participants.template');
    Route::post('participants/import', [ParticipantExcelController::class, 'import'])->name('participants.import');
    Route::resource('participants', ParticipantController::class);

    // Criteria & Weights
    Route::get('criteria', [CriteriaController::class, 'index'])->name('criteria.index');
    Route::get('criteria/weights', [CriteriaController::class, 'weights'])->name('criteria.weights');

    // Calculations
    Route::get('calculations/edas', [CalculationController::class, 'edas'])->name('calculations.edas');
    Route::post('calculations/edas', [CalculationController::class, 'processEdas'])->name('calculations.process-edas');
    
    Route::get('calculations/copeland', [CalculationController::class, 'copeland'])->name('calculations.copeland');
    Route::post('calculations/copeland', [CalculationController::class, 'processCopeland'])->name('calculations.process-copeland');

    // Rankings
    Route::get('rankings', [RankingController::class, 'index'])->name('rankings.index');

    // Assessment Periods
    Route::post('periods/switch', [AssessmentPeriodController::class, 'switch'])->name('periods.switch');
    Route::resource('periods', AssessmentPeriodController::class);
});

require __DIR__.'/auth.php';
