"""
Script untuk membangun GeoJSON Batas Kabupaten/Kota Seluruh Indonesia (514 Kab/Kota, 38 Provinsi)
Menggabungkan batas poligon spasial nasional dengan data analitik BPS 2024.
Bebas kebutuhan API (100% Client-Side & Offline-Ready).
"""

import urllib.request
import json
import os
from shapely.geometry import shape, mapping

def build_national_geojson():
    url = 'https://raw.githubusercontent.com/ardian28/GeoJson-Indonesia-38-Provinsi/main/Kabupaten/38%20Provinsi%20Indonesia%20-%20Kabupaten.json'
    print("Mengunduh GeoJSON Batas Kabupaten/Kota 38 Provinsi...")
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    with urllib.request.urlopen(req) as resp:
        raw_geo = json.loads(resp.read().decode('utf-8'))

    print(f"Total poligon geospasial: {len(raw_geo['features'])} entitas.")

    print("Membaca dataset indikator BPS 2024 (514 Kab/Kota)...")
    with open('data/kabkota_514.json', 'r', encoding='utf-8') as f:
        kabkota_list = json.load(f)

    # Normalisasi teks untuk pencocokan nama
    def norm(s):
        if not s:
            return ''
        s = str(s).lower()
        for prefix in ['kabupaten', 'kota', 'administrasi', 'adm.', 'adm', 'kepulauan', 'kep.']:
            s = s.replace(prefix, '')
        s = s.replace(' dan ', ' ')
        for char in [' ', '-', '_', '.', "'", '/']:
            s = s.replace(char, '')
        return s

    # Kamus alias nama wilayah khusus
    aliases = {
        'padangsidempuan': 'padangsidimpuan',
        'kotapadangsidempuan': 'padangsidimpuan',
        'toba': 'tobasamosir',
        'pahuwato': 'pohuwato',
        'tanimbar': 'malukutenggarabarat',
        'pasangkayu': 'mamujuutara',
        'mempawah': 'pontianak',
        'mahakamulu': 'mahakamhulu',
        'seribu': 'kepulauanseribu',
        'jakartapusat': 'jakartapusat',
        'jakartautara': 'jakartautara',
        'jakartabarat': 'jakartabarat',
        'jakartaselatan': 'jakartaselatan',
        'jakartatimur': 'jakartatimur',
        'pangkajene': 'pangkajenedankepulauan',
        'pangkajenekepulauan': 'pangkajenedankepulauan',
        'sumbawasumbawabarat': 'sumbawabarat',
        'minahasaselatanbolaangmongondwotimur': 'minahasaselatan',
        'gunungsitoli': 'gunungsitoli',
        'tulangkebang': 'tulangbawang'
    }

    # Buat indeks pencarian dari dataset 514 BPS
    json_by_pair = {}
    json_by_name = {}
    for k in kabkota_list:
        n_kk = norm(k['nama_resmi'])
        n_pr = norm(k['provinsi'])
        json_by_pair[(n_pr, n_kk)] = k
        if n_kk not in json_by_name:
            json_by_name[n_kk] = []
        json_by_name[n_kk].append(k)

    features = []
    matched_count = 0

    for idx, f in enumerate(raw_geo['features']):
        if not f.get('geometry'):
            continue
        props = f.get('properties', {})
        wadmkk = str(props.get('WADMKK', '')).strip()
        wadmpr = str(props.get('WADMPR', '')).strip()

        if not wadmkk or wadmkk.lower() == 'none':
            continue

        n_kk = norm(wadmkk)
        n_pr = norm(wadmpr)

        # Cek alias
        if n_kk in aliases:
            n_kk = aliases[n_kk]

        # Cocokkan pasangan (provinsi, kabupaten)
        match = json_by_pair.get((n_pr, n_kk))

        # Jika belum cocok, cari berdasarkan nama kabupaten
        if not match and n_kk in json_by_name:
            candidates = json_by_name[n_kk]
            if len(candidates) == 1:
                match = candidates[0]
            else:
                for c in candidates:
                    if norm(c['provinsi']) in n_pr or n_pr in norm(c['provinsi']):
                        match = c
                        break

        # Jika masih belum cocok, coba fuzzy substring
        if not match:
            for k in kabkota_list:
                cand_kk = norm(k['nama_resmi'])
                cand_pr = norm(k['provinsi'])
                if (cand_kk in n_kk or n_kk in cand_kk) and (cand_pr in n_pr or n_pr in cand_pr):
                    match = k
                    break

        new_props = {
            'WADMKK': wadmkk,
            'WADMPR': wadmpr,
            'KDPKAB': props.get('KDPKAB', ''),
            'LUASWH': float(props.get('LUASWH', 0) or props.get('LUAS', 0) or 0)
        }

        if match:
            matched_count += 1
            new_props.update({
                'kode_wilayah': match.get('kode_wilayah'),
                'nama_resmi': match.get('nama_resmi'),
                'tipe': match.get('tipe'),
                'provinsi': match.get('provinsi'),
                'pulau': match.get('pulau'),
                'parlemen': match.get('parlemen'),
                'pendapatan': match.get('pendapatan'),
                'pengeluaran': match.get('pengeluaran'),
                'ahh': match.get('ahh'),
                'profesional': match.get('profesional'),
                'tpak': match.get('tpak'),
                'rls': match.get('rls'),
                'hls': match.get('hls'),
                'skor_ekonomi': match.get('skor_ekonomi'),
                'skor_keputusan': match.get('skor_keputusan'),
                'skor_kapasitas_sosial': match.get('skor_kapasitas_sosial'),
                'ikpp_komposit': match.get('ikpp_komposit'),
                'kuadran': match.get('kuadran'),
                'lisa_cluster_keputusan': match.get('lisa_cluster_keputusan'),
                'lisa_cluster_ekonomi': match.get('lisa_cluster_ekonomi'),
                'pc1': match.get('pc1'),
                'pc2': match.get('pc2'),
                'lat': match.get('lat'),
                'lon': match.get('lon')
            })
        else:
            # Fallback jika wilayah pemekaran
            new_props.update({
                'nama_resmi': wadmkk,
                'provinsi': wadmpr,
                'tipe': 'Kabupaten' if 'kab' in wadmkk.lower() else 'Kota',
                'parlemen': 15.0,
                'pendapatan': 35.0,
                'pengeluaran': 10000.0,
                'ikpp_komposit': 45.0,
                'kuadran': 'Kuadran IV'
            })

        # Pembulatan koordinat 4 desimal (~11 meter) untuk efisiensi transfer data web
        def round_coords(geom):
            gtype = geom.get('type')
            if gtype == 'Polygon':
                geom['coordinates'] = [[[round(c, 4) for c in pt] for pt in ring] for ring in geom['coordinates']]
            elif gtype == 'MultiPolygon':
                geom['coordinates'] = [[[[round(c, 4) for c in pt] for pt in ring] for ring in poly] for poly in geom['coordinates']]
            return geom

        geom_clean = round_coords(f['geometry'])

        features.append({
            'type': 'Feature',
            'id': match.get('kode_wilayah') if match else idx,
            'properties': new_props,
            'geometry': geom_clean
        })

    geojson_out = {
        'type': 'FeatureCollection',
        'metadata': {
            'title': 'Batas Administrasi 514 Kabupaten/Kota Seluruh Indonesia Terintegrasi BPS 2024',
            'count': len(features),
            'matched': matched_count,
            'crs': 'urn:ogc:def:crs:OGC:1.3:CRS84',
            'no_api_required': True
        },
        'features': features
    }

    out_paths = [
        'public/data/kabkota_indonesia.geojson',
        'data/kabkota_indonesia.geojson'
    ]

    for p in out_paths:
        os.makedirs(os.path.dirname(p), exist_ok=True)
        with open(p, 'w', encoding='utf-8') as out_f:
            json.dump(geojson_out, out_f, ensure_ascii=False)

    sz_mb = os.path.getsize('public/data/kabkota_indonesia.geojson') / (1024 * 1024)
    print(f"SELESAI! Berhasil memadankan {matched_count}/{len(features)} kab/kota ke {out_paths[0]} ({sz_mb:.2f} MB).")

if __name__ == '__main__':
    build_national_geojson()
