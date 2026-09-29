/**
 * ==========================================================================
 * Visual Analytics Charts Module (charts.js)
 * Implements Plotly.js & Leaflet.js visualizations
 * ==========================================================================
 */

let leafletMapInstance = null;
let choroplethMapInstance = null;
let lisaMapInstance = null;

// Palette definitions (Colorblind-Safe)
const PALETTES = {
  Viridis: ['#440154', '#482878', '#3e4989', '#31688e', '#26828e', '#1f9e89', '#35b779', '#6ece58', '#b5de2b', '#fde725'],
  Cividis: ['#00204d', '#002c69', '#003986', '#26456e', '#41525a', '#5b6049', '#797037', '#998122', '#bc930a', '#e1a700', '#ffd321'],
  Plasma: ['#0d0887', '#46039f', '#7201a8', '#9c179e', '#bd3786', '#d8576b', '#ed7953', '#fb9f3a', '#fdca26', '#f0f921'],
  Turbo: ['#30123b', '#4145ab', '#4675ed', '#39a2fc', '#1bcfd4', '#24eca6', '#61fc6c', '#a4fc3b', '#d1e834', '#f3c63a', '#fe9b2d', '#f36315', '#d93806', '#b11902', '#7a0403']
};

/**
 * 1. STORYTELLING: Quadrant Scatter Plot
 */
function renderQuadrantScatter(data, containerId = 'quadrant-chart') {
  if (!data || data.length === 0) return;

  const medX = 45.8;
  const medY = 38.2;

  // Group by Pulau
  const islands = [...new Set(data.map(d => d.pulau))];
  const traces = islands.map(pulau => {
    const subset = data.filter(d => d.pulau === pulau);
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
    margin: { l: 50, r: 20, t: 50, b: 60 },
    height: 540,
    paper_bgcolor: 'transparent',
    plot_bgcolor: 'transparent'
  };

  Plotly.react(containerId, traces, layout, { responsive: true, displayModeBar: false });
}

/**
 * 2. GEOSPATIAL: Leaflet Proportional Symbol Map
 */
function renderProportionalSymbolMap(data, sizeVar = 'pengeluaran', colorVar = 'skor_keputusan', paletteName = 'Viridis') {
  const container = document.getElementById('leaflet-map');
  if (!container) return;

  if (!leafletMapInstance) {
    leafletMapInstance = L.map('leaflet-map', { scrollWheelZoom: false }).setView([-2.2, 118.0], 5);
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; CartoDB & OpenStreetMap',
      maxZoom: 18
    }).addTo(leafletMapInstance);
  } else {
    leafletMapInstance.eachLayer(layer => {
      if (layer instanceof L.CircleMarker) {
        leafletMapInstance.removeLayer(layer);
      }
    });
  }

  // Find min and max for scaling
  const minVal = Math.min(...data.map(d => d[colorVar]));
  const maxVal = Math.max(...data.map(d => d[colorVar]));
  const palette = PALETTES[paletteName] || PALETTES['Viridis'];

  function getColor(val) {
    const norm = (val - minVal) / (maxVal - minVal || 1);
    const idx = Math.min(palette.length - 1, Math.max(0, Math.floor(norm * (palette.length - 1))));
    return palette[idx];
  }

  data.forEach(d => {
    if (d.lat && d.lon) {
      // Calculate radius
      let radius = 6;
      if (sizeVar === 'pengeluaran') radius = Math.max(4, Math.min(18, d.pengeluaran / 1000));
      else if (sizeVar === 'tpak') radius = Math.max(4, Math.min(18, d.tpak / 6));
      else radius = Math.max(4, Math.min(18, (d[sizeVar] || 10) / 4));

      const marker = L.circleMarker([d.lat, d.lon], {
        radius: radius,
        fillColor: getColor(d[colorVar]),
        color: '#ffffff',
        weight: 1,
        opacity: 0.9,
        fillOpacity: 0.75
      }).addTo(leafletMapInstance);

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
}

/**
 * 3. GEOSPATIAL: Leaflet Choropleth Map (Provinces)
 */
function renderChoroplethMap(provData, geojsonData, selectedVar = 'parlemen', paletteName = 'Viridis') {
  const container = document.getElementById('choropleth-map');
  if (!container || !geojsonData) return;

  if (!choroplethMapInstance) {
    choroplethMapInstance = L.map('choropleth-map', { scrollWheelZoom: false }).setView([-2.2, 118.0], 5);
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; CartoDB & OpenStreetMap',
      maxZoom: 18
    }).addTo(choroplethMapInstance);
  } else {
    choroplethMapInstance.eachLayer(layer => {
      if (layer instanceof L.GeoJSON) {
        choroplethMapInstance.removeLayer(layer);
      }
    });
  }

  // Create dictionary of values
  const provMap = {};
  provData.forEach(p => {
    provMap[p.provinsi.toUpperCase()] = p[selectedVar];
  });

  const vals = Object.values(provMap);
  const minVal = Math.min(...vals);
  const maxVal = Math.max(...vals);
  const palette = PALETTES[paletteName] || PALETTES['Viridis'];

  function getColor(val) {
    if (val === undefined || isNaN(val)) return '#cbd5e1';
    const norm = (val - minVal) / (maxVal - minVal || 1);
    const idx = Math.min(palette.length - 1, Math.max(0, Math.floor(norm * (palette.length - 1))));
    return palette[idx];
  }

  function style(feature) {
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
  }

  L.geoJson(geojsonData, {
    style: style,
    onEachFeature: (feature, layer) => {
      const name = feature.properties.Propinsi || feature.properties.name;
      const val = provMap[name.toUpperCase()] || 'N/A';
      layer.bindTooltip(`<b>${name}</b><br>${selectedVar.toUpperCase()}: ${val}`);
    }
  }).addTo(choroplethMapInstance);
}

/**
 * 4. GEOSPATIAL: Leaflet LISA Cluster Map
 */
function renderLISASpatialMap(data, clusterVar = 'lisa_cluster_keputusan') {
  const container = document.getElementById('lisa-map');
  if (!container) return;

  if (!lisaMapInstance) {
    lisaMapInstance = L.map('lisa-map', { scrollWheelZoom: false }).setView([-2.2, 118.0], 5);
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; CartoDB & OpenStreetMap',
      maxZoom: 18
    }).addTo(lisaMapInstance);
  } else {
    lisaMapInstance.eachLayer(layer => {
      if (layer instanceof L.CircleMarker) {
        lisaMapInstance.removeLayer(layer);
      }
    });
  }

  const clusterColors = {
    'High-High (Hotspot)': '#dc2626',
    'Low-Low (Coldspot)': '#2563eb',
    'High-Low (Spatial Outlier)': '#f97316',
    'Low-High (Spatial Outlier)': '#10b981',
    'Not Significant': '#cbd5e1'
  };

  data.forEach(d => {
    if (d.lat && d.lon) {
      const c = d[clusterVar] || 'Not Significant';
      const isSig = c !== 'Not Significant';
      const marker = L.circleMarker([d.lat, d.lon], {
        radius: isSig ? 8 : 4.5,
        fillColor: clusterColors[c] || '#cbd5e1',
        color: '#ffffff',
        weight: 1,
        opacity: 0.9,
        fillOpacity: isSig ? 0.85 : 0.4
      }).addTo(lisaMapInstance);

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
}

/**
 * 5. MULTIVARIATE: PCA Biplot
 */
function renderPCABiplot(data, meta, colorBy = 'pulau', containerId = 'pca-biplot-chart') {
  if (!data || !meta) return;

  const traces = [];
  const groups = [...new Set(data.map(d => d[colorBy]))];

  groups.forEach(grp => {
    const subset = data.filter(d => d[colorBy] === grp);
    traces.push({
      x: subset.map(d => d.pc1),
      y: subset.map(d => d.pc2),
      mode: 'markers',
      name: grp,
      text: subset.map(d => `<b>${d.nama_resmi}</b> (${d.provinsi})<br>PC1: ${d.pc1}<br>PC2: ${d.pc2}<br>Parlemen: ${d.parlemen}%<br>Pendapatan: ${d.pendapatan}%`),
      hoverinfo: 'text',
      marker: { size: 7, opacity: 0.75 }
    });
  });

  // Add annotations for loading vectors
  const annotations = [];
  meta.loadings.forEach(l => {
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
    title: { text: `<b>PCA Biplot: 8 Indikator Gender (PC1: ${meta.var_exp_pc1}%, PC2: ${meta.var_exp_pc2}%)</b>`, font: { size: 13.5 } },
    xaxis: { title: `Komponen Utama 1 (${meta.var_exp_pc1}% Variansi: Kapasitas Sosial & Hidup Layak)`, zeroline: true, gridcolor: '#f1f5f9' },
    yaxis: { title: `Komponen Utama 2 (${meta.var_exp_pc2}% Variansi: Partisipasi Politik vs Kerja Fisik)`, zeroline: true, gridcolor: '#f1f5f9' },
    annotations: annotations,
    legend: { orientation: 'h', y: -0.16, x: 0.5, xanchor: 'center' },
    margin: { l: 50, r: 20, t: 50, b: 60 },
    height: 540,
    paper_bgcolor: 'transparent',
    plot_bgcolor: 'transparent'
  };

  Plotly.react(containerId, traces, layout, { responsive: true, displayModeBar: false });
}

/**
 * 6. MULTIVARIATE: Parallel Coordinates Plot
 */
function renderParallelCoordinates(data, containerId = 'parallel-coords-chart') {
  if (!data) return;

  const trace = {
    type: 'parcoords',
    line: {
      color: data.map(d => d.skor_keputusan),
      colorscale: 'Viridis',
      showscale: true,
      colorbar: { title: 'Skor Keputusan' }
    },
    dimensions: [
      { range: [0, 50], label: 'Parlemen (%)', values: data.map(d => d.parlemen) },
      { range: [10, 65], label: 'Pendapatan (%)', values: data.map(d => d.pendapatan) },
      { range: [4000, 20000], label: 'Pengeluaran', values: data.map(d => d.pengeluaran) },
      { range: [55, 80], label: 'AHH (Thn)', values: data.map(d => d.ahh) },
      { range: [0, 100], label: 'Profesional (%)', values: data.map(d => d.profesional) },
      { range: [30, 95], label: 'TPAK (%)', values: data.map(d => d.tpak) },
      { range: [2, 13], label: 'RLS (Thn)', values: data.map(d => d.rls) },
      { range: [4, 16], label: 'HLS (Thn)', values: data.map(d => d.hls) }
    ]
  };

  const layout = {
    title: { text: '<b>Diagram Koordinat Paralel (Brushing & Filtering 8 Peubah)</b>', font: { size: 13.5 } },
    margin: { l: 60, r: 40, t: 60, b: 30 },
    height: 500,
    paper_bgcolor: 'transparent'
  };

  Plotly.react(containerId, [trace], layout, { responsive: true, displayModeBar: false });
}

/**
 * 7. MULTIVARIATE: Clustered Correlation Heatmap
 */
function renderClusteredHeatmap(corrData, containerId = 'heatmap-chart') {
  if (!corrData) return;

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
    margin: { l: 120, r: 20, t: 50, b: 120 },
    height: 500,
    paper_bgcolor: 'transparent'
  };

  Plotly.react(containerId, [trace], layout, { responsive: true, displayModeBar: false });
}

/**
 * 8. MULTIVARIATE: Radar Profile Chart
 */
function renderRadarChart(data, groupBy = 'pulau', selectedGroups = ['Jawa', 'Sulawesi', 'Papua'], containerId = 'radar-chart') {
  if (!data) return;

  const vars = ['parlemen', 'pendapatan', 'profesional', 'tpak', 'rls', 'hls', 'ahh', 'pengeluaran'];
  const labels = ['Parlemen', 'Pendapatan', 'Profesional', 'TPAK', 'RLS', 'HLS', 'AHH', 'Pengeluaran'];

  // MinMax normalize
  const mins = {};
  const maxs = {};
  vars.forEach(v => {
    mins[v] = Math.min(...data.map(d => d[v]));
    maxs[v] = Math.max(...data.map(d => d[v]));
  });

  const traces = [];
  selectedGroups.forEach(grp => {
    const subset = data.filter(d => d[groupBy] === grp);
    if (subset.length === 0) return;

    const avgVals = vars.map(v => {
      const avg = subset.reduce((acc, d) => acc + d[v], 0) / subset.length;
      return ((avg - mins[v]) / (maxs[v] - mins[v])) * 100;
    });
    avgVals.push(avgVals[0]); // Close polygon

    traces.push({
      type: 'scatterpolar',
      r: avgVals,
      theta: [...labels, labels[0]],
      fill: 'toself',
      name: grp,
      opacity: 0.6
    });
  });

  const layout = {
    title: { text: '<b>Radar Chart: Perbandingan Profil Multidimensi Antar Wilayah</b>', font: { size: 13.5 } },
    polar: {
      radialaxis: { visible: true, range: [0, 100] }
    },
    margin: { l: 40, r: 40, t: 50, b: 40 },
    height: 480,
    paper_bgcolor: 'transparent'
  };

  Plotly.react(containerId, traces, layout, { responsive: true, displayModeBar: false });
}

/**
 * 9. HIERARCHICAL: Interactive Treemap
 */
function renderTreemap(data, sizeVar = 'pengeluaran', colorVar = 'parlemen', containerId = 'treemap-chart') {
  if (!data) return;

  const trace = {
    type: 'treemap',
    labels: data.map(d => d.nama_resmi),
    parents: data.map(d => d.provinsi),
    values: data.map(d => d[sizeVar]),
    text: data.map(d => `${d.nama_resmi}<br>Prov: ${d.provinsi}<br>${colorVar}: ${d[colorVar]}`),
    hoverinfo: 'text',
    marker: {
      colors: data.map(d => d[colorVar]),
      colorscale: 'Viridis',
      showscale: true,
      colorbar: { title: colorVar.toUpperCase() }
    }
  };

  // Add intermediate nodes for Pulau and Provinsi
  const pulauSet = [...new Set(data.map(d => d.pulau))];
  const provSet = [...new Set(data.map(d => JSON.stringify({ prov: d.provinsi, pulau: d.pulau })))].map(s => JSON.parse(s));

  pulauSet.forEach(pulau => {
    trace.labels.push(pulau);
    trace.parents.push('Indonesia');
    trace.values.push(0);
  });

  provSet.forEach(p => {
    trace.labels.push(p.prov);
    trace.parents.push(p.pulau);
    trace.values.push(0);
  });

  trace.labels.push('Indonesia');
  trace.parents.push('');
  trace.values.push(0);

  const layout = {
    title: { text: `<b>Interactive Treemap: Ukuran = ${sizeVar.toUpperCase()} | Warna = ${colorVar.toUpperCase()}</b>`, font: { size: 13.5 } },
    margin: { l: 10, r: 10, t: 40, b: 10 },
    height: 560,
    paper_bgcolor: 'transparent'
  };

  Plotly.react(containerId, [trace], layout, { responsive: true, displayModeBar: false });
}

/**
 * 10. HIERARCHICAL: Interactive Sunburst
 */
function renderSunburst(data, sizeVar = 'pengeluaran', colorVar = 'skor_keputusan', containerId = 'sunburst-chart') {
  if (!data) return;

  const trace = {
    type: 'sunburst',
    labels: data.map(d => d.nama_resmi),
    parents: data.map(d => d.provinsi),
    values: data.map(d => d[sizeVar]),
    text: data.map(d => `${d.nama_resmi}<br>${colorVar}: ${d[colorVar]}`),
    hoverinfo: 'text',
    marker: {
      colors: data.map(d => d[colorVar]),
      colorscale: 'Viridis',
      showscale: true,
      colorbar: { title: colorVar.toUpperCase() }
    }
  };

  const pulauSet = [...new Set(data.map(d => d.pulau))];
  const provSet = [...new Set(data.map(d => JSON.stringify({ prov: d.provinsi, pulau: d.pulau })))].map(s => JSON.parse(s));

  pulauSet.forEach(pulau => {
    trace.labels.push(pulau);
    trace.parents.push('');
    trace.values.push(0);
  });

  provSet.forEach(p => {
    trace.labels.push(p.prov);
    trace.parents.push(p.pulau);
    trace.values.push(0);
  });

  const layout = {
    title: { text: `<b>Interactive Sunburst Chart: Ukuran = ${sizeVar.toUpperCase()} | Warna = ${colorVar.toUpperCase()}</b>`, font: { size: 13.5 } },
    margin: { l: 10, r: 10, t: 40, b: 10 },
    height: 580,
    paper_bgcolor: 'transparent'
  };

  Plotly.react(containerId, [trace], layout, { responsive: true, displayModeBar: false });
}
