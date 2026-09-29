"""
========================================================================================
Aplikasi Visualisasi Analitik Interaktif:
Eksplorasi Disparitas Spasial Partisipasi Ekonomi dan Pengambilan Keputusan Perempuan
di 514 Kabupaten/Kota Indonesia

UAS Semester Genap TA. 2025/2026 - Politeknik Statistika STIS
Mata Kuliah: Visualisasi Data dan Informasi
Dosen: Siti Mariyah, Ph.D. & Farid Ridho, M.T.
========================================================================================
"""

import streamlit as st
import pandas as pd
import numpy as np

# Konfigurasi Halaman Streamlit
st.set_page_config(
    page_title="Disparitas Gender 514 Kab/Kota Indonesia - Visualisasi Analitik",
    page_icon="👩‍💼",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Import modul aplikasi internal
from src.data_loader import (
    load_kabkota_df,
    load_provinsi_df,
    load_nasional_df,
    load_prov_geojson,
    filter_dataframe,
    INDICATOR_METADATA,
    COLORBLIND_PALETTES
)
from src.storytelling_views import (
    render_kpi_cards,
    render_quadrant_analysis,
    render_storytelling_narrative
)
from src.geospatial_views import (
    render_proportional_symbol_map,
    render_choropleth_map,
    render_lisa_cluster_map
)
from src.multivariate_views import (
    render_pca_biplot,
    render_parallel_coordinates,
    render_clustered_heatmap,
    render_radar_chart
)
from src.hierarchical_views import (
    render_treemap,
    render_sunburst,
    render_hierarchical_summary_table
)

# Custom Styling CSS untuk tampilan responsif dan profesional
st.markdown("""
<style>
    .main-header {
        font-size: 2.1rem;
        font-weight: 700;
        color: #1a252f;
        margin-bottom: 0.2rem;
    }
    .sub-header {
        font-size: 1.05rem;
        color: #555;
        margin-bottom: 1.2rem;
    }
    .badge-source {
        background-color: #0d6efd;
        color: white;
        padding: 4px 10px;
        border-radius: 4px;
        font-size: 0.85rem;
        font-weight: 600;
        display: inline-block;
        margin-bottom: 1rem;
    }
    .stTabs [data-baseweb="tab-list"] {
        gap: 8px;
    }
    .stTabs [data-baseweb="tab"] {
        height: 48px;
        white-space: pre-wrap;
        background-color: #f8f9fa;
        border-radius: 6px 6px 0px 0px;
        padding-top: 10px;
        padding-bottom: 10px;
        font-weight: 600;
    }
    .stTabs [aria-selected="true"] {
        background-color: #e9ecef;
        color: #0d6efd;
        border-bottom: 3px solid #0d6efd;
    }
</style>
""", unsafe_allow_html=True)

# ----------------- LOAD DATA -----------------
df_kab_raw = load_kabkota_df()
df_prov_raw = load_provinsi_df()
df_nasional = load_nasional_df()
geojson_data = load_prov_geojson()

# ----------------- SIDEBAR CONTROLS -----------------
st.sidebar.image("https://upload.wikimedia.org/wikipedia/commons/2/28/Lambang_Politeknik_Statistika_STIS.png", width=75)
st.sidebar.markdown("### 🎛️ Filter Analisis Global")
st.sidebar.caption("Saring data 514 Kabupaten/Kota secara dinamis di seluruh tab.")

# Filter Wilayah Pulau
island_options = ['Semua Pulau'] + sorted(df_kab_raw['pulau'].unique().tolist())
selected_pulau_ui = st.sidebar.multiselect("Pilih Pulau / Region:", options=island_options, default=['Semua Pulau'])
selected_pulau = [] if 'Semua Pulau' in selected_pulau_ui else selected_pulau_ui

# Filter Provinsi (dinamis sesuai pulau)
if selected_pulau:
    available_provs = sorted(df_kab_raw[df_kab_raw['pulau'].isin(selected_pulau)]['provinsi'].unique().tolist())
else:
    available_provs = sorted(df_kab_raw['provinsi'].unique().tolist())

prov_options = ['Semua Provinsi'] + available_provs
selected_prov_ui = st.sidebar.multiselect("Pilih Provinsi:", options=prov_options, default=['Semua Provinsi'])
selected_prov = [] if 'Semua Provinsi' in selected_prov_ui else selected_prov_ui

# Filter Tipe Wilayah (Kabupaten vs Kota)
selected_tipe = st.sidebar.radio("Tipe Wilayah Administratif:", options=['Semua', 'Kabupaten', 'Kota'], horizontal=True)

# Filter Kuadran Tipologi
kuadran_options = ['Semua Kuadran'] + sorted(df_kab_raw['kuadran'].unique().tolist())
selected_kuadran_ui = st.sidebar.multiselect("Pilih Kuadran Tipologi:", options=kuadran_options, default=['Semua Kuadran'])
selected_kuadran = [] if 'Semua Kuadran' in selected_kuadran_ui else selected_kuadran_ui

# Filter Palet Warna Ramah Buta Warna (Colorblind-Safe)
st.sidebar.markdown("---")
st.sidebar.markdown("### 🎨 Pengaturan Estetika Visual")
selected_palette_name = st.sidebar.selectbox(
    "Palet Warna (Colorblind-Safe):",
    options=list(COLORBLIND_PALETTES.keys()),
    index=0,
    help="Palet Viridis dan Cividis dirancang khusus untuk memastikan kontras perseptual yang optimal dan ramah bagi penyandang buta warna (protanopia, deuteranopia)."
)
selected_palette = COLORBLIND_PALETTES[selected_palette_name]

# Terapkan filter data
df_kab = filter_dataframe(df_kab_raw, selected_pulau, selected_prov, selected_tipe, selected_kuadran)

st.sidebar.markdown("---")
st.sidebar.info(
    f"📊 **Data Terpilih:** **{len(df_kab)}** dari 514 Kab/Kota\n\n"
    f"🏛️ **Provinsi:** **{df_kab['provinsi'].nunique()}** dari 38 Provinsi\n\n"
    "**Sumber Data:** BPS (Badan Pusat Statistik, 2024)"
)

# ----------------- MAIN HEADER -----------------
st.markdown('<div class="main-header">Eksplorasi Disparitas Spasial Partisipasi Ekonomi & Pengambilan Keputusan Perempuan di Indonesia</div>', unsafe_allow_html=True)
st.markdown('<div class="sub-header">Analisis Visual Terpadu Berbasis 514 Kabupaten/Kota dan 38 Provinsi Menggunakan Data Resmi Badan Pusat Statistik (BPS 2024)</div>', unsafe_allow_html=True)
st.markdown('<span class="badge-source">🏛️ Sumber Data: BPS RI (2024) | Standar Ujian Akhir Semester TA. 2025/2026 Politeknik Statistika STIS</span>', unsafe_allow_html=True)

# ----------------- TABS NAVIGATION -----------------
tab1, tab2, tab3, tab4, tab5, tab6 = st.tabs([
    "📊 Ringkasan & Storytelling",
    "🗺️ Analisis Geospasial",
    "📈 Dimensi Tinggi (Multivariat)",
    "🌳 Analisis Berhierarki",
    "📑 Eksplorasi Data & Peringkat",
    "📘 Metodologi & Refleksi"
])

# ================= TAB 1: STORYTELLING & OVERVIEW =================
with tab1:
    st.markdown("### 📌 Indikator Kunci Nasional & Ringkasan Eksekutif")
    render_kpi_cards(df_kab, df_nasional)
    st.markdown("---")
    render_quadrant_analysis(df_kab, selected_palette)
    st.markdown("---")
    render_storytelling_narrative()

# ================= TAB 2: GEOSPATIAL ANALYSIS =================
with tab2:
    st.markdown("### 🗺️ Visualisasi Geospasial Disparitas Daerah (Tingkat Kab/Kota & Provinsi)")
    st.info("Peta ini menyajikan 3 sudut pandang spasial: Peta Simbol Proporsional 514 Kab/Kota, Peta Choropleth Provinsi, dan Peta Autokorelasi Spasial LISA (Moran's I).")
    
    geo_tab1, geo_tab2, geo_tab3 = st.tabs([
        "📍 Peta Simbol Proporsional (514 Kab/Kota)",
        "🗾 Peta Choropleth (Provinsi)",
        "🔬 Peta Klaster Spasial LISA"
    ])
    
    with geo_tab1:
        col_s1, col_s2 = st.columns(2)
        with col_s1:
            size_var = st.selectbox(
                "Pilih Variabel Ukuran Lingkaran (Size Encoding):",
                options=['pengeluaran', 'pendapatan', 'profesional', 'tpak'],
                index=0,
                format_func=lambda x: INDICATOR_METADATA.get(x, {}).get('nama', x)
            )
        with col_s2:
            color_var = st.selectbox(
                "Pilih Variabel Warna Lingkaran (Color Encoding):",
                options=['skor_keputusan', 'skor_ekonomi', 'parlemen', 'profesional', 'ikpp_komposit'],
                index=0,
                format_func=lambda x: INDICATOR_METADATA.get(x, {}).get('nama', x)
            )
        render_proportional_symbol_map(df_kab, size_var, color_var, selected_palette)

    with geo_tab2:
        choro_var = st.selectbox(
            "Pilih Indikator Choropleth Provinsi (Rasio/Persentase):",
            options=['parlemen', 'profesional', 'pendapatan', 'tpak', 'pengeluaran', 'ahh', 'rls', 'hls'],
            index=0,
            format_func=lambda x: INDICATOR_METADATA.get(x, {}).get('nama', x)
        )
        render_choropleth_map(df_prov_raw, geojson_data, choro_var, selected_palette)

    with geo_tab3:
        render_lisa_cluster_map(df_kab)

# ================= TAB 3: MULTIVARIATE ANALYSIS =================
with tab3:
    st.markdown("### 📈 Visualisasi Data Berdimensi Tinggi (Analisis Multivariat 8 Indikator)")
    st.caption("Memenuhi ketentuan: 1 teknik reduksi dimensi (PCA Biplot) + 3 teknik pelengkap (Parallel Coordinates, Clustered Heatmap, Radar Chart).")

    multi_tab1, multi_tab2, multi_tab3, multi_tab4 = st.tabs([
        "📉 PCA Biplot (Reduksi Dimensi)",
        "📊 Parallel Coordinates (Brushing)",
        "🌡️ Clustered Correlation Heatmap",
        "🕸️ Radar Profile Chart"
    ])

    with multi_tab1:
        render_pca_biplot(df_kab, selected_palette)
    with multi_tab2:
        render_parallel_coordinates(df_kab)
    with multi_tab3:
        render_clustered_heatmap(df_kab)
    with multi_tab4:
        render_radar_chart(df_kab)

# ================= TAB 4: HIERARCHICAL ANALYSIS =================
with tab4:
    st.markdown("### 🌳 Visualisasi Data Berhierarki / Berjenjang (Hierarchical Views)")
    st.caption("Memenuhi ketentuan: Minimal 3 level hierarki (Nasional ➔ Pulau ➔ Provinsi ➔ Kab/Kota), 2 representasi berbeda (Treemap & Sunburst), dan dual visual encoding (Ukuran vs Warna).")

    col_h1, col_h2 = st.columns(2)
    with col_h1:
        tree_size = st.selectbox(
            "Variabel Ukuran Kotak / Irisan:",
            options=['pengeluaran', 'pendapatan', 'tpak'],
            index=0,
            format_func=lambda x: INDICATOR_METADATA.get(x, {}).get('nama', x)
        )
    with col_h2:
        tree_color = st.selectbox(
            "Variabel Warna Kotak / Irisan:",
            options=['parlemen', 'profesional', 'skor_keputusan', 'ikpp_komposit', 'skor_ekonomi'],
            index=0,
            format_func=lambda x: INDICATOR_METADATA.get(x, {}).get('nama', x)
        )

    h_tab1, h_tab2, h_tab3 = st.tabs([
        "🌳 Treemap Interaktif",
        "☀️ Sunburst Chart",
        "📋 Rangkuman Agregasi Hierarkis"
    ])

    with h_tab1:
        render_treemap(df_kab, tree_size, tree_color, selected_palette)
    with h_tab2:
        render_sunburst(df_kab, tree_size, tree_color, selected_palette)
    with h_tab3:
        render_hierarchical_summary_table(df_kab)

# ================= TAB 5: DATA EXPLORER & RANKINGS =================
with tab5:
    st.markdown("### 📑 Eksplorasi Data 514 Kabupaten/Kota & Peringkat Nasional")
    st.caption("Pencarian, pemfilteran, dan pengunduhan dataset lengkap 514 kabupaten/kota hasil pemrosesan resmi.")

    search_query = st.text_input("🔍 Cari Nama Kabupaten/Kota atau Provinsi:", placeholder="Contoh: Bandung, Surabaya, Jayapura, Minahasa...")
    df_display = df_kab.copy()
    if search_query:
        df_display = df_display[
            df_display['nama_resmi'].str.contains(search_query, case=False, na=False) |
            df_display['provinsi'].str.contains(search_query, case=False, na=False)
        ]

    cols_table = [
        'kode_wilayah', 'nama_resmi', 'tipe', 'provinsi', 'pulau',
        'parlemen', 'pendapatan', 'profesional', 'tpak', 'pengeluaran', 'ahh', 'rls', 'hls',
        'skor_keputusan', 'skor_ekonomi', 'ikpp_komposit', 'kuadran'
    ]
    st.dataframe(
        df_display[cols_table].sort_values(by='ikpp_komposit', ascending=False).reset_index(drop=True),
        use_container_width=True,
        height=450
    )

    # Download Buttons
    col_dl1, col_dl2 = st.columns([1, 4])
    with col_dl1:
        csv_data = df_display[cols_table].to_csv(index=False).encode('utf-8')
        st.download_button(
            label="📥 Unduh CSV Data Terfilter",
            data=csv_data,
            file_name="disparitas_perempuan_514_kabkota_2024.csv",
            mime="text/csv"
        )

# ================= TAB 6: METHODOLOGY & AI DECLARATION =================
with tab6:
    st.markdown("### 📘 Metodologi, Sumber Data BPS, dan Deklarasi Integritas Akademik")
    
    with st.expander("📂 1. Sumber Data Resmi BPS (Tahun 2024)", expanded=True):
        st.markdown(
            """
            * **Indikator Partisipasi Politik:** *Keterlibatan Perempuan di Parlemen (%)* — Badan Pusat Statistik, Statistik Politik dan Keamanan 2024.
            * **Indikator Partisipasi Ekonomi & Pendapatan:** *Sumbangan Pendapatan Perempuan (%)* — Komponen Indeks Pemberdayaan Gender (IDG) BPS 2024.
            * **Indikator Manajerial/Keputusan:** *Perempuan sebagai Tenaga Profesional (%)* — Komponen IDG BPS 2024.
            * **Indikator Ketenagakerjaan:** *Tingkat Partisipasi Angkatan Kerja (TPAK) Perempuan (%)* — Survei Angkatan Kerja Nasional (Sakernas) BPS 2024.
            * **Indikator Kapasitas Sosial & Hidup Layak:** *Pengeluaran per Kapita Disesuaikan (Ribu Rp/thn)*, *Angka Harapan Hidup Perempuan (Tahun)*, *Rata-rata Lama Sekolah (Tahun)*, *Harapan Lama Sekolah (Tahun)* — Komponen Indeks Pembangunan Gender (IPG) dan IPM Metode Baru BPS 2024.
            * **Tanggal Akses Data:** September 2026.
            * **Atribusi Wajib:** *Sumber: BPS (Badan Pusat Statistik Republik Indonesia)*.
            """
        )

    with st.expander("⚙️ 2. Pra-pemrosesan Data & Penanganan Nilai Hilang", expanded=True):
        st.markdown(
            """
            * **Penyelarasan Pemekaran 38 Provinsi:** Rekonsiliasi pemekaran 4 provinsi baru di Papua (Papua Selatan, Papua Tengah, Papua Pegunungan, dan Papua Barat Daya) serta pemisahan Kalimantan Utara dari Kalimantan Timur agar mencakup persis **514 unit administratif resmi**.
            * **Penanganan Nilai Hilang (Missing Values):** Sebanyak 14 kabupaten di pedalaman Papua yang belum memiliki data pengeluaran/IPM terpisah diisi menggunakan metode **K-Nearest Neighbors (KNN Imputation, k=5, distance-weighted)** dengan mempertimbangkan kesamaan profil ketenagakerjaan, profesionalitas, dan letak geografis tetangga terdekat. Indikator politik, pendapatan, dan profesionalitas tetap menggunakan data observasi riil 100%.
            * **Standarisasi Skor Komposit (0 - 100):** Menggunakan normalisasi Min-Max untuk menghasilkan Indeks Partisipasi Ekonomi, Indeks Pengambilan Keputusan, dan Indeks Komposit Pemberdayaan Perempuan (IKPP).
            """
        )

    with st.expander("🎨 3. Justifikasi Desain & Visual Encoding", expanded=True):
        st.markdown(
            """
            * **Posisi (Position):** Sumbu kartesian pada kuadran scatter dan koordinat geografis (lintang/bujur) memiliki efektivitas persepsi tertinggi (Cleveland & McGill, 1984) untuk mendeteksi korelasi dan sebaran spasial.
            * **Warna (Color):** Seluruh visualisasi menggunakan palet perseptual seragam dan *colorblind-friendly* (**Viridis, Cividis, Plasma**) guna memastikan aksesibilitas bagi pengguna dengan defisiensi penglihatan warna (red-green colorblindness).
            * **Ukuran (Size):** Mengkodekan variabel rasio kontinu (misalnya pengeluaran riil atau TPAK) dengan batas skala maksimum terkontrol agar tidak terjadi tumpang tindih visual (*occlusion*).
            * **Interaktivitas:** Menyediakan *tooltips*, *filtering*, *zoom/pan*, *brushing & linking* pada koordinat paralel, serta *hierarchical drill-down* pada treemap dan sunburst.
            """
        )

    with st.expander("🤖 4. Deklarasi Penggunaan Alat Bantu Berbasis AI (Integritas Akademik)", expanded=True):
        st.markdown(
            """
            Sesuai dengan ketentuan Petunjuk Nomor 7 Soal UAS Visualisasi Data dan Informasi TA. 2025/2026:
            * **Alat Bantu AI yang Digunakan:** Large Language Model (Google DeepMind Antigravity) digunakan sebatas alat bantu asistensi pemrograman (*pair programming*), penulisan skrip otomasi ekstraksi data, dan penataan tata letak visualisasi Streamlit.
            * **Orisinalitas & Verifikasi:** Mahasiswa melakukan perancangan konsep, seleksi data BPS, justifikasi encoding, verifikasi akurasi data statistik (Moran's I dan PCA), serta penulisan narasi analisis makalah secara mandiri dan bertanggung jawab penuh atas seluruh isi proyek.
            """
        )

st.markdown("---")
st.caption("© 2026 Proyek UAS Visualisasi Data dan Informasi | Politeknik Statistika STIS | Dosen: Siti Mariyah, Ph.D. & Farid Ridho, M.T.")
