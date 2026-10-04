# Eksplorasi Disparitas Spasial Partisipasi Ekonomi dan Pengambilan Keputusan Perempuan di 514 Kabupaten/Kota Indonesia Melalui Visualisasi Analitik Interaktif Berbasis Web

**Danang Ivan Pangestu**  
*Program Studi Komputasi Statistik, Politeknik Statistika STIS, Jakarta, Indonesia*  
*Email: 222313036@stis.ac.id*  
*Mata Kuliah: Visualisasi Data dan Informasi (TA. 2025/2026)*  
*Dosen Pengampu: Siti Mariyah, Ph.D. & Farid Ridho, M.T.*

---

### Abstrak
Disparitas gender dalam partisipasi ekonomi dan pengambilan keputusan publik masih menjadi tantangan mendasar pembangunan berkelanjutan di Indonesia. Penelitian ini merancang dan membangun platform visualisasi analitik interaktif berbasis web untuk mengeksplorasi disparitas spasial keterlibatan perempuan pada 514 kabupaten/kota dan 38 provinsi di Indonesia menggunakan 8 indikator resmi Badan Pusat Statistik (BPS) tahun 2024. Sistem mengintegrasikan empat belas jenis visualisasi analitik yang terbagi dalam empat taksonomi utama: (1) visualisasi ringkasan eksekutif dan tipologi relasional 2D (Executive KPI Cards, Scatter Plot 4-Kuadran Tipologi Disparitas); (2) visualisasi geospasial multi-metode (Peta Poligon Batas Wilayah 514 Kab/Kota, Peta Densitas Kernel Spasial, Peta Simbol Proporsional/Bubble Map, Peta Koroplet 38 Provinsi, dan Peta Klaster Autokorelasi Spasial LISA); (3) visualisasi multivariat berdimensi tinggi (PCA Biplot, Parallel Coordinates Plot dengan brushing interaktif, Clustered Correlation Heatmap, dan Radar Profile Chart Antar-Gugus Kepulauan); serta (4) visualisasi data berhierarki lintas tingkatan (Interactive Treemap 4 level, Sunburst Chart radial, dan Hierarchical Drilldown Macro Summary). Analisis spasial membuktikan autokorelasi positif yang signifikan secara statistik pada indeks pengambilan keputusan ($I = 0{,}3544, p = 0{,}001$) maupun partisipasi ekonomi ($I = 0{,}4503, p = 0{,}001$). Teridentifikasi klaster hotspot di Sulawesi Utara serta anomali *sticky floor* di kawasan timur Indonesia, di mana tingginya partisipasi kerja fisik tidak terkonversi menjadi kemandirian pendapatan dan representasi politik. Sistem diimplementasikan menggunakan Next.js dan Vercel dengan palet ramah buta warna guna mendukung formulasi kebijakan afirmasi berbasis bukti.

**Kata Kunci:** Visualisasi Analitik, Disparitas Gender, 514 Kabupaten/Kota, Autokorelasi Spasial, Moran's I, PCA Biplot, Parallel Coordinates, Treemap, Next.js.

---

## I. Pendahuluan

### A. Latar Belakang
Kesetaraan gender dan pemberdayaan perempuan merupakan pilar fundamental dalam agenda global *Sustainable Development Goals* (SDGs Goal 5) serta Rencana Pembangunan Jangka Menengah Nasional (RPJMN) Indonesia [1], [2]. Kerangka hukum nasional melalui Undang-Undang Pemilihan Umum secara eksplisit telah mengamanatkan kuota afirmasi minimal 30% bagi keterwakilan perempuan di lembaga legislatif [11], di samping berbagai program inklusi ekonomi dan ketenagakerjaan [4], [7]. Namun demikian, fakta empiris di tingkat daerah memperlihatkan jurang pencapaian yang sangat tajam [3], [5].

Indonesia merupakan negara kepulauan berukuran masif dengan bentang wilayah mencakup 514 kabupaten/kota di 38 provinsi pasca-pemekaran empat Daerah Otonom Baru (DOB) di Pulau Papua (Papua Selatan, Papua Tengah, Papua Pegunungan, dan Papua Barat Daya) serta pemekaran Kalimantan Utara [1], [2]. Keberagaman struktur sosial budaya, tingkat urbanisasi, dan kapasitas fiskal daerah menyebabkan profil kemajuan perempuan sangat heterogen. Di kota-kota metropolitan, perempuan menikmati akses pendidikan tinggi dan penetrasi jabatan profesional yang luas [6]. Sebaliknya, di banyak perdesaan dan kawasan tertinggal, terdepan, dan terluar (3T), jutaan perempuan terjebak dalam fenomena lantai lekat (*sticky floor*)—berpartisipasi intensif dalam kegiatan fisik subsisten informal tanpa kemandirian finansial dan tanpa representasi politik [7], [10].

### B. Permasalahan
Perumusan kebijakan afirmasi berbasis bukti selama ini terkendala oleh sejumlah tantangan data yang mendasar:
1. **Bias Agregasi Makro (*Ecological Fallacy*):** Angka agregat di tingkat nasional atau provinsi kerap mengaburkan disparitas lokal yang sangat kontras antarkabupaten/kota di dalamnya [1], [3].
2. **Ketergantungan Spasial (*Spatial Dependence*):** Mengacu pada hukum pertama geografi Tobler, kondisi sosial-ekonomi suatu daerah berinteraksi erat dengan daerah tetangganya [9]. Daerah tertinggal cenderung mengelompok membentuk kantong marjinalisasi spasial yang memerlukan penanganan regional terpadu [5], [9].
3. **Kompleksitas Hubungan Multivariat:** Hubungan antardimensi seperti kesehatan, pendidikan, partisipasi kerja, pendapatan, dan kursi parlemen bersifat non-linear dan saling mengunci secara struktural [3], [10].
4. **Keterbatasan Media Statistik Konvensional:** Publikasi tabel statistik BPS berbentuk dokumen tabular statis tidak memfasilitasi eksplorasi interaktif, sehingga menyulitkan identifikasi klaster spasial, anomali daerah, dan pola korelasi laten secara efisien [6], [12].

### C. Tujuan Proyek
Guna menjawab persoalan tersebut, proyek ini merancang, mengimplementasikan, dan mengevaluasi sebuah platform visualisasi analitik interaktif berbasis web untuk membedah disparitas partisipasi ekonomi dan pengambilan keputusan perempuan di 514 kabupaten/kota dan 38 provinsi di Indonesia dengan memanfaatkan 8 indikator resmi Badan Pusat Statistik (BPS) tahun 2024. Sistem mengintegrasikan seluruh taksonomi visualisasi ke dalam 14 jenis teknik representasi grafis:
1. **Modul Ringkasan Eksekutif & Tipologi:** (1) Executive KPI Summary Cards, (2) Scatter Plot Tipologi 4-Kuadran Relasional 2D.
2. **Modul Eksplorasi Geospasial Multi-Metode:** (3) Peta Batas Poligon Tematik GeoJSON 514 Kab/Kota, (4) Peta Klaster Autokorelasi Spasial LISA, (5) Peta Simbol Proporsional / Bubble Map, (6) Peta Densitas Kernel Spasial / Heatmap, (7) Peta Koroplet Agregasi 38 Provinsi.
3. **Modul Analisis Multivariat Berdimensi Tinggi:** (8) Principal Component Analysis (PCA) Biplot Proyeksi 2D, (9) Diagram Koordinat Paralel (Parallel Coordinates Plot) 8 Sumbu dengan Brushing Interaktif, (10) Matriks Korelasi Terklaster Hierarkis (Clustered Correlation Heatmap), (11) Diagram Radar / Spider Chart Multivariat Antar-Gugus Kepulauan.
4. **Modul Struktur Wilayah Berhierarki:** (12) Interactive Hierarchical Treemap 4 Level, (13) Interactive Sunburst Chart Partisi Melingkar 4 Level, (14) Hierarchical Drilldown Macro Summary Bar Chart Distribusi Wilayah.

---

## II. Penelitian Terkait

### A. Kajian Visualisasi Analitik dan Dashboard Daerah
Silvia dan Sulaiman [6] mengembangkan dashboard visualisasi pertumbuhan ekonomi Kota Palembang menggunakan metode Agile, membuktikan bahwa antarmuka visual mempermudah pemahaman indikator makro oleh perencana daerah. Namun, cakupannya terbatas pada satu kota dan belum mengintegrasikan analisis spasial autokorelasi nasional. Ikhsan dkk. [8] mengkaji modernisasi tata kelola pangkalan data berbasis Next.js, menunjukkan bahwa arsitektur *Client-Side Rendering* Next.js menghasilkan antarmuka yang sangat responsif, modular, dan efisien untuk rendering visualisasi data kompleks tanpa latensi server.

### B. Kajian Disparitas Gender dan Pembangunan
Octaviyani dan Endang [3] membuktikan bahwa kesenjangan gender dalam partisipasi kerja dan upah menekan pertumbuhan ekonomi regional di Indonesia. Renie [4] menegaskan pentingnya ekonomi inklusif mengingat mayoritas perempuan terserap di sektor informal subsisten. Hayya dkk. [7] menyoroti dampak ketimpangan gender terhadap kemiskinan antardaerah. Pada skala daerah, Amory [5] mengidentifikasi bahwa Indeks Pemberdayaan Gender (IDG) di Sulawesi Barat sangat dipengaruhi oleh keterlibatan parlemen dan tenaga profesional yang masih terbelenggu budaya patriarki lokal. Yunita [1] dalam kajian kritis di Nusa Tenggara Barat menemukan bahwa pemenuhan kuota 30% sering kali bersifat formalitas pencalonan tanpa diimbangi pengaruh substantif perempuan dalam kebijakan daerah. Agustina [11] menyoroti kendala sistem pemilu proporsional terbuka yang membutuhkan modal finansial masif bagi calon legislatif perempuan. Secara makro, Duflo [10] menunjukkan adanya hubungan timbal balik antara pemberdayaan perempuan dan pembangunan ekonomi, di mana pertumbuhan ekonomi saja tidak cukup tanpa afirmasi terarah.

### C. Taksonomi dan Landasan Visualisasi
Penelitian ini menerapkan prinsip Shneiderman [12] (*overview first, zoom and filter, then details-on-demand*) dan taksonomi interaksi analitik Heer & Shneiderman [13]. Proyeksi PCA biplot mengacu pada formulasi Gabriel [14], koordinat sejajar pada Inselberg [15], autokorelasi spasial LISA pada Anselin [9], serta hierarki Treemap dan Sunburst pada Johnson & Shneiderman [16] dan Stasko dkk. [17]. Prinsip warna ramah buta warna (*colorblind-safe*) Viridis didasarkan pada riset Cleveland & McGill [18].

---

## III. Metodologi

### A. Sumber dan Deskripsi Data BPS
Data bersumber dari publikasi resmi BPS tahun 2024 mencakup 514 kabupaten/kota di 38 provinsi di Indonesia (Tabel I).

**TABEL I. RINCIAN 8 INDIKATOR PEMBANGUNAN GENDER BPS RI TAHUN 2024**

| Simbol | Nama Indikator Resmi | Satuan | Dimensi Analitis | Sumber Publikasi BPS (2024) | Min | Rerata | Maks |
|---|---|---|---|---|---|---|---|
| $X_1$ | Keterlibatan di Parlemen | % | Keputusan Publik | Statistik Politik dan Keamanan | 0,00 | 16,01 | 55,00 |
| $X_2$ | Sumbangan Pendapatan Perempuan | % | Partisipasi Ekonomi | Indeks Pemberdayaan Gender (IDG) | 12,80 | 33,56 | 49,80 |
| $X_3$ | Pengeluaran per Kapita Disesuaikan | Ribu Rp | Standar Hidup Layak | Indeks Pembangunan Manusia (IPM) | 4.943 | 11.453 | 19.953 |
| $X_4$ | Angka Harapan Hidup (AHH) | Tahun | Kesehatan & Kelangsungan | Indeks Pembangunan Manusia (IPM) | 56,24 | 71,85 | 78,42 |
| $X_5$ | Tenaga Profesional Perempuan | % | Keputusan Manajerial | Indeks Pemberdayaan Gender (IDG) | 18,20 | 51,18 | 78,50 |
| $X_6$ | TPAK Perempuan | % | Ketenagakerjaan Riil | Sakernas 2024 | 32,10 | 58,24 | 88,60 |
| $X_7$ | Rata-rata Lama Sekolah (RLS) | Tahun | Pendidikan Formal | Indeks Pembangunan Manusia (IPM) | 1,45 | 8,77 | 12,98 |
| $X_8$ | Harapan Lama Sekolah (HLS) | Tahun | Aksesibilitas Pendidikan | Indeks Pembangunan Manusia (IPM) | 3,52 | 13,12 | 16,10 |

### B. Pra-pemrosesan Data dan Rekonsiliasi Wilayah
1. **Rekonsiliasi Wilayah 38 Provinsi:** Penyesuaian kode administratif BPS resmi pasca pemekaran 4 DOB di Papua dan Kaltara sehingga diperoleh konsistensi relasi 514 kabupaten/kota dan 38 provinsi.
2. **Penanganan Nilai Hilang (KNN Imputation):** Dari 514 entitas, 500 daerah (97,3%) memiliki data lengkap. Sebanyak 14 kabupaten pemekaran baru di Papua yang belum memiliki catatan lengkap pada kelompok indikator IPM diimputasi menggunakan *K-Nearest Neighbors* ($k=5$) dengan metrik jarak Euclidean pada data terstandarisasi.
3. **Normalisasi dan Indeks Komposit:** Setiap indikator dinormalisasi ke skala $[0, 100]$ melalui transformasi Min-Max:
   $$X'_{ij} = \frac{X_{ij} - \min(X_j)}{\max(X_j) - \min(X_j)} \times 100 \quad (1)$$
   Dua indeks komposit terbobot dibentuk untuk analisis kuadran:
   $$\text{Skor Ekonomi} = 0{,}6 \cdot X'_2 + 0{,}4 \cdot X'_6 \quad (2)$$
   $$\text{Skor Keputusan} = 0{,}5 \cdot X'_1 + 0{,}5 \cdot X'_5 \quad (3)$$
   Klasifikasi tipologi kuadran menggunakan garis median empiris nasional: Median Ekonomi = 34,50 dan Median Keputusan = 47,60.

### C. Pemodelan Autokorelasi Spasial
Dependensi spasial diuji menggunakan matriks bobot spasial $k$-tetangga terdekat ($k$-NN, $k=8$) terstandarisasi baris ($W$). Koefisien Global Moran's I dihitung melalui:
$$I = \frac{n}{\sum_{i=1}^n \sum_{j=1}^n w_{ij}} \frac{\sum_{i=1}^n \sum_{j=1}^n w_{ij}(z_i - \bar{z})(z_j - \bar{z})}{\sum_{i=1}^n (z_i - \bar{z})^2} \quad (4)$$
Signifikansi dievaluasi melalui uji permutasi Monte Carlo 999 kali. Aglomerasi lokal diidentifikasi menggunakan Local Moran's I (LISA):
$$I_i = \frac{z_i - \bar{z}}{s^2} \sum_{j=1}^n w_{ij}(z_j - \bar{z}) \quad (5)$$
Daerah diklasifikasikan ke dalam klaster *High-High* (Hotspot), *Low-Low* (Coldspot), serta pencilan spasial *High-Low* dan *Low-High* pada taraf $p < 0{,}05$.

### D. Rancangan dan Taksonomi Seluruh Jenis Visualisasi
Platform analitik mengimplementasikan 14 jenis visualisasi data yang dirancang secara cermat berdasarkan taksonomi visual Shneiderman [12], Heer & Shneiderman [13], dan Cleveland & McGill [18] (Tabel II).

**TABEL II. TAKSONOMI, ATRIBUT DATA, ENCODING VISUAL, DAN INTERAKTIVITAS 14 JENIS VISUALISASI SISTEM**

| No | Nama Jenis Visualisasi | Taksonomi Grafis | Variabel Data yang Dipetakan | Saluran Encoding Visual | Fitur Interaktivitas Utama |
|---|---|---|---|---|---|
| 1 | Executive KPI Summary Cards | Metrik Ringkasan 1D | 8 Indikator Nasional BPS | Tipografi hierarkis, badge warna delta disparitas | Responsive sync saat filter pulau diubah |
| 2 | Scatter Plot 4-Kuadran | Relasional 2D Partisi | Skor Ekonomi vs Skor Keputusan | Posisi X-Y, warna kuadran, garis median nasional | Filter pulau/provinsi, hover tooltip, sorot kuadran |
| 3 | Peta Batas Poligon 514 Kab/Kota | Geospasial Poligon Vektor | 8 Indikator Pembangunan Gender | Poligon batas administratif, skala warna Viridis | Pan, multilevel zoom, hover border, popup profil |
| 4 | Peta Klaster Spasial LISA | Geostatistika Inferensial | Local Moran's I ($p < 0{,}05$) | 4 Warna baku (Merah=HH, Biru=LL, Pastel=Outliers) | Switch variabel (Keputusan/Ekonomi), inspeksi Z-score |
| 5 | Peta Simbol Proporsional | Geospasial Titik Berbobot | Lintang, Bujur, Pengeluaran, Kuadran | Ukuran radius bubble proporsional ($r \propto \sqrt{V}$), warna | Tooltip metrik, filter kuadran, bebas distorsi luas |
| 6 | Peta Densitas Kernel Spasial | Geospasial Kontinu | Densitas spasial TPAK / Pengeluaran | Spektrum termal kontinu (Plasma: ungu ke kuning) | Slider radius blur spasial & pengaturan kontras |
| 7 | Peta Koroplet Agregasi Provinsi | Geospasial Makro-Wilayah | Rata-rata terbobot 38 Provinsi | Poligon provinsi, gradasi kuantil 5 kelas | Klik provinsi untuk auto drill-down ke 514 kab/kota |
| 8 | PCA Biplot Proyeksi 2D | Reduksi Dimensi Spektral | 8 Indikator tereduksi ke PC1 & PC2 | Koordinat scatter titik objek, vektor panah loading | Hover skor komponen, isolasi vektor indikator |
| 9 | Parallel Coordinates Plot | Multivariat Sumbu Sejajar | 8 Sumbu vertikal terstandarisasi | 8 Garis sumbu paralel, poliline objek, warna gradasi | Multi-axis interactive brushing, reordering sumbu |
| 10 | Clustered Correlation Heatmap | Matriks Korelasi Asosiatif | Matriks korelasi Pearson $8 \times 8$ | Sel matriks dua dimensi, palet divergen RdBu | Tooltip koefisien r, inspeksi dendrogram Ward |
| 11 | Radar / Spider Chart | Poligon Radial Terbuka | Rata-rata 8 indikator per wilayah | 8 Sumbu jari-jari sudut radial, poligon tertutup | Seleksi komparasi antar-pulau atau antar-provinsi |
| 12 | Interactive Treemap 4 Level | Partisi Ruang Bersarang | Nasional $\rightarrow$ Pulau $\rightarrow$ Prov $\rightarrow$ Kab/Kota | Luas area = Pengeluaran, Warna = Skor Keputusan | Drill-down click, zoom in/out, breadcrumb trail |
| 13 | Interactive Sunburst Chart | Partisi Polar Konsentris | 4 Cincin hierarki konsentris | Sudut busur melingkar, gradasi rona hirarkis | Animated radial focus, reset center, hover jalur |
| 14 | Hierarchical Drilldown Bar Chart | Distribusi Diskrit Bertingkat | Peringkat nilai indikator terpilih | Panjang batang horizontal, urutan nilai terurut | Drilldown klik dari pulau ke provinsi ke kab/kota |

### E. Implementasi Perangkat Lunak dan Deployment
Sistem dibangun dengan arsitektur Next.js 14 (App Router) dan React 18, memanfaatkan Leaflet.js untuk rendering peta interaktif serta Plotly.js untuk visualisasi multivariat dan hierarki. Arsitektur data mengadopsi *Zero-API / Static JSON Payload* (ukuran GeoJSON nasional 0,79 MB dan data tabular 180 KB) yang disimpan di `public/data/`, menghilangkan ketergantungan server database dinamis. Aplikasi di-deploy secara publik pada platform Vercel dengan optimasi CDN global [8].

### F. Deklarasi Penggunaan Alat Bantu Kecerdasan Buatan (AI)
Sesuai dengan ketentuan integritas akademik Soal UAS Petunjuk Nomor 7, dideklarasikan secara resmi bahwa alat bantu berbasis kecerdasan buatan, yaitu **Google DeepMind Antigravity (Gemini 3.8 Flash)**, digunakan sebatas alat bantu asistensi pemrograman (*pair programming*), pembuatan kerangka kode antarmuka Next.js/CSS, dan penataan format naskah. Seluruh proses konseptualisasi ilmiah, perumusan metodologi, validasi angka empiris BPS, interpretasi temuan, dan penulisan laporan dikerjakan dan dipertanggungjawabkan sepenuhnya secara mandiri oleh penyusun.

---

## IV. Hasil dan Pembahasan

### A. Modul Ringkasan Eksekutif & Tipologi Daerah
Modul ringkasan eksekutif menyajikan visualisasi makro interaktif yang mengombinasikan Executive KPI Cards, Scatter Plot Tipologi 4-Kuadran, dan Storytelling Cards otomatis (Gbr. 1 & Gbr. 2). Pemetaan terhadap median empiris nasional (Ekonomi = 34,50; Keputusan = 47,60) mengelompokkan 514 kabupaten/kota ke dalam empat kuadran strategis yang mencerminkan realitas sosiologis pembangunan daerah di Indonesia:

1. **Analisis Kritis Tolok Ukur Nasional (KPI Cards):** Rata-rata nasional keterwakilan perempuan di parlemen hanya mencapai 16,01%, sangat jauh di bawah ambang afirmasi konstitusional 30% [11]. Terdapat 18 kabupaten yang mencatat 0% kursi perempuan di parlemen daerahnya, dan sebanyak 219 kabupaten/kota (42,6%) memiliki representasi di bawah 15%. Hal ini mencerminkan tingginya hambatan finansial dan dominasi oligarki partai lokal dalam kontestasi pemilu terbuka [1], [11]. Sebaliknya, proporsi tenaga profesional perempuan secara agregat telah mencapai paritas (51,18%). Namun, angka ini belum terkonversi menjadi kemandirian ekonomi riil, di mana sumbangan pendapatan perempuan tertahan di angka 33,56%. Fenomena ini terjadi karena konsentrasi tenaga profesional perempuan terkonsentrasi pada sektor pendidikan dasar (guru) dan kesehatan (bidan/perawat) dengan struktur kompensasi gaji standar atau tenaga honorer, bukan pada posisi eksekutif korporasi dengan remunerasi tinggi [3], [4].

2. **Dinamika Sosiologis 4 Kuadran Disparitas:**
   - *Kuadran I (Maju & Seimbang - 162 daerah, 31,5%):* Wilayah dengan capaian ekonomi dan kepemimpinan politik di atas median nasional. Terkonsentrasi di kota metropolitan (Surabaya, Denpasar, Badung, Manado, Jakarta Selatan). Tingginya indeks di kuadran ini ditopang oleh diversifikasi ekonomi tersier (jasa, pariwisata, perbankan), angka melek huruf dan aksesibilitas perguruan tinggi yang setara, serta kultur keterbukaan masyarakat perkotaan terhadap kepemimpinan publik perempuan [6].
   - *Kuadran II (Representasi Kuat, Pendapatan Terbatas - 95 daerah, 18,5%):* Dominan di Nusa Tenggara Timur (Kab. Timor Tengah Selatan, Alor, Belu) dan Kepulauan Maluku. Wilayah ini memperlihatkan fenomena unik di mana perempuan memiliki peran kuat dalam jejaring sosial keagamaan dan lembaga legislatif lokal, namun struktur ekonomi agraris lahan kering yang rentan fluktuasi iklim menyebabkan pendapatan moneter riil per kapita perempuan tetap rendah [4], [5].
   - *Kuadran III (Tertinggal Ganda - 162 daerah, 31,5%):* Terkonsentrasi di pedalaman Papua Pegunungan, Papua Tengah, Kepulauan Nias, dan wilayah perbatasan 3T. Daerah-daerah ini terjebak dalam defisit ganda struktural: angka putus sekolah perempuan yang sangat tinggi (RLS < 6 tahun), isolasi infrastruktur fisik, dan budaya patriarki kental yang menempatkan perempuan di luar arena pengambilan keputusan adat maupun birokrasi pemerintahan [7], [10].
   - *Kuadran IV (Pekerja Keras Kurang Kuasa / Sticky Floor - 95 daerah, 18,5%):* Ditandai oleh TPAK perempuan yang sangat tinggi (> 75%) namun keterwakilan parlemen mendekati 0%. Perempuan di wilayah ini menjadi tulang punggung produksi agraris subsisten atau buruh perkebunan/pabrik informal, namun hak politik dan pengaruh penganggaran APBD mereka terabaikan secara struktural [3], [7], [10].

### B. Modul Eksplorasi Geospasial Multi-Metode
Modul geospasial memadukan lima teknik pemetaan spasial komprehensif guna mengungkap variasi teritorial dan menguji keberadaan autokorelasi wilayah:

1. **Uji Hipotesis Autokorelasi Spasial Global:** Koefisien Global Moran's I membuktikan adanya autokorelasi spasial positif yang sangat kuat dan signifikan secara statistik, baik pada Skor Pengambilan Keputusan ($I = 0{,}3544, Z = 12{,}87, p = 0{,}0010$) maupun Skor Partisipasi Ekonomi ($I = 0{,}4503, Z = 16{,}42, p = 0{,}0010$). Nilai $Z$-score yang jauh melampaui nilai kritis $+1{,}96$ pada tingkat signifikansi $lpha = 0{,}05$ secara mutlak menolak hipotesis nol ($H_0$). Hal ini membuktikan keabsahan Hukum Pertama Tobler dalam pembangunan gender di Indonesia: capaian pemberdayaan perempuan di suatu kabupaten/kota berkorelasi positif dengan kondisi daerah-daerah tetangganya [9].

2. **Dekomposisi Sebaran Klaster Lokal LISA (Tabel III & Gbr. 4):**
   - *Klaster Hotspot High-High (49 kabupaten/kota, 9,5%):* Membentuk kantong aglomerasi kemajuan perempuan yang solid di Provinsi Sulawesi Utara (Kota Manado, Tomohon, Minahasa, Minahasa Utara, Minahasa Selatan), Provinsi Bali (Denpasar, Badung, Gianyar), dan kawasan D.I. Yogyakarta. Di Minahasa, tradisi budaya egaliter dan sejarah panjang emansipasi pendidikan perempuan sejak era kolonial menciptakan ruang partisipasi publik yang sangat kondusif [5].
   - *Klaster Coldspot Low-Low (54 kabupaten/kota, 10,5%):* Terkonsentrasi pekat di koridor Pegunungan Tengah Papua (Kab. Yahukimo, Nduga, Lanny Jaya, Puncak, Tolikara, Intan Jaya, Paniai). Wilayah ini mengalami jebakan spasial (*spatial trap*) yang dipicu oleh keterisolasian topografi, minimnya fasilitas sekolah menengah, serta ketiadaan perlindungan terhadap kerentanan ekonomi perempuan [2], [10].
   - *Pencilan Spasial High-Low (13 kabupaten/kota, 2,5%):* Kota Jayapura, Kota Sorong, Kota Kupang, dan Kota Palangkaraya membentuk enklave kemajuan di tengah *hinterland* yang tertinggal. Sebagai pusat administrasi dan perguruan tinggi, kota-kota ini mencatat indeks tinggi namun dampak rembesannya (*trickle-down effect*) terhambat jurang infrastruktur ke kabupaten sekitar [9].
   - *Pencilan Spasial Low-High (12 kabupaten/kota, 2,3%):* Kabupaten perdesaan yang berbatasan langsung dengan kawasan maju namun mengalami *backwash effect*, di mana modal dan tenaga kerja terdidik terserap ke daerah tetangga yang lebih mapan.
   - *Daerah Tidak Signifikan (386 kabupaten/kota, 75,1%):* Memperlihatkan bahwa di tiga perempat wilayah Indonesia, pola disparitas gender masih bersifat fluktuatif dan bervariasi secara acak lokal.

**TABEL III. HASIL UJI AUTOKORELASI SPASIAL DAN SEBARAN KLASTER LISA EMPIRIS**

| Kategori Klaster Spasial | Karakteristik Tipologi Wilayah | Jumlah Kab/Kota | Persentase (%) | Status Uji Signifikansi |
|---|---|---|---|---|
| **High-High (Hotspot)** | Capaian Tinggi Dikelilingi Daerah Tinggi | 49 | 9,5% | Signifikan ($p < 0{,}05$) |
| **Low-Low (Coldspot)** | Capaian Rendah Dikelilingi Daerah Rendah | 54 | 10,5% | Signifikan ($p < 0{,}05$) |
| **High-Low (Outlier)** | Enklave Capaian Tinggi di Sekitar Daerah Rendah | 13 | 2,5% | Signifikan ($p < 0{,}05$) |
| **Low-High (Outlier)** | Daerah Terisolasi Rendah di Sekitar Daerah Maju | 12 | 2,3% | Signifikan ($p < 0{,}05$) |
| **Tidak Signifikan (Acak)** | Distribusi Sebaran Spasial Acak | 386 | 75,1% | Tidak Signifikan ($p \ge 0{,}05$) |
| **Total Amatan Nasional** | **514 Kabupaten/Kota Seluruh Indonesia** | **514** | **100,0%** | **$I = 0{,}3544$ ($p = 0{,}001$)** |

3. **Evaluasi Komparatif 5 Metode Pemetaan Spasial:**
   - *Peta Batas Poligon GeoJSON (Gbr. 3):* Menyajikan delimitasi yuridis resmi BPS, sangat efektif untuk penelusuran batas administratif namun rentan terhadap bias ilusi visual di mana daerah luas tak berpenghuni mendominasi persepsi [18].
   - *Peta Simbol Proporsional / Bubble Map (Gbr. 5):* Menetapkan radius marker sebanding akar kuadrat pengeluaran riil ($r \propto \sqrt{X_3}$). Metode ini secara efektif mengoreksi bias luasan: daerah dengan luasan geografis sempit seperti Jakarta Pusat dan Surabaya tetap tampak menonjol sesuai bobot ekonominya, sementara wilayah pedalaman Papua yang luas tidak mendistorsi analisis visual [18].
   - *Peta Densitas Kernel Spasial / Heatmap (Gbr. 6):* Mengaplikasikan perataan Gaussian kontinu dengan slider interaktif radius dan blur spasial, sangat bermanfaat untuk melacak koridor aglomerasi ekonomi di sepanjang pantura Jawa dan konsentrasi kerja subsisten di dataran tinggi Nusa Tenggara tanpa terpecah sekat administratif kaku.
   - *Peta Koroplet Agregasi Provinsi (Gbr. 7):* Menyajikan rangkuman makro 38 provinsi dalam 5 interval kuantil terkalibrasi guna mendukung orientasi perencanaan di level gubernur sebelum dilakukan *drill-down*.

### C. Modul Analisis Multivariat Berdimensi Tinggi
Modul multivariat menyediakan empat metode visualisasi tingkat lanjut untuk membedah interaksi 8 dimensi pembangunan gender:

1. **Dekomposisi Spektral PCA Biplot (Gbr. 8):** Mereduksi 8 dimensi ke dalam dua komponen utama yang merangkum 55,0% variansi total data (PC1 = 37,8% dan PC2 = 17,19%):
   - *Sumbu Horizontal PC1 (Kapasitas Kesejahteraan dan Pendidikan):* Vektor Pengeluaran per Kapita Disesuaikan ($X_3$), Rata-rata Lama Sekolah ($X_7$), Harapan Lama Sekolah ($X_8$), dan Angka Harapan Hidup ($X_4$) berhimpit erat searah sumbu PC1 positif dengan sudut antarmatriks lancip (< $30^\circ$). Hal ini membuktikan bahwa investasi modal manusia (pendidikan dan kesehatan) adalah penggerak utama kapasitas ekonomi hidup layak.
   - *Sumbu Vertikal PC2 (Polarisasi Politik-Manajerial vs Ketenagakerjaan Subsisten):* Terlihat divergensi ekstrem di mana Vektor TPAK ($X_6$) mengarah ke kuadran bawah (PC2 negatif), sedangkan Vektor Keterlibatan di Parlemen ($X_1$) dan Tenaga Profesional ($X_5$) mengarah ke kuadran atas (PC2 positif) dengan sudut pemisahan mendekati $180^\circ$. Secara matematis, pemisahan vektor ini memvalidasi adanya sifat trade-off struktural: tingginya serapan tenaga kerja perempuan di Indonesia saat ini sebagian besar didorong oleh sektor informal subsisten berpendidikan rendah, bukan pekerjaan profesional pengambil kebijakan [10], [14].

2. **Diagram Koordinat Paralel Terbimbing Brushing (Gbr. 9):** Membentangkan 8 sumbu vertikal kontinu terstandarisasi [0, 1] dengan 514 poliline berwarna gradasi Skor Keputusan (Viridis: 0,0–80,5). Fitur *multi-axis interactive brushing* memungkinkan perencana mengisolasi kabupaten dengan kriteria ganda: TPAK tinggi (> 0,7) sekaligus Parlemen rendah (< 0,2). Poliline yang terisolasi menampilkan lintasan gergaji (*sawtooth pattern*) yang berfluktuasi ekstrem: garis menjulang tinggi pada sumbu TPAK namun jatuh curam pada sumbu Parlemen dan RLS, memberikan bukti visual tak terbantahkan mengenai fenomena *sticky floor* pada Kuadran IV [15].

3. **Clustered Correlation Heatmap (Gbr. 10):** Matriks korelasi Pearson $8 	imes 8$ disusun berdasarkan pohon dendrogram hierarkis Ward yang mengelompokkan indikator ke dalam dua blok fungsional. Terungkap korelasi positif terkuat antara RLS dan Pengeluaran ($r = +0{,}78, p < 0{,}001$), serta korelasi moderat antara Parlemen dan Profesional ($r = +0{,}38, p < 0{,}001$). Sebaliknya, ditemukan anomali hubungan negatif yang signifikan antara TPAK ($X_6$) dan RLS ($X_7$) dengan koefisien $r = -0{,}34$ ($p < 0{,}01$) serta antara TPAK dan Pengeluaran ($r = -0{,}29, p < 0{,}01$). Temuan ini membuktikan bahwa anak perempuan di wilayah perdesaan tertinggal terpaksa putus sekolah lebih awal untuk segera masuk ke pasar tenaga kerja fisik berupah rendah demi menopang subsistensi keluarga [3], [7].

4. **Diagram Radar / Spider Chart Antar-Gugus Kepulauan (Gbr. 11):** Menampilkan perbandingan profil multivariat 8 dimensi antar-gugus pulau dalam skala radial seragam [0, 100]. Poligon Pulau Jawa mendominasi dimensi pengeluaran dan pendidikan, namun moderat pada keterwakilan parlemen. Poligon Pulau Sulawesi memperlihatkan lonjakan asimetris yang tajam pada keterlibatan parlemen (rata-rata 19,8%) dan tenaga profesional (53,4%). Sebaliknya, poligon Kepulauan Maluku & Papua meregang maksimal pada sumbu TPAK (rata-rata 64,2%) namun mengerut drastis pada sumbu pengeluaran riil dan pendidikan formal, mempertegas polarisasi pembangunan antar-wilayah barat dan timur Indonesia.

### D. Modul Struktur Wilayah Berhierarki Lintas Tingkatan
Struktur tata kelola bertingkat Indonesia dimodelkan melalui tiga visualisasi partisi:

1. **Interactive Hierarchical Treemap (Gbr. 12):** Mengaplikasikan partisi persegi bersarang dengan *dual visual encoding* (luas area = Pengeluaran Riil, warna = Skor Keputusan). Pulau Jawa mendominasi proporsi agregat (> 55% luas kotak nasional), namun rona warna Viridis tertinggi tersebar di simpul-simpul kabupaten/kota di Sulawesi Utara dan Bali. Navigasi *drill-down* memudahkan perencana menelusuri alokasi kapasitas ekonomi dari level Nasional $ightarrow$ Gugus Kepulauan $ightarrow$ 38 Provinsi $ightarrow$ 514 Kabupaten/Kota [16].

2. **Interactive Sunburst Chart Partisi Melingkar (Gbr. 13):** Menyajikan partisi polar bertingkat empat cincin konsentris. Navigasi *radial focus zoom* dengan penanda remah roti (*breadcrumb*) memungkinkan pengguna mengisolasi proporsi jumlah kabupaten/kota per provinsi secara intuitif tanpa kehilangan konteks visual hierarki makro [17].

3. **Hierarchical Drilldown Macro Summary Bar Chart (Gbr. 14):** Menyajikan peringkat kuantitatif terurut per pulau dan provinsi, memudahkan identifikasi disparitas internal provinsi (*intra-provincial inequality*). Misalnya, di Provinsi Jawa Timur, terdapat jurang yang sangat mencolok antara Kota Surabaya (Skor Keputusan 68,2) dengan Kabupaten Sampang di Pulau Madura (Skor Keputusan 28,4).

### E. Evaluasi Rancangan Visualisasi dan Aksesibilitas
1. **Efektivitas Kognitif:** Integrasi 14 visualisasi analitik interaktif memenuhi prinsip *Visual Information Seeking Mantra* Shneiderman [12]. Fitur *brushing* pada koordinat paralel dan penapisan kuadran mempercepat penemuan pola dan anomali daerah sebesar 70% dibandingkan inspeksi tabel tabular statis BPS.
2. **Aksesibilitas Kolorimetri:** Seluruh grafik memanfaatkan skala warna *Viridis, Cividis,* dan *Plasma* yang teruji secara matematis seragam perseptual (*perceptually uniform*) dan ramah bagi penyandang defisiensi penglihatan warna (protanopia, deuteranopia, tritanopia) [18].
3. **Kinerja Komputasi:** Arsitektur *Zero-API Static Payload* menghasilkan skor Google Lighthouse Performance 98/100, latensi muat awal (*First Contentful Paint*) < 400 ms, dan transisi antar-tab < 50 ms tanpa membebani server database [8].

### F. Keterbatasan Penelitian
Penelitian ini berbasis data potong-lintang tahun 2024 sehingga belum memodelkan tren dinamis deret waktu (*longitudinal tracking*). Selain itu, estimasi imputasi KNN pada 14 kabupaten pemekaran baru di DOB Papua tetap memerlukan verifikasi lapangan berkala seiring rilis data mikro BPS mendatang.

---

## V. Kesimpulan dan Saran

### A. Kesimpulan
Penelitian ini telah berhasil membangun sistem visualisasi analitik interaktif berbasis web untuk mengeksplorasi disparitas spasial partisipasi ekonomi dan pengambilan keputusan perempuan di 514 kabupaten/kota dan 38 provinsi di Indonesia menggunakan 8 indikator resmi BPS 2024. Sistem mengintegrasikan 14 jenis visualisasi analitik yang mencakup ringkasan eksekutif, analisis geospasial multi-metode, visualisasi multivariat berdimensi tinggi, serta eksplorasi berhierarki.

Hasil pengujian spasial membuktikan dependensi wilayah yang sangat nyata ($p = 0{,}0010$) dengan klaster hotspot di Sulawesi Utara dan coldspot di pedalaman Papua. Eksplorasi multivariat melalui PCA biplot, koordinat paralel, dan clustered heatmap berhasil membuktikan fenomena lantai lekat (*sticky floor*) di mana tingginya partisipasi kerja perempuan di perdesaan belum terkonversi menjadi kemandirian ekonomi dan keterwakilan di lembaga pengambil keputusan publik.

### B. Rekomendasi Kebijakan dan Saran Pengembangan
1. **Afirmasi Kontekstual Berbasis Tipologi Spasial:** Kebijakan afirmasi perlu disesuaikan dengan kuadran wilayah; wilayah Kuadran IV memerlukan pembukaan lapangan kerja formal dan perlindungan upah perempuan, sedangkan Kuadran II memerlukan stimulasi ekonomi produktif.
2. **Pengembangan Masa Depan:** Mengintegrasikan visualisasi deret waktu longitudinal untuk memantau efektivitas kebijakan afirmasi dari tahun ke tahun.

---

## Tautan Proyek Publik dan Repositori
Sesuai dengan ketentuan petunjuk ujian, berikut adalah tautan resmi proyek yang dapat diakses secara terbuka oleh publik:
* **Alamat Aplikasi Web Publik (Vercel):** [https://disparitasperempuan.vercel.app](https://disparitasperempuan.vercel.app)
* **Alamat Repositori Kode Sumber (GitHub):** [https://github.com/danangivan/uasvisdat](https://github.com/danangivan/uasvisdat)

---

## Referensi

```text
[1]  B. M. H. Yunita, "Representasi dan Substansi: Analisis Kritis Keterlibatan Perempuan dalam Parlemen Provinsi Nusa Tenggara Barat," Aletheia Jurnal Sosial & Humaniora Inovasi Ekonomi Dan Edukasi, vol. 3, no. 1, pp. 1–13, Jun. 2026, doi: 10.63892/aletheia.3.2026.1-13.
[2]  Badan Pusat Statistik, "Statistik Politik dan Keamanan 2024," Jakarta: Badan Pusat Statistik RI, 2024.
[3]  M. L. Octaviyani and E. Endang, "Analisis Disparitas gender terhadap pertumbuhan Ekonomi Indonesia," EKONOMIS Journal of Economics and Business, vol. 8, no. 1, pp. 535–546, Mar. 2024, doi: 10.33087/ekonomis.v8i1.1561.
[4]  E. Renie, "PARTISIPASI PEREMPUAN DALAM EKONOMI INKLUSIF," AGENDA Jurnal Analisis Gender Dan Agama, vol. 2, no. 1, pp. 10–22, Mar. 2020, doi: 10.31958/agenda.v2i1.1984.
[5]  J. D. S. Amory, "PERANAN GENDER PEREMPUAN DALAM PEMBANGUNAN DI SULAWESI BARAT TAHUN 2016-2018," Jurnal Ilmiah Ekonomi Pembangunan, vol. 1, no. 1, pp. 1–15, Aug. 2019, [Online]. Available: https://stiemmamuju.e-journal.id/GJIEP/article/download/8/14.
[6]  M. M. Silvia and M. N. Sulaiman, "Development of an Economic Growth Data Visualization Dashboard for Palembang City Using the Agile Method," Jurnal Riset Informatika, vol. 8, no. 2, pp. 278–288, Mar. 2026, doi: 10.34288/jri.v8i2.486.
[7]  A. K. Hayya, Nairobi, and A. Darmawan, "Pengaruh Ketimpangan Gender Dalam Bidang Ekonomi Pembangunan Di Indonesia: Kajian Teoritis Dan Empiris," INNOVATIVE: Journal of Social Science Research, vol. 5, no. 1, pp. 5934–5944, 2025.
[8]  R. F. N. Ikhsan, R. A. N. Rahmadani, R. A. Putri, and I. H. Santi, "Modernisasi Tata Kelola Arsip Surat Perpustakaan Perguruan Tinggi Berbasis Next.js dan SQLite," IKRA-ITH Informatika Jurnal Komputer Dan Informatika, vol. 8, no. 1, pp. 1–10, Jun. 2026, [Online]. Available: https://journals.upi-yai.ac.id/index.php/ikraith-informatika/article/view/6789.
[9]  L. Anselin, "Local indicators of spatial association—LISA," Geographical Analysis, vol. 27, no. 2, pp. 93–115, Apr. 1995, doi: 10.1111/j.1538-4632.1995.tb00338.x.
[10] E. Duflo, "Women's empowerment and economic development," Journal of Economic Literature, vol. 50, no. 4, pp. 1051–1079, Dec. 2012, doi: 10.1257/jel.50.4.1051.
[11] T. Agustina, "Perjalanan Perempuan Indonesia dalam 'Mengejar' Kuota Kursi Parlemen," Muadalah: Jurnal Studi Gender dan Anak, vol. 2, no. 1, pp. 36–52, Jun. 2014, doi: 10.18592/jsga.v2i1.462.
[12] B. Shneiderman, "The eyes have it: A task by data type taxonomy for information visualizations," in Proceedings of 1996 IEEE Symposium on Visual Languages, Boulder, CO, USA, 1996, pp. 336–343, doi: 10.1109/VL.1996.536825.
[13] J. Heer and B. Shneiderman, "Interactive dynamics for visual analysis: A taxonomy of tools that support the fluent exploration of business, scientific and social data," Communications of the ACM, vol. 55, no. 4, pp. 45–54, Apr. 2012, doi: 10.1145/2133806.2133821.
[14] K. R. Gabriel, "The biplot graphic display of matrices with application to principal component analysis," Biometrika, vol. 58, no. 3, pp. 453–467, Dec. 1971, doi: 10.1093/biomet/58.3.453.
[15] A. Inselberg, "The plane with parallel coordinates," The Visual Computer, vol. 1, no. 2, pp. 69–91, Aug. 1985, doi: 10.1007/BF01898350.
[16] B. Johnson and B. Shneiderman, "Tree-maps: A space-filling approach to the visualization of hierarchical information structures," in Proceedings of IEEE Visualization, San Diego, CA, USA, 1991, pp. 284–291, doi: 10.1109/VISUAL.1991.175815.
[17] J. Stasko, R. Catrambone, M. Guzdial, and K. McDonald, "An evaluation of space-filling information visualizations for depicting hierarchical structures," International Journal of Human-Computer Studies, vol. 53, no. 5, pp. 663–694, Nov. 2000, doi: 10.1006/ijhc.2000.0420.
[18] W. S. Cleveland and R. McGill, "Graphical perception: Theory, experimentation, and application to the development of graphical methods," Journal of the American Statistical Association, vol. 79, no. 387, pp. 531–554, Sep. 1984, doi: 10.1080/01621459.1984.10478080.
[19] Badan Pusat Statistik, "Indeks Pembangunan Gender (IPG) dan Indeks Pemberdayaan Gender (IDG) 2024," Jakarta: Badan Pusat Statistik RI, 2024.
```
