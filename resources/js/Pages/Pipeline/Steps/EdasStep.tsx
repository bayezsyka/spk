import { useForm } from '@inertiajs/react';
import ProcessButton from '@/Components/Pipeline/ProcessButton';
import HeatmapMatrix from '@/Components/Pipeline/HeatmapMatrix';
import PipelineActionBar from '@/Components/Pipeline/PipelineActionBar';

interface Props {
    period: any;
    stepData: any;
    pipelineState: any;
    completedRuns: any;
    onNavigateStep: (step: number) => void;
}

export default function EdasStep({ period, stepData, onNavigateStep }: Props) {
    const edasPayload = stepData.edas?.runPayload;
    const hasResult = !!edasPayload;

    const { post, processing } = useForm();

    const handleProcess = () => {
        post(route('pipeline.edas.process', period.route_key));
    };

    const criteriaHeaders = edasPayload?.criteria_codes || [];
    const pdaRows = (edasPayload?.pda_matrix || []).map((row: any) => ({
        label: row.participant_name,
        values: criteriaHeaders.map((code: string) => row[code] || 0),
    }));
    const ndaRows = (edasPayload?.nda_matrix || []).map((row: any) => ({
        label: row.participant_name,
        values: criteriaHeaders.map((code: string) => row[code] || 0),
    }));

    return (
        <div className="space-y-5">
            <PipelineActionBar
                title="Kalkulasi EDAS"
                subtitle="Langkah 3: Penghitungan Solusi Rata-rata, PDA, dan NDA"
                onBack={() => onNavigateStep(2)}
                actions={
                    !hasResult ? (
                        <ProcessButton
                            processing={processing}
                            onClick={handleProcess}
                            label="Jalankan EDAS"
                            loadingLabel="Menghitung..."
                        />
                    ) : (
                        <div className="flex items-center gap-2">
                            <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded hidden sm:inline">EDAS SELESAI</span>
                            <button
                                onClick={() => onNavigateStep(4)}
                                className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white text-sm font-bold rounded-lg hover:bg-indigo-700 transition-all shadow-md shadow-indigo-100"
                            >
                                <span>Lanjut ke Copeland</span>
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                </svg>
                            </button>
                        </div>
                    )
                }
            />

            <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
                <h3 className="text-lg font-semibold text-slate-900">Deskripsi Metode</h3>
                <p className="text-slate-500 text-sm mt-1 max-w-2xl">
                    Evaluation based on Distance from Average Solution (EDAS) menghitung deviasi positif dan negatif dari solusi rata-rata untuk menentukan peringkat peserta.
                </p>
            </div>

            {!hasResult && (
                <div className="bg-white rounded-xl border border-slate-200 p-10 shadow-sm text-center space-y-5">
                    <div className="w-16 h-16 mx-auto bg-slate-100 text-slate-400 rounded-xl flex items-center justify-center">
                        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                    </div>
                    <div>
                        <h4 className="text-base font-medium text-slate-900">Siap Menghitung EDAS</h4>
                        <p className="text-sm text-slate-500 mt-1.5 max-w-md mx-auto">
                            Proses ini akan membangun matriks keputusan, menghitung solusi rata-rata, lalu menghasilkan PDA, NDA, SP, SN, NSP, NSN, dan Appraisal Score.
                        </p>
                    </div>
                </div>
            )}

            {hasResult && (
                <div className="space-y-5">
                    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
                        <h4 className="font-medium text-slate-900 text-sm mb-3">Average Value per Kriteria</h4>
                        <div className="flex flex-wrap gap-2">
                            {Object.entries(edasPayload.average_solution || {}).map(([code, value]: any) => (
                                <div key={code} className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-center min-w-[90px]">
                                    <p className="text-[10px] font-medium text-slate-400 uppercase">{code}</p>
                                    <p className="text-sm font-semibold text-slate-800 mt-0.5">{Number(value).toFixed(4)}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <HeatmapMatrix
                        title="Matriks PDA"
                        headers={criteriaHeaders}
                        rows={pdaRows}
                        colorScale="green-red"
                    />

                    <HeatmapMatrix
                        title="Matriks NDA"
                        headers={criteriaHeaders}
                        rows={ndaRows}
                        colorScale="blue-orange"
                    />

                    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
                        <div className="px-5 py-3 border-b border-slate-100">
                            <h4 className="font-medium text-slate-900 text-sm">Ringkasan Perhitungan EDAS</h4>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead className="bg-slate-50">
                                    <tr>
                                        <th className="py-3 px-4 text-left text-xs font-medium text-slate-500">Peserta</th>
                                        <th className="py-3 px-4 text-right text-xs font-medium text-slate-500">SP</th>
                                        <th className="py-3 px-4 text-right text-xs font-medium text-slate-500">SN</th>
                                        <th className="py-3 px-4 text-right text-xs font-medium text-slate-500">NSP</th>
                                        <th className="py-3 px-4 text-right text-xs font-medium text-slate-500">NSN</th>
                                        <th className="py-3 px-4 text-right text-xs font-medium text-slate-500">Appraisal Score</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {(edasPayload.appraisal_scores || []).map((entry: any) => (
                                        <tr key={entry.participant_id} className="hover:bg-slate-50/50 transition-colors">
                                            <td className="py-3 px-4 font-medium text-slate-700">{entry.participant_name}</td>
                                            <td className="py-3 px-4 text-right font-mono text-xs text-slate-500">{Number(entry.sp).toFixed(6)}</td>
                                            <td className="py-3 px-4 text-right font-mono text-xs text-slate-500">{Number(entry.sn).toFixed(6)}</td>
                                            <td className="py-3 px-4 text-right font-mono text-xs text-slate-500">{Number(entry.nsp).toFixed(6)}</td>
                                            <td className="py-3 px-4 text-right font-mono text-xs text-slate-500">{Number(entry.nsn).toFixed(6)}</td>
                                            <td className="py-3 px-4 text-right font-mono font-semibold text-indigo-600">{Number(entry.score).toFixed(6)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="flex items-center justify-center p-4">
                         <p className="text-xs text-slate-400 italic">Hasil kalkulasi EDAS ditampilkan di atas. Gunakan navigasi di bagian atas untuk lanjut.</p>
                    </div>
                </div>
            )}
        </div>
    );
}
