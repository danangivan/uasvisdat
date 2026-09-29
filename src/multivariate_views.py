"""
Multivariate Views Module
Menyajikan visualisasi data berdimensi tinggi: PCA Biplot, Parallel Coordinates, Clustered Heatmap, dan Radar Chart
"""

import streamlit as st
import plotly.express as px
import plotly.graph_objects as go
import pandas as pd
import numpy as np
from sklearn.decomposition import PCA
from sklearn.preprocessing import StandardScaler
from scipy.spatial.distance import pdist, squareform
from scipy.cluster.hierarchy import linkage, leaves_list

def render_pca_biplot(df_kab, palette='Viridis'):
    st.markdown("#### 📉 1. Reduksi Dimensi: Principal Component Analysis (PCA) & Biplot")
    st.caption("Mereduksi 8 dimensi indikator ke dalam 2 komponen utama untuk membedah struktur laten disparitas gender.")

    vars_8 = ['parlemen', 'pendapatan', 'pengeluaran', 'ahh', 'profesional', 'tpak', 'rls', 'hls']
    var_labels = {
        'parlemen': 'Parlemen (%)',
        'pendapatan': 'Pendapatan (%)',
        'pengeluaran': 'Pengeluaran',
        'ahh': 'AHH (Thn)',
        'profesional': 'Profesional (%)',
        'tpak': 'TPAK (%)',
        'rls': 'RLS (Thn)',
        'hls': 'HLS (Thn)'
    }

    # Standarisasi data
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(df_kab[vars_8])

    pca = PCA(n_components=2)
    pca_result = pca.fit_transform(X_scaled)
    var_exp = pca.explained_variance_ratio_

    pca_df = df_kab.copy()
    pca_df['PC1'] = pca_result[:, 0]
    pca_df['PC2'] = pca_result[:, 1]

    # Hitung jarak Euclidean dari pusat sebagai ukuran outlier
    pca_df['dist_outlier'] = np.sqrt(pca_df['PC1']**2 + pca_df['PC2']**2)

    col_opt1, col_opt2 = st.columns([3, 1])
    with col_opt1:
        color_by = st.selectbox(
            "Warna Titik Berdasarkan:",
            options=['pulau', 'kuadran', 'tipe', 'skor_keputusan', 'skor_ekonomi'],
            index=1
        )
    with col_opt2:
        show_vectors = st.checkbox("Tampilkan Vektor Loading", value=True)

    # Buat Scatter Plot PC1 vs PC2
    fig = px.scatter(
        pca_df,
        x='PC1',
        y='PC2',
        color=color_by,
        hover_name='nama_resmi',
        hover_data={
            'provinsi': True,
            'PC1': ':.2f',
            'PC2': ':.2f',
            'parlemen': ':.1f',
            'pendapatan': ':.1f',
            'profesional': ':.1f',
            'tpak': ':.1f'
        },
        labels={
            'PC1': f"PC1 ({var_exp[0]*100:.1f}% Variansi: Kapasitas Sosial & Hidup Layak)",
            'PC2': f"PC2 ({var_exp[1]*100:.1f}% Variansi: Partisipasi Politik & Kerja)"
        },
        template='plotly_white',
        height=620
    )

    # Tambahkan panah vektor loading
    if show_vectors:
        loadings = pca.components_.T * np.sqrt(pca.explained_variance_) * 3.2
        for i, var in enumerate(vars_8):
            fig.add_annotation(
                ax=0, ay=0,
                x=loadings[i, 0], y=loadings[i, 1],
                xref="x", yref="y",
                axref="x", ayref="y",
                showarrow=True,
                arrowhead=3,
                arrowsize=1.2,
                arrowwidth=2,
                arrowcolor="#dc3545"
            )
            fig.add_annotation(
                x=loadings[i, 0] * 1.15,
                y=loadings[i, 1] * 1.15,
                text=f"<b>{var_labels[var]}</b>",
                showarrow=False,
                font=dict(color="#b02a37", size=11),
                bgcolor="rgba(255,255,255,0.85)"
            )

    fig.update_layout(margin=dict(l=20, r=20, t=30, b=30))
    st.plotly_chart(fig, use_container_width=True)

    # Keterangan dan Pencilan
    top_outliers = pca_df.sort_values(by='dist_outlier', ascending=False).head(5)
    st.markdown(f"**Total Variansi Terjelaskan (PC1 + PC2):** `{(var_exp[0]+var_exp[1])*100:.2f}%`")
    with st.expander("📌 Interpretasi Komponen & 5 Wilayah Pencilan (*Extreme Outliers*)"):
        st.markdown(
            f"""
            * **PC1 ({var_exp[0]*100:.1f}%):** Mengukur taraf hidup layak dan kapasitas sosial dasar (pendidikan, usia harapan hidup, dan pengeluaran). Wilayah dengan PC1 positif tinggi memiliki taraf pembangunan manusia modern.
            * **PC2 ({var_exp[1]*100:.1f}%):** Membedakan keterlibatan publik/politik dari partisipasi tenaga kerja subsisten (TPAK).
            * **Pencilan Tertinggi (Outliers):** {', '.join([f'**{r.nama_resmi}** ({r.provinsi})' for _, r in top_outliers.iterrows()])}.
            """
        )

def render_parallel_coordinates(df_kab):
    st.markdown("#### 📊 2. Diagram Koordinat Paralel (Parallel Coordinates Plot)")
    st.caption("Lakukan *brushing* (klik dan geser rentang pada tiap sumbu vertikal) untuk menyaring daerah secara interaktif.")

    vars_8 = ['parlemen', 'pendapatan', 'pengeluaran', 'ahh', 'profesional', 'tpak', 'rls', 'hls']
    dimensions = [
        dict(range=[0, df_kab['parlemen'].max()], label='Parlemen (%)', values=df_kab['parlemen']),
        dict(range=[df_kab['pendapatan'].min(), df_kab['pendapatan'].max()], label='Pendapatan (%)', values=df_kab['pendapatan']),
        dict(range=[df_kab['pengeluaran'].min(), df_kab['pengeluaran'].max()], label='Pengeluaran', values=df_kab['pengeluaran']),
        dict(range=[df_kab['ahh'].min(), df_kab['ahh'].max()], label='AHH (Thn)', values=df_kab['ahh']),
        dict(range=[0, 100], label='Profesional (%)', values=df_kab['profesional']),
        dict(range=[df_kab['tpak'].min(), df_kab['tpak'].max()], label='TPAK (%)', values=df_kab['tpak']),
        dict(range=[df_kab['rls'].min(), df_kab['rls'].max()], label='RLS (Thn)', values=df_kab['rls']),
        dict(range=[df_kab['hls'].min(), df_kab['hls'].max()], label='HLS (Thn)', values=df_kab['hls'])
    ]

    fig = go.Figure(data=
        go.Parcoords(
            line=dict(
                color=df_kab['skor_keputusan'],
                colorscale='Viridis',
                showscale=True,
                colorbar=dict(title="Skor Keputusan")
            ),
            dimensions=dimensions
        )
    )
    fig.update_layout(height=520, margin=dict(l=50, r=40, t=40, b=30))
    st.plotly_chart(fig, use_container_width=True)

def render_clustered_heatmap(df_kab):
    st.markdown("#### 🌡️ 3. Clustered Heatmap: Matriks Korelasi Hierarkis 8 Variabel")
    st.caption("Variabel disusun kembali berdasarkan pohon klaster (*hierarchical clustering*) untuk memperlihatkan struktur asosiasi alami.")

    vars_8 = ['parlemen', 'pendapatan', 'pengeluaran', 'ahh', 'profesional', 'tpak', 'rls', 'hls']
    var_names = [
        'Parlemen (%)', 'Pendapatan (%)', 'Pengeluaran', 'AHH', 
        'Profesional (%)', 'TPAK (%)', 'RLS', 'HLS'
    ]

    corr = df_kab[vars_8].corr().values
    
    # Hierarchical clustering untuk reordering sumbu
    d = pdist(corr)
    tree = linkage(d, method='average')
    order = leaves_list(tree)

    corr_ordered = corr[order, :][:, order]
    names_ordered = [var_names[i] for i in order]

    fig = px.imshow(
        corr_ordered,
        x=names_ordered,
        y=names_ordered,
        color_continuous_scale='RdBu_r',
        zmin=-1.0,
        zmax=1.0,
        text_auto='.2f',
        aspect="auto",
        labels=dict(color="Korelasi Pearson"),
        height=500
    )
    fig.update_layout(margin=dict(l=20, r=20, t=30, b=20))
    st.plotly_chart(fig, use_container_width=True)

def render_radar_chart(df_kab):
    st.markdown("#### 🕸️ 4. Radar Chart: Perbandingan Profil Antar Wilayah / Kuadran")
    st.caption("Membandingkan profil rata-rata 8 indikator antar kelompok pulau atau kuadran terpilih.")

    vars_8 = ['parlemen', 'pendapatan', 'pengeluaran', 'ahh', 'profesional', 'tpak', 'rls', 'hls']
    labels = ['Parlemen', 'Pendapatan', 'Pengeluaran', 'AHH', 'Profesional', 'TPAK', 'RLS', 'HLS']

    # Standarisasi Min-Max 0-100 untuk radar chart agar berada pada skala seragam
    df_norm = df_kab.copy()
    for v in vars_8:
        v_min = df_kab[v].min()
        v_max = df_kab[v].max()
        df_norm[v] = (df_kab[v] - v_min) / (v_max - v_min) * 100

    compare_type = st.radio("Pilih Kelompok Pembanding:", options=['Berdasarkan Pulau', 'Berdasarkan Kuadran'], horizontal=True)
    group_col = 'pulau' if compare_type == 'Berdasarkan Pulau' else 'kuadran'

    grouped = df_norm.groupby(group_col)[vars_8].mean()

    selected_groups = st.multiselect(
        "Pilih Entitas untuk Ditampilkan (Maksimal 4):",
        options=grouped.index.tolist(),
        default=grouped.index.tolist()[:3]
    )

    if not selected_groups:
        st.warning("Pilih minimal satu entitas.")
        return

    fig = go.Figure()
    for grp in selected_groups:
        vals = grouped.loc[grp].values.tolist()
        vals.append(vals[0]) # Tutup loop radar
        fig.add_trace(go.Scatterpolar(
            r=vals,
            theta=labels + [labels[0]],
            fill='toself',
            name=grp,
            opacity=0.6
        ))

    fig.update_layout(
        polar=dict(
            radialaxis=dict(visible=True, range=[0, 100])
        ),
        showlegend=True,
        height=520,
        margin=dict(l=40, r=40, t=30, b=30)
    )
    st.plotly_chart(fig, use_container_width=True)
