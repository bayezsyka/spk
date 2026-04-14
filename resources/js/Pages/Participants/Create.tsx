import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import PrimaryButton from '@/Components/PrimaryButton';

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        full_name: '',
        pre_test_score: '',
        report_score: '',
        domicile_distance_km: '',
        interview_grade: '',
        work_readiness_grade: '',
        notes: ''
    });

    const submit = (e: any) => {
        e.preventDefault();
        post(route('participants.store'));
    };

    return (
        <AuthenticatedLayout header={<h2 className="text-xl font-semibold leading-tight text-gray-800">Tambah Peserta</h2>}>
            <Head title="Tambah Peserta" />

            <div className="py-12">
                <div className="mx-auto max-w-2xl sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                        <form onSubmit={submit} className="space-y-4">
                            <div>
                                <InputLabel htmlFor="full_name" value="Nama Lengkap" />
                                <TextInput id="full_name" type="text" className="mt-1 block w-full" value={data.full_name} onChange={(e) => setData('full_name', e.target.value)} required />
                                <InputError message={errors.full_name} className="mt-2" />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <InputLabel htmlFor="pre_test_score" value="Nilai Pre Test (0-100)" />
                                    <TextInput id="pre_test_score" type="number" className="mt-1 block w-full" value={data.pre_test_score} onChange={(e) => setData('pre_test_score', e.target.value)} required />
                                    <InputError message={errors.pre_test_score} className="mt-2" />
                                </div>
                                <div>
                                    <InputLabel htmlFor="report_score" value="Nilai Raport (0-100)" />
                                    <TextInput id="report_score" type="number" className="mt-1 block w-full" value={data.report_score} onChange={(e) => setData('report_score', e.target.value)} required />
                                    <InputError message={errors.report_score} className="mt-2" />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <InputLabel htmlFor="domicile_distance_km" value="Jarak Domisili (km)" />
                                    <TextInput id="domicile_distance_km" type="number" className="mt-1 block w-full" value={data.domicile_distance_km} onChange={(e) => setData('domicile_distance_km', e.target.value)} required />
                                    <InputError message={errors.domicile_distance_km} className="mt-2" />
                                </div>
                                <div>
                                    <InputLabel htmlFor="interview_grade" value="Nilai Wawancara" />
                                    <select id="interview_grade" className="border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm mt-1 block w-full" value={data.interview_grade} onChange={(e) => setData('interview_grade', e.target.value)} required>
                                        <option value="">-- Pilih --</option>
                                        <option value="Kurang Motivasi">Kurang Motivasi</option>
                                        <option value="Kurang Komunikatif">Kurang Komunikatif</option>
                                        <option value="Cukup Komunikatif">Cukup Komunikatif</option>
                                        <option value="Komunikatif">Komunikatif</option>
                                        <option value="Sangat Komunikatif">Sangat Komunikatif</option>
                                    </select>
                                    <InputError message={errors.interview_grade} className="mt-2" />
                                </div>
                            </div>

                            <div>
                                <InputLabel htmlFor="work_readiness_grade" value="Kesiapan Kerja" />
                                <select id="work_readiness_grade" className="border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm mt-1 block w-full" value={data.work_readiness_grade} onChange={(e) => setData('work_readiness_grade', e.target.value)} required>
                                    <option value="">-- Pilih --</option>
                                    <option value="Kurang Siap">Kurang Siap</option>
                                    <option value="Cukup Siap">Cukup Siap</option>
                                    <option value="Siap">Siap</option>
                                    <option value="Sangat Siap">Sangat Siap</option>
                                </select>
                                <InputError message={errors.work_readiness_grade} className="mt-2" />
                            </div>

                            <div className="flex items-center justify-end mt-4 space-x-4">
                                <Link href={route('participants.index')} className="text-gray-600 hover:underline">Batal</Link>
                                <PrimaryButton disabled={processing}>Simpan</PrimaryButton>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
