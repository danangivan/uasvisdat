import pandas as pd
import numpy as np
import json
import os
from sklearn.decomposition import PCA
from sklearn.preprocessing import StandardScaler
from scipy.spatial.distance import pdist
from scipy.cluster.hierarchy import linkage, leaves_list

os.makedirs('data', exist_ok=True)

# 1. Load CSVs
df_kab = pd.read_csv('data/clean_kabkota_514.csv')
df_prov = pd.read_csv('data/clean_provinsi_38.csv')
df_nas = pd.read_csv('data/clean_nasional.csv')

vars_8 = ['parlemen', 'pendapatan', 'pengeluaran', 'ahh', 'profesional', 'tpak', 'rls', 'hls']
var_labels = {
    'parlemen': 'Parlemen (%)',
    'pendapatan': 'Pendapatan (%)',
    'pengeluaran': 'Pengeluaran Riil (Ribu Rp)',
    'ahh': 'AHH (Tahun)',
    'profesional': 'Tenaga Profesional (%)',
    'tpak': 'TPAK (%)',
    'rls': 'RLS (Tahun)',
    'hls': 'HLS (Tahun)'
}

# 2. Compute PCA coordinates and loadings
scaler = StandardScaler()
X_s = scaler.fit_transform(df_kab[vars_8])
pca = PCA(n_components=2)
scores = pca.fit_transform(X_s)
var_exp = pca.explained_variance_ratio_

df_kab['pc1'] = np.round(scores[:, 0], 3)
df_kab['pc2'] = np.round(scores[:, 1], 3)

loadings = pca.components_.T * np.sqrt(pca.explained_variance_) * 3.0
pca_loadings = []
for i, v in enumerate(vars_8):
    pca_loadings.append({
        'var': v,
        'label': var_labels[v],
        'x': round(float(loadings[i, 0]), 3),
        'y': round(float(loadings[i, 1]), 3)
    })

pca_meta = {
    'var_exp_pc1': round(float(var_exp[0] * 100), 2),
    'var_exp_pc2': round(float(var_exp[1] * 100), 2),
    'var_exp_total': round(float((var_exp[0] + var_exp[1]) * 100), 2),
    'loadings': pca_loadings
}

# 3. Compute Clustered Correlation Matrix
corr = df_kab[vars_8].corr().values
d = pdist(corr)
tree = linkage(d, method='average')
order = leaves_list(tree)
corr_ordered = corr[order, :][:, order]
names_ordered = [var_labels[vars_8[i]] for i in order]
vars_ordered = [vars_8[i] for i in order]

corr_data = {
    'labels': names_ordered,
    'vars': vars_ordered,
    'z': [[round(float(val), 2) for val in row] for row in corr_ordered]
}

# 4. Save JSON files
kab_records = df_kab.to_dict(orient='records')
with open('data/kabkota_514.json', 'w', encoding='utf-8') as f:
    json.dump(kab_records, f, ensure_ascii=False, indent=2)

prov_records = df_prov.to_dict(orient='records')
with open('data/provinsi_38.json', 'w', encoding='utf-8') as f:
    json.dump(prov_records, f, ensure_ascii=False, indent=2)

nas_records = df_nas.to_dict(orient='records')[0]
with open('data/nasional.json', 'w', encoding='utf-8') as f:
    json.dump(nas_records, f, ensure_ascii=False, indent=2)

with open('data/pca_meta.json', 'w', encoding='utf-8') as f:
    json.dump(pca_meta, f, ensure_ascii=False, indent=2)

with open('data/correlation_matrix.json', 'w', encoding='utf-8') as f:
    json.dump(corr_data, f, ensure_ascii=False, indent=2)

print("Successfully exported all data to JSON:")
print(f"- data/kabkota_514.json ({len(kab_records)} records)")
print(f"- data/provinsi_38.json ({len(prov_records)} records)")
print("- data/nasional.json")
print("- data/pca_meta.json")
print("- data/correlation_matrix.json")
