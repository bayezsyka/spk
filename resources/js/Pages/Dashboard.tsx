import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function Dashboard({ totalParticipants, totalActiveCriteria }: any) {
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Dashboard
                </h2>
            }
        >
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg p-6">
                            <h3 className="text-lg font-medium text-gray-900">Total Peserta</h3>
                            <p className="mt-2 text-3xl font-bold text-indigo-600">{totalParticipants}</p>
                            <div className="mt-4">
                                <Link href={route('participants.index')} className="text-sm text-indigo-600 hover:underline">Kelola Peserta &rarr;</Link>
                            </div>
                        </div>

                        <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg p-6">
                            <h3 className="text-lg font-medium text-gray-900">Kriteria Aktif</h3>
                            <p className="mt-2 text-3xl font-bold text-emerald-600">{totalActiveCriteria}</p>
                            <div className="mt-4">
                                <Link href={route('criteria.index')} className="text-sm text-indigo-600 hover:underline">Lihat Kriteria &rarr;</Link>
                            </div>
                        </div>

                        <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg p-6 flex flex-col justify-center">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Proses SPK</h3>
                            <div className="space-y-2">
                                <Link href={route('calculations.edas')} className="block w-full text-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition">Proses EDAS</Link>
                                <Link href={route('calculations.copeland')} className="block w-full text-center px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition">Proses Copeland</Link>
                                <Link href={route('rankings.index')} className="block w-full text-center px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition">Lihat Ranking</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
