import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';

export default function Index({ participants, filters }: any) {
    const { data, links } = participants;

    const handleDelete = (id: number) => {
        if (confirm('Apakah Anda yakin ingin menghapus peserta ini?')) {
            router.delete(route('participants.destroy', id));
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">Daftar Peserta</h2>
                    <Link href={route('participants.create')} className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">Tambah Peserta</Link>
                </div>
            }
        >
            <Head title="Daftar Peserta" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b">
                                        <th className="py-3 px-4">Nama Lengkap</th>
                                        <th className="py-3 px-4">Nilai Pre-Test</th>
                                        <th className="py-3 px-4">Wawancara</th>
                                        <th className="py-3 px-4">Domisili (km)</th>
                                        <th className="py-3 px-4 text-center">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.length === 0 ? (
                                        <tr>
                                            <td colSpan={5} className="py-6 text-center text-gray-500">Belum ada data peserta.</td>
                                        </tr>
                                    ) : data.map((p: any) => (
                                        <tr key={p.id} className="border-b hover:bg-gray-50">
                                            <td className="py-3 px-4">{p.full_name}</td>
                                            <td className="py-3 px-4">{p.pre_test_score}</td>
                                            <td className="py-3 px-4">{p.interview_grade}</td>
                                            <td className="py-3 px-4">{p.domicile_distance_km}</td>
                                            <td className="py-3 px-4 text-center space-x-2">
                                                <Link href={route('participants.edit', p.id)} className="text-blue-600 hover:underline">Edit</Link>
                                                <button onClick={() => handleDelete(p.id)} className="text-red-600 hover:underline">Hapus</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {/* Simple pagination */}
                            <div className="mt-4 flex space-x-2">
                                {links.map((link: any, i: number) => (
                                    <Link key={i} href={link.url || '#'} className={`px-3 py-1 border rounded ${link.active ? 'bg-indigo-50 text-indigo-600' : 'text-gray-600'} ${!link.url && 'opacity-50 cursor-not-allowed'}`} dangerouslySetInnerHTML={{ __html: link.label }} />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
