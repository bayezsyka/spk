<?php

namespace App\Http\Controllers;

use App\Models\Participant;
use Illuminate\Http\Request;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;
use PhpOffice\PhpSpreadsheet\IOFactory;
use Illuminate\Support\Facades\DB;

class ParticipantExcelController extends Controller
{
    public function template()
    {
        $spreadsheet = new Spreadsheet();
        $activeSheet = $spreadsheet->getActiveSheet();
        
        // Define Headers
        $headers = [
            'No', 
            'Nama Lengkap', 
            'Pre Test (Nilai 0-100)', 
            'Wawancara (Kualitatif)', 
            'Nilai Raport (Nilai 0-100)', 
            'Domisili (Jarak km)', 
            'Kesiapan Kerja'
        ];

        foreach ($headers as $index => $header) {
            $colLetter = \PhpOffice\PhpSpreadsheet\Cell\Coordinate::stringFromColumnIndex($index + 1);
            $activeSheet->setCellValue($colLetter . '1', $header);
            // Auto size columns
            $activeSheet->getColumnDimension($colLetter)->setAutoSize(true);
        }

        // Add some sample row style (border)
        $activeSheet->getStyle('A1:G1')->getFont()->setBold(true);

        $writer = new Xlsx($spreadsheet);
        
        header('Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        header('Content-Disposition: attachment;filename="template_peserta.xlsx"');
        header('Cache-Control: max-age=0');
        
        $writer->save('php://output');
        exit;
    }

    public function import(Request $request)
    {
        $request->validate([
            'file' => 'required|mimes:xlsx,xls'
        ]);

        $activePeriodId = session('active_period_id');

        if (!$activePeriodId) {
            return back()->with('error', 'Silakan pilih periode aktif terlebih dahulu.');
        }

        $file = $request->file('file');
        $spreadsheet = IOFactory::load($file->getRealPath());
        $sheet = $spreadsheet->getActiveSheet();
        $rows = $sheet->toArray();

        // Skip header
        array_shift($rows);

        DB::beginTransaction();
        try {
            foreach ($rows as $row) {
                // skip if name is empty
                if (empty($row[1])) continue;

                Participant::create([
                    'full_name' => $row[1],
                    'pre_test_score' => $row[2] ?? 0,
                    'interview_grade' => $row[3],
                    'report_score' => $row[4] ?? 0,
                    'domicile_distance_km' => $row[5] ?? 0,
                    'work_readiness_grade' => $row[6],
                    'assessment_period_id' => $activePeriodId,
                    'is_active' => true
                ]);
            }
            DB::commit();
            return back()->with('success', 'Data peserta berhasil diimport.');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('error', 'Gagal mengimport data: ' . $e->getMessage());
        }
    }
}
