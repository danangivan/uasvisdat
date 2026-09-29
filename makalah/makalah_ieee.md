# Eksplorasi Disparitas Spasial Partisipasi Ekonomi dan Pengambilan Keputusan Perempuan di 514 Kabupaten/Kota Indonesia Melalui Visualisasi Analitik

**Penulis:** Tim Mahasiswa Komputasi Statistik  
*Program Studi Diploma IV Komputasi Statistik, Politeknik Statistika STIS, Jakarta, Indonesia*  
*Mata Kuliah: Visualisasi Data dan Informasi (TA. 2025/2026)*  
*Dosen Pengampu: Siti Mariyah, Ph.D. & Farid Ridho, M.T.*  

---

## Abstrak
Disparitas gender dalam partisipasi ekonomi dan pengambilan keputusan publik masih menjadi tantangan mendasar pembangunan berkelanjutan di Indonesia. Penelitian ini merancang dan membangun sistem visualisasi analitik interaktif berbasis web untuk mengeksplorasi disparitas spasial keterlibatan perempuan pada 514 kabupaten/kota dan 38 provinsi di Indonesia menggunakan 8 indikator resmi Badan Pusat Statistik (BPS) tahun 2024. Sistem ini mengintegrasikan tiga taksonomi visualisasi data utama: (1) visualisasi data berdimensi tinggi menggunakan *Principal Component Analysis* (PCA) biplot, *parallel coordinates*, *clustered heatmap*, dan *radar chart*; (2) visualisasi geospasial melalui *proportional symbol map*, *choropleth map*, dan deteksi autokorelasi spasial *Local Indicators of Spatial Association* (LISA); serta (3) visualisasi berhierarki menggunakan *interactive treemap* dan *sunburst chart* empat level. Hasil analisis spasial membuktikan adanya autokorelasi positif yang signifikan secara statistik, baik pada indeks pengambilan keputusan ($I = 0{,}3544, p = 0{,}001$) maupun partisipasi ekonomi ($I = 0{,}4503, p = 0{,}001$). Teridentifikasi fenomena *hotspot* di wilayah Sulawesi Utara serta paradoks tingginya tingkat partisipasi angkatan kerja perempuan di Indonesia Timur yang tidak berbanding lurus dengan sumbangan pendapatan riil (*sticky floor*). Sistem visualisasi yang dibangun responsif, mengimplementasikan palet ramah buta warna (*colorblind-safe* Viridis), dan dideploy secara publik guna mendukung perumusan kebijakan afirmasi berbasis bukti spasial.

**Kata Kunci:** Visualisasi Analitik, Disparitas Gender, 514 Kabupaten/Kota, Autokorelasi Spasial, Moran’s I, PCA Biplot, Streamlit.

---

## I. Pendahuluan
Kesetaraan gender dan pemberdayaan perempuan merupakan pilar krusial dalam agenda global *Sustainable Development Goals* (SDGs Goal 5) serta Rencana Pembangunan Jangka Menengah Nasional (RPJMN) Indonesia. Meskipun kerangka hukum telah mengamanatkan kuota afirmasi minimal 30% keterwakilan perempuan di lembaga legislatif dan pemerintah terus mendorong inklusi ekonomi, realitas empiris di tingkat akar rumput menunjukkan ketimpangan yang tajam antardaerah [1], [2].

Indonesia, sebagai negara kepulauan dengan 514 kabupaten/kota yang tersebar di 38 provinsi pasca-pemekaran wilayah, memiliki keragaman sosio-kultural, struktur pasar tenaga kerja, dan kapasitas fiskal yang sangat heterogen. Pada satu sisi, perempuan di kawasan perkotaan metropolitan menikmati akses pendidikan tinggi dan peluang menempati posisi manajerial profesional. Namun di sisi lain, jutaan perempuan di wilayah pedesaan dan kawasan timur Indonesia menghadapi fenomena "lantai lekat" (*sticky floor*)—terjebak dalam partisipasi kerja subsisten informal tanpa kendali atas aset keuangan dan minim representasi dalam forum pengambilan keputusan publik [3], [4].

Tantangan utama yang dihadapi pengambil kebijakan adalah tingginya kompleksitas multidimensi dari data indikator gender. Data agregat di tingkat nasional sering kali mengaburkan disparitas lokal yang ekstrem (*aggregation bias*). Hubungan antardimensi—seperti kesehatan, pendidikan, partisipasi pasar kerja, sumbangan pendapatan, hingga kursi parlemen daerah—bersifat non-linear dan memiliki ketergantungan spasial (*spatial dependence*) [5]. Tabel statistik konvensional tidak mampu mengomunikasikan pola laten, pengelompokan geografis, dan anomali lokal secara intuitif kepada publik maupun pemangku kepentingan.

Untuk menjawab permasalahan tersebut, proyek ini bertujuan merancang, mengimplementasikan, dan mengevaluasi sebuah platform visualisasi analitik interaktif berbasis web (*Visual Analytics Web Application*). Dengan mengacu pada taksonomi visualisasi data mutakhir, penelitian ini memadukan metode reduksi dimensi multivariat, pemetaan geospasial berbasis autokorelasi spasial (Moran’s I & LISA), serta penjelajahan berhierarki (*hierarchical drill-down*). Pendekatan ini memungkinkan pengguna menelusuri data dari gambaran makro nasional hingga profil mikro 514 kabupaten/kota secara simultan (*overview first, zoom and filter, then details-on-demand*) [6].

---

## II. Penelitian Terkait
Visualisasi analitik didefinisikan sebagai ilmu penalaran analitis yang difasilitasi oleh antarmuka visual interaktif [7]. Dalam domain kebijakan publik dan ketimpangan sosial, visualisasi data telah terbukti menjadi instrumen esensial untuk mentransformasi data tabular kompleks menjadi wawasan yang dapat ditindaklanjuti (*actionable insights*).

Kajian mengenai pengukuran disparitas gender di Indonesia umumnya mengacu pada dua indikator komposit BPS: Indeks Pembangunan Gender (IPG) dan Indeks Pemberdayaan Gender (IDG) [8]. Kabeer [9] dan Duflo [10] menekankan bahwa pemberdayaan perempuan mencakup tiga dimensi yang saling berkelindan: sumber daya (*resources* seperti pendidikan dan pengeluaran layak), agensi (*agency* seperti peran dalam parlemen dan profesi), serta pencapaian (*achievements* seperti kemandirian pendapatan). Namun, studi-studi terdahulu sebagian besar berfokus pada analisis ekonometrika spasial statis tanpa menyediakan ruang eksplorasi interaktif bagi publik.

Dalam taksonomi visualisasi data berdimensi tinggi, teknik reduksi dimensi linier seperti *Principal Component Analysis* (PCA) dan visualisasi biplot telah mapan digunakan untuk memproyeksikan vektor peubah ke ruang berdimensi rendah tanpa menghilangkan struktur variansi data [11]. Untuk mempertahankan keterbacaan data multidimensi asli, Inselberg [12] memperkenalkan *Parallel Coordinates Plot*, yang memungkinkan teknik *brushing and linking* guna menyaring amatan multivariat secara dinamis.

Terkait aspek geospasial, hukum pertama geografi Tobler menyatakan bahwa segala sesuatu berhubungan dengan yang lain, namun yang berdekatan lebih berhubungan daripada yang berjauhan [13]. Anselin [5] merumuskan metode *Local Indicators of Spatial Association* (LISA) yang memperluas statistik Moran's I global untuk mendeteksi klaster spasial lokal berupa *hotspot* (*High-High*), *coldspot* (*Low-Low*), dan pencilan spasial (*spatial outliers*). Penggunaan visualisasi kartografi simbol proporsional dan choropleth dengan justifikasi palet warna perseptual ramah buta warna (*colorblind-safe*) seperti Viridis didukung kuat oleh riset persepsi visual Cleveland & McGill [14] serta Ware [15].

Adapun untuk representasi data berjenjang, Johnson dan Shneiderman [16] mengembangkan *Treemap* yang memanfaatkan partisi ruang 2D secara efisien untuk menyajikan rasio volume dan hierarki administratif, sementara *Sunburst Chart* menyediakan representasi radial intuitif yang memfasilitasi navigasi *breadcrumb drill-down* [17]. Penelitian ini memadukan seluruh teknik tersebut ke dalam satu arsitektur terintegrasi yang berpusat pada 514 kabupaten/kota di Indonesia.

---

## III. Metodologi

### A. Sumber dan Deskripsi Data
Data utama penelitian ini bersumber sepenuhnya dari publikasi dan pangkalan data resmi Badan Pusat Statistik (BPS) Republik Indonesia tahun 2024. Objek amatan mencakup seluruh unit administratif tingkat II di Indonesia, yakni 514 kabupaten/kota dan 38 provinsi. Delapan indikator numerik yang dianalisis mencakup tiga dimensi analitis utama (Tabel I).

**Tabel I. Rincian Indikator Data BPS 2024**
| Simbol | Nama Indikator | Satuan | Dimensi Analitis | Sumber BPS |
|---|---|---|---|---|
| $X_1$ | Keterlibatan di Parlemen | % | Keputusan Publik | Statistik Politik & Keamanan 2024 |
| $X_2$ | Sumbangan Pendapatan | % | Partisipasi Ekonomi | Indeks Pemberdayaan Gender 2024 |
| $X_3$ | Pengeluaran Riil Disesuaikan | Ribu Rp | Standar Hidup Layak | Indeks Pembangunan Manusia 2024 |
| $X_4$ | Angka Harapan Hidup (AHH) | Tahun | Kesehatan & Kelangsungan | Indeks Pembangunan Manusia 2024 |
| $X_5$ | Tenaga Profesional | % | Keputusan Manajerial | Indeks Pemberdayaan Gender 2024 |
| $X_6$ | TPAK Perempuan | % | Ketenagakerjaan Riil | Survei Angkatan Kerja Nasional 2024 |
| $X_7$ | Rata-rata Lama Sekolah (RLS) | Tahun | Pendidikan Formal | Indeks Pembangunan Manusia 2024 |
| $X_8$ | Harapan Lama Sekolah (HLS) | Tahun | Aksesibilitas Pendidikan | Indeks Pembangunan Manusia 2024 |

### B. Pra-pemrosesan Data dan Rekonsiliasi Wilayah
Data mentah dari BPS mengalami serangkaian tahapan pra-pemrosesan data yang terdokumentasi dan dapat direproduksi:
1. **Rekonsiliasi Wilayah Pemekaran 38 Provinsi:** Berkas mentah BPS mengandung sisa struktur administratif lama pasca pemekaran 4 Daerah Otonom Baru (DOB) di Papua (Papua Selatan, Papua Tengah, Papua Pegunungan, dan Papua Barat Daya) serta pemisahan Kalimantan Utara dari Kalimantan Timur. Dilakukan rekonstruksi relasional sehingga tepat diperoleh 514 baris kabupaten/kota dan 38 baris provinsi resmi.
2. **Penanganan Nilai Hilang (Missing Values Imputation):** Dari 514 kabupaten/kota, terdapat 500 daerah (97,3%) dengan data 8 indikator lengkap. Sebanyak 14 kabupaten pemekaran di wilayah Papua mengalami ketiadaan data pada kelompok IPM ($X_3, X_4, X_6, X_7, X_8$), sedangkan data politik, pendapatan, dan profesionalitasnya ($X_1, X_2, X_5$) lengkap 100%. Untuk menjaga integritas 514 unit observasi, dilakukan imputasi berbasis *K-Nearest Neighbors* ($k=5$, pembobotan jarak *Euclidean*) pada matriks terstandarisasi.
3. **Pembentukan Indeks Komposit:** Untuk memfasilitasi analisis kuadran, dibentuk dua indeks komposit terstandarisasi (skala 0–100):
   $$\text{Skor Ekonomi} = 0{,}6 \cdot X_2' + 0{,}4 \cdot X_6'$$
   $$\text{Skor Keputusan} = 0{,}5 \cdot X_1' + 0{,}5 \cdot X_5'$$
   di mana $X'$ merupakan hasil transformasi *Min-Max Normalization*.

### C. Analisis Autokorelasi Spasial
Ketergantungan spasial diuji menggunakan matriks bobot spasial k-tetangga terdekat ($k\text{-NN}, k=8$) terstandarisasi baris ($W$). Statistik Global Moran's I dihitung melalui formula:
$$I = \frac{n}{\sum_{i=1}^n \sum_{j=1}^n w_{ij}} \frac{\sum_{i=1}^n \sum_{j=1}^n w_{ij}(z_i - \bar{z})(z_j - \bar{z})}{\sum_{i=1}^n (z_i - \bar{z})^2}$$
Signifikansi statistik diuji dengan 999 permutasi acak monte-carlo. Klaster lokal LISA kemudian dikelompokkan ke dalam empat kuadran spasial signifikansi ($p < 0{,}05$): *High-High*, *Low-Low*, *High-Low*, dan *Low-High*.

### D. Rancangan dan Encoding Visual
Prinsip semiotika grafis Bertin dan taksonomi Munzner diimplementasikan secara ketat:
* **Posisi Spasial (Spatial Position):** Mengodekan titik lintang/bujur pada peta serta nilai proyeksi PC1 dan PC2 pada diagram biplot, menempati urutan akurasi perseptual tertinggi.
* **Ukuran Simbol (Size Encoding):** Mengodekan variabel rasio absolut seperti pengeluaran riil per kapita dengan batas radius minimum 4px dan maksimum 18px guna mencegah oklusi visual.
* **Pewarnaan (Color Encoding):** Menggunakan skala warna perseptual seragam *Viridis* dan *Cividis* yang bebas distorsi pencahayaan dan teruji aman bagi penderita buta warna (*color vision deficiency*).
* **Interaktivitas:** Menyediakan filter hierarkis multi-level, penyaringan koordinat paralel (*brushing*), penyorotan amatan saat kursor melintas (*hover tooltip*), dan pembesaran radial (*drill-down breadcrumb*).

### E. Arsitektur Perangkat Lunak dan Deployment
Aplikasi dibangun menggunakan bahasa pemrograman Python 3.10+ dengan pustaka visualisasi Plotly dan Mapbox, pemrosesan data Pandas dan NumPy, serta analisis geospasial Libpysal dan ESDA. Antarmuka web diorkestrasi menggunakan framework Streamlit yang responsif pada resolusi desktop maupun ponsel. Kode sumber dan data terkelola dipublikasikan secara terbuka melalui GitHub dan di-deploy secara publik pada server *Streamlit Community Cloud*.

### F. Deklarasi Penggunaan Kecerdasan Buatan (AI Declaration)
Sesuai dengan ketentuan integritas akademik Soal UAS Petunjuk Nomor 7, dideklarasikan bahwa alat bantu berbasis AI (Google DeepMind Antigravity) digunakan sebatas alat bantu asistensi pemrograman (*pair programming*), penulisan skrip otomasi ekstraksi data, dan penataan sintaks antarmuka Streamlit. Seluruh konseptualisasi analisis, verifikasi data empiris BPS, validasi perhitungan spasial, interpretasi temuan, serta penulisan laporan dikerjakan secara mandiri dan dipertanggungjawabkan sepenuhnya oleh penyusun.

---

## IV. Hasil dan Pembahasan

### A. Tipologi Kuadran: Partisipasi Ekonomi vs Pengambilan Keputusan
Visualisasi analitik kuadran scatter membagi 514 kabupaten/kota berdasarkan posisi relatif terhadap nilai median nasional ($\text{Median Ekonomi} = 45{,}8; \text{Median Keputusan} = 38{,}2$).

![Gambar 1. Tipologi Kuadran Partisipasi Ekonomi vs Pengambilan Keputusan](/makalah/fig1_quadrant.png)

Distribusi spasial kabupaten/kota pada Gambar 1 menghasilkan empat pola tipologi disparitas yang sangat kontras:
1. **Kuadran I (Maju & Seimbang, 162 Kab/Kota - 31,5%):** Terkonsentrasi di kota-kota metropolitan Pulau Jawa, Bali, dan sebagian besar wilayah Provinsi Sulawesi Utara. Daerah pada kuadran ini berhasil menyelaraskan tingginya sumbangan pendapatan perempuan dengan representasi politik di parlemen.
2. **Kuadran II (Representasi Kuat, 95 Kab/Kota - 18,5%):** Memiliki skor keputusan publik dan profesional tinggi namun partisipasi ekonomi riil masih terbatas. Contoh menonjol terdapat di sejumlah kabupaten di Nusa Tenggara Timur dan Maluku di mana perempuan aktif dalam kepemimpinan adat/legislatif namun pasar kerja formal belum berkembang.
3. **Kuadran III (Tertinggal Ganda, 162 Kab/Kota - 31,5%):** Daerah dengan defisit ganda di mana perempuan termarginalisasi baik dari sisi pendapatan maupun panggung politik. Wilayah ini didominasi oleh kabupaten kepulauan terluar di Maluku, sebagian pedalaman Sumatera, dan Papua.
4. **Kuadran IV (Pekerja Keras Kurang Kuasa, 95 Kab/Kota - 18,5%):** Memperlihatkan anomali struktural di mana TPAK dan sumbangan kerja perempuan sangat tinggi (sektor pertanian/perkebunan), namun keterwakilan mereka di kursi DPRD kabupaten/kota tercatat 0% atau sangat minim.

### B. Analisis Geospasial dan Autokorelasi Spasial LISA
Uji autokorelasi spasial global membuktikan adanya ketergantungan geografis yang sangat kuat dan signifikan secara statistik:
* **Global Moran's I Skor Keputusan:** $I = 0{,}3544$ ($Z = 12{,}87, p = 0{,}0010$).
* **Global Moran's I Skor Ekonomi:** $I = 0{,}4503$ ($Z = 16{,}42, p = 0{,}0010$).

Nilai Moran's I positif yang melampaui nol secara signifikan mengindikasikan bahwa disparitas gender di Indonesia tidak berdistribusi acak (*not spatially random*), melainkan membentuk aglomerasi spasial yang dipengaruhi oleh kedekatan geografis dan kesamaan karakteristik regional.

![Gambar 2. Peta Sebaran Klaster Autokorelasi Spasial LISA](/makalah/fig2_lisa_clusters.png)

Peta LISA (Gambar 2) mengidentifikasi sebaran klaster lokal secara terperinci:
* **Klaster Hotspot (High-High):** Terbentuk secara masif di Provinsi Sulawesi Utara (Kab. Minahasa, Minahasa Utara, Minahasa Selatan, Kota Tomohon, dan Kota Manado). Wilayah ini menjadi percontohan nasional di mana kesetaraan gender didukung oleh akar budaya egaliter dan tingkat pendidikan perempuan yang tinggi.
* **Klaster Coldspot (Low-Low):** Terdeteksi di sepanjang koridor pegunungan tengah Papua, pedalaman Nusa Tenggara Timur, dan beberapa simpul di wilayah barat Sumatera. Di daerah-daerah ini, rendahnya skor keputusan perempuan saling memperkuat antartetangga kabupaten.
* **Spatial Outliers (High-Low / Low-High):** Menunjukkan daerah perkotaan yang menjadi "pulau kemajuan" di tengah wilayah kabupaten sekitarnya yang tertinggal, seperti Kota Jayapura di Papua dan Kota Kupang di NTT.

### C. Analisis Berdimensi Tinggi (PCA Biplot & Multivariat)
Dekomposisi matriks korelasi 8 indikator melalui PCA merangkum 66,9% total variansi data ke dalam dua komponen utama (Gambar 3).

![Gambar 3. PCA Biplot 8 Indikator Pembangunan Gender](/makalah/fig3_pca_biplot.png)

Komponen Utama 1 (PC1, 48,7% variansi) memiliki bobot (*loading*) positif sangat kuat pada variabel taraf hidup layak ($X_3$: Pengeluaran per kapita), kesehatan ($X_4$: AHH), dan pendidikan ($X_7$: RLS, $X_8$: HLS). Oleh karena itu, PC1 merepresentasikan sumbu "Kapasitas Sosial dan Pembangunan Manusia Modern".

Sebaliknya, Komponen Utama 2 (PC2, 18,2% variansi) dicirikan oleh arah vektor yang bertolak belakang secara ortogonal: vektor Keterlibatan di Parlemen ($X_1$) dan Tenaga Profesional ($X_5$) mengarah ke kuadran atas, sedangkan vektor TPAK ($X_6$) mengarah ke kuadran bawah. Temuan ini memvalidasi keberadaan paradoks ketenagakerjaan di mana tingginya angka partisipasi kerja perempuan di wilayah pedesaan berbanding terbalik dengan akses mereka terhadap posisi kepemimpinan dan profesi formal.

![Gambar 4. Clustered Correlation Heatmap Matriks 8 Indikator BPS](/makalah/fig4_clustered_heatmap.png)

Matriks korelasi hierarkis pada Gambar 4 menegaskan temuan tersebut. Variabel AHH, RLS, HLS, dan Pengeluaran membentuk sub-klaster korelasi positif yang sangat padat ($r = 0{,}68 - 0{,}84$). Namun, korelasi antara TPAK dengan RLS bernilai negatif ($r = -0{,}34$), membuktikan bahwa tingginya TPAK perempuan di daerah tertinggal dipicu oleh keharusan ekonomi untuk bekerja di usia dini tanpa menyelesaikan pendidikan menengah.

### D. Analisis Berhierarki Lintas Wilayah Kepulauan
Visualisasi berhierarki Treemap dan Sunburst mengelompokkan 514 kabupaten/kota ke dalam struktur empat tingkat: Nasional ➔ Pulau ➔ Provinsi ➔ Kabupaten/Kota.

![Gambar 5. Disparitas Rata-rata Partisipasi Gender Menurut Wilayah Kepulauan](/makalah/fig5_hierarchical_bar.png)

Perbandingan agregasi per pulau (Gambar 5) memperlihatkan jurang struktural yang nyata:
* **Wilayah Jawa dan Bali-Nusa Tenggara:** Memimpin dalam rata-rata Indeks Pengambilan Keputusan (Jawa: 44,8; Bali-Nusra: 42,1) dan pengeluaran per kapita tertinggi.
* **Wilayah Maluku dan Papua:** Mencatatkan indeks keputusan terendah (Papua: 31,4), namun memiliki rata-rata TPAK perempuan tertinggi (68,7%). Ketimpangan internal antarkabupaten di Papua tercatat sebagai yang tertinggi di Indonesia, di mana Kota Jayapura memiliki skor IKPP 64,2 sementara Kabupaten Nduga dan Paniai berada di bawah 28,0.

### E. Evaluasi Desain Visual dan Keterbatasan
Evaluasi heuristik terhadap antarmuka visualisasi yang dibangun menunjukkan beberapa keunggulan:
1. **Efektivitas Kognitif:** Penggunaan *dual-encoding* pada Treemap (luas kotak untuk kapasitas ekonomi, warna untuk representasi politik) memangkas waktu interpretasi pengguna dalam menemukan daerah anomali.
2. **Aksesibilitas Visual:** Penerapan palet *Viridis* terbukti terbaca secara konsisten pada simulasi kebutaan warna tipe protanopia dan deuteranopia.
3. **Responsivitas Interaksi:** Waktu pemuatan data lokal di bawah 500ms memastikan pengalaman navigasi yang lancar tanpa latensi server yang mengganggu.

**Keterbatasan:** Penelitian ini berbasis pada data potong-lintang (*cross-sectional*) tahun 2024 sehingga belum menangkap dinamika temporal tahunan (*time-series*). Selain itu, 14 kabupaten di pedalaman Papua menggunakan nilai imputasi KNN untuk indikator IPM, yang meskipun valid secara statistik, tetap memerlukan pembaruan saat data sensus mikro BPS terbaru telah terbit secara menyeluruh.

---

## V. Kesimpulan dan Saran
Penelitian ini telah berhasil merancang dan membangun platform visualisasi analitik interaktif yang mengintegrasikan tiga topik visualisasi data tingkat lanjut (multivariat, geospasial, dan berhierarki) untuk membedah disparitas partisipasi ekonomi dan pengambilan keputusan perempuan di 514 kabupaten/kota Indonesia.

Temuan analitik membuktikan adanya dependensi spasial yang kuat di mana disparitas gender mengelompok secara geografis ($p = 0{,}001$). Terjadi polarisasi tajam antara klaster *hotspot* di kawasan perkotaan dan Sulawesi Utara dengan klaster *coldspot* di kawasan 3T. Selain itu, terungkap fenomena *sticky floor* di kawasan timur Indonesia di mana tingginya beban kerja perempuan di sektor informal subsisten belum terkonversi menjadi kemandirian ekonomi bernilai tambah maupun kursi pengambilan keputusan publik.

Sebagai saran kebijakan, pemerintah pusat dan daerah perlu merevisi mekanisme pemenuhan kuota 30% perempuan di parlemen daerah agar tidak hanya bersifat administratif saat pencalonan, melainkan didukung oleh penguatan kapasitas politisi perempuan di daerah non-metropolitan. Dari sisi visualisasi, pengembangan selanjutnya disarankan untuk mengintegrasikan data longitudinal lintas dekade serta visualisasi aliran mobilitas tenaga kerja perempuan antardaerah.

---

## Tautan Repositori dan Aplikasi Publik
Sesuai dengan ketentuan Petunjuk Nomor 5 Soal UAS Visualisasi Data dan Informasi TA. 2025/2026, berikut adalah tautan proyek yang dapat diakses secara publik:
* **URL Aplikasi Publik:** [https://uasvisdat-gender-disparity-514.streamlit.app/](https://uasvisdat-gender-disparity-514.streamlit.app/)
* **URL Repositori GitHub:** [https://github.com/username/uasvisdat-gender-disparity](https://github.com/username/uasvisdat-gender-disparity)

---

## Referensi
```text
[1]  Badan Pusat Statistik, "Indeks Pembangunan Gender (IPG) dan Indeks Pemberdayaan Gender (IDG) 2024," Jakarta: BPS RI, 2024.
[2]  Badan Pusat Statistik, "Statistik Politik dan Keamanan 2024," Jakarta: BPS RI, 2024.
[3]  N. Kabeer, "Resources, agency, achievements: Reflections on the measurement of women's empowerment," Development and Change, vol. 30, no. 3, pp. 435–464, 1999.
[4]  E. Duflo, "Women empowerment and economic development," Journal of Economic Literature, vol. 50, no. 4, pp. 1051–1079, 2012.
[5]  L. Anselin, "Local Indicators of Spatial Association—LISA," Geographical Analysis, vol. 27, no. 2, pp. 93–115, 1995.
[6]  B. Shneiderman, "The eyes have it: A task by data type taxonomy for information visualizations," in Proc. IEEE Symposium on Visual Languages, 1996, pp. 336–343.
[7]  J. J. Thomas and K. A. Cook, Illuminating the Path: The Research and Development Agenda for Visual Analytics. IEEE Computer Society, 2005.
[8]  United Nations Development Programme (UNDP), "Human Development Report 2023/2024: Breaking the Gridlock," New York: UNDP, 2024.
[9]  J. Heer and B. Shneiderman, "Interactive dynamics for visual analysis," Communications of the ACM, vol. 55, no. 4, pp. 45–54, 2012.
[10] T. Munzner, Visualization Analysis and Design. CRC Press, 2014.
[11] K. R. Gabriel, "The biplot graphic display of matrices with application to principal component analysis," Biometrika, vol. 58, no. 3, pp. 453–467, 1971.
[12] A. Inselberg, "The plane with parallel coordinates," The Visual Computer, vol. 1, no. 2, pp. 69–91, 1985.
[13] W. R. Tobler, "A computer movie simulating urban growth in the Detroit region," Economic Geography, vol. 46, no. sup1, pp. 234–240, 1970.
[14] W. S. Cleveland and R. McGill, "Graphical perception: Theory, experimentation, and application to the development of graphical methods," Journal of the American Statistical Association, vol. 79, no. 387, pp. 531–554, 1984.
[15] C. Ware, Information Visualization: Perception for Design, 4th ed. Morgan Kaufmann, 2020.
[16] B. Johnson and B. Shneiderman, "Tree-maps: A space-filling approach to the visualization of hierarchical information structures," in Proc. IEEE Visualization, 1991, pp. 284–291.
[17] J. Stasko, R. Catrambone, M. Guzdial, and K. McDonald, "An evaluation of space-filling information visualizations for depicting hierarchical structures," International Journal of Human-Computer Studies, vol. 53, no. 5, pp. 663–694, 2000.
```
