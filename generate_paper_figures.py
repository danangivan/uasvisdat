"""
Generate High-Resolution Publication Figures (300 DPI) for IEEE Paper
"""

import os
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.decomposition import PCA
from sklearn.preprocessing import StandardScaler
from scipy.spatial.distance import pdist
from scipy.cluster.hierarchy import linkage, leaves_list

os.makedirs('makalah', exist_ok=True)
plt.rcParams['font.sans-serif'] = 'DejaVu Sans'
plt.rcParams['axes.edgecolor'] = '#333333'
plt.rcParams['axes.linewidth'] = 0.8

df = pd.read_csv('data/clean_kabkota_514.csv')

# ----------------- FIGURE 1: QUADRANT ANALYSIS -----------------
fig, ax = plt.subplots(figsize=(7, 5.5), dpi=300)
med_x = df['skor_ekonomi'].median()
med_y = df['skor_keputusan'].median()

colors = {'Sumatera': '#1f77b4', 'Jawa': '#ff7f0e', 'Bali & Nusa Tenggara': '#2ca02c',
          'Kalimantan': '#d62728', 'Sulawesi': '#9467bd', 'Maluku': '#8c564b', 'Papua': '#e377c2'}

for pulau, grp in df.groupby('pulau'):
    ax.scatter(grp['skor_ekonomi'], grp['skor_keputusan'], label=pulau,
               color=colors.get(pulau, '#333'), alpha=0.65, s=grp['pengeluaran']/450, edgecolors='none')

ax.axvline(med_x, color='#555555', linestyle='--', linewidth=1, alpha=0.8)
ax.axhline(med_y, color='#555555', linestyle='--', linewidth=1, alpha=0.8)

ax.text(med_x + 18, med_y + 24, 'KUADRAN I\n(Ekonomi ↑, Keputusan ↑)', fontsize=8, color='#198754', weight='bold', ha='center',
        bbox=dict(boxstyle='round,pad=0.3', facecolor='#e8f5e9', edgecolor='#198754', alpha=0.8))
ax.text(med_x - 18, med_y + 24, 'KUADRAN II\n(Ekonomi ↓, Keputusan ↑)', fontsize=8, color='#0d6efd', weight='bold', ha='center',
        bbox=dict(boxstyle='round,pad=0.3', facecolor='#e7f1ff', edgecolor='#0d6efd', alpha=0.8))
ax.text(med_x - 18, med_y - 24, 'KUADRAN III\n(Ekonomi ↓, Keputusan ↓)', fontsize=8, color='#dc3545', weight='bold', ha='center',
        bbox=dict(boxstyle='round,pad=0.3', facecolor='#f8d7da', edgecolor='#dc3545', alpha=0.8))
ax.text(med_x + 18, med_y - 24, 'KUADRAN IV\n(Ekonomi ↑, Keputusan ↓)', fontsize=8, color='#fd7e14', weight='bold', ha='center',
        bbox=dict(boxstyle='round,pad=0.3', facecolor='#fff3cd', edgecolor='#fd7e14', alpha=0.8))

ax.set_title('Tipologi Kuadran: Partisipasi Ekonomi vs Pengambilan Keputusan (514 Kab/Kota)', fontsize=10, weight='bold', pad=10)
ax.set_xlabel('Indeks Partisipasi Ekonomi (0 - 100)', fontsize=9)
ax.set_ylabel('Indeks Pengambilan Keputusan (0 - 100)', fontsize=9)
ax.legend(title='Wilayah Pulau', fontsize=7.5, title_fontsize=8, loc='upper left', framealpha=0.9)
ax.grid(True, linestyle=':', alpha=0.5)
plt.tight_layout()
plt.savefig('makalah/fig1_quadrant.png', dpi=300)
plt.close()
print("Saved fig1_quadrant.png")

# ----------------- FIGURE 2: LISA SPATIAL CLUSTERS -----------------
fig, ax = plt.subplots(figsize=(8, 4.2), dpi=300)
lisa_colors = {
    'High-High (Hotspot)': '#dc3545',
    'Low-Low (Coldspot)': '#0d6efd',
    'High-Low (Spatial Outlier)': '#fd7e14',
    'Low-High (Spatial Outlier)': '#20c997',
    'Not Significant': '#d0d7de'
}

for cluster, grp in df.groupby('lisa_cluster_keputusan'):
    c = lisa_colors.get(cluster, '#ccc')
    size = 28 if cluster != 'Not Significant' else 10
    alpha = 0.85 if cluster != 'Not Significant' else 0.35
    ax.scatter(grp['lon'], grp['lat'], label=cluster, color=c, s=size, alpha=alpha, edgecolors='none')

ax.set_title("Peta Klaster Autokorelasi Spasial LISA: Pengambilan Keputusan Perempuan (Moran's I = 0.354, p = 0.001)", fontsize=9.5, weight='bold', pad=8)
ax.set_xlabel('Bujur Timur (Longitude)', fontsize=8.5)
ax.set_ylabel('Lintang (Latitude)', fontsize=8.5)
ax.set_xlim(94, 142)
ax.set_ylim(-11, 7)
ax.legend(fontsize=7, loc='lower left', framealpha=0.9)
ax.grid(True, linestyle=':', alpha=0.4)
plt.tight_layout()
plt.savefig('makalah/fig2_lisa_clusters.png', dpi=300)
plt.close()
print("Saved fig2_lisa_clusters.png")

# ----------------- FIGURE 3: PCA BIPLOT -----------------
fig, ax = plt.subplots(figsize=(7, 5.5), dpi=300)
vars_8 = ['parlemen', 'pendapatan', 'pengeluaran', 'ahh', 'profesional', 'tpak', 'rls', 'hls']
var_labels = ['Parlemen (%)', 'Pendapatan (%)', 'Pengeluaran', 'AHH (Thn)', 'Profesional (%)', 'TPAK (%)', 'RLS (Thn)', 'HLS (Thn)']

scaler = StandardScaler()
X_s = scaler.fit_transform(df[vars_8])
pca = PCA(n_components=2)
scores = pca.fit_transform(X_s)
var_exp = pca.explained_variance_ratio_

scatter = ax.scatter(scores[:, 0], scores[:, 1], c=df['skor_keputusan'], cmap='viridis', s=22, alpha=0.7)
cbar = plt.colorbar(scatter, ax=ax, fraction=0.03, pad=0.04)
cbar.set_label('Skor Keputusan', fontsize=8)

loadings = pca.components_.T * np.sqrt(pca.explained_variance_) * 3.0
for i in range(len(vars_8)):
    ax.arrow(0, 0, loadings[i, 0], loadings[i, 1], color='#b02a37', alpha=0.9, width=0.025, head_width=0.14)
    ax.text(loadings[i, 0]*1.15, loadings[i, 1]*1.15, var_labels[i], color='#721c24', fontsize=7.5, weight='bold', ha='center')

ax.set_title(f'PCA Biplot 8 Indikator (PC1: {var_exp[0]*100:.1f}%, PC2: {var_exp[1]*100:.1f}%)', fontsize=10, weight='bold', pad=10)
ax.set_xlabel(f'Komponen Utama 1 ({var_exp[0]*100:.1f}% Variansi: Kapasitas Sosial)', fontsize=8.5)
ax.set_ylabel(f'Komponen Utama 2 ({var_exp[1]*100:.1f}% Variansi: Partisipasi Politik)', fontsize=8.5)
ax.axhline(0, color='gray', linestyle=':', linewidth=0.8)
ax.axvline(0, color='gray', linestyle=':', linewidth=0.8)
ax.grid(True, linestyle=':', alpha=0.4)
plt.tight_layout()
plt.savefig('makalah/fig3_pca_biplot.png', dpi=300)
plt.close()
print("Saved fig3_pca_biplot.png")

# ----------------- FIGURE 4: CLUSTERED CORRELATION HEATMAP -----------------
fig, ax = plt.subplots(figsize=(6, 5), dpi=300)
corr = df[vars_8].corr().values
d = pdist(corr)
tree = linkage(d, method='average')
order = leaves_list(tree)
corr_ordered = corr[order, :][:, order]
names_ordered = [var_labels[i] for i in order]

sns.heatmap(corr_ordered, annot=True, fmt='.2f', cmap='coolwarm', vmin=-1, vmax=1,
            xticklabels=names_ordered, yticklabels=names_ordered, ax=ax, cbar_kws={'label': 'Korelasi Pearson', 'shrink': 0.8},
            annot_kws={'size': 7.5})
ax.set_title('Clustered Correlation Heatmap: Matriks Asosiasi 8 Indikator BPS', fontsize=9.5, weight='bold', pad=8)
plt.xticks(rotation=45, ha='right', fontsize=8)
plt.yticks(rotation=0, fontsize=8)
plt.tight_layout()
plt.savefig('makalah/fig4_clustered_heatmap.png', dpi=300)
plt.close()
print("Saved fig4_clustered_heatmap.png")

# ----------------- FIGURE 5: HIERARCHICAL REGIONAL PROFILE -----------------
fig, ax = plt.subplots(figsize=(7, 4.5), dpi=300)
pulau_agg = df.groupby('pulau')[['skor_keputusan', 'skor_ekonomi', 'parlemen', 'profesional', 'pendapatan', 'tpak']].mean()
x = np.arange(len(pulau_agg))
width = 0.35

rects1 = ax.bar(x - width/2, pulau_agg['skor_keputusan'], width, label='Indeks Pengambilan Keputusan', color='#2b5c8f')
rects2 = ax.bar(x + width/2, pulau_agg['skor_ekonomi'], width, label='Indeks Partisipasi Ekonomi', color='#41b6c4')

ax.set_title('Disparitas Rata-rata Partisipasi Gender Menurut Wilayah Kepulauan', fontsize=9.5, weight='bold', pad=10)
ax.set_xticks(x)
ax.set_xticklabels(pulau_agg.index, rotation=25, ha='right', fontsize=8)
ax.set_ylabel('Skor Indeks (Skala 0 - 100)', fontsize=8.5)
ax.legend(fontsize=8, framealpha=0.9)
ax.grid(True, linestyle=':', alpha=0.4, axis='y')
plt.tight_layout()
plt.savefig('makalah/fig5_hierarchical_bar.png', dpi=300)
plt.close()
print("Saved fig5_hierarchical_bar.png")
print("All publication figures successfully created!")
