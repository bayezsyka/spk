<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        User::factory()->create([
            'name' => 'Admin Test',
            'email' => 'admin@example.com',
        ]);

        $period = \App\Models\AssessmentPeriod::create([
            'name' => 'Rekrutmen Gelombang 1',
            'description' => 'Sesi penilaian untuk rekrutmen gelombang pertama tahun 2026.',
            'is_active' => true,
            'start_date' => now(),
            'end_date' => now()->addMonths(3),
        ]);

        $this->call([
            CriteriaSeeder::class,
        ]);

        // Link criteria to period
        \App\Models\Criterion::query()->update(['assessment_period_id' => $period->id]);

        for ($i = 1; $i <= 5; $i++) {
            $participant = \App\Models\Participant::create([
                'assessment_period_id' => $period->id,
                'full_name' => 'Alternatif ' . $i,
                'pre_test_score' => rand(50, 95),
                'interview_grade' => ['Kurang Motivasi', 'Kurang Komunikatif', 'Cukup Komunikatif', 'Komunikatif', 'Sangat Komunikatif'][rand(0, 4)],
                'report_score' => rand(70, 95),
                'domicile_distance_km' => rand(1, 30),
                'work_readiness_grade' => ['Kurang Siap', 'Cukup Siap', 'Siap', 'Sangat Siap'][rand(0, 3)],
                'notes' => 'Catatan dummy ' . $i,
            ]);

            // Create placeholder scores
            foreach (\App\Models\Criterion::where('assessment_period_id', $period->id)->get() as $criterion) {
                \App\Models\ParticipantScore::create([
                    'participant_id' => $participant->id,
                    'criterion_id' => $criterion->id,
                    'raw_value' => rand(50, 100), // dummy numeric representation for now
                ]);
            }
        }
    }
}
