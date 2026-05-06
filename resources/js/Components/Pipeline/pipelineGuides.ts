export type PipelineGuidePhaseKey = 'setup' | 'scoring' | 'bwm' | 'edas' | 'copeland' | 'result';

export interface PipelineGuideContentSection {
    title: string;
    items: string[];
}

export interface PipelineGuideContent {
    summary?: string;
    sections: PipelineGuideContentSection[];
    note?: string;
}

export interface PipelineGuideEntry {
    title: string;
    content: PipelineGuideContent;
}

export const PIPELINE_GUIDES: Record<PipelineGuidePhaseKey, PipelineGuideEntry> = {
    setup: {
        title: 'Panduan Konfigurasi Kriteria',
        content: {
            summary: 'Tahap ini dipakai untuk meninjau dan menyesuaikan kriteria inti yang akan dipakai pada alur penilaian.',
            sections: [
                {
                    title: 'Yang dikerjakan di halaman ini',
                    items: [
                        'Periksa nama, deskripsi, dan format input setiap kriteria.',
                        'Sesuaikan subskala untuk kriteria kategorikal bila diperlukan.',
                        'Pastikan minimal lima kriteria inti siap dipakai sebelum lanjut.',
                    ],
                },
                {
                    title: 'Yang perlu diperhatikan',
                    items: [
                        'Kode kriteria tetap mengikuti template sistem.',
                        'Perubahan di tahap ini akan memengaruhi pengisian nilai dan perhitungan berikutnya.',
                    ],
                },
            ],
        },
    },
    scoring: {
        title: 'Panduan Pengisian Nilai',
        content: {
            summary: 'Tahap ini dipakai untuk memastikan data peserta dan nilai penilaian sudah lengkap sebelum proses perhitungan dijalankan.',
            sections: [
                {
                    title: 'Data peserta',
                    items: [
                        'Halaman ini terhubung dengan data calon peserta yang dipakai sistem.',
                        'Peserta bisa ditambahkan atau diperbarui secara manual melalui halaman kelola peserta.',
                        'Jika fitur import tersedia, data peserta dapat dimasukkan dari file Excel agar lebih cepat.',
                        'Pastikan data peserta lengkap sebelum lanjut ke tahap perhitungan.',
                    ],
                },
                {
                    title: 'Pengisian nilai',
                    items: [
                        'Isi nilai setiap peserta berdasarkan kriteria yang digunakan.',
                        'Nilai numerik dapat berupa pre-test, rapor, atau jarak domisili.',
                        'Nilai kategorikal seperti wawancara atau kesiapan kerja bisa memakai subskala bila disediakan.',
                        'Pastikan semua peserta memiliki nilai pada setiap kriteria sebelum lanjut.',
                    ],
                },
            ],
        },
    },
    bwm: {
        title: 'Panduan BWM',
        content: {
            summary: 'Tahap ini menentukan bobot kepentingan setiap kriteria sebelum skor peserta dihitung.',
            sections: [
                {
                    title: 'Cara mengisi',
                    items: [
                        'Pilih kriteria yang paling penting dan kriteria prioritas terendah.',
                        'Isi perbandingan dengan skala 1 sampai 9.',
                        'Angka 1 berarti sama penting, sedangkan angka 9 berarti jauh lebih penting.',
                        'Kriteria yang dibandingkan dengan dirinya sendiri otomatis bernilai 1.',
                    ],
                },
                {
                    title: 'Hasil tahap ini',
                    items: [
                        'Sistem menghasilkan bobot untuk tiap kriteria.',
                        'Sistem juga menampilkan rasio konsistensi untuk membantu menilai kecocokan input.',
                    ],
                },
            ],
        },
    },
    edas: {
        title: 'Panduan EDAS',
        content: {
            summary: 'Tahap ini menghitung skor peserta dari nilai peserta dan bobot BWM.',
            sections: [
                {
                    title: 'Yang dihitung sistem',
                    items: [
                        'Sistem menghitung rata-rata untuk setiap kriteria.',
                        'Sistem menghitung jarak positif dan jarak negatif dari rata-rata.',
                        'Hasil akhirnya adalah appraisal score untuk tiap peserta.',
                    ],
                },
                {
                    title: 'Cara membaca hasil',
                    items: [
                        'Semakin tinggi skor EDAS, semakin baik performa peserta pada keseluruhan kriteria.',
                    ],
                },
            ],
        },
    },
    copeland: {
        title: 'Panduan Copeland Score',
        content: {
            summary: 'Tahap ini dipakai untuk menentukan peringkat akhir peserta.',
            sections: [
                {
                    title: 'Cara kerja',
                    items: [
                        'Sistem membandingkan peserta satu per satu berdasarkan hasil penilaian.',
                        'Setiap peserta dapat memperoleh poin menang, kalah, atau imbang.',
                        'Skor Copeland dihitung dari jumlah menang dikurangi jumlah kalah.',
                    ],
                },
                {
                    title: 'Hasil tahap ini',
                    items: [
                        'Peserta dengan skor Copeland tertinggi akan berada di peringkat akhir teratas.',
                    ],
                },
            ],
        },
    },
    result: {
        title: 'Panduan Hasil Akhir',
        content: {
            summary: 'Tahap ini menampilkan ranking akhir peserta sebagai rekomendasi penerimaan.',
            sections: [
                {
                    title: 'Yang ditampilkan',
                    items: [
                        'Halaman ini menampilkan ranking akhir seluruh peserta.',
                        'Skor BWM, EDAS, dan Copeland dapat ditampilkan bila datanya tersedia.',
                    ],
                },
                {
                    title: 'Cara menggunakan hasil',
                    items: [
                        'Gunakan hasil ini untuk melihat peserta terbaik berdasarkan perhitungan sistem.',
                    ],
                },
            ],
        },
    },
};
