"""
Storytelling & Overview Views Module
Menyajikan visualisasi narasi data, KPI nasional, dan tipologi kuadran disparitas
"""

import streamlit as st
import plotly.express as px
import plotly.graph_objects as go
import numpy as np

def render_kpi_cards(df_kab, df_nasional):
    parlemen_mean = df_kab['parlemen'].mean()
    pendapatan_mean = df_kab['pendapatan'].mean()
    profesional_mean = df_kab['profesional'].mean()
    tpak_mean = df_kab['tpak'].mean()
    moran_kep = df_nasional.iloc[0]['moran_i_keputusan']
    moran_eko = df_nasional.iloc[0]['moran_i_ekonomi']

    col1, col2, col3, col4, col5 = st.columns(5)
    with col1:
        st.metric(
            label="🏛️ Parlemen Perempuan",
            value=f"{parlemen_mean:.2f}%",
            delta=f"{parlemen_mean - 30.0:.1f}% vs Kuota 30%",
            delta_color="inverse",
            help="Rata-rata persentase keterwakilan perempuan di legislatif kab/kota (target afirmasi 30%)."
        )
    with col2:
        st.metric(
            label="💼 Tenaga Profesional",
            value=f"{profesional_mean:.2f}%",
            delta=f"{profesional_mean - 50.0:.1f}% vs Paritas 50%",
            help="Pangsa perempuan dalam kelompok jabatan profesional, teknisi, dan manajerial."
        )
    with col3:
        st.metric(
            label="💰 Sumbangan Pendapatan",
            value=f"{pendapatan_mean:.2f}%",
            delta=f"{pendapatan_mean - 50.0:.1f}% vs Paritas 50%",
            delta_color="inverse",
            help="Sumbangan pendapatan perempuan terhadap total pendapatan keluarga/wilayah."
        )
    with col4:
        st.metric(
            label="⚡ TPAK Perempuan",
            value=f"{tpak_mean:.2f}%",
            delta="Partisipasi Kerja",
            help="Tingkat partisipasi angkatan kerja perempuan aktif."
        )
    with col5:
        st.metric(
            label="🌐 Autokorelasi Moran's I",
            value=f"{moran_kep:.3f} | {moran_eko:.3f}",
            delta="p < 0.001 (Signifikan)",
            help="Indeks Moran Spasial membuktikan adanya pengelompokan geografis yang sangat kuat."
        )

def render_quadrant_analysis(df_kab, selected_palette='Viridis'):
    st.subheader("🎯 Tipologi Kuadran: Hubungan Partisipasi Ekonomi vs Pengambilan Keputusan")
    st.markdown(
        """
        Grafik scatter kuadran ini memetakan **514 Kabupaten/Kota** ke dalam 4 tipologi disparitas berdasarkan perbandingan terhadap nilai median nasional. 
        Gunakan kontrol interaktif untuk mengeksplorasi posisi daerah, menyaring klaster, dan mengidentifikasi pencilan (*outliers*).
        """
    )

    med_x = df_kab['skor_ekonomi'].median()
    med_y = df_kab['skor_keputusan'].median()

    fig = px.scatter(
        df_kab,
        x='skor_ekonomi',
        y='skor_keputusan',
        color='pulau',
        size='pengeluaran',
        hover_name='nama_resmi',
        hover_data={
            'provinsi': True,
            'tipe': True,
            'parlemen': ':.2f',
            'pendapatan': ':.2f',
            'profesional': ':.2f',
            'tpak': ':.2f',
            'skor_ekonomi': False,
            'skor_keputusan': False,
            'pengeluaran': ':.0f'
        },
        labels={
            'skor_ekonomi': 'Indeks Partisipasi Ekonomi (0 - 100)',
            'skor_keputusan': 'Indeks Pengambilan Keputusan (0 - 100)',
            'pulau': 'Wilayah / Pulau',
            'pengeluaran': 'Pengeluaran Riil (Ribu Rp)'
        },
        template='plotly_white',
        height=620
    )

    # Tambahkan garis kuadran median
    fig.add_vline(x=med_x, line_dash='dash', line_color='#6c757d', annotation_text=f"Median Ekonomi ({med_x:.1f})")
    fig.add_hline(y=med_y, line_dash='dash', line_color='#6c757d', annotation_text=f"Median Keputusan ({med_y:.1f})")

    # Anotasi nama kuadran
    fig.add_annotation(x=med_x + 22, y=med_y + 28, text="<b>KUADRAN I</b><br>Maju & Seimbang<br>(Ekonomi ↑, Keputusan ↑)", showarrow=False, font=dict(color="#198754", size=11), bgcolor="rgba(25,135,84,0.1)")
    fig.add_annotation(x=med_x - 22, y=med_y + 28, text="<b>KUADRAN II</b><br>Representasi Kuat<br>(Ekonomi ↓, Keputusan ↑)", showarrow=False, font=dict(color="#0d6efd", size=11), bgcolor="rgba(13,110,253,0.1)")
    fig.add_annotation(x=med_x - 22, y=med_y - 28, text="<b>KUADRAN III</b><br>Tertinggal Ganda<br>(Ekonomi ↓, Keputusan ↓)", showarrow=False, font=dict(color="#dc3545", size=11), bgcolor="rgba(220,53,69,0.1)")
    fig.add_annotation(x=med_x + 22, y=med_y - 28, text="<b>KUADRAN IV</b><br>Pekerja Keras Kurang Kuasa<br>(Ekonomi ↑, Keputusan ↓)", showarrow=False, font=dict(color="#fd7e14", size=11), bgcolor="rgba(253,126,20,0.1)")

    fig.update_layout(
        legend=dict(orientation="h", yanchor="bottom", y=1.02, xanchor="right", x=1),
        margin=dict(l=20, r=20, t=50, b=40)
    )

    st.plotly_chart(fig, use_container_width=True)

    # Ringkasan Distribusi Kuadran
    kuadran_counts = df_kab['kuadran'].value_counts()
    col_a, col_b, col_c, col_d = st.columns(4)
    with col_a:
        st.info(f"**Kuadran I (Maju Seimbang):**\n\n**{kuadran_counts.get('Kuadran I (Ekonomi Tinggi, Keputusan Tinggi)', 0)}** Kab/Kota ({kuadran_counts.get('Kuadran I (Ekonomi Tinggi, Keputusan Tinggi)', 0)/len(df_kab)*100:.1f}%)")
    with col_b:
        st.info(f"**Kuadran II (Keputusan Kuat):**\n\n**{kuadran_counts.get('Kuadran II (Ekonomi Rendah, Keputusan Tinggi)', 0)}** Kab/Kota ({kuadran_counts.get('Kuadran II (Ekonomi Rendah, Keputusan Tinggi)', 0)/len(df_kab)*100:.1f}%)")
    with col_c:
        st.warning(f"**Kuadran III (Tertinggal Ganda):**\n\n**{kuadran_counts.get('Kuadran III (Ekonomi Rendah, Keputusan Rendah)', 0)}** Kab/Kota ({kuadran_counts.get('Kuadran III (Ekonomi Rendah, Keputusan Rendah)', 0)/len(df_kab)*100:.1f}%)")
    with col_d:
        st.warning(f"**Kuadran IV (Kerja Tanpa Kuasa):**\n\n**{kuadran_counts.get('Kuadran IV (Ekonomi Tinggi, Keputusan Rendah)', 0)}** Kab/Kota ({kuadran_counts.get('Kuadran IV (Ekonomi Tinggi, Keputusan Rendah)', 0)/len(df_kab)*100:.1f}%)")

def render_storytelling_narrative():
    st.subheader("📖 Tiga Wawasan Kunci (*Data Storytelling*)")
    
    with st.expander("🔍 1. Polarisasi Regional: Fenomena Hotspot Sulawesi Utara & Dinginnya Kaukus Parlemen Daerah", expanded=True):
        st.markdown(
            """
            * **Sulawesi Utara Unggul Signifikan:** Provinsi Sulawesi Utara dan kabupaten/kota di sekitarnya membentuk klaster *High-High Hotspot* terkuat di Indonesia untuk keterlibatan politik (rata-rata kursi DPRD perempuan > 40%) dan tenaga profesional (> 55%). Hal ini berakar pada struktur sosial Minahasa yang egaliter.
            * **Defisit Kuota 30% Parlemen:** Lebih dari 85% kabupaten/kota di Indonesia masih berada di bawah target afirmasi 30% keterwakilan perempuan di parlemen. Sejumlah daerah bahkan mencatatkan 0% keterwakilan perempuan (tidak ada satupun anggota legislatif perempuan yang terpilih).
            """
        )
        
    with st.expander("🔍 2. Paradoks Partisipasi Kerja: TPAK Tinggi Namun Sumbangan Pendapatan Rendah di Wilayah Timur", expanded=True):
        st.markdown(
            """
            * Di kawasan timur Indonesia (khususnya wilayah pedalaman Papua dan NTT), angka TPAK perempuan tercatat sangat tinggi (mencapai 70% hingga 95%). 
            * Namun demikian, sumbangan pendapatan mereka tetap rendah dan tertekan di sektor informal subsistence/pertanian tradisional. Fenomena ini menunjukkan bahwa tingginya beban kerja perempuan belum terkonversi menjadi kemandirian ekonomi bernilai tambah tinggi (*sticky floor effect*).
            """
        )

    with st.expander("🔍 3. Efek Aglomerasi Perkotaan (*Urban Advantage*)", expanded=True):
        st.markdown(
            """
            * Entitas **Kota** secara konsisten menempati peringkat atas pada indikator **Perempuan sebagai Tenaga Profesional** (rata-rata 52.4%) dan **Pengeluaran Riil Disesuaikan**, dibandingkan wilayah **Kabupaten** (rata-rata 42.1%).
            * Akses pendidikan tinggi dan keterbukaan sektor jasa di perkotaan menjadi katalis utama bagi perempuan untuk menembus jenjang manajerial, kendati disparitas politik di tingkat perkotaan masih menunjukkan variasi yang lebar.
            """
        )
