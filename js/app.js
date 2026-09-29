/**
 * ==========================================================================
 * Application Logic & State Controller (app.js)
 * Manages data fetching, global filtering, and UI orchestration
 * ==========================================================================
 */

let allKabkota = [];
let allProvinsi = [];
let nasionalStats = {};
let pcaMeta = {};
let corrData = {};
let geojsonData = null;

let filteredKabkota = [];
let activeTab = 'tab-overview';
let activeGeoSubtab = 'geo-subtab-proportional';
let activeMultiSubtab = 'multi-subtab-pca';
let activeHierSubtab = 'hier-subtab-treemap';

// Table pagination state
let currentPage = 1;
const rowsPerPage = 15;
let sortCol = 'ikpp_komposit';
let sortAsc = false;
let tableSearchQuery = '';

document.addEventListener('DOMContentLoaded', async () => {
  setupTabEvents();
  setupFilterEvents();
  await loadAllData();
});

/**
 * Load all JSON datasets concurrently
 */
async function loadAllData() {
  try {
    const [resKab, resProv, resNas, resPca, resCorr, resGeo] = await Promise.all([
      fetch('data/kabkota_514.json').then(r => r.json()),
      fetch('data/provinsi_38.json').then(r => r.json()),
      fetch('data/nasional.json').then(r => r.json()),
      fetch('data/pca_meta.json').then(r => r.json()),
      fetch('data/correlation_matrix.json').then(r => r.json()),
      fetch('data/provinsi.geojson').then(r => r.json()).catch(() => null)
    ]);

    allKabkota = resKab;
    allProvinsi = resProv;
    nasionalStats = resNas;
    pcaMeta = resPca;
    corrData = resCorr;
    geojsonData = resGeo;

    filteredKabkota = [...allKabkota];

    populateFilterOptions();
    renderKPICards();
    updateSidebarStats();
    renderActiveView();
    renderDataTable();

    console.log("All data successfully initialized:", allKabkota.length, "Kab/Kota loaded.");
  } catch (err) {
    console.error("Error loading datasets:", err);
    alert("Gagal memuat dataset JSON. Pastikan aplikasi dijalankan melalui web server lokal atau Vercel.");
  }
}

/**
 * Populate Sidebar Options
 */
function populateFilterOptions() {
  const pulauSelect = document.getElementById('filter-pulau');
  const provSelect = document.getElementById('filter-provinsi');

  const islands = ['Semua Pulau', ...new Set(allKabkota.map(d => d.pulau))];
  pulauSelect.innerHTML = islands.map(p => `<option value="${p}">${p}</option>`).join('');

  updateProvinceOptions();
}

function updateProvinceOptions() {
  const selectedPulau = document.getElementById('filter-pulau').value;
  const provSelect = document.getElementById('filter-provinsi');

  let provs = allKabkota;
  if (selectedPulau && selectedPulau !== 'Semua Pulau') {
    provs = provs.filter(d => d.pulau === selectedPulau);
  }

  const provList = ['Semua Provinsi', ...new Set(provs.map(d => d.provinsi))].sort();
  provSelect.innerHTML = provList.map(p => `<option value="${p}">${p}</option>`).join('');
}

/**
 * Filter Events & State Controller
 */
function setupFilterEvents() {
  document.getElementById('filter-pulau').addEventListener('change', () => {
    updateProvinceOptions();
    applyFilters();
  });

  document.getElementById('filter-provinsi').addEventListener('change', applyFilters);

  document.querySelectorAll('input[name="filter-tipe"]').forEach(r => {
    r.addEventListener('change', applyFilters);
  });

  document.getElementById('filter-kuadran').addEventListener('change', applyFilters);
  document.getElementById('filter-palette').addEventListener('change', applyFilters);

  document.getElementById('btn-reset-filters').addEventListener('click', () => {
    document.getElementById('filter-pulau').value = 'Semua Pulau';
    updateProvinceOptions();
    document.getElementById('filter-provinsi').value = 'Semua Provinsi';
    document.querySelector('input[name="filter-tipe"][value="Semua"]').checked = true;
    document.getElementById('filter-kuadran').value = 'Semua Kuadran';
    document.getElementById('filter-palette').value = 'Viridis';
    applyFilters();
  });

  // Table controls
  document.getElementById('table-search').addEventListener('input', (e) => {
    tableSearchQuery = e.target.value.toLowerCase();
    currentPage = 1;
    renderDataTable();
  });

  document.getElementById('btn-download-csv').addEventListener('click', downloadCSV);

  // Dynamic Chart Controls
  document.getElementById('geo-size-var')?.addEventListener('change', renderGeoTab);
  document.getElementById('geo-color-var')?.addEventListener('change', renderGeoTab);
  document.getElementById('choropleth-var')?.addEventListener('change', renderGeoTab);
  document.getElementById('lisa-cluster-var')?.addEventListener('change', renderGeoTab);

  document.getElementById('pca-color-by')?.addEventListener('change', () => {
    const colorBy = document.getElementById('pca-color-by').value;
    renderPCABiplot(filteredKabkota, pcaMeta, colorBy);
  });

  document.getElementById('hier-size-var')?.addEventListener('change', renderHierarchicalTab);
  document.getElementById('hier-color-var')?.addEventListener('change', renderHierarchicalTab);
}

function applyFilters() {
  const selectedPulau = document.getElementById('filter-pulau').value;
  const selectedProv = document.getElementById('filter-provinsi').value;
  const selectedTipe = document.querySelector('input[name="filter-tipe"]:checked').value;
  const selectedKuadran = document.getElementById('filter-kuadran').value;

  filteredKabkota = allKabkota.filter(d => {
    if (selectedPulau !== 'Semua Pulau' && d.pulau !== selectedPulau) return false;
    if (selectedProv !== 'Semua Provinsi' && d.provinsi !== selectedProv) return false;
    if (selectedTipe !== 'Semua' && d.tipe !== selectedTipe) return false;
    if (selectedKuadran !== 'Semua Kuadran' && d.kuadran !== selectedKuadran) return false;
    return true;
  });

  currentPage = 1;
  updateSidebarStats();
  renderActiveView();
  renderDataTable();
}

function updateSidebarStats() {
  document.getElementById('stat-total-kab').textContent = `${filteredKabkota.length} dari 514`;
  const provCount = new Set(filteredKabkota.map(d => d.provinsi)).size;
  document.getElementById('stat-total-prov').textContent = `${provCount} dari 38`;
}

/**
 * Setup Tabs and Subtabs
 */
function setupTabEvents() {
  // Main Tabs
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));

      btn.classList.add('active');
      activeTab = btn.getAttribute('data-tab');
      document.getElementById(activeTab).classList.add('active');

      renderActiveView();
    });
  });

  // Geospatial Subtabs
  document.querySelectorAll('#tab-geospatial .subtab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('#tab-geospatial .subtab-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('#tab-geospatial .subtab-content').forEach(c => c.classList.remove('active'));

      btn.classList.add('active');
      activeGeoSubtab = btn.getAttribute('data-subtab');
      document.getElementById(activeGeoSubtab).classList.add('active');

      renderGeoTab();
    });
  });

  // Multivariate Subtabs
  document.querySelectorAll('#tab-multivariate .subtab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('#tab-multivariate .subtab-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('#tab-multivariate .subtab-content').forEach(c => c.classList.remove('active'));

      btn.classList.add('active');
      activeMultiSubtab = btn.getAttribute('data-subtab');
      document.getElementById(activeMultiSubtab).classList.add('active');

      renderMultiTab();
    });
  });

  // Hierarchical Subtabs
  document.querySelectorAll('#tab-hierarchical .subtab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('#tab-hierarchical .subtab-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('#tab-hierarchical .subtab-content').forEach(c => c.classList.remove('active'));

      btn.classList.add('active');
      activeHierSubtab = btn.getAttribute('data-subtab');
      document.getElementById(activeHierSubtab).classList.add('active');

      renderHierarchicalTab();
    });
  });
}

/**
 * Render Active View based on selected tab
 */
function renderActiveView() {
  if (activeTab === 'tab-overview') {
    renderQuadrantScatter(filteredKabkota);
  } else if (activeTab === 'tab-geospatial') {
    renderGeoTab();
  } else if (activeTab === 'tab-multivariate') {
    renderMultiTab();
  } else if (activeTab === 'tab-hierarchical') {
    renderHierarchicalTab();
  }
}

function renderGeoTab() {
  const palette = document.getElementById('filter-palette').value;
  setTimeout(() => {
    if (activeGeoSubtab === 'geo-subtab-proportional') {
      const sizeVar = document.getElementById('geo-size-var').value;
      const colorVar = document.getElementById('geo-color-var').value;
      renderProportionalSymbolMap(filteredKabkota, sizeVar, colorVar, palette);
      if (leafletMapInstance) leafletMapInstance.invalidateSize();
    } else if (activeGeoSubtab === 'geo-subtab-choropleth') {
      const choroVar = document.getElementById('choropleth-var').value;
      renderChoroplethMap(allProvinsi, geojsonData, choroVar, palette);
      if (choroplethMapInstance) choroplethMapInstance.invalidateSize();
    } else if (activeGeoSubtab === 'geo-subtab-lisa') {
      const clusterVar = document.getElementById('lisa-cluster-var').value;
      renderLISASpatialMap(filteredKabkota, clusterVar);
      if (lisaMapInstance) lisaMapInstance.invalidateSize();
    }
  }, 100);
}

function renderMultiTab() {
  if (activeMultiSubtab === 'multi-subtab-pca') {
    const colorBy = document.getElementById('pca-color-by').value;
    renderPCABiplot(filteredKabkota, pcaMeta, colorBy);
  } else if (activeMultiSubtab === 'multi-subtab-parcoords') {
    renderParallelCoordinates(filteredKabkota);
  } else if (activeMultiSubtab === 'multi-subtab-heatmap') {
    renderClusteredHeatmap(corrData);
  } else if (activeMultiSubtab === 'multi-subtab-radar') {
    renderRadarChart(allKabkota, 'pulau', ['Jawa', 'Sulawesi', 'Papua']);
  }
}

function renderHierarchicalTab() {
  const sizeVar = document.getElementById('hier-size-var').value;
  const colorVar = document.getElementById('hier-color-var').value;
  if (activeHierSubtab === 'hier-subtab-treemap') {
    renderTreemap(filteredKabkota, sizeVar, colorVar);
  } else if (activeHierSubtab === 'hier-subtab-sunburst') {
    renderSunburst(filteredKabkota, sizeVar, colorVar);
  } else if (activeHierSubtab === 'hier-subtab-summary') {
    renderHierarchicalSummaryTable();
  }
}

function renderHierarchicalSummaryTable() {
  const container = document.getElementById('hier-summary-table-body');
  if (!container) return;

  const islandAgg = {};
  filteredKabkota.forEach(d => {
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

  const rows = Object.entries(islandAgg).map(([pulau, agg]) => `
    <tr>
      <td><b>${pulau}</b></td>
      <td>${agg.count}</td>
      <td>${(agg.parlemen / agg.count).toFixed(2)}%</td>
      <td>${(agg.pendapatan / agg.count).toFixed(2)}%</td>
      <td>${(agg.profesional / agg.count).toFixed(2)}%</td>
      <td>${(agg.tpak / agg.count).toFixed(2)}%</td>
      <td>Rp${Math.round(agg.pengeluaran / agg.count).toLocaleString()}</td>
      <td><span style="font-weight: 700; color: #2563eb;">${(agg.keputusan / agg.count).toFixed(1)}</span></td>
      <td><span style="font-weight: 700; color: #10b981;">${(agg.ekonomi / agg.count).toFixed(1)}</span></td>
      <td><span style="font-weight: 700; color: #6366f1;">${(agg.ikpp / agg.count).toFixed(1)}</span></td>
    </tr>
  `).join('');

  container.innerHTML = rows;
}

/**
 * Render Top KPI Cards
 */
function renderKPICards() {
  if (filteredKabkota.length === 0) return;

  const avgParlemen = filteredKabkota.reduce((acc, d) => acc + d.parlemen, 0) / filteredKabkota.length;
  const avgPendapatan = filteredKabkota.reduce((acc, d) => acc + d.pendapatan, 0) / filteredKabkota.length;
  const avgProfesional = filteredKabkota.reduce((acc, d) => acc + d.profesional, 0) / filteredKabkota.length;
  const avgTPAK = filteredKabkota.reduce((acc, d) => acc + d.tpak, 0) / filteredKabkota.length;

  document.getElementById('kpi-parlemen').textContent = `${avgParlemen.toFixed(2)}%`;
  document.getElementById('kpi-pendapatan').textContent = `${avgPendapatan.toFixed(2)}%`;
  document.getElementById('kpi-profesional').textContent = `${avgProfesional.toFixed(2)}%`;
  document.getElementById('kpi-tpak').textContent = `${avgTPAK.toFixed(2)}%`;

  const deltaParlemen = avgParlemen - 30.0;
  const deltaElem = document.getElementById('delta-parlemen');
  deltaElem.textContent = `${deltaParlemen.toFixed(1)}% vs Kuota 30%`;
  deltaElem.className = `kpi-delta ${deltaParlemen >= 0 ? 'pos' : 'neg'}`;
}

/**
 * Render Data Table with Search, Sort, and Pagination
 */
function renderDataTable() {
  const tbody = document.getElementById('data-table-body');
  if (!tbody) return;

  let records = [...filteredKabkota];

  // Search filter
  if (tableSearchQuery) {
    records = records.filter(d => 
      d.nama_resmi.toLowerCase().includes(tableSearchQuery) ||
      d.provinsi.toLowerCase().includes(tableSearchQuery) ||
      d.pulau.toLowerCase().includes(tableSearchQuery)
    );
  }

  // Sort
  records.sort((a, b) => {
    let valA = a[sortCol];
    let valB = b[sortCol];
    if (typeof valA === 'string') {
      return sortAsc ? valA.localeCompare(valB) : valB.localeCompare(valA);
    }
    return sortAsc ? valA - valB : valB - valA;
  });

  // Pagination
  const totalRows = records.length;
  const totalPages = Math.ceil(totalRows / rowsPerPage) || 1;
  currentPage = Math.min(currentPage, totalPages);

  const start = (currentPage - 1) * rowsPerPage;
  const pageRows = records.slice(start, start + rowsPerPage);

  tbody.innerHTML = pageRows.map(d => `
    <tr>
      <td>${d.kode_wilayah}</td>
      <td><b>${d.nama_resmi}</b></td>
      <td>${d.tipe}</td>
      <td>${d.provinsi}</td>
      <td>${d.pulau}</td>
      <td>${Number(d.parlemen).toFixed(2)}%</td>
      <td>${Number(d.pendapatan).toFixed(2)}%</td>
      <td>${Number(d.profesional).toFixed(2)}%</td>
      <td>${Number(d.tpak).toFixed(2)}%</td>
      <td>Rp${Number(d.pengeluaran).toLocaleString()}</td>
      <td><b>${Number(d.skor_keputusan).toFixed(1)}</b></td>
      <td><b>${Number(d.skor_ekonomi).toFixed(1)}</b></td>
      <td><span style="font-weight: 700; color: #2563eb;">${Number(d.ikpp_komposit).toFixed(1)}</span></td>
      <td><span style="font-size: 11px; padding: 2px 6px; background: #f1f5f9; border-radius: 4px;">${d.kuadran.split(' ')[0]} ${d.kuadran.split(' ')[1]}</span></td>
    </tr>
  `).join('');

  document.getElementById('table-info').textContent = `Menampilkan ${totalRows === 0 ? 0 : start + 1} - ${Math.min(start + rowsPerPage, totalRows)} dari ${totalRows} daerah`;

  // Render pagination buttons
  const btnContainer = document.getElementById('pagination-buttons');
  btnContainer.innerHTML = `
    <button class="page-btn" ${currentPage === 1 ? 'disabled' : ''} onclick="changePage(${currentPage - 1})"><i class="fa-solid fa-chevron-left"></i></button>
    <span style="padding: 4px 8px; font-weight: 600;">Hal ${currentPage} / ${totalPages}</span>
    <button class="page-btn" ${currentPage === totalPages ? 'disabled' : ''} onclick="changePage(${currentPage + 1})"><i class="fa-solid fa-chevron-right"></i></button>
  `;
}

function changePage(page) {
  currentPage = page;
  renderDataTable();
}

function handleSort(col) {
  if (sortCol === col) {
    sortAsc = !sortAsc;
  } else {
    sortCol = col;
    sortAsc = false;
  }
  renderDataTable();
}

/**
 * Download CSV of currently filtered dataset
 */
function downloadCSV() {
  if (filteredKabkota.length === 0) return;

  const cols = ['kode_wilayah', 'nama_resmi', 'tipe', 'provinsi', 'pulau', 'parlemen', 'pendapatan', 'profesional', 'tpak', 'pengeluaran', 'ahh', 'rls', 'hls', 'skor_keputusan', 'skor_ekonomi', 'ikpp_komposit', 'kuadran'];
  
  let csvContent = 'data:text/csv;charset=utf-8,';
  csvContent += cols.join(',') + '\r\n';

  filteredKabkota.forEach(row => {
    const values = cols.map(c => {
      let val = row[c];
      if (typeof val === 'string' && val.includes(',')) return `"${val}"`;
      return val;
    });
    csvContent += values.join(',') + '\r\n';
  });

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', 'disparitas_perempuan_514_kabkota_2024.csv');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
