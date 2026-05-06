<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\AssessmentPeriod;
use App\Models\Participant;
use App\Models\Criterion;
use App\Models\ParticipantScore;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Create Default Admin
        User::updateOrCreate(
            ['email' => 'admin@example.com'],
            [
                'name' => 'Admin Test',
                'password' => bcrypt('password'),
            ]
        );

        // 2. Create Initial Assessment Period
        $period = AssessmentPeriod::create([
            'name' => 'Rekrutmen Gelombang 1',
            'description' => 'Sesi penilaian untuk rekrutmen gelombang pertama tahun 2026.',
            'is_active' => true,
            'start_date' => now(),
            'end_date' => now()->addMonths(3),
            'current_step' => 1,
            'pipeline_status' => 'setup',
        ]);

        // 3. Populate with Template Criteria
        $period->createDefaultCriteria();

        // 4. Create Dummy Participants
        for ($i = 1; $i <= 5; $i++) {
            $participant = Participant::create([
                'assessment_period_id' => $period->id,
                'full_name' => 'Kandidat ' . $i,
                'pre_test_score' => rand(50, 95),
                'interview_grade' => ['Kurang Motivasi', 'Kurang Komunikatif', 'Cukup Komunikatif', 'Komunikatif', 'Sangat Komunikatif'][rand(0, 4)],
                'report_score' => rand(70, 95),
                'domicile_distance_km' => rand(1, 30),
                'work_readiness_grade' => ['Kurang Siap', 'Cukup Siap', 'Siap', 'Sangat Siap'][rand(0, 3)],
                'notes' => 'Catatan dummy untuk kandidat ' . $i,
            ]);

            // Note: Scopes might filter criteria out if not careful, 
            // but since we just created them in the same process it should be fine.
            $criteria = Criterion::where('assessment_period_id', $period->id)->get();
            
            foreach ($criteria as $criterion) {
                // Generate a dummy numeric value that fits the input type
                $val = 0;
                if ($criterion->input_type === 'numeric') {
                    $val = rand(60, 100);
                } else {
                    // Get a random subscale numeric value
                    $sub = $criterion->subscales()->inRandomOrder()->first();
                    $val = $sub ? $sub->numeric_value : 0;
                }

                ParticipantScore::create([
                    'participant_id' => $participant->id,
                    'criterion_id' => $criterion->id,
                    'raw_value' => $val,
                ]);
            }
        }
        
        $this->command->info("Database seeded successfully with a default period, template criteria, and dummy participants.");
    }
}
