"""
Hierarchical Views Module
Menyajikan visualisasi data berhierarki: Interactive Treemap dan Sunburst Chart
dengan dual visual encoding (Ukuran & Warna) dan drill-down breadcrumb
"""

import streamlit as st
import plotly.express as px
import plotly.graph_objects as go
import pandas as pd

def render_treemap(df_kab, size_var='pengeluaran', color_var='parlemen', palette='Viridis'):
    st.markdown("#### 🌳 1. Peta Pohon Interaktif (Hierarchical Treemap)")
    st.caption("Struktur 4 level: Nasional ➔ Pulau ➔ Provinsi ➔ Kabupaten/Kota. Klik pada kotak wilayah untuk melakukan drill-down dan zoom.")

    labels_map = {
        'parlemen': 'Parlemen (%)',
        'pendapatan': 'Pendapatan (%)',
        'pengeluaran': 'Pengeluaran Riil (Ribu Rp)',
        'ahh': 'AHH (Tahun)',
        'profesional': 'Tenaga Profesional (%)',
        'tpak': 'TPAK (%)',
        'skor_keputusan': 'Skor Keputusan (0-100)',
        'skor_ekonomi': 'Skor Ekonomi (0-100)',
        'ikpp_komposit': 'IKPP Komposit (0-100)'
    }

    fig = px.treemap(
        df_kab,
        path=[px.Constant("Indonesia"), 'pulau', 'provinsi', 'nama_resmi'],
        values=size_var,
        color=color_var,
        color_continuous_scale=palette,
        hover_name='nama_resmi',
        hover_data={
            'parlemen': ':.2f',
            'pendapatan': ':.2f',
            'profesional': ':.2f',
            'tpak': ':.2f',
            'pengeluaran': ':.0f',
            'skor_keputusan': ':.1f',
            'skor_ekonomi': ':.1f'
        },
        title=f"Treemap: Ukuran Kotak = {labels_map.get(size_var, size_var)} | Warna Kotak = {labels_map.get(color_var, color_var)}"
    )

    fig.update_layout(
        margin=dict(t=50, l=10, r=10, b=10),
        height=620,
        coloraxis_colorbar=dict(title=labels_map.get(color_var, color_var))
    )
    st.plotly_chart(fig, use_container_width=True)

def render_sunburst(df_kab, size_var='pengeluaran', color_var='skor_keputusan', palette='Viridis'):
    st.markdown("#### ☀️ 2. Bagan Sinar Surya Interaktif (Sunburst Chart)")
    st.caption("Representasi hierarkis radial. Klik pada cincin lingkaran untuk memperbesar hierarki provinsi atau kabupaten/kota.")

    labels_map = {
        'parlemen': 'Parlemen (%)',
        'pendapatan': 'Pendapatan (%)',
        'pengeluaran': 'Pengeluaran Riil (Ribu Rp)',
        'ahh': 'AHH (Tahun)',
        'profesional': 'Tenaga Profesional (%)',
        'tpak': 'TPAK (%)',
        'skor_keputusan': 'Skor Keputusan (0-100)',
        'skor_ekonomi': 'Skor Ekonomi (0-100)',
        'ikpp_komposit': 'IKPP Komposit (0-100)'
    }

    fig = px.sunburst(
        df_kab,
        path=['pulau', 'provinsi', 'nama_resmi'],
        values=size_var,
        color=color_var,
        color_continuous_scale=palette,
        hover_name='nama_resmi',
        hover_data={
            'parlemen': ':.2f',
            'pendapatan': ':.2f',
            'profesional': ':.2f',
            'tpak': ':.2f',
            'pengeluaran': ':.0f',
            'skor_keputusan': ':.1f'
        },
        title=f"Sunburst: Ukuran Busur = {labels_map.get(size_var, size_var)} | Warna Busur = {labels_map.get(color_var, color_var)}"
    )

    fig.update_layout(
        margin=dict(t=50, l=10, r=10, b=10),
        height=640,
        coloraxis_colorbar=dict(title=labels_map.get(color_var, color_var))
    )
    st.plotly_chart(fig, use_container_width=True)

def render_hierarchical_summary_table(df_kab):
    st.markdown("#### 📋 3. Tabel Agregasi Rata-rata per Pulau / Wilayah")
    
    summary = df_kab.groupby('pulau').agg({
        'kode_wilayah': 'count',
        'parlemen': 'mean',
        'profesional': 'mean',
        'pendapatan': 'mean',
        'tpak': 'mean',
        'pengeluaran': 'mean',
        'skor_keputusan': 'mean',
        'skor_ekonomi': 'mean',
        'ikpp_komposit': 'mean'
    }).rename(columns={'kode_wilayah': 'Jumlah Kab/Kota'}).round(2)

    st.dataframe(
        summary.style.background_gradient(cmap='Blues', subset=['skor_keputusan', 'skor_ekonomi', 'ikpp_komposit']),
        use_container_width=True
    )
