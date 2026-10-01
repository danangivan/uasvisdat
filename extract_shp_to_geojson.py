"""
Script Pemrosesan dan Ekstraksi Shapefile Batas Kabupaten/Kota ke GeoJSON
Mengkonversi batas poligon SHP (LapakGIS/BIG) menjadi GeoJSON teroptimasi
dan menggabungkan indikator analitik kesetaraan gender BPS 2024.

Hasil ekstraksi disimpan di public/data/kabkota_kalimantan.geojson
tanpa memerlukan API eksternal (100% Client-side & Offline-ready).
"""

import json
import os
import geopandas as gpd
from shapely.geometry import mapping

def extract_shp_to_geojson():
    shp_path = '[LapakGIS.com]_BATAS_KABKOTA_AR_EDISI_JULI_2026_.shp'
    json_path = 'data/kabkota_514.json'
    out_public = 'public/data/kabkota_kalimantan.geojson'
    out_data = 'data/kabkota_kalimantan.geojson'

    print(f"Membaca shapefile: {shp_path}...")
    gdf = gpd.read_file(shp_path)
    print(f"Jumlah entitas batas wilayah: {len(gdf)} entitas.")

    print(f"Membaca dataset indikator: {json_path}...")
    with open(json_path, 'r', encoding='utf-8') as f:
        kabkota_list = json.load(f)

    def normalize_name(s):
        s = s.lower().replace('kabupaten', '').replace('kota', '').replace(' ', '').replace('_', '').replace('-', '')
        if s in ['mahakamulu', 'mahakamhulu']:
            return 'mahakamulu'
        return s

    # Simplifikasi geometri dengan toleransi topologi (menjaga batas persinggungan)
    print("Menyederhanakan poligon untuk performa render cepat tanpa API...")
    gdf['geometry'] = gdf.geometry.simplify(0.003, preserve_topology=True)

    features = []
    matched_count = 0

    for idx, row in gdf.iterrows():
        shp_name = str(row.get('WADMKK', '')).strip()
        prov_name = str(row.get('WADMPR', '')).strip()
        norm_shp = normalize_name(shp_name)

        # Pencocokan nama entitas dengan data analitik BPS 2024
        match = None
        for k in kabkota_list:
            if k.get('pulau') != 'Kalimantan':
                continue
            # Penanganan khusus perubahan nomenklatur Kab. Pontianak -> Kab. Mempawah
            if norm_shp == 'mempawah' and k.get('wilayah') == 'PONTIANAK' and k.get('tipe') == 'Kabupaten':
                match = k
                break
            if norm_shp == 'pontianak' and k.get('wilayah') == 'KOTA PONTIANAK':
                match = k
                break
            norm_k = normalize_name(k['nama_resmi'])
            if norm_k == norm_shp:
                match = k
                break

        # Kompilasi atribut analitik ke dalam properti GeoJSON
        props = {
            'WADMKK': shp_name,
            'WADMPR': prov_name,
            'LUASWH': float(row.get('LUASWH', 0)) if row.get('LUASWH') is not None else 0,
        }

        if match:
            matched_count += 1
            props.update({
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

        geom_json = mapping(row['geometry'])

        # Pembulatan koordinat 5 desimal (~1.1 meter) untuk menghemat bandwidth
        def round_coords(geom):
            if geom['type'] == 'Polygon':
                geom['coordinates'] = [[[round(c, 5) for c in pt] for pt in ring] for ring in geom['coordinates']]
            elif geom['type'] == 'MultiPolygon':
                geom['coordinates'] = [[[[round(c, 5) for c in pt] for pt in ring] for ring in poly] for poly in geom['coordinates']]
            return geom

        geom_json = round_coords(geom_json)

        features.append({
            'type': 'Feature',
            'id': match.get('kode_wilayah') if match else idx,
            'properties': props,
            'geometry': geom_json
        })

    geojson_out = {
        'type': 'FeatureCollection',
        'metadata': {
            'title': 'Batas Administrasi Kabupaten/Kota Terintegrasi Indikator BPS 2024',
            'description': 'Hasil ekstraksi shapefile poligon batas kabupaten/kota Pulau Kalimantan dengan metadata analitik gender komprehensif.',
            'count': len(features),
            'matched_records': matched_count,
            'crs': 'urn:ogc:def:crs:OGC:1.3:CRS84',
            'no_api_required': True
        },
        'features': features
    }

    os.makedirs(os.path.dirname(out_public), exist_ok=True)
    with open(out_public, 'w', encoding='utf-8') as f:
        json.dump(geojson_out, f, ensure_ascii=False)

    os.makedirs(os.path.dirname(out_data), exist_ok=True)
    with open(out_data, 'w', encoding='utf-8') as f:
        json.dump(geojson_out, f, ensure_ascii=False)

    sz_kb = os.path.getsize(out_public) / 1024
    print(f"Sukses mengekstrak {matched_count}/{len(gdf)} wilayah ke '{out_public}' ({sz_kb:.1f} KB).")

if __name__ == '__main__':
    extract_shp_to_geojson()
