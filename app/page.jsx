'use client';

import { useState, useEffect, useRef } from 'react';

// ============================================================================
// BPS Official Statistical Tables (Tahun 2024)
// Sumber sah: Badan Pusat Statistik Republik Indonesia
// ============================================================================
const BPS_STAT_TABLES = {
  pengeluaran: {
    nama: '[Metode Baru] Pengeluaran per Kapita Disesuaikan',
    tahun: '2024',
    url: 'https://www.bps.go.id/id/statistics-table/2/NDE2IzI=/-metode-baru--pengeluaran-per-kapita-disesuaikan.html'
  },
  ahh: {
    nama: 'Angka Harapan Hidup (AHH) Menurut Kabupaten/Kota dan Jenis Kelamin',
    tahun: '2024',
    url: 'https://www.bps.go.id/id/statistics-table/2/NDU1IzI=/angkaharapan-hidup--ahh--menurut-kabupaten-kota-dan-jenis-kelamin.html'
  },
  hls: {
    nama: '[Metode Baru] Harapan Lama Sekolah',
    tahun: '2024',
    url: 'https://www.bps.go.id/id/statistics-table/2/NDE3IzI=/-new-method--expected-years-of-schooling.html'
  },
  rls: {
    nama: '[Metode Baru] Rata-rata Lama Sekolah',
    tahun: '2024',
    url: 'https://www.bps.go.id/id/statistics-table/2/NDE1IzI=/-metode-baru--rata-rata-lama-sekolah.html'
  },
  tpak: {
    nama: 'Tingkat Partisipasi Angkatan Kerja Menurut Jenis Kelamin',
    tahun: '2024',
    url: 'https://www.bps.go.id/id/statistics-table/2/MjIwMCMy/tingkat-partisipasi-angkatan-kerja-menurut-jenis-kelamin.html'
  },
  pendapatan: {
    nama: 'Sumbangan Pendapatan Perempuan',
    tahun: '2024',
    url: 'https://www.bps.go.id/id/statistics-table/2/NDY3IzI=/revenue-contribution-of-women.html'
  },
  parlemen: {
    nama: 'Keterlibatan Perempuan di Parlemen',
    tahun: '2024',
    url: 'https://www.bps.go.id/id/statistics-table/2/NDY0IzI=/the-involvement-of-women-in-parliament.html'
  },
  profesional: {
    nama: 'Tenaga Profesional Perempuan',
    tahun: '2024',
    url: 'https://www.bps.go.id/id/statistics-table/2/NDY1IzI=/the-percentage-of-female-professional-staff.html'
  }
};

const COMPOSITE_TO_BPS_KEYS = {
  skor_keputusan: ['parlemen', 'profesional'],
  skor_ekonomi: ['pendapatan', 'tpak', 'pengeluaran'],
  ikpp_komposit: ['parlemen', 'profesional', 'pendapatan', 'tpak', 'pengeluaran'],
  kuadran: ['pendapatan', 'tpak', 'pengeluaran', 'parlemen', 'profesional'],
  lisa_cluster_keputusan: ['parlemen', 'profesional'],
  lisa_cluster_ekonomi: ['pendapatan', 'tpak', 'pengeluaran']
};

function DataSourceBadge({ vars = [] }) {
  const resolvedKeys = new Set();
  vars.forEach(v => {
    if (COMPOSITE_TO_BPS_KEYS[v]) {
      COMPOSITE_TO_BPS_KEYS[v].forEach(k => resolvedKeys.add(k));
    } else if (BPS_STAT_TABLES[v]) {
      resolvedKeys.add(v);
    }
  });

  const keys = Array.from(resolvedKeys);
  if (keys.length === 0) return null;

  return (
    <div className="data-source-footer">
      <div className="data-source-label">
        <i className="fa-solid fa-database"></i>
        <span>Sumber Tabel BPS (Tahun 2024):</span>
      </div>
      <div className="data-source-items">
        {keys.map(k => {
          const item = BPS_STAT_TABLES[k];
          return (
            <a
              key={k}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="data-source-chip"
              title={`Buka tabel resmi BPS: ${item.nama}`}
            >
              <span>{item.nama}</span>
              <span className="source-year">2024</span>
              <i className="fa-solid fa-arrow-up-right-from-square"></i>
            </a>
          );
        })}
      </div>
    </div>
  );
}

export default function Home() {
  const [dataLoaded, setDataLoaded] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [allKabkota, setAllKabkota] = useState([]);
  const [allProvinsi, setAllProvinsi] = useState([]);
  const [nasionalStats, setNasionalStats] = useState({});
  const [pcaMeta, setPcaMeta] = useState({});
  const [corrData, setCorrData] = useState({});
  const [geojsonData, setGeojsonData] = useState(null);
  const [kabkotaGeojson, setKabkotaGeojson] = useState(null);
  const [kabkotaKalimantanGeojson, setKabkotaKalimantanGeojson] = useState(null);
  const [boundaryScope, setBoundaryScope] = useState('nasional');
  const [selectedKabDetail, setSelectedKabDetail] = useState(null);

  // Filters
  const [selectedPulau, setSelectedPulau] = useState('Semua Pulau');
  const [selectedProv, setSelectedProv] = useState('Semua Provinsi');
  const [selectedTipe, setSelectedTipe] = useState('Semua');
  const [selectedKuadran, setSelectedKuadran] = useState('Semua Kuadran');
  const [selectedPalette, setSelectedPalette] = useState('Viridis');

  // Tabs
  const [activeTab, setActiveTab] = useState('tab-overview');
  const [activeGeoSubtab, setActiveGeoSubtab] = useState('geo-subtab-kabkota-boundary');
  const [activeMultiSubtab, setActiveMultiSubtab] = useState('multi-subtab-pca');
  const [activeHierSubtab, setActiveHierSubtab] = useState('hier-subtab-treemap');

  // Hierarchical Region Selector
  const [hierViewMode, setHierViewMode] = useState('pulau');
  const [hierSelectedProv, setHierSelectedProv] = useState('Semua Provinsi');
  const [hierSelectedKab, setHierSelectedKab] = useState('Semua Kab/Kota');

  // Dynamic Chart Controls
  const [geoSizeVar, setGeoSizeVar] = useState('pengeluaran');
  const [geoColorVar, setGeoColorVar] = useState('skor_keputusan');
  const [choroplethVar, setChoroplethVar] = useState('parlemen');
  const [kabkotaChoroplethVar, setKabkotaChoroplethVar] = useState('parlemen');
  const [heatmapVar, setHeatmapVar] = useState('parlemen');
  const [heatmapScope, setHeatmapScope] = useState('nasional');
  const [heatmapRadius, setHeatmapRadius] = useState(28);
  const [heatmapBlur, setHeatmapBlur] = useState(18);
  const [heatmapShowBoundaries, setHeatmapShowBoundaries] = useState(true);
  const [heatmapShowPoints, setHeatmapShowPoints] = useState(true);
  const [lisaClusterVar, setLisaClusterVar] = useState('lisa_cluster_keputusan');
  const [pcaColorBy, setPcaColorBy] = useState('pulau');
  const [hierSizeVar, setHierSizeVar] = useState('pengeluaran');
  const [hierColorVar, setHierColorVar] = useState('parlemen');

  // Table State
  const [tableSearch, setTableSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortCol, setSortCol] = useState('ikpp_komposit');
  const [sortAsc, setSortAsc] = useState(false);
  const rowsPerPage = 15;

  // Map references
  const kabkotaBoundaryMapRef = useRef(null);
  const heatmapMapRef = useRef(null);
  const leafletMapRef = useRef(null);
  const choroplethMapRef = useRef(null);
  const lisaMapRef = useRef(null);

  // Load Data
  useEffect(() => {
    async function fetchData() {
      try {
        const [resKab, resProv, resNas, resPca, resCorr, resGeo, resKabNat, resKabKal] = await Promise.all([
          fetch('/data/kabkota_514.json').then(r => r.json()),
          fetch('/data/provinsi_38.json').then(r => r.json()),
          fetch('/data/nasional.json').then(r => r.json()),
          fetch('/data/pca_meta.json').then(r => r.json()),
          fetch('/data/correlation_matrix.json').then(r => r.json()),
          fetch('/data/provinsi.geojson').then(r => r.json()).catch(() => null),
          fetch('/data/kabkota_indonesia.geojson').then(r => r.json()).catch(() => null),
          fetch('/data/kabkota_kalimantan.geojson').then(r => r.json()).catch(() => null)
        ]);

        setAllKabkota(resKab);
        setAllProvinsi(resProv);
        setNasionalStats(resNas);
        setPcaMeta(resPca);
        setCorrData(resCorr);
        setGeojsonData(resGeo);
        setKabkotaGeojson(resKabNat || resKabKal);
        setKabkotaKalimantanGeojson(resKabKal);
        setDataLoaded(true);
      } catch (err) {
        console.error("Error loading JSON data:", err);
      }
    }
    fetchData();
  }, []);

  // Responsive resize handler for Plotly charts and Leaflet maps
  useEffect(() => {
    const handleResize = () => {
      if (typeof window !== 'undefined' && window.Plotly) {
        ['quadrant-chart', 'pca-biplot-chart', 'parallel-coords-chart', 'heatmap-chart', 'radar-chart', 'treemap-chart', 'sunburst-chart'].forEach(id => {
          const el = document.getElementById(id);
          if (el) window.Plotly.Plots.resize(el);
        });
      }
      [kabkotaBoundaryMapRef, heatmapMapRef, leafletMapRef, choroplethMapRef, lisaMapRef].forEach(ref => {
        if (ref.current && typeof ref.current.invalidateSize === 'function') {
          ref.current.invalidateSize();
        }
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // When active tabs change, invalidate map sizes so they render accurately
  useEffect(() => {
    const timer = setTimeout(() => {
      [kabkotaBoundaryMapRef, heatmapMapRef, leafletMapRef, choroplethMapRef, lisaMapRef].forEach(ref => {
        if (ref.current && typeof ref.current.invalidateSize === 'function') {
          ref.current.invalidateSize();
        }
      });
    }, 200);
    return () => clearTimeout(timer);
  }, [activeTab, activeGeoSubtab, activeMultiSubtab, activeHierSubtab]);

  // Filter Data
  const filteredKabkota = allKabkota.filter(d => {
    if (selectedPulau !== 'Semua Pulau' && d.pulau !== selectedPulau) return false;
    if (selectedProv !== 'Semua Provinsi' && d.provinsi !== selectedProv) return false;
    if (selectedTipe !== 'Semua' && d.tipe !== selectedTipe) return false;
    if (selectedKuadran !== 'Semua Kuadran' && d.kuadran !== selectedKuadran) return false;
    return true;
  });

  // Calculate Province Dropdown List
  const availableProvs = [
    'Semua Provinsi',
    ...new Set(
      (selectedPulau === 'Semua Pulau' ? allKabkota : allKabkota.filter(d => d.pulau === selectedPulau))
        .map(d => d.provinsi)
    )
  ].sort();

  // Hierarchical tab: available provinces and kabkota based on hierViewMode
  const hierAvailableProvs = [
    'Semua Provinsi',
    ...new Set(filteredKabkota.map(d => d.provinsi))
  ].sort();

  const hierAvailableKabs = [
    'Semua Kab/Kota',
    ...(hierSelectedProv === 'Semua Provinsi'
      ? filteredKabkota.map(d => d.nama_resmi)
      : filteredKabkota.filter(d => d.provinsi === hierSelectedProv).map(d => d.nama_resmi)
    )
  ].sort();

  // Hierarchical filtered data
  const hierFilteredData = filteredKabkota.filter(d => {
    if (hierSelectedProv !== 'Semua Provinsi' && d.provinsi !== hierSelectedProv) return false;
    if (hierSelectedKab !== 'Semua Kab/Kota' && d.nama_resmi !== hierSelectedKab) return false;
    return true;
  });

  // Color Palettes
  const PALETTES = {
    Viridis: ['#440154', '#482878', '#3e4989', '#31688e', '#26828e', '#1f9e89', '#35b779', '#6ece58', '#b5de2b', '#fde725'],
    Cividis: ['#00204d', '#002c69', '#003986', '#26456e', '#41525a', '#5b6049', '#797037', '#998122', '#bc930a', '#e1a700', '#ffd321'],
    Plasma: ['#0d0887', '#46039f', '#7201a8', '#9c179e', '#bd3786', '#d8576b', '#ed7953', '#fb9f3a', '#fdca26', '#f0f921'],
    Turbo: ['#30123b', '#4145ab', '#4675ed', '#39a2fc', '#1bcfd4', '#24eca6', '#61fc6c', '#a4fc3b', '#d1e834', '#f3c63a', '#fe9b2d', '#f36315', '#d93806', '#b11902', '#7a0403']
  };

  // Render Charts on State Changes
  useEffect(() => {
    if (!dataLoaded || typeof window === 'undefined' || !window.Plotly) return;

    if (activeTab === 'tab-overview') {
      renderQuadrantScatter();
    } else if (activeTab === 'tab-geospatial') {
      renderGeospatialTab();
    } else if (activeTab === 'tab-multivariate') {
      renderMultivariateTab();
    } else if (activeTab === 'tab-hierarchical') {
      renderHierarchicalTab();
    }
  }, [
    dataLoaded,
    activeTab,
    activeGeoSubtab,
    activeMultiSubtab,
    activeHierSubtab,
    selectedPulau,
    selectedProv,
    selectedTipe,
    selectedKuadran,
    selectedPalette,
    geoSizeVar,
    geoColorVar,
    choroplethVar,
    kabkotaChoroplethVar,
    boundaryScope,
    heatmapVar,
    heatmapScope,
    heatmapRadius,
    heatmapBlur,
    heatmapShowBoundaries,
    heatmapShowPoints,
    kabkotaGeojson,
    kabkotaKalimantanGeojson,
    lisaClusterVar,
    pcaColorBy,
    hierSizeVar,
    hierColorVar,
    hierViewMode,
    hierSelectedProv,
    hierSelectedKab
  ]);

  // 1. Quadrant Scatter
  function renderQuadrantScatter() {
    const medX = 45.8;
    const medY = 38.2;
    const islands = [...new Set(filteredKabkota.map(d => d.pulau))];

    const traces = islands.map(pulau => {
      const subset = filteredKabkota.filter(d => d.pulau === pulau);
      return {
        x: subset.map(d => d.skor_ekonomi),
        y: subset.map(d => d.skor_keputusan),
        text: subset.map(d => `<b>${d.nama_resmi}</b> (${d.provinsi})<br>Parlemen: ${d.parlemen}%<br>Pendapatan: ${d.pendapatan}%<br>Profesional: ${d.profesional}%<br>Pengeluaran: Rp${Number(d.pengeluaran).toLocaleString()}`),
        mode: 'markers',
        name: pulau,
        marker: {
          size: subset.map(d => Math.max(7, Math.min(22, d.pengeluaran / 750))),
          opacity: 0.75,
          line: { width: 0.5, color: '#ffffff' }
        },
        hoverinfo: 'text'
      };
    });

    const layout = {
      title: { text: '<b>Tipologi Kuadran Disparitas: Partisipasi Ekonomi vs Pengambilan Keputusan</b>', font: { size: 14 } },
      xaxis: { title: 'Indeks Partisipasi Ekonomi Perempuan (0 - 100)', gridcolor: '#f1f5f9', zeroline: false },
      yaxis: { title: 'Indeks Pengambilan Keputusan Perempuan (0 - 100)', gridcolor: '#f1f5f9', zeroline: false },
      shapes: [
        { type: 'line', x0: medX, x1: medX, y0: 0, y1: 100, line: { dash: 'dash', color: '#64748b', width: 1.5 } },
        { type: 'line', x0: 0, x1: 100, y0: medY, y1: medY, line: { dash: 'dash', color: '#64748b', width: 1.5 } }
      ],
      annotations: [
        { x: medX + 22, y: medY + 28, text: '<b>KUADRAN I</b><br>Maju & Seimbang<br>(Ekonomi ↑, Keputusan ↑)', showarrow: false, font: { color: '#16a34a', size: 10.5 }, bgcolor: 'rgba(22, 163, 74, 0.1)' },
        { x: medX - 22, y: medY + 28, text: '<b>KUADRAN II</b><br>Representasi Kuat<br>(Ekonomi ↓, Keputusan ↑)', showarrow: false, font: { color: '#2563eb', size: 10.5 }, bgcolor: 'rgba(37, 99, 235, 0.1)' },
        { x: medX - 22, y: medY - 28, text: '<b>KUADRAN III</b><br>Tertinggal Ganda<br>(Ekonomi ↓, Keputusan ↓)', showarrow: false, font: { color: '#dc2626', size: 10.5 }, bgcolor: 'rgba(220, 38, 38, 0.1)' },
        { x: medX + 22, y: medY - 28, text: '<b>KUADRAN IV</b><br>Pekerja Keras Kurang Kuasa<br>(Ekonomi ↑, Keputusan ↓)', showarrow: false, font: { color: '#d97706', size: 10.5 }, bgcolor: 'rgba(217, 119, 6, 0.1)' }
      ],
      legend: { orientation: 'h', y: -0.18, x: 0.5, xanchor: 'center' },
      margin: { l: 50, r: 20, t: 45, b: 50 },
      height: 420,
      paper_bgcolor: 'transparent',
      plot_bgcolor: 'transparent'
    };

    window.Plotly.react('quadrant-chart', traces, layout, { responsive: true, displayModeBar: false });
  }

  // 2. Geospatial Views (Leaflet)
  function renderGeospatialTab() {
    if (!window.L) return;
    setTimeout(() => {
      if (activeGeoSubtab === 'geo-subtab-kabkota-boundary') {
        renderLeafletKabkotaBoundary();
      } else if (activeGeoSubtab === 'geo-subtab-heatmap') {
        renderLeafletHeatmap();
      } else if (activeGeoSubtab === 'geo-subtab-proportional') {
        renderLeafletProportional();
      } else if (activeGeoSubtab === 'geo-subtab-choropleth') {
        renderLeafletChoropleth();
      } else if (activeGeoSubtab === 'geo-subtab-lisa') {
        renderLeafletLISA();
      }
    }, 150);
  }

  const CLEAN_BASEMAP_URL = 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}';
  const CLEAN_BASEMAP_ATTR = '&copy; Esri, HERE, Garmin, &copy; OpenStreetMap | Bebas API Key & Tanpa Watermark';

  // 2a. Peta Batas Kabupaten/Kota (GeoJSON Nasional 514 Kab/Kota - Zero API)
  function renderLeafletKabkotaBoundary() {
    const el = document.getElementById('kabkota-boundary-map');
    const activeGeo = kabkotaGeojson || kabkotaKalimantanGeojson;
    if (!el || !activeGeo || !window.L) return;

    if (!kabkotaBoundaryMapRef.current) {
      kabkotaBoundaryMapRef.current = window.L.map('kabkota-boundary-map', {
        scrollWheelZoom: false,
        attributionControl: true
      }).setView([-2.2, 118.0], 5);

      window.L.tileLayer(CLEAN_BASEMAP_URL, {
        attribution: CLEAN_BASEMAP_ATTR,
        maxZoom: 16
      }).addTo(kabkotaBoundaryMapRef.current);
    } else {
      kabkotaBoundaryMapRef.current.eachLayer(layer => {
        if (layer instanceof window.L.GeoJSON) kabkotaBoundaryMapRef.current.removeLayer(layer);
      });
    }

    const palette = PALETTES[selectedPalette] || PALETTES['Viridis'];

    const isCategorical = ['kuadran', 'lisa_cluster_keputusan', 'lisa_cluster_ekonomi'].includes(kabkotaChoroplethVar);
    let minVal = 0;
    let maxVal = 100;

    if (!isCategorical) {
      const vals = activeGeo.features
        .map(f => f.properties[kabkotaChoroplethVar])
        .filter(v => v !== undefined && v !== null && !isNaN(v));
      if (vals.length > 0) {
        minVal = Math.min(...vals);
        maxVal = Math.max(...vals);
      }
    }

    function getPolygonColor(props) {
      const val = props[kabkotaChoroplethVar];
      if (val === undefined || val === null) return '#cbd5e1';

      if (kabkotaChoroplethVar === 'kuadran') {
        const str = String(val);
        if (str.includes('Kuadran I')) return '#16a34a';
        if (str.includes('Kuadran II')) return '#2563eb';
        if (str.includes('Kuadran III')) return '#dc2626';
        if (str.includes('Kuadran IV')) return '#d97706';
        return '#94a3b8';
      }

      if (kabkotaChoroplethVar === 'lisa_cluster_keputusan' || kabkotaChoroplethVar === 'lisa_cluster_ekonomi') {
        const clusters = {
          'High-High (Hotspot)': '#dc2626',
          'Low-Low (Coldspot)': '#2563eb',
          'High-Low (Spatial Outlier)': '#f97316',
          'Low-High (Spatial Outlier)': '#10b981',
          'Not Significant': '#cbd5e1'
        };
        return clusters[val] || '#cbd5e1';
      }

      const norm = (val - minVal) / (maxVal - minVal || 1);
      const idx = Math.min(palette.length - 1, Math.max(0, Math.floor(norm * (palette.length - 1))));
      return palette[idx];
    }

    const geoLayer = window.L.geoJson(activeGeo, {
      filter: (feature) => {
        if (selectedPulau !== 'Semua Pulau' && feature.properties.pulau !== selectedPulau) return false;
        return true;
      },
      style: (feature) => {
        const p = feature.properties;
        const matchesFilter = selectedProv === 'Semua Provinsi' || p.provinsi === selectedProv;
        return {
          fillColor: getPolygonColor(p),
          weight: 1.1,
          opacity: 1,
          color: '#ffffff',
          dashArray: '1',
          fillOpacity: matchesFilter ? 0.85 : 0.2
        };
      },
      onEachFeature: (feature, layer) => {
        const p = feature.properties;
        const val = p[kabkotaChoroplethVar];
        const displayVal = typeof val === 'number'
          ? (kabkotaChoroplethVar === 'pengeluaran' ? `Rp${Number(val).toLocaleString('id-ID')}` : `${val.toFixed(2)}%`)
          : (val || 'N/A');

        layer.bindTooltip(`
          <div style="font-family: sans-serif; font-size: 12px; line-height: 1.4;">
            <strong style="color: #0f172a; font-size: 13px;">${p.nama_resmi || p.WADMKK}</strong><br/>
            <span style="color: #64748b;">${p.provinsi || p.WADMPR} (${p.tipe || 'Kab/Kota'})</span>
            <div style="margin-top: 5px; padding-top: 5px; border-top: 1px solid #e2e8f0; font-weight: 600;">
              ${kabkotaChoroplethVar.toUpperCase()}: <span style="color: #2563eb; font-weight: 800;">${displayVal}</span>
            </div>
            <div style="font-size: 11px; color: #059669; font-weight: 600; margin-top: 2px;">
              ${p.kuadran ? p.kuadran.split('(')[0] : ''}
            </div>
          </div>
        `, { sticky: true });

        layer.on({
          mouseover: (e) => {
            const l = e.target;
            l.setStyle({
              weight: 2.8,
              color: '#0f172a',
              dashArray: '',
              fillOpacity: 0.95
            });
            l.bringToFront();
          },
          mouseout: (e) => {
            geoLayer.resetStyle(e.target);
          },
          click: (e) => {
            setSelectedKabDetail(p);
            kabkotaBoundaryMapRef.current.fitBounds(e.target.getBounds(), { padding: [35, 35] });
          }
        });
      }
    }).addTo(kabkotaBoundaryMapRef.current);

    if (selectedProv !== 'Semua Provinsi') {
      const provFeatures = activeGeo.features.filter(f => f.properties.provinsi === selectedProv);
      if (provFeatures.length > 0) {
        const tempGroup = window.L.geoJson({ type: 'FeatureCollection', features: provFeatures });
        kabkotaBoundaryMapRef.current.fitBounds(tempGroup.getBounds(), { padding: [30, 30] });
      }
    } else if (selectedPulau !== 'Semua Pulau') {
      const pulauFeatures = activeGeo.features.filter(f => f.properties.pulau === selectedPulau);
      if (pulauFeatures.length > 0) {
        const tempGroup = window.L.geoJson({ type: 'FeatureCollection', features: pulauFeatures });
        kabkotaBoundaryMapRef.current.fitBounds(tempGroup.getBounds(), { padding: [30, 30] });
      }
    } else {
      kabkotaBoundaryMapRef.current.setView([-2.2, 118.0], 5);
    }

    kabkotaBoundaryMapRef.current.invalidateSize();
  }

  // 2b. Peta Heatmap Spasial Kab/Kota (Kernel Density Estimation - Zero API)
  function renderLeafletHeatmap() {
    const el = document.getElementById('heatmap-map');
    if (!el || !window.L) return;

    if (!window.L.heatLayer) {
      const script = document.createElement('script');
      script.src = '/leaflet-heat.js';
      script.onload = () => {
        if (activeGeoSubtab === 'geo-subtab-heatmap') renderLeafletHeatmap();
      };
      document.body.appendChild(script);
      return;
    }

    if (!heatmapMapRef.current) {
      heatmapMapRef.current = window.L.map('heatmap-map', {
        scrollWheelZoom: false,
        attributionControl: true
      }).setView([-2.2, 118.0], 5);

      window.L.tileLayer(CLEAN_BASEMAP_URL, {
        attribution: CLEAN_BASEMAP_ATTR,
        maxZoom: 16
      }).addTo(heatmapMapRef.current);
    } else {
      heatmapMapRef.current.eachLayer(layer => {
        if (layer instanceof window.L.TileLayer) return;
        heatmapMapRef.current.removeLayer(layer);
      });
    }

    const dataset = filteredKabkota;

    const validData = dataset.filter(d => d.lat && d.lon && d[heatmapVar] !== undefined && d[heatmapVar] !== null);
    if (validData.length === 0) return;

    const minV = Math.min(...validData.map(d => d[heatmapVar]));
    const maxV = Math.max(...validData.map(d => d[heatmapVar]));

    const heatPoints = validData.map(d => {
      const norm = (d[heatmapVar] - minV) / (maxV - minV || 1);
      const intensity = Math.max(0.18, Math.min(1.0, norm));
      return [d.lat, d.lon, intensity];
    });

    window.L.heatLayer(heatPoints, {
      radius: heatmapRadius,
      blur: heatmapBlur,
      maxZoom: 12,
      minOpacity: 0.35,
      gradient: {
        0.15: '#3b82f6',
        0.35: '#06b6d4',
        0.55: '#10b981',
        0.75: '#f59e0b',
        0.95: '#ef4444'
      }
    }).addTo(heatmapMapRef.current);

    const activeGeo = kabkotaGeojson;

    if (heatmapShowBoundaries && activeGeo) {
      window.L.geoJson(activeGeo, {
        filter: (feature) => {
          if (selectedPulau !== 'Semua Pulau' && feature.properties.pulau !== selectedPulau) return false;
          return true;
        },
        style: () => ({
          fillColor: 'transparent',
          fillOpacity: 0,
          color: '#334155',
          weight: 1.1,
          opacity: 0.65,
          dashArray: '3'
        }),
        onEachFeature: (feature, layer) => {
          layer.bindTooltip(`<b>${feature.properties.nama_resmi}</b> (${feature.properties.provinsi})`, { sticky: true });
        }
      }).addTo(heatmapMapRef.current);
    }

    if (heatmapShowPoints) {
      validData.forEach(d => {
        const marker = window.L.circleMarker([d.lat, d.lon], {
          radius: 3.5,
          color: '#0f172a',
          fillColor: '#ffffff',
          weight: 1.2,
          opacity: 0.9,
          fillOpacity: 0.85
        }).addTo(heatmapMapRef.current);

        marker.bindPopup(`
          <div style="font-family: sans-serif; font-size: 12px;">
            <b>${d.nama_resmi}</b> (${d.provinsi})<br>
            <b>${heatmapVar.toUpperCase()}:</b> ${typeof d[heatmapVar] === 'number' ? (heatmapVar === 'pengeluaran' ? 'Rp' + Number(d[heatmapVar]).toLocaleString('id-ID') : d[heatmapVar].toFixed(2) + '%') : d[heatmapVar]}<br>
            <span style="color: #64748b; font-size: 11px;">Lat: ${d.lat.toFixed(3)}, Lon: ${d.lon.toFixed(3)}</span>
          </div>
        `);
      });
    }

    if (selectedProv !== 'Semua Provinsi' && kabkotaGeojson) {
      const provFeatures = kabkotaGeojson.features.filter(f => f.properties.provinsi === selectedProv);
      if (provFeatures.length > 0) {
        const tempGroup = window.L.geoJson({ type: 'FeatureCollection', features: provFeatures });
        heatmapMapRef.current.fitBounds(tempGroup.getBounds(), { padding: [30, 30] });
      }
    } else if (selectedPulau !== 'Semua Pulau' && kabkotaGeojson) {
      const pulauFeatures = kabkotaGeojson.features.filter(f => f.properties.pulau === selectedPulau);
      if (pulauFeatures.length > 0) {
        const tempGroup = window.L.geoJson({ type: 'FeatureCollection', features: pulauFeatures });
        heatmapMapRef.current.fitBounds(tempGroup.getBounds(), { padding: [30, 30] });
      }
    } else {
      heatmapMapRef.current.setView([-2.2, 118.0], 5);
    }

    heatmapMapRef.current.invalidateSize();
  }

  function renderLeafletProportional() {
    const el = document.getElementById('leaflet-map');
    if (!el) return;

    if (!leafletMapRef.current) {
      leafletMapRef.current = window.L.map('leaflet-map', { scrollWheelZoom: false }).setView([-2.2, 118.0], 5);
      window.L.tileLayer(CLEAN_BASEMAP_URL, {
        attribution: CLEAN_BASEMAP_ATTR,
        maxZoom: 16
      }).addTo(leafletMapRef.current);
    } else {
      leafletMapRef.current.eachLayer(layer => {
        if (layer instanceof window.L.CircleMarker) leafletMapRef.current.removeLayer(layer);
      });
    }

    const minVal = Math.min(...filteredKabkota.map(d => d[geoColorVar]));
    const maxVal = Math.max(...filteredKabkota.map(d => d[geoColorVar]));
    const palette = PALETTES[selectedPalette] || PALETTES['Viridis'];

    function getColor(val) {
      const norm = (val - minVal) / (maxVal - minVal || 1);
      const idx = Math.min(palette.length - 1, Math.max(0, Math.floor(norm * (palette.length - 1))));
      return palette[idx];
    }

    filteredKabkota.forEach(d => {
      if (d.lat && d.lon) {
        let radius = 6;
        if (geoSizeVar === 'pengeluaran') radius = Math.max(4, Math.min(18, d.pengeluaran / 1000));
        else if (geoSizeVar === 'tpak') radius = Math.max(4, Math.min(18, d.tpak / 6));
        else radius = Math.max(4, Math.min(18, (d[geoSizeVar] || 10) / 4));

        const marker = window.L.circleMarker([d.lat, d.lon], {
          radius: radius,
          fillColor: getColor(d[geoColorVar]),
          color: '#ffffff',
          weight: 1,
          opacity: 0.9,
          fillOpacity: 0.75
        }).addTo(leafletMapRef.current);

        marker.bindPopup(`
          <div style="font-family: sans-serif; font-size: 12px; min-width: 180px;">
            <h4 style="margin: 0 0 4px 0; font-size: 13px; color: #1e293b;">${d.nama_resmi}</h4>
            <p style="margin: 0 0 6px 0; color: #64748b;">${d.provinsi} (${d.tipe})</p>
            <hr style="margin: 4px 0; border: none; border-top: 1px solid #e2e8f0;">
            <div><b>Parlemen:</b> ${d.parlemen}%</div>
            <div><b>Pendapatan:</b> ${d.pendapatan}%</div>
            <div><b>Profesional:</b> ${d.profesional}%</div>
            <div><b>TPAK:</b> ${d.tpak}%</div>
            <div><b>Pengeluaran:</b> Rp${Number(d.pengeluaran).toLocaleString()}</div>
            <div style="margin-top: 4px; padding: 2px 4px; background: #e0f2fe; border-radius: 3px; font-weight: bold; color: #0369a1;">${d.kuadran}</div>
          </div>
        `);
      }
    });

    leafletMapRef.current.invalidateSize();
  }

  function renderLeafletChoropleth() {
    const el = document.getElementById('choropleth-map');
    if (!el || !geojsonData) return;

    if (!choroplethMapRef.current) {
      choroplethMapRef.current = window.L.map('choropleth-map', { scrollWheelZoom: false }).setView([-2.2, 118.0], 5);
      window.L.tileLayer(CLEAN_BASEMAP_URL, {
        attribution: CLEAN_BASEMAP_ATTR,
        maxZoom: 16
      }).addTo(choroplethMapRef.current);
    } else {
      choroplethMapRef.current.eachLayer(layer => {
        if (layer instanceof window.L.GeoJSON) choroplethMapRef.current.removeLayer(layer);
      });
    }

    const provMap = {};
    allProvinsi.forEach(p => {
      provMap[p.provinsi.toUpperCase()] = p[choroplethVar];
    });

    const vals = Object.values(provMap);
    const minVal = Math.min(...vals);
    const maxVal = Math.max(...vals);
    const palette = PALETTES[selectedPalette] || PALETTES['Viridis'];

    function getColor(val) {
      if (val === undefined || isNaN(val)) return '#cbd5e1';
      const norm = (val - minVal) / (maxVal - minVal || 1);
      const idx = Math.min(palette.length - 1, Math.max(0, Math.floor(norm * (palette.length - 1))));
      return palette[idx];
    }

    window.L.geoJson(geojsonData, {
      style: (feature) => {
        const name = (feature.properties.Propinsi || feature.properties.name || '').toUpperCase();
        const val = provMap[name] || provMap[name.replace('IRIAN JAYA BARAT', 'PAPUA BARAT')];
        return {
          fillColor: getColor(val),
          weight: 1.2,
          opacity: 1,
          color: '#ffffff',
          dashArray: '2',
          fillOpacity: 0.75
        };
      },
      onEachFeature: (feature, layer) => {
        const name = feature.properties.Propinsi || feature.properties.name;
        const val = provMap[name.toUpperCase()] || 'N/A';
        layer.bindTooltip(`<b>${name}</b><br>${choroplethVar.toUpperCase()}: ${val}`);
      }
    }).addTo(choroplethMapRef.current);

    choroplethMapRef.current.invalidateSize();
  }

  function renderLeafletLISA() {
    const el = document.getElementById('lisa-map');
    if (!el) return;

    if (!lisaMapRef.current) {
      lisaMapRef.current = window.L.map('lisa-map', { scrollWheelZoom: false }).setView([-2.2, 118.0], 5);
      window.L.tileLayer(CLEAN_BASEMAP_URL, {
        attribution: CLEAN_BASEMAP_ATTR,
        maxZoom: 16
      }).addTo(lisaMapRef.current);
    } else {
      lisaMapRef.current.eachLayer(layer => {
        if (layer instanceof window.L.CircleMarker) lisaMapRef.current.removeLayer(layer);
      });
    }

    const clusterColors = {
      'High-High (Hotspot)': '#dc2626',
      'Low-Low (Coldspot)': '#2563eb',
      'High-Low (Spatial Outlier)': '#f97316',
      'Low-High (Spatial Outlier)': '#10b981',
      'Not Significant': '#cbd5e1'
    };

    filteredKabkota.forEach(d => {
      if (d.lat && d.lon) {
        const c = d[lisaClusterVar] || 'Not Significant';
        const isSig = c !== 'Not Significant';
        const marker = window.L.circleMarker([d.lat, d.lon], {
          radius: isSig ? 8 : 4.5,
          fillColor: clusterColors[c] || '#cbd5e1',
          color: '#ffffff',
          weight: 1,
          opacity: 0.9,
          fillOpacity: isSig ? 0.85 : 0.4
        }).addTo(lisaMapRef.current);

        marker.bindPopup(`
          <div style="font-family: sans-serif; font-size: 12px;">
            <h4 style="margin: 0 0 4px 0; font-size: 13px;">${d.nama_resmi}</h4>
            <p style="margin: 0 0 6px 0; color: #64748b;">${d.provinsi}</p>
            <div style="font-weight: bold; color: ${clusterColors[c]}; margin-bottom: 4px;">Klaster: ${c}</div>
            <div>Parlemen: ${d.parlemen}%</div>
            <div>Sumbangan Pendapatan: ${d.pendapatan}%</div>
          </div>
        `);
      }
    });

    lisaMapRef.current.invalidateSize();
  }

  // 3. Multivariate Views
  function renderMultivariateTab() {
    if (activeMultiSubtab === 'multi-subtab-pca') {
      renderPCABiplot();
    } else if (activeMultiSubtab === 'multi-subtab-parcoords') {
      renderParallelCoords();
    } else if (activeMultiSubtab === 'multi-subtab-heatmap') {
      renderHeatmap();
    } else if (activeMultiSubtab === 'multi-subtab-radar') {
      renderRadar();
    }
  }

  function renderPCABiplot() {
    if (!pcaMeta || !pcaMeta.loadings) return;
    const groups = [...new Set(filteredKabkota.map(d => d[pcaColorBy]))];
    const traces = groups.map(grp => {
      const subset = filteredKabkota.filter(d => d[pcaColorBy] === grp);
      return {
        x: subset.map(d => d.pc1),
        y: subset.map(d => d.pc2),
        mode: 'markers',
        name: grp,
        text: subset.map(d => `<b>${d.nama_resmi}</b> (${d.provinsi})<br>PC1: ${d.pc1}<br>PC2: ${d.pc2}<br>Parlemen: ${d.parlemen}%<br>Pendapatan: ${d.pendapatan}%`),
        hoverinfo: 'text',
        marker: { size: 7, opacity: 0.75 }
      };
    });

    const annotations = [];
    pcaMeta.loadings.forEach(l => {
      annotations.push({
        ax: 0, ay: 0,
        x: l.x, y: l.y,
        xref: 'x', yref: 'y',
        axref: 'x', ayref: 'y',
        showarrow: true,
        arrowhead: 3,
        arrowsize: 1.2,
        arrowwidth: 2,
        arrowcolor: '#dc2626'
      });
      annotations.push({
        x: l.x * 1.15,
        y: l.y * 1.15,
        text: `<b>${l.label}</b>`,
        showarrow: false,
        font: { color: '#991b1b', size: 10 },
        bgcolor: 'rgba(255, 255, 255, 0.85)'
      });
    });

    const layout = {
      title: { text: `<b>PCA Biplot: 8 Indikator Gender (PC1: ${pcaMeta.var_exp_pc1}%, PC2: ${pcaMeta.var_exp_pc2}%)</b>`, font: { size: 13.5 } },
      xaxis: { title: `Komponen Utama 1 (${pcaMeta.var_exp_pc1}% Variansi: Kapasitas Sosial & Hidup Layak)`, zeroline: true, gridcolor: '#f1f5f9' },
      yaxis: { title: `Komponen Utama 2 (${pcaMeta.var_exp_pc2}% Variansi: Partisipasi Politik vs Kerja Fisik)`, zeroline: true, gridcolor: '#f1f5f9' },
      annotations: annotations,
      legend: { orientation: 'h', y: -0.16, x: 0.5, xanchor: 'center' },
      margin: { l: 50, r: 20, t: 40, b: 50 },
      height: 420,
      paper_bgcolor: 'transparent',
      plot_bgcolor: 'transparent'
    };

    window.Plotly.react('pca-biplot-chart', traces, layout, { responsive: true, displayModeBar: false });
  }

  function renderParallelCoords() {
    const trace = {
      type: 'parcoords',
      line: {
        color: filteredKabkota.map(d => d.skor_keputusan),
        colorscale: 'Viridis',
        showscale: true,
        colorbar: { title: 'Skor Keputusan' }
      },
      dimensions: [
        { range: [0, 50], label: 'Parlemen (%)', values: filteredKabkota.map(d => d.parlemen) },
        { range: [10, 65], label: 'Pendapatan (%)', values: filteredKabkota.map(d => d.pendapatan) },
        { range: [4000, 20000], label: 'Pengeluaran', values: filteredKabkota.map(d => d.pengeluaran) },
        { range: [55, 80], label: 'AHH (Thn)', values: filteredKabkota.map(d => d.ahh) },
        { range: [0, 100], label: 'Profesional (%)', values: filteredKabkota.map(d => d.profesional) },
        { range: [30, 95], label: 'TPAK (%)', values: filteredKabkota.map(d => d.tpak) },
        { range: [2, 13], label: 'RLS (Thn)', values: filteredKabkota.map(d => d.rls) },
        { range: [4, 16], label: 'HLS (Thn)', values: filteredKabkota.map(d => d.hls) }
      ]
    };

    const layout = {
      title: { text: '<b>Diagram Koordinat Paralel (Brushing & Filtering 8 Peubah)</b>', font: { size: 13.5 } },
      margin: { l: 50, r: 30, t: 40, b: 25 },
      height: 420,
      paper_bgcolor: 'transparent'
    };

    window.Plotly.react('parallel-coords-chart', [trace], layout, { responsive: true, displayModeBar: false });
  }

  function renderHeatmap() {
    if (!corrData || !corrData.z) return;
    const trace = {
      z: corrData.z,
      x: corrData.labels,
      y: corrData.labels,
      type: 'heatmap',
      colorscale: 'RdBu',
      reversescale: true,
      zmin: -1,
      zmax: 1,
      colorbar: { title: 'Korelasi' }
    };
    const layout = {
      title: { text: '<b>Clustered Heatmap: Matriks Asosiasi 8 Indikator BPS</b>', font: { size: 13.5 } },
      margin: { l: 110, r: 20, t: 40, b: 100 },
      height: 420,
      paper_bgcolor: 'transparent'
    };
    window.Plotly.react('heatmap-chart', [trace], layout, { responsive: true, displayModeBar: false });
  }

  function renderRadar() {
    const vars = ['parlemen', 'pendapatan', 'profesional', 'tpak', 'rls', 'hls', 'ahh', 'pengeluaran'];
    const labels = ['Parlemen', 'Pendapatan', 'Profesional', 'TPAK', 'RLS', 'HLS', 'AHH', 'Pengeluaran'];

    const mins = {};
    const maxs = {};
    vars.forEach(v => {
      mins[v] = Math.min(...allKabkota.map(d => d[v]));
      maxs[v] = Math.max(...allKabkota.map(d => d[v]));
    });

    const groups = ['Jawa', 'Sulawesi', 'Papua'];
    const traces = groups.map(grp => {
      const subset = allKabkota.filter(d => d.pulau === grp);
      const avgVals = vars.map(v => {
        const avg = subset.reduce((acc, d) => acc + d[v], 0) / subset.length;
        return ((avg - mins[v]) / (maxs[v] - mins[v])) * 100;
      });
      avgVals.push(avgVals[0]);
      return {
        type: 'scatterpolar',
        r: avgVals,
        theta: [...labels, labels[0]],
        fill: 'toself',
        name: grp,
        opacity: 0.6
      };
    });

    const layout = {
      title: { text: '<b>Radar Chart: Perbandingan Profil Multidimensi Antar Wilayah</b>', font: { size: 13.5 } },
      polar: { radialaxis: { visible: true, range: [0, 100] } },
      margin: { l: 40, r: 40, t: 40, b: 30 },
      height: 420,
      paper_bgcolor: 'transparent'
    };

    window.Plotly.react('radar-chart', traces, layout, { responsive: true, displayModeBar: false });
  }

  // 4. Hierarchical Views
  function renderHierarchicalTab() {
    if (activeHierSubtab === 'hier-subtab-treemap') {
      renderTreemap();
    } else if (activeHierSubtab === 'hier-subtab-sunburst') {
      renderSunburst();
    }
  }

  function renderTreemap() {
    const data = hierFilteredData;
    if (!data || data.length === 0) return;

    const ids = [];
    const labels = [];
    const parents = [];
    const values = [];
    const colors = [];
    const hovertexts = [];

    const rootId = 'ID_ROOT';
    const rootLabel = hierSelectedProv !== 'Semua Provinsi' ? hierSelectedProv : 'Indonesia';

    // Root node
    ids.push(rootId);
    labels.push(rootLabel);
    parents.push('');
    values.push(0);
    colors.push(0);
    hovertexts.push(`<b>${rootLabel}</b><br>Jumlah Wilayah: ${data.length}`);

    if (hierViewMode === 'pulau' && hierSelectedProv === 'Semua Provinsi') {
      const pulauSet = [...new Set(data.map(d => d.pulau))];
      pulauSet.forEach(pulau => {
        const pId = `pulau_${pulau}`;
        ids.push(pId);
        labels.push(pulau);
        parents.push(rootId);
        values.push(0);
        colors.push(0);
        hovertexts.push(`<b>Wilayah Pulau ${pulau}</b>`);
      });

      const provMap = new Map();
      data.forEach(d => {
        if (!provMap.has(d.provinsi)) provMap.set(d.provinsi, d.pulau);
      });

      provMap.forEach((pulau, prov) => {
        const prId = `prov_${prov}`;
        ids.push(prId);
        labels.push(prov);
        parents.push(`pulau_${pulau}`);
        values.push(0);
        colors.push(0);
        hovertexts.push(`<b>Provinsi ${prov}</b>`);
      });

      data.forEach((d, idx) => {
        const kId = `kab_${d.kode_wilayah}_${idx}`;
        ids.push(kId);
        labels.push(d.nama_resmi);
        parents.push(`prov_${d.provinsi}`);
        values.push(Math.max(1, Number(d[hierSizeVar]) || 1));
        colors.push(Number(d[hierColorVar]) || 0);
        const sizeFmt = hierSizeVar === 'pengeluaran' ? 'Rp' + Number(d[hierSizeVar]).toLocaleString('id-ID') : Number(d[hierSizeVar]).toFixed(2) + '%';
        const colorFmt = typeof d[hierColorVar] === 'number' ? Number(d[hierColorVar]).toFixed(2) : d[hierColorVar];
        hovertexts.push(`<b>${d.nama_resmi}</b><br>Prov: ${d.provinsi} (${d.pulau})<br>${hierSizeVar.toUpperCase()}: ${sizeFmt}<br>${hierColorVar.toUpperCase()}: ${colorFmt}<br>Kuadran: ${d.kuadran || '-'}`);
      });
    } else if (hierViewMode === 'provinsi' || (hierViewMode === 'pulau' && hierSelectedProv !== 'Semua Provinsi')) {
      if (hierSelectedProv === 'Semua Provinsi') {
        const provSet = [...new Set(data.map(d => d.provinsi))];
        provSet.forEach(prov => {
          const prId = `prov_${prov}`;
          ids.push(prId);
          labels.push(prov);
          parents.push(rootId);
          values.push(0);
          colors.push(0);
          hovertexts.push(`<b>Provinsi ${prov}</b>`);
        });

        data.forEach((d, idx) => {
          const kId = `kab_${d.kode_wilayah}_${idx}`;
          ids.push(kId);
          labels.push(d.nama_resmi);
          parents.push(`prov_${d.provinsi}`);
          values.push(Math.max(1, Number(d[hierSizeVar]) || 1));
          colors.push(Number(d[hierColorVar]) || 0);
          const sizeFmt = hierSizeVar === 'pengeluaran' ? 'Rp' + Number(d[hierSizeVar]).toLocaleString('id-ID') : Number(d[hierSizeVar]).toFixed(2) + '%';
          const colorFmt = typeof d[hierColorVar] === 'number' ? Number(d[hierColorVar]).toFixed(2) : d[hierColorVar];
          hovertexts.push(`<b>${d.nama_resmi}</b><br>Provinsi: ${d.provinsi}<br>${hierSizeVar.toUpperCase()}: ${sizeFmt}<br>${hierColorVar.toUpperCase()}: ${colorFmt}<br>Kuadran: ${d.kuadran || '-'}`);
        });
      } else {
        data.forEach((d, idx) => {
          const kId = `kab_${d.kode_wilayah}_${idx}`;
          ids.push(kId);
          labels.push(d.nama_resmi);
          parents.push(rootId);
          values.push(Math.max(1, Number(d[hierSizeVar]) || 1));
          colors.push(Number(d[hierColorVar]) || 0);
          const sizeFmt = hierSizeVar === 'pengeluaran' ? 'Rp' + Number(d[hierSizeVar]).toLocaleString('id-ID') : Number(d[hierSizeVar]).toFixed(2) + '%';
          const colorFmt = typeof d[hierColorVar] === 'number' ? Number(d[hierColorVar]).toFixed(2) : d[hierColorVar];
          hovertexts.push(`<b>${d.nama_resmi}</b><br>Tipe: ${d.tipe}<br>Provinsi: ${d.provinsi}<br>${hierSizeVar.toUpperCase()}: ${sizeFmt}<br>${hierColorVar.toUpperCase()}: ${colorFmt}<br>Kuadran: ${d.kuadran || '-'}`);
        });
      }
    } else {
      data.forEach((d, idx) => {
        const kId = `kab_${d.kode_wilayah}_${idx}`;
        ids.push(kId);
        labels.push(d.nama_resmi);
        parents.push(rootId);
        values.push(Math.max(1, Number(d[hierSizeVar]) || 1));
        colors.push(Number(d[hierColorVar]) || 0);
        const sizeFmt = hierSizeVar === 'pengeluaran' ? 'Rp' + Number(d[hierSizeVar]).toLocaleString('id-ID') : Number(d[hierSizeVar]).toFixed(2) + '%';
        const colorFmt = typeof d[hierColorVar] === 'number' ? Number(d[hierColorVar]).toFixed(2) : d[hierColorVar];
        hovertexts.push(`<b>${d.nama_resmi}</b> (${d.provinsi})<br>${hierSizeVar.toUpperCase()}: ${sizeFmt}<br>${hierColorVar.toUpperCase()}: ${colorFmt}`);
      });
    }

    const palette = PALETTES[selectedPalette] || PALETTES['Viridis'];
    const trace = {
      type: 'treemap',
      ids: ids,
      labels: labels,
      parents: parents,
      values: values,
      text: hovertexts,
      hoverinfo: 'text',
      marker: {
        colors: colors,
        colorscale: palette.map((c, i) => [i / (palette.length - 1), c]),
        showscale: true,
        colorbar: { title: hierColorVar.toUpperCase() }
      },
      branchvalues: 'remainder'
    };

    const modeLabel = hierViewMode === 'pulau' ? 'Pengelompokan Pulau' : hierViewMode === 'provinsi' ? 'Pengelompokan Provinsi' : 'Daftar Kab/Kota';
    const layout = {
      title: { text: `<b>Interactive Treemap (${modeLabel}): Ukuran = ${hierSizeVar.toUpperCase()} | Warna = ${hierColorVar.toUpperCase()}</b>`, font: { size: 13.5 } },
      margin: { l: 10, r: 10, t: 35, b: 10 },
      height: 420,
      paper_bgcolor: 'transparent'
    };

    window.Plotly.react('treemap-chart', [trace], layout, { responsive: true, displayModeBar: false });
  }

  function renderSunburst() {
    const data = hierFilteredData;
    if (!data || data.length === 0) return;

    const ids = [];
    const labels = [];
    const parents = [];
    const values = [];
    const colors = [];
    const hovertexts = [];

    const rootId = 'ID_ROOT';
    const rootLabel = hierSelectedProv !== 'Semua Provinsi' ? hierSelectedProv : 'Indonesia';

    ids.push(rootId);
    labels.push(rootLabel);
    parents.push('');
    values.push(0);
    colors.push(0);
    hovertexts.push(`<b>${rootLabel}</b><br>Jumlah Wilayah: ${data.length}`);

    if (hierViewMode === 'pulau' && hierSelectedProv === 'Semua Provinsi') {
      const pulauSet = [...new Set(data.map(d => d.pulau))];
      pulauSet.forEach(pulau => {
        const pId = `pulau_${pulau}`;
        ids.push(pId);
        labels.push(pulau);
        parents.push(rootId);
        values.push(0);
        colors.push(0);
        hovertexts.push(`<b>Wilayah Pulau ${pulau}</b>`);
      });

      const provMap = new Map();
      data.forEach(d => {
        if (!provMap.has(d.provinsi)) provMap.set(d.provinsi, d.pulau);
      });

      provMap.forEach((pulau, prov) => {
        const prId = `prov_${prov}`;
        ids.push(prId);
        labels.push(prov);
        parents.push(`pulau_${pulau}`);
        values.push(0);
        colors.push(0);
        hovertexts.push(`<b>Provinsi ${prov}</b>`);
      });

      data.forEach((d, idx) => {
        const kId = `kab_${d.kode_wilayah}_${idx}`;
        ids.push(kId);
        labels.push(d.nama_resmi);
        parents.push(`prov_${d.provinsi}`);
        values.push(Math.max(1, Number(d[hierSizeVar]) || 1));
        colors.push(Number(d[hierColorVar]) || 0);
        const sizeFmt = hierSizeVar === 'pengeluaran' ? 'Rp' + Number(d[hierSizeVar]).toLocaleString('id-ID') : Number(d[hierSizeVar]).toFixed(2) + '%';
        const colorFmt = typeof d[hierColorVar] === 'number' ? Number(d[hierColorVar]).toFixed(2) : d[hierColorVar];
        hovertexts.push(`<b>${d.nama_resmi}</b><br>Prov: ${d.provinsi} (${d.pulau})<br>${hierSizeVar.toUpperCase()}: ${sizeFmt}<br>${hierColorVar.toUpperCase()}: ${colorFmt}`);
      });
    } else if (hierViewMode === 'provinsi' || (hierViewMode === 'pulau' && hierSelectedProv !== 'Semua Provinsi')) {
      if (hierSelectedProv === 'Semua Provinsi') {
        const provSet = [...new Set(data.map(d => d.provinsi))];
        provSet.forEach(prov => {
          const prId = `prov_${prov}`;
          ids.push(prId);
          labels.push(prov);
          parents.push(rootId);
          values.push(0);
          colors.push(0);
          hovertexts.push(`<b>Provinsi ${prov}</b>`);
        });

        data.forEach((d, idx) => {
          const kId = `kab_${d.kode_wilayah}_${idx}`;
          ids.push(kId);
          labels.push(d.nama_resmi);
          parents.push(`prov_${d.provinsi}`);
          values.push(Math.max(1, Number(d[hierSizeVar]) || 1));
          colors.push(Number(d[hierColorVar]) || 0);
          const sizeFmt = hierSizeVar === 'pengeluaran' ? 'Rp' + Number(d[hierSizeVar]).toLocaleString('id-ID') : Number(d[hierSizeVar]).toFixed(2) + '%';
          const colorFmt = typeof d[hierColorVar] === 'number' ? Number(d[hierColorVar]).toFixed(2) : d[hierColorVar];
          hovertexts.push(`<b>${d.nama_resmi}</b><br>Provinsi: ${d.provinsi}<br>${hierSizeVar.toUpperCase()}: ${sizeFmt}<br>${hierColorVar.toUpperCase()}: ${colorFmt}`);
        });
      } else {
        data.forEach((d, idx) => {
          const kId = `kab_${d.kode_wilayah}_${idx}`;
          ids.push(kId);
          labels.push(d.nama_resmi);
          parents.push(rootId);
          values.push(Math.max(1, Number(d[hierSizeVar]) || 1));
          colors.push(Number(d[hierColorVar]) || 0);
          const sizeFmt = hierSizeVar === 'pengeluaran' ? 'Rp' + Number(d[hierSizeVar]).toLocaleString('id-ID') : Number(d[hierSizeVar]).toFixed(2) + '%';
          const colorFmt = typeof d[hierColorVar] === 'number' ? Number(d[hierColorVar]).toFixed(2) : d[hierColorVar];
          hovertexts.push(`<b>${d.nama_resmi}</b><br>Tipe: ${d.tipe}<br>${hierSizeVar.toUpperCase()}: ${sizeFmt}<br>${hierColorVar.toUpperCase()}: ${colorFmt}`);
        });
      }
    } else {
      data.forEach((d, idx) => {
        const kId = `kab_${d.kode_wilayah}_${idx}`;
        ids.push(kId);
        labels.push(d.nama_resmi);
        parents.push(rootId);
        values.push(Math.max(1, Number(d[hierSizeVar]) || 1));
        colors.push(Number(d[hierColorVar]) || 0);
        const sizeFmt = hierSizeVar === 'pengeluaran' ? 'Rp' + Number(d[hierSizeVar]).toLocaleString('id-ID') : Number(d[hierSizeVar]).toFixed(2) + '%';
        const colorFmt = typeof d[hierColorVar] === 'number' ? Number(d[hierColorVar]).toFixed(2) : d[hierColorVar];
        hovertexts.push(`<b>${d.nama_resmi}</b> (${d.provinsi})<br>${hierSizeVar.toUpperCase()}: ${sizeFmt}<br>${hierColorVar.toUpperCase()}: ${colorFmt}`);
      });
    }

    const palette = PALETTES[selectedPalette] || PALETTES['Viridis'];
    const trace = {
      type: 'sunburst',
      ids: ids,
      labels: labels,
      parents: parents,
      values: values,
      text: hovertexts,
      hoverinfo: 'text',
      marker: {
        colors: colors,
        colorscale: palette.map((c, i) => [i / (palette.length - 1), c]),
        showscale: true,
        colorbar: { title: hierColorVar.toUpperCase() }
      },
      branchvalues: 'remainder'
    };

    const modeLabel = hierViewMode === 'pulau' ? 'Pengelompokan Pulau' : hierViewMode === 'provinsi' ? 'Pengelompokan Provinsi' : 'Daftar Kab/Kota';
    const layout = {
      title: { text: `<b>Interactive Sunburst (${modeLabel}): Ukuran = ${hierSizeVar.toUpperCase()} | Warna = ${hierColorVar.toUpperCase()}</b>`, font: { size: 13.5 } },
      margin: { l: 10, r: 10, t: 35, b: 10 },
      height: 420,
      paper_bgcolor: 'transparent'
    };

    window.Plotly.react('sunburst-chart', [trace], layout, { responsive: true, displayModeBar: false });
  }

  // Summary Table Data (by Island)
  const islandAgg = {};
  hierFilteredData.forEach(d => {
    if (!islandAgg[d.pulau]) {
      islandAgg[d.pulau] = { count: 0, parlemen: 0, pendapatan: 0, profesional: 0, tpak: 0, pengeluaran: 0, keputusan: 0, ekonomi: 0, ikpp: 0 };
    }
    const item = islandAgg[d.pulau];
    item.count++;
    item.parlemen += d.parlemen;
    item.pendapatan += d.pendapatan;
    item.profesional += d.profesional;
    item.tpak += d.tpak;
    item.pengeluaran += d.pengeluaran;
    item.keputusan += d.skor_keputusan;
    item.ekonomi += d.skor_ekonomi;
    item.ikpp += d.ikpp_komposit;
  });

  // Summary Table Data (by Province)
  const provAgg = {};
  hierFilteredData.forEach(d => {
    if (!provAgg[d.provinsi]) {
      provAgg[d.provinsi] = { count: 0, parlemen: 0, pendapatan: 0, profesional: 0, tpak: 0, pengeluaran: 0, keputusan: 0, ekonomi: 0, ikpp: 0, pulau: d.pulau };
    }
    const item = provAgg[d.provinsi];
    item.count++;
    item.parlemen += d.parlemen;
    item.pendapatan += d.pendapatan;
    item.profesional += d.profesional;
    item.tpak += d.tpak;
    item.pengeluaran += d.pengeluaran;
    item.keputusan += d.skor_keputusan;
    item.ekonomi += d.skor_ekonomi;
    item.ikpp += d.ikpp_komposit;
  });

  // Hierarchical tab summary stats
  const hierCount = hierFilteredData.length;
  const hierAvgParlemen = hierCount ? (hierFilteredData.reduce((a, b) => a + Number(b.parlemen || 0), 0) / hierCount) : 0;
  const hierAvgPendapatan = hierCount ? (hierFilteredData.reduce((a, b) => a + Number(b.pendapatan || 0), 0) / hierCount) : 0;
  const hierAvgProfesional = hierCount ? (hierFilteredData.reduce((a, b) => a + Number(b.profesional || 0), 0) / hierCount) : 0;
  const hierAvgTPAK = hierCount ? (hierFilteredData.reduce((a, b) => a + Number(b.tpak || 0), 0) / hierCount) : 0;
  const hierAvgPengeluaran = hierCount ? (hierFilteredData.reduce((a, b) => a + Number(b.pengeluaran || 0), 0) / hierCount) : 0;
  const hierAvgIKPP = hierCount ? (hierFilteredData.reduce((a, b) => a + Number(b.ikpp_komposit || 0), 0) / hierCount) : 0;
  const hierKuotaPass = hierFilteredData.filter(d => Number(d.parlemen) >= 30).length;
  const hierSelectedKabItem = hierSelectedKab !== 'Semua Kab/Kota'
    ? hierFilteredData.find(d => d.nama_resmi === hierSelectedKab)
    : null;

  // Table Sorting and Filtering
  let tableRecords = [...filteredKabkota];
  if (tableSearch) {
    tableRecords = tableRecords.filter(d =>
      d.nama_resmi.toLowerCase().includes(tableSearch.toLowerCase()) ||
      d.provinsi.toLowerCase().includes(tableSearch.toLowerCase())
    );
  }
  tableRecords.sort((a, b) => {
    let valA = a[sortCol];
    let valB = b[sortCol];
    if (typeof valA === 'string') return sortAsc ? valA.localeCompare(valB) : valB.localeCompare(valA);
    return sortAsc ? valA - valB : valB - valA;
  });

  const totalPages = Math.ceil(tableRecords.length / rowsPerPage) || 1;
  const pageStart = (currentPage - 1) * rowsPerPage;
  const displayRows = tableRecords.slice(pageStart, pageStart + rowsPerPage);

  function handleSort(col) {
    if (sortCol === col) setSortAsc(!sortAsc);
    else {
      setSortCol(col);
      setSortAsc(false);
    }
  }

  function downloadCSV() {
    if (filteredKabkota.length === 0) return;
    const cols = ['kode_wilayah', 'nama_resmi', 'tipe', 'provinsi', 'pulau', 'parlemen', 'pendapatan', 'profesional', 'tpak', 'pengeluaran', 'ahh', 'rls', 'hls', 'skor_keputusan', 'skor_ekonomi', 'ikpp_komposit', 'kuadran'];
    let csvContent = 'data:text/csv;charset=utf-8,' + cols.join(',') + '\r\n';
    filteredKabkota.forEach(row => {
      const values = cols.map(c => (typeof row[c] === 'string' && row[c].includes(',') ? `"${row[c]}"` : row[c]));
      csvContent += values.join(',') + '\r\n';
    });
    const link = document.createElement('a');
    link.href = encodeURI(csvContent);
    link.download = 'disparitas_perempuan_514_kabkota_2024.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  const avgParlemen = filteredKabkota.length ? filteredKabkota.reduce((a, b) => a + b.parlemen, 0) / filteredKabkota.length : 0;
  const avgPendapatan = filteredKabkota.length ? filteredKabkota.reduce((a, b) => a + b.pendapatan, 0) / filteredKabkota.length : 0;
  const avgProfesional = filteredKabkota.length ? filteredKabkota.reduce((a, b) => a + b.profesional, 0) / filteredKabkota.length : 0;
  const avgTPAK = filteredKabkota.length ? filteredKabkota.reduce((a, b) => a + b.tpak, 0) / filteredKabkota.length : 0;

  const hasActiveFilter = selectedPulau !== 'Semua Pulau' || selectedProv !== 'Semua Provinsi' || selectedTipe !== 'Semua' || selectedKuadran !== 'Semua Kuadran';

  const MODULES = [
    { id: 'tab-overview', label: 'Ringkasan & Storytelling', desc: 'Tipologi kuadran disparitas ekonomi vs keputusan & narasi analitik', icon: 'fa-chart-line' },
    { id: 'tab-geospatial', label: 'Analisis Geospasial', desc: 'Peta batas kab/kota poligon SHP, heatmap spasial, choropleth, & LISA cluster', icon: 'fa-map' },
    { id: 'tab-multivariate', label: 'Dimensi Tinggi (Multivariat)', desc: 'PCA biplot 8 indikator, koordinat paralel, korelasi matriks, & profil radar', icon: 'fa-project-diagram' },
    { id: 'tab-hierarchical', label: 'Analisis Berhierarki', desc: 'Treemap & sunburst interaktif agregasi pulau hingga kabupaten/kota', icon: 'fa-sitemap' },
    { id: 'tab-data', label: 'Eksplorasi Data', desc: 'Pangkalan data tabular 514 kabupaten/kota dengan pencarian & ekspor CSV', icon: 'fa-table' },
    { id: 'tab-method', label: 'Metodologi & AI', desc: 'Sumber data resmi BPS RI 2024, pra-pemrosesan, imputasi, & deklarasi AI', icon: 'fa-book-open' }
  ];

  const currentModule = MODULES.find(m => m.id === activeTab) || MODULES[0];

  return (
    <div className="app-container">
      {/* Mobile Drawer Backdrop */}
      <div
        className={`sidebar-backdrop ${mobileMenuOpen ? 'active' : ''}`}
        onClick={() => setMobileMenuOpen(false)}
        aria-hidden="true"
      />

      {/* Sidebar Drawer */}
      <aside className={`sidebar ${mobileMenuOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-brand">
            <img src="https://upload.wikimedia.org/wikipedia/commons/2/28/Lambang_Politeknik_Statistika_STIS.png" alt="STIS" />
            <div className="sidebar-title">
              <h2>Politeknik Statistika STIS</h2>
              <p>Visualisasi Data &amp; Informasi (2026)</p>
            </div>
          </div>
          <button
            className="sidebar-close-btn"
            onClick={() => setMobileMenuOpen(false)}
            aria-label="Tutup Menu Filter"
          >
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        <div className="sidebar-content">
          {/* Navigasi Modul Analitik (Single Dropdown Menu) */}
          <div className="module-dropdown-card">
            <div className="module-dropdown-header">
              <label htmlFor="module-select" className="module-dropdown-label">
                <i className="fa-solid fa-compass"></i> Navigasi Modul Analitik
              </label>
              <span className="badge-active-dot">• Aktif</span>
            </div>
            <div className="module-select-container">
              <select
                id="module-select"
                className="module-dropdown-select"
                value={activeTab}
                onChange={e => {
                  setActiveTab(e.target.value);
                  setMobileMenuOpen(false);
                }}
              >
                <option value="tab-overview">1. Ringkasan &amp; Storytelling</option>
                <option value="tab-geospatial">2. Analisis Geospasial (Peta &amp; Heatmap)</option>
                <option value="tab-multivariate">3. Dimensi Tinggi (Multivariat &amp; PCA)</option>
                <option value="tab-hierarchical">4. Analisis Berhierarki (Treemap &amp; Sunburst)</option>
                <option value="tab-data">5. Eksplorasi Data (Pangkalan 514 Kab/Kota)</option>
                <option value="tab-method">6. Metodologi &amp; Integritas AI</option>
              </select>
              <i className="fa-solid fa-chevron-down select-arrow-icon"></i>
            </div>
          </div>

          <div className="sidebar-divider"></div>

          <div className="sidebar-section-label">
            <i className="fa-solid fa-filter"></i> Parameter &amp; Filter Data
          </div>

          <div className="filter-group">
            <label><i className="fa-solid fa-earth-asia"></i> Filter Pulau / Region</label>
            <select value={selectedPulau} onChange={e => { setSelectedPulau(e.target.value); setSelectedProv('Semua Provinsi'); }}>
              <option value="Semua Pulau">Semua Pulau</option>
              {[...new Set(allKabkota.map(d => d.pulau))].map(p => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label><i className="fa-solid fa-map-location-dot"></i> Filter Provinsi</label>
            <select value={selectedProv} onChange={e => setSelectedProv(e.target.value)}>
              {availableProvs.map(p => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label><i className="fa-solid fa-city"></i> Tipe Wilayah</label>
            <div className="radio-pills">
              {['Semua', 'Kabupaten', 'Kota'].map(t => (
                <label key={t}>
                  <input type="radio" name="tipe" value={t} checked={selectedTipe === t} onChange={() => setSelectedTipe(t)} />
                  <span>{t === 'Kabupaten' ? 'Kab' : t}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="filter-group">
            <label><i className="fa-solid fa-shapes"></i> Kuadran Tipologi</label>
            <select value={selectedKuadran} onChange={e => setSelectedKuadran(e.target.value)}>
              <option value="Semua Kuadran">Semua Kuadran</option>
              <option value="Kuadran I (Ekonomi Tinggi, Keputusan Tinggi)">Kuadran I (Maju Seimbang)</option>
              <option value="Kuadran II (Ekonomi Rendah, Keputusan Tinggi)">Kuadran II (Representasi Kuat)</option>
              <option value="Kuadran III (Ekonomi Rendah, Keputusan Rendah)">Kuadran III (Tertinggal Ganda)</option>
              <option value="Kuadran IV (Ekonomi Tinggi, Keputusan Rendah)">Kuadran IV (Kerja Tanpa Kuasa)</option>
            </select>
          </div>

          <div className="filter-group">
            <label><i className="fa-solid fa-palette"></i> Palet Warna (Colorblind-Safe)</label>
            <select value={selectedPalette} onChange={e => setSelectedPalette(e.target.value)}>
              <option value="Viridis">Viridis (Perseptual Seragam)</option>
              <option value="Cividis">Cividis (Optimasi Buta Warna)</option>
              <option value="Plasma">Plasma (Kontras Tinggi)</option>
              <option value="Turbo">Turbo (Spektrum Luas)</option>
            </select>
          </div>

          <div className="sidebar-stats">
            <div><strong>Wilayah Terpilih:</strong> {filteredKabkota.length} dari 514</div>
            <div><strong>Provinsi:</strong> {new Set(filteredKabkota.map(d => d.provinsi)).size} dari 38</div>
            <div><strong>Sumber Data:</strong> BPS RI (2024)</div>
          </div>

          <div className="sidebar-actions">
            <button className="btn-apply-drawer mobile-only" onClick={() => setMobileMenuOpen(false)}>
              <i className="fa-solid fa-check"></i> Terapkan &amp; Tutup
            </button>
            <button className="btn-reset" onClick={() => {
              setSelectedPulau('Semua Pulau');
              setSelectedProv('Semua Provinsi');
              setSelectedTipe('Semua');
              setSelectedKuadran('Semua Kuadran');
              setSelectedPalette('Viridis');
            }}>
              <i className="fa-solid fa-arrows-rotate"></i> Reset Filter Global
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <header className="top-header">
          {/* Mobile Bar: Hamburger & Institutional Identity */}
          <div className="mobile-header-bar">
            <button
              className={`hamburger-btn ${mobileMenuOpen ? 'active' : ''}`}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Menu Filter & Navigasi"
              aria-expanded={mobileMenuOpen}
            >
              <i className={mobileMenuOpen ? "fa-solid fa-xmark" : "fa-solid fa-bars"}></i>
              <span className="hamburger-text">{mobileMenuOpen ? "Tutup" : "Filter & Menu"}</span>
              {hasActiveFilter && <span className="active-filter-dot" title="Filter Aktif"></span>}
            </button>
            <div className="mobile-institution-badge">
              <img src="https://upload.wikimedia.org/wikipedia/commons/2/28/Lambang_Politeknik_Statistika_STIS.png" alt="STIS" />
              <span>Polstat STIS</span>
            </div>
          </div>

          <div className="header-meta">
            <div className="header-left">
              <div className="header-title-box">
                <h1>Disparitas Spasial Partisipasi Ekonomi &amp; Keputusan Perempuan Indonesia</h1>
                <p>Pangkalan 514 Kabupaten/Kota &bull; 38 Provinsi &bull; Sumber Data: BPS RI 2024</p>
              </div>
            </div>
            <div className="header-right">
              <div className="active-module-pill">
                <i className={`fa-solid ${currentModule.icon}`}></i>
                <span>Modul: <strong>{currentModule.label}</strong></span>
              </div>
            </div>
          </div>
        </header>

        {/* Tab 1: Overview */}
        <section className={`tab-pane ${activeTab === 'tab-overview' ? 'active' : ''}`}>
          <div className="kpi-grid">
            <div className="kpi-card">
              <span className="kpi-label"><i className="fa-solid fa-landmark"></i> Parlemen Perempuan</span>
              <div className="kpi-main-row">
                <span className="kpi-value">{avgParlemen.toFixed(2)}%</span>
                <span className="kpi-delta neg">{(avgParlemen - 30.0).toFixed(1)}% vs Kuota</span>
              </div>
            </div>
            <div className="kpi-card">
              <span className="kpi-label"><i className="fa-solid fa-user-tie"></i> Tenaga Profesional</span>
              <div className="kpi-main-row">
                <span className="kpi-value">{avgProfesional.toFixed(2)}%</span>
                <span className="kpi-delta neu">Paritas 50%</span>
              </div>
            </div>
            <div className="kpi-card">
              <span className="kpi-label"><i className="fa-solid fa-hand-holding-dollar"></i> Sumbangan Pendapatan</span>
              <div className="kpi-main-row">
                <span className="kpi-value">{avgPendapatan.toFixed(2)}%</span>
                <span className="kpi-delta neg">{(avgPendapatan - 50.0).toFixed(1)}%</span>
              </div>
            </div>
            <div className="kpi-card">
              <span className="kpi-label"><i className="fa-solid fa-briefcase"></i> TPAK Perempuan</span>
              <div className="kpi-main-row">
                <span className="kpi-value">{avgTPAK.toFixed(2)}%</span>
                <span className="kpi-delta pos">Kerja Aktif</span>
              </div>
            </div>
            <div className="kpi-card">
              <span className="kpi-label"><i className="fa-solid fa-globe"></i> Moran&apos;s I Spasial</span>
              <div className="kpi-main-row">
                <span className="kpi-value">0.354 | 0.450</span>
                <span className="kpi-delta pos">p = 0.001</span>
              </div>
            </div>
          </div>

          <div className="content-with-sidebar">
            <div className="content-main-col">
              <div className="card">
                <div className="card-header">
                  <div>
                    <div className="card-title"><i className="fa-solid fa-crosshairs"></i> Tipologi Kuadran: Hubungan Partisipasi Ekonomi vs Pengambilan Keputusan</div>
                    <div className="card-caption">Memetakan 514 kabupaten/kota terhadap median nasional untuk mendeteksi kesenjangan antara kemandirian ekonomi dan agensi politik.</div>
                  </div>
                </div>
                <div id="quadrant-chart" className="chart-box"></div>
                <DataSourceBadge vars={['skor_ekonomi', 'skor_keputusan', 'pengeluaran']} />
              </div>
            </div>

            <aside className="analysis-sidebar">
              <div className="analysis-section-title">
                <i className="fa-solid fa-lightbulb"></i> Analisis dan Temuan Utama
              </div>
              <div className="analysis-card green">
                <h4><i className="fa-solid fa-fire"></i> 1. Hotspot Sulawesi Utara vs Defisit Parlemen</h4>
                <p>Sulawesi Utara membentuk klaster <em>High-High Hotspot</em> terkuat nasional dengan keterwakilan DPRD perempuan &gt; 40% dan tenaga profesional &gt; 55% berkat kultur egaliter Minahasa. Sebaliknya, lebih dari 85% kabupaten/kota di Indonesia masih gagal mencapai kuota afirmasi 30%.</p>
              </div>
              <div className="analysis-card amber">
                <h4><i className="fa-solid fa-person-digging"></i> 2. Paradoks Kerja Wilayah Timur (Sticky Floor)</h4>
                <p>Daerah pedalaman Papua dan NTT mencatatkan TPAK perempuan sangat tinggi (70% - 95%), namun sumbangan pendapatan riil mereka tertekan rendah. Beban kerja fisik perempuan di sektor pertanian tradisional belum terkonversi menjadi kemandirian ekonomi formal.</p>
              </div>
              <div className="analysis-card purple">
                <h4><i className="fa-solid fa-building-flag"></i> 3. Keunggulan Perkotaan (Urban Advantage)</h4>
                <p>Entitas Kota secara konsisten mengungguli Kabupaten pada proporsi Tenaga Profesional (52.4% vs 42.1%) dan pengeluaran riil per kapita, ditopang oleh akses pendidikan tinggi dan terbukanya sektor jasa modern.</p>
              </div>
            </aside>
          </div>
        </section>

        {/* Tab 2: Geospatial */}
        <section className={`tab-pane ${activeTab === 'tab-geospatial' ? 'active' : ''}`}>
          <div className="subtabs-nav">
            <button className={`subtab-btn ${activeGeoSubtab === 'geo-subtab-kabkota-boundary' ? 'active' : ''}`} onClick={() => setActiveGeoSubtab('geo-subtab-kabkota-boundary')}>
              <i className="fa-solid fa-draw-polygon"></i> Peta Batas Kab/Kota (Shapefile GeoJSON)
            </button>
            <button className={`subtab-btn ${activeGeoSubtab === 'geo-subtab-heatmap' ? 'active' : ''}`} onClick={() => setActiveGeoSubtab('geo-subtab-heatmap')}>
              <i className="fa-solid fa-fire-flame-curved" style={{ color: '#ef4444' }}></i> Peta Heatmap Spasial (No API)
            </button>
            <button className={`subtab-btn ${activeGeoSubtab === 'geo-subtab-choropleth' ? 'active' : ''}`} onClick={() => setActiveGeoSubtab('geo-subtab-choropleth')}>
              <i className="fa-solid fa-map-location"></i> Peta Choropleth Provinsi (34/38 Prov)
            </button>
            <button className={`subtab-btn ${activeGeoSubtab === 'geo-subtab-proportional' ? 'active' : ''}`} onClick={() => setActiveGeoSubtab('geo-subtab-proportional')}>
              <i className="fa-solid fa-circle-dot"></i> Peta Simbol Proporsional (514 Kab/Kota)
            </button>
            <button className={`subtab-btn ${activeGeoSubtab === 'geo-subtab-lisa' ? 'active' : ''}`} onClick={() => setActiveGeoSubtab('geo-subtab-lisa')}>
              <i className="fa-solid fa-network-wired"></i> Peta Klaster Spasial LISA (Moran&apos;s I)
            </button>
          </div>

          {/* Subtab 1: Peta Batas Kabupaten/Kota dari GeoJSON (Nasional 514 Kab/Kota) */}
          {activeGeoSubtab === 'geo-subtab-kabkota-boundary' && (
            <div className="card">
              <div className="card-header">
                <div>
                  <div className="card-title">
                    <i className="fa-solid fa-draw-polygon"></i> Peta Batas dan Poligon Tematik Kabupaten/Kota (GeoJSON BPS 2024)
                  </div>
                  <div className="card-caption">
                    Batas administrasi poligon 514 Kabupaten/Kota di 38 Provinsi Indonesia, terintegrasi indikator BPS 2024 dengan basemap ESRI Canvas (100% Bebas Watermark dan Tanpa API Key).
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
                  <span className="badge badge-success">
                    <i className="fa-solid fa-shield-halved"></i> 100% Bebas Watermark (No API Required)
                  </span>

                  <span className="badge badge-primary" style={{ padding: '6px 10px', fontSize: '12px' }}>
                    <i className="fa-solid fa-earth-asia"></i> Cakupan: Seluruh Indonesia (514 Kab/Kota)
                  </span>

                  <a
                    href="/data/kabkota_indonesia.geojson"
                    download="kabkota_indonesia.geojson"
                    className="btn-export"
                    title="Unduh berkas GeoJSON 514 Kabupaten/Kota"
                  >
                    <i className="fa-solid fa-file-arrow-down"></i> Unduh GeoJSON (0.79 MB)
                  </a>

                  <select
                    value={kabkotaChoroplethVar}
                    onChange={e => setKabkotaChoroplethVar(e.target.value)}
                    style={{ padding: '6px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '12px', fontWeight: '600' }}
                  >
                    <optgroup label="Indikator Utama Gender BPS">
                      <option value="parlemen">Parlemen Perempuan (%)</option>
                      <option value="pendapatan">Sumbangan Pendapatan (%)</option>
                      <option value="profesional">Tenaga Profesional (%)</option>
                      <option value="tpak">TPAK Perempuan (%)</option>
                      <option value="pengeluaran">Pengeluaran Riil (Ribu Rp)</option>
                      <option value="ahh">Angka Harapan Hidup (AHH)</option>
                      <option value="rls">Rata-rata Lama Sekolah (RLS)</option>
                      <option value="hls">Harapan Lama Sekolah (HLS)</option>
                    </optgroup>
                    <optgroup label="Indeks dan Tipologi Analitik">
                      <option value="skor_keputusan">Skor Pengambilan Keputusan (0-100)</option>
                      <option value="skor_ekonomi">Skor Partisipasi Ekonomi (0-100)</option>
                      <option value="ikpp_komposit">IKPP Komposit Gender (0-100)</option>
                      <option value="kuadran">Tipologi Kuadran Disparitas</option>
                      <option value="lisa_cluster_keputusan">Klaster LISA Keputusan</option>
                      <option value="lisa_cluster_ekonomi">Klaster LISA Ekonomi</option>
                    </optgroup>
                  </select>
                </div>
              </div>

              <div className="content-with-sidebar">
                <div className="content-main-col">
                  <div id="kabkota-boundary-map"></div>

                  {selectedKabDetail ? (
                    <div className="kab-detail-panel">
                      <div className="kab-detail-header">
                        <div>
                          <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#0f172a' }}>
                            <i className="fa-solid fa-location-dot" style={{ color: '#2563eb', marginRight: '6px' }}></i>
                            {selectedKabDetail.nama_resmi}
                          </h3>
                          <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748b' }}>
                            {selectedKabDetail.provinsi} &bull; Tipe: <strong>{selectedKabDetail.tipe}</strong> &bull; Kode: <code>{selectedKabDetail.kode_wilayah}</code> &bull; Luas: {Number(selectedKabDetail.LUASWH || 0).toLocaleString('id-ID')} km2
                          </p>
                        </div>
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                          <span className="badge badge-primary">{selectedKabDetail.kuadran}</span>
                          <button
                            onClick={() => setSelectedKabDetail(null)}
                            style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '4px', padding: '4px 8px', fontSize: '11px', cursor: 'pointer' }}
                          >
                            <i className="fa-solid fa-xmark"></i> Tutup Detail
                          </button>
                        </div>
                      </div>
                      <div className="kab-detail-grid">
                        <div className="kab-metric-card">
                          <span className="k-label">Parlemen Perempuan</span>
                          <span className="k-val">{selectedKabDetail.parlemen}%</span>
                          <span className="k-sub">{selectedKabDetail.parlemen >= 30 ? 'Memenuhi Kuota 30%' : 'Di bawah Kuota 30%'}</span>
                        </div>
                        <div className="kab-metric-card">
                          <span className="k-label">Sumbangan Pendapatan</span>
                          <span className="k-val">{selectedKabDetail.pendapatan}%</span>
                          <span className="k-sub">Paritas: 50%</span>
                        </div>
                        <div className="kab-metric-card">
                          <span className="k-label">Tenaga Profesional</span>
                          <span className="k-val">{selectedKabDetail.profesional}%</span>
                          <span className="k-sub">Sektor Formal</span>
                        </div>
                        <div className="kab-metric-card">
                          <span className="k-label">TPAK Perempuan</span>
                          <span className="k-val">{selectedKabDetail.tpak}%</span>
                          <span className="k-sub">Partisipasi Kerja</span>
                        </div>
                        <div className="kab-metric-card">
                          <span className="k-label">Pengeluaran Riil</span>
                          <span className="k-val">Rp{Number(selectedKabDetail.pengeluaran).toLocaleString('id-ID')}</span>
                          <span className="k-sub">per kapita/thn</span>
                        </div>
                        <div className="kab-metric-card">
                          <span className="k-label">IKPP Komposit</span>
                          <span className="k-val">{selectedKabDetail.ikpp_komposit}</span>
                          <span className="k-sub">Skor 0-100</span>
                        </div>
                        <div className="kab-metric-card">
                          <span className="k-label">Skor Keputusan</span>
                          <span className="k-val">{selectedKabDetail.skor_keputusan}</span>
                          <span className="k-sub">Politik dan Agensi</span>
                        </div>
                        <div className="kab-metric-card">
                          <span className="k-label">Skor Ekonomi</span>
                          <span className="k-val">{selectedKabDetail.skor_ekonomi}</span>
                          <span className="k-sub">Kemandirian Finansial</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div style={{ background: '#f8fafc', padding: '12px 16px', borderRadius: '8px', border: '1px dashed #cbd5e1', fontSize: '0.85rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <i className="fa-solid fa-circle-info" style={{ color: '#2563eb' }}></i>
                      <span><strong>Tip Eksplorasi:</strong> Gunakan filter Pulau dan Provinsi di bilah kiri untuk navigasi otomatis ke wilayah target, serta klik pada poligon 514 kabupaten/kota untuk melihat rincian 8 indikator pembangunan gender BPS 2024.</span>
                    </div>
                  )}
                </div>

                <aside className="analysis-sidebar">
                  <div className="analysis-section-title">
                    <i className="fa-solid fa-lightbulb"></i> Analisis Geospasial
                  </div>
                  <div className="analysis-card green">
                    <h4><i className="fa-solid fa-earth-asia"></i> Cakupan Spasial 514 Kabupaten/Kota</h4>
                    <p>Aplikasi ini memadankan batas poligon digital 514 kabupaten/kota dari 38 provinsi di Indonesia dengan 8 indikator gender BPS 2024. Disparitas antara wilayah barat (Jawa dan Sumatera) dan timur (Nusa Tenggara, Maluku, Papua) dapat diinspeksi secara detail.</p>
                  </div>
                  <div className="analysis-card purple">
                    <h4><i className="fa-solid fa-shield-halved"></i> Solusi Zero-API dan Bebas Watermark</h4>
                    <p>Watermark pada tile basemap CartoDB telah dieliminasi sepenuhnya dengan beralih ke <strong>ESRI World Gray Canvas</strong> dan OpenStreetMap yang 100% bebas token dan bebas biaya. Poligon GeoJSON disimpan dan dirender secara mandiri di sisi klien.</p>
                  </div>
                </aside>
              </div>
              <DataSourceBadge vars={[kabkotaChoroplethVar]} />
            </div>
          )}

          {/* Subtab 2: Peta Heatmap Spasial Kab/Kota */}
          {activeGeoSubtab === 'geo-subtab-heatmap' && (
            <div className="card">
              <div className="card-header">
                <div>
                  <div className="card-title">
                    <i className="fa-solid fa-fire-flame-curved" style={{ color: '#ef4444' }}></i> Peta Heatmap Spasial Kabupaten/Kota (Kernel Density Estimation)
                  </div>
                  <div className="card-caption">
                    Visualisasi intensitas spasial bergradien halus menggunakan algoritma Kernel Density pada peramban (Client-side Canvas Heatmap), tanpa token/API eksternal.
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
                  <span className="badge badge-success">
                    <i className="fa-solid fa-bolt"></i> Client-Side Heatmap (No API Required)
                  </span>
                  <select
                    value={heatmapVar}
                    onChange={e => setHeatmapVar(e.target.value)}
                    style={{ padding: '6px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '12px', fontWeight: '600' }}
                  >
                    <option value="parlemen">Intensitas: Parlemen Perempuan (%)</option>
                    <option value="pendapatan">Intensitas: Sumbangan Pendapatan (%)</option>
                    <option value="pengeluaran">Intensitas: Pengeluaran Riil (Ribu Rp)</option>
                    <option value="profesional">Intensitas: Tenaga Profesional (%)</option>
                    <option value="tpak">Intensitas: TPAK Perempuan (%)</option>
                    <option value="skor_keputusan">Intensitas: Skor Pengambilan Keputusan</option>
                    <option value="skor_ekonomi">Intensitas: Skor Partisipasi Ekonomi</option>
                    <option value="ikpp_komposit">Intensitas: IKPP Komposit Gender</option>
                  </select>
                  <span className="badge badge-primary" style={{ padding: '6px 10px', fontSize: '12px' }}>
                    <i className="fa-solid fa-earth-asia"></i> Cakupan: Seluruh Indonesia (514 Kab/Kota)
                  </span>
                </div>
              </div>

              {/* Heatmap Parameter Controls */}
              <div className="heatmap-toolbar">
                <div className="heatmap-control-group">
                  <label htmlFor="radius-slider"><i className="fa-solid fa-circle-notch"></i> Radius Heat ({heatmapRadius}px):</label>
                  <input
                    id="radius-slider"
                    type="range"
                    min="15"
                    max="50"
                    value={heatmapRadius}
                    onChange={e => setHeatmapRadius(Number(e.target.value))}
                    style={{ cursor: 'pointer' }}
                  />
                </div>
                <div className="heatmap-control-group">
                  <label htmlFor="blur-slider"><i className="fa-solid fa-wand-magic-sparkles"></i> Blur ({heatmapBlur}px):</label>
                  <input
                    id="blur-slider"
                    type="range"
                    min="10"
                    max="35"
                    value={heatmapBlur}
                    onChange={e => setHeatmapBlur(Number(e.target.value))}
                    style={{ cursor: 'pointer' }}
                  />
                </div>
                <div className="heatmap-control-group" style={{ marginLeft: 'auto' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={heatmapShowBoundaries}
                      onChange={e => setHeatmapShowBoundaries(e.target.checked)}
                    />
                    <span>Overlay Garis Batas Poligon SHP</span>
                  </label>
                </div>
                <div className="heatmap-control-group">
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={heatmapShowPoints}
                      onChange={e => setHeatmapShowPoints(e.target.checked)}
                    />
                    <span>Titik Pusat Kab/Kota</span>
                  </label>
                </div>
              </div>

              <div className="content-with-sidebar">
                <div className="content-main-col">
                  <div id="heatmap-map"></div>
                </div>

                <aside className="analysis-sidebar">
                  <div className="analysis-section-title">
                    <i className="fa-solid fa-lightbulb"></i> Analisis Heatmap
                  </div>
                  <div className="analysis-card green">
                    <h4><i className="fa-solid fa-temperature-arrow-up"></i> Interpretasi Hotspot Spasial</h4>
                    <p>Heatmap spasial menampilkan konsentrasi peubah secara kontinu. Warna merah menunjukkan zona konsentrasi tertinggi (Hotspot), sedangkan warna biru menunjukkan zona intensitas rendah (Coldspot). Pada indikator Parlemen, zona hotspot terdeteksi kuat di Sulawesi Utara, Bali, dan sejumlah kota pesisir, sedangkan wilayah pedalaman menunjukkan intensitas coldspot.</p>
                  </div>
                  <div className="analysis-card amber">
                    <h4><i className="fa-solid fa-layer-group"></i> Sinergi Heatmap dan Batas Administrasi</h4>
                    <p>Dengan mengaktifkan centang <em>&quot;Overlay Garis Batas Poligon SHP&quot;</em>, batas administratif hasil ekstraksi shapefile ditumpangkan secara presisi di atas permukaan heatmap kontinu. Hal ini memudahkan pengambil kebijakan untuk mengidentifikasi yurisdiksi yang berada di pusat hotspot maupun coldspot.</p>
                  </div>
                </aside>
              </div>
              <DataSourceBadge vars={[heatmapVar]} />
            </div>
          )}

          {activeGeoSubtab === 'geo-subtab-proportional' && (
            <div className="card">
              <div className="card-header">
                <div>
                  <div className="card-title"><i className="fa-solid fa-map-pin"></i> Peta Simbol Proporsional 514 Kabupaten/Kota</div>
                  <div className="card-caption">Ukuran lingkaran mengkodekan intensitas volume, sedangkan warna mengkodekan performa indikator.</div>
                </div>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  <select value={geoSizeVar} onChange={e => setGeoSizeVar(e.target.value)} style={{ padding: '6px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '12px' }}>
                    <option value="pengeluaran">Ukuran: Pengeluaran Riil (Ribu Rp)</option>
                    <option value="tpak">Ukuran: TPAK Perempuan (%)</option>
                    <option value="pendapatan">Ukuran: Sumbangan Pendapatan (%)</option>
                    <option value="profesional">Ukuran: Tenaga Profesional (%)</option>
                  </select>
                  <select value={geoColorVar} onChange={e => setGeoColorVar(e.target.value)} style={{ padding: '6px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '12px' }}>
                    <option value="skor_keputusan">Warna: Skor Keputusan (0-100)</option>
                    <option value="skor_ekonomi">Warna: Skor Ekonomi (0-100)</option>
                    <option value="parlemen">Warna: Parlemen Perempuan (%)</option>
                    <option value="ikpp_komposit">Warna: IKPP Komposit (0-100)</option>
                  </select>
                </div>
              </div>

              <div className="content-with-sidebar">
                <div className="content-main-col">
                  <div id="leaflet-map"></div>
                </div>

                <aside className="analysis-sidebar">
                  <div className="analysis-section-title">
                    <i className="fa-solid fa-lightbulb"></i> Analisis Simbol Proporsional
                  </div>
                  <div className="analysis-card green">
                    <h4><i className="fa-solid fa-circle-dot"></i> 1. Encoding Multidimensional</h4>
                    <p>Peta simbol proporsional mengintegrasikan dua dimensi peubah sekaligus: besaran absolut (volume/kapasitas ekonomi) melalui radius lingkaran, dan performa relatif (indeks agensi) melalui spektrum warna ramah buta warna.</p>
                  </div>
                  <div className="analysis-card amber">
                    <h4><i className="fa-solid fa-arrows-split-up-and-left"></i> 2. Pola Sentralitas Geografis</h4>
                    <p>Lingkaran berukuran besar dengan warna performa tinggi terkonsentrasi di kawasan aglomerasi Jawa bagian barat dan kota-kota pusat pertumbuhan, mengonfirmasi kesenjangan spasial antarpulau.</p>
                  </div>
                </aside>
              </div>
              <DataSourceBadge vars={[geoSizeVar, geoColorVar]} />
            </div>
          )}

          {activeGeoSubtab === 'geo-subtab-choropleth' && (
            <div className="card">
              <div className="card-header">
                <div>
                  <div className="card-title"><i className="fa-solid fa-layer-group"></i> Peta Choropleth Rasio Tingkat Provinsi</div>
                  <div className="card-caption">Pewarnaan tematik poligon provinsi menggunakan palet warna ramah buta warna (colorblind-safe).</div>
                </div>
                <div>
                  <select value={choroplethVar} onChange={e => setChoroplethVar(e.target.value)} style={{ padding: '6px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '12px' }}>
                    <option value="parlemen">Indikator: Parlemen Perempuan (%)</option>
                    <option value="profesional">Indikator: Tenaga Profesional (%)</option>
                    <option value="pendapatan">Indikator: Sumbangan Pendapatan (%)</option>
                    <option value="tpak">Indikator: TPAK Perempuan (%)</option>
                    <option value="pengeluaran">Indikator: Pengeluaran per Kapita</option>
                    <option value="ahh">Indikator: Angka Harapan Hidup (AHH)</option>
                  </select>
                </div>
              </div>

              <div className="content-with-sidebar">
                <div className="content-main-col">
                  <div id="choropleth-map"></div>
                </div>

                <aside className="analysis-sidebar">
                  <div className="analysis-section-title">
                    <i className="fa-solid fa-lightbulb"></i> Analisis Tingkat Provinsi
                  </div>
                  <div className="analysis-card green">
                    <h4><i className="fa-solid fa-chart-column"></i> 1. Distribusi Makro Antarprovinsi</h4>
                    <p>Peta choropleth menggambarkan disparitas pada tingkat administrasi provinsi. Terdapat variasi signifikan antara wilayah barat dan timur, di mana provinsi di Jawa dan Bali mendominasi capaian rata-rata hidup layak.</p>
                  </div>
                  <div className="analysis-card blue">
                    <h4><i className="fa-solid fa-ranking-star"></i> 2. Prioritas Intervensi Wilayah</h4>
                    <p>Provinsi-provinsi di kawasan timur (seperti Papua Barat Daya, Papua Pegunungan, dan NTT) secara konsisten membutuhkan alokasi afirmasi pendidikan dan pemberdayaan ekonomi perempuan yang lebih intensif.</p>
                  </div>
                </aside>
              </div>
              <DataSourceBadge vars={[choroplethVar]} />
            </div>
          )}

          {activeGeoSubtab === 'geo-subtab-lisa' && (
            <div className="card">
              <div className="card-header">
                <div>
                  <div className="card-title"><i className="fa-solid fa-chart-pie"></i> Peta Klaster Spasial LISA (Local Moran&apos;s I, p &lt; 0.05)</div>
                  <div className="card-caption">Mendeteksi aglomerasi Hotspot (High-High), Coldspot (Low-Low), dan Pencilan Spasial (High-Low / Low-High).</div>
                </div>
                <div>
                  <select value={lisaClusterVar} onChange={e => setLisaClusterVar(e.target.value)} style={{ padding: '6px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '12px' }}>
                    <option value="lisa_cluster_keputusan">Klaster Pengambilan Keputusan</option>
                    <option value="lisa_cluster_ekonomi">Klaster Partisipasi Ekonomi</option>
                  </select>
                </div>
              </div>

              <div className="content-with-sidebar">
                <div className="content-main-col">
                  <div id="lisa-map"></div>
                </div>

                <aside className="analysis-sidebar">
                  <div className="analysis-section-title">
                    <i className="fa-solid fa-lightbulb"></i> Analisis Autokorelasi LISA
                  </div>
                  <div className="analysis-card green">
                    <h4><i className="fa-solid fa-fire"></i> 1. Klaster Hotspot (High-High)</h4>
                    <p>Zona konsentrasi wilayah berkinerja tinggi yang dikelilingi oleh daerah berkinerja tinggi teridentifikasi kuat di Sulawesi Utara dan Bali, membuktikan adanya efek limpahan spasial (<em>spatial spillover</em>) yang positif.</p>
                  </div>
                  <div className="analysis-card amber">
                    <h4><i className="fa-solid fa-snowflake"></i> 2. Klaster Coldspot (Low-Low)</h4>
                    <p>Kawasan tertinggal ganda mengelompok di sebagian wilayah pedalaman Papua dan pulau terpencil, menandakan adanya perangkap spasial (<em>spatial poverty trap</em>) yang memerlukan intervensi terpadu lintas daerah.</p>
                  </div>
                </aside>
              </div>
              <DataSourceBadge vars={[lisaClusterVar]} />
            </div>
          )}
        </section>

        {/* Tab 3: Multivariate */}
        <section className={`tab-pane ${activeTab === 'tab-multivariate' ? 'active' : ''}`}>
          <div className="subtabs-nav">
            <button className={`subtab-btn ${activeMultiSubtab === 'multi-subtab-pca' ? 'active' : ''}`} onClick={() => setActiveMultiSubtab('multi-subtab-pca')}><i className="fa-solid fa-compass"></i> PCA Biplot (Reduksi Dimensi)</button>
            <button className={`subtab-btn ${activeMultiSubtab === 'multi-subtab-parcoords' ? 'active' : ''}`} onClick={() => setActiveMultiSubtab('multi-subtab-parcoords')}><i className="fa-solid fa-bars-staggered"></i> Parallel Coordinates (Brushing)</button>
            <button className={`subtab-btn ${activeMultiSubtab === 'multi-subtab-heatmap' ? 'active' : ''}`} onClick={() => setActiveMultiSubtab('multi-subtab-heatmap')}><i className="fa-solid fa-border-all"></i> Clustered Correlation Heatmap</button>
            <button className={`subtab-btn ${activeMultiSubtab === 'multi-subtab-radar' ? 'active' : ''}`} onClick={() => setActiveMultiSubtab('multi-subtab-radar')}><i className="fa-solid fa-spider"></i> Radar Profile Chart</button>
          </div>

          {activeMultiSubtab === 'multi-subtab-pca' && (
            <div className="card">
              <div className="card-header">
                <div>
                  <div className="card-title"><i className="fa-solid fa-vector-square"></i> PCA Biplot: Proyeksi 8 Indikator BPS ke 2 Dimensi Laten</div>
                  <div className="card-caption">Menerangkan 66.9% total variansi data. Panah merah merepresentasikan vektor loading dari masing-masing peubah.</div>
                </div>
                <div>
                  <select value={pcaColorBy} onChange={e => setPcaColorBy(e.target.value)} style={{ padding: '6px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '12px' }}>
                    <option value="pulau">Warna: Wilayah Pulau</option>
                    <option value="tipe">Warna: Tipe (Kab vs Kota)</option>
                    <option value="kuadran">Warna: Kuadran Tipologi</option>
                  </select>
                </div>
              </div>

              <div className="content-with-sidebar">
                <div className="content-main-col">
                  <div id="pca-biplot-chart" className="chart-box"></div>
                </div>

                <aside className="analysis-sidebar">
                  <div className="analysis-section-title">
                    <i className="fa-solid fa-lightbulb"></i> Analisis Reduksi Dimensi PCA
                  </div>
                  <div className="analysis-card green">
                    <h4><i className="fa-solid fa-arrows-to-dot"></i> 1. Komponen Utama 1 ({pcaMeta.var_exp_pc1 || '44.8'}% Variansi)</h4>
                    <p>PC1 didominasi oleh indikator kapasitas hidup layak dan modal manusia: Angka Harapan Hidup (AHH), Harapan Lama Sekolah (HLS), Rata-rata Lama Sekolah (RLS), dan Pengeluaran Riil per Kapita. Wilayah perkotaan dan Jawa-Bali berkumpul di sisi positif sumbu ini.</p>
                  </div>
                  <div className="analysis-card amber">
                    <h4><i className="fa-solid fa-up-down"></i> 2. Komponen Utama 2 ({pcaMeta.var_exp_pc2 || '22.1'}% Variansi)</h4>
                    <p>PC2 memisahkan agensi politik perempuan (keterwakilan parlemen) dengan partisipasi kerja fisik dasar (TPAK). Terlihat trade-off di mana TPAK tinggi di kawasan timur sering kali tidak berbanding lurus dengan representasi politik formal.</p>
                  </div>
                </aside>
              </div>
              <DataSourceBadge vars={['pengeluaran', 'ahh', 'hls', 'rls', 'tpak', 'pendapatan', 'parlemen', 'profesional']} />
            </div>
          )}

          {activeMultiSubtab === 'multi-subtab-parcoords' && (
            <div className="card">
              <div className="card-header">
                <div>
                  <div className="card-title"><i className="fa-solid fa-sliders"></i> Diagram Koordinat Paralel (Parallel Coordinates)</div>
                  <div className="card-caption">Eksplorasi interaktif 8 peubah sekaligus dengan fitur brushing dan filtering nilai peubah.</div>
                </div>
              </div>

              <div className="content-with-sidebar">
                <div className="content-main-col">
                  <div id="parallel-coords-chart" className="chart-box"></div>
                </div>

                <aside className="analysis-sidebar">
                  <div className="analysis-section-title">
                    <i className="fa-solid fa-lightbulb"></i> Analisis Peubah Simultan
                  </div>
                  <div className="analysis-card green">
                    <h4><i className="fa-solid fa-sliders"></i> 1. Lintasan Pola Multidimensi</h4>
                    <p>Diagram koordinat paralel memungkinkan isolasi kelompok wilayah berkinerja tinggi. Daerah dengan skor keputusan tinggi (&gt;60) memiliki sebaran garis yang konsisten tinggi pada keterwakilan parlemen dan tenaga profesional.</p>
                  </div>
                  <div className="analysis-card purple">
                    <h4><i className="fa-solid fa-filter"></i> 2. Deteksi Pola Ekstrem</h4>
                    <p>Tarik kursor (brushing) pada sumbu peubah untuk memfilter daerah dengan kombinasi peubah unik, misalnya TPAK sangat tinggi namun pengeluaran per kapita sangat rendah.</p>
                  </div>
                </aside>
              </div>
              <DataSourceBadge vars={['pengeluaran', 'ahh', 'hls', 'rls', 'tpak', 'pendapatan', 'parlemen', 'profesional']} />
            </div>
          )}

          {activeMultiSubtab === 'multi-subtab-heatmap' && (
            <div className="card">
              <div className="card-header">
                <div>
                  <div className="card-title"><i className="fa-solid fa-temperature-half"></i> Clustered Heatmap: Matriks Korelasi Hierarkis</div>
                  <div className="card-caption">Korelasi asosiasi antar 8 indikator gender BPS RI dengan klasterisasi hierarkis.</div>
                </div>
              </div>

              <div className="content-with-sidebar">
                <div className="content-main-col">
                  <div id="heatmap-chart" className="chart-box"></div>
                </div>

                <aside className="analysis-sidebar">
                  <div className="analysis-section-title">
                    <i className="fa-solid fa-lightbulb"></i> Temuan Asosiasi Peubah
                  </div>
                  <div className="analysis-card green">
                    <h4><i className="fa-solid fa-link"></i> 1. Klaster Pendidikan dan Kesehatan</h4>
                    <p>Terdapat korelasi positif sangat kuat antara RLS, HLS, dan AHH (r &gt; 0.65). Investasi pada lama sekolah perempuan berasosiasi linier terhadap peningkatan usia harapan hidup.</p>
                  </div>
                  <div className="analysis-card amber">
                    <h4><i className="fa-solid fa-triangle-exclamation"></i> 2. Paradoks TPAK dan Pendapatan</h4>
                    <p>Korelasi antara TPAK dan Sumbangan Pendapatan bernilai mendekati nol atau negatif di beberapa wilayah, menegaskan bahwa tingginya kuantitas pekerja perempuan belum menjamin kualitas pendapatan yang setara.</p>
                  </div>
                </aside>
              </div>
              <DataSourceBadge vars={['pengeluaran', 'ahh', 'hls', 'rls', 'tpak', 'pendapatan', 'parlemen', 'profesional']} />
            </div>
          )}

          {activeMultiSubtab === 'multi-subtab-radar' && (
            <div className="card">
              <div className="card-header">
                <div>
                  <div className="card-title"><i className="fa-solid fa-circle-notch"></i> Radar Chart: Perbandingan Profil Multidimensi Antar Wilayah</div>
                  <div className="card-caption">Visualisasi profil 8 dimensi gender ternormalisasi antarkoridor pulau utama Indonesia.</div>
                </div>
              </div>

              <div className="content-with-sidebar">
                <div className="content-main-col">
                  <div id="radar-chart" className="chart-box"></div>
                </div>

                <aside className="analysis-sidebar">
                  <div className="analysis-section-title">
                    <i className="fa-solid fa-lightbulb"></i> Analisis Profil Regional
                  </div>
                  <div className="analysis-card green">
                    <h4><i className="fa-solid fa-spider"></i> 1. Pola Poligon Jawa vs Sulawesi</h4>
                    <p>Jawa menunjukkan kekuatan pada dimensi pengeluaran riil dan partisipasi profesional formal. Sulawesi menonjol pada dimensi keterwakilan parlemen berkat tingginya agensi politik perempuan di wilayah utara.</p>
                  </div>
                  <div className="analysis-card amber">
                    <h4><i className="fa-solid fa-compass"></i> 2. Profil Asimetris Kawasan Timur</h4>
                    <p>Wilayah Papua membentuk poligon yang sangat condong ke arah TPAK perempuan, namun merosot tajam pada sumbu pengeluaran dan angka keterlibatan parlemen.</p>
                  </div>
                </aside>
              </div>
              <DataSourceBadge vars={['pengeluaran', 'ahh', 'hls', 'rls', 'tpak', 'pendapatan', 'parlemen', 'profesional']} />
            </div>
          )}
        </section>

        {/* Tab 4: Hierarchical */}
        <section className={`tab-pane ${activeTab === 'tab-hierarchical' ? 'active' : ''}`}>
          <div className="subtabs-nav">
            <button className={`subtab-btn ${activeHierSubtab === 'hier-subtab-treemap' ? 'active' : ''}`} onClick={() => setActiveHierSubtab('hier-subtab-treemap')}><i className="fa-solid fa-tree"></i> Treemap Interaktif</button>
            <button className={`subtab-btn ${activeHierSubtab === 'hier-subtab-sunburst' ? 'active' : ''}`} onClick={() => setActiveHierSubtab('hier-subtab-sunburst')}><i className="fa-solid fa-sun"></i> Sunburst Chart</button>
            <button className={`subtab-btn ${activeHierSubtab === 'hier-subtab-summary' ? 'active' : ''}`} onClick={() => setActiveHierSubtab('hier-subtab-summary')}><i className="fa-solid fa-list-check"></i> Rangkuman Hierarki</button>
          </div>

          {/* Hierarchical Region Selector & Variable Controls */}
          <div className="card" style={{ padding: '14px 18px' }}>
            <div className="hier-region-selector">
              <div className="filter-item">
                <label>Mode Pengelompokan</label>
                <select value={hierViewMode} onChange={e => {
                  setHierViewMode(e.target.value);
                  setHierSelectedProv('Semua Provinsi');
                  setHierSelectedKab('Semua Kab/Kota');
                }}>
                  <option value="provinsi">Kelompokkan per Provinsi (Indonesia &gt; Provinsi &gt; Kab/Kota)</option>
                  <option value="pulau">Kelompokkan per Pulau (Indonesia &gt; Pulau &gt; Provinsi &gt; Kab/Kota)</option>
                  <option value="kabkota">Daftar Langsung Kab/Kota (Flat View)</option>
                </select>
              </div>
              <div className="filter-item">
                <label>Pilih Provinsi</label>
                <select value={hierSelectedProv} onChange={e => {
                  setHierSelectedProv(e.target.value);
                  setHierSelectedKab('Semua Kab/Kota');
                }}>
                  {hierAvailableProvs.map(p => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </div>
              <div className="filter-item">
                <label>Pilih Kab/Kota</label>
                <select value={hierSelectedKab} onChange={e => setHierSelectedKab(e.target.value)}>
                  {hierAvailableKabs.map(k => (
                    <option key={k} value={k}>{k}</option>
                  ))}
                </select>
              </div>
              <div className="filter-item">
                <label>Variabel Ukuran</label>
                <select value={hierSizeVar} onChange={e => setHierSizeVar(e.target.value)}>
                  <option value="pengeluaran">Pengeluaran Riil (Ribu Rp)</option>
                  <option value="pendapatan">Sumbangan Pendapatan (%)</option>
                  <option value="tpak">TPAK Perempuan (%)</option>
                  <option value="parlemen">Parlemen Perempuan (%)</option>
                </select>
              </div>
              <div className="filter-item">
                <label>Variabel Warna</label>
                <select value={hierColorVar} onChange={e => setHierColorVar(e.target.value)}>
                  <option value="parlemen">Keterlibatan di Parlemen (%)</option>
                  <option value="profesional">Tenaga Profesional (%)</option>
                  <option value="skor_keputusan">Skor Keputusan (0-100)</option>
                  <option value="skor_ekonomi">Skor Partisipasi Ekonomi (0-100)</option>
                  <option value="ikpp_komposit">IKPP Komposit (0-100)</option>
                </select>
              </div>
              {(hierSelectedProv !== 'Semua Provinsi' || hierSelectedKab !== 'Semua Kab/Kota') && (
                <div className="filter-item" style={{ flex: '0 0 auto' }}>
                  <button
                    onClick={() => {
                      setHierSelectedProv('Semua Provinsi');
                      setHierSelectedKab('Semua Kab/Kota');
                    }}
                    style={{
                      padding: '6px 12px',
                      borderRadius: '6px',
                      border: '1px solid #cbd5e1',
                      background: '#f1f5f9',
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      color: '#475569',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px'
                    }}
                    title="Reset pilihan wilayah"
                  >
                    <i className="fa-solid fa-rotate-left"></i> Reset
                  </button>
                </div>
              )}
            </div>
            <div style={{ fontSize: '0.76rem', color: '#64748b', marginTop: '4px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
              <div>
                <i className="fa-solid fa-filter" style={{ color: '#2563eb', marginRight: '4px' }}></i>
                Menampilkan <strong style={{ color: '#0f172a' }}>{hierFilteredData.length}</strong> daerah
                {hierSelectedProv !== 'Semua Provinsi' && <> di Provinsi <strong style={{ color: '#2563eb' }}>{hierSelectedProv}</strong></>}
                {hierSelectedKab !== 'Semua Kab/Kota' && <> &bull; Fokus Daerah: <strong style={{ color: '#2563eb' }}>{hierSelectedKab}</strong></>}
              </div>
              <div style={{ fontSize: '0.74rem', color: '#475569' }}>
                Mode: <strong>{hierViewMode === 'provinsi' ? 'Kelompok Provinsi' : hierViewMode === 'pulau' ? 'Hierarki Pulau' : 'Flat Kab/Kota'}</strong>
              </div>
            </div>
          </div>

          <div className="content-with-sidebar">
            <div className="content-main-col">
              {activeHierSubtab === 'hier-subtab-treemap' && (
                <div className="card">
                  <div id="treemap-chart" className="chart-box"></div>
                  <DataSourceBadge vars={[hierSizeVar, hierColorVar]} />
                </div>
              )}

              {activeHierSubtab === 'hier-subtab-sunburst' && (
                <div className="card">
                  <div id="sunburst-chart" className="chart-box"></div>
                  <DataSourceBadge vars={[hierSizeVar, hierColorVar]} />
                </div>
              )}

              {activeHierSubtab === 'hier-subtab-summary' && (
                <div className="card">
                  <div className="card-header">
                    <div className="card-title">
                      <i className="fa-solid fa-table-columns"></i>
                      Rangkuman Statistik {hierViewMode === 'provinsi' ? 'per Provinsi' : 'per Pulau'}
                    </div>
                  </div>
                  <div className="table-responsive">
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th>{hierViewMode === 'provinsi' ? 'Provinsi' : 'Wilayah Pulau'}</th>
                          {hierViewMode === 'provinsi' && <th>Pulau</th>}
                          <th>Jumlah Daerah</th>
                          <th>Parlemen (%)</th>
                          <th>Pendapatan (%)</th>
                          <th>Profesional (%)</th>
                          <th>TPAK (%)</th>
                          <th>Pengeluaran</th>
                          <th>Skor Keputusan</th>
                          <th>Skor Ekonomi</th>
                          <th>IKPP Komposit</th>
                        </tr>
                      </thead>
                      <tbody>
                        {hierViewMode === 'provinsi'
                          ? Object.entries(provAgg).sort((a, b) => a[0].localeCompare(b[0])).map(([prov, agg]) => (
                            <tr key={prov}>
                              <td><b>{prov}</b></td>
                              <td style={{ color: '#64748b', fontSize: '0.78rem' }}>{agg.pulau}</td>
                              <td>{agg.count}</td>
                              <td>{(agg.parlemen / agg.count).toFixed(2)}%</td>
                              <td>{(agg.pendapatan / agg.count).toFixed(2)}%</td>
                              <td>{(agg.profesional / agg.count).toFixed(2)}%</td>
                              <td>{(agg.tpak / agg.count).toFixed(2)}%</td>
                              <td>Rp{Math.round(agg.pengeluaran / agg.count).toLocaleString()}</td>
                              <td><span style={{ fontWeight: '700', color: '#2563eb' }}>{(agg.keputusan / agg.count).toFixed(1)}</span></td>
                              <td><span style={{ fontWeight: '700', color: '#10b981' }}>{(agg.ekonomi / agg.count).toFixed(1)}</span></td>
                              <td><span style={{ fontWeight: '700', color: '#6366f1' }}>{(agg.ikpp / agg.count).toFixed(1)}</span></td>
                            </tr>
                          ))
                          : Object.entries(islandAgg).map(([pulau, agg]) => (
                            <tr key={pulau}>
                              <td><b>{pulau}</b></td>
                              <td>{agg.count}</td>
                              <td>{(agg.parlemen / agg.count).toFixed(2)}%</td>
                              <td>{(agg.pendapatan / agg.count).toFixed(2)}%</td>
                              <td>{(agg.profesional / agg.count).toFixed(2)}%</td>
                              <td>{(agg.tpak / agg.count).toFixed(2)}%</td>
                              <td>Rp{Math.round(agg.pengeluaran / agg.count).toLocaleString()}</td>
                              <td><span style={{ fontWeight: '700', color: '#2563eb' }}>{(agg.keputusan / agg.count).toFixed(1)}</span></td>
                              <td><span style={{ fontWeight: '700', color: '#10b981' }}>{(agg.ekonomi / agg.count).toFixed(1)}</span></td>
                              <td><span style={{ fontWeight: '700', color: '#6366f1' }}>{(agg.ikpp / agg.count).toFixed(1)}</span></td>
                            </tr>
                          ))
                        }
                      </tbody>
                    </table>
                  </div>
                  <DataSourceBadge vars={['parlemen', 'pendapatan', 'profesional', 'tpak', 'pengeluaran']} />
                </div>
              )}
            </div>

            <aside className="analysis-sidebar">
              <div className="analysis-section-title">
                <i className="fa-solid fa-chart-pie"></i> Ringkasan Eksekutif Hierarki
              </div>

              {/* Status Cakupan Card */}
              <div className="analysis-card blue">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', color: '#1e40af' }}>
                    Cakupan Terpilih
                  </span>
                  <span className="badge badge-primary" style={{ padding: '2px 8px', fontSize: '0.68rem' }}>
                    {hierCount} Daerah
                  </span>
                </div>
                <h4 style={{ margin: '2px 0 0', fontSize: '0.92rem' }}>
                  <i className="fa-solid fa-location-dot"></i>
                  {hierSelectedKab !== 'Semua Kab/Kota'
                    ? hierSelectedKab
                    : hierSelectedProv !== 'Semua Provinsi'
                      ? hierSelectedProv
                      : 'Seluruh Indonesia (Nasional)'
                  }
                </h4>
                <div className="hier-stat-grid" style={{ marginTop: '8px' }}>
                  <div className="hier-stat-box">
                    <span className="h-label">Rata-rata Parlemen</span>
                    <span className="h-val">{hierAvgParlemen.toFixed(2)}%</span>
                    <span className="h-sub">{hierAvgParlemen >= 30 ? 'Target 30% Terpenuhi' : 'Defisit dari Kuota 30%'}</span>
                  </div>
                  <div className="hier-stat-box">
                    <span className="h-label">Sumbangan Pendapatan</span>
                    <span className="h-val">{hierAvgPendapatan.toFixed(2)}%</span>
                    <span className="h-sub">Paritas: 50%</span>
                  </div>
                  <div className="hier-stat-box">
                    <span className="h-label">Tenaga Profesional</span>
                    <span className="h-val">{hierAvgProfesional.toFixed(2)}%</span>
                    <span className="h-sub">Sektor Formal</span>
                  </div>
                  <div className="hier-stat-box">
                    <span className="h-label">Pengeluaran Riil</span>
                    <span className="h-val">Rp{Math.round(hierAvgPengeluaran).toLocaleString('id-ID')}</span>
                    <span className="h-sub">per kapita/thn</span>
                  </div>
                </div>
                <div style={{ marginTop: '6px', fontSize: '0.72rem', color: '#475569', display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #e2e8f0', paddingTop: '6px' }}>
                  <span>Keterwakilan Parlemen &ge; 30%:</span>
                  <strong style={{ color: hierKuotaPass > 0 ? '#059669' : '#dc2626' }}>{hierKuotaPass} dari {hierCount} daerah ({((hierKuotaPass / (hierCount || 1)) * 100).toFixed(1)}%)</strong>
                </div>
              </div>

              {/* Detail Kab/Kota Terpilih (if single kab/kota selected) */}
              {hierSelectedKabItem && (
                <div className="analysis-card purple">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', color: '#7c3aed' }}>
                      Detail Profil Daerah
                    </span>
                    <span style={{ fontSize: '0.7rem', fontWeight: 700, background: '#f5f3ff', color: '#7c3aed', padding: '2px 6px', borderRadius: '4px' }}>
                      {hierSelectedKabItem.tipe}
                    </span>
                  </div>
                  <h4 style={{ margin: '2px 0 0', fontSize: '0.9rem' }}>
                    <i className="fa-solid fa-city"></i> {hierSelectedKabItem.nama_resmi}
                  </h4>
                  <p style={{ margin: '2px 0 6px', fontSize: '0.74rem', color: '#64748b' }}>
                    Provinsi: {hierSelectedKabItem.provinsi} &bull; Pulau: {hierSelectedKabItem.pulau}
                  </p>
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '6px' }}>
                    <span className="badge badge-accent" style={{ fontSize: '0.68rem' }}>{hierSelectedKabItem.kuadran}</span>
                    <span className="badge badge-dark" style={{ fontSize: '0.68rem' }}>IKPP: {hierSelectedKabItem.ikpp_komposit}</span>
                  </div>
                  <div style={{ fontSize: '0.75rem', display: 'flex', flexDirection: 'column', gap: '3px' }}>
                    <div><strong>TPAK Perempuan:</strong> {Number(hierSelectedKabItem.tpak).toFixed(2)}%</div>
                    <div><strong>Skor Keputusan:</strong> {Number(hierSelectedKabItem.skor_keputusan).toFixed(1)} / 100</div>
                    <div><strong>Skor Ekonomi:</strong> {Number(hierSelectedKabItem.skor_ekonomi).toFixed(1)} / 100</div>
                  </div>
                </div>
              )}

              {/* Mini Breakdown Table */}
              <div className="analysis-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <h4 style={{ margin: 0, fontSize: '0.82rem' }}>
                    <i className="fa-solid fa-layer-group"></i> Agregasi {hierViewMode === 'provinsi' ? 'Provinsi' : 'Wilayah'}
                  </h4>
                  <span style={{ fontSize: '0.68rem', color: '#64748b' }}>Top Ringkasan</span>
                </div>
                <div style={{ maxHeight: '160px', overflowY: 'auto' }}>
                  <table className="hier-mini-table">
                    <thead>
                      <tr>
                        <th>Wilayah</th>
                        <th>Kab/Kota</th>
                        <th>Parlemen</th>
                        <th>Pendapatan</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(hierViewMode === 'provinsi' ? Object.entries(provAgg) : Object.entries(islandAgg))
                        .slice(0, 8)
                        .map(([name, agg]) => (
                          <tr key={name}>
                            <td><strong>{name}</strong></td>
                            <td>{agg.count}</td>
                            <td>{(agg.parlemen / agg.count).toFixed(1)}%</td>
                            <td>{(agg.pendapatan / agg.count).toFixed(1)}%</td>
                          </tr>
                        ))
                      }
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Analisis Akademis Temuan Hierarki */}
              <div className="analysis-card green">
                <h4><i className="fa-solid fa-sitemap"></i> 1. Efek Agregasi Hierarkis (MAUP)</h4>
                <p>Agregasi makro di tingkat provinsi sering kali menyamarkan variasi ekstrem di tingkat kabupaten/kota (<em>Modifiable Areal Unit Problem</em>). Analisis hierarkis membuktikan bahwa provinsi dengan skor rata-rata moderat dapat memiliki ketimpangan internal hingga 4 kali lipat antarwilayah kabupaten pedalaman dan kota metropolitan.</p>
              </div>

              <div className="analysis-card amber">
                <h4><i className="fa-solid fa-tree-city"></i> 2. Polarisasi Perkotaan vs Pedesaan</h4>
                <p>Entitas Kota di seluruh provinsi secara konsisten menempati kotak proporsi terbesar pada variabel Tenaga Profesional dan Pengeluaran Riil, mengonfirmasi terbentuknya konsentrasi ekonomi gender di pusat pertumbuhan perkotaan.</p>
              </div>

              <div className="analysis-card purple">
                <h4><i className="fa-solid fa-scale-balanced"></i> 3. Implikasi Kebijakan Afirmasi</h4>
                <p>Penetapan afirmasi kuota 30% parlemen memerlukan intervensi desentralistik di tingkat DPRD Kabupaten/Kota, bukan sekadar agregat provinsi atau nasional.</p>
              </div>
            </aside>
          </div>
        </section>

        {/* Tab 5: Data Explorer */}
        <section className={`tab-pane ${activeTab === 'tab-data' ? 'active' : ''}`}>
          <div className="card">
            <div className="card-header">
              <div>
                <div className="card-title"><i className="fa-solid fa-database"></i> Pangkalan Data 514 Kabupaten/Kota Indonesia (BPS 2024)</div>
                <div className="card-caption">Gunakan pencarian nama daerah atau klik pada tajuk kolom untuk mengurutkan data secara fleksibel.</div>
              </div>
              <button className="btn-download" onClick={downloadCSV}>
                <i className="fa-solid fa-file-arrow-down"></i> Unduh Data CSV Terfilter
              </button>
            </div>

            <div className="table-controls">
              <input
                type="text"
                className="search-input"
                placeholder="Cari nama kabupaten, kota, atau provinsi..."
                value={tableSearch}
                onChange={e => { setTableSearch(e.target.value); setCurrentPage(1); }}
              />
              <div style={{ fontSize: '12px', color: '#64748b' }}>
                Menampilkan {tableRecords.length === 0 ? 0 : pageStart + 1} - {Math.min(pageStart + rowsPerPage, tableRecords.length)} dari {tableRecords.length} daerah
              </div>
            </div>

            <div className="table-responsive">
              <table className="data-table">
                <thead>
                  <tr>
                    <th onClick={() => handleSort('kode_wilayah')}>Kode</th>
                    <th onClick={() => handleSort('nama_resmi')}>Nama Daerah</th>
                    <th onClick={() => handleSort('tipe')}>Tipe</th>
                    <th onClick={() => handleSort('provinsi')}>Provinsi</th>
                    <th onClick={() => handleSort('pulau')}>Pulau</th>
                    <th onClick={() => handleSort('parlemen')}>Parlemen</th>
                    <th onClick={() => handleSort('pendapatan')}>Pendapatan</th>
                    <th onClick={() => handleSort('profesional')}>Profesional</th>
                    <th onClick={() => handleSort('tpak')}>TPAK</th>
                    <th onClick={() => handleSort('pengeluaran')}>Pengeluaran</th>
                    <th onClick={() => handleSort('skor_keputusan')}>Keputusan</th>
                    <th onClick={() => handleSort('skor_ekonomi')}>Ekonomi</th>
                    <th onClick={() => handleSort('ikpp_komposit')}>IKPP</th>
                    <th onClick={() => handleSort('kuadran')}>Kuadran</th>
                  </tr>
                </thead>
                <tbody>
                  {displayRows.map(d => (
                    <tr key={d.kode_wilayah}>
                      <td>{d.kode_wilayah}</td>
                      <td><b>{d.nama_resmi}</b></td>
                      <td>{d.tipe}</td>
                      <td>{d.provinsi}</td>
                      <td>{d.pulau}</td>
                      <td>{Number(d.parlemen).toFixed(2)}%</td>
                      <td>{Number(d.pendapatan).toFixed(2)}%</td>
                      <td>{Number(d.profesional).toFixed(2)}%</td>
                      <td>{Number(d.tpak).toFixed(2)}%</td>
                      <td>Rp{Number(d.pengeluaran).toLocaleString()}</td>
                      <td><b>{Number(d.skor_keputusan).toFixed(1)}</b></td>
                      <td><b>{Number(d.skor_ekonomi).toFixed(1)}</b></td>
                      <td><span style={{ fontWeight: '700', color: '#2563eb' }}>{Number(d.ikpp_komposit).toFixed(1)}</span></td>
                      <td><span style={{ fontSize: '11px', padding: '2px 6px', background: '#f1f5f9', borderRadius: '4px' }}>{d.kuadran.split(' ')[0]} {d.kuadran.split(' ')[1]}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="pagination">
              <div>Gunakan tombol navigasi untuk berpindah halaman amatan</div>
              <div className="pagination-btns">
                <button className="page-btn" disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)}>
                  <i className="fa-solid fa-chevron-left"></i>
                </button>
                <span style={{ padding: '4px 8px', fontWeight: '600' }}>Hal {currentPage} / {totalPages}</span>
                <button className="page-btn" disabled={currentPage === totalPages} onClick={() => setCurrentPage(currentPage + 1)}>
                  <i className="fa-solid fa-chevron-right"></i>
                </button>
              </div>
            </div>
            <DataSourceBadge vars={['pengeluaran', 'ahh', 'hls', 'rls', 'tpak', 'pendapatan', 'parlemen', 'profesional']} />
          </div>
        </section>

        {/* Tab 6: Methodology */}
        <section className={`tab-pane ${activeTab === 'tab-method' ? 'active' : ''}`}>
          <div className="method-box">
            <h3><i className="fa-solid fa-book-bookmark"></i> 1. Sumber Data Resmi BPS (Tahun 2024)</h3>
            <p>Seluruh indikator dalam proyek visualisasi ini bersumber secara sah dari publikasi tabel statistik resmi Badan Pusat Statistik (BPS) Republik Indonesia (Tahun 2024):</p>
            <ul>
              <li>
                <strong>Pengeluaran per Kapita Disesuaikan:</strong>{' '}
                <a href="https://www.bps.go.id/id/statistics-table/2/NDE2IzI=/-metode-baru--pengeluaran-per-kapita-disesuaikan.html" target="_blank" rel="noopener noreferrer" style={{ color: '#2563eb', textDecoration: 'underline' }}>
                  [Metode Baru] Pengeluaran per Kapita Disesuaikan (Tahun 2024) <i className="fa-solid fa-arrow-up-right-from-square" style={{ fontSize: '0.72rem' }}></i>
                </a>
              </li>
              <li>
                <strong>Angka Harapan Hidup (AHH):</strong>{' '}
                <a href="https://www.bps.go.id/id/statistics-table/2/NDU1IzI=/angkaharapan-hidup--ahh--menurut-kabupaten-kota-dan-jenis-kelamin.html" target="_blank" rel="noopener noreferrer" style={{ color: '#2563eb', textDecoration: 'underline' }}>
                  Angka Harapan Hidup (AHH) Menurut Kabupaten/Kota dan Jenis Kelamin (Tahun 2024) <i className="fa-solid fa-arrow-up-right-from-square" style={{ fontSize: '0.72rem' }}></i>
                </a>
              </li>
              <li>
                <strong>Harapan Lama Sekolah (HLS):</strong>{' '}
                <a href="https://www.bps.go.id/id/statistics-table/2/NDE3IzI=/-new-method--expected-years-of-schooling.html" target="_blank" rel="noopener noreferrer" style={{ color: '#2563eb', textDecoration: 'underline' }}>
                  [Metode Baru] Harapan Lama Sekolah (Tahun 2024) <i className="fa-solid fa-arrow-up-right-from-square" style={{ fontSize: '0.72rem' }}></i>
                </a>
              </li>
              <li>
                <strong>Rata-rata Lama Sekolah (RLS):</strong>{' '}
                <a href="https://www.bps.go.id/id/statistics-table/2/NDE1IzI=/-metode-baru--rata-rata-lama-sekolah.html" target="_blank" rel="noopener noreferrer" style={{ color: '#2563eb', textDecoration: 'underline' }}>
                  [Metode Baru] Rata-rata Lama Sekolah (Tahun 2024) <i className="fa-solid fa-arrow-up-right-from-square" style={{ fontSize: '0.72rem' }}></i>
                </a>
              </li>
              <li>
                <strong>Tingkat Partisipasi Angkatan Kerja (TPAK):</strong>{' '}
                <a href="https://www.bps.go.id/id/statistics-table/2/MjIwMCMy/tingkat-partisipasi-angkatan-kerja-menurut-jenis-kelamin.html" target="_blank" rel="noopener noreferrer" style={{ color: '#2563eb', textDecoration: 'underline' }}>
                  Tingkat Partisipasi Angkatan Kerja Menurut Jenis Kelamin (Tahun 2024) <i className="fa-solid fa-arrow-up-right-from-square" style={{ fontSize: '0.72rem' }}></i>
                </a>
              </li>
              <li>
                <strong>Sumbangan Pendapatan Perempuan:</strong>{' '}
                <a href="https://www.bps.go.id/id/statistics-table/2/NDY3IzI=/revenue-contribution-of-women.html" target="_blank" rel="noopener noreferrer" style={{ color: '#2563eb', textDecoration: 'underline' }}>
                  Sumbangan Pendapatan Perempuan (Tahun 2024) <i className="fa-solid fa-arrow-up-right-from-square" style={{ fontSize: '0.72rem' }}></i>
                </a>
              </li>
              <li>
                <strong>Keterlibatan Perempuan di Parlemen:</strong>{' '}
                <a href="https://www.bps.go.id/id/statistics-table/2/NDY0IzI=/the-involvement-of-women-in-parliament.html" target="_blank" rel="noopener noreferrer" style={{ color: '#2563eb', textDecoration: 'underline' }}>
                  Keterlibatan Perempuan di Parlemen (Tahun 2024) <i className="fa-solid fa-arrow-up-right-from-square" style={{ fontSize: '0.72rem' }}></i>
                </a>
              </li>
              <li>
                <strong>Tenaga Profesional Perempuan:</strong>{' '}
                <a href="https://www.bps.go.id/id/statistics-table/2/NDY1IzI=/the-percentage-of-female-professional-staff.html" target="_blank" rel="noopener noreferrer" style={{ color: '#2563eb', textDecoration: 'underline' }}>
                  Tenaga Profesional Perempuan (Tahun 2024) <i className="fa-solid fa-arrow-up-right-from-square" style={{ fontSize: '0.72rem' }}></i>
                </a>
              </li>
              <li><strong>Atribusi Resmi:</strong> Seluruh indikator bersumber secara sah dari Badan Pusat Statistik (BPS Republik Indonesia).</li>
            </ul>
          </div>

          <div className="method-box">
            <h3><i className="fa-solid fa-gears"></i> 2. Pra-pemrosesan Data & Penanganan Nilai Hilang</h3>
            <ul>
              <li><strong>Rekonsiliasi Wilayah:</strong> Sinkronisasi struktur administratif pasca-pemekaran 4 DOB Papua dan pemisahan Kaltara dari Kaltim hingga mencakup persis 514 kabupaten/kota dan 38 provinsi.</li>
              <li><strong>Penanganan Missing Values:</strong> 14 kabupaten di pedalaman Papua diimputasi menggunakan <em>K-Nearest Neighbors</em> (KNN, k=5, distance-weighted) pada matriks fitur terstandarisasi. Seluruh indikator politik, pendapatan, dan profesionalitas tetap menggunakan data observasi riil 100%.</li>
              <li><strong>Normalisasi Min-Max:</strong> Pembentukan Skor Ekonomi, Skor Keputusan, dan Indeks Komposit Pemberdayaan Perempuan (IKPP) berskala 0–100.</li>
            </ul>
          </div>

          <div className="method-box">
            <h3><i className="fa-solid fa-eye"></i> 3. Justifikasi Desain & Visual Encoding</h3>
            <ul>
              <li><strong>Posisi Spasial:</strong> Dimanfaatkan pada scatter plot dan peta koordinat geografis sebagai saluran perseptual dengan akurasi tertinggi (Cleveland &amp; McGill, 1984).</li>
              <li><strong>Pewarnaan (Colorblind-Safe):</strong> Menggunakan skala warna perseptual seragam (<em>Viridis, Cividis, Plasma</em>) yang menjamin aksesibilitas bagi penderita buta warna (protanopia, deuteranopia).</li>
              <li><strong>Ukuran Simbol:</strong> Mengkodekan besaran absolut taraf hidup (pengeluaran riil per kapita) dengan batas radius proporsional untuk mencegah oklusi visual.</li>
            </ul>
          </div>

          <div className="method-box">
            <h3><i className="fa-solid fa-shield-halved"></i> 4. Deklarasi Integritas Akademik & Penggunaan AI</h3>
            <p>Sesuai dengan ketentuan Petunjuk Nomor 7 Soal UAS Visualisasi Data dan Informasi TA. 2025/2026:</p>
            <ul>
              <li><strong>Alat Bantu AI yang Digunakan:</strong> Large Language Model (Google DeepMind Antigravity) digunakan sebatas alat bantu asistensi pemrograman (<em>pair programming</em>), penulisan skrip otomasi ekstraksi data, dan perancangan tata letak antarmuka web.</li>
              <li><strong>Orisinalitas &amp; Verifikasi:</strong> Konseptualisasi penelitian, seleksi indikator BPS, justifikasi visual encoding, validasi statistik autokorelasi spasial, serta perumusan naskah analisis dikerjakan dan dipertanggungjawabkan sepenuhnya oleh penyusun.</li>
            </ul>
          </div>
        </section>
      </main>
    </div>
  );
}
