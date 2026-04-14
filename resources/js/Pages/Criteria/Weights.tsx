import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

export default function Weights({ weights }: any) {
    return (
        <AuthenticatedLayout header={<h2 className="text-xl font-semibold leading-tight text-gray-800">Bobot Kriteria (BWM)</h2>}>
            <Head title="Bobot Kriteria" />
            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b">
                                    <th className="py-3 px-4">Kriteria</th>
                                    <th className="py-3 px-4">Bobot (Final Value)</th>
                                    <th className="py-3 px-4">Metode</th>
                                </tr>
                            </thead>
                            <tbody>
                                {weights.map((w: any) => (
                                    <tr key={w.id} className="border-b">
                                        <td className="py-3 px-4 font-bold">{w.criterion.code} - {w.criterion.name}</td>
                                        <td className="py-3 px-4">{w.weight_value}</td>
                                        <td className="py-3 px-4">{w.source_method}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
