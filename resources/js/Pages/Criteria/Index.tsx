import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function Index({ criteria }: any) {
    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">Daftar Kriteria</h2>
                </div>
            }
        >
            <Head title="Kriteria" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8 space-y-6">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b">
                                        <th className="py-3 px-4">Kode</th>
                                        <th className="py-3 px-4">Nama Kriteria</th>
                                        <th className="py-3 px-4">Sifat (Bobot)</th>
                                        <th className="py-3 px-4">Tipe Input</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {criteria.map((c: any) => (
                                        <tr key={c.id} className="border-b hover:bg-gray-50">
                                            <td className="py-3 px-4 font-bold">{c.code}</td>
                                            <td className="py-3 px-4">{c.name}</td>
                                            <td className="py-3 px-4 uppercase text-xs">
                                                <span className={`px-2 py-1 rounded bg-${c.attribute_type === 'benefit' ? 'green' : 'red'}-100 text-${c.attribute_type === 'benefit' ? 'green' : 'red'}-800`}>
                                                    {c.attribute_type}
                                                </span>
                                            </td>
                                            <td className="py-3 px-4 uppercase text-xs">{c.input_type}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
