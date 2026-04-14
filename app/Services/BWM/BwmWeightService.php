<?php

namespace App\Services\BWM;

class BwmWeightService
{
    /**
     * Calculate and return the final theoretical weights based on BWM.
     * Currently returns dummy weights.
     * 
     * @return array
     */
    public function getFinalWeights(): array
    {
        // TODO: Implement actual BWM logic in the future here
        
        // Return dummy weights for 'Pre Test', 'Wawancara', 'Nilai Raport', 'Domisili', 'Kesiapan Kerja' (Total ~1.0)
        return [
            'C1' => 0.20,
            'C2' => 0.25,
            'C3' => 0.20,
            'C4' => 0.15,
            'C5' => 0.20,
        ];
    }
}
