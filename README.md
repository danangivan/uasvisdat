# Eksplorasi Disparitas Spasial Partisipasi Ekonomi dan Pengambilan Keputusan Perempuan di 514 Kabupaten/Kota Indonesia Melalui Visualisasi Analitik

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)
[![Streamlit App](https://static.streamlit.io/badges/streamlit_badge_black_white.svg)](https://uasvisdat-gender-disparity-514.streamlit.app/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![HTML5 / CSS3 / JS](https://img.shields.io/badge/Stack-HTML5%20%7C%20CSS3%20%7C%20JS%20%7C%20JSON-orange.svg)](https://developer.mozilla.org/)
[![BPS Data](https://img.shields.io/badge/Data%20Source-BPS%20RI%202024-green.svg)](https://www.bps.go.id)

Repositori ini memuat kode sumber, data terolah (format CSV dan JSON), serta dokumentasi lengkap aplikasi visualisasi analitik interaktif yang dikembangkan untuk **Ujian Akhir Semester (UAS) Genap TA. 2025/2026** pada mata kuliah **Visualisasi Data dan Informasi**, Program Studi Komputasi Statistik, **Politeknik Statistika STIS**.

* **Dosen Pengampu:** Siti Mariyah, Ph.D. & Farid Ridho, M.T.
* **Tautan Aplikasi Publik (Vercel):** `https://[nama-proyek-anda].vercel.app/` *(atau tautan Streamlit)*
* **Tautan Repositori GitHub:** `https://github.com/[username]/uasvisdat-gender-disparity`

---

## 🌟 Ringkasan Proyek

Proyek ini menyajikan dasbor visualisasi analitik interaktif berbasis web untuk mengeksplorasi secara mendalam **disparitas spasial antara partisipasi ekonomi dan pengambilan keputusan perempuan di 514 kabupaten/kota dan 38 provinsi di Indonesia** menggunakan 8 indikator resmi Badan Pusat Statistik (BPS) tahun 2024.

Proyek ini tersedia dalam **dua arsitektur modern**:
1. **Frontend Web Statis (HTML5, CSS3, JavaScript, JSON, Leaflet.js, Plotly.js):** Siap di-deploy langsung ke **Vercel**, Netlify, atau GitHub Pages dalam hitungan detik tanpa perlu konfigurasi backend server.
2. **Aplikasi Berbasis Python Streamlit (`app.py`):** Siap di-deploy ke **Streamlit Community Cloud** atau Hugging Face Spaces.

#### Pemenuhan Ketentuan Soal UAS (3 dari 6 Topik Visualisasi):
1. **Visualisasi Data Berdimensi Tinggi (Multivariat):** Reduksi dimensi *Principal Component Analysis* (PCA) biplot, *Parallel Coordinates Plot* (*interactive brushing*), *Hierarchically Clustered Correlation Heatmap*, dan *Radar Chart* multidimensi.
2. **Visualisasi Data Geospasial:**
   - **Peta Batas & Poligon Tematik Kab/Kota (GeoJSON Shapefile):** Visualisasi poligon batas administratif kab/kota hasil ekstraksi shapefile BIG/BPS (595 KB, EPSG:4326) terintegrasi 8 indikator gender BPS 2024 tanpa membutuhkan API eksternal (*Zero-API / Offline-ready*). Dilengkapi kartu inspeksi detail instan.
   - **Peta Heatmap Spasial Kab/Kota (Kernel Density):** Permukaan gradien densitas spasial kontinu (*client-side canvas heatmap*) dengan kendali radius, blur, dan *toggle overlay* batas poligon administratif.
   - **Peta Simbol Proporsional (Bubble Map 514 Kab/Kota):** *Dual visual encoding* (ukuran lingkaran vs warna).
   - **Peta Choropleth Provinsi (34/38 Provinsi):** Poligon tematik provinsi dengan palet warna ramah buta warna (*Viridis, Cividis, Plasma, Turbo*).
   - **Peta Klaster Spasial LISA:** *Local Indicators of Spatial Association* (*Hotspot High-High, Coldspot Low-Low, Outlier*) dengan verifikasi statistik Global Moran's I ($p = 0{,}001$).
3. **Visualisasi Data Berhierarki:** *Interactive Treemap* dan *Sunburst Chart* 4 level (Nasional ➔ Pulau ➔ Provinsi ➔ Kab/Kota) dengan *dual visual encoding* (ukuran kotak vs warna) dan navigasi *breadcrumb drill-down*.

---

## 🏗️ Struktur Berkas Proyek

```text
uasvisdat/
├── [LapakGIS.com]_BATAS_KABKOTA_AR_EDISI_JULI_2026_.* # Shapefile mentah batas kabupaten/kota
├── extract_shp_to_geojson.py     # Skrip ekstraksi & penyederhanaan poligon SHP ke GeoJSON terintegrasi BPS
├── app/                          # Kode sumber Next.js App Router (Dashboard Interaktif)
│   ├── page.jsx                  # Komponen utama visualisasi analitik & kontrol spasial
│   ├── layout.jsx                # Layout, metadata, font, dan pemuatan skrip Leaflet/Plotly
│   └── globals.css               # Tata letak responsif & styling dashboard modern
├── public/
│   ├── leaflet-heat.js           # Plugin heatmap Leaflet mandiri (100% lokal, tanpa API eksternal)
│   └── data/
│       ├── kabkota_kalimantan.geojson # Poligon batas kab/kota hasil ekstraksi SHP (595 KB, EPSG:4326)
│       ├── kabkota_514.json      # Dataset 514 Kabupaten/Kota lengkap (JSON)
│       ├── provinsi_38.json      # Dataset 38 Provinsi (JSON)
│       ├── nasional.json         # Ringkasan statistik nasional & nilai Moran's I (JSON)
│       ├── pca_meta.json         # Koordinat vektor loading PCA dan variansi terjelaskan (JSON)
│       ├── correlation_matrix.json # Matriks korelasi terklaster hierarkis (JSON)
│       └── provinsi.geojson      # Batas poligon GeoJSON provinsi Indonesia
├── data/                         # Salinan data terstruktur untuk pengolahan data Python
├── vercel.json                   # Konfigurasi deployment Vercel
├── README.md                     # Dokumentasi komprehensif proyek
└── makalah/
    ├── makalah_ieee.docx         # Naskah makalah format resmi IEEE dua kolom (Word)
    ├── makalah_ieee.pdf          # Naskah makalah format IEEE siap kumpul (PDF)
    └── *.png                     # Gambar grafik publikasi beresolusi tinggi (300 DPI)
```

---

## ⚡ Panduan Deploy ke Vercel (Gratis & Sekejap)

Aplikasi web statis (`index.html`, `css/`, `js/`, `data/`) sangat optimal untuk di-deploy ke Vercel:

### Cara 1: Menggunakan GitHub (Paling Direkomendasikan)
1. Buat repositori baru di [GitHub](https://github.com/) (contoh: `uasvisdat-gender-disparity`).
2. Masukkan dan *push* seluruh isi folder proyek ke GitHub:
   ```bash
   git init
   git add .
   git commit -m "Deploy UAS Visdat Gender Disparity ke Vercel"
   git branch -M main
   git remote add origin https://github.com/[username-anda]/uasvisdat-gender-disparity.git
   git push -u origin main
   ```
3. Buka dashboard [Vercel](https://vercel.com/) dan masuk menggunakan akun GitHub Anda.
4. Klik **"Add New..."** ➔ **"Project"**.
5. Pilih repositori `uasvisdat-gender-disparity` yang baru di-push.
6. Pada bagian *Build & Development Settings*, biarkan default (*Framework Preset: Other*, tidak butuh build command karena murni statis HTML/CSS/JS/JSON).
7. Klik **"Deploy"**. Dalam hitungan detik, aplikasi Anda sudah tayang secara publik dengan domain:
   `https://[nama-proyek-anda].vercel.app`

### Cara 2: Menggunakan Vercel CLI
Jika Anda memiliki Node.js dan Vercel CLI:
```bash
npm install -g vercel
vercel login
vercel --prod
```

---

## 💻 Panduan Menjalankan Secara Lokal

### Menjalankan Versi Web Statis (HTML/CSS/JS/JSON):
Cukup jalankan server lokal sederhana agar berkas JSON dapat dibaca browser melalui protokol HTTP:
```bash
# Menggunakan Python:
python -m http.server 3000

# Atau menggunakan Node.js:
npx serve
```
Buka browser pada alamat `http://localhost:3000`.

### Menjalankan Versi Streamlit:
```bash
streamlit run app.py
```
Buka browser pada alamat `http://localhost:8501`.

---

## 📑 Temuan Empiris Kunci (*Key Insights*)

1. **Autokorelasi Spasial Signifikan ($p = 0{,}0010$):** Indeks Moran Global membuktikan bahwa partisipasi ekonomi ($I = 0{,}4503$) dan pengambilan keputusan perempuan ($I = 0{,}3544$) tidak tersebar acak di Indonesia, melainkan mengelompok kuat secara geografis.
2. **Hotspot Sulawesi Utara:** Menjadi klaster *High-High* terkuat secara nasional, didorong oleh tingginya keterwakilan legislatif (> 40%) dan tenaga profesional (> 55%).
3. **Paradoks Partisipasi Kerja Timur Indonesia (*Sticky Floor*):** Daerah pedalaman Papua dan Nusa Tenggara mencatatkan TPAK perempuan sangat tinggi (> 80%), namun sumbangan pendapatan riil mereka tetap rendah akibat dominasi sektor pertanian tradisional subsisten.
4. **Keunggulan Perkotaan (*Urban Advantage*):** Kota secara konsisten mengungguli kabupaten pada akses jabatan profesional (52.4% vs 42.1%) dan pengeluaran riil per kapita.

---

## 📄 Makalah Ilmiah Format IEEE
Naskah makalah telah disusun sesuai format IEEE dua kolom (6–8 halaman):
* [makalah_ieee.docx](file:///d:/uasvisdat/makalah/makalah_ieee.docx)
* [makalah_ieee.pdf](file:///d:/uasvisdat/makalah/makalah_ieee.pdf)
* [makalah_ieee.md](file:///d:/uasvisdat/makalah/makalah_ieee.md)
