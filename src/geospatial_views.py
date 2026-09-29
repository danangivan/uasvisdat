"""
Geospatial Views Module
Menyajikan visualisasi geospasial: Proportional Symbol Map, Choropleth Map, dan Peta Klaster Spasial LISA (Moran's I)
"""

import streamlit as st
import plotly.express as px
import plotly.graph_objects as go
import pandas as pd
import numpy as np

def render_proportional_symbol_map(df_kab, size_col='pengeluaran', color_col='skor_keputusan', palette='Viridis'):
    st.markdown("#### 📍 1. Peta Simbol Proporsional (Proportional Symbol Map 514 Kab/Kota)")
    st.caption("Ukuran lingkaran merepresentasikan intensitas variabel ukuran, sedangkan warna merepresentasikan indikator performa.")

    # Normalisasi ukuran agar tidak terlalu raksasa di layar
    fig = px.scatter_mapbox(
        df_kab,
        lat="lat",
        lon="lon",
        size=size_col,
        color=color_col,
        color_continuous_scale=palette,
        size_max=18,
        zoom=3.8,
        center={"lat": -2.2, "lon": 118.0},
        mapbox_style="carto-positron",
        hover_name="nama_resmi",
        hover_data={
            "provinsi": True,
            "tipe": True,
            "parlemen": ':.2f',
            "pendapatan": ':.2f',
            "profesional": ':.2f',
            "tpak": ':.2f',
            "pengeluaran": ':.0f',
            size_col: True,
            color_col: True,
            "lat": False,
            "lon": False
        },
        height=580,
        title=f"Sebaran Spasial: Ukuran={size_col.upper()} | Warna={color_col.upper()}"
    )

    fig.update_layout(
        margin={"r":0,"t":40,"l":0,"b":0},
        coloraxis_colorbar=dict(title=color_col.replace('_', ' ').title())
    )
    st.plotly_chart(fig, use_container_width=True)

def render_choropleth_map(df_prov, geojson_data, selected_var='parlemen', palette='Viridis'):
    st.markdown("#### 🗺️ 2. Peta Choropleth Tingkat Provinsi (34/38 Provinsi)")
    st.caption("Visualisasi rasio/persentase agregat per provinsi dengan palet warna ramah buta warna (*colorblind-safe*).")

    if geojson_data is None:
        st.warning("Data GeoJSON batas wilayah tidak ditemukan. Menampilkan representasi titik agregat provinsi.")
        return

    # Normalisasi nama provinsi untuk pencocokan GeoJSON
    df_prov_map = df_prov.copy()
    # Peta kode atau nama di geojson: Propinsi di ans-4175 menggunakan uppercase tanpa spasi/simbol
    # Kita buat mapping nama
    prov_name_clean = {
        'Aceh': 'ACEH',
        'Sumatera Utara': 'SUMATERA UTARA',
        'Sumatera Barat': 'SUMATERA BARAT',
        'Riau': 'RIAU',
        'Jambi': 'JAMBI',
        'Sumatera Selatan': 'SUMATERA SELATAN',
        'Bengkulu': 'BENGKULU',
        'Lampung': 'LAMPUNG',
        'Kepulauan Bangka Belitung': 'KEPULAUAN BANGKA BELITUNG',
        'Kepulauan Riau': 'KEPULAUAN RIAU',
        'DKI Jakarta': 'DKI JAKARTA',
        'Jawa Barat': 'JAWA BARAT',
        'Jawa Tengah': 'JAWA TENGAH',
        'DI Yogyakarta': 'DAERAH ISTIMEWA YOGYAKARTA',
        'Jawa Timur': 'JAWA TIMUR',
        'Banten': 'BANTEN',
        'Bali': 'BALI',
        'Nusa Tenggara Barat': 'NUSATENGGARA BARAT',
        'Nusa Tenggara Timur': 'NUSATENGGARA TIMUR',
        'Kalimantan Barat': 'KALIMANTAN BARAT',
        'Kalimantan Tengah': 'KALIMANTAN TENGAH',
        'Kalimantan Selatan': 'KALIMANTAN SELATAN',
        'Kalimantan Timur': 'KALIMANTAN TIMUR',
        'Kalimantan Utara': 'KALIMANTAN TIMUR', # ans-4175 adalah 34 provinsi (Kaltim mencakup Kaltara)
        'Sulawesi Utara': 'SULAWESI UTARA',
        'Sulawesi Tengah': 'SULAWESI TENGAH',
        'Sulawesi Selatan': 'SULAWESI SELATAN',
        'Sulawesi Tenggara': 'SULAWESI TENGGARA',
        'Gorontalo': 'GORONTALO',
        'Sulawesi Barat': 'SULAWESI BARAT',
        'Maluku': 'MALUKU',
        'Maluku Utara': 'MALUKU UTARA',
        'Papua Barat': 'IRIAN JAYA BARAT',
        'Papua Barat Daya': 'IRIAN JAYA BARAT',
        'Papua': 'PAPUA',
        'Papua Selatan': 'PAPUA',
        'Papua Tengah': 'PAPUA',
        'Papua Pegunungan': 'PAPUA'
    }

    df_prov_map['geo_prop'] = df_prov_map['provinsi'].map(prov_name_clean)
    
    # Aggregation for 34 provinces to match ans-4175 GeoJSON
    df_prov_agg = df_prov_map.groupby('geo_prop')[selected_var].mean().reset_index()

    fig = px.choropleth_mapbox(
        df_prov_agg,
        geojson=geojson_data,
        locations="geo_prop",
        featureidkey="properties.Propinsi",
        color=selected_var,
        color_continuous_scale=palette,
        mapbox_style="carto-positron",
        zoom=3.7,
        center={"lat": -2.2, "lon": 118.0},
        opacity=0.75,
        hover_name="geo_prop",
        hover_data={selected_var: ':.2f'},
        labels={selected_var: selected_var.replace('_', ' ').title()},
        height=560
    )
    fig.update_layout(
        margin={"r":0,"t":30,"l":0,"b":0},
        coloraxis_colorbar=dict(title=selected_var.replace('_', ' ').title())
    )
    st.plotly_chart(fig, use_container_width=True)

def render_lisa_cluster_map(df_kab):
    st.markdown("#### 🔬 3. Peta Autokorelasi Spasial LISA (Local Moran's I)")
    st.markdown(
        """
        Peta ini mendeteksi klaster spasial signifikansi lokal (*Local Indicators of Spatial Association*) pada tingkat signifikansi $p < 0.05$.
        * 🔴 **High-High (Hotspot):** Wilayah dengan nilai tinggi dikelilingi oleh tetangga bernilai tinggi.
        * 🔵 **Low-Low (Coldspot):** Wilayah dengan nilai rendah dikelilingi oleh tetangga bernilai rendah.
        * 🟡/🟠 **Spatial Outliers (High-Low / Low-High):** Anomali spasial di mana performa daerah bertolak belakang dengan tetangganya.
        """
    )

    cluster_col = st.radio(
        "Pilih Indikator Klaster Spasial LISA:",
        options=['lisa_cluster_keputusan', 'lisa_cluster_ekonomi'],
        format_func=lambda x: "Klaster Pengambilan Keputusan (Parlemen & Profesional)" if 'keputusan' in x else "Klaster Partisipasi Ekonomi (Pendapatan & TPAK)",
        horizontal=True
    )

    color_map = {
        'High-High (Hotspot)': '#dc3545',
        'Low-Low (Coldspot)': '#0d6efd',
        'High-Low (Spatial Outlier)': '#fd7e14',
        'Low-High (Spatial Outlier)': '#20c997',
        'Not Significant': '#e9ecef'
    }

    fig = px.scatter_mapbox(
        df_kab,
        lat="lat",
        lon="lon",
        color=cluster_col,
        color_discrete_map=color_map,
        size=np.where(df_kab[cluster_col] == 'Not Significant', 6, 12),
        size_max=14,
        zoom=3.8,
        center={"lat": -2.2, "lon": 118.0},
        mapbox_style="carto-positron",
        hover_name="nama_resmi",
        hover_data={
            "provinsi": True,
            cluster_col: True,
            "parlemen": ':.2f',
            "pendapatan": ':.2f',
            "profesional": ':.2f',
            "tpak": ':.2f',
            "lat": False,
            "lon": False
        },
        height=580,
        title=f"Distribusi Klaster Spasial LISA: {cluster_col.replace('_', ' ').title()}"
    )

    fig.update_layout(
        margin={"r":0,"t":40,"l":0,"b":0},
        legend=dict(orientation="h", yanchor="bottom", y=1.02, xanchor="right", x=1)
    )
    st.plotly_chart(fig, use_container_width=True)

    # Rincian Klaster
    counts = df_kab[cluster_col].value_counts()
    c1, c2, c3, c4 = st.columns(4)
    with c1:
        st.error(f"**Hotspot (High-High):**\n\n**{counts.get('High-High (Hotspot)', 0)}** Wilayah")
    with c2:
        st.info(f"**Coldspot (Low-Low):**\n\n**{counts.get('Low-Low (Coldspot)', 0)}** Wilayah")
    with c3:
        st.warning(f"**Outlier (High-Low):**\n\n**{counts.get('High-Low (Spatial Outlier)', 0)}** Wilayah")
    with c4:
        st.success(f"**Outlier (Low-High):**\n\n**{counts.get('Low-High (Spatial Outlier)', 0)}** Wilayah")
