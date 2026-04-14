import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage } from '@inertiajs/react';

export default function Index({ results, latestRun }: any) {
    const { flash } = usePage<any>().props;

    return (
        <AuthenticatedLayout header={<h2 className="text-xl font-semibold leading-tight text-gray-800">Ranking Akhir</h2>}>
            <Head title="Ranking Akhir" />
            <div className="py-12">
                <div className="mx-auto max-w-5xl sm:px-6 lg:px-8 space-y-6">
                    {flash?.success && (
                        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative">
                            {flash.success}
                        </div>
                    )}
                    
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        {latestRun ? (
                            <div className="p-6">
                                <div className="mb-4 flex flex-col">
                                    <span className="text-sm text-gray-500">Run Code: {latestRun.run_code}</span>
                                    <span className="text-sm text-gray-500">Dieksekusi: {new Date(latestRun.executed_at).toLocaleString()}</span>
                                </div>
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="border-b bg-gray-50">
                                            <th className="py-3 px-4 text-center w-20">Rank</th>
                                            <th className="py-3 px-4">Nama Peserta</th>
                                            <th className="py-3 px-4 text-right">EDAS Score</th>
                                            <th className="py-3 px-4 text-right">Copeland Score</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {results.map((r: any) => (
                                            <tr key={r.id} className="border-b hover:bg-gray-50">
                                                <td className="py-3 px-4 text-center font-bold text-indigo-600 text-xl">{r.final_rank}</td>
                                                <td className="py-3 px-4 font-medium">{r.participant?.full_name}</td>
                                                <td className="py-3 px-4 text-right text-gray-600">{r.edas_score != null ? Number(r.edas_score).toFixed(4) : '-'}</td>
                                                <td className="py-3 px-4 text-right text-gray-600">{r.copeland_score != null ? Number(r.copeland_score).toFixed(4) : '-'}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="p-12 text-center text-gray-500">
                                <p className="mb-4">Belum ada perhitungan yang dilakukan.</p>
                                <a href={route('calculations.edas')} className="text-indigo-600 hover:underline">Mulai Kalkulasi Baru</a>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
