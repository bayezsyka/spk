<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class CriteriaSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $criteriaData = [
            ['code' => 'C1', 'name' => 'Pre Test', 'attribute_type' => 'benefit', 'input_type' => 'numeric'],
            ['code' => 'C2', 'name' => 'Wawancara', 'attribute_type' => 'benefit', 'input_type' => 'categorical'],
            ['code' => 'C3', 'name' => 'Nilai Raport', 'attribute_type' => 'benefit', 'input_type' => 'numeric'],
            ['code' => 'C4', 'name' => 'Domisili', 'attribute_type' => 'cost', 'input_type' => 'numeric'],
            ['code' => 'C5', 'name' => 'Kesiapan Kerja', 'attribute_type' => 'benefit', 'input_type' => 'categorical'],
        ];

        $weights = ['C1' => 0.20, 'C2' => 0.25, 'C3' => 0.20, 'C4' => 0.15, 'C5' => 0.20];

        foreach ($criteriaData as $c) {
            $criterion = \App\Models\Criterion::create($c);
            
            \App\Models\CriterionWeight::create([
                'criterion_id' => $criterion->id,
                'weight_value' => $weights[$c['code']],
                'source_method' => 'BWM',
            ]);

            if ($c['code'] === 'C2') {
                $subscales = [
                    ['label' => 'Kurang Motivasi', 'numeric_value' => 1, 'order_no' => 1],
                    ['label' => 'Kurang Komunikatif', 'numeric_value' => 2, 'order_no' => 2],
                    ['label' => 'Cukup Komunikatif', 'numeric_value' => 3, 'order_no' => 3],
                    ['label' => 'Komunikatif', 'numeric_value' => 4, 'order_no' => 4],
                    ['label' => 'Sangat Komunikatif', 'numeric_value' => 5, 'order_no' => 5],
                ];
                $criterion->subscales()->createMany($subscales);
            }

            if ($c['code'] === 'C5') {
                $subscales = [
                    ['label' => 'Kurang Siap', 'numeric_value' => 1, 'order_no' => 1],
                    ['label' => 'Cukup Siap', 'numeric_value' => 2, 'order_no' => 2],
                    ['label' => 'Siap', 'numeric_value' => 3, 'order_no' => 3],
                    ['label' => 'Sangat Siap', 'numeric_value' => 4, 'order_no' => 4],
                ];
                $criterion->subscales()->createMany($subscales);
            }
        }
    }
}
