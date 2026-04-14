<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $activePeriod = \App\Models\AssessmentPeriod::find(session('active_period_id'));

        return [
            ...parent::share($request),
            'auth' => [
                'user' => $request->user(),
            ],
            'flash' => [
                'success' => fn () => $request->session()->get('success'),
                'error' => fn () => $request->session()->get('error'),
            ],
            'assessment_periods' => \App\Models\AssessmentPeriod::latest()->get(),
            'active_period_id' => session('active_period_id'),
            'active_period' => $activePeriod,
            // Pipeline context for dynamic navigation
            'pipeline_state' => $activePeriod ? [
                'current_step' => $activePeriod->current_step,
                'status' => $activePeriod->pipeline_status,
                'status_label' => $activePeriod->pipeline_status_label,
                'can_access' => $activePeriod->getPipelineAccessMap(),
            ] : null,
        ];
    }
}
