"""
Data Loader & Helper Module
Memuat dan mengelola data 514 Kabupaten/Kota dan 38 Provinsi Indonesia
"""

import os
import json
import pandas as pd
import streamlit as st

INDICATOR_METADATA = {
    'parlemen': {
        'nama': 'Keterlibatan Perempuan di Parlemen',
        'satuan': '%',
        'kategori': 'Pengambilan Keputusan Publik',
        'deskripsi': 'Persentase keterwakilan perempuan di legislatif (DPRD Kab/Kota).'
    },
    'profesional': {
        'nama': 'Perempuan sebagai Tenaga Profesional',
        'satuan': '%',
        'kategori': 'Pengambilan Keputusan Profesional & Manajerial',
        'deskripsi': 'Persentase perempuan dalam jabatan profesional, manajer, administrasi, dan teknisi.'
    },
    'pendapatan': {
        'nama': 'Sumbangan Pendapatan Perempuan',
        'satuan': '%',
        'kategori': 'Partisipasi Ekonomi & Kemandirian Finansial',
        'deskripsi': 'Pangsa pendapatan perempuan terhadap total pendapatan rumah tangga/wilayah.'
    },
    'tpak': {
        'nama': 'Tingkat Partisipasi Angkatan Kerja (TPAK) Perempuan',
        'satuan': '%',
        'kategori': 'Partisipasi Ekonomi & Ketenagakerjaan',
        'deskripsi': 'Persentase penduduk perempuan usia kerja yang aktif secara ekonomi.'
    },
    'pengeluaran': {
        'nama': 'Pengeluaran per Kapita Disesuaikan',
        'satuan': 'Ribu Rp/orang/thn',
        'kategori': 'Standar Hidup Layak',
        'deskripsi': 'Taraf konsumsi riil per kapita masyarakat dengan penyesuaian paritas daya beli (PPP).'
    },
    'ahh': {
        'nama': 'Angka Harapan Hidup (AHH) Perempuan',
        'satuan': 'Tahun',
        'kategori': 'Kesehatan & Ketahanan Hidup',
        'deskripsi': 'Perkiraan rata-rata tahun hidup perempuan sejak lahir.'
    },
    'rls': {
        'nama': 'Rata-rata Lama Sekolah (RLS)',
        'satuan': 'Tahun',
        'kategori': 'Pendidikan',
        'deskripsi': 'Jumlah tahun bersekolah yang telah diselesaikan oleh penduduk usia 25 tahun ke atas.'
    },
    'hls': {
        'nama': 'Harapan Lama Sekolah (HLS)',
        'satuan': 'Tahun',
        'kategori': 'Pendidikan',
        'deskripsi': 'Peluang lamanya pendidikan formal yang diharapkan dapat dicapai oleh anak usia 7 tahun.'
    },
    'skor_ekonomi': {
        'nama': 'Indeks Partisipasi Ekonomi Perempuan',
        'satuan': 'Skala 0-100',
        'kategori': 'Indeks Komposit',
        'deskripsi': 'Rata-rata tertimbang terstandarisasi sumbangan pendapatan (60%) dan TPAK (40%).'
    },
    'skor_keputusan': {
        'nama': 'Indeks Pengambilan Keputusan Perempuan',
        'satuan': 'Skala 0-100',
        'kategori': 'Indeks Komposit',
        'deskripsi': 'Rata-rata tertimbang parlemen (50%) dan tenaga profesional/manajerial (50%).'
    },
    'ikpp_komposit': {
        'nama': 'Indeks Komposit Pemberdayaan Perempuan (IKPP)',
        'satuan': 'Skala 0-100',
        'kategori': 'Indeks Agregat',
        'deskripsi': 'Sintesis holistik ekonomi (40%), keputusan (40%), dan kapasitas sosial (20%).'
    }
}

RAW_VARS = ['parlemen', 'pendapatan', 'pengeluaran', 'ahh', 'profesional', 'tpak', 'rls', 'hls']
COMPOSITE_VARS = ['skor_ekonomi', 'skor_keputusan', 'skor_kapasitas_sosial', 'ikpp_komposit']

COLORBLIND_PALETTES = {
    'Viridis': 'Viridis',
    'Cividis': 'Cividis',
    'Plasma': 'Plasma',
    'Turbo': 'Turbo',
    'Tealrose': 'Tealrose',
    'YlGnBu': 'YlGnBu'
}

@st.cache_data
def load_kabkota_df():
    path = os.path.join(os.path.dirname(__file__), '..', 'data', 'clean_kabkota_514.csv')
    df = pd.read_csv(path)
    return df

@st.cache_data
def load_provinsi_df():
    path = os.path.join(os.path.dirname(__file__), '..', 'data', 'clean_provinsi_38.csv')
    df = pd.read_csv(path)
    return df

@st.cache_data
def load_nasional_df():
    path = os.path.join(os.path.dirname(__file__), '..', 'data', 'clean_nasional.csv')
    df = pd.read_csv(path)
    return df

@st.cache_data
def load_prov_geojson():
    path = os.path.join(os.path.dirname(__file__), '..', 'indonesia-prov-ans.geojson')
    if os.path.exists(path):
        with open(path, 'r', encoding='utf-8') as f:
            return json.load(f)
    return None

def filter_dataframe(df, selected_pulau, selected_prov, selected_tipe, selected_kuadran):
    filtered = df.copy()
    if selected_pulau and 'Semua' not in selected_pulau:
        filtered = filtered[filtered['pulau'].isin(selected_pulau)]
    if selected_prov and 'Semua' not in selected_prov:
        filtered = filtered[filtered['provinsi'].isin(selected_prov)]
    if selected_tipe and selected_tipe != 'Semua':
        filtered = filtered[filtered['tipe'] == selected_tipe]
    if selected_kuadran and 'Semua' not in selected_kuadran:
        filtered = filtered[filtered['kuadran'].isin(selected_kuadran)]
    return filtered
