# Eksplorasi Disparitas Spasial Partisipasi Ekonomi dan Pengambilan Keputusan Perempuan di 514 Kabupaten/Kota Indonesia Melalui Visualisasi Analitik Interaktif Berbasis Web

[![Next.js](https://img.shields.io/badge/Framework-Next.js%2014-black)](https://nextjs.org/)
[![React](https://img.shields.io/badge/UI-React%2018-blue)](https://react.dev/)
[![Leaflet](https://img.shields.io/badge/Geospatial-Leaflet.js-green)](https://leafletjs.com/)
[![Plotly](https://img.shields.io/badge/Visualization-Plotly.js-blueviolet)](https://plotly.com/javascript/)
[![Data Source](https://img.shields.io/badge/Data%20Source-BPS%20RI%202024-007A3D)](https://www.bps.go.id/)
[![Vercel Deployment](https://img.shields.io/badge/Deployment-Vercel-success)](https://disparitasperempuan.vercel.app/)

Repositori ini memuat kode sumber, aset visualisasi, arsitektur data terolah (GeoJSON dan JSON), serta dokumentasi komprehensif dari platform visualisasi analitik interaktif berbasis web untuk mengeksplorasi disparitas spasial keterlibatan perempuan di 514 kabupaten/kota dan 38 provinsi di Indonesia. Proyek ini dikembangkan untuk Ujian Akhir Semester (UAS) mata kuliah Visualisasi Data dan Informasi, Program Studi Komputasi Statistik, Politeknik Statistika STIS, Tahun Akademik 2025/2026.

* **Penyusun:** Danang Ivan Pangestu (NIM: 222313036 / Kelas: 3SI1)
* **Program Studi:** D-IV Komputasi Statistik, Politeknik Statistika STIS
* **Dosen Pengampu:** Siti Mariyah, Ph.D. & Farid Ridho, M.T.
* **Tautan Aplikasi Publik (Vercel):** [https://disparitasperempuan.vercel.app](https://disparitasperempuan.vercel.app)
* **Tautan Repositori GitHub:** [https://github.com/danangivan/uasvisdat](https://github.com/danangivan/uasvisdat)

---

## 1. Pendahuluan dan Ringkasan Proyek

### 1.1 Latar Belakang dan Urgensi
Pemberdayaan perempuan dan kesetaraan gender merupakan pilar fundamental dalam agenda pembangunan global *Sustainable Development Goals* (SDGs Tujuan 5) serta Rencana Pembangunan Jangka Menengah Nasional (RPJMN). Kerangka hukum nasional melalui regulasi pemilihan umum mengamanatkan kuota afirmasi minimal 30% bagi keterwakilan perempuan di parlemen, di samping berbagai kebijakan inklusi ketenagakerjaan dan ekonomi. 

Meskipun demikian, fakta empiris memperlihatkan disparitas pencapaian yang tajam antarwilayah. Indonesia memiliki bentang kepulauan luas dengan 514 kabupaten/kota yang tersebar di 38 provinsi pasca-pemekaran empat Daerah Otonom Baru (DOB) di Pulau Papua (Papua Selatan, Papua Tengah, Papua Pegunungan, Papua Barat Daya) dan Kalimantan Utara. Di kawasan metropolitan, perempuan menikmati aksesibilitas pendidikan tinggi serta penetrasi jabatan profesional yang maju. Sebaliknya, di banyak wilayah perdesaan dan kawasan tertinggal, terdepan, dan terluar (3T), perempuan menghadapi fenomena lantai lekat (*sticky floor*) di mana tingginya partisipasi kerja fisik subsisten tidak diimbangi oleh kemandirian finansial maupun akses ke posisi pengambil keputusan strategis.

### 1.2 Tantangan Pengolahan Data
Formulasi intervensi kebijakan afirmasi berbasis bukti selama ini menghadapi empat kendala analitis:
1. **Bias Agregasi Makro (*Ecological Fallacy*):** Rata-rata nasional atau provinsi kerap mengaburkan disparitas nyata antarkabupaten/kota di dalamnya.
2. **Ketergantungan Spasial (*Spatial Dependence*):** Sesuai Hukum Pertama Tobler, kondisi sosial-ekonomi suatu daerah berinteraksi kuat dengan daerah tetangganya sehingga membentuk kantong aglomerasi teritorial yang memerlukan pendekatan lintas batas administratif.
3. **Kompleksitas Hubungan Multivariat:** Interaksi antardimensi seperti kesehatan, pendidikan, partisipasi angkatan kerja, pengeluaran riil, dan keterwakilan politik bersifat non-linear dan saling mengunci.
4. **Keterbatasan Format Publikasi Konvensional:** Tabel statistik tabular statis tidak memfasilitasi penelusuran interaktif, penyaringan multivariat, maupun identifikasi klaster autokorelasi spasial.

### 1.3 Tujuan Proyek
Proyek ini merancang dan mengimplementasikan sistem visualisasi analitik interaktif berbasis web untuk membedah disparitas partisipasi ekonomi dan pengambilan keputusan perempuan di 514 kabupaten/kota dan 38 provinsi di Indonesia secara granular dengan memanfaatkan 8 indikator resmi Badan Pusat Statistik (BPS) tahun 2024. Sistem mengintegrasikan 14 jenis representasi visual ke dalam 4 modul terstruktur guna mendukung perumusan kebijakan afirmasi berbasis data.

---

## 2. Sumber Data dan Metodologi

### 2.1 Indikator Resmi BPS Tahun 2024
Data bersumber dari publikasi resmi BPS tahun 2024 mencakup 514 kabupaten/kota di 38 provinsi di Indonesia:

| Simbol | Nama Indikator Resmi | Satuan | Dimensi Analitis | Sumber Publikasi BPS (2024) | Nilai Min | Rata-rata | Nilai Maks |
|---|---|---|---|---|---|---|---|
| $X_1$ | Keterlibatan Perempuan di Parlemen | % | Keputusan Publik | Statistik Politik dan Keamanan | 0,00 | 16,01 | 55,00 |
| $X_2$ | Sumbangan Pendapatan Perempuan | % | Partisipasi Ekonomi | Indeks Pemberdayaan Gender (IDG) | 12,80 | 33,56 | 49,80 |
| $X_3$ | Pengeluaran per Kapita Disesuaikan | Ribu Rp | Standar Hidup Layak | Indeks Pembangunan Manusia (IPM) | 4.943 | 11.453 | 19.953 |
| $X_4$ | Angka Harapan Hidup (AHH) | Tahun | Kesehatan & Kelangsungan | Indeks Pembangunan Manusia (IPM) | 56,24 | 71,85 | 78,42 |
| $X_5$ | Tenaga Profesional Perempuan | % | Keputusan Manajerial | Indeks Pemberdayaan Gender (IDG) | 18,20 | 51,18 | 78,50 |
| $X_6$ | Tingkat Partisipasi Angkatan Kerja (TPAK) Perempuan | % | Ketenagakerjaan Riil | Sakernas 2024 | 32,10 | 58,24 | 88,60 |
| $X_7$ | Rata-rata Lama Sekolah (RLS) | Tahun | Pendidikan Formal | Indeks Pembangunan Manusia (IPM) | 1,45 | 8,77 | 12,98 |
| $X_8$ | Harapan Lama Sekolah (HLS) | Tahun | Aksesibilitas Pendidikan | Indeks Pembangunan Manusia (IPM) | 3,52 | 13,12 | 16,10 |

### 2.2 Pra-pemrosesan Data dan Rekonsiliasi Wilayah
1. **Penyelarasan Kodifikasi Wilayah:** Penyesuaian kode administratif BPS resmi untuk mencakup pemekaran 4 DOB di Tanah Papua (Papua Selatan, Papua Tengah, Papua Pegunungan, Papua Barat Daya) dan Kalimantan Utara, menghasilkan keselarasan relasi 514 kabupaten/kota dalam 38 provinsi.
2. **Penanganan Data Hilang (*KNN Imputation*):** Sebanyak 500 kabupaten/kota (97,3%) memiliki data lengkap. Sebanyak 14 kabupaten pemekaran baru di Papua yang belum mencatatkan indikator IPM lengkap diimputasi menggunakan metode *K-Nearest Neighbors* ($k=5$) berbasis metrik jarak Euclidean pada data terstandarisasi.
3. **Normalisasi Nilai:** Setiap indikator ditransformasikan ke rentang skala $[0, 100]$ menggunakan standardisasi Min-Max:
   $$X'_{ij} = \frac{X_{ij} - \min(X_j)}{\max(X_j) - \min(X_j)} \times 100$$
4. **Konstruksi Skor Komposit:**
   - **Skor Partisipasi Ekonomi:** $\text{Skor Ekonomi} = 0{,}6 \cdot X'_2 + 0{,}4 \cdot X'_6$
   - **Skor Pengambilan Keputusan:** $\text{Skor Keputusan} = 0{,}5 \cdot X'_1 + 0{,}5 \cdot X'_5$
   - Ambang klasifikasi kuadran ditentukan melalui garis median empiris nasional: Median Ekonomi = 34,50 dan Median Keputusan = 47,60.

### 2.3 Pemodelan Autokorelasi Spasial
Dependensi spasial dimodelkan menggunakan matriks pembobot spasial $k$-tetangga terdekat ($k$-NN, $k=8$) dengan standardisasi baris ($W$). Koefisien Global Moran's I dihitung untuk menguji hipotesis keberadaan autokorelasi spasial:
$$I = \frac{n}{\sum_{i=1}^n \sum_{j=1}^n w_{ij}} \frac{\sum_{i=1}^n \sum_{j=1}^n w_{ij}(z_i - \bar{z})(z_j - \bar{z})}{\sum_{i=1}^n (z_i - \bar{z})^2}$$
Signifikansi statistik dievaluasi melalui uji permutasi Monte Carlo sebanyak 999 iterasi. Klaster lokal diidentifikasi menggunakan rumus *Local Indicators of Spatial Association* (LISA):
$$I_i = \frac{z_i - \bar{z}}{s^2} \sum_{j=1}^n w_{ij}(z_j - \bar{z})$$
Daerah diklasifikasikan ke dalam tipe klaster *High-High* (Hotspot), *Low-Low* (Coldspot), serta pencilan spasial *High-Low* dan *Low-High* pada tingkat signifikansi $p < 0{,}05$.

---

## 3. Taksonomi dan 14 Teknik Visualisasi Analitik

Sistem mengintegrasikan 14 teknik visualisasi data yang dirancang berdasarkan prinsip persepsi grafis Cleveland & McGill serta taksonomi interaksi Shneiderman (*overview first, zoom and filter, details-on-demand*):

| Modul | Nama Visualisasi | Taksonomi Grafis | Variabel Data yang Dipetakan | Saluran Encoding Visual | Fitur Interaktivitas Utama |
|---|---|---|---|---|---|
| **1. Ringkasan Eksekutif & Tipologi** | Executive KPI Summary Cards | Metrik Ringkasan 1D | 8 Indikator Nasional BPS | Tipografi hierarkis, badge warna delta disparitas | Pembaruan metrik dinamis saat filter wilayah diaktifkan |
| | Scatter Plot 4-Kuadran Tipologi Disparitas | Relasional 2D Partisi | Skor Ekonomi vs Skor Keputusan | Posisi koordinat X-Y, warna kuadran, garis median | Filter pulau/provinsi, tooltip rincian nilai, penyorotan kuadran |
| **2. Eksplorasi Geospasial Multi-Metode** | Peta Batas Poligon GeoJSON 514 Kab/Kota | Geospasial Poligon Vektor | 8 Indikator Pembangunan Gender | Poligon batas administratif, skala warna Viridis | Pan, multilevel zoom, hover batas wilayah, popup profil daerah |
| | Peta Klaster Spasial LISA | Geostatistika Inferensial | Local Moran's I ($p < 0{,}05$) | 4 Warna baku (Merah=HH, Biru=LL, Pastel=Pencilan) | Pemilihan variabel (Keputusan/Ekonomi), inspeksi nilai Z-score |
| | Peta Simbol Proporsional (Bubble Map) | Geospasial Titik Berbobot | Titik koordinat, Pengeluaran, Skor Kuadran | Ukuran radius bubble proporsional ($r \propto \sqrt{V}$), warna | Tooltip metrik, penapisan kuadran, bebas distorsi luas wilayah |
| | Peta Densitas Kernel Spasial (Heatmap) | Geospasial Kontinu | Densitas spasial TPAK / Pengeluaran | Spektrum termal kontinu (gradien Plasma) | Penggeser radius blur spasial dan penyesuaian kontras |
| | Peta Koroplet Agregasi 38 Provinsi | Geospasial Makro-Wilayah | Rata-rata terbobot 38 Provinsi | Poligon provinsi, gradasi kuantil 5 interval | Interaksi klik provinsi untuk melakukan drill-down ke 514 kab/kota |
| **3. Analisis Multivariat Berdimensi Tinggi** | PCA Biplot Proyeksi 2D | Reduksi Dimensi Spektral | 8 Indikator terproyeksi ke PC1 & PC2 | Koordinat scatter titik amatan, vektor arah loading | Penelusuran skor komponen, isolasi arah vektor indikator |
| | Diagram Koordinat Paralel (Parallel Coordinates) | Multivariat Sumbu Sejajar | 8 Sumbu vertikal terstandarisasi | 8 Garis sumbu paralel, poliline amatan, gradasi warna | Multi-axis interactive brushing, penataan ulang urutan sumbu |
| | Matriks Korelasi Terklaster (Clustered Heatmap) | Asosiatif Terstruktur | Matriks korelasi Pearson $8 \times 8$ | Sel matriks dua dimensi, palet divergen RdBu | Tooltip koefisien korelasi r, pengelompokan hierarki Ward |
| | Diagram Radar / Spider Chart | Poligon Radial Terbuka | Rata-rata 8 indikator per wilayah | 8 Sumbu jari-jari radial, poligon tertutup | Komparasi multivariat antar-gugus pulau atau antar-provinsi |
| **4. Struktur Wilayah Berhierarki** | Interactive Treemap 4 Level | Partisi Ruang Bersarang | Nasional $\rightarrow$ Pulau $\rightarrow$ Provinsi $\rightarrow$ Kab/Kota | Luas area = Pengeluaran, Warna = Skor Keputusan | Drill-down berjenjang melalui klik, breadcrumb navigation |
| | Interactive Sunburst Chart | Partisi Polar Konsentris | 4 Cincin hierarki konsentris | Sudut busur melingkar, gradasi rona hierarkis | Navigasi fokus radial animasi, klik pusat untuk reset hierarki |
| | Hierarchical Drilldown Bar Chart | Distribusi Diskrit Bertingkat | Peringkat nilai indikator terpilih | Panjang batang horizontal, urutan nilai terurut | Penelusuran berjenjang dari pulau ke provinsi dan kab/kota |

---

## 4. Temuan Empiris Kunci

### 4.1 Uji Signifikansi Autokorelasi Spasial Global
Pengujian autokorelasi spasial Global Moran's I membuktikan dependensi teritorial yang sangat signifikan secara statistik:
* **Skor Partisipasi Ekonomi:** $I = 0{,}4503 \quad (Z = 16{,}42, \ p = 0{,}0010)$
* **Skor Pengambilan Keputusan:** $I = 0{,}3544 \quad (Z = 12{,}87, \ p = 0{,}0010)$

Nilai $Z$-score yang jauh melampaui nilai kritis $+1{,}96$ pada tingkat signifikansi $\alpha = 0{,}05$ secara tegas menolak hipotesis nol distribusi spasial acak. Hal ini membuktikan bahwa capaian pemberdayaan perempuan di suatu daerah berkorelasi positif dengan pencapaian daerah-daerah di sekitarnya (mengonfirmasi berlakunya Hukum Pertama Tobler).

### 4.2 Dekomposisi Sebaran Klaster Lokal LISA
Dari 514 kabupaten/kota, analisis Local Moran's I menghasilkan distribusi klaster spasial berikut:
* **Klaster Hotspot High-High (49 daerah, 9,5%):** Mengelompok solid di Provinsi Sulawesi Utara (Kota Manado, Tomohon, Minahasa, Minahasa Utara, Minahasa Selatan), Bali (Denpasar, Badung, Gianyar), dan D.I. Yogyakarta. Tradisi sosial yang lebih egaliter serta akses pendidikan perempuan yang terbuka sejak lama menciptakan lingkungan partisipasi publik yang kondusif.
* **Klaster Coldspot Low-Low (54 daerah, 10,5%):** Terkonsentrasi pekat di koridor Pegunungan Tengah Papua (Kabupaten Yahukimo, Nduga, Lanny Jaya, Puncak, Tolikara, Intan Jaya, Paniai). Kawasan ini mengalami jebakan spasial (*spatial trap*) yang dipicu oleh keterisolasian topografi, minimnya fasilitas pendidikan formal, dan keterbatasan infrastruktur dasar.
* **Pencilan Spasial High-Low (13 daerah, 2,5%):** Kota Jayapura, Kota Sorong, Kota Kupang, dan Kota Palangkaraya membentuk enklave capaian tinggi di tengah daerah penyangga (*hinterland*) yang tertinggal. Efek rembesan (*trickle-down effect*) dari pusat perkotaan tersebut terhambat oleh disparitas konektivitas wilayah.
* **Pencilan Spasial Low-High (12 daerah, 2,3%):** Daerah perdesaan perbatasan yang mengalami *backwash effect*, di mana modal dan tenaga kerja terdidik terserap ke pusat pertumbuhan tetangganya.
* **Distribusi Spasial Acak / Tidak Signifikan (386 daerah, 75,1%):** Menunjukkan bahwa pada tiga perempat wilayah Indonesia, pola disparitas gender masih bervariasi secara acak lokal.

### 4.3 Karakteristik 4 Kuadran Tipologi Disparitas
Pemetaan terhadap median empiris nasional membagi 514 daerah ke dalam empat kategori:
1. **Kuadran I (Maju & Seimbang - 162 daerah, 31,5%):** Wilayah dengan capaian ekonomi dan kepemimpinan di atas median nasional, didominasi kota metropolitan (Surabaya, Denpasar, Badung, Manado, Jakarta Selatan) dengan struktur ekonomi jasa dan akses pendidikan tinggi yang mapan.
2. **Kuadran II (Representasi Kuat, Pendapatan Terbatas - 95 daerah, 18,5%):** Terkonsentrasi di Nusa Tenggara Timur (Timor Tengah Selatan, Alor, Belu) dan Kepulauan Maluku. Perempuan aktif dalam kelembagaan publik dan keagamaan, namun pendapatan moneter riil tetap terbatas akibat dominasi sektor agraris lahan kering subsisten.
3. **Kuadran III (Tertinggal Ganda - 162 daerah, 31,5%):** Terpusat di pedalaman Papua Pegunungan, Papua Tengah, Kepulauan Nias, dan wilayah 3T. Wilayah ini mengalami defisit ganda pada aspek pendidikan formal, kesehatan, dan representasi publik.
4. **Kuadran IV (Pekerja Keras Kurang Kuasa / *Sticky Floor* - 95 daerah, 18,5%):** Dicirikan oleh angka TPAK perempuan yang sangat tinggi (> 75%) namun keterwakilan di parlemen mendekati 0%. Perempuan terkonsentrasi sebagai tenaga kerja fisik subsisten informal tanpa pengaruh pada penganggaran dan kebijakan publik.

### 4.4 Analisis Reduksi Dimensi Spektral PCA Biplot
Dekomposisi PCA mereduksi 8 indikator menjadi dua komponen utama yang merangkum 55,0% variansi data (PC1 = 37,8% dan PC2 = 17,19%):
* **Sumbu PC1 (Kapasitas Modal Manusia & Standar Hidup):** Vektor Pengeluaran per Kapita ($X_3$), Rata-rata Lama Sekolah ($X_7$), Harapan Lama Sekolah ($X_8$), dan Angka Harapan Hidup ($X_4$) berhimpit searah sumbu PC1 positif dengan sudut lancip (< $30^\circ$).
* **Sumbu PC2 (Polarisasi Ketenagakerjaan Subsisten vs Pengambil Keputusan):** Terdapat sudut divergensi mendekati $180^\circ$ antara vektor TPAK ($X_6$) yang mengarah ke bawah (PC2 negatif) terhadap vektor Parlemen ($X_1$) dan Tenaga Profesional ($X_5$) yang mengarah ke atas (PC2 positif). Hal ini membuktikan trade-off struktural bahwa tingginya serapan angkatan kerja perempuan di perdesaan didorong oleh pekerjaan informal berupah rendah, bukan posisi manajerial atau politik.

### 4.5 Analisis Koordinat Paralel dan Matriks Korelasi
* **Pola Gergaji (*Sawtooth Pattern*) pada Koordinat Paralel:** Melalui teknik *brushing* interaktif pada sumbu TPAK tinggi (> 0,7) dan Parlemen rendah (< 0,2), teridentifikasi lintasan garis yang menjulang pada variabel ketenagakerjaan namun merosot tajam pada indikator parlemen dan rata-rata lama sekolah.
* **Korelasi Terklaster Hierarkis:** Korelasi positif terkuat teridentifikasi antara RLS dan Pengeluaran riil ($r = +0{,}78, \ p < 0{,}001$). Sebaliknya, terkonfirmasi anomali hubungan negatif antara TPAK dengan RLS ($r = -0{,}34, \ p < 0{,}01$) serta antara TPAK dan Pengeluaran ($r = -0{,}29, \ p < 0{,}01$). Hal ini menunjukkan bahwa di daerah dengan tekanan ekonomi tinggi, perempuan terdorong masuk ke bursa kerja fisik lebih dini dengan mengorbankan jenjang pendidikan formal.

---

## 5. Arsitektur Sistem dan Spesifikasi Perangkat Lunak

### 5.1 Tumpukan Teknologi (*Technology Stack*)
* **Framework Aplikasi:** Next.js 14 (App Router) berbasis React 18
* **Pustaka Pemetaan Geospasial:** Leaflet.js v1.9.4 dengan plugin mandiri `leaflet-heat.js`
* **Pustaka Visualisasi Analitik:** Plotly.js (Plotly Dist Minified)
* **Arsitektur Payload Data:** *Zero-API / Static JSON Payload* (GeoJSON batas nasional 0,79 MB, dataset terolah 180 KB)
* **Aksesibilitas Desain:** Palet warna terkalibrasi ramah buta warna (*colorblind-safe*) menggunakan skala Viridis, Cividis, dan Plasma

### 5.2 Metrik Kinerja Aplikasi
* **Google Lighthouse Performance:** Skor 98 / 100
* **First Contentful Paint (FCP):** < 400 ms
* **Waktu Transisi Antar-Tab Visualisasi:** < 50 ms
* **Efisiensi Server:** 100% *client-side rendering* tanpa beban query database eksternal

---

## 6. Struktur Repositori Proyek

```text
uasvisdat/
├── app/
│   ├── layout.jsx                # Konfigurasi layout global, metadata, dan pemuatan skrip eksternal
│   ├── page.jsx                  # Komponen utama 14 visualisasi analitik interaktif
│   └── globals.css               # Definisi gaya antarmuka, variabel CSS tema gelap, dan tata letak responsif
├── public/
│   ├── leaflet-heat.js           # Plugin heatmap mandiri lokal untuk rendering densitas spasial
│   ├── logo_stis.webp            # Aset logo resmi Politeknik Statistika STIS
│   └── data/
│       ├── kabkota_indonesia.geojson  # Batas poligon GeoJSON 514 kabupaten/kota seluruh Indonesia (0,79 MB)
│       ├── provinsi_indonesia.geojson # Batas poligon GeoJSON 38 provinsi di Indonesia
│       ├── kabkota_514.json      # Dataset lengkap 514 kabupaten/kota terintegrasi 8 indikator
│       ├── provinsi_38.json      # Dataset ringkasan tingkat provinsi
│       ├── nasional.json         # Ringkasan indikator nasional dan statistik Moran's I
│       ├── pca_meta.json         # Koordinat loading vektor PCA dan variansi terjelaskan
│       ├── correlation_matrix.json # Matriks korelasi Pearson terklaster hierarkis
│       └── clean_*.csv           # Data cadangan terstruktur format CSV
├── extract_shp_to_geojson.py     # Skrip pra-pemrosesan ekstraksi Shapefile ke format GeoJSON
├── build_national_geojson.py     # Skrip pembentukan GeoJSON batas administratif nasional 514 kab/kota
├── package.json                  # Konfigurasi dependensi proyek Node.js / Next.js
├── vercel.json                   # Konfigurasi optimasi deployment Vercel
└── README.md                     # Dokumentasi komprehensif proyek penelitian
```

---

## 7. Panduan Menjalankan Sistem Secara Lokal

### Prasyarat Sistem
* Node.js versi 18.x atau lebih baru
* npm versi 9.x atau lebih baru

### Langkah Eksekusi
1. Kloning repositori kode sumber:
   ```bash
   git clone https://github.com/danangivan/uasvisdat.git
   cd uasvisdat
   ```

2. Pasang dependensi aplikasi:
   ```bash
   npm install
   ```

3. Jalankan server pengembangan lokal:
   ```bash
   npm run dev
   ```

4. Buka peramban web pada alamat:
   ```text
   http://localhost:3000
   ```

---

## 8. Panduan Deployment ke Vercel

Sistem dirancang secara khusus untuk deployment teroptimasi pada platform Vercel:

1. Buat repositori baru di akun GitHub Anda dan dorong (*push*) kode sumber proyek:
   ```bash
   git add .
   git commit -m "Update visualisasi analitik dan dokumentasi sistem"
   git push origin main
   ```
2. Buka dashboard Vercel ([vercel.com](https://vercel.com/)) dan lakukan impor repositori GitHub yang bersangkutan.
3. Pada pengaturan proyek (*Project Settings*), Vercel akan secara otomatis mendeteksi konfigurasi Next.js:
   * **Framework Preset:** Next.js
   * **Build Command:** `next build`
   * **Output Directory:** `.next`
4. Klik tombol **Deploy**. Platform akan tersedia secara publik melalui domain Vercel yang ditentukan.

---

## 9. Referensi Ilmiah

1. B. M. H. Yunita, "Representasi dan Substansi: Analisis Kritis Keterlibatan Perempuan dalam Parlemen Provinsi Nusa Tenggara Barat," *Aletheia Jurnal Sosial & Humaniora Inovasi Ekonomi Dan Edukasi*, vol. 3, no. 1, hlm. 1–13, Jun. 2026, doi: 10.63892/aletheia.3.2026.1-13.
2. Badan Pusat Statistik, *Statistik Politik dan Keamanan 2024*, Jakarta: Badan Pusat Statistik RI, 2024.
3. M. L. Octaviyani dan E. Endang, "Analisis Disparitas gender terhadap pertumbuhan Ekonomi Indonesia," *EKONOMIS Journal of Economics and Business*, vol. 8, no. 1, hlm. 535–546, Mar. 2024, doi: 10.33087/ekonomis.v8i1.1561.
4. E. Renie, "PARTISIPASI PEREMPUAN DALAM EKONOMI INKLUSIF," *AGENDA Jurnal Analisis Gender Dan Agama*, vol. 2, no. 1, hlm. 10–22, Mar. 2020, doi: 10.31958/agenda.v2i1.1984.
5. J. D. S. Amory, "PERANAN GENDER PEREMPUAN DALAM PEMBANGUNAN DI SULAWESI BARAT TAHUN 2016-2018," *Jurnal Ilmiah Ekonomi Pembangunan*, vol. 1, no. 1, hlm. 1–15, Agu. 2019.
6. M. M. Silvia dan M. N. Sulaiman, "Development of an Economic Growth Data Visualization Dashboard for Palembang City Using the Agile Method," *Jurnal Riset Informatika*, vol. 8, no. 2, hlm. 278–288, Mar. 2026, doi: 10.34288/jri.v8i2.486.
7. A. K. Hayya, Nairobi, dan A. Darmawan, "Pengaruh Ketimpangan Gender Dalam Bidang Ekonomi Pembangunan Di Indonesia: Kajian Teoritis Dan Empiris," *INNOVATIVE: Journal of Social Science Research*, vol. 5, no. 1, hlm. 5934–5944, 2025.
8. R. F. N. Ikhsan, R. A. N. Rahmadani, R. A. Putri, dan I. H. Santi, "Modernisasi Tata Kelola Arsip Surat Perpustakaan Perguruan Tinggi Berbasis Next.js dan SQLite," *IKRA-ITH Informatika Jurnal Komputer Dan Informatika*, vol. 8, no. 1, hlm. 1–10, Jun. 2026.
9. L. Anselin, "Local indicators of spatial association—LISA," *Geographical Analysis*, vol. 27, no. 2, hlm. 93–115, Apr. 1995, doi: 10.1111/j.1538-4632.1995.tb00338.x.
10. E. Duflo, "Women's empowerment and economic development," *Journal of Economic Literature*, vol. 50, no. 4, hlm. 1051–1079, Des. 2012, doi: 10.1257/jel.50.4.1051.
11. T. Agustina, "Perjalanan Perempuan Indonesia dalam 'Mengejar' Kuota Kursi Parlemen," *Muadalah: Jurnal Studi Gender dan Anak*, vol. 2, no. 1, hlm. 36–52, Jun. 2014, doi: 10.18592/jsga.v2i1.462.
12. B. Shneiderman, "The eyes have it: A task by data type taxonomy for information visualizations," dalam *Proceedings of 1996 IEEE Symposium on Visual Languages*, Boulder, CO, USA, 1996, hlm. 336–343, doi: 10.1109/VL.1996.536825.
13. J. Heer dan B. Shneiderman, "Interactive dynamics for visual analysis: A taxonomy of tools that support the fluent exploration of business, scientific and social data," *Communications of the ACM*, vol. 55, no. 4, hlm. 45–54, Apr. 2012, doi: 10.1145/2133806.2133821.
14. K. R. Gabriel, "The biplot graphic display of matrices with application to principal component analysis," *Biometrika*, vol. 58, no. 3, hlm. 453–467, Des. 1971, doi: 10.1093/biomet/58.3.453.
15. A. Inselberg, "The plane with parallel coordinates," *The Visual Computer*, vol. 1, no. 2, hlm. 69–91, Agu. 1985, doi: 10.1007/BF01898350.
16. B. Johnson dan B. Shneiderman, "Tree-maps: A space-filling approach to the visualization of hierarchical information structures," dalam *Proceedings of IEEE Visualization*, San Diego, CA, USA, 1991, hlm. 284–291, doi: 10.1109/VISUAL.1991.175815.
17. J. Stasko, R. Catrambone, M. Guzdial, dan K. McDonald, "An evaluation of space-filling information visualizations for depicting hierarchical structures," *International Journal of Human-Computer Studies*, vol. 53, no. 5, hlm. 663–694, Nov. 2000, doi: 10.1006/ijhc.2000.0420.
18. W. S. Cleveland dan R. McGill, "Graphical perception: Theory, experimentation, and application to the development of graphical methods," *Journal of the American Statistical Association*, vol. 79, no. 387, hlm. 531–554, Sep. 1984, doi: 10.1080/01621459.1984.10478080.
19. Badan Pusat Statistik, *Indeks Pembangunan Gender (IPG) dan Indeks Pemberdayaan Gender (IDG) 2024*, Jakarta: Badan Pusat Statistik RI, 2024.
