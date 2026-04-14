import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm, usePage } from '@inertiajs/react';

export default function EDAS() {
    const { post, processing } = useForm();
    const { flash } = usePage<any>().props;

    const processEdas = () => {
        post(route('calculations.process-edas'));
    };

    return (
        <AuthenticatedLayout header={<h2 className="text-xl font-semibold leading-tight text-gray-800">Kalkulasi EDAS</h2>}>
            <Head title="Kalkulasi EDAS" />
            <div className="py-12">
                <div className="mx-auto max-w-3xl sm:px-6 lg:px-8 space-y-6">
                    {flash?.success && (
                        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative">
                            {flash.success}
                        </div>
                    )}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6 flex flex-col items-center">
                        <p className="text-gray-600 mb-6 text-center">
                            Proses EDAS (Evaluation based on Distance from Average Solution) akan menggunakan matriks keputusan dari data peserta dan bobot BWM untuk menghasilkan nilai Appraisal Score (AS).
                        </p>
                        <button 
                            onClick={processEdas} 
                            disabled={processing}
                            className="px-6 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
                        >
                            {processing ? 'Memproses...' : 'Proses EDAS Sekarang'}
                        </button>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
