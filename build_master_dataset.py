import pandas as pd
import numpy as np
import json
import re
import os
from sklearn.impute import KNNImputer
from sklearn.preprocessing import MinMaxScaler
import libpysal
from esda.moran import Moran, Moran_Local

# Ensure data directory exists
os.makedirs('data', exist_ok=True)

print("Starting master data generation...")

# 1. Load raw coordinates (514 entities)
with open('regencies_coords.json', 'r', encoding='utf-8') as f:
    coords_json = json.load(f)
coords_df = pd.DataFrame(coords_json['entities'])

# 2. Load DataOK_Visdat.xlsx
df_raw = pd.read_excel('DataOK_Visdat.xlsx', skiprows=3, header=None)
df_raw.columns = ['wilayah', 'parlemen', 'pendapatan', 'pengeluaran', 'ahh', 'profesional', 'tpak', 'rls', 'hls']
df_raw['wilayah'] = df_raw['wilayah'].astype(str).str.strip()

num_cols = ['parlemen', 'pendapatan', 'pengeluaran', 'ahh', 'profesional', 'tpak', 'rls', 'hls']
for col in num_cols:
    df_raw[col] = pd.to_numeric(df_raw[col].astype(str).str.replace(',', '.'), errors='coerce')

# Province mapping
prov_rows = [
    (0, 'Aceh'),
    (24, 'Sumatera Utara'),
    (58, 'Sumatera Barat'),
    (78, 'Riau'),
    (91, 'Jambi'),
    (103, 'Sumatera Selatan'),
    (121, 'Bengkulu'),
    (132, 'Lampung'),
    (148, 'Kepulauan Bangka Belitung'),
    (156, 'Kepulauan Riau'),
    (164, 'DKI Jakarta'),
    (171, 'Jawa Barat'),
    (199, 'Jawa Tengah'),
    (235, 'DI Yogyakarta'),
    (241, 'Jawa Timur'),
    (280, 'Banten'),
    (289, 'Bali'),
    (299, 'Nusa Tenggara Barat'),
    (310, 'Nusa Tenggara Timur'),
    (333, 'Kalimantan Barat'),
    (348, 'Kalimantan Tengah'),
    (363, 'Kalimantan Selatan'),
    (377, 'Kalimantan Timur'),
    (393, 'Kalimantan Utara'),
    (399, 'Sulawesi Utara'),
    (415, 'Sulawesi Tengah'),
    (429, 'Sulawesi Selatan'),
    (454, 'Sulawesi Tenggara'),
    (472, 'Gorontalo'),
    (479, 'Sulawesi Barat'),
    (486, 'Maluku'),
    (498, 'Maluku Utara'),
    (509, 'Papua Barat'),
    (523, 'Papua Barat Daya'),
    (530, 'Papua'),
    (560, 'Papua Selatan'),
    (565, 'Papua Tengah'),
    (574, 'Papua Pegunungan')
]

# Extract provincial data table
prov_list = []
for idx, name in prov_rows:
    p_row = df_raw.iloc[idx].to_dict()
    p_row['provinsi'] = name
    prov_list.append(p_row)
df_prov = pd.DataFrame(prov_list)

# Island mapping
island_map = {
    'Aceh': 'Sumatera', 'Sumatera Utara': 'Sumatera', 'Sumatera Barat': 'Sumatera',
    'Riau': 'Sumatera', 'Jambi': 'Sumatera', 'Sumatera Selatan': 'Sumatera',
    'Bengkulu': 'Sumatera', 'Lampung': 'Sumatera', 'Kepulauan Bangka Belitung': 'Sumatera',
    'Kepulauan Riau': 'Sumatera',
    'DKI Jakarta': 'Jawa', 'Jawa Barat': 'Jawa', 'Jawa Tengah': 'Jawa',
    'DI Yogyakarta': 'Jawa', 'Jawa Timur': 'Jawa', 'Banten': 'Jawa',
    'Bali': 'Bali & Nusa Tenggara', 'Nusa Tenggara Barat': 'Bali & Nusa Tenggara', 'Nusa Tenggara Timur': 'Bali & Nusa Tenggara',
    'Kalimantan Barat': 'Kalimantan', 'Kalimantan Tengah': 'Kalimantan',
    'Kalimantan Selatan': 'Kalimantan', 'Kalimantan Timur': 'Kalimantan', 'Kalimantan Utara': 'Kalimantan',
    'Sulawesi Utara': 'Sulawesi', 'Sulawesi Tengah': 'Sulawesi', 'Sulawesi Selatan': 'Sulawesi',
    'Sulawesi Tenggara': 'Sulawesi', 'Gorontalo': 'Sulawesi', 'Sulawesi Barat': 'Sulawesi',
    'Maluku': 'Maluku', 'Maluku Utara': 'Maluku',
    'Papua Barat': 'Papua', 'Papua Barat Daya': 'Papua', 'Papua': 'Papua',
    'Papua Selatan': 'Papua', 'Papua Tengah': 'Papua', 'Papua Pegunungan': 'Papua'
}

df_prov['pulau'] = df_prov['provinsi'].map(island_map)
df_prov.to_csv('data/clean_provinsi_38.csv', index=False)
print("Saved data/clean_provinsi_38.csv")

# Extract kabupaten/kota rows
kab_rows = []
# Prov 0 to 21
for i in range(22):
    start = prov_rows[i][0] + 1
    end = prov_rows[i+1][0]
    p_name = prov_rows[i][1]
    for idx in range(start, end):
        r = df_raw.iloc[idx].to_dict()
        r['provinsi'] = p_name
        kab_rows.append(r)

# Kaltim (drop kaltara duplicates: 383, 384, 385, 387, 391)
p_name = 'Kalimantan Timur'
kaltara_in_kaltim = [383, 384, 385, 387, 391]
for idx in range(378, 393):
    if idx not in kaltara_in_kaltim:
        r = df_raw.iloc[idx].to_dict()
        r['provinsi'] = p_name
        kab_rows.append(r)

# Kaltara (394 to 398)
p_name = 'Kalimantan Utara'
for idx in range(394, 399):
    r = df_raw.iloc[idx].to_dict()
    r['provinsi'] = p_name
    kab_rows.append(r)

# Sulut to Malut (Prov 24 to 31)
for i in range(24, 32):
    start = prov_rows[i][0] + 1
    end = prov_rows[i+1][0]
    p_name = prov_rows[i][1]
    for idx in range(start, end):
        r = df_raw.iloc[idx].to_dict()
        r['provinsi'] = p_name
        kab_rows.append(r)

# Papua Barat (7 regencies: 510-514, 520, 521)
p_name = 'Papua Barat'
for idx in [510, 511, 512, 513, 514, 520, 521]:
    r = df_raw.iloc[idx].to_dict()
    r['provinsi'] = p_name
    kab_rows.append(r)

# Papua Barat Daya (6 regencies: 524-529, merge 526 with 515, 527 with 519, 529 with 522)
p_name = 'Papua Barat Daya'
pbd_specs = [(524, None), (525, None), (526, 515), (527, 519), (528, None), (529, 522)]
for idx_m, idx_ipm in pbd_specs:
    r = df_raw.iloc[idx_m].to_dict()
    if idx_ipm is not None:
        for col in ['pengeluaran', 'ahh', 'tpak', 'rls', 'hls']:
            r[col] = df_raw.iloc[idx_ipm][col]
    r['provinsi'] = p_name
    kab_rows.append(r)

# Papua (9 regencies: 533, 535, 536, 546, 547, 548, 549, 550, 559)
p_name = 'Papua'
for idx in [533, 535, 536, 546, 547, 548, 549, 550, 559]:
    r = df_raw.iloc[idx].to_dict()
    r['provinsi'] = p_name
    kab_rows.append(r)

# Papua Selatan (4 regencies: 561-564)
p_name = 'Papua Selatan'
for idx in range(561, 565):
    r = df_raw.iloc[idx].to_dict()
    r['provinsi'] = p_name
    kab_rows.append(r)

# Papua Tengah (8 regencies: 566-573)
p_name = 'Papua Tengah'
for idx in range(566, 574):
    r = df_raw.iloc[idx].to_dict()
    r['provinsi'] = p_name
    kab_rows.append(r)

# Papua Pegunungan (8 regencies: 575-582, merge 580 with 554, 581 with 543, 582 with 544)
p_name = 'Papua Pegunungan'
pp_specs = [(575, None), (576, None), (577, None), (578, None), (579, None), (580, 554), (581, 543), (582, 544)]
for idx_m, idx_ipm in pp_specs:
    r = df_raw.iloc[idx_m].to_dict()
    if idx_ipm is not None:
        for col in ['pengeluaran', 'ahh', 'tpak', 'rls', 'hls']:
            r[col] = df_raw.iloc[idx_ipm][col]
    r['provinsi'] = p_name
    kab_rows.append(r)

df_kab = pd.DataFrame(kab_rows)
assert len(df_kab) == 514, f"Expected 514, got {len(df_kab)}"
print("Extracted exactly 514 kabupaten/kota rows.")

# Perform KNN Imputation for the 14 missing rows
imputer = KNNImputer(n_neighbors=5, weights='distance')
df_kab[num_cols] = imputer.fit_transform(df_kab[num_cols])

# Add Pulau
df_kab['pulau'] = df_kab['provinsi'].map(island_map)

# Add Tipe (Kabupaten vs Kota)
df_kab['tipe'] = np.where(df_kab['wilayah'].str.contains('KOTA|KODYA'), 'Kota', 'Kabupaten')

# Map exact coordinates & id from coords_df
# Let's clean names for 1-to-1 matching
def norm(t):
    s = str(t).upper()
    s = re.sub(r'^(KABUPATEN|KAB\.|KOTA|KODYA|ADM\.)\s+', '', s)
    s = re.sub(r'[^A-Z0-9]', '', s)
    return s

coords_df['norm_name'] = coords_df['name_local'].apply(norm)
df_kab['norm_name'] = df_kab['wilayah'].apply(norm)

# Overrides
alias_map = {
    'BULONGAN': 'BULUNGAN',
    'PUNJAKJAYA': 'PUNCAKJAYA',
    'JAKARTAPUSAT': 'KODYAJAKARTAPUSAT',
    'JAKARTAUTARA': 'KODYAJAKARTAUTARA',
    'JAKARTABARAT': 'KODYAJAKARTABARAT',
    'JAKARTASELATAN': 'KODYAJAKARTASELATAN',
    'JAKARTATIMUR': 'KODYAJAKARTATIMUR',
    'KEPULAUANSERIBU': 'ADMKEPULAUANSERIBU',
    'KOTABARU': 'BARU',
    'PASIR': 'PASER',
    'MAHAKAMULU': 'MAHAKAMHULU',
    'POSO': 'POSO',
    'JENEPONTO': 'JENEPONTO',
    'BARRU': 'BARRU',
    'PINRANG': 'PINRANG'
}

df_kab['norm_matched'] = df_kab['norm_name'].replace(alias_map)

# Coordinates matching
lats, lons, ids, local_names = [], [], [], []
for idx, r in df_kab.iterrows():
    name = r['norm_matched']
    is_kota = r['tipe'] == 'Kota'
    cand = coords_df[coords_df['norm_name'] == name]
    if len(cand) == 1:
        match = cand.iloc[0]
    elif len(cand) > 1:
        if is_kota:
            cand_sub = cand[cand['name_local'].str.upper().str.contains('KOTA')]
        else:
            cand_sub = cand[cand['name_local'].str.upper().str.contains('KABUPATEN')]
        match = cand_sub.iloc[0] if len(cand_sub) >= 1 else cand.iloc[0]
    else:
        # Fallback to direct coords index
        match = coords_df.iloc[idx]
    lats.append(match['lat'])
    lons.append(match['lon'])
    ids.append(match['id'])
    local_names.append(match['name_local'])

df_kab['kode_wilayah'] = ids
df_kab['nama_resmi'] = local_names
df_kab['lat'] = lats
df_kab['lon'] = lons

# Calculate Composite Scores (MinMax 0 - 100)
scaler = MinMaxScaler(feature_range=(0, 100))
scaled_data = scaler.fit_transform(df_kab[num_cols])
scaled_df = pd.DataFrame(scaled_data, columns=[f"s_{c}" for c in num_cols])

# 1. Skor Partisipasi Ekonomi (Sumbangan Pendapatan + TPAK)
df_kab['skor_ekonomi'] = (scaled_df['s_pendapatan'] * 0.6 + scaled_df['s_tpak'] * 0.4).round(2)

# 2. Skor Pengambilan Keputusan (Parlemen + Profesional)
df_kab['skor_keputusan'] = (scaled_df['s_parlemen'] * 0.5 + scaled_df['s_profesional'] * 0.5).round(2)

# 3. Skor Kapasitas Sosial Dasar (Pendidikan + Kesehatan + Pengeluaran)
df_kab['skor_kapasitas_sosial'] = (scaled_df['s_ahh'] * 0.3 + scaled_df['s_rls'] * 0.25 + scaled_df['s_hls'] * 0.25 + scaled_df['s_pengeluaran'] * 0.2).round(2)

# 4. Indeks Komposit Pemberdayaan Perempuan (IKPP / IDG Proksi)
df_kab['ikpp_komposit'] = (df_kab['skor_ekonomi'] * 0.4 + df_kab['skor_keputusan'] * 0.4 + df_kab['skor_kapasitas_sosial'] * 0.2).round(2)

# 5. Kuadran Tipologi Disparitas
med_ekonomi = df_kab['skor_ekonomi'].median()
med_keputusan = df_kab['skor_keputusan'].median()

def assign_kuadran(row):
    if row['skor_ekonomi'] >= med_ekonomi and row['skor_keputusan'] >= med_keputusan:
        return 'Kuadran I (Ekonomi Tinggi, Keputusan Tinggi)'
    elif row['skor_ekonomi'] < med_ekonomi and row['skor_keputusan'] >= med_keputusan:
        return 'Kuadran II (Ekonomi Rendah, Keputusan Tinggi)'
    elif row['skor_ekonomi'] < med_ekonomi and row['skor_keputusan'] < med_keputusan:
        return 'Kuadran III (Ekonomi Rendah, Keputusan Rendah)'
    else:
        return 'Kuadran IV (Ekonomi Tinggi, Keputusan Rendah)'

df_kab['kuadran'] = df_kab.apply(assign_kuadran, axis=1)

# 6. Spatial Autocorrelation (Global Moran's I & Local LISA Clusters)
coords = np.column_stack([df_kab['lon'], df_kab['lat']])
w = libpysal.weights.KNN.from_array(coords, k=8)
w.transform = 'R'

# Moran's I for Decision & Economic scores
moran_keputusan = Moran(df_kab['skor_keputusan'].values, w)
moran_ekonomi = Moran(df_kab['skor_ekonomi'].values, w)
print(f"Global Moran's I (Skor Keputusan): I = {moran_keputusan.I:.4f}, p-value = {moran_keputusan.p_sim:.4f}")
print(f"Global Moran's I (Skor Ekonomi):   I = {moran_ekonomi.I:.4f}, p-value = {moran_ekonomi.p_sim:.4f}")

# Local Moran's I (LISA) for Decision Making
lisa_kep = Moran_Local(df_kab['skor_keputusan'].values, w, permutations=999)
lisa_labels = {1: 'High-High (Hotspot)', 2: 'Low-High (Spatial Outlier)', 3: 'Low-Low (Coldspot)', 4: 'High-Low (Spatial Outlier)'}
lisa_res = []
for i in range(len(df_kab)):
    if lisa_kep.p_sim[i] < 0.05:
        lisa_res.append(lisa_labels.get(lisa_kep.q[i], 'Not Significant'))
    else:
        lisa_res.append('Not Significant')
df_kab['lisa_cluster_keputusan'] = lisa_res

# Local Moran's I for Economic Participation
lisa_eko = Moran_Local(df_kab['skor_ekonomi'].values, w, permutations=999)
lisa_res_eko = []
for i in range(len(df_kab)):
    if lisa_eko.p_sim[i] < 0.05:
        lisa_res_eko.append(lisa_labels.get(lisa_eko.q[i], 'Not Significant'))
    else:
        lisa_res_eko.append('Not Significant')
df_kab['lisa_cluster_ekonomi'] = lisa_res_eko

# Save final clean 514 dataset
final_cols = [
    'kode_wilayah', 'nama_resmi', 'wilayah', 'tipe', 'provinsi', 'pulau', 'lat', 'lon',
    'parlemen', 'pendapatan', 'pengeluaran', 'ahh', 'profesional', 'tpak', 'rls', 'hls',
    'skor_ekonomi', 'skor_keputusan', 'skor_kapasitas_sosial', 'ikpp_komposit', 'kuadran',
    'lisa_cluster_keputusan', 'lisa_cluster_ekonomi'
]
df_kab[final_cols].to_csv('data/clean_kabkota_514.csv', index=False)
print("Successfully generated data/clean_kabkota_514.csv with 514 rows and 23 columns!")

# Generate National Stats
national_row = df_raw.iloc[583].to_dict()
national_stats = {
    'wilayah': 'INDONESIA',
    'parlemen': national_row.get('parlemen', df_kab['parlemen'].mean()),
    'pendapatan': national_row.get('pendapatan', df_kab['pendapatan'].mean()),
    'pengeluaran': df_kab['pengeluaran'].mean(),
    'ahh': df_kab['ahh'].mean(),
    'profesional': national_row.get('profesional', df_kab['profesional'].mean()),
    'tpak': df_kab['tpak'].mean(),
    'rls': df_kab['rls'].mean(),
    'hls': df_kab['hls'].mean(),
    'moran_i_keputusan': moran_keputusan.I,
    'moran_p_keputusan': moran_keputusan.p_sim,
    'moran_i_ekonomi': moran_ekonomi.I,
    'moran_p_ekonomi': moran_ekonomi.p_sim
}
pd.DataFrame([national_stats]).to_csv('data/clean_nasional.csv', index=False)
print("Saved data/clean_nasional.csv")
print("All master datasets ready!")
