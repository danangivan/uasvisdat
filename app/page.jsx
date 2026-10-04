"use client";

import { useState, useEffect, useRef } from "react";

// ============================================================================
// BPS Official Statistical Tables (Tahun 2024)
// Sumber sah: Badan Pusat Statistik Republik Indonesia
// ============================================================================
const BPS_STAT_TABLES = {
  pengeluaran: {
    nama: "[Metode Baru] Pengeluaran per Kapita Disesuaikan",
    tahun: "2024",
    url: "https://www.bps.go.id/id/statistics-table/2/NDE2IzI=/-metode-baru--pengeluaran-per-kapita-disesuaikan.html",
  },
  ahh: {
    nama: "Angka Harapan Hidup (AHH) Menurut Kabupaten/Kota dan Jenis Kelamin",
    tahun: "2024",
    url: "https://www.bps.go.id/id/statistics-table/2/NDU1IzI=/angkaharapan-hidup--ahh--menurut-kabupaten-kota-dan-jenis-kelamin.html",
  },
  hls: {
    nama: "[Metode Baru] Harapan Lama Sekolah",
    tahun: "2024",
    url: "https://www.bps.go.id/id/statistics-table/2/NDE3IzI=/-new-method--expected-years-of-schooling.html",
  },
  rls: {
    nama: "[Metode Baru] Rata-rata Lama Sekolah",
    tahun: "2024",
    url: "https://www.bps.go.id/id/statistics-table/2/NDE1IzI=/-metode-baru--rata-rata-lama-sekolah.html",
  },
  tpak: {
    nama: "Tingkat Partisipasi Angkatan Kerja Menurut Jenis Kelamin",
    tahun: "2024",
    url: "https://www.bps.go.id/id/statistics-table/2/MjIwMCMy/tingkat-partisipasi-angkatan-kerja-menurut-jenis-kelamin.html",
  },
  pendapatan: {
    nama: "Sumbangan Pendapatan Perempuan",
    tahun: "2024",
    url: "https://www.bps.go.id/id/statistics-table/2/NDY3IzI=/revenue-contribution-of-women.html",
  },
  parlemen: {
    nama: "Keterlibatan Perempuan di Parlemen",
    tahun: "2024",
    url: "https://www.bps.go.id/id/statistics-table/2/NDY0IzI=/the-involvement-of-women-in-parliament.html",
  },
  profesional: {
    nama: "Tenaga Profesional Perempuan",
    tahun: "2024",
    url: "https://www.bps.go.id/id/statistics-table/2/NDY1IzI=/the-percentage-of-female-professional-staff.html",
  },
};

const COMPOSITE_TO_BPS_KEYS = {
  skor_keputusan: ["parlemen", "profesional"],
  skor_ekonomi: ["pendapatan", "tpak", "pengeluaran"],
  ikpp_komposit: [
    "parlemen",
    "profesional",
    "pendapatan",
    "tpak",
    "pengeluaran",
  ],
  kuadran: ["pendapatan", "tpak", "pengeluaran", "parlemen", "profesional"],
  lisa_cluster_keputusan: ["parlemen", "profesional"],
  lisa_cluster_ekonomi: ["pendapatan", "tpak", "pengeluaran"],
};

function DataSourceBadge({ vars = [] }) {
  const resolvedKeys = new Set();
  vars.forEach((v) => {
    if (COMPOSITE_TO_BPS_KEYS[v]) {
      COMPOSITE_TO_BPS_KEYS[v].forEach((k) => resolvedKeys.add(k));
    } else if (BPS_STAT_TABLES[v]) {
      resolvedKeys.add(v);
    }
  });

  const keys = Array.from(resolvedKeys);
  if (keys.length === 0) return null;

  return (
    <div className="data-source-footer">
      <div className="data-source-label">
        <span>Sumber Tabel BPS (Tahun 2024):</span>
      </div>
      <div className="data-source-items">
        {keys.map((k) => {
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
            </a>
          );
        })}
      </div>
    </div>
  );
}

// ============================================================================
// Palet Warna & Spektrum Kontras Resmi BPS / Colorblind-Safe
// ============================================================================
const PALETTES = {
  Viridis: [
    "#440154",
    "#482878",
    "#3e4989",
    "#31688e",
    "#26828e",
    "#1f9e89",
    "#35b779",
    "#6ece58",
    "#b5de2b",
    "#fde725",
  ],
  Cividis: [
    "#00204d",
    "#002c69",
    "#003986",
    "#26456e",
    "#41525a",
    "#5b6049",
    "#797037",
    "#998122",
    "#bc930a",
    "#e1a700",
    "#ffd321",
  ],
  Plasma: [
    "#0d0887",
    "#46039f",
    "#7201a8",
    "#9c179e",
    "#bd3786",
    "#d8576b",
    "#ed7953",
    "#fb9f3a",
    "#fdca26",
    "#f0f921",
  ],
  Turbo: [
    "#30123b",
    "#4145ab",
    "#4675ed",
    "#39a2fc",
    "#1bcfd4",
    "#24eca6",
    "#61fc6c",
    "#a4fc3b",
    "#d1e834",
    "#f3c63a",
    "#fe9b2d",
    "#f36315",
    "#d93806",
    "#b11902",
    "#7a0403",
  ],
};

const PALETTE_GRADIENTS = {
  Viridis:
    "linear-gradient(to right, #440154, #482878, #3e4989, #31688e, #26828e, #1f9e89, #35b779, #6ece58, #b5de2b, #fde725)",
  Plasma:
    "linear-gradient(to right, #0d0887, #46039f, #7201a8, #9c179e, #bd3786, #d8576b, #ed7953, #fb9f3a, #fdca26, #f0f921)",
  Cividis:
    "linear-gradient(to right, #00204d, #002c69, #003986, #26456e, #41525a, #5b6049, #797037, #998122, #bc930a, #e1a700, #ffd321)",
  Turbo:
    "linear-gradient(to right, #30123b, #4145ab, #4675ed, #39a2fc, #1bcfd4, #24eca6, #61fc6c, #a4fc3b, #d1e834, #f3c63a, #fe9b2d, #f36315, #d93806, #b11902, #7a0403)",
  Heatmap:
    "linear-gradient(to right, #3b82f6, #06b6d4, #10b981, #f59e0b, #ef4444)",
  Correlation:
    "linear-gradient(to right, #2563eb, #93c5fd, #ffffff, #fca5a5, #dc2626)",
};

// ============================================================================
// Format & Statistik Helpers
// ============================================================================
function getVarLabel(varName) {
  if (!varName) return "";
  const map = {
    parlemen: "Keterwakilan di Parlemen",
    profesional: "Tenaga Profesional Perempuan",
    pendapatan: "Sumbangan Pendapatan Perempuan",
    tpak: "Tingkat Partisipasi Angkatan Kerja (TPAK)",
    pengeluaran: "Pengeluaran per Kapita Disesuaikan",
    ahh: "Angka Harapan Hidup (AHH)",
    hls: "Harapan Lama Sekolah (HLS)",
    rls: "Rata-rata Lama Sekolah (RLS)",
    skor_keputusan: "Skor Pengambilan Keputusan",
    skor_ekonomi: "Skor Partisipasi Ekonomi",
    ikpp_komposit: "Indeks Komposit IKPP",
    kuadran: "Tipologi 4 Kuadran",
    lisa_cluster_keputusan: "Klaster LISA Keputusan",
    lisa_cluster_ekonomi: "Klaster LISA Ekonomi",
  };
  return map[varName] || varName.toUpperCase();
}

function formatStatValue(val, varName = "") {
  if (val === undefined || val === null || isNaN(val)) return "-";
  const num = Number(val);
  const v = String(varName).toLowerCase();
  if (v.includes("pengeluaran")) {
    return `Rp ${Math.round(num).toLocaleString("id-ID")}`;
  }
  if (v === "ahh" || v === "rls" || v === "hls") {
    return `${num.toFixed(2)} Thn`;
  }
  if (v.includes("skor") || v.includes("ikpp")) {
    return num.toFixed(1);
  }
  if (
    ["parlemen", "profesional", "pendapatan", "tpak"].includes(v) ||
    v.includes("pct") ||
    v.includes("persen")
  ) {
    return `${num.toFixed(1)}%`;
  }
  return num % 1 === 0 ? num.toLocaleString("id-ID") : num.toFixed(1);
}

function getVariableStats(dataList = [], varName) {
  if (!dataList || !dataList.length || !varName) {
    return { min: 0, max: 100, avg: 50, median: 50, count: 0, total: 0 };
  }
  const vals = dataList
    .map((d) => d && d[varName])
    .filter((v) => v !== undefined && v !== null && !isNaN(Number(v)))
    .map(Number);

  if (vals.length === 0) {
    return {
      min: 0,
      max: 100,
      avg: 50,
      median: 50,
      count: 0,
      total: dataList.length,
    };
  }

  vals.sort((a, b) => a - b);
  const min = vals[0];
  const max = vals[vals.length - 1];
  const sum = vals.reduce((a, b) => a + b, 0);
  const avg = +(sum / vals.length).toFixed(2);
  const mid = Math.floor(vals.length / 2);
  const median = +(
    vals.length % 2 !== 0 ? vals[mid] : (vals[mid - 1] + vals[mid]) / 2
  ).toFixed(2);

  return {
    min,
    max,
    avg,
    median,
    count: vals.length,
    total: dataList.length,
  };
}

// Controller Floating Legenda pada Kanvas Leaflet
function updateMapLegendControl(mapInstance, htmlContent) {
  if (typeof window === "undefined" || !mapInstance || !window.L) return;
  if (!mapInstance._legendControl) {
    const legendCtrl = window.L.control({ position: "bottomright" });
    legendCtrl.onAdd = function () {
      const div = window.L.DomUtil.create("div", "leaflet-map-legend-card");
      window.L.DomEvent.disableClickPropagation(div);
      window.L.DomEvent.disableScrollPropagation(div);
      div.innerHTML = htmlContent;
      return div;
    };
    legendCtrl.addTo(mapInstance);
    mapInstance._legendControl = legendCtrl;
  } else {
    const container = mapInstance._legendControl.getContainer();
    if (container) {
      container.innerHTML = htmlContent;
    }
  }
}

// Komponen Bar Kontras Warna Reusable (Min - Avg/Med - Max)
function VizLegendContrastBar({
  title,
  varName = "",
  min = 0,
  mid,
  max = 100,
  avg = 50,
  paletteName = "Viridis",
  customGradient,
  scopeBadge,
  minLabel = "Min (Terendah)",
  midLabel = "Rata-rata",
  maxLabel = "Max (Tertinggi)",
}) {
  const grad =
    customGradient ||
    PALETTE_GRADIENTS[paletteName] ||
    PALETTE_GRADIENTS.Viridis;
  const displayTitle = title || getVarLabel(varName);

  return (
    <div className="viz-legend-contrast-card">
      <div className="viz-legend-contrast-header">
        <div className="viz-legend-contrast-title">
          <i className="fa-solid fa-palette" style={{ color: "#1F5FCC" }}></i>
          <span>{displayTitle}</span>
        </div>
        {scopeBadge && (
          <span className="viz-legend-contrast-badge">{scopeBadge}</span>
        )}
      </div>

      <div className="viz-legend-ramp-container">
        <div className="viz-legend-ramp-bar" style={{ background: grad }}></div>
        <div className="viz-legend-ramp-ticks">
          <div className="viz-legend-tick">
            <span className="viz-legend-tick-value">
              {formatStatValue(min, varName)}
            </span>
            <span className="viz-legend-tick-label">{minLabel}</span>
          </div>
          <div className="viz-legend-tick">
            <span className="viz-legend-tick-value">
              {formatStatValue(mid !== undefined ? mid : avg, varName)}
            </span>
            <span className="viz-legend-tick-label">{midLabel}</span>
          </div>
          <div className="viz-legend-tick">
            <span className="viz-legend-tick-value">
              {formatStatValue(max, varName)}
            </span>
            <span className="viz-legend-tick-label">{maxLabel}</span>
          </div>
        </div>
      </div>

      <div className="viz-legend-stats-strip">
        <div className="viz-legend-stat-box">
          <div className="viz-legend-stat-label">Terendah</div>
          <div className="viz-legend-stat-val">
            {formatStatValue(min, varName)}
          </div>
        </div>
        <div className="viz-legend-stat-box">
          <div className="viz-legend-stat-label">{midLabel}</div>
          <div className="viz-legend-stat-val">
            {formatStatValue(mid !== undefined ? mid : avg, varName)}
          </div>
        </div>
        <div className="viz-legend-stat-box">
          <div className="viz-legend-stat-label">Tertinggi</div>
          <div className="viz-legend-stat-val">
            {formatStatValue(max, varName)}
          </div>
        </div>
      </div>
    </div>
  );
}

function VizLegendQuadrant({ filteredKabkota = [] }) {
  const total = filteredKabkota.length || 1;
  const countQ1 = filteredKabkota.filter(
    (d) => d.kuadran && d.kuadran.includes("Kuadran I"),
  ).length;
  const countQ2 = filteredKabkota.filter(
    (d) => d.kuadran && d.kuadran.includes("Kuadran II"),
  ).length;
  const countQ3 = filteredKabkota.filter(
    (d) => d.kuadran && d.kuadran.includes("Kuadran III"),
  ).length;
  const countQ4 = filteredKabkota.filter(
    (d) => d.kuadran && d.kuadran.includes("Kuadran IV"),
  ).length;

  const pctQ1 = ((countQ1 / total) * 100).toFixed(1);
  const pctQ2 = ((countQ2 / total) * 100).toFixed(1);
  const pctQ3 = ((countQ3 / total) * 100).toFixed(1);
  const pctQ4 = ((countQ4 / total) * 100).toFixed(1);

  const statsEkon = getVariableStats(filteredKabkota, "skor_ekonomi");
  const statsKep = getVariableStats(filteredKabkota, "skor_keputusan");

  return (
    <div className="insight-panel-container">
      <div className="panel-header-box">
        <div className="panel-heading">
          <i className="fa-solid fa-shapes" style={{ color: "#1F5FCC" }}></i>
          <span>Tipologi 4 Kuadran</span>
        </div>
        <span className="panel-badge">
          {filteredKabkota.length} Wilayah Aktif
        </span>
      </div>

      {/* Threshold & Bar Kontras Ringkasan Kuadran */}
      <div className="viz-legend-contrast-card" style={{ marginBottom: "12px" }}>
        <div className="viz-legend-contrast-header">
          <div className="viz-legend-contrast-title">
            <i className="fa-solid fa-crosshairs" style={{ color: "#1F5FCC" }}></i>
            <span>Batas Median Kuadran Nasional</span>
          </div>
          <span className="viz-legend-contrast-badge">Threshold</span>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "8px",
            margin: "6px 0 10px 0",
          }}
        >
          <div
            className="viz-legend-stat-box"
            style={{ textAlign: "left", padding: "6px 8px" }}
          >
            <div className="viz-legend-stat-label">
              Sumbu X: Partisipasi Ekonomi
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "baseline",
              }}
            >
              <span className="viz-legend-stat-val">34.50</span>
              <span style={{ fontSize: "10px", color: "#64748B" }}>
                Rentang: {statsEkon.min.toFixed(1)} - {statsEkon.max.toFixed(1)}
              </span>
            </div>
          </div>
          <div
            className="viz-legend-stat-box"
            style={{ textAlign: "left", padding: "6px 8px" }}
          >
            <div className="viz-legend-stat-label">
              Sumbu Y: Pengambilan Keputusan
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "baseline",
              }}
            >
              <span className="viz-legend-stat-val">47.60</span>
              <span style={{ fontSize: "10px", color: "#64748B" }}>
                Rentang: {statsKep.min.toFixed(1)} - {statsKep.max.toFixed(1)}
              </span>
            </div>
          </div>
        </div>
        {/* Visual Bar Distribusi Multi-Warna */}
        <div
          style={{
            width: "100%",
            height: "12px",
            borderRadius: "3px",
            overflow: "hidden",
            display: "flex",
            boxShadow: "inset 0 1px 2px rgba(0,0,0,0.15)",
          }}
        >
          <div
            style={{ width: `${pctQ1}%`, background: "#16a34a" }}
            title={`Kuadran I: ${countQ1} (${pctQ1}%)`}
          ></div>
          <div
            style={{ width: `${pctQ2}%`, background: "#2563eb" }}
            title={`Kuadran II: ${countQ2} (${pctQ2}%)`}
          ></div>
          <div
            style={{ width: `${pctQ4}%`, background: "#d97706" }}
            title={`Kuadran IV: ${countQ4} (${pctQ4}%)`}
          ></div>
          <div
            style={{ width: `${pctQ3}%`, background: "#dc2626" }}
            title={`Kuadran III: ${countQ3} (${pctQ3}%)`}
          ></div>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: "9.5px",
            color: "#64748B",
            marginTop: "5px",
            fontWeight: "700",
          }}
        >
          <span style={{ color: "#16a34a" }}>● Q1: {pctQ1}%</span>
          <span style={{ color: "#2563eb" }}>● Q2: {pctQ2}%</span>
          <span style={{ color: "#d97706" }}>● Q4: {pctQ4}%</span>
          <span style={{ color: "#dc2626" }}>● Q3: {pctQ3}%</span>
        </div>
      </div>

      {/* Kuadran I */}
      <div className="kuadran-card q1">
        <div className="kuadran-card-top">
          <div className="kuadran-card-title">Kuadran I: Maju &amp; Seimbang</div>
          <span className="kuadran-metric-badge">
            {countQ1} Wilayah ({pctQ1}%)
          </span>
        </div>
        <div className="kuadran-card-formula">
          <i className="fa-solid fa-crosshairs" style={{ fontSize: "10px" }}></i>
          <span>Ekonomi ≥ 34.5 &bull; Keputusan ≥ 47.6</span>
        </div>
        <div className="kuadran-card-desc">
          Wilayah ideal di mana partisipasi ekonomi perempuan terkonversi nyata
          menjadi kepemimpinan politik dan jabatan profesional.
        </div>
      </div>

      {/* Kuadran II */}
      <div className="kuadran-card q2">
        <div className="kuadran-card-top">
          <div className="kuadran-card-title">Kuadran II: Representasi Kuat</div>
          <span className="kuadran-metric-badge">
            {countQ2} Wilayah ({pctQ2}%)
          </span>
        </div>
        <div className="kuadran-card-formula">
          <i className="fa-solid fa-crosshairs" style={{ fontSize: "10px" }}></i>
          <span>Ekonomi &lt; 34.5 &bull; Keputusan ≥ 47.6</span>
        </div>
        <div className="kuadran-card-desc">
          Keterwakilan perempuan di legislatif dan ruang publik relatif kuat
          meskipun taraf pendapatan daerah masih terbatas.
        </div>
      </div>

      {/* Kuadran III */}
      <div className="kuadran-card q3">
        <div className="kuadran-card-top">
          <div className="kuadran-card-title">Kuadran III: Tertinggal Ganda</div>
          <span className="kuadran-metric-badge">
            {countQ3} Wilayah ({pctQ3}%)
          </span>
        </div>
        <div className="kuadran-card-formula">
          <i className="fa-solid fa-crosshairs" style={{ fontSize: "10px" }}></i>
          <span>Ekonomi &lt; 34.5 &bull; Keputusan &lt; 47.6</span>
        </div>
        <div className="kuadran-card-desc">
          Mengalami ketertinggalan ganda pada akses ekonomi dan representasi
          politik; merupakan sasaran prioritas afirmasi.
        </div>
      </div>

      {/* Kuadran IV */}
      <div className="kuadran-card q4">
        <div className="kuadran-card-top">
          <div className="kuadran-card-title">Kuadran IV: Pekerja Tanpa Kuasa</div>
          <span className="kuadran-metric-badge">
            {countQ4} Wilayah ({pctQ4}%)
          </span>
        </div>
        <div className="kuadran-card-formula">
          <i className="fa-solid fa-crosshairs" style={{ fontSize: "10px" }}></i>
          <span>Ekonomi ≥ 34.5 &bull; Keputusan &lt; 47.6</span>
        </div>
        <div className="kuadran-card-desc">
          TPAK perempuan tinggi di pasar kerja fisik namun minim representasi
          dalam pengambilan keputusan publik (indikasi <em>sticky floor</em>).
        </div>
      </div>
    </div>
  );
}

function VizLegendBoundaryMap({
  dataset = [],
  isProvinsi,
  varName,
  paletteName = "Viridis",
}) {
  const isCategorical = [
    "kuadran",
    "lisa_cluster_keputusan",
    "lisa_cluster_ekonomi",
  ].includes(varName);

  const stats = !isCategorical ? getVariableStats(dataset, varName) : null;
  const scopeBadge = isProvinsi
    ? "38 Provinsi"
    : `${dataset.length || 514} Kab/Kota`;

  return (
    <div className="viz-legend">
      <div className="viz-legend-header">
        <div className="viz-legend-title">
          <span>Panduan &amp; Legenda Peta Batas Poligon Tematik</span>
        </div>
        <span className="viz-legend-badge">{scopeBadge}</span>
      </div>
      <div className="viz-legend-desc">
        <strong>Tujuan &amp; Fungsi:</strong> Menginspeksi sebaran spasial
        indikator gender BPS 2024 langsung pada poligon yurisdiksi batas
        administratif resmi tanpa distorsi, guna mendeteksi disparitas wilayah
        barat vs timur serta ketimpangan intra-provinsi.
      </div>

      {/* Bar Kontras Skala Gradasi Warna */}
      {!isCategorical && stats ? (
        <VizLegendContrastBar
          title={`Skala Gradasi Warna: ${getVarLabel(varName)}`}
          varName={varName}
          min={stats.min}
          mid={stats.median}
          max={stats.max}
          avg={stats.avg}
          paletteName={paletteName}
          scopeBadge={`Palet ${paletteName}`}
        />
      ) : varName === "kuadran" ? (
        <div className="viz-legend-contrast-card">
          <div className="viz-legend-contrast-header">
            <div className="viz-legend-contrast-title">
              <i className="fa-solid fa-shapes" style={{ color: "#1F5FCC" }}></i>
              <span>Kategori Tipologi Kuadran</span>
            </div>
            <span className="viz-legend-contrast-badge">
              {dataset.length} Wilayah
            </span>
          </div>
          <div
            className="leaflet-map-legend-card"
            style={{
              boxShadow: "none",
              border: "none",
              padding: "4px 0",
              maxWidth: "100%",
            }}
          >
            <div className="leg-cat-list">
              <div className="leg-cat-item">
                <span
                  className="leg-cat-swatch"
                  style={{ background: "#16a34a" }}
                ></span>
                <span>Kuadran I: Maju &amp; Seimbang</span>
              </div>
              <div className="leg-cat-item">
                <span
                  className="leg-cat-swatch"
                  style={{ background: "#2563eb" }}
                ></span>
                <span>Kuadran II: Representasi Kuat</span>
              </div>
              <div className="leg-cat-item">
                <span
                  className="leg-cat-swatch"
                  style={{ background: "#dc2626" }}
                ></span>
                <span>Kuadran III: Tertinggal Ganda</span>
              </div>
              <div className="leg-cat-item">
                <span
                  className="leg-cat-swatch"
                  style={{ background: "#d97706" }}
                ></span>
                <span>Kuadran IV: Pekerja Tanpa Kuasa</span>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      <div className="viz-legend-grid">
        <div className="viz-legend-item">
          <div>
            <div className="viz-legend-item-title">
              Panduan Interaksi Poligon
            </div>
            <div className="viz-legend-item-desc">
              <strong>Sorot (Hover):</strong> Menampilkan label tooltip wilayah,
              nilai indikator, dan tipologi kuadran.
              <br />
              <strong>Klik Poligon:</strong> Memusatkan peta (zoom-in) dan
              membuka panel rincian lengkap 8 indikator gender BPS wilayah
              tersebut di bawah peta.
            </div>
          </div>
        </div>
        <div className="viz-legend-item">
          <div>
            <div className="viz-legend-item-title">Standar Palet Warna</div>
            <div className="viz-legend-item-desc">
              Gradasi warna ramah buta warna (*colorblind-safe*) memastikan
              kontras optimal antara zona defisit (gelap) dan zona maju (terang).
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function VizLegendHeatmap({ dataset = [], varName }) {
  const stats = getVariableStats(dataset, varName);

  return (
    <div className="viz-legend">
      <div className="viz-legend-header">
        <div className="viz-legend-title">
          <span>
            Panduan &amp; Legenda Peta Heatmap Spasial (Kernel Density)
          </span>
        </div>
        <span className="viz-legend-badge">Density Surface KDE</span>
      </div>
      <div className="viz-legend-desc">
        <strong>Tujuan &amp; Fungsi:</strong> Mengestimasi kerapatan peubah{" "}
        <strong>{getVarLabel(varName)}</strong> secara spasial kontinu di
        seluruh nusantara menggunakan algoritma Kernel Density Estimation (KDE)
        untuk memperlihatkan zona aglomerasi murni tanpa batasan batas wilayah
        artifisial.
      </div>

      {/* Bar Kontras Spektrum Heatmap */}
      <VizLegendContrastBar
        title={`Spektrum Densitas: ${getVarLabel(varName)}`}
        varName={varName}
        min={stats.min}
        mid={stats.median}
        max={stats.max}
        avg={stats.avg}
        customGradient="linear-gradient(to right, #3b82f6, #06b6d4, #10b981, #f59e0b, #ef4444)"
        minLabel="Coldspot (Min)"
        midLabel="Median"
        maxLabel="Hotspot (Max)"
        scopeBadge={`${dataset.length || 514} Titik`}
      />

      <div className="viz-legend-grid">
        <div className="viz-legend-item">
          <div>
            <div className="viz-legend-item-title">
              Interpretasi Zona Termal
            </div>
            <div className="viz-legend-item-desc">
              Zona merah pekat menandai klaster aglomerasi capaian gender
              tertinggi di kawasan perkotaan/metropolitan, sedangkan zona biru
              mencerminkan defisit capaian spasial.
            </div>
          </div>
        </div>
        <div className="viz-legend-item">
          <div>
            <div className="viz-legend-item-title">
              Fitur Penyesuaian Analisis
            </div>
            <div className="viz-legend-item-desc">
              Gunakan slider <strong>Radius</strong> dan <strong>Blur</strong>{" "}
              di atas untuk mengatur kehalusan permukaan densitas spasial.
              Centang <em>Overlay Batas SHP</em> untuk menumpangkan garis
              yurisdiksi di atas heatmap.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function VizLegendProportional({
  dataset = [],
  sizeVar,
  colorVar,
  paletteName = "Viridis",
}) {
  const statsSize = getVariableStats(dataset, sizeVar);
  const statsColor = getVariableStats(dataset, colorVar);

  return (
    <div className="viz-legend">
      <div className="viz-legend-header">
        <div className="viz-legend-title">
          <span>
            Panduan &amp; Legenda Peta Simbol Proporsional (Bivariate)
          </span>
        </div>
        <span className="viz-legend-badge">
          Encoding Dwipeubah: Ukuran &amp; Warna
        </span>
      </div>
      <div className="viz-legend-desc">
        <strong>Tujuan &amp; Fungsi:</strong> Mengombinasikan dua indikator
        berbeda dalam satu tampilan peta geospasial untuk menganalisis hubungan
        timbal balik antara volume/besaran riil dengan persentase performa
        kualitas gender.
      </div>

      {/* 1. Skala Ukuran Lingkaran Proporsional */}
      <div className="viz-legend-contrast-card">
        <div className="viz-legend-contrast-header">
          <div className="viz-legend-contrast-title">
            <i
              className="fa-regular fa-circle-dot"
              style={{ color: "#1F5FCC" }}
            ></i>
            <span>Skala Ukuran Lingkaran (Volume: {getVarLabel(sizeVar)})</span>
          </div>
          <span className="viz-legend-contrast-badge">Proporsional</span>
        </div>
        <div className="viz-prop-size-legend">
          <div className="viz-prop-size-item">
            <div
              className="viz-prop-circle"
              style={{ width: "10px", height: "10px" }}
            ></div>
            <span className="viz-prop-circle-label">
              {formatStatValue(statsSize.min, sizeVar)}
            </span>
            <span className="viz-prop-circle-sub">Min (Terkecil)</span>
          </div>
          <div className="viz-prop-size-item">
            <div
              className="viz-prop-circle"
              style={{ width: "18px", height: "18px" }}
            ></div>
            <span className="viz-prop-circle-label">
              {formatStatValue(statsSize.avg, sizeVar)}
            </span>
            <span className="viz-prop-circle-sub">Rata-rata</span>
          </div>
          <div className="viz-prop-size-item">
            <div
              className="viz-prop-circle"
              style={{ width: "28px", height: "28px" }}
            ></div>
            <span className="viz-prop-circle-label">
              {formatStatValue(statsSize.max, sizeVar)}
            </span>
            <span className="viz-prop-circle-sub">Max (Terbesar)</span>
          </div>
        </div>
      </div>

      {/* 2. Bar Kontras Skala Warna Lingkaran */}
      <VizLegendContrastBar
        title={`Skala Warna Lingkaran (Kinerja: ${getVarLabel(colorVar)})`}
        varName={colorVar}
        min={statsColor.min}
        mid={statsColor.median}
        max={statsColor.max}
        avg={statsColor.avg}
        paletteName={paletteName}
        scopeBadge={`Palet ${paletteName}`}
      />

      <div className="viz-legend-grid">
        <div className="viz-legend-item">
          <div>
            <div className="viz-legend-item-title">Interpretasi Bivariate</div>
            <div className="viz-legend-item-desc">
              Lingkaran <strong>besar dan berwarna terang</strong> mencerminkan
              kawasan berkinerja unggul ganda (daya ungkit volume tinggi dan
              kualitas prima). Lingkaran besar namun gelap menunjukkan paradoks
              aktivitas tinggi tanpa capaian kualitas memadai.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function VizLegendChoropleth({
  dataset = [],
  varName,
  paletteName = "Viridis",
}) {
  const stats = getVariableStats(dataset, varName);

  return (
    <div className="viz-legend">
      <div className="viz-legend-header">
        <div className="viz-legend-title">
          <span>Panduan &amp; Legenda Peta Choropleth Rasio Provinsi</span>
        </div>
        <span className="viz-legend-badge">Agregat Makro 38 Provinsi</span>
      </div>
      <div className="viz-legend-desc">
        <strong>Tujuan &amp; Fungsi:</strong> Membandingkan capaian agregat
        makro antar-provinsi pada indikator{" "}
        <strong>{getVarLabel(varName)}</strong> untuk melihat kesenjangan
        regional tingkat pertama di Indonesia.
      </div>

      {/* Bar Kontras Skala Gradasi Warna Provinsi */}
      <VizLegendContrastBar
        title={`Gradasi Tematik: ${getVarLabel(varName)}`}
        varName={varName}
        min={stats.min}
        mid={stats.median}
        max={stats.max}
        avg={stats.avg}
        paletteName={paletteName}
        scopeBadge="38 Provinsi"
        minLabel="Provinsi Terendah"
        midLabel="Rata-rata 38 Prov"
        maxLabel="Provinsi Tertinggi"
      />

      <div className="viz-legend-grid">
        <div className="viz-legend-item">
          <div>
            <div className="viz-legend-item-title">
              Interpretasi Pewarnaan Tematik
            </div>
            <div className="viz-legend-item-desc">
              Provinsi dengan rona warna terang mencatatkan performa terbaik
              pada indikator {getVarLabel(varName)}. Arahkan kursor atau klik
              poligon untuk rincian angka riil setiap provinsi.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function VizLegendLISA({ dataset = [], clusterVar }) {
  const total = dataset.length || 1;
  const countHH = dataset.filter(
    (d) => d[clusterVar] === "High-High (Hotspot)",
  ).length;
  const countLL = dataset.filter(
    (d) => d[clusterVar] === "Low-Low (Coldspot)",
  ).length;
  const countHL = dataset.filter(
    (d) => d[clusterVar] === "High-Low (Spatial Outlier)",
  ).length;
  const countLH = dataset.filter(
    (d) => d[clusterVar] === "Low-High (Spatial Outlier)",
  ).length;
  const countNS = dataset.filter(
    (d) => !d[clusterVar] || d[clusterVar] === "Not Significant",
  ).length;

  const pctHH = ((countHH / total) * 100).toFixed(1);
  const pctLL = ((countLL / total) * 100).toFixed(1);
  const pctHL = ((countHL / total) * 100).toFixed(1);
  const pctLH = ((countLH / total) * 100).toFixed(1);
  const pctNS = ((countNS / total) * 100).toFixed(1);

  const clusterTitle =
    clusterVar === "lisa_cluster_keputusan"
      ? "Skor Pengambilan Keputusan"
      : "Skor Partisipasi Ekonomi";

  return (
    <div className="viz-legend">
      <div className="viz-legend-header">
        <div className="viz-legend-title">
          <span>
            Panduan &amp; Legenda Klaster Spasial LISA (Local Moran&apos;s I)
          </span>
        </div>
        <span className="viz-legend-badge">
          Signifikansi Spasial p &lt; 0.05
        </span>
      </div>
      <div className="viz-legend-desc">
        <strong>Tujuan &amp; Fungsi:</strong> Mengidentifikasi ketergantungan
        dan autokorelasi spasial lokal pada <strong>{clusterTitle}</strong> guna
        membuktikan keberadaan aglomerasi geografis yang bukan kebetulan acak.
      </div>

      {/* Bar Kontras Klaster Spasial & Komposisi */}
      <div className="viz-legend-contrast-card">
        <div className="viz-legend-contrast-header">
          <div className="viz-legend-contrast-title">
            <i
              className="fa-solid fa-circle-nodes"
              style={{ color: "#1F5FCC" }}
            ></i>
            <span>Distribusi Klaster Spasial Wilayah</span>
          </div>
          <span className="viz-legend-contrast-badge">
            {dataset.length} Wilayah
          </span>
        </div>
        {/* Multi-color Bar for Clusters */}
        <div
          style={{
            width: "100%",
            height: "12px",
            borderRadius: "3px",
            overflow: "hidden",
            display: "flex",
            boxShadow: "inset 0 1px 2px rgba(0,0,0,0.15)",
            margin: "4px 0 8px 0",
          }}
        >
          <div
            style={{ width: `${pctHH}%`, background: "#dc2626" }}
            title={`High-High: ${countHH} (${pctHH}%)`}
          ></div>
          <div
            style={{ width: `${pctLL}%`, background: "#2563eb" }}
            title={`Low-Low: ${countLL} (${pctLL}%)`}
          ></div>
          <div
            style={{ width: `${pctHL}%`, background: "#f97316" }}
            title={`High-Low: ${countHL} (${pctHL}%)`}
          ></div>
          <div
            style={{ width: `${pctLH}%`, background: "#10b981" }}
            title={`Low-High: ${countLH} (${pctLH}%)`}
          ></div>
          <div
            style={{ width: `${pctNS}%`, background: "#cbd5e1" }}
            title={`Not Significant: ${countNS} (${pctNS}%)`}
          ></div>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "6px",
            fontSize: "10px",
            fontWeight: "700",
          }}
        >
          <span style={{ color: "#dc2626" }}>
            ● HH: {countHH} ({pctHH}%)
          </span>
          <span style={{ color: "#2563eb" }}>
            ● LL: {countLL} ({pctLL}%)
          </span>
          <span style={{ color: "#ea580c" }}>
            ● HL: {countHL} ({pctHL}%)
          </span>
          <span style={{ color: "#059669" }}>
            ● LH: {countLH} ({pctLH}%)
          </span>
          <span style={{ color: "#64748b" }}>
            ● Acak: {countNS} ({pctNS}%)
          </span>
        </div>
      </div>

      <div className="viz-legend-grid">
        <div className="viz-legend-item">
          <div
            className="viz-legend-color-box"
            style={{ background: "#dc2626" }}
          ></div>
          <div>
            <div className="viz-legend-item-title" style={{ color: "#dc2626" }}>
              High-High (Hotspot): {countHH} Wilayah ({pctHH}%)
            </div>
            <div className="viz-legend-item-desc">
              Daerah bernilai tinggi yang bertetangga dengan daerah-daerah
              bernilai tinggi (klaster kemajuan spasial bersama).
            </div>
          </div>
        </div>
        <div className="viz-legend-item">
          <div
            className="viz-legend-color-box"
            style={{ background: "#2563eb" }}
          ></div>
          <div>
            <div className="viz-legend-item-title" style={{ color: "#2563eb" }}>
              Low-Low (Coldspot): {countLL} Wilayah ({pctLL}%)
            </div>
            <div className="viz-legend-item-desc">
              Daerah bernilai rendah yang bertetangga dengan daerah-daerah
              bernilai rendah (zona ketertinggalan spasial yang butuh intervensi
              kawasan terpadu).
            </div>
          </div>
        </div>
        <div className="viz-legend-item">
          <div
            className="viz-legend-color-box"
            style={{ background: "#f97316" }}
          ></div>
          <div>
            <div className="viz-legend-item-title" style={{ color: "#ea580c" }}>
              High-Low (Outlier Positif): {countHL} Wilayah ({pctHL}%)
            </div>
            <div className="viz-legend-item-desc">
              Daerah maju yang terisolasi di antara kawasan sekitar yang
              tertinggal (pusat pertumbuhan mandiri).
            </div>
          </div>
        </div>
        <div className="viz-legend-item">
          <div
            className="viz-legend-color-box"
            style={{ background: "#10b981" }}
          ></div>
          <div>
            <div className="viz-legend-item-title" style={{ color: "#059669" }}>
              Low-High (Outlier Negatif): {countLH} Wilayah ({pctLH}%)
            </div>
            <div className="viz-legend-item-desc">
              Daerah tertinggal yang berada di tengah kawasan sekitar yang telah
              maju (indikasi kesenjangan wilayah satelit).
            </div>
          </div>
        </div>
        <div className="viz-legend-item full-width">
          <div
            className="viz-legend-color-box"
            style={{ background: "#cbd5e1" }}
          ></div>
          <div>
            <div className="viz-legend-item-title" style={{ color: "#64748b" }}>
              Not Significant: {countNS} Wilayah ({pctNS}%)
            </div>
            <div className="viz-legend-item-desc">
              Daerah dengan sebaran nilai acak tanpa ketergantungan spasial yang
              signifikan secara statistik (p ≥ 0.05).
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function VizLegendPCA({ varPC1 = "42.4", varPC2 = "24.5" }) {
  const totalVar = (+varPC1 + +varPC2).toFixed(1);

  return (
    <div className="viz-legend">
      <div className="viz-legend-header">
        <div className="viz-legend-title">
          <span>Panduan &amp; Legenda PCA Biplot (Reduksi 8 Dimensi)</span>
        </div>
        <span className="viz-legend-badge">Total Variansi: {totalVar}%</span>
      </div>
      <div className="viz-legend-desc">
        <strong>Tujuan &amp; Fungsi:</strong> Merangkum 8 indikator gender BPS
        yang saling berkorelasi ke dalam 2 komponen utama laten (PC1 dan PC2)
        tanpa kehilangan banyak informasi, guna mengungkap struktur laten
        disparitas wilayah di Indonesia.
      </div>

      {/* Bar Kontras Proporsi Variansi */}
      <div className="viz-legend-contrast-card">
        <div className="viz-legend-contrast-header">
          <div className="viz-legend-contrast-title">
            <i
              className="fa-solid fa-chart-pie"
              style={{ color: "#1F5FCC" }}
            ></i>
            <span>Proporsi Variansi Komponen Utama</span>
          </div>
          <span className="viz-legend-contrast-badge">
            {totalVar}% Tertangkap
          </span>
        </div>
        <div
          style={{
            width: "100%",
            height: "12px",
            borderRadius: "3px",
            overflow: "hidden",
            display: "flex",
            boxShadow: "inset 0 1px 2px rgba(0,0,0,0.15)",
            margin: "4px 0 6px 0",
          }}
        >
          <div
            style={{ width: `${varPC1}%`, background: "#1F5FCC" }}
            title={`PC1: ${varPC1}%`}
          ></div>
          <div
            style={{ width: `${varPC2}%`, background: "#06B6D4" }}
            title={`PC2: ${varPC2}%`}
          ></div>
          <div
            style={{
              width: `${(100 - (+varPC1 + +varPC2)).toFixed(1)}%`,
              background: "#E2E8F0",
            }}
            title="Komponen Lainnya"
          ></div>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: "10px",
            fontWeight: "700",
          }}
        >
          <span style={{ color: "#1F5FCC" }}>PC1: {varPC1}% (Sumbu X)</span>
          <span style={{ color: "#0891B2" }}>PC2: {varPC2}% (Sumbu Y)</span>
          <span style={{ color: "#64748B" }}>
            Sisa: {(100 - (+varPC1 + +varPC2)).toFixed(1)}%
          </span>
        </div>
      </div>

      <div className="viz-legend-grid">
        <div className="viz-legend-item">
          <div>
            <div className="viz-legend-item-title">
              Sumbu Horizontal (PC1: {varPC1}% Variansi)
            </div>
            <div className="viz-legend-item-desc">
              Dimensi Kapasitas Sosial &amp; Kesejahteraan Hidup Layak
              (Pengeluaran riil, AHH, RLS, HLS, dan Tenaga Profesional). Semakin
              ke kanan koordinat suatu wilayah, semakin tinggi kualitas
              pendidikan dan daya beli masyarakatnya.
            </div>
          </div>
        </div>
        <div className="viz-legend-item">
          <div>
            <div className="viz-legend-item-title">
              Sumbu Vertikal (PC2: {varPC2}% Variansi)
            </div>
            <div className="viz-legend-item-desc">
              Dimensi Partisipasi Politik Modern vs Keterpaksaan Kerja Fisik
              (Parlemen positif ke atas vs TPAK pertanian pedesaan negatif ke
              bawah). Menjelaskan paradoks kerja di kawasan timur.
            </div>
          </div>
        </div>
        <div className="viz-legend-item full-width">
          <div>
            <div className="viz-legend-item-title">
              Vektor Panah Merah (Loading Peubah)
            </div>
            <div className="viz-legend-item-desc">
              Panjang panah mencerminkan kontribusi peubah terhadap pembentukan
              komponen utama. <strong>Sudut lancip (&lt;90°)</strong> menandakan
              korelasi positif kuat; <strong>sudut tegak lurus (90°)</strong>{" "}
              menandakan peubah independen; dan{" "}
              <strong>sudut tumpul (&gt;90°)</strong> menandakan korelasi
              negatif (*trade-off*).
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function VizLegendParcoords({ dataset = [], paletteName = "Viridis" }) {
  const stats = getVariableStats(dataset, "skor_keputusan");

  return (
    <div className="viz-legend">
      <div className="viz-legend-header">
        <div className="viz-legend-title">
          <span>Panduan &amp; Legenda Diagram Koordinat Paralel</span>
        </div>
        <span className="viz-legend-badge">Analisis Multivariat 8 Dimensi</span>
      </div>
      <div className="viz-legend-desc">
        <strong>Tujuan &amp; Fungsi:</strong> Memvisualisasikan spektrum profil
        multidimensi lengkap setiap daerah pada 8 indikator gender secara
        serentak untuk mendeteksi anomali, klaster alami, serta kompromi
        struktural.
      </div>

      {/* Bar Kontras Skala Warna Garis */}
      <VizLegendContrastBar
        title="Warna Garis: Skor Pengambilan Keputusan"
        varName="skor_keputusan"
        min={stats.min}
        mid={stats.median}
        max={stats.max}
        avg={stats.avg}
        paletteName={paletteName}
        scopeBadge={`${dataset.length || 514} Garis Wilayah`}
        minLabel="Skor Rendah"
        midLabel="Skor Rata-rata"
        maxLabel="Skor Tinggi"
      />

      <div className="viz-legend-grid">
        <div className="viz-legend-item">
          <div>
            <div className="viz-legend-item-title">
              8 Sumbu Vertikal Sejajar
            </div>
            <div className="viz-legend-item-desc">
              Masing-masing sumbu memetakan rentang nilai asli indikator BPS
              (Parlemen, Pendapatan, Pengeluaran, AHH, Profesional, TPAK, RLS,
              dan HLS). Setiap garis melintang mewakili 1 wilayah amatan.
            </div>
          </div>
        </div>
        <div className="viz-legend-item">
          <div>
            <div className="viz-legend-item-title">Interaktivitas Brushing</div>
            <div className="viz-legend-item-desc">
              Klik dan tarik vertikal pada sumbu manapun (*brushing*) untuk
              memfilter dan mengisolasi wilayah yang memiliki kriteria tertentu
              secara langsung di seluruh sumbu lainnya.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function VizLegendCorrHeatmap() {
  return (
    <div className="viz-legend">
      <div className="viz-legend-header">
        <div className="viz-legend-title">
          <span>Panduan &amp; Legenda Matriks Korelasi Asosiasi Peubah</span>
        </div>
        <span className="viz-legend-badge">
          Koefisien Pearson (r: -1.0 s.d. +1.0)
        </span>
      </div>
      <div className="viz-legend-desc">
        <strong>Tujuan &amp; Fungsi:</strong> Mengukur kekuatan dan arah
        hubungan linear antara masing-masing pasangan indikator gender BPS guna
        membuktikan hipotesis kausalitas dan sinergi pembangunan manusia.
      </div>

      {/* Bar Kontras Divergen Korelasi Pearson */}
      <div className="viz-legend-contrast-card">
        <div className="viz-legend-contrast-header">
          <div className="viz-legend-contrast-title">
            <i
              className="fa-solid fa-scale-balanced"
              style={{ color: "#1F5FCC" }}
            ></i>
            <span>Skala Koefisien Korelasi Pearson (r)</span>
          </div>
          <span className="viz-legend-contrast-badge">-1.0 s.d. +1.0</span>
        </div>
        <div className="viz-legend-ramp-container">
          <div
            className="viz-legend-ramp-bar"
            style={{
              background:
                "linear-gradient(to right, #2563eb, #93c5fd, #ffffff, #fca5a5, #dc2626)",
            }}
          ></div>
          <div className="viz-legend-ramp-ticks">
            <div className="viz-legend-tick">
              <span className="viz-legend-tick-value">-1.00</span>
              <span className="viz-legend-tick-label">
                Korelasi Negatif Kuat
              </span>
            </div>
            <div className="viz-legend-tick">
              <span className="viz-legend-tick-value">0.00</span>
              <span className="viz-legend-tick-label">Independen (Netral)</span>
            </div>
            <div className="viz-legend-tick">
              <span className="viz-legend-tick-value">+1.00</span>
              <span className="viz-legend-tick-label">
                Korelasi Positif Kuat
              </span>
            </div>
          </div>
        </div>
        <div className="viz-legend-stats-strip">
          <div className="viz-legend-stat-box">
            <div className="viz-legend-stat-label">Biru (-1.0 s.d. -0.5)</div>
            <div className="viz-legend-stat-val" style={{ color: "#2563eb" }}>
              Trade-Off Terbalik
            </div>
          </div>
          <div className="viz-legend-stat-box">
            <div className="viz-legend-stat-label">Putih (-0.2 s.d. +0.2)</div>
            <div className="viz-legend-stat-val" style={{ color: "#64748b" }}>
              Tidak Berkorelasi
            </div>
          </div>
          <div className="viz-legend-stat-box">
            <div className="viz-legend-stat-label">Merah (+0.5 s.d. +1.0)</div>
            <div className="viz-legend-stat-val" style={{ color: "#dc2626" }}>
              Sinergi Searah
            </div>
          </div>
        </div>
      </div>

      <div className="viz-legend-grid">
        <div className="viz-legend-item">
          <div>
            <div className="viz-legend-item-title">
              Contoh Sinergi Positif Signifikan
            </div>
            <div className="viz-legend-item-desc">
              Rata-rata Lama Sekolah (RLS) dan Harapan Lama Sekolah (HLS)
              berkorelasi positif kuat (r &gt; 0.70) dengan Pengeluaran Riil dan
              Tenaga Profesional Perempuan.
            </div>
          </div>
        </div>
        <div className="viz-legend-item">
          <div>
            <div className="viz-legend-item-title">
              Contoh Trade-Off Spasial Terbalik
            </div>
            <div className="viz-legend-item-desc">
              TPAK perempuan di sektor tradisional memiliki korelasi negatif (r
              &lt; -0.30) terhadap pengeluaran dan pendidikan di wilayah
              pedesaan.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function VizLegendRadar() {
  return (
    <div className="viz-legend">
      <div className="viz-legend-header">
        <div className="viz-legend-title">
          <span>Panduan &amp; Legenda Radar Profil Multidimensi</span>
        </div>
        <span className="viz-legend-badge">
          Skala Relatif Ternormalisasi (0-100)
        </span>
      </div>
      <div className="viz-legend-desc">
        <strong>Tujuan &amp; Fungsi:</strong> Menilai keseimbangan holistik
        profil pembangunan gender antar-wilayah kepulauan utama (Jawa, Sulawesi,
        Papua, dll.) dengan membandingkan bentuk poligon jaring laba-laba.
      </div>

      {/* Skala Bar Kontras Normalisasi 0-100 */}
      <div className="viz-legend-contrast-card">
        <div className="viz-legend-contrast-header">
          <div className="viz-legend-contrast-title">
            <i
              className="fa-solid fa-chart-radar"
              style={{ color: "#1F5FCC" }}
            ></i>
            <span>Rentang Normalisasi Min-Max Sumbu Radar</span>
          </div>
          <span className="viz-legend-contrast-badge">Skala 0 - 100</span>
        </div>
        <div className="viz-legend-ramp-container">
          <div
            className="viz-legend-ramp-bar"
            style={{
              background:
                "linear-gradient(to right, #94a3b8, #3b82f6, #16a34a)",
            }}
          ></div>
          <div className="viz-legend-ramp-ticks">
            <div className="viz-legend-tick">
              <span className="viz-legend-tick-value">0.0 (Min Nasional)</span>
              <span className="viz-legend-tick-label">
                Pusat Jaring (Defisit)
              </span>
            </div>
            <div className="viz-legend-tick">
              <span className="viz-legend-tick-value">50.0 (Median)</span>
              <span className="viz-legend-tick-label">Tingkat Moderat</span>
            </div>
            <div className="viz-legend-tick">
              <span className="viz-legend-tick-value">100.0 (Max Nasional)</span>
              <span className="viz-legend-tick-label">
                Tepi Terluar (Unggul)
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="viz-legend-grid">
        <div className="viz-legend-item">
          <div>
            <div className="viz-legend-item-title">Bentuk Poligon Spasial</div>
            <div className="viz-legend-item-desc">
              Poligon yang merekah keluar mendekati batas terluar (skor 100)
              mengindikasikan capaian pembangunan gender yang menyeluruh dan
              merata. Cekungan ke arah pusat menandakan dimensi yang menjadi
              kelemahan mendesak.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function VizLegendTreemap({
  dataset = [],
  isProvinsi,
  sizeVar,
  colorVar,
  paletteName = "Viridis",
}) {
  const statsSize = getVariableStats(dataset, sizeVar);
  const statsColor = getVariableStats(dataset, colorVar);
  const scopeBadge = isProvinsi
    ? "Pulau -> Provinsi"
    : "Pulau -> Provinsi -> Kab/Kota";

  return (
    <div className="viz-legend">
      <div className="viz-legend-header">
        <div className="viz-legend-title">
          <span>Panduan &amp; Legenda Interactive Treemap</span>
        </div>
        <span className="viz-legend-badge">Hirarki Bersarang: {scopeBadge}</span>
      </div>
      <div className="viz-legend-desc">
        <strong>Tujuan &amp; Fungsi:</strong> Menyajikan dekomposisi data
        berhierarki secara spasial proporsional di mana struktur wilayah
        bersarang dikelompokkan ke dalam kotak-kotak bertingkat untuk
        membandingkan kontribusi volume dan performa kualitas.
      </div>

      {/* 1. Bar Ringkasan Volume Variabel Ukuran */}
      <div className="viz-legend-contrast-card">
        <div className="viz-legend-contrast-header">
          <div className="viz-legend-contrast-title">
            <i className="fa-solid fa-cubes" style={{ color: "#1F5FCC" }}></i>
            <span>Luas Kotak (Volume: {getVarLabel(sizeVar)})</span>
          </div>
          <span className="viz-legend-contrast-badge">
            {dataset.length} Wilayah
          </span>
        </div>
        <div
          className="viz-legend-stats-strip"
          style={{ marginTop: "2px", borderTop: "none" }}
        >
          <div className="viz-legend-stat-box">
            <div className="viz-legend-stat-label">Min Volume</div>
            <div className="viz-legend-stat-val">
              {formatStatValue(statsSize.min, sizeVar)}
            </div>
          </div>
          <div className="viz-legend-stat-box">
            <div className="viz-legend-stat-label">Rata-rata</div>
            <div className="viz-legend-stat-val">
              {formatStatValue(statsSize.avg, sizeVar)}
            </div>
          </div>
          <div className="viz-legend-stat-box">
            <div className="viz-legend-stat-label">Max Volume</div>
            <div className="viz-legend-stat-val">
              {formatStatValue(statsSize.max, sizeVar)}
            </div>
          </div>
        </div>
      </div>

      {/* 2. Bar Kontras Gradasi Warna Capaian */}
      <VizLegendContrastBar
        title={`Warna Kotak (Kinerja: ${getVarLabel(colorVar)})`}
        varName={colorVar}
        min={statsColor.min}
        mid={statsColor.median}
        max={statsColor.max}
        avg={statsColor.avg}
        paletteName={paletteName}
        scopeBadge={`Palet ${paletteName}`}
        minLabel="Capaian Terendah"
        midLabel="Rata-rata Capaian"
        maxLabel="Capaian Tertinggi"
      />

      <div className="viz-legend-grid">
        <div className="viz-legend-item">
          <div>
            <div className="viz-legend-item-title">
              Cara Navigasi Hirarki (Drill-Down &amp; Zoom-Out)
            </div>
            <div className="viz-legend-item-desc">
              <strong>Klik Kotak:</strong> Memperbesar (*zoom-in / drill-down*)
              ke dalam struktur pulau atau provinsi yang dipilih.
              <br />
              <strong>Klik Bilah Judul Atas:</strong> Kembali (*zoom-out*) ke
              tingkat hirarki agregat di atasnya hingga seluruh Indonesia.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function VizLegendSunburst({
  dataset = [],
  isProvinsi,
  sizeVar,
  colorVar,
  paletteName = "Viridis",
}) {
  const statsSize = getVariableStats(dataset, sizeVar);
  const statsColor = getVariableStats(dataset, colorVar);

  return (
    <div className="viz-legend">
      <div className="viz-legend-header">
        <div className="viz-legend-title">
          <span>Panduan &amp; Legenda Interactive Sunburst Chart</span>
        </div>
        <span className="viz-legend-badge">Hirarki Radial Konsentris</span>
      </div>
      <div className="viz-legend-desc">
        <strong>Tujuan &amp; Fungsi:</strong> Memvisualisasikan hirarki
        bertingkat dalam bentuk diagram cincin radial konsentris untuk mengamati
        proporsi pembagian dari tingkat nasional (pusat), pulau (cincin dalam),
        provinsi (cincin tengah), hingga kab/kota (cincin terluar).
      </div>

      {/* 1. Bar Ringkasan Lebar Sudut Busur */}
      <div className="viz-legend-contrast-card">
        <div className="viz-legend-contrast-header">
          <div className="viz-legend-contrast-title">
            <i
              className="fa-solid fa-chart-pie"
              style={{ color: "#1F5FCC" }}
            ></i>
            <span>Lebar Sudut Busur (Volume: {getVarLabel(sizeVar)})</span>
          </div>
          <span className="viz-legend-contrast-badge">
            {dataset.length} Wilayah
          </span>
        </div>
        <div
          className="viz-legend-stats-strip"
          style={{ marginTop: "2px", borderTop: "none" }}
        >
          <div className="viz-legend-stat-box">
            <div className="viz-legend-stat-label">Min Volume</div>
            <div className="viz-legend-stat-val">
              {formatStatValue(statsSize.min, sizeVar)}
            </div>
          </div>
          <div className="viz-legend-stat-box">
            <div className="viz-legend-stat-label">Rata-rata</div>
            <div className="viz-legend-stat-val">
              {formatStatValue(statsSize.avg, sizeVar)}
            </div>
          </div>
          <div className="viz-legend-stat-box">
            <div className="viz-legend-stat-label">Max Volume</div>
            <div className="viz-legend-stat-val">
              {formatStatValue(statsSize.max, sizeVar)}
            </div>
          </div>
        </div>
      </div>

      {/* 2. Bar Kontras Gradasi Warna Irisan */}
      <VizLegendContrastBar
        title={`Gradien Warna Irisan (Kinerja: ${getVarLabel(colorVar)})`}
        varName={colorVar}
        min={statsColor.min}
        mid={statsColor.median}
        max={statsColor.max}
        avg={statsColor.avg}
        paletteName={paletteName}
        scopeBadge={`Palet ${paletteName}`}
        minLabel="Capaian Terendah"
        midLabel="Rata-rata Capaian"
        maxLabel="Capaian Tertinggi"
      />

      <div className="viz-legend-grid">
        <div className="viz-legend-item">
          <div>
            <div className="viz-legend-item-title">
              Navigasi Radial Interaktif
            </div>
            <div className="viz-legend-item-desc">
              <strong>Klik Irisan:</strong> Memfokuskan tampilan dan memperbesar
              sektor wilayah tersebut.
              <br />
              <strong>Klik Lingkaran Pusat:</strong> Kembali satu tingkat ke
              atas (*zoom-out*).
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function VizLegendIslandSummary({ isProvinsi }) {
  return (
    <div className="viz-legend">
      <div className="viz-legend-header">
        <div className="viz-legend-title">
          <span>
            Panduan &amp; Legenda Rangkuman Hierarki per Wilayah Pulau
          </span>
        </div>
        <span className="viz-legend-badge">
          Rekapitulasi Agregat Makro Kepulauan
        </span>
      </div>
      <div className="viz-legend-desc">
        <strong>Tujuan &amp; Fungsi:</strong> Menghitung nilai agregat rata-rata
        indikator gender BPS 2024 dan indeks komposit (Keputusan, Ekonomi, IKPP)
        untuk 6 gugus pulau utama di Indonesia guna mengevaluasi disparitas
        makro antar-region secara cepat dan terukur (
        {isProvinsi
          ? "berdasarkan 38 provinsi"
          : "berdasarkan 514 kabupaten/kota"}
        ).
      </div>
    </div>
  );
}

export default function Home() {
  const [dataLoaded, setDataLoaded] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [allKabkota, setAllKabkota] = useState([]);
  const [allProvinsi, setAllProvinsi] = useState([]);
  const [nasionalStats, setNasionalStats] = useState({});
  const [pcaMeta, setPcaMeta] = useState({});
  const [corrData, setCorrData] = useState({});
  const [geojsonData, setGeojsonData] = useState(null);
  const [kabkotaGeojson, setKabkotaGeojson] = useState(null);
  const [selectedKabDetail, setSelectedKabDetail] = useState(null);

  // Filters
  const [selectedPulau, setSelectedPulau] = useState("Semua Pulau");
  const [selectedProv, setSelectedProv] = useState("Semua Provinsi");
  const [selectedTipe, setSelectedTipe] = useState("Kab/Kota");
  const [selectedKuadran, setSelectedKuadran] = useState("Semua Kuadran");
  const [selectedPalette, setSelectedPalette] = useState("Viridis");

  // Institutional UI States
  const [helpModalOpen, setHelpModalOpen] = useState(false);
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [fullscreenId, setFullscreenId] = useState(null);

  // Fullscreen Handler
  const toggleFullscreen = (elementId) => {
    const el = document.getElementById(elementId);
    if (!el) return;
    if (!document.fullscreenElement) {
      el.requestFullscreen().catch(() => {});
      setFullscreenId(elementId);
    } else {
      document.exitFullscreen().catch(() => {});
      setFullscreenId(null);
    }
  };

  // Export GeoJSON Handler
  const downloadGeoJSON = () => {
    const geo = isProvinsi ? geojsonData : kabkotaGeojson;
    if (!geo) return;
    const blob = new Blob([JSON.stringify(geo, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = isProvinsi
      ? "provinsi_38_indonesia.geojson"
      : "kabkota_514_indonesia.geojson";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Tabs
  const [activeTab, setActiveTab] = useState("tab-overview");
  const [activeGeoSubtab, setActiveGeoSubtab] = useState(
    "geo-subtab-kabkota-boundary",
  );
  const [activeMultiSubtab, setActiveMultiSubtab] =
    useState("multi-subtab-pca");
  const [activeHierSubtab, setActiveHierSubtab] = useState(
    "hier-subtab-treemap",
  );

  // Dynamic Chart Controls
  const [geoSizeVar, setGeoSizeVar] = useState("pengeluaran");
  const [geoColorVar, setGeoColorVar] = useState("skor_keputusan");
  const [choroplethVar, setChoroplethVar] = useState("parlemen");
  const [kabkotaChoroplethVar, setKabkotaChoroplethVar] = useState("parlemen");
  const [heatmapVar, setHeatmapVar] = useState("parlemen");
  const [heatmapRadius, setHeatmapRadius] = useState(28);
  const [heatmapBlur, setHeatmapBlur] = useState(18);
  const [heatmapShowBoundaries, setHeatmapShowBoundaries] = useState(true);
  const [heatmapShowPoints, setHeatmapShowPoints] = useState(true);
  const [lisaClusterVar, setLisaClusterVar] = useState(
    "lisa_cluster_keputusan",
  );
  const [pcaColorBy, setPcaColorBy] = useState("pulau");
  const [hierSizeVar, setHierSizeVar] = useState("pengeluaran");
  const [hierColorVar, setHierColorVar] = useState("parlemen");

  // Table State
  const [tableSearch, setTableSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortCol, setSortCol] = useState("ikpp_komposit");
  const [sortAsc, setSortAsc] = useState(false);
  const rowsPerPage = 15;

  // Map references
  const kabkotaBoundaryMapRef = useRef(null);
  const heatmapMapRef = useRef(null);
  const leafletMapRef = useRef(null);
  const choroplethMapRef = useRef(null);
  const lisaMapRef = useRef(null);

  // Data cache refs to prevent stale closure traps in async map callbacks
  const kabkotaGeojsonRef = useRef(null);
  const geojsonDataRef = useRef(null);
  const allKabkotaRef = useRef([]);
  const allProvinsiRef = useRef([]);
  const [leafletLoaded, setLeafletLoaded] = useState(false);

  // Monitor Leaflet availability in browser window
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.L) {
      setLeafletLoaded(true);
      return;
    }
    const checkL = setInterval(() => {
      if (typeof window !== "undefined" && window.L) {
        setLeafletLoaded(true);
        clearInterval(checkL);
      }
    }, 60);
    return () => clearInterval(checkL);
  }, []);

  // Load Data
  useEffect(() => {
    async function fetchData() {
      try {
        const [resKab, resProv, resNas, resPca, resCorr, resGeo, resKabNat] =
          await Promise.all([
            fetch("/data/kabkota_514.json").then((r) => r.json()),
            fetch("/data/provinsi_38.json").then((r) => r.json()),
            fetch("/data/nasional.json").then((r) => r.json()),
            fetch("/data/pca_meta.json").then((r) => r.json()),
            fetch("/data/correlation_matrix.json").then((r) => r.json()),
            fetch("/data/provinsi_indonesia.geojson")
              .then((r) => r.json())
              .catch(() => null),
            fetch("/data/kabkota_indonesia.geojson")
              .then((r) => r.json())
              .catch(() => null),
          ]);

        // Keep refs updated first
        kabkotaGeojsonRef.current = resKabNat;
        geojsonDataRef.current = resGeo;
        allKabkotaRef.current = resKab;
        allProvinsiRef.current = resProv;

        setAllKabkota(resKab);
        setAllProvinsi(resProv);
        setNasionalStats(resNas);
        setPcaMeta(resPca);
        setCorrData(resCorr);
        setGeojsonData(resGeo);
        setKabkotaGeojson(resKabNat);
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
      if (typeof window !== "undefined" && window.Plotly) {
        [
          "quadrant-chart",
          "pca-biplot-chart",
          "parallel-coords-chart",
          "heatmap-chart",
          "radar-chart",
          "treemap-chart",
          "sunburst-chart",
        ].forEach((id) => {
          const el = document.getElementById(id);
          if (el) window.Plotly.Plots.resize(el);
        });
      }
      [
        kabkotaBoundaryMapRef,
        heatmapMapRef,
        leafletMapRef,
        choroplethMapRef,
        lisaMapRef,
      ].forEach((ref) => {
        if (ref.current && typeof ref.current.invalidateSize === "function") {
          ref.current.invalidateSize();
        }
      });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // When active tabs change, invalidate map sizes so they render accurately
  useEffect(() => {
    const timer = setTimeout(() => {
      [
        kabkotaBoundaryMapRef,
        heatmapMapRef,
        leafletMapRef,
        choroplethMapRef,
        lisaMapRef,
      ].forEach((ref) => {
        if (ref.current && typeof ref.current.invalidateSize === "function") {
          ref.current.invalidateSize();
        }
      });
    }, 200);
    return () => clearTimeout(timer);
  }, [activeTab, activeGeoSubtab, activeMultiSubtab, activeHierSubtab]);

  // Otomatis kunci tingkat ke Provinsi saat modul Analisis Berhierarki aktif
  useEffect(() => {
    if (activeTab === "tab-hierarchical") {
      setSelectedTipe("Provinsi");
    }
  }, [activeTab]);

  // Prepare enriched provinces dataset with composite scores and coordinates
  const enrichedProvinsi = allProvinsi.map((pr) => {
    const kabsInProv = allKabkota.filter((d) => d.provinsi === pr.provinsi);
    const count = kabsInProv.length || 1;
    const lats = kabsInProv.filter((d) => d.lat).map((d) => d.lat);
    const lons = kabsInProv.filter((d) => d.lon).map((d) => d.lon);
    const avgLat = lats.length
      ? lats.reduce((a, b) => a + b, 0) / lats.length
      : 0;
    const avgLon = lons.length
      ? lons.reduce((a, b) => a + b, 0) / lons.length
      : 0;
    const kode = kabsInProv[0]
      ? Math.floor(kabsInProv[0].kode_wilayah / 100)
      : 99;

    const skor_eko = +(
      kabsInProv.reduce((a, b) => a + b.skor_ekonomi, 0) / count
    ).toFixed(2);
    const skor_kep = +(
      kabsInProv.reduce((a, b) => a + b.skor_keputusan, 0) / count
    ).toFixed(2);
    const skor_sos = +(
      kabsInProv.reduce((a, b) => a + b.skor_kapasitas_sosial, 0) / count
    ).toFixed(2);
    const ikpp = +(
      kabsInProv.reduce((a, b) => a + b.ikpp_komposit, 0) / count
    ).toFixed(2);
    const pc1 = +(
      kabsInProv.reduce((a, b) => a + (b.pc1 || 0), 0) / count
    ).toFixed(3);
    const pc2 = +(
      kabsInProv.reduce((a, b) => a + (b.pc2 || 0), 0) / count
    ).toFixed(3);

    let kuadran = "Kuadran III (Ekonomi Rendah, Keputusan Rendah)";
    if (skor_eko >= 34.5 && skor_kep >= 47.6)
      kuadran = "Kuadran I (Ekonomi Tinggi, Keputusan Tinggi)";
    else if (skor_eko < 34.5 && skor_kep >= 47.6)
      kuadran = "Kuadran II (Ekonomi Rendah, Keputusan Tinggi)";
    else if (skor_eko >= 34.5 && skor_kep < 47.6)
      kuadran = "Kuadran IV (Ekonomi Tinggi, Keputusan Rendah)";

    return {
      kode_wilayah: kode,
      nama_resmi: "Provinsi " + pr.provinsi,
      wilayah: pr.wilayah || pr.provinsi.toUpperCase(),
      tipe: "Provinsi",
      provinsi: pr.provinsi,
      pulau: pr.pulau,
      lat: +avgLat.toFixed(3),
      lon: +avgLon.toFixed(3),
      parlemen: pr.parlemen,
      pendapatan: pr.pendapatan,
      pengeluaran: pr.pengeluaran,
      ahh: pr.ahh,
      profesional: pr.profesional,
      tpak: pr.tpak,
      rls: pr.rls,
      hls: pr.hls,
      skor_ekonomi: skor_eko,
      skor_keputusan: skor_kep,
      skor_kapasitas_sosial: skor_sos,
      ikpp_komposit: ikpp,
      kuadran: kuadran,
      lisa_cluster_keputusan: "Not Significant",
      lisa_cluster_ekonomi: "Not Significant",
      pc1: pc1,
      pc2: pc2,
    };
  });

  const isProvinsi = selectedTipe === "Provinsi";
  const baseData = isProvinsi ? enrichedProvinsi : allKabkota;

  // Filter Data
  const filteredKabkota = baseData.filter((d) => {
    if (selectedPulau !== "Semua Pulau" && d.pulau !== selectedPulau)
      return false;
    if (selectedProv !== "Semua Provinsi" && d.provinsi !== selectedProv)
      return false;
    if (selectedKuadran !== "Semua Kuadran" && d.kuadran !== selectedKuadran)
      return false;
    return true;
  });

  // Calculate Province Dropdown List
  const availableProvs = [
    "Semua Provinsi",
    ...new Set(
      (selectedPulau === "Semua Pulau"
        ? allProvinsi
        : allProvinsi.filter((d) => d.pulau === selectedPulau)
      ).map((d) => d.provinsi),
    ),
  ].sort();

  // Color Palettes
  const PALETTES = {
    Viridis: [
      "#440154",
      "#482878",
      "#3e4989",
      "#31688e",
      "#26828e",
      "#1f9e89",
      "#35b779",
      "#6ece58",
      "#b5de2b",
      "#fde725",
    ],
    Cividis: [
      "#00204d",
      "#002c69",
      "#003986",
      "#26456e",
      "#41525a",
      "#5b6049",
      "#797037",
      "#998122",
      "#bc930a",
      "#e1a700",
      "#ffd321",
    ],
    Plasma: [
      "#0d0887",
      "#46039f",
      "#7201a8",
      "#9c179e",
      "#bd3786",
      "#d8576b",
      "#ed7953",
      "#fb9f3a",
      "#fdca26",
      "#f0f921",
    ],
    Turbo: [
      "#30123b",
      "#4145ab",
      "#4675ed",
      "#39a2fc",
      "#1bcfd4",
      "#24eca6",
      "#61fc6c",
      "#a4fc3b",
      "#d1e834",
      "#f3c63a",
      "#fe9b2d",
      "#f36315",
      "#d93806",
      "#b11902",
      "#7a0403",
    ],
  };

  // Effect 1: Render Geospatial Maps (Leaflet - completely decoupled from Plotly)
  useEffect(() => {
    if (!dataLoaded || typeof window === "undefined" || !leafletLoaded) return;
    if (activeTab === "tab-geospatial") {
      renderGeospatialTab();
    }
  }, [
    dataLoaded,
    leafletLoaded,
    activeTab,
    activeGeoSubtab,
    selectedPulau,
    selectedProv,
    selectedTipe,
    selectedKuadran,
    selectedPalette,
    geoSizeVar,
    geoColorVar,
    choroplethVar,
    kabkotaChoroplethVar,
    heatmapVar,
    heatmapRadius,
    heatmapBlur,
    heatmapShowBoundaries,
    heatmapShowPoints,
    geojsonData,
    kabkotaGeojson,
    lisaClusterVar,
  ]);

  // Effect 2: Render Plotly Charts (Overview, Multivariate, Hierarchical)
  useEffect(() => {
    if (!dataLoaded || typeof window === "undefined" || !window.Plotly) return;

    if (activeTab === "tab-overview") {
      renderQuadrantScatter();
    } else if (activeTab === "tab-multivariate") {
      renderMultivariateTab();
    } else if (activeTab === "tab-hierarchical") {
      renderHierarchicalTab();
    }
  }, [
    dataLoaded,
    activeTab,
    activeMultiSubtab,
    activeHierSubtab,
    selectedPulau,
    selectedProv,
    selectedTipe,
    selectedKuadran,
    selectedPalette,
    pcaColorBy,
    hierSizeVar,
    hierColorVar,
  ]);

  // 1. Quadrant Scatter
  function renderQuadrantScatter() {
    const medX = 34.5;
    const medY = 47.6;
    const islands = [...new Set(filteredKabkota.map((d) => d.pulau))];

    const traces = islands.map((pulau) => {
      const subset = filteredKabkota.filter((d) => d.pulau === pulau);
      return {
        x: subset.map((d) => d.skor_ekonomi),
        y: subset.map((d) => d.skor_keputusan),
        text: subset.map(
          (d) =>
            `<b>${d.nama_resmi}</b> (${d.provinsi})<br>Parlemen: ${d.parlemen}%<br>Pendapatan: ${d.pendapatan}%<br>Profesional: ${d.profesional}%<br>Pengeluaran: Rp${Number(d.pengeluaran).toLocaleString()}`,
        ),
        mode: "markers",
        name: pulau,
        marker: {
          size: subset.map((d) =>
            Math.max(7, Math.min(22, d.pengeluaran / 750)),
          ),
          opacity: 0.75,
          line: { width: 0.5, color: "#ffffff" },
        },
        hoverinfo: "text",
      };
    });

    const layout = {
      title: {
        text: "<b>Tipologi Kuadran Disparitas: Partisipasi Ekonomi vs Pengambilan Keputusan</b>",
        font: { size: 14 },
      },
      xaxis: {
        title: "Indeks Partisipasi Ekonomi Perempuan (0 - 100)",
        gridcolor: "#f1f5f9",
        zeroline: false,
        range: [10, 88],
      },
      yaxis: {
        title: "Indeks Pengambilan Keputusan Perempuan (0 - 100)",
        gridcolor: "#f1f5f9",
        zeroline: false,
        range: [-2, 85],
      },
      shapes: [
        {
          type: "line",
          x0: medX,
          x1: medX,
          y0: 0,
          y1: 100,
          line: { dash: "dash", color: "#64748b", width: 1.5 },
        },
        {
          type: "line",
          x0: 0,
          x1: 100,
          y0: medY,
          y1: medY,
          line: { dash: "dash", color: "#64748b", width: 1.5 },
        },
      ],
      annotations: [
        {
          x: medX + 22,
          y: medY + 22,
          text: "<b>KUADRAN I</b><br>Maju & Seimbang<br>(Ekonomi Tinggi, Keputusan Tinggi)",
          showarrow: false,
          font: { color: "#16a34a", size: 10.5 },
          bgcolor: "rgba(22, 163, 74, 0.1)",
        },
        {
          x: medX - 14,
          y: medY + 22,
          text: "<b>KUADRAN II</b><br>Representasi Kuat<br>(Ekonomi Rendah, Keputusan Tinggi)",
          showarrow: false,
          font: { color: "#2563eb", size: 10.5 },
          bgcolor: "rgba(37, 99, 235, 0.1)",
        },
        {
          x: medX - 14,
          y: medY - 24,
          text: "<b>KUADRAN III</b><br>Tertinggal Ganda<br>(Ekonomi Rendah, Keputusan Rendah)",
          showarrow: false,
          font: { color: "#dc2626", size: 10.5 },
          bgcolor: "rgba(220, 38, 38, 0.1)",
        },
        {
          x: medX + 22,
          y: medY - 24,
          text: "<b>KUADRAN IV</b><br>Pekerja Keras Kurang Kuasa<br>(Ekonomi Tinggi, Keputusan Rendah)",
          showarrow: false,
          font: { color: "#d97706", size: 10.5 },
          bgcolor: "rgba(217, 119, 6, 0.1)",
        },
      ],
      legend: { orientation: "h", y: -0.18, x: 0.5, xanchor: "center" },
      margin: { l: 50, r: 20, t: 50, b: 60 },
      height: 540,
      paper_bgcolor: "transparent",
      plot_bgcolor: "transparent",
    };

    window.Plotly.react("quadrant-chart", traces, layout, {
      responsive: true,
      displayModeBar: false,
    });
  }

  // 2. Geospatial Views (Leaflet)
  const CLEAN_BASEMAP_URL =
    "https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}";
  const CLEAN_BASEMAP_ATTR =
    "&copy; Esri, HERE, Garmin, &copy; OpenStreetMap";
  const OSM_BASEMAP_URL =
    "https://tile.openstreetmap.org/{z}/{x}/{y}.png";
  const OSM_BASEMAP_ATTR =
    "&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors";

  function createSafeTileLayer(mapInstance) {
    if (!window.L || !mapInstance) return null;
    const tileLayer = window.L.tileLayer(CLEAN_BASEMAP_URL, {
      attribution: CLEAN_BASEMAP_ATTR,
      maxZoom: 18,
    });
    tileLayer.on("tileerror", function () {
      if (!mapInstance._osmFallbackAdded) {
        mapInstance._osmFallbackAdded = true;
        try {
          window.L.tileLayer(OSM_BASEMAP_URL, {
            attribution: OSM_BASEMAP_ATTR,
            maxZoom: 18,
          }).addTo(mapInstance);
        } catch (e) {}
      }
    });
    tileLayer.addTo(mapInstance);
    return tileLayer;
  }

  function getSafeActiveGeo(isProv) {
    if (isProv) {
      return (
        geojsonDataRef.current ||
        geojsonData ||
        kabkotaGeojsonRef.current ||
        kabkotaGeojson
      );
    }
    return kabkotaGeojsonRef.current || kabkotaGeojson;
  }

  function renderGeospatialTab() {
    if (typeof window === "undefined" || !window.L) {
      setTimeout(renderGeospatialTab, 100);
      return;
    }
    setTimeout(() => {
      if (activeGeoSubtab === "geo-subtab-kabkota-boundary") {
        renderLeafletKabkotaBoundary();
      } else if (activeGeoSubtab === "geo-subtab-heatmap") {
        renderLeafletHeatmap();
      } else if (activeGeoSubtab === "geo-subtab-proportional") {
        renderLeafletProportional();
      } else if (activeGeoSubtab === "geo-subtab-choropleth") {
        renderLeafletChoropleth();
      } else if (activeGeoSubtab === "geo-subtab-lisa") {
        renderLeafletLISA();
      }
    }, 60);
  }

  // 2a. Peta Batas Wilayah (GeoJSON 38 Batas Murni Provinsi saat Provinsi, atau 514 Kab/Kota)
  function renderLeafletKabkotaBoundary() {
    if (typeof window === "undefined" || !window.L) {
      setTimeout(renderLeafletKabkotaBoundary, 100);
      return;
    }
    const el = document.getElementById("kabkota-boundary-map");
    if (!el) {
      setTimeout(renderLeafletKabkotaBoundary, 100);
      return;
    }
    const activeGeo = getSafeActiveGeo(isProvinsi);
    if (!activeGeo || !activeGeo.features) {
      setTimeout(renderLeafletKabkotaBoundary, 150);
      return;
    }

    el.style.width = "100%";
    el.style.height = "600px";

    if (!kabkotaBoundaryMapRef.current || kabkotaBoundaryMapRef.current.getContainer() !== el) {
      if (kabkotaBoundaryMapRef.current) {
        try { kabkotaBoundaryMapRef.current.remove(); } catch (e) {}
        kabkotaBoundaryMapRef.current = null;
      }
      if (el._leaflet_id) {
        el._leaflet_id = null;
      }
      kabkotaBoundaryMapRef.current = window.L.map("kabkota-boundary-map", {
        scrollWheelZoom: false,
        attributionControl: true,
      }).setView([-2.2, 118.0], 5);

      createSafeTileLayer(kabkotaBoundaryMapRef.current);
    } else {
      kabkotaBoundaryMapRef.current.eachLayer((layer) => {
        if (layer instanceof window.L.GeoJSON)
          kabkotaBoundaryMapRef.current.removeLayer(layer);
      });
    }

    const palette = PALETTES[selectedPalette] || PALETTES["Viridis"];

    const isCategorical = [
      "kuadran",
      "lisa_cluster_keputusan",
      "lisa_cluster_ekonomi",
    ].includes(kabkotaChoroplethVar);
    let minVal = 0;
    let maxVal = 100;

    if (!isCategorical) {
      const sourceList = isProvinsi
        ? enrichedProvinsi
        : activeGeo.features.map((f) => f.properties).filter(Boolean);
      const vals = sourceList
        .map((f) => f[kabkotaChoroplethVar])
        .filter((v) => v !== undefined && v !== null && !isNaN(v));
      if (vals.length > 0) {
        minVal = Math.min(...vals);
        maxVal = Math.max(...vals);
      }
    }

    function getPolygonColor(props) {
      if (!props) return "#cbd5e1";
      let val = props[kabkotaChoroplethVar];
      if (isProvinsi) {
        const provItem = enrichedProvinsi.find(
          (p) => p.provinsi === props.provinsi,
        );
        if (provItem) val = provItem[kabkotaChoroplethVar];
      }
      if (val === undefined || val === null) return "#cbd5e1";

      if (kabkotaChoroplethVar === "kuadran") {
        const str = String(val);
        if (str.includes("Kuadran I")) return "#16a34a";
        if (str.includes("Kuadran II")) return "#2563eb";
        if (str.includes("Kuadran III")) return "#dc2626";
        if (str.includes("Kuadran IV")) return "#d97706";
        return "#94a3b8";
      }

      if (
        kabkotaChoroplethVar === "lisa_cluster_keputusan" ||
        kabkotaChoroplethVar === "lisa_cluster_ekonomi"
      ) {
        const clusters = {
          "High-High (Hotspot)": "#dc2626",
          "Low-Low (Coldspot)": "#2563eb",
          "High-Low (Spatial Outlier)": "#f97316",
          "Low-High (Spatial Outlier)": "#10b981",
          "Not Significant": "#cbd5e1",
        };
        return clusters[val] || "#cbd5e1";
      }

      const norm = (val - minVal) / (maxVal - minVal || 1);
      const idx = Math.min(
        palette.length - 1,
        Math.max(0, Math.floor(norm * (palette.length - 1))),
      );
      return palette[idx];
    }

    const geoLayer = window.L.geoJson(activeGeo, {
      filter: (feature) => {
        if (!feature || !feature.properties) return false;
        if (
          selectedPulau !== "Semua Pulau" &&
          feature.properties.pulau !== selectedPulau
        )
          return false;
        return true;
      },
      style: (feature) => {
        const p = feature.properties || {};
        const matchesFilter =
          selectedProv === "Semua Provinsi" || p.provinsi === selectedProv;
        return {
          fillColor: getPolygonColor(p),
          weight: isProvinsi ? 1.8 : 1.1,
          opacity: 1,
          color: "#ffffff",
          dashArray: isProvinsi ? "" : "1",
          fillOpacity: matchesFilter ? 0.85 : 0.2,
        };
      },
      onEachFeature: (feature, layer) => {
        const p = feature.properties || {};
        const provItem = isProvinsi
          ? enrichedProvinsi.find((pr) => pr.provinsi === p.provinsi)
          : null;
        const activeItem = provItem || p;
        const val = activeItem[kabkotaChoroplethVar];
        const displayVal =
          typeof val === "number"
            ? kabkotaChoroplethVar === "pengeluaran"
              ? `Rp${Number(val).toLocaleString("id-ID")}`
              : `${val.toFixed(2)}%`
            : val || "N/A";

        layer.bindTooltip(
          `
          <div style="font-family: sans-serif; font-size: 12px; line-height: 1.4;">
            <strong style="color: #0f172a; font-size: 13px;">${isProvinsi ? `Provinsi ${p.provinsi}` : p.nama_resmi || p.WADMKK}</strong><br/>
            <span style="color: #64748b;">${isProvinsi ? `Agregat Tingkat I &bull; ${p.pulau}` : `${p.provinsi} (${p.tipe || "Kab/Kota"})`}</span>
            <div style="margin-top: 5px; padding-top: 5px; border-top: 1px solid #e2e8f0; font-weight: 600;">
              ${kabkotaChoroplethVar.toUpperCase()}: <span style="color: #2563eb; font-weight: 800;">${displayVal}</span>
            </div>
            <div style="font-size: 11px; color: #059669; font-weight: 600; margin-top: 2px;">
              ${activeItem.kuadran ? activeItem.kuadran.split("(")[0] : ""}
            </div>
          </div>
        `,
          { sticky: true },
        );

        layer.on({
          mouseover: (e) => {
            const l = e.target;
            l.setStyle({
              weight: isProvinsi ? 3.0 : 2.8,
              color: "#0f172a",
              dashArray: "",
              fillOpacity: 0.95,
            });
            l.bringToFront();
          },
          mouseout: (e) => {
            geoLayer.resetStyle(e.target);
          },
          click: (e) => {
            setSelectedKabDetail(activeItem);
            try {
              kabkotaBoundaryMapRef.current.fitBounds(e.target.getBounds(), {
                padding: [35, 35],
              });
            } catch (err) {}
          },
        });
      },
    }).addTo(kabkotaBoundaryMapRef.current);

    if (selectedProv !== "Semua Provinsi") {
      const provFeatures = activeGeo.features.filter(
        (f) => f.properties && f.properties.provinsi === selectedProv,
      );
      if (provFeatures.length > 0) {
        const tempGroup = window.L.geoJson({
          type: "FeatureCollection",
          features: provFeatures,
        });
        try {
          kabkotaBoundaryMapRef.current.fitBounds(tempGroup.getBounds(), {
            padding: [30, 30],
          });
        } catch (e) {}
      }
    } else if (selectedPulau !== "Semua Pulau") {
      const pulauFeatures = activeGeo.features.filter(
        (f) => f.properties && f.properties.pulau === selectedPulau,
      );
      if (pulauFeatures.length > 0) {
        const tempGroup = window.L.geoJson({
          type: "FeatureCollection",
          features: pulauFeatures,
        });
        try {
          kabkotaBoundaryMapRef.current.fitBounds(tempGroup.getBounds(), {
            padding: [30, 30],
          });
        } catch (e) {}
      }
    } else {
      kabkotaBoundaryMapRef.current.setView([-2.2, 118.0], 5);
    }

    // Floating On-Map Legend Control (Leaflet)
    if (!isCategorical) {
      const gradient =
        PALETTE_GRADIENTS[selectedPalette] || PALETTE_GRADIENTS.Viridis;
      const minStr = formatStatValue(minVal, kabkotaChoroplethVar);
      const maxStr = formatStatValue(maxVal, kabkotaChoroplethVar);
      const label = getVarLabel(kabkotaChoroplethVar);
      updateMapLegendControl(
        kabkotaBoundaryMapRef.current,
        `<div class="leg-title">
          <span>${label}</span>
          <span class="leg-badge">${isProvinsi ? "38 Prov" : "514 Kab/Kota"}</span>
        </div>
        <div class="leg-ramp" style="background:${gradient}"></div>
        <div class="leg-ticks">
          <span>${minStr}</span>
          <span>${maxStr}</span>
        </div>
        <div class="leg-subticks">
          <span>Min (Rendah)</span>
          <span>Max (Tinggi)</span>
        </div>`
      );
    } else if (kabkotaChoroplethVar === "kuadran") {
      updateMapLegendControl(
        kabkotaBoundaryMapRef.current,
        `<div class="leg-title">
          <span>Tipologi 4 Kuadran</span>
          <span class="leg-badge">Klasifikasi</span>
        </div>
        <div class="leg-cat-list">
          <div class="leg-cat-item"><span class="leg-cat-swatch" style="background:#16a34a"></span><span>Q1: Maju &amp; Seimbang</span></div>
          <div class="leg-cat-item"><span class="leg-cat-swatch" style="background:#2563eb"></span><span>Q2: Representasi Kuat</span></div>
          <div class="leg-cat-item"><span class="leg-cat-swatch" style="background:#dc2626"></span><span>Q3: Tertinggal Ganda</span></div>
          <div class="leg-cat-item"><span class="leg-cat-swatch" style="background:#d97706"></span><span>Q4: Pekerja Tanpa Kuasa</span></div>
        </div>`
      );
    }

    kabkotaBoundaryMapRef.current.invalidateSize();
    setTimeout(() => {
      if (kabkotaBoundaryMapRef.current) kabkotaBoundaryMapRef.current.invalidateSize();
    }, 150);
    setTimeout(() => {
      if (kabkotaBoundaryMapRef.current) kabkotaBoundaryMapRef.current.invalidateSize();
    }, 400);
  }

  // 2b. Peta Heatmap Spasial Kab/Kota (Kernel Density Estimation)
  function renderLeafletHeatmap() {
    if (typeof window === "undefined" || !window.L) {
      setTimeout(renderLeafletHeatmap, 100);
      return;
    }
    const el = document.getElementById("heatmap-map");
    if (!el) {
      setTimeout(renderLeafletHeatmap, 100);
      return;
    }

    if (!window.L.heatLayer) {
      setTimeout(renderLeafletHeatmap, 100);
      return;
    }

    el.style.width = "100%";
    el.style.height = "600px";

    if (!heatmapMapRef.current || heatmapMapRef.current.getContainer() !== el) {
      if (heatmapMapRef.current) {
        try { heatmapMapRef.current.remove(); } catch (e) {}
        heatmapMapRef.current = null;
      }
      if (el._leaflet_id) {
        el._leaflet_id = null;
      }
      heatmapMapRef.current = window.L.map("heatmap-map", {
        scrollWheelZoom: false,
        attributionControl: true,
      }).setView([-2.2, 118.0], 5);

      createSafeTileLayer(heatmapMapRef.current);
    } else {
      heatmapMapRef.current.eachLayer((layer) => {
        if (layer instanceof window.L.TileLayer) return;
        heatmapMapRef.current.removeLayer(layer);
      });
    }

    const dataset = filteredKabkota;
    const validData = dataset.filter(
      (d) =>
        d.lat && d.lon && d[heatmapVar] !== undefined && d[heatmapVar] !== null,
    );
    if (validData.length === 0) return;

    const minV = Math.min(...validData.map((d) => d[heatmapVar]));
    const maxV = Math.max(...validData.map((d) => d[heatmapVar]));

    const heatPoints = validData.map((d) => {
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
        0.15: "#3b82f6",
        0.35: "#06b6d4",
        0.55: "#10b981",
        0.75: "#f59e0b",
        0.95: "#ef4444",
      },
    }).addTo(heatmapMapRef.current);

    const activeGeo = getSafeActiveGeo(isProvinsi);

    if (heatmapShowBoundaries && activeGeo && activeGeo.features) {
      window.L.geoJson(activeGeo, {
        filter: (feature) => {
          if (!feature || !feature.properties) return false;
          if (
            selectedPulau !== "Semua Pulau" &&
            feature.properties.pulau !== selectedPulau
          )
            return false;
          return true;
        },
        style: () => ({
          fillColor: "transparent",
          fillOpacity: 0,
          color: "#334155",
          weight: isProvinsi ? 1.6 : 1.1,
          opacity: 0.65,
          dashArray: isProvinsi ? "" : "3",
        }),
        onEachFeature: (feature, layer) => {
          layer.bindTooltip(
            isProvinsi
              ? `<b>Provinsi ${feature.properties?.provinsi || ""}</b>`
              : `<b>${feature.properties?.nama_resmi || ""}</b> (${feature.properties?.provinsi || ""})`,
            { sticky: true },
          );
        },
      }).addTo(heatmapMapRef.current);
    }

    if (heatmapShowPoints) {
      validData.forEach((d) => {
        const marker = window.L.circleMarker([d.lat, d.lon], {
          radius: 3.5,
          color: "#0f172a",
          fillColor: "#ffffff",
          weight: 1.2,
          opacity: 0.9,
          fillOpacity: 0.85,
        }).addTo(heatmapMapRef.current);

        marker.bindPopup(`
          <div style="font-family: sans-serif; font-size: 12px;">
            <b>${d.nama_resmi}</b> (${d.provinsi})<br>
            <b>${heatmapVar.toUpperCase()}:</b> ${typeof d[heatmapVar] === "number" ? (heatmapVar === "pengeluaran" ? "Rp" + Number(d[heatmapVar]).toLocaleString("id-ID") : d[heatmapVar].toFixed(2) + "%") : d[heatmapVar]}<br>
            <span style="color: #64748b; font-size: 11px;">Lat: ${d.lat.toFixed(3)}, Lon: ${d.lon.toFixed(3)}</span>
          </div>
        `);
      });
    }

    if (selectedProv !== "Semua Provinsi" || selectedPulau !== "Semua Pulau") {
      const filteredGeo = activeGeo?.features?.filter((f) => {
        if (!f || !f.properties) return false;
        if (
          selectedPulau !== "Semua Pulau" &&
          f.properties.pulau !== selectedPulau
        )
          return false;
        if (
          selectedProv !== "Semua Provinsi" &&
          f.properties.provinsi !== selectedProv
        )
          return false;
        return true;
      });
      if (filteredGeo && filteredGeo.length > 0) {
        const tempGroup = window.L.geoJson({
          type: "FeatureCollection",
          features: filteredGeo,
        });
        try {
          heatmapMapRef.current.fitBounds(tempGroup.getBounds(), {
            padding: [30, 30],
          });
        } catch (e) {}
      } else {
        heatmapMapRef.current.setView([-2.2, 118.0], 5);
      }
    } else {
      heatmapMapRef.current.setView([-2.2, 118.0], 5);
    }

    // Floating On-Map Legend Control (Leaflet)
    const heatGradient =
      "linear-gradient(to right, #3b82f6, #06b6d4, #10b981, #f59e0b, #ef4444)";
    const minHeatStr = formatStatValue(minV, heatmapVar);
    const maxHeatStr = formatStatValue(maxV, heatmapVar);
    const heatLabel = getVarLabel(heatmapVar);
    updateMapLegendControl(
      heatmapMapRef.current,
      `<div class="leg-title">
        <span>Heatmap: ${heatLabel}</span>
        <span class="leg-badge">KDE Surface</span>
      </div>
      <div class="leg-ramp" style="background:${heatGradient}"></div>
      <div class="leg-ticks">
        <span>${minHeatStr}</span>
        <span>${maxHeatStr}</span>
      </div>
      <div class="leg-subticks">
        <span>Coldspot (Min)</span>
        <span>Hotspot (Max)</span>
      </div>`
    );

    heatmapMapRef.current.invalidateSize();
    setTimeout(() => {
      if (heatmapMapRef.current) heatmapMapRef.current.invalidateSize();
    }, 150);
    setTimeout(() => {
      if (heatmapMapRef.current) heatmapMapRef.current.invalidateSize();
    }, 400);
  }

  function renderLeafletProportional() {
    if (typeof window === "undefined" || !window.L) {
      setTimeout(renderLeafletProportional, 100);
      return;
    }
    const el = document.getElementById("leaflet-map");
    if (!el) {
      setTimeout(renderLeafletProportional, 100);
      return;
    }

    el.style.width = "100%";
    el.style.height = "600px";

    if (!leafletMapRef.current || leafletMapRef.current.getContainer() !== el) {
      if (leafletMapRef.current) {
        try { leafletMapRef.current.remove(); } catch (e) {}
        leafletMapRef.current = null;
      }
      if (el._leaflet_id) {
        el._leaflet_id = null;
      }
      leafletMapRef.current = window.L.map("leaflet-map", {
        scrollWheelZoom: false,
        attributionControl: true,
      }).setView([-2.2, 118.0], 5);

      createSafeTileLayer(leafletMapRef.current);
    } else {
      leafletMapRef.current.eachLayer((layer) => {
        if (layer instanceof window.L.CircleMarker)
          leafletMapRef.current.removeLayer(layer);
      });
    }

    const minVal = Math.min(...filteredKabkota.map((d) => d[geoColorVar]));
    const maxVal = Math.max(...filteredKabkota.map((d) => d[geoColorVar]));
    const palette = PALETTES[selectedPalette] || PALETTES["Viridis"];

    function getColor(val) {
      const norm = (val - minVal) / (maxVal - minVal || 1);
      const idx = Math.min(
        palette.length - 1,
        Math.max(0, Math.floor(norm * (palette.length - 1))),
      );
      return palette[idx];
    }

    filteredKabkota.forEach((d) => {
      if (d.lat && d.lon) {
        let radius = 6;
        if (geoSizeVar === "pengeluaran")
          radius = Math.max(4, Math.min(18, d.pengeluaran / 1000));
        else if (geoSizeVar === "tpak")
          radius = Math.max(4, Math.min(18, d.tpak / 6));
        else radius = Math.max(4, Math.min(18, (d[geoSizeVar] || 10) / 4));

        const marker = window.L.circleMarker([d.lat, d.lon], {
          radius: radius,
          fillColor: getColor(d[geoColorVar]),
          color: "#ffffff",
          weight: 1,
          opacity: 0.9,
          fillOpacity: 0.75,
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

    // Floating On-Map Legend Control (Leaflet)
    const propGradient =
      PALETTE_GRADIENTS[selectedPalette] || PALETTE_GRADIENTS.Viridis;
    const minColorStr = formatStatValue(minVal, geoColorVar);
    const maxColorStr = formatStatValue(maxVal, geoColorVar);
    const sizeVals = filteredKabkota
      .map((d) => d[geoSizeVar])
      .filter((v) => v !== undefined && v !== null && !isNaN(v));
    const minSize = sizeVals.length ? Math.min(...sizeVals) : 0;
    const maxSize = sizeVals.length ? Math.max(...sizeVals) : 100;
    const minSizeStr = formatStatValue(minSize, geoSizeVar);
    const maxSizeStr = formatStatValue(maxSize, geoSizeVar);

    updateMapLegendControl(
      leafletMapRef.current,
      `<div class="leg-title">
        <span>Simbol Dwipeubah</span>
        <span class="leg-badge">Bivariate</span>
      </div>
      <div style="font-size:9.5px;font-weight:700;color:#475569;margin-bottom:3px;">
        Warna: ${getVarLabel(geoColorVar)}
      </div>
      <div class="leg-ramp" style="background:${propGradient}"></div>
      <div class="leg-ticks">
        <span>${minColorStr}</span>
        <span>${maxColorStr}</span>
      </div>
      <div class="leg-subticks" style="margin-bottom:6px;">
        <span>Min</span>
        <span>Max</span>
      </div>
      <div style="font-size:9.5px;font-weight:700;color:#475569;margin-bottom:4px;border-top:1px dashed #cbd5e1;padding-top:4px;">
        Ukuran: ${getVarLabel(geoSizeVar)}
      </div>
      <div style="display:flex;align-items:center;justify-content:space-between;padding:0 2px;">
        <div style="display:flex;align-items:center;gap:4px;">
          <span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:#1F5FCC;border:1px solid #0B2F63;"></span>
          <span style="font-size:9.5px;font-weight:700;">${minSizeStr}</span>
        </div>
        <div style="display:flex;align-items:center;gap:4px;">
          <span style="display:inline-block;width:18px;height:18px;border-radius:50%;background:#1F5FCC;border:1px solid #0B2F63;"></span>
          <span style="font-size:9.5px;font-weight:700;">${maxSizeStr}</span>
        </div>
      </div>`
    );

    leafletMapRef.current.invalidateSize();
    setTimeout(() => {
      if (leafletMapRef.current) leafletMapRef.current.invalidateSize();
    }, 150);
    setTimeout(() => {
      if (leafletMapRef.current) leafletMapRef.current.invalidateSize();
    }, 400);
  }

  function renderLeafletChoropleth() {
    if (typeof window === "undefined" || !window.L) {
      setTimeout(renderLeafletChoropleth, 100);
      return;
    }
    const el = document.getElementById("choropleth-map");
    if (!el) {
      setTimeout(renderLeafletChoropleth, 100);
      return;
    }
    const activeGeo = getSafeActiveGeo(true);
    if (!activeGeo || !activeGeo.features) {
      setTimeout(renderLeafletChoropleth, 150);
      return;
    }

    el.style.width = "100%";
    el.style.height = "600px";

    if (!choroplethMapRef.current || choroplethMapRef.current.getContainer() !== el) {
      if (choroplethMapRef.current) {
        try { choroplethMapRef.current.remove(); } catch (e) {}
        choroplethMapRef.current = null;
      }
      if (el._leaflet_id) {
        el._leaflet_id = null;
      }
      choroplethMapRef.current = window.L.map("choropleth-map", {
        scrollWheelZoom: false,
        attributionControl: true,
      }).setView([-2.2, 118.0], 5);

      createSafeTileLayer(choroplethMapRef.current);
    } else {
      choroplethMapRef.current.eachLayer((layer) => {
        if (layer instanceof window.L.GeoJSON)
          choroplethMapRef.current.removeLayer(layer);
      });
    }

    const provMap = {};
    allProvinsi.forEach((p) => {
      provMap[p.provinsi.toUpperCase()] = p[choroplethVar];
    });

    const vals = Object.values(provMap);
    const minVal = Math.min(...vals);
    const maxVal = Math.max(...vals);
    const palette = PALETTES[selectedPalette] || PALETTES["Viridis"];

    function getColor(val) {
      if (val === undefined || isNaN(val)) return "#cbd5e1";
      const norm = (val - minVal) / (maxVal - minVal || 1);
      const idx = Math.min(
        palette.length - 1,
        Math.max(0, Math.floor(norm * (palette.length - 1))),
      );
      return palette[idx];
    }

    window.L.geoJson(activeGeo, {
      style: (feature) => {
        const name = (
          feature.properties?.provinsi ||
          feature.properties?.Propinsi ||
          feature.properties?.name ||
          ""
        ).toUpperCase();
        const val =
          provMap[name] ||
          provMap[name.replace("IRIAN JAYA BARAT", "PAPUA BARAT")];
        return {
          fillColor: getColor(val),
          weight: 1.5,
          opacity: 1,
          color: "#ffffff",
          dashArray: "",
          fillOpacity: 0.85,
        };
      },
      onEachFeature: (feature, layer) => {
        const name =
          feature.properties?.provinsi ||
          feature.properties?.Propinsi ||
          feature.properties?.name ||
          "";
        const val = provMap[(name || "").toUpperCase()] || "N/A";
        layer.bindTooltip(
          `<b>Provinsi ${name}</b><br>${choroplethVar.toUpperCase()}: ${val}`,
        );
      },
    }).addTo(choroplethMapRef.current);

    // Floating On-Map Legend Control (Leaflet)
    const choroGradient =
      PALETTE_GRADIENTS[selectedPalette] || PALETTE_GRADIENTS.Viridis;
    const minChoroStr = formatStatValue(minVal, choroplethVar);
    const maxChoroStr = formatStatValue(maxVal, choroplethVar);
    const choroLabel = getVarLabel(choroplethVar);
    updateMapLegendControl(
      choroplethMapRef.current,
      `<div class="leg-title">
        <span>Choropleth: ${choroLabel}</span>
        <span class="leg-badge">38 Provinsi</span>
      </div>
      <div class="leg-ramp" style="background:${choroGradient}"></div>
      <div class="leg-ticks">
        <span>${minChoroStr}</span>
        <span>${maxChoroStr}</span>
      </div>
      <div class="leg-subticks">
        <span>Terendah (Min)</span>
        <span>Tertinggi (Max)</span>
      </div>`
    );

    choroplethMapRef.current.invalidateSize();
    setTimeout(() => {
      if (choroplethMapRef.current) choroplethMapRef.current.invalidateSize();
    }, 150);
    setTimeout(() => {
      if (choroplethMapRef.current) choroplethMapRef.current.invalidateSize();
    }, 400);
  }

  function renderLeafletLISA() {
    if (typeof window === "undefined" || !window.L) {
      setTimeout(renderLeafletLISA, 100);
      return;
    }
    const el = document.getElementById("lisa-map");
    if (!el) {
      setTimeout(renderLeafletLISA, 100);
      return;
    }

    el.style.width = "100%";
    el.style.height = "600px";

    if (!lisaMapRef.current || lisaMapRef.current.getContainer() !== el) {
      if (lisaMapRef.current) {
        try { lisaMapRef.current.remove(); } catch (e) {}
        lisaMapRef.current = null;
      }
      if (el._leaflet_id) {
        el._leaflet_id = null;
      }
      lisaMapRef.current = window.L.map("lisa-map", {
        scrollWheelZoom: false,
        attributionControl: true,
      }).setView([-2.2, 118.0], 5);

      createSafeTileLayer(lisaMapRef.current);
    } else {
      lisaMapRef.current.eachLayer((layer) => {
        if (layer instanceof window.L.CircleMarker)
          lisaMapRef.current.removeLayer(layer);
      });
    }

    const clusterColors = {
      "High-High (Hotspot)": "#dc2626",
      "Low-Low (Coldspot)": "#2563eb",
      "High-Low (Spatial Outlier)": "#f97316",
      "Low-High (Spatial Outlier)": "#10b981",
      "Not Significant": "#cbd5e1",
    };

    filteredKabkota.forEach((d) => {
      if (d.lat && d.lon) {
        const c = d[lisaClusterVar] || "Not Significant";
        const isSig = c !== "Not Significant";
        const marker = window.L.circleMarker([d.lat, d.lon], {
          radius: isSig ? 8 : 4.5,
          fillColor: clusterColors[c] || "#cbd5e1",
          color: "#ffffff",
          weight: 1,
          opacity: 0.9,
          fillOpacity: isSig ? 0.85 : 0.4,
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

    // Floating On-Map Legend Control (Leaflet)
    const lisaLabel =
      lisaClusterVar === "lisa_cluster_keputusan"
        ? "LISA Keputusan"
        : "LISA Ekonomi";
    updateMapLegendControl(
      lisaMapRef.current,
      `<div class="leg-title">
        <span>Klaster ${lisaLabel}</span>
        <span class="leg-badge">p &lt; 0.05</span>
      </div>
      <div class="leg-cat-list">
        <div class="leg-cat-item"><span class="leg-cat-swatch" style="background:#dc2626"></span><span>High-High (Hotspot)</span></div>
        <div class="leg-cat-item"><span class="leg-cat-swatch" style="background:#2563eb"></span><span>Low-Low (Coldspot)</span></div>
        <div class="leg-cat-item"><span class="leg-cat-swatch" style="background:#f97316"></span><span>High-Low (Outlier Positif)</span></div>
        <div class="leg-cat-item"><span class="leg-cat-swatch" style="background:#10b981"></span><span>Low-High (Outlier Negatif)</span></div>
        <div class="leg-cat-item"><span class="leg-cat-swatch" style="background:#cbd5e1"></span><span>Tidak Signifikan</span></div>
      </div>`
    );

    lisaMapRef.current.invalidateSize();
    setTimeout(() => {
      if (lisaMapRef.current) lisaMapRef.current.invalidateSize();
    }, 150);
    setTimeout(() => {
      if (lisaMapRef.current) lisaMapRef.current.invalidateSize();
    }, 400);
  }

  // 3. Multivariate Views
  function renderMultivariateTab() {
    if (activeMultiSubtab === "multi-subtab-pca") {
      renderPCABiplot();
    } else if (activeMultiSubtab === "multi-subtab-parcoords") {
      renderParallelCoords();
    } else if (activeMultiSubtab === "multi-subtab-heatmap") {
      renderHeatmap();
    } else if (activeMultiSubtab === "multi-subtab-radar") {
      renderRadar();
    }
  }

  function renderPCABiplot() {
    if (!pcaMeta || !pcaMeta.loadings) return;
    const groups = [...new Set(filteredKabkota.map((d) => d[pcaColorBy]))];
    const traces = groups.map((grp) => {
      const subset = filteredKabkota.filter((d) => d[pcaColorBy] === grp);
      return {
        x: subset.map((d) => d.pc1),
        y: subset.map((d) => d.pc2),
        mode: "markers",
        name: grp,
        text: subset.map(
          (d) =>
            `<b>${d.nama_resmi}</b> (${d.provinsi})<br>PC1: ${d.pc1}<br>PC2: ${d.pc2}<br>Parlemen: ${d.parlemen}%<br>Pendapatan: ${d.pendapatan}%`,
        ),
        hoverinfo: "text",
        marker: { size: 7, opacity: 0.75 },
      };
    });

    const annotations = [];
    pcaMeta.loadings.forEach((l) => {
      annotations.push({
        ax: 0,
        ay: 0,
        x: l.x,
        y: l.y,
        xref: "x",
        yref: "y",
        axref: "x",
        ayref: "y",
        showarrow: true,
        arrowhead: 3,
        arrowsize: 1.2,
        arrowwidth: 2,
        arrowcolor: "#dc2626",
      });
      annotations.push({
        x: l.x * 1.15,
        y: l.y * 1.15,
        text: `<b>${l.label}</b>`,
        showarrow: false,
        font: { color: "#991b1b", size: 10 },
        bgcolor: "rgba(255, 255, 255, 0.85)",
      });
    });

    const layout = {
      title: {
        text: `<b>PCA Biplot: 8 Indikator Gender (PC1: ${pcaMeta.var_exp_pc1}%, PC2: ${pcaMeta.var_exp_pc2}%)</b>`,
        font: { size: 13.5 },
      },
      xaxis: {
        title: `Komponen Utama 1 (${pcaMeta.var_exp_pc1}% Variansi: Kapasitas Sosial & Hidup Layak)`,
        zeroline: true,
        gridcolor: "#f1f5f9",
      },
      yaxis: {
        title: `Komponen Utama 2 (${pcaMeta.var_exp_pc2}% Variansi: Partisipasi Politik vs Kerja Fisik)`,
        zeroline: true,
        gridcolor: "#f1f5f9",
      },
      annotations: annotations,
      legend: { orientation: "h", y: -0.16, x: 0.5, xanchor: "center" },
      margin: { l: 50, r: 20, t: 50, b: 60 },
      height: 540,
      paper_bgcolor: "transparent",
      plot_bgcolor: "transparent",
    };

    window.Plotly.react("pca-biplot-chart", traces, layout, {
      responsive: true,
      displayModeBar: false,
    });
  }

  function renderParallelCoords() {
    const trace = {
      type: "parcoords",
      line: {
        color: filteredKabkota.map((d) => d.skor_keputusan),
        colorscale: "Viridis",
        showscale: true,
        colorbar: { title: "Skor Keputusan" },
      },
      dimensions: [
        {
          range: [0, 50],
          label: "Parlemen (%)",
          values: filteredKabkota.map((d) => d.parlemen),
        },
        {
          range: [10, 65],
          label: "Pendapatan (%)",
          values: filteredKabkota.map((d) => d.pendapatan),
        },
        {
          range: [4000, 20000],
          label: "Pengeluaran",
          values: filteredKabkota.map((d) => d.pengeluaran),
        },
        {
          range: [55, 80],
          label: "AHH (Thn)",
          values: filteredKabkota.map((d) => d.ahh),
        },
        {
          range: [0, 100],
          label: "Profesional (%)",
          values: filteredKabkota.map((d) => d.profesional),
        },
        {
          range: [30, 95],
          label: "TPAK (%)",
          values: filteredKabkota.map((d) => d.tpak),
        },
        {
          range: [2, 13],
          label: "RLS (Thn)",
          values: filteredKabkota.map((d) => d.rls),
        },
        {
          range: [4, 16],
          label: "HLS (Thn)",
          values: filteredKabkota.map((d) => d.hls),
        },
      ],
    };

    const layout = {
      title: {
        text: "<b>Diagram Koordinat Paralel (Brushing & Filtering 8 Peubah)</b>",
        font: { size: 13.5 },
      },
      margin: { l: 60, r: 40, t: 60, b: 30 },
      height: 500,
      paper_bgcolor: "transparent",
    };

    window.Plotly.react("parallel-coords-chart", [trace], layout, {
      responsive: true,
      displayModeBar: false,
    });
  }

  function renderHeatmap() {
    if (!corrData || !corrData.z) return;
    const trace = {
      z: corrData.z,
      x: corrData.labels,
      y: corrData.labels,
      type: "heatmap",
      colorscale: "RdBu",
      reversescale: true,
      zmin: -1,
      zmax: 1,
      colorbar: { title: "Korelasi" },
    };
    const layout = {
      title: {
        text: "<b>Clustered Heatmap: Matriks Asosiasi 8 Indikator BPS</b>",
        font: { size: 13.5 },
      },
      margin: { l: 120, r: 20, t: 50, b: 120 },
      height: 500,
      paper_bgcolor: "transparent",
    };
    window.Plotly.react("heatmap-chart", [trace], layout, {
      responsive: true,
      displayModeBar: false,
    });
  }

  function renderRadar() {
    const vars = [
      "parlemen",
      "pendapatan",
      "profesional",
      "tpak",
      "rls",
      "hls",
      "ahh",
      "pengeluaran",
    ];
    const labels = [
      "Parlemen",
      "Pendapatan",
      "Profesional",
      "TPAK",
      "RLS",
      "HLS",
      "AHH",
      "Pengeluaran",
    ];

    const mins = {};
    const maxs = {};
    vars.forEach((v) => {
      mins[v] = Math.min(...allKabkota.map((d) => d[v]));
      maxs[v] = Math.max(...allKabkota.map((d) => d[v]));
    });

    const groups = ["Jawa", "Sulawesi", "Papua"];
    const traces = groups.map((grp) => {
      const subset = allKabkota.filter((d) => d.pulau === grp);
      const avgVals = vars.map((v) => {
        const avg = subset.reduce((acc, d) => acc + d[v], 0) / subset.length;
        return ((avg - mins[v]) / (maxs[v] - mins[v])) * 100;
      });
      avgVals.push(avgVals[0]);
      return {
        type: "scatterpolar",
        r: avgVals,
        theta: [...labels, labels[0]],
        fill: "toself",
        name: grp,
        opacity: 0.6,
      };
    });

    const layout = {
      title: {
        text: "<b>Radar Chart: Perbandingan Profil Multidimensi Antar Wilayah</b>",
        font: { size: 13.5 },
      },
      polar: { radialaxis: { visible: true, range: [0, 100] } },
      margin: { l: 40, r: 40, t: 50, b: 40 },
      height: 480,
      paper_bgcolor: "transparent",
    };

    window.Plotly.react("radar-chart", traces, layout, {
      responsive: true,
      displayModeBar: false,
    });
  }

  // 4. Hierarchical Views
  function renderHierarchicalTab() {
    if (activeHierSubtab === "hier-subtab-treemap") {
      renderTreemap();
    } else if (activeHierSubtab === "hier-subtab-sunburst") {
      renderSunburst();
    }
  }

  function buildHierarchyData(dataset, isProv, sizeVar, colorVar) {
    const ids = [];
    const labels = [];
    const parents = [];
    const values = [];
    const colors = [];
    const customTexts = [];

    const provAgg = {};
    const islandAggMap = {};
    const allVals = [];

    dataset.forEach((d) => {
      const cVal = typeof d[colorVar] === "number" ? d[colorVar] : 0;
      allVals.push(cVal);

      if (!provAgg[d.provinsi])
        provAgg[d.provinsi] = {
          count: 0,
          sumColor: 0,
          sumSize: 0,
          pulau: d.pulau,
        };
      provAgg[d.provinsi].count += 1;
      provAgg[d.provinsi].sumColor += cVal;
      provAgg[d.provinsi].sumSize +=
        typeof d[sizeVar] === "number" ? d[sizeVar] : 0;

      if (!islandAggMap[d.pulau])
        islandAggMap[d.pulau] = { count: 0, sumColor: 0, sumSize: 0 };
      islandAggMap[d.pulau].count += 1;
      islandAggMap[d.pulau].sumColor += cVal;
      islandAggMap[d.pulau].sumSize +=
        typeof d[sizeVar] === "number" ? d[sizeVar] : 0;
    });

    const natAvgColor = allVals.length
      ? +(allVals.reduce((a, b) => a + b, 0) / allVals.length).toFixed(2)
      : 0;

    // 1. Root: Indonesia
    ids.push("id-root-indonesia");
    labels.push("Indonesia");
    parents.push("");
    values.push(0);
    colors.push(natAvgColor);
    customTexts.push(
      `<b>Republik Indonesia</b><br>Rata-rata ${colorVar.toUpperCase()}: ${natAvgColor}`,
    );

    // 2. Islands (Gugus Pulau)
    const islands = [...new Set(dataset.map((d) => d.pulau))];
    islands.forEach((pulau) => {
      const agg = islandAggMap[pulau] || { count: 1, sumColor: 0 };
      const avgColor = +(agg.sumColor / (agg.count || 1)).toFixed(2);
      ids.push(`pulau-${pulau}`);
      labels.push(pulau);
      parents.push("id-root-indonesia");
      values.push(0);
      colors.push(avgColor);
      customTexts.push(
        `<b>Gugus Pulau ${pulau}</b><br>Jumlah Wilayah: ${agg.count}<br>Rata-rata ${colorVar.toUpperCase()}: ${avgColor}`,
      );
    });

    if (isProv) {
      // 3a. Provinces as Leaf Nodes
      dataset.forEach((d, idx) => {
        const id = `prov-${d.provinsi}`;
        const sVal = Math.max(
          1,
          typeof d[sizeVar] === "number" ? d[sizeVar] : 1,
        );
        const cVal = typeof d[colorVar] === "number" ? d[colorVar] : 0;
        const displayVal =
          sizeVar === "pengeluaran"
            ? `Rp${Number(sVal).toLocaleString("id-ID")}`
            : `${sVal.toFixed(2)}%`;
        const displayColor =
          colorVar === "pengeluaran"
            ? `Rp${Number(cVal).toLocaleString("id-ID")}`
            : `${cVal.toFixed(2)}%`;

        ids.push(id);
        labels.push(d.nama_resmi || `Provinsi ${d.provinsi}`);
        parents.push(`pulau-${d.pulau}`);
        values.push(sVal);
        colors.push(cVal);
        customTexts.push(
          `<b>${d.nama_resmi || d.provinsi}</b><br>Pulau: ${d.pulau}<br>Ukuran (${sizeVar.toUpperCase()}): ${displayVal}<br>Warna (${colorVar.toUpperCase()}): ${displayColor}<br>Tipologi: ${d.kuadran || "N/A"}`,
        );
      });
    } else {
      // 3b. Provinces as Intermediate Containers
      const provEntries = Object.keys(provAgg);
      provEntries.forEach((prov) => {
        const agg = provAgg[prov];
        const avgColor = +(agg.sumColor / (agg.count || 1)).toFixed(2);
        ids.push(`prov-${prov}`);
        labels.push(`Prov. ${prov}`);
        parents.push(`pulau-${agg.pulau}`);
        values.push(0);
        colors.push(avgColor);
        customTexts.push(
          `<b>Provinsi ${prov}</b><br>Gugus: ${agg.pulau}<br>Jumlah Kab/Kota: ${agg.count}<br>Rata-rata ${colorVar.toUpperCase()}: ${avgColor}`,
        );
      });

      // 4. Kab/Kota as Leaf Nodes
      dataset.forEach((d, idx) => {
        const id = `kab-${d.kode_wilayah || idx}-${idx}`;
        const sVal = Math.max(
          1,
          typeof d[sizeVar] === "number" ? d[sizeVar] : 1,
        );
        const cVal = typeof d[colorVar] === "number" ? d[colorVar] : 0;
        const displayVal =
          sizeVar === "pengeluaran"
            ? `Rp${Number(sVal).toLocaleString("id-ID")}`
            : `${sVal.toFixed(2)}%`;
        const displayColor =
          colorVar === "pengeluaran"
            ? `Rp${Number(cVal).toLocaleString("id-ID")}`
            : `${cVal.toFixed(2)}%`;

        ids.push(id);
        labels.push(d.nama_resmi || d.wilayah);
        parents.push(`prov-${d.provinsi}`);
        values.push(sVal);
        colors.push(cVal);
        customTexts.push(
          `<b>${d.nama_resmi || d.wilayah}</b><br>Provinsi: ${d.provinsi} (${d.pulau})<br>Ukuran (${sizeVar.toUpperCase()}): ${displayVal}<br>Warna (${colorVar.toUpperCase()}): ${displayColor}<br>Tipologi: ${d.kuadran || "N/A"}`,
        );
      });
    }

    return { ids, labels, parents, values, colors, customTexts };
  }

  function renderTreemap() {
    const dataObj = buildHierarchyData(
      filteredKabkota,
      true,
      hierSizeVar,
      hierColorVar,
    );

    const trace = {
      type: "treemap",
      ids: dataObj.ids,
      labels: dataObj.labels,
      parents: dataObj.parents,
      values: dataObj.values,
      text: dataObj.customTexts,
      hoverinfo: "text",
      marker: {
        colors: dataObj.colors,
        colorscale: "Viridis",
        showscale: true,
        colorbar: { title: hierColorVar.toUpperCase() },
      },
    };

    const layout = {
      title: {
        text: `<b>Interactive Treemap (Tingkat Provinsi): Ukuran = ${hierSizeVar.toUpperCase()} | Warna = ${hierColorVar.toUpperCase()}</b>`,
        font: { size: 13.5, color: "#0f172a" },
        y: 0.985,
        x: 0.01,
        xanchor: "left",
        yanchor: "top",
        pad: { t: 0, b: 6, l: 0, r: 0 },
      },
      margin: { l: 10, r: 10, t: 42, b: 10 },
      height: 560,
      paper_bgcolor: "transparent",
    };

    window.Plotly.react("treemap-chart", [trace], layout, {
      responsive: true,
      displayModeBar: false,
    });
  }

  function renderSunburst() {
    const dataObj = buildHierarchyData(
      filteredKabkota,
      true,
      hierSizeVar,
      hierColorVar,
    );

    const trace = {
      type: "sunburst",
      ids: dataObj.ids,
      labels: dataObj.labels,
      parents: dataObj.parents,
      values: dataObj.values,
      text: dataObj.customTexts,
      hoverinfo: "text",
      marker: {
        colors: dataObj.colors,
        colorscale: "Viridis",
        showscale: true,
        colorbar: { title: hierColorVar.toUpperCase() },
      },
    };

    const layout = {
      title: {
        text: `<b>Interactive Sunburst Chart (Tingkat Provinsi): Ukuran = ${hierSizeVar.toUpperCase()} | Warna = ${hierColorVar.toUpperCase()}</b>`,
        font: { size: 13.5, color: "#0f172a" },
        y: 0.985,
        x: 0.01,
        xanchor: "left",
        yanchor: "top",
        pad: { t: 0, b: 6, l: 0, r: 0 },
      },
      margin: { l: 10, r: 10, t: 42, b: 10 },
      height: 580,
      paper_bgcolor: "transparent",
    };

    window.Plotly.react("sunburst-chart", [trace], layout, {
      responsive: true,
      displayModeBar: false,
    });
  }

  // Summary Table Data
  const islandAgg = {};
  filteredKabkota.forEach((d) => {
    if (!islandAgg[d.pulau]) {
      islandAgg[d.pulau] = {
        count: 0,
        parlemen: 0,
        pendapatan: 0,
        profesional: 0,
        tpak: 0,
        pengeluaran: 0,
        keputusan: 0,
        ekonomi: 0,
        ikpp: 0,
      };
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

  // Table Sorting and Filtering
  let tableRecords = [...filteredKabkota];
  if (tableSearch) {
    tableRecords = tableRecords.filter(
      (d) =>
        d.nama_resmi.toLowerCase().includes(tableSearch.toLowerCase()) ||
        d.provinsi.toLowerCase().includes(tableSearch.toLowerCase()),
    );
  }
  tableRecords.sort((a, b) => {
    let valA = a[sortCol];
    let valB = b[sortCol];
    if (typeof valA === "string")
      return sortAsc ? valA.localeCompare(valB) : valB.localeCompare(valA);
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
    const cols = [
      "kode_wilayah",
      "nama_resmi",
      "tipe",
      "provinsi",
      "pulau",
      "parlemen",
      "pendapatan",
      "profesional",
      "tpak",
      "pengeluaran",
      "ahh",
      "rls",
      "hls",
      "skor_keputusan",
      "skor_ekonomi",
      "ikpp_komposit",
      "kuadran",
    ];
    let csvContent = "data:text/csv;charset=utf-8," + cols.join(",") + "\r\n";
    filteredKabkota.forEach((row) => {
      const values = cols.map((c) =>
        typeof row[c] === "string" && row[c].includes(",")
          ? `"${row[c]}"`
          : row[c],
      );
      csvContent += values.join(",") + "\r\n";
    });
    const link = document.createElement("a");
    link.href = encodeURI(csvContent);
    link.download = `disparitas_perempuan_${isProvinsi ? "38_provinsi" : "514_kabkota"}_2024.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  function downloadDatasetJSON(data, filename) {
    if (!data || !data.length) return;
    const jsonStr = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  function downloadProvinsiCSV() {
    if (!enrichedProvinsi || !enrichedProvinsi.length) return;
    const cols = [
      "kode_wilayah",
      "nama_resmi",
      "provinsi",
      "pulau",
      "parlemen",
      "pendapatan",
      "profesional",
      "tpak",
      "pengeluaran",
      "ahh",
      "rls",
      "hls",
      "skor_keputusan",
      "skor_ekonomi",
      "ikpp_komposit",
      "kuadran",
    ];
    let csvContent = "data:text/csv;charset=utf-8," + cols.join(",") + "\r\n";
    enrichedProvinsi.forEach((row) => {
      const values = cols.map((c) =>
        typeof row[c] === "string" && row[c].includes(",")
          ? `"${row[c]}"`
          : row[c],
      );
      csvContent += values.join(",") + "\r\n";
    });
    const link = document.createElement("a");
    link.href = encodeURI(csvContent);
    link.download = "disparitas_perempuan_38_provinsi_2024.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  const avgParlemen = filteredKabkota.length
    ? filteredKabkota.reduce((a, b) => a + b.parlemen, 0) /
      filteredKabkota.length
    : 0;
  const avgPendapatan = filteredKabkota.length
    ? filteredKabkota.reduce((a, b) => a + b.pendapatan, 0) /
      filteredKabkota.length
    : 0;
  const avgProfesional = filteredKabkota.length
    ? filteredKabkota.reduce((a, b) => a + b.profesional, 0) /
      filteredKabkota.length
    : 0;
  const avgTPAK = filteredKabkota.length
    ? filteredKabkota.reduce((a, b) => a + b.tpak, 0) / filteredKabkota.length
    : 0;

  // Dynamic Factual Analytics for Storytelling
  const totalCount = filteredKabkota.length || 1;
  const countAfirmasi = filteredKabkota.filter((d) => d.parlemen >= 30).length;
  const pctAfirmasi = ((countAfirmasi / totalCount) * 100).toFixed(1);
  const sortedByParlemen = [...filteredKabkota].sort((a, b) => b.parlemen - a.parlemen);
  const topParlemen = sortedByParlemen[0];
  const bottomParlemen = sortedByParlemen[sortedByParlemen.length - 1];
  const sortedSticky = [...filteredKabkota].sort(
    (a, b) => (b.tpak - b.pendapatan) - (a.tpak - a.pendapatan),
  );
  const topSticky = sortedSticky[0];

  const hasActiveFilter =
    selectedPulau !== "Semua Pulau" ||
    selectedProv !== "Semua Provinsi" ||
    selectedTipe !== "Kab/Kota" ||
    selectedKuadran !== "Semua Kuadran" ||
    selectedPalette !== "Viridis";

  const resetFilters = () => {
    setSelectedPulau("Semua Pulau");
    setSelectedProv("Semua Provinsi");
    setSelectedTipe("Kab/Kota");
    setSelectedKuadran("Semua Kuadran");
    setSelectedPalette("Viridis");
  };

  const MODULES = [
    {
      id: "tab-overview",
      label: "Ringkasan & Storytelling",
      desc: "Tipologi kuadran disparitas ekonomi vs keputusan & narasi analitik",
      icon: "fa-chart-pie",
      group: "ANALISIS & VISUALISASI",
    },
    {
      id: "tab-geospatial",
      label: "Analisis Geospasial",
      desc: "Peta batas kab/kota poligon SHP, heatmap spasial, choropleth, & LISA cluster",
      icon: "fa-map-location-dot",
      group: "ANALISIS & VISUALISASI",
    },
    {
      id: "tab-multivariate",
      label: "Dimensi Tinggi (Multivariat)",
      desc: "PCA biplot 8 indikator, koordinat paralel, korelasi matriks, & profil radar",
      icon: "fa-diagram-project",
      group: "ANALISIS & VISUALISASI",
    },
    {
      id: "tab-hierarchical",
      label: "Analisis Berhierarki",
      desc: "Treemap & sunburst interaktif agregasi pulau hingga kabupaten/kota",
      icon: "fa-sitemap",
      group: "ANALISIS & VISUALISASI",
    },
    {
      id: "tab-data",
      label: "Tabel Data",
      desc: `Pangkalan data tabular ${isProvinsi ? "38 provinsi" : "514 kabupaten/kota"} dengan pencarian & ekspor CSV`,
      icon: "fa-table-list",
      group: "DATA & DOKUMENTASI",
    },
    {
      id: "tab-method",
      label: "Metodologi Analisis",
      desc: "Sumber data resmi BPS RI 2024, pra-pemrosesan, imputasi, & justifikasi desain",
      icon: "fa-book-bookmark",
      group: "DATA & DOKUMENTASI",
    },
    {
      id: "tab-download",
      label: "Unduh Data",
      desc: "Pusat unduhan dataset terbuka CSV, JSON, & GeoJSON BPS 2024",
      icon: "fa-cloud-arrow-down",
      group: "DATA & DOKUMENTASI",
    },
    {
      id: "tab-sources",
      label: "Sumber Data BPS",
      desc: "Katalog publikasi tabel statistik resmi BPS RI 2024",
      icon: "fa-database",
      group: "DATA & DOKUMENTASI",
    },
    {
      id: "tab-about",
      label: "Tentang Dashboard",
      desc: "Profil institusional Politeknik Statistika STIS & tim pengembang",
      icon: "fa-circle-info",
      group: "DATA & DOKUMENTASI",
    },
  ];

  const currentModule = MODULES.find((m) => m.id === activeTab) || MODULES[0];

  return (
    <div className="app-container">
      {/* Mobile Drawer Backdrop */}
      <div
        className={`sidebar-backdrop ${mobileMenuOpen ? "active" : ""}`}
        onClick={() => setMobileMenuOpen(false)}
        aria-hidden="true"
      />

      {/* Persistent Left Sidebar (~260px wide) */}
      <aside className={`sidebar ${sidebarCollapsed ? "collapsed" : ""} ${mobileMenuOpen ? "open" : ""}`}>
        <div className="sidebar-brand-box">
          <img
            src="/logo_stis.webp"
            alt="Logo Politeknik Statistika STIS"
            className="sidebar-logo"
            width={38}
            height={38}
          />
          <div className="sidebar-brand-text">
            <span className="sidebar-brand-title" title="Politeknik Statistika STIS">
              Politeknik Statistika STIS
            </span>
            <span className="sidebar-brand-sub" title="Visualisasi Data & Informasi">
              Visualisasi Data &amp; Informasi
            </span>
          </div>
        </div>

        <div className="sidebar-nav-container">
          {/* Kelompok 1: ANALISIS & VISUALISASI */}
          <div className="sidebar-nav-group">
            <span className="sidebar-group-title">Analisis &amp; Visualisasi</span>
            {MODULES.filter((m) => m.group === "ANALISIS & VISUALISASI").map((m) => (
              <button
                key={m.id}
                className={`sidebar-nav-btn ${activeTab === m.id ? "active" : ""}`}
                onClick={() => {
                  setActiveTab(m.id);
                  if (m.id === "tab-hierarchical") setSelectedTipe("Provinsi");
                  setMobileMenuOpen(false);
                }}
              >
                <i className={`sidebar-nav-icon fa-solid ${m.icon}`}></i>
                <span className="sidebar-nav-text">{m.label}</span>
              </button>
            ))}
          </div>

          {/* Kelompok 2: DATA & DOKUMENTASI */}
          <div className="sidebar-nav-group">
            <span className="sidebar-group-title">Data &amp; Dokumentasi</span>
            {MODULES.filter((m) => m.group === "DATA & DOKUMENTASI").map((m) => (
              <button
                key={m.id}
                className={`sidebar-nav-btn ${activeTab === m.id ? "active" : ""}`}
                onClick={() => {
                  setActiveTab(m.id);
                  setMobileMenuOpen(false);
                }}
              >
                <i className={`sidebar-nav-icon fa-solid ${m.icon}`}></i>
                <span className="sidebar-nav-text">{m.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="sidebar-footer">
          <span className="sidebar-footer-inst">Danang Ivan Pangestu</span>
          <span>222313036 (3SD2)</span>
        </div>
      </aside>

      {/* Main Viewport */}
      <main className="main-viewport">
        {/* Global Header */}
        <header className="global-header">
          <div className="header-top-row">
            <div className="header-left-nav">
              <button
                className="header-icon-btn header-hamburger-btn"
                onClick={() => {
                  if (typeof window !== "undefined" && window.innerWidth <= 900) {
                    setMobileMenuOpen(!mobileMenuOpen);
                  } else {
                    setSidebarCollapsed(!sidebarCollapsed);
                  }
                }}
                aria-label="Toggle Menu Navigasi"
                title={sidebarCollapsed ? "Buka Sidebar Navigasi" : "Sembunyikan Sidebar Navigasi"}
              >
                <i className="fa-solid fa-bars"></i>
              </button>
              <div className="header-breadcrumb">
                <i className="fa-solid fa-house" style={{ fontSize: "11px" }}></i>
                <span className="breadcrumb-extra">Portal Analitik STIS</span>
                <span className="breadcrumb-separator breadcrumb-extra">/</span>
                <span className="breadcrumb-extra">Disparitas Gender 2024</span>
                <span className="breadcrumb-separator breadcrumb-extra">/</span>
                <span className="breadcrumb-active">{currentModule.label}</span>
              </div>
            </div>

            <div className="header-right-meta">
              <div className="header-chips-row">
                <span className="meta-chip primary">
                  <i className="fa-regular fa-calendar" style={{ fontSize: "11px" }}></i>
                  Tahun Data: 2024
                </span>
                <span className="meta-chip">
                  <i className="fa-solid fa-map-pin" style={{ fontSize: "11px" }}></i>
                  514 Kab/Kota &bull; 38 Provinsi
                </span>
              </div>
              <div className="header-actions-row">
                <button
                  className="header-icon-btn"
                  title="Panduan &amp; Bantuan"
                  onClick={() => setHelpModalOpen(true)}
                  aria-label="Buka Panduan"
                >
                  <i className="fa-solid fa-circle-question"></i>
                </button>
              </div>
            </div>
          </div>

          <div className="header-title-block">
            <h1 className="header-title-main">
              Eksplorasi Disparitas Spasial Partisipasi Ekonomi &amp; Pengambilan Keputusan Perempuan di Indonesia
            </h1>
            <p className="header-title-sub">
              Platform Analitik Komprehensif Berbasis Data Resmi BPS RI 2024 pada 514 Kabupaten/Kota dan 38 Provinsi
            </p>
          </div>
        </header>

        {/* Compact 1-Button Filter Bar */}
        <div className="filter-bar-compact">
          <div className="filter-bar-compact-left">
            <button
              className={`btn-filter-trigger ${hasActiveFilter ? "has-active" : ""}`}
              onClick={() => setFilterModalOpen(true)}
              type="button"
              title="Buka pop up filter untuk mengatur Pulau, Provinsi, Tingkat Wilayah, Kuadran, dan Palet Warna"
            >
              <i className="fa-solid fa-sliders"></i>
              <span className="btn-filter-trigger-text">
                Filter Wilayah &amp; Indikator
              </span>
              {hasActiveFilter ? (
                <span className="filter-badge-counter">
                  {(selectedPulau !== "Semua Pulau" ? 1 : 0) +
                   (selectedProv !== "Semua Provinsi" ? 1 : 0) +
                   (selectedKuadran !== "Semua Kuadran" ? 1 : 0) +
                   (selectedPalette !== "Viridis" ? 1 : 0)} Aktif
                </span>
              ) : (
                <span className="filter-badge-default">Semua Data</span>
              )}
              <i className="fa-solid fa-chevron-down filter-chevron-icon"></i>
            </button>

            {/* Quick Filter Status Pills */}
            <div className="filter-status-pills">
              <span className="filter-pill-tag">
                <i className="fa-solid fa-layer-group"></i>
                <span>{selectedTipe === "Kab/Kota" ? "514 Kab/Kota" : "38 Provinsi"}</span>
              </span>

              {selectedPulau !== "Semua Pulau" && (
                <span className="filter-pill-tag active">
                  <span>Pulau: {selectedPulau}</span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedPulau("Semua Pulau");
                      setSelectedProv("Semua Provinsi");
                    }}
                    title="Hapus filter pulau"
                    className="pill-remove-btn"
                  >
                    &times;
                  </button>
                </span>
              )}

              {selectedProv !== "Semua Provinsi" && (
                <span className="filter-pill-tag active">
                  <span>Prov: {selectedProv}</span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedProv("Semua Provinsi");
                    }}
                    title="Hapus filter provinsi"
                    className="pill-remove-btn"
                  >
                    &times;
                  </button>
                </span>
              )}

              {selectedKuadran !== "Semua Kuadran" && (
                <span className="filter-pill-tag active">
                  <span>{selectedKuadran.split("(")[0].trim()}</span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedKuadran("Semua Kuadran");
                    }}
                    title="Hapus filter kuadran"
                    className="pill-remove-btn"
                  >
                    &times;
                  </button>
                </span>
              )}

              {selectedPalette !== "Viridis" && (
                <span className="filter-pill-tag">
                  <i className="fa-solid fa-palette"></i>
                  <span>{selectedPalette}</span>
                </span>
              )}
            </div>
          </div>

          <div className="filter-bar-compact-right">
            {hasActiveFilter && (
              <button
                className="btn-reset-compact"
                onClick={resetFilters}
                title="Reset semua filter ke kondisi awal"
                type="button"
              >
                <i className="fa-solid fa-rotate-left"></i>
                <span>Reset</span>
              </button>
            )}
          </div>
        </div>

        {/* Tab 1: Ringkasan & Storytelling */}
        {activeTab === "tab-overview" && (
          <div className="page-content">
            {/* KPI Grid (5 Cards in 1 Desktop Row) */}
            <div className="kpi-grid-5">
              {/* Card 1: Parlemen */}
              <div className="kpi-card accent-red">
                <div className="kpi-top-meta">
                  <span className="kpi-label">Keterwakilan Parlemen</span>
                  <i className="kpi-icon fa-solid fa-landmark"></i>
                </div>
                <div className="kpi-number-box">
                  <span className="kpi-value">{avgParlemen.toFixed(2)}%</span>
                </div>
                <div className="kpi-delta-pill neg">
                  <i className="fa-solid fa-arrow-trend-down"></i>
                  <span>Defisit {(avgParlemen - 30.0).toFixed(1)}% vs Kuota 30%</span>
                </div>
              </div>

              {/* Card 2: Profesional */}
              <div className="kpi-card accent-green">
                <div className="kpi-top-meta">
                  <span className="kpi-label">Tenaga Profesional</span>
                  <i className="kpi-icon fa-solid fa-user-tie"></i>
                </div>
                <div className="kpi-number-box">
                  <span className="kpi-value">{avgProfesional.toFixed(2)}%</span>
                </div>
                <div className="kpi-delta-pill pos">
                  <i className="fa-solid fa-check"></i>
                  <span>Paritas Tercapai (&ge;50%)</span>
                </div>
              </div>

              {/* Card 3: Pendapatan */}
              <div className="kpi-card accent-amber">
                <div className="kpi-top-meta">
                  <span className="kpi-label">Sumbangan Pendapatan</span>
                  <i className="kpi-icon fa-solid fa-coins"></i>
                </div>
                <div className="kpi-number-box">
                  <span className="kpi-value">{avgPendapatan.toFixed(2)}%</span>
                </div>
                <div className="kpi-delta-pill warn">
                  <i className="fa-solid fa-scale-unbalanced"></i>
                  <span>Kesenjangan {(avgPendapatan - 50.0).toFixed(1)}% vs Paritas</span>
                </div>
              </div>

              {/* Card 4: TPAK */}
              <div className="kpi-card accent-blue">
                <div className="kpi-top-meta">
                  <span className="kpi-label">TPAK Perempuan</span>
                  <i className="kpi-icon fa-solid fa-briefcase"></i>
                </div>
                <div className="kpi-number-box">
                  <span className="kpi-value">{avgTPAK.toFixed(2)}%</span>
                </div>
                <div className="kpi-delta-pill neu">
                  <i className="fa-solid fa-users-line"></i>
                  <span>Partisipasi Kerja Aktif</span>
                </div>
              </div>

              {/* Card 5: Moran's I */}
              <div className="kpi-card accent-purple">
                <div className="kpi-top-meta">
                  <span className="kpi-label">Autokorelasi Moran&apos;s I</span>
                  <i className="kpi-icon fa-solid fa-diagram-project"></i>
                </div>
                <div className="kpi-number-box">
                  <span className="kpi-value" style={{ fontSize: "20px" }}>0.354 | 0.450</span>
                </div>
                <div className="kpi-delta-pill pos">
                  <i className="fa-solid fa-circle-check"></i>
                  <span>p = 0.001 (Signifikan)</span>
                </div>
              </div>
            </div>

            {/* Main Visual Layout Grid: Scatter Plot (72%) + Insight Panel (28%) */}
            <div className="viz-layout-grid">
              <div className="inst-card">
                <div className="inst-card-header">
                  <div className="inst-card-title-group">
                    <div className="inst-card-title">
                      <i className="fa-solid fa-chart-scatter" style={{ color: "#1F5FCC" }}></i>
                      <span>Tipologi Kuadran Disparitas: Partisipasi Ekonomi vs Pengambilan Keputusan</span>
                    </div>
                    <div className="inst-card-caption">
                      Memetakan {filteredKabkota.length} {isProvinsi ? "provinsi" : "kabupaten/kota"} terhadap garis median nasional (X = 34.5 &bull; Y = 47.6)
                    </div>
                  </div>
                  <div className="inst-card-actions">
                    <button
                      className="btn-secondary"
                      onClick={() => toggleFullscreen("quadrant-chart-card")}
                      title="Tampilan Penuh"
                    >
                      <i className="fa-solid fa-expand"></i>
                      <span>Penuh</span>
                    </button>
                  </div>
                </div>
                <div className="inst-card-body" id="quadrant-chart-card">
                  <div id="quadrant-chart" className="chart-box"></div>
                </div>
              </div>

              {/* Right Insight Panel */}
              <VizLegendQuadrant filteredKabkota={filteredKabkota} />
            </div>

            {/* Section: Temuan Utama (Analytical Storytelling) */}
            <div className="storytelling-section">
              <div className="section-header-title">
                <i className="fa-solid fa-book-open-reader" style={{ color: "#0B2F63" }}></i>
                <span>Temuan Utama &amp; Narasi Analitik Wilayah Terfilter</span>
              </div>
              <div className="storytelling-grid">
                {/* Story 1 */}
                <div className="story-card-inst emerald">
                  <div className="story-card-top">
                    <i className="fa-solid fa-landmark-flag" style={{ color: "#16A34A" }}></i>
                    <span>Representasi Politik &amp; Kuota Afirmasi</span>
                  </div>
                  <div className="story-card-title">
                    {pctAfirmasi}% Wilayah Memenuhi Kuota 30% Parlemen
                  </div>
                  <div className="story-card-body">
                    Dari {filteredKabkota.length} wilayah aktif, sebanyak {countAfirmasi} daerah telah melampaui kuota afirmasi gender 30%. Wilayah dengan keterwakilan parlemen tertinggi tercatat di <strong>{topParlemen?.nama_resmi || "-"}</strong> ({topParlemen?.parlemen || 0}%), sementara terendah berada di <strong>{bottomParlemen?.nama_resmi || "-"}</strong> ({bottomParlemen?.parlemen || 0}%).
                  </div>
                </div>

                {/* Story 2 */}
                <div className="story-card-inst amber">
                  <div className="story-card-top">
                    <i className="fa-solid fa-scale-unbalanced-flip" style={{ color: "#D97706" }}></i>
                    <span>Paradoks Ketenagakerjaan (Sticky Floor)</span>
                  </div>
                  <div className="story-card-title">
                    Kesenjangan Partisipasi Kerja vs Kontribusi Finansial
                  </div>
                  <div className="story-card-body">
                    Rata-rata TPAK perempuan ({avgTPAK.toFixed(1)}%) berjarak signifikan dengan sumbangan pendapatan riil ({avgPendapatan.toFixed(1)}%). Kesenjangan terbesar terpantau di <strong>{topSticky?.nama_resmi || "-"}</strong> (TPAK {topSticky?.tpak || 0}% vs Pendapatan {topSticky?.pendapatan || 0}%), mengindikasikan dominasi sektor informal dan kerja fisik tanpa kompensasi setara.
                  </div>
                </div>

                {/* Story 3 */}
                <div className="story-card-inst purple">
                  <div className="story-card-top">
                    <i className="fa-solid fa-circle-nodes" style={{ color: "#7C3AED" }}></i>
                    <span>Aglomerasi Spasial Regional</span>
                  </div>
                  <div className="story-card-title">
                    Ketergantungan Geografis Signifikan (p = 0.001)
                  </div>
                  <div className="story-card-body">
                    Nilai Global Moran&apos;s I (0.354 untuk Keputusan dan 0.450 untuk Ekonomi) mengonfirmasi autokorelasi spasial positif kuat. Wilayah maju cenderung berkerumun membentuk klaster Hotspot di kota-kota besar dan koridor utara, sedangkan perangkap ketertinggalan ganda terkonsentrasi di pedalaman dan kepulauan terluar.
                  </div>
                </div>
              </div>
            </div>

            {/* Metadata Footer */}
            <div className="meta-footer-bar">
              <div className="meta-footer-left">
                <i className="fa-solid fa-database" style={{ color: "#1F5FCC" }}></i>
                <span><strong>Sumber Data:</strong> Badan Pusat Statistik (BPS RI) &bull; Publikasi Statistik Gender 2024</span>
              </div>
              <div>
                <span>Cakupan Analisis: 514 Kabupaten/Kota &bull; 38 Provinsi Indonesia</span>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Geospatial */}
        <section
          className={`tab-pane ${activeTab === "tab-geospatial" ? "active" : ""}`}
          style={{ display: activeTab === "tab-geospatial" ? "flex" : "none" }}
        >
          <div className="subtabs-nav">
            <button
              className={`subtab-btn ${activeGeoSubtab === "geo-subtab-kabkota-boundary" ? "active" : ""}`}
              onClick={() => setActiveGeoSubtab("geo-subtab-kabkota-boundary")}
            >
              <i className="fa-solid fa-draw-polygon" style={{ marginRight: "6px" }}></i>
              Peta Batas Kab/Kota
            </button>
            <button
              className={`subtab-btn ${activeGeoSubtab === "geo-subtab-heatmap" ? "active" : ""}`}
              onClick={() => setActiveGeoSubtab("geo-subtab-heatmap")}
            >
              <i className="fa-solid fa-fire" style={{ marginRight: "6px" }}></i>
              Heatmap Spasial
            </button>
            <button
              className={`subtab-btn ${activeGeoSubtab === "geo-subtab-choropleth" ? "active" : ""}`}
              onClick={() => setActiveGeoSubtab("geo-subtab-choropleth")}
            >
              <i className="fa-solid fa-layer-group" style={{ marginRight: "6px" }}></i>
              Choropleth Provinsi
            </button>
            <button
              className={`subtab-btn ${activeGeoSubtab === "geo-subtab-proportional" ? "active" : ""}`}
              onClick={() => setActiveGeoSubtab("geo-subtab-proportional")}
            >
              <i className="fa-solid fa-circle-dot" style={{ marginRight: "6px" }}></i>
              Simbol Proporsional
            </button>
            <button
              className={`subtab-btn ${activeGeoSubtab === "geo-subtab-lisa" ? "active" : ""}`}
              onClick={() => setActiveGeoSubtab("geo-subtab-lisa")}
            >
              <i className="fa-solid fa-chart-area" style={{ marginRight: "6px" }}></i>
              Klaster LISA
            </button>
          </div>

          {/* Subtab 1: Peta Batas Kabupaten/Kota dari GeoJSON (Nasional 514 Kab/Kota) */}
          {activeGeoSubtab === "geo-subtab-kabkota-boundary" && (
            <div className="card">
              <div className="card-header">
                <div>
                  <div className="card-title">
                    Peta Batas &amp; Poligon Tematik{" "}
                    {isProvinsi ? "Tingkat Provinsi" : "Kabupaten/Kota"}{" "}
                    (GeoJSON BPS 2024)
                  </div>
                  <div className="card-caption">
                    {isProvinsi
                      ? "Batas administrasi poligon teragregasi 38 Provinsi di Indonesia, terintegrasi indikator BPS 2024 dengan basemap ESRI Canvas."
                      : "Batas administrasi poligon 514 Kabupaten/Kota di 38 Provinsi Indonesia, terintegrasi indikator BPS 2024 dengan basemap ESRI Canvas."}
                  </div>
                </div>
                <div
                  style={{
                    display: "flex",
                    gap: "10px",
                    alignItems: "center",
                    flexWrap: "wrap",
                  }}
                >
                  <span className="badge badge-success">
                    {isProvinsi
                      ? "38 Provinsi Aktif"
                      : "514 Kab/Kota Indonesia"}
                  </span>

                  <a
                    href={
                      isProvinsi
                        ? "/data/provinsi_indonesia.geojson"
                        : "/data/kabkota_indonesia.geojson"
                    }
                    download={
                      isProvinsi
                        ? "provinsi_indonesia.geojson"
                        : "kabkota_indonesia.geojson"
                    }
                    className="btn-export"
                    title={
                      isProvinsi
                        ? "Unduh berkas GeoJSON Batas 38 Provinsi"
                        : "Unduh berkas GeoJSON Batas 514 Kab/Kota"
                    }
                  >
                    Unduh GeoJSON ({isProvinsi ? "0.22 MB" : "0.79 MB"})
                  </a>

                  <select
                    value={kabkotaChoroplethVar}
                    onChange={(e) => setKabkotaChoroplethVar(e.target.value)}
                    style={{
                      padding: "6px 10px",
                      borderRadius: "6px",
                      border: "1px solid #cbd5e1",
                      fontSize: "12px",
                      fontWeight: "600",
                    }}
                  >
                    <optgroup label="Indikator Utama Gender BPS">
                      <option value="parlemen">Parlemen Perempuan (%)</option>
                      <option value="pendapatan">
                        Sumbangan Pendapatan (%)
                      </option>
                      <option value="profesional">
                        Tenaga Profesional (%)
                      </option>
                      <option value="tpak">TPAK Perempuan (%)</option>
                      <option value="pengeluaran">
                        Pengeluaran Riil (Ribu Rp)
                      </option>
                      <option value="ahh">Angka Harapan Hidup (AHH)</option>
                      <option value="rls">Rata-rata Lama Sekolah (RLS)</option>
                      <option value="hls">Harapan Lama Sekolah (HLS)</option>
                    </optgroup>
                    <optgroup label="Indeks & Tipologi Analitik">
                      <option value="skor_keputusan">
                        Skor Pengambilan Keputusan (0-100)
                      </option>
                      <option value="skor_ekonomi">
                        Skor Partisipasi Ekonomi (0-100)
                      </option>
                      <option value="ikpp_komposit">
                        IKPP Komposit Gender (0-100)
                      </option>
                      <option value="kuadran">
                        Tipologi Kuadran Disparitas
                      </option>
                      <option value="lisa_cluster_keputusan">
                        Klaster LISA Keputusan
                      </option>
                      <option value="lisa_cluster_ekonomi">
                        Klaster LISA Ekonomi
                      </option>
                    </optgroup>
                  </select>
                </div>
              </div>

              <div className="viz-layout-row">
                <div className="viz-layout-main">
                  <div id="kabkota-boundary-map" className="map-container" style={{ width: "100%", height: "600px" }}></div>
                </div>
                <div className="viz-layout-sidebar">
                  <VizLegendBoundaryMap
                    dataset={isProvinsi ? enrichedProvinsi : filteredKabkota}
                    isProvinsi={isProvinsi}
                    varName={kabkotaChoroplethVar}
                    paletteName={selectedPalette}
                  />
                </div>
              </div>

              {/* Detail Panel Saat Wilayah Diklik */}
              {selectedKabDetail ? (
                <div className="kab-detail-panel">
                  <div className="kab-detail-header">
                    <div>
                      <h3
                        style={{
                          margin: 0,
                          fontSize: "1.1rem",
                          color: "#0f172a",
                        }}
                      >
                        {selectedKabDetail.nama_resmi}
                      </h3>
                      <p
                        style={{
                          margin: 0,
                          fontSize: "0.8rem",
                          color: "#64748b",
                        }}
                      >
                        {selectedKabDetail.provinsi} &bull; Tipe:{" "}
                        <strong>
                          {selectedKabDetail.tipe ||
                            (isProvinsi ? "Provinsi" : "Kab/Kota")}
                        </strong>
                        {selectedKabDetail.kode_wilayah ? (
                          <>
                            {" "}
                            &bull; Kode:{" "}
                            <code>{selectedKabDetail.kode_wilayah}</code>
                          </>
                        ) : null}
                        {selectedKabDetail.LUASWH ? (
                          <>
                            {" "}
                            &bull; Luas:{" "}
                            {Number(
                              selectedKabDetail.LUASWH || 0,
                            ).toLocaleString("id-ID")}{" "}
                            km²
                          </>
                        ) : null}
                        {selectedKabDetail.pulau ? (
                          <>
                            {" "}
                            &bull; Gugus:{" "}
                            <strong>{selectedKabDetail.pulau}</strong>
                          </>
                        ) : null}
                      </p>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        gap: "8px",
                        alignItems: "center",
                      }}
                    >
                      <span className="badge badge-primary">
                        {selectedKabDetail.kuadran}
                      </span>
                      <button
                        onClick={() => setSelectedKabDetail(null)}
                        style={{
                          background: "#f1f5f9",
                          border: "1px solid #cbd5e1",
                          borderRadius: "4px",
                          padding: "4px 8px",
                          fontSize: "11px",
                          cursor: "pointer",
                        }}
                      >
                        Tutup Detail
                      </button>
                    </div>
                  </div>
                  <div className="kab-detail-grid">
                    <div className="kab-metric-card">
                      <span className="k-label">Parlemen Perempuan</span>
                      <span className="k-val">
                        {selectedKabDetail.parlemen}%
                      </span>
                      <span className="k-sub">
                        {selectedKabDetail.parlemen >= 30
                          ? "Memenuhi Kuota 30%"
                          : "Di bawah Kuota 30%"}
                      </span>
                    </div>
                    <div className="kab-metric-card">
                      <span className="k-label">Sumbangan Pendapatan</span>
                      <span className="k-val">
                        {selectedKabDetail.pendapatan}%
                      </span>
                      <span className="k-sub">Paritas: 50%</span>
                    </div>
                    <div className="kab-metric-card">
                      <span className="k-label">Tenaga Profesional</span>
                      <span className="k-val">
                        {selectedKabDetail.profesional}%
                      </span>
                      <span className="k-sub">Sektor Formal</span>
                    </div>
                    <div className="kab-metric-card">
                      <span className="k-label">TPAK Perempuan</span>
                      <span className="k-val">{selectedKabDetail.tpak}%</span>
                      <span className="k-sub">Partisipasi Kerja</span>
                    </div>
                    <div className="kab-metric-card">
                      <span className="k-label">Pengeluaran Riil</span>
                      <span className="k-val">
                        Rp
                        {Number(selectedKabDetail.pengeluaran).toLocaleString(
                          "id-ID",
                        )}
                      </span>
                      <span className="k-sub">per kapita/thn</span>
                    </div>
                    <div className="kab-metric-card">
                      <span className="k-label">IKPP Komposit</span>
                      <span className="k-val">
                        {selectedKabDetail.ikpp_komposit}
                      </span>
                      <span className="k-sub">Skor 0-100</span>
                    </div>
                    <div className="kab-metric-card">
                      <span className="k-label">Skor Keputusan</span>
                      <span className="k-val">
                        {selectedKabDetail.skor_keputusan}
                      </span>
                      <span className="k-sub">Politik & Agensi</span>
                    </div>
                    <div className="kab-metric-card">
                      <span className="k-label">Skor Ekonomi</span>
                      <span className="k-val">
                        {selectedKabDetail.skor_ekonomi}
                      </span>
                      <span className="k-sub">Kemandirian Finansial</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div
                  style={{
                    background: "#f8fafc",
                    padding: "12px 16px",
                    borderRadius: "8px",
                    border: "1px dashed #cbd5e1",
                    fontSize: "0.85rem",
                    color: "#64748b",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  <span>
                    <strong>Tip Eksplorasi:</strong> Klik salah satu wilayah
                    poligon pada peta untuk membuka rincian lengkap 8 indikator
                    gender BPS 2024 dan kuadran daerah tersebut. Gunakan filter
                    di sidebar kiri untuk zoom instan ke provinsi atau pulau
                    target.
                  </span>
                </div>
              )}

              <div className="story-grid">
                <div className="story-card green">
                  <h4>Cakupan Spasial 514 Kabupaten/Kota Seluruh Indonesia</h4>
                  <p>
                    Aplikasi ini memadankan batas poligon digital 514
                    kabupaten/kota dari 38 provinsi di Indonesia dengan 8
                    indikator gender BPS 2024. Melalui dasbor ini, disparitas
                    antara wilayah barat (Jawa &amp; Sumatera) dan timur (Nusa
                    Tenggara, Maluku, Papua) dapat diinspeksi secara detail
                    tanpa batasan wilayah tunggal.
                  </p>
                </div>
                <div className="story-card purple">
                  <h4>Integrasi Basemap ESRI Canvas &amp; GeoJSON</h4>
                  <p>
                    Basemap menggunakan <strong>ESRI World Gray Canvas</strong> dan
                    OpenStreetMap dengan rendering poligon GeoJSON teroptimasi secara
                    mandiri di sisi klien (*client-side*).
                  </p>
                </div>
              </div>
              <DataSourceBadge vars={[kabkotaChoroplethVar]} />
            </div>
          )}

          {/* Subtab 2: Peta Heatmap Spasial Kab/Kota */}
          {activeGeoSubtab === "geo-subtab-heatmap" && (
            <div className="card">
              <div className="card-header">
                <div>
                  <div className="card-title">
                    Peta Heatmap Spasial{" "}
                    {isProvinsi ? "Tingkat Provinsi" : "Kabupaten/Kota"} (Kernel
                    Density Estimation)
                  </div>
                  <div className="card-caption">
                    Visualisasi intensitas spasial bergradien halus menggunakan
                    algoritma Kernel Density pada peramban (Client-side Canvas
                    Heatmap).
                  </div>
                </div>
                <div
                  style={{
                    display: "flex",
                    gap: "10px",
                    alignItems: "center",
                    flexWrap: "wrap",
                  }}
                >
                  <span className="badge badge-success">
                    Client-Side Heatmap
                  </span>
                  <select
                    value={heatmapVar}
                    onChange={(e) => setHeatmapVar(e.target.value)}
                    style={{
                      padding: "6px 10px",
                      borderRadius: "6px",
                      border: "1px solid #cbd5e1",
                      fontSize: "12px",
                      fontWeight: "600",
                    }}
                  >
                    <option value="parlemen">
                      Intensitas: Parlemen Perempuan (%)
                    </option>
                    <option value="pendapatan">
                      Intensitas: Sumbangan Pendapatan (%)
                    </option>
                    <option value="pengeluaran">
                      Intensitas: Pengeluaran Riil (Ribu Rp)
                    </option>
                    <option value="profesional">
                      Intensitas: Tenaga Profesional (%)
                    </option>
                    <option value="tpak">Intensitas: TPAK Perempuan (%)</option>
                    <option value="skor_keputusan">
                      Intensitas: Skor Pengambilan Keputusan
                    </option>
                    <option value="skor_ekonomi">
                      Intensitas: Skor Partisipasi Ekonomi
                    </option>
                    <option value="ikpp_komposit">
                      Intensitas: IKPP Komposit Gender
                    </option>
                  </select>
                </div>
              </div>

              {/* Heatmap Parameter Controls */}
              <div className="heatmap-toolbar">
                <div className="heatmap-control-group">
                  <label htmlFor="radius-slider">
                    Radius Heat ({heatmapRadius}px):
                  </label>
                  <input
                    id="radius-slider"
                    type="range"
                    min="15"
                    max="50"
                    value={heatmapRadius}
                    onChange={(e) => setHeatmapRadius(Number(e.target.value))}
                    style={{ cursor: "pointer" }}
                  />
                </div>
                <div className="heatmap-control-group">
                  <label htmlFor="blur-slider">Blur ({heatmapBlur}px):</label>
                  <input
                    id="blur-slider"
                    type="range"
                    min="10"
                    max="35"
                    value={heatmapBlur}
                    onChange={(e) => setHeatmapBlur(Number(e.target.value))}
                    style={{ cursor: "pointer" }}
                  />
                </div>
                <div
                  className="heatmap-control-group"
                  style={{ marginLeft: "auto" }}
                >
                  <label
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      cursor: "pointer",
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={heatmapShowBoundaries}
                      onChange={(e) =>
                        setHeatmapShowBoundaries(e.target.checked)
                      }
                    />
                    <span>Overlay Garis Batas Poligon SHP</span>
                  </label>
                </div>
                <div className="heatmap-control-group">
                  <label
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      cursor: "pointer",
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={heatmapShowPoints}
                      onChange={(e) => setHeatmapShowPoints(e.target.checked)}
                    />
                    <span>
                      Titik Pusat {isProvinsi ? "Provinsi" : "Kab/Kota"}
                    </span>
                  </label>
                </div>
              </div>

              <div className="viz-layout-row">
                <div className="viz-layout-main">
                  <div id="heatmap-map" className="map-container" style={{ width: "100%", height: "600px" }}></div>
                </div>
                <div className="viz-layout-sidebar">
                  <VizLegendHeatmap
                    dataset={filteredKabkota}
                    varName={heatmapVar}
                  />
                </div>
              </div>

              <div className="story-grid">
                <div className="story-card green">
                  <h4>Interpretasi Hotspot Spasial</h4>
                  <p>
                    Heatmap spasial menampilkan konsentrasi peubah secara
                    kontinu. Warna merah menunjukkan zona konsentrasi tertinggi
                    (Hotspot), sedangkan warna biru menunjukkan zona intensitas
                    rendah (Coldspot). Pada indikator Parlemen, zona hotspot
                    terkonsentrasi di sejumlah kota metropolitan dan ibu kota
                    provinsi, sedangkan wilayah 3T dan pedalaman menunjukkan
                    intensitas dingin yang mengindikasikan defisit keterwakilan
                    politik perempuan.
                  </p>
                </div>
                <div className="story-card amber">
                  <h4>Sinergi Heatmap &amp; Batas Administrasi</h4>
                  <p>
                    Dengan mengaktifkan centang{" "}
                    <em>&quot;Overlay Garis Batas Poligon SHP&quot;</em>, batas
                    administratif hasil ekstraksi shapefile ditumpangkan secara
                    presisi di atas permukaan heatmap kontinu. Hal ini
                    memudahkan pengambil kebijakan untuk mengidentifikasi batas
                    yurisdiksi kab/kota mana yang berada di pusat hotspot maupun
                    coldspot.
                  </p>
                </div>
              </div>
              <DataSourceBadge vars={[heatmapVar]} />
            </div>
          )}

          {activeGeoSubtab === "geo-subtab-proportional" && (
            <div className="card">
              <div className="card-header">
                <div>
                  <div className="card-title">
                    Peta Simbol Proporsional{" "}
                    {isProvinsi ? "38 Provinsi" : "514 Kabupaten/Kota"}
                  </div>
                  <div className="card-caption">
                    Ukuran lingkaran mengkodekan intensitas volume, sedangkan
                    warna mengkodekan performa indikator.
                  </div>
                </div>
                <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                  <select
                    value={geoSizeVar}
                    onChange={(e) => setGeoSizeVar(e.target.value)}
                    style={{
                      padding: "6px 10px",
                      borderRadius: "6px",
                      border: "1px solid #cbd5e1",
                      fontSize: "12px",
                    }}
                  >
                    <option value="pengeluaran">
                      Ukuran: Pengeluaran Riil (Ribu Rp)
                    </option>
                    <option value="tpak">Ukuran: TPAK Perempuan (%)</option>
                    <option value="pendapatan">
                      Ukuran: Sumbangan Pendapatan (%)
                    </option>
                    <option value="profesional">
                      Ukuran: Tenaga Profesional (%)
                    </option>
                  </select>
                  <select
                    value={geoColorVar}
                    onChange={(e) => setGeoColorVar(e.target.value)}
                    style={{
                      padding: "6px 10px",
                      borderRadius: "6px",
                      border: "1px solid #cbd5e1",
                      fontSize: "12px",
                    }}
                  >
                    <option value="skor_keputusan">
                      Warna: Skor Keputusan (0-100)
                    </option>
                    <option value="skor_ekonomi">
                      Warna: Skor Ekonomi (0-100)
                    </option>
                    <option value="parlemen">
                      Warna: Parlemen Perempuan (%)
                    </option>
                    <option value="ikpp_komposit">
                      Warna: IKPP Komposit (0-100)
                    </option>
                  </select>
                </div>
              </div>
              <div className="viz-layout-row">
                <div className="viz-layout-main">
                  <div id="leaflet-map" className="map-container" style={{ width: "100%", height: "600px" }}></div>
                </div>
                <div className="viz-layout-sidebar">
                  <VizLegendProportional
                    dataset={isProvinsi ? enrichedProvinsi : filteredKabkota}
                    sizeVar={geoSizeVar}
                    colorVar={geoColorVar}
                    paletteName={selectedPalette}
                  />
                </div>
              </div>
              <DataSourceBadge vars={[geoSizeVar, geoColorVar]} />
            </div>
          )}

          {activeGeoSubtab === "geo-subtab-choropleth" && (
            <div className="card">
              <div className="card-header">
                <div>
                  <div className="card-title">
                    Peta Choropleth Rasio Tingkat Provinsi
                  </div>
                  <div className="card-caption">
                    Pewarnaan tematik poligon provinsi menggunakan palet warna
                    ramah buta warna (*colorblind-safe*).
                  </div>
                </div>
                <div>
                  <select
                    value={choroplethVar}
                    onChange={(e) => setChoroplethVar(e.target.value)}
                    style={{
                      padding: "6px 10px",
                      borderRadius: "6px",
                      border: "1px solid #cbd5e1",
                      fontSize: "12px",
                    }}
                  >
                    <option value="parlemen">
                      Indikator: Parlemen Perempuan (%)
                    </option>
                    <option value="profesional">
                      Indikator: Tenaga Profesional (%)
                    </option>
                    <option value="pendapatan">
                      Indikator: Sumbangan Pendapatan (%)
                    </option>
                    <option value="tpak">Indikator: TPAK Perempuan (%)</option>
                    <option value="pengeluaran">
                      Indikator: Pengeluaran per Kapita
                    </option>
                    <option value="ahh">
                      Indikator: Angka Harapan Hidup (AHH)
                    </option>
                  </select>
                </div>
              </div>
              <div className="viz-layout-row">
                <div className="viz-layout-main">
                  <div id="choropleth-map" className="map-container" style={{ width: "100%", height: "600px" }}></div>
                </div>
                <div className="viz-layout-sidebar">
                  <VizLegendChoropleth
                    dataset={allProvinsi}
                    varName={choroplethVar}
                    paletteName={selectedPalette}
                  />
                </div>
              </div>
              <DataSourceBadge vars={[choroplethVar]} />
            </div>
          )}

          {activeGeoSubtab === "geo-subtab-lisa" && (
            <div className="card">
              <div className="card-header">
                <div>
                  <div className="card-title">
                    Peta Klaster Spasial LISA (Local Moran&apos;s I, p &lt;
                    0.05)
                  </div>
                  <div className="card-caption">
                    Mendeteksi aglomerasi Hotspot (High-High), Coldspot
                    (Low-Low), dan Pencilan Spasial (High-Low / Low-High).
                  </div>
                </div>
                <div>
                  <select
                    value={lisaClusterVar}
                    onChange={(e) => setLisaClusterVar(e.target.value)}
                    style={{
                      padding: "6px 10px",
                      borderRadius: "6px",
                      border: "1px solid #cbd5e1",
                      fontSize: "12px",
                    }}
                  >
                    <option value="lisa_cluster_keputusan">
                      Klaster Pengambilan Keputusan
                    </option>
                    <option value="lisa_cluster_ekonomi">
                      Klaster Partisipasi Ekonomi
                    </option>
                  </select>
                </div>
              </div>
              <div className="viz-layout-row">
                <div className="viz-layout-main">
                  <div id="lisa-map" className="map-container" style={{ width: "100%", height: "600px" }}></div>
                </div>
                <div className="viz-layout-sidebar">
                  <VizLegendLISA
                    dataset={filteredKabkota}
                    clusterVar={lisaClusterVar}
                  />
                </div>
              </div>
              <DataSourceBadge vars={[lisaClusterVar]} />
            </div>
          )}
        </section>

        {/* Tab 3: Multivariate */}
        <section
          className={`tab-pane ${activeTab === "tab-multivariate" ? "active" : ""}`}
        >
          <div className="subtabs-nav">
            <button
              className={`subtab-btn ${activeMultiSubtab === "multi-subtab-pca" ? "active" : ""}`}
              onClick={() => setActiveMultiSubtab("multi-subtab-pca")}
            >
              <i className="fa-solid fa-diagram-project" style={{ marginRight: "6px" }}></i>
              PCA Biplot
            </button>
            <button
              className={`subtab-btn ${activeMultiSubtab === "multi-subtab-parcoords" ? "active" : ""}`}
              onClick={() => setActiveMultiSubtab("multi-subtab-parcoords")}
            >
              <i className="fa-solid fa-bars-staggered" style={{ marginRight: "6px" }}></i>
              Parallel Coordinates
            </button>
            <button
              className={`subtab-btn ${activeMultiSubtab === "multi-subtab-heatmap" ? "active" : ""}`}
              onClick={() => setActiveMultiSubtab("multi-subtab-heatmap")}
            >
              <i className="fa-solid fa-table-cells" style={{ marginRight: "6px" }}></i>
              Korelasi Heatmap
            </button>
            <button
              className={`subtab-btn ${activeMultiSubtab === "multi-subtab-radar" ? "active" : ""}`}
              onClick={() => setActiveMultiSubtab("multi-subtab-radar")}
            >
              <i className="fa-solid fa-compass-drafting" style={{ marginRight: "6px" }}></i>
              Profil Radar
            </button>
          </div>

          {activeMultiSubtab === "multi-subtab-pca" && (
            <div className="card">
              <div className="card-header">
                <div>
                  <div className="card-title">
                    PCA Biplot: Proyeksi 8 Indikator BPS ke 2 Dimensi Laten
                  </div>
                  <div className="card-caption">
                    Menerangkan 66.9% total variansi data. Panah merah
                    merepresentasikan vektor loading dari masing-masing peubah.
                  </div>
                </div>
                <div>
                  <select
                    value={pcaColorBy}
                    onChange={(e) => setPcaColorBy(e.target.value)}
                    style={{
                      padding: "6px 10px",
                      borderRadius: "6px",
                      border: "1px solid #cbd5e1",
                      fontSize: "12px",
                    }}
                  >
                    <option value="pulau">Warna: Wilayah Pulau</option>
                    <option value="tipe">Warna: Tipe (Kab vs Kota)</option>
                    <option value="kuadran">Warna: Kuadran Tipologi</option>
                  </select>
                </div>
              </div>
              <div className="viz-layout-row">
                <div className="viz-layout-main">
                  <div id="pca-biplot-chart" className="chart-box"></div>
                </div>
                <div className="viz-layout-sidebar">
                  <VizLegendPCA
                    dataset={filteredKabkota}
                    varPC1={pcaMeta?.var_exp_pc1 || "42.4"}
                    varPC2={pcaMeta?.var_exp_pc2 || "24.5"}
                  />
                </div>
              </div>
              <DataSourceBadge
                vars={[
                  "pengeluaran",
                  "ahh",
                  "hls",
                  "rls",
                  "tpak",
                  "pendapatan",
                  "parlemen",
                  "profesional",
                ]}
              />
            </div>
          )}

          {activeMultiSubtab === "multi-subtab-parcoords" && (
            <div className="card">
              <div className="card-header">
                <div className="card-title">
                  Diagram Koordinat Paralel (Parallel Coordinates)
                </div>
              </div>
              <div className="viz-layout-row">
                <div className="viz-layout-main">
                  <div id="parallel-coords-chart" className="chart-box"></div>
                </div>
                <div className="viz-layout-sidebar">
                  <VizLegendParcoords
                    dataset={filteredKabkota}
                    paletteName={selectedPalette}
                  />
                </div>
              </div>
              <DataSourceBadge
                vars={[
                  "parlemen",
                  "pendapatan",
                  "tpak",
                  "profesional",
                  "pengeluaran",
                ]}
              />
            </div>
          )}

          {activeMultiSubtab === "multi-subtab-heatmap" && (
            <div className="card">
              <div className="card-header">
                <div className="card-title">
                  Clustered Heatmap: Matriks Korelasi Hierarkis
                </div>
              </div>
              <div className="viz-layout-row">
                <div className="viz-layout-main">
                  <div id="heatmap-chart" className="chart-box"></div>
                </div>
                <div className="viz-layout-sidebar">
                  <VizLegendCorrHeatmap />
                </div>
              </div>
              <DataSourceBadge
                vars={[
                  "parlemen",
                  "pendapatan",
                  "tpak",
                  "profesional",
                  "pengeluaran",
                  "ahh",
                  "hls",
                  "rls",
                ]}
              />
            </div>
          )}

          {activeMultiSubtab === "multi-subtab-radar" && (
            <div className="card">
              <div className="card-header">
                <div className="card-title">
                  Radar Chart: Perbandingan Profil Multidimensi Antar Wilayah
                </div>
              </div>
              <div className="viz-layout-row">
                <div className="viz-layout-main">
                  <div id="radar-chart" className="chart-box"></div>
                </div>
                <div className="viz-layout-sidebar">
                  <VizLegendRadar />
                </div>
              </div>
              <DataSourceBadge
                vars={[
                  "pengeluaran",
                  "ahh",
                  "hls",
                  "rls",
                  "tpak",
                  "pendapatan",
                  "parlemen",
                  "profesional",
                ]}
              />
            </div>
          )}
        </section>

        {/* Tab 4: Hierarchical */}
        <section
          className={`tab-pane ${activeTab === "tab-hierarchical" ? "active" : ""}`}
        >
          <div className="subtabs-nav">
            <button
              className={`subtab-btn ${activeHierSubtab === "hier-subtab-treemap" ? "active" : ""}`}
              onClick={() => setActiveHierSubtab("hier-subtab-treemap")}
            >
              <i className="fa-solid fa-chart-pie" style={{ marginRight: "6px" }}></i>
              Treemap Interaktif
            </button>
            <button
              className={`subtab-btn ${activeHierSubtab === "hier-subtab-sunburst" ? "active" : ""}`}
              onClick={() => setActiveHierSubtab("hier-subtab-sunburst")}
            >
              <i className="fa-solid fa-circle-notch" style={{ marginRight: "6px" }}></i>
              Sunburst Chart
            </button>
            <button
              className={`subtab-btn ${activeHierSubtab === "hier-subtab-summary" ? "active" : ""}`}
              onClick={() => setActiveHierSubtab("hier-subtab-summary")}
            >
              <i className="fa-solid fa-list-check" style={{ marginRight: "6px" }}></i>
              Rangkuman Pulau
            </button>
          </div>

          <div
            style={{
              display: "flex",
              gap: "12px",
              marginBottom: "12px",
              flexWrap: "wrap",
            }}
          >
            <div>
              <label
                style={{
                  fontSize: "11px",
                  fontWeight: "600",
                  color: "#475569",
                }}
              >
                Variabel Ukuran Kotak / Irisan:
              </label>
              <select
                value={hierSizeVar}
                onChange={(e) => setHierSizeVar(e.target.value)}
                style={{
                  padding: "6px 10px",
                  borderRadius: "6px",
                  border: "1px solid #cbd5e1",
                  fontSize: "12px",
                  display: "block",
                }}
              >
                <option value="pengeluaran">Pengeluaran Riil (Ribu Rp)</option>
                <option value="pendapatan">Sumbangan Pendapatan (%)</option>
                <option value="tpak">TPAK Perempuan (%)</option>
              </select>
            </div>
            <div>
              <label
                style={{
                  fontSize: "11px",
                  fontWeight: "600",
                  color: "#475569",
                }}
              >
                Variabel Warna Kotak / Irisan:
              </label>
              <select
                value={hierColorVar}
                onChange={(e) => setHierColorVar(e.target.value)}
                style={{
                  padding: "6px 10px",
                  borderRadius: "6px",
                  border: "1px solid #cbd5e1",
                  fontSize: "12px",
                  display: "block",
                }}
              >
                <option value="parlemen">Keterlibatan di Parlemen (%)</option>
                <option value="profesional">Tenaga Profesional (%)</option>
                <option value="skor_keputusan">Skor Keputusan (0-100)</option>
                <option value="ikpp_komposit">IKPP Komposit (0-100)</option>
              </select>
            </div>
          </div>

          {activeHierSubtab === "hier-subtab-treemap" && (
            <div className="card hierarchical-card">
              <div className="viz-layout-row">
                <div className="viz-layout-main">
                  <div id="treemap-chart" className="chart-box"></div>
                </div>
                <div className="viz-layout-sidebar">
                  <VizLegendTreemap
                    dataset={isProvinsi ? enrichedProvinsi : filteredKabkota}
                    isProvinsi={isProvinsi}
                    sizeVar={hierSizeVar}
                    colorVar={hierColorVar}
                    paletteName={selectedPalette}
                  />
                </div>
              </div>
              <DataSourceBadge vars={[hierSizeVar, hierColorVar]} />
            </div>
          )}

          {activeHierSubtab === "hier-subtab-sunburst" && (
            <div className="card hierarchical-card">
              <div className="viz-layout-row">
                <div className="viz-layout-main">
                  <div id="sunburst-chart" className="chart-box"></div>
                </div>
                <div className="viz-layout-sidebar">
                  <VizLegendSunburst
                    dataset={isProvinsi ? enrichedProvinsi : filteredKabkota}
                    isProvinsi={isProvinsi}
                    sizeVar={hierSizeVar}
                    colorVar={hierColorVar}
                    paletteName={selectedPalette}
                  />
                </div>
              </div>
              <DataSourceBadge vars={[hierSizeVar, hierColorVar]} />
            </div>
          )}

          {activeHierSubtab === "hier-subtab-summary" && (
            <div className="card">
              <div className="table-responsive">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Wilayah Pulau</th>
                      <th>Jumlah {isProvinsi ? "Provinsi" : "Kab/Kota"}</th>
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
                    {Object.entries(islandAgg).map(([pulau, agg]) => (
                      <tr key={pulau}>
                        <td>
                          <b>{pulau}</b>
                        </td>
                        <td>{agg.count}</td>
                        <td>{(agg.parlemen / agg.count).toFixed(2)}%</td>
                        <td>{(agg.pendapatan / agg.count).toFixed(2)}%</td>
                        <td>{(agg.profesional / agg.count).toFixed(2)}%</td>
                        <td>{(agg.tpak / agg.count).toFixed(2)}%</td>
                        <td>
                          Rp
                          {Math.round(
                            agg.pengeluaran / agg.count,
                          ).toLocaleString()}
                        </td>
                        <td>
                          <span style={{ fontWeight: "700", color: "#2563eb" }}>
                            {(agg.keputusan / agg.count).toFixed(1)}
                          </span>
                        </td>
                        <td>
                          <span style={{ fontWeight: "700", color: "#10b981" }}>
                            {(agg.ekonomi / agg.count).toFixed(1)}
                          </span>
                        </td>
                        <td>
                          <span style={{ fontWeight: "700", color: "#6366f1" }}>
                            {(agg.ikpp / agg.count).toFixed(1)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <VizLegendIslandSummary isProvinsi={isProvinsi} />
              <DataSourceBadge
                vars={[
                  "parlemen",
                  "pendapatan",
                  "profesional",
                  "tpak",
                  "pengeluaran",
                ]}
              />
            </div>
          )}
        </section>

        {/* Tab 5: Data Explorer */}
        <section
          className={`tab-pane ${activeTab === "tab-data" ? "active" : ""}`}
        >
          <div className="card">
            <div className="card-header">
              <div>
                <div className="card-title">
                  Pangkalan Data{" "}
                  {isProvinsi
                    ? "38 Provinsi Indonesia (Agregat BPS 2024)"
                    : "514 Kabupaten/Kota Indonesia (BPS 2024)"}
                </div>
                <div className="card-caption">
                  Gunakan pencarian nama daerah atau klik pada tajuk kolom untuk
                  mengurutkan data secara fleksibel.
                </div>
              </div>
              <button className="btn-download" onClick={downloadCSV}>
                Unduh Data CSV Terfilter
              </button>
            </div>

            <div className="table-controls">
              <input
                type="text"
                className="search-input"
                placeholder={
                  isProvinsi
                    ? "Cari nama provinsi..."
                    : "Cari nama kabupaten, kota, atau provinsi..."
                }
                value={tableSearch}
                onChange={(e) => {
                  setTableSearch(e.target.value);
                  setCurrentPage(1);
                }}
              />
              <div style={{ fontSize: "12px", color: "#64748b" }}>
                Menampilkan {tableRecords.length === 0 ? 0 : pageStart + 1} -{" "}
                {Math.min(pageStart + rowsPerPage, tableRecords.length)} dari{" "}
                {tableRecords.length} {isProvinsi ? "provinsi" : "daerah"}
              </div>
            </div>

            <div className="table-responsive">
              <table className="data-table">
                <thead>
                  <tr>
                    <th onClick={() => handleSort("kode_wilayah")}>Kode</th>
                    <th onClick={() => handleSort("nama_resmi")}>
                      {isProvinsi ? "Nama Provinsi" : "Nama Daerah"}
                    </th>
                    <th onClick={() => handleSort("tipe")}>Tipe</th>
                    <th onClick={() => handleSort("provinsi")}>Provinsi</th>
                    <th onClick={() => handleSort("pulau")}>Pulau</th>
                    <th onClick={() => handleSort("parlemen")}>Parlemen</th>
                    <th onClick={() => handleSort("pendapatan")}>Pendapatan</th>
                    <th onClick={() => handleSort("profesional")}>
                      Profesional
                    </th>
                    <th onClick={() => handleSort("tpak")}>TPAK</th>
                    <th onClick={() => handleSort("pengeluaran")}>
                      Pengeluaran
                    </th>
                    <th onClick={() => handleSort("skor_keputusan")}>
                      Keputusan
                    </th>
                    <th onClick={() => handleSort("skor_ekonomi")}>Ekonomi</th>
                    <th onClick={() => handleSort("ikpp_komposit")}>IKPP</th>
                    <th onClick={() => handleSort("kuadran")}>Kuadran</th>
                  </tr>
                </thead>
                <tbody>
                  {displayRows.map((d) => (
                    <tr key={d.kode_wilayah}>
                      <td>{d.kode_wilayah}</td>
                      <td>
                        <b>{d.nama_resmi}</b>
                      </td>
                      <td>{d.tipe}</td>
                      <td>{d.provinsi}</td>
                      <td>{d.pulau}</td>
                      <td>{Number(d.parlemen).toFixed(2)}%</td>
                      <td>{Number(d.pendapatan).toFixed(2)}%</td>
                      <td>{Number(d.profesional).toFixed(2)}%</td>
                      <td>{Number(d.tpak).toFixed(2)}%</td>
                      <td>Rp{Number(d.pengeluaran).toLocaleString()}</td>
                      <td>
                        <b>{Number(d.skor_keputusan).toFixed(1)}</b>
                      </td>
                      <td>
                        <b>{Number(d.skor_ekonomi).toFixed(1)}</b>
                      </td>
                      <td>
                        <span style={{ fontWeight: "700", color: "#2563eb" }}>
                          {Number(d.ikpp_komposit).toFixed(1)}
                        </span>
                      </td>
                      <td>
                        <span
                          style={{
                            fontSize: "11px",
                            padding: "2px 6px",
                            background: "#f1f5f9",
                            borderRadius: "4px",
                          }}
                        >
                          {d.kuadran.split(" ")[0]} {d.kuadran.split(" ")[1]}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="pagination">
              <div>Gunakan tombol navigasi untuk berpindah halaman amatan</div>
              <div className="pagination-btns">
                <button
                  className="page-btn"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(currentPage - 1)}
                >
                  &laquo; Prev
                </button>
                <span style={{ padding: "4px 8px", fontWeight: "600" }}>
                  Hal {currentPage} / {totalPages}
                </span>
                <button
                  className="page-btn"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(currentPage + 1)}
                >
                  Next &raquo;
                </button>
              </div>
            </div>
            <DataSourceBadge
              vars={[
                "pengeluaran",
                "ahh",
                "hls",
                "rls",
                "tpak",
                "pendapatan",
                "parlemen",
                "profesional",
              ]}
            />
          </div>
        </section>

        {/* Tab 6: Methodology */}
        <section
          className={`tab-pane ${activeTab === "tab-method" ? "active" : ""}`}
        >
          <div className="method-box">
            <h3>1. Sumber Data Resmi BPS (Tahun 2024)</h3>
            <p>
              Seluruh indikator dalam proyek visualisasi ini bersumber secara
              sah dari publikasi tabel statistik resmi Badan Pusat Statistik
              (BPS) Republik Indonesia (Tahun 2024):
            </p>
            <ul>
              <li>
                <strong>Pengeluaran per Kapita Disesuaikan:</strong>{" "}
                <a
                  href="https://www.bps.go.id/id/statistics-table/2/NDE2IzI=/-metode-baru--pengeluaran-per-kapita-disesuaikan.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "#2563eb", textDecoration: "underline" }}
                >
                  [Metode Baru] Pengeluaran per Kapita Disesuaikan (Tahun
                  2024){" "}
                </a>
              </li>
              <li>
                <strong>Angka Harapan Hidup (AHH):</strong>{" "}
                <a
                  href="https://www.bps.go.id/id/statistics-table/2/NDU1IzI=/angkaharapan-hidup--ahh--menurut-kabupaten-kota-dan-jenis-kelamin.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "#2563eb", textDecoration: "underline" }}
                >
                  Angka Harapan Hidup (AHH) Menurut Kabupaten/Kota dan Jenis
                  Kelamin (Tahun 2024){" "}
                </a>
              </li>
              <li>
                <strong>Harapan Lama Sekolah (HLS):</strong>{" "}
                <a
                  href="https://www.bps.go.id/id/statistics-table/2/NDE3IzI=/-new-method--expected-years-of-schooling.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "#2563eb", textDecoration: "underline" }}
                >
                  [Metode Baru] Harapan Lama Sekolah (Tahun 2024){" "}
                </a>
              </li>
              <li>
                <strong>Rata-rata Lama Sekolah (RLS):</strong>{" "}
                <a
                  href="https://www.bps.go.id/id/statistics-table/2/NDE1IzI=/-metode-baru--rata-rata-lama-sekolah.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "#2563eb", textDecoration: "underline" }}
                >
                  [Metode Baru] Rata-rata Lama Sekolah (Tahun 2024){" "}
                </a>
              </li>
              <li>
                <strong>Tingkat Partisipasi Angkatan Kerja (TPAK):</strong>{" "}
                <a
                  href="https://www.bps.go.id/id/statistics-table/2/MjIwMCMy/tingkat-partisipasi-angkatan-kerja-menurut-jenis-kelamin.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "#2563eb", textDecoration: "underline" }}
                >
                  Tingkat Partisipasi Angkatan Kerja Menurut Jenis Kelamin
                  (Tahun 2024){" "}
                </a>
              </li>
              <li>
                <strong>Sumbangan Pendapatan Perempuan:</strong>{" "}
                <a
                  href="https://www.bps.go.id/id/statistics-table/2/NDY3IzI=/revenue-contribution-of-women.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "#2563eb", textDecoration: "underline" }}
                >
                  Sumbangan Pendapatan Perempuan (Tahun 2024){" "}
                </a>
              </li>
              <li>
                <strong>Keterlibatan Perempuan di Parlemen:</strong>{" "}
                <a
                  href="https://www.bps.go.id/id/statistics-table/2/NDY0IzI=/the-involvement-of-women-in-parliament.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "#2563eb", textDecoration: "underline" }}
                >
                  Keterlibatan Perempuan di Parlemen (Tahun 2024){" "}
                </a>
              </li>
              <li>
                <strong>Perempuan sebagai Tenaga Profesional:</strong>{" "}
                <a
                  href="https://www.bps.go.id/id/statistics-table/2/NDY1IzI=/the-percentage-of-female-professional-staff.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "#2563eb", textDecoration: "underline" }}
                >
                  Tenaga Profesional Perempuan (Tahun 2024){" "}
                </a>
              </li>
              <li>
                <strong>Atribusi Wajib:</strong> Sumber: BPS (Badan Pusat
                Statistik Republik Indonesia).
              </li>
            </ul>
          </div>

          <div className="method-box">
            <h3>2. Pra-pemrosesan Data & Penanganan Nilai Hilang</h3>
            <ul>
              <li>
                <strong>Rekonsiliasi Wilayah:</strong> Sinkronisasi struktur
                administratif pasca-pemekaran 4 DOB Papua dan pemisahan Kaltara
                dari Kaltim hingga mencakup persis 514 kabupaten/kota dan 38
                provinsi.
              </li>
              <li>
                <strong>Penanganan Missing Values:</strong> 14 kabupaten di
                pedalaman Papua diimputasi menggunakan{" "}
                <em>K-Nearest Neighbors</em> (KNN, k=5, distance-weighted) pada
                matriks fitur terstandarisasi. Seluruh indikator politik,
                pendapatan, dan profesionalitas tetap menggunakan data observasi
                riil 100%.
              </li>
              <li>
                <strong>Normalisasi Min-Max:</strong> Pembentukan Skor Ekonomi,
                Skor Keputusan, dan Indeks Komposit Pemberdayaan Perempuan
                (IKPP) berskala 0–100.
              </li>
            </ul>
          </div>

          <div className="method-box">
            <h3>3. Justifikasi Desain & Visual Encoding</h3>
            <ul>
              <li>
                <strong>Posisi Spasial:</strong> Dimanfaatkan pada scatter plot
                dan peta koordinat geografis sebagai saluran perseptual dengan
                akurasi tertinggi (Cleveland &amp; McGill, 1984).
              </li>
              <li>
                <strong>Pewarnaan (Colorblind-Safe):</strong> Menggunakan skala
                warna perseptual seragam (<em>Viridis, Cividis, Plasma</em>)
                yang menjamin aksesibilitas bagi penderita buta warna
                (protanopia, deuteranopia).
              </li>
              <li>
                <strong>Ukuran Simbol:</strong> Mengkodekan besaran absolut
                taraf hidup (pengeluaran riil per kapita) dengan batas radius
                proporsional untuk mencegah oklusi visual.
              </li>
            </ul>
          </div>
        </section>

        {/* Tab 7: Unduh Data (Data Download Center) */}
        <section
          className={`tab-pane ${activeTab === "tab-download" ? "active" : ""}`}
        >
          <div className="card">
            <div className="card-header">
              <div>
                <div className="card-title">
                  <i className="fa-solid fa-cloud-arrow-down" style={{ color: "#1F5FCC" }}></i>
                  Pusat Unduh Data &amp; Spesifikasi Teknis (Data Download Center)
                </div>
                <div className="card-caption">
                  Unduh berkas data resmi BPS RI 2024 (514 Kabupaten/Kota dan 38 Provinsi) dalam format CSV, JSON, serta Shapefile GeoJSON batas spasial.
                </div>
              </div>
              <span className="badge badge-bps">Akses Data Terbuka Resmi</span>
            </div>

            <div style={{ padding: "20px 24px", display: "flex", flexDirection: "column", gap: "20px" }}>
              <div style={{
                background: "#F8FAFC",
                border: "1px solid #DDE4EE",
                borderRadius: "8px",
                padding: "14px 18px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: "12px",
                fontSize: "12.5px",
                color: "#475569"
              }}>
                <div>
                  <strong style={{ color: "#0B2F63" }}>Ketentuan Atribusi Lisensi:</strong> Dataset disediakan di bawah lisensi resmi Badan Pusat Statistik (BPS RI) &amp; Politeknik Statistika STIS untuk keperluan riset akademik, advokasi kebijakan, dan jurnalisme data berbasis fakta.
                </div>
                <span className="badge badge-success">Standar Data Terbuka BPS 2024</span>
              </div>

              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
                gap: "16px"
              }}>
                {/* Card 1: Kab/Kota CSV */}
                <div className="kpi-card accent-blue" style={{ minHeight: "180px", justifyContent: "space-between" }}>
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                      <span className="badge badge-bps">CSV (RFC 4180)</span>
                      <span style={{ fontSize: "11px", color: "#667085", fontWeight: "600" }}>514 Baris &bull; 84 KB</span>
                    </div>
                    <div style={{ fontWeight: "700", fontSize: "14px", color: "#0B2F63", marginBottom: "4px" }}>
                      Dataset 514 Kabupaten/Kota (CSV)
                    </div>
                    <div style={{ fontSize: "12px", color: "#667085", lineHeight: "1.4" }}>
                      Tabel terstruktur 17 kolom mencakup 8 indikator gender BPS 2024, indeks komposit IKPP, skor ekonomi, keputusan, dan tipologi kuadran.
                    </div>
                  </div>
                  <button
                    onClick={downloadCSV}
                    className="btn-export"
                    style={{ alignSelf: "flex-start", marginTop: "12px" }}
                  >
                    <i className="fa-solid fa-file-csv"></i>
                    <span>Unduh CSV Kab/Kota</span>
                  </button>
                </div>

                {/* Card 2: Kab/Kota JSON */}
                <div className="kpi-card accent-green" style={{ minHeight: "180px", justifyContent: "space-between" }}>
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                      <span className="badge badge-success">JSON Array</span>
                      <span style={{ fontSize: "11px", color: "#667085", fontWeight: "600" }}>514 Records &bull; 140 KB</span>
                    </div>
                    <div style={{ fontWeight: "700", fontSize: "14px", color: "#0B2F63", marginBottom: "4px" }}>
                      Dataset 514 Kabupaten/Kota (JSON)
                    </div>
                    <div style={{ fontSize: "12px", color: "#667085", lineHeight: "1.4" }}>
                      Format JSON terstruktur untuk konsumsi API web, pipeline Python/R, lengkap dengan koordinat centroid lintang/bujur dan status LISA cluster.
                    </div>
                  </div>
                  <button
                    onClick={() => downloadDatasetJSON(allKabkota, "bps_gender_514_kabkota_2024.json")}
                    className="btn-export"
                    style={{ alignSelf: "flex-start", marginTop: "12px" }}
                  >
                    <i className="fa-solid fa-file-code"></i>
                    <span>Unduh JSON Kab/Kota</span>
                  </button>
                </div>

                {/* Card 3: Provinsi CSV */}
                <div className="kpi-card accent-purple" style={{ minHeight: "180px", justifyContent: "space-between" }}>
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                      <span className="badge badge-accent">CSV (RFC 4180)</span>
                      <span style={{ fontSize: "11px", color: "#667085", fontWeight: "600" }}>38 Baris &bull; 8 KB</span>
                    </div>
                    <div style={{ fontWeight: "700", fontSize: "14px", color: "#0B2F63", marginBottom: "4px" }}>
                      Dataset Agregat 38 Provinsi (CSV)
                    </div>
                    <div style={{ fontSize: "12px", color: "#667085", lineHeight: "1.4" }}>
                      Rekapitulasi makro tingkat provinsi seluruh Indonesia pasca-pemekaran 4 DOB Papua dan pemisahan Kalimantan Utara.
                    </div>
                  </div>
                  <button
                    onClick={downloadProvinsiCSV}
                    className="btn-export"
                    style={{ alignSelf: "flex-start", marginTop: "12px" }}
                  >
                    <i className="fa-solid fa-file-csv"></i>
                    <span>Unduh CSV 38 Provinsi</span>
                  </button>
                </div>

                {/* Card 4: Provinsi JSON */}
                <div className="kpi-card accent-amber" style={{ minHeight: "180px", justifyContent: "space-between" }}>
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                      <span className="badge" style={{ background: "#FEF3C7", color: "#D97706", borderColor: "#FDE68A" }}>JSON Array</span>
                      <span style={{ fontSize: "11px", color: "#667085", fontWeight: "600" }}>38 Records &bull; 12 KB</span>
                    </div>
                    <div style={{ fontWeight: "700", fontSize: "14px", color: "#0B2F63", marginBottom: "4px" }}>
                      Dataset Agregat 38 Provinsi (JSON)
                    </div>
                    <div style={{ fontSize: "12px", color: "#667085", lineHeight: "1.4" }}>
                      Dataset agregat provinsi berformat JSON dengan skor komposit pembobotan rata-rata kabupaten/kota dan klasifikasi kuadran.
                    </div>
                  </div>
                  <button
                    onClick={() => downloadDatasetJSON(enrichedProvinsi, "bps_gender_38_provinsi_2024.json")}
                    className="btn-export"
                    style={{ alignSelf: "flex-start", marginTop: "12px" }}
                  >
                    <i className="fa-solid fa-file-code"></i>
                    <span>Unduh JSON 38 Provinsi</span>
                  </button>
                </div>

                {/* Card 5: GeoJSON Kab/Kota */}
                <div className="kpi-card accent-blue" style={{ minHeight: "180px", justifyContent: "space-between" }}>
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                      <span className="badge badge-bps">GeoJSON (WGS84)</span>
                      <span style={{ fontSize: "11px", color: "#667085", fontWeight: "600" }}>0.79 MB &bull; Poligon 514 Kab/Kota</span>
                    </div>
                    <div style={{ fontWeight: "700", fontSize: "14px", color: "#0B2F63", marginBottom: "4px" }}>
                      Batas Administrasi Poligon Kab/Kota (GeoJSON)
                    </div>
                    <div style={{ fontSize: "12px", color: "#667085", lineHeight: "1.4" }}>
                      Lapisan poligon spasial EPSG:4326 terintegrasi dengan kode wilayah resmi BPS RI dan nama kabupaten/kota baku.
                    </div>
                  </div>
                  <a
                    href="/data/kabkota_indonesia.geojson"
                    download="kabkota_indonesia.geojson"
                    className="btn-export"
                    style={{ alignSelf: "flex-start", marginTop: "12px" }}
                  >
                    <i className="fa-solid fa-map-location-dot"></i>
                    <span>Unduh GeoJSON Kab/Kota</span>
                  </a>
                </div>

                {/* Card 6: GeoJSON Provinsi */}
                <div className="kpi-card accent-green" style={{ minHeight: "180px", justifyContent: "space-between" }}>
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                      <span className="badge badge-success">GeoJSON (WGS84)</span>
                      <span style={{ fontSize: "11px", color: "#667085", fontWeight: "600" }}>0.22 MB &bull; Poligon 38 Provinsi</span>
                    </div>
                    <div style={{ fontWeight: "700", fontSize: "14px", color: "#0B2F63", marginBottom: "4px" }}>
                      Batas Administrasi Poligon Provinsi (GeoJSON)
                    </div>
                    <div style={{ fontSize: "12px", color: "#667085", lineHeight: "1.4" }}>
                      Lapisan spasial batas 38 provinsi di Indonesia teroptimasi untuk pemetaan choropleth dan analisis regional makro.
                    </div>
                  </div>
                  <a
                    href="/data/provinsi_indonesia.geojson"
                    download="provinsi_indonesia.geojson"
                    className="btn-export"
                    style={{ alignSelf: "flex-start", marginTop: "12px" }}
                  >
                    <i className="fa-solid fa-map-location-dot"></i>
                    <span>Unduh GeoJSON Provinsi</span>
                  </a>
                </div>
              </div>

              {/* Data Dictionary Preview */}
              <div style={{ marginTop: "10px" }}>
                <h4 style={{ fontSize: "14px", fontWeight: "700", color: "#0B2F63", marginBottom: "10px" }}>
                  Kamus Peubah Data (Data Dictionary)
                </h4>
                <div className="table-responsive">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Nama Kolom</th>
                        <th>Tipe Data</th>
                        <th>Satuan / Skala</th>
                        <th>Definisi Operasional BPS RI</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td><code>kode_wilayah</code></td>
                        <td>Numerik (Integer)</td>
                        <td>Kode Wilayah BPS</td>
                        <td>Identifikator unik yurisdiksi administratif 2 digit provinsi + 2 digit kab/kota</td>
                      </tr>
                      <tr>
                        <td><code>nama_resmi</code></td>
                        <td>Teks (String)</td>
                        <td>Nama Administrasi</td>
                        <td>Nama resmi kabupaten, kota, atau provinsi sesuai standar nomenklatur BPS RI</td>
                      </tr>
                      <tr>
                        <td><code>pulau</code></td>
                        <td>Kategorikal</td>
                        <td>Gugus Pulau</td>
                        <td>Klasifikasi gugus pulau (Sumatera, Jawa, Bali &amp; Nusa Tenggara, Kalimantan, Sulawesi, Maluku &amp; Papua)</td>
                      </tr>
                      <tr>
                        <td><code>parlemen</code></td>
                        <td>Numerik (Float)</td>
                        <td>Persentase (%)</td>
                        <td>Keterwakilan perempuan di kursi legislatif parlemen daerah (target afirmasi: 30%)</td>
                      </tr>
                      <tr>
                        <td><code>pendapatan</code></td>
                        <td>Numerik (Float)</td>
                        <td>Persentase (%)</td>
                        <td>Sumbangan estimasi pendapatan kerja perempuan terhadap total pendapatan rumah tangga (paritas: 50%)</td>
                      </tr>
                      <tr>
                        <td><code>profesional</code></td>
                        <td>Numerik (Float)</td>
                        <td>Persentase (%)</td>
                        <td>Persentase perempuan yang bekerja sebagai tenaga profesional, teknisi, dan manajerial</td>
                      </tr>
                      <tr>
                        <td><code>tpak</code></td>
                        <td>Numerik (Float)</td>
                        <td>Persentase (%)</td>
                        <td>Tingkat Partisipasi Angkatan Kerja perempuan usia 15 tahun ke atas (Sakernas 2024)</td>
                      </tr>
                      <tr>
                        <td><code>pengeluaran</code></td>
                        <td>Numerik (Integer)</td>
                        <td>Ribu Rupiah per Kapita / Thn</td>
                        <td>Standar pengeluaran riil per kapita disesuaikan dengan paritas daya beli (Metode Baru 2024)</td>
                      </tr>
                      <tr>
                        <td><code>skor_keputusan</code></td>
                        <td>Numerik (Float)</td>
                        <td>Skor 0 - 100</td>
                        <td>Indeks sintesis agensi politik dan pengambilan keputusan (Median nasional: 47.60)</td>
                      </tr>
                      <tr>
                        <td><code>skor_ekonomi</code></td>
                        <td>Numerik (Float)</td>
                        <td>Skor 0 - 100</td>
                        <td>Indeks sintesis partisipasi pasar kerja dan kontribusi pendapatan (Median nasional: 34.50)</td>
                      </tr>
                      <tr>
                        <td><code>kuadran</code></td>
                        <td>Kategorikal</td>
                        <td>Kuadran I - IV</td>
                        <td>Tipologi 4 kuadran disparitas partisipasi vs representasi keputusan gender</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Tab 8: Sumber Data Resmi BPS RI */}
        <section
          className={`tab-pane ${activeTab === "tab-sources" ? "active" : ""}`}
        >
          <div className="card">
            <div className="card-header">
              <div>
                <div className="card-title">
                  <i className="fa-solid fa-book-bookmark" style={{ color: "#1F5FCC" }}></i>
                  Katalog &amp; Metadata Publikasi Sumber Data Resmi BPS RI 2024
                </div>
                <div className="card-caption">
                  Daftar tabel statistik resmi rilis Badan Pusat Statistik Republik Indonesia yang digunakan sebagai landasan analisis spasial pada dasbor ini.
                </div>
              </div>
              <span className="badge badge-bps">Publikasi Resmi BPS RI</span>
            </div>

            <div style={{ padding: "20px 24px", display: "flex", flexDirection: "column", gap: "20px" }}>
              <div className="table-responsive">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th style={{ width: "60px" }}>No</th>
                      <th>Indikator Resmi</th>
                      <th>Nomor Tabel BPS</th>
                      <th>Sumber Survei / Pendataan</th>
                      <th>Periode Rilis</th>
                      <th>Tautan Akses Resmi BPS</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>1</td>
                      <td><strong>Pengeluaran per Kapita Disesuaikan</strong></td>
                      <td><code>Tabel 416/2</code></td>
                      <td>SUSENAS (Metode Baru)</td>
                      <td>Tahun 2024</td>
                      <td>
                        <a
                          href="https://www.bps.go.id/id/statistics-table/2/NDE2IzI=/-metode-baru--pengeluaran-per-kapita-disesuaikan.html"
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ color: "#1F5FCC", fontWeight: "600", textDecoration: "underline" }}
                        >
                          Buka Portal BPS <i className="fa-solid fa-arrow-up-right-from-square" style={{ fontSize: "11px" }}></i>
                        </a>
                      </td>
                    </tr>
                    <tr>
                      <td>2</td>
                      <td><strong>Angka Harapan Hidup (AHH) saat Lahir</strong></td>
                      <td><code>Tabel 455/2</code></td>
                      <td>Proyeksi Penduduk SP2020 / Susenas</td>
                      <td>Tahun 2024</td>
                      <td>
                        <a
                          href="https://www.bps.go.id/id/statistics-table/2/NDU1IzI=/angkaharapan-hidup--ahh--menurut-kabupaten-kota-dan-jenis-kelamin.html"
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ color: "#1F5FCC", fontWeight: "600", textDecoration: "underline" }}
                        >
                          Buka Portal BPS <i className="fa-solid fa-arrow-up-right-from-square" style={{ fontSize: "11px" }}></i>
                        </a>
                      </td>
                    </tr>
                    <tr>
                      <td>3</td>
                      <td><strong>Harapan Lama Sekolah (HLS)</strong></td>
                      <td><code>Tabel 417/2</code></td>
                      <td>SUSENAS Kor (Metode Baru)</td>
                      <td>Tahun 2024</td>
                      <td>
                        <a
                          href="https://www.bps.go.id/id/statistics-table/2/NDE3IzI=/-new-method--expected-years-of-schooling.html"
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ color: "#1F5FCC", fontWeight: "600", textDecoration: "underline" }}
                        >
                          Buka Portal BPS <i className="fa-solid fa-arrow-up-right-from-square" style={{ fontSize: "11px" }}></i>
                        </a>
                      </td>
                    </tr>
                    <tr>
                      <td>4</td>
                      <td><strong>Rata-rata Lama Sekolah (RLS)</strong></td>
                      <td><code>Tabel 415/2</code></td>
                      <td>SUSENAS Kor (Metode Baru)</td>
                      <td>Tahun 2024</td>
                      <td>
                        <a
                          href="https://www.bps.go.id/id/statistics-table/2/NDE1IzI=/-metode-baru--rata-rata-lama-sekolah.html"
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ color: "#1F5FCC", fontWeight: "600", textDecoration: "underline" }}
                        >
                          Buka Portal BPS <i className="fa-solid fa-arrow-up-right-from-square" style={{ fontSize: "11px" }}></i>
                        </a>
                      </td>
                    </tr>
                    <tr>
                      <td>5</td>
                      <td><strong>Tingkat Partisipasi Angkatan Kerja (TPAK)</strong></td>
                      <td><code>Tabel 2200/2</code></td>
                      <td>SAKERNAS (Survei Angkatan Kerja)</td>
                      <td>Agustus 2024</td>
                      <td>
                        <a
                          href="https://www.bps.go.id/id/statistics-table/2/MjIwMCMy/tingkat-partisipasi-angkatan-kerja-menurut-jenis-kelamin.html"
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ color: "#1F5FCC", fontWeight: "600", textDecoration: "underline" }}
                        >
                          Buka Portal BPS <i className="fa-solid fa-arrow-up-right-from-square" style={{ fontSize: "11px" }}></i>
                        </a>
                      </td>
                    </tr>
                    <tr>
                      <td>6</td>
                      <td><strong>Sumbangan Pendapatan Perempuan (%)</strong></td>
                      <td><code>Tabel 467/2</code></td>
                      <td>SAKERNAS &amp; SUSENAS Modul</td>
                      <td>Tahun 2024</td>
                      <td>
                        <a
                          href="https://www.bps.go.id/id/statistics-table/2/NDY3IzI=/revenue-contribution-of-women.html"
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ color: "#1F5FCC", fontWeight: "600", textDecoration: "underline" }}
                        >
                          Buka Portal BPS <i className="fa-solid fa-arrow-up-right-from-square" style={{ fontSize: "11px" }}></i>
                        </a>
                      </td>
                    </tr>
                    <tr>
                      <td>7</td>
                      <td><strong>Keterlibatan Perempuan di Parlemen (%)</strong></td>
                      <td><code>Tabel 464/2</code></td>
                      <td>KPU &amp; Sekretariat DPRD Kab/Kota/Prov</td>
                      <td>Tahun 2024</td>
                      <td>
                        <a
                          href="https://www.bps.go.id/id/statistics-table/2/NDY0IzI=/the-involvement-of-women-in-parliament.html"
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ color: "#1F5FCC", fontWeight: "600", textDecoration: "underline" }}
                        >
                          Buka Portal BPS <i className="fa-solid fa-arrow-up-right-from-square" style={{ fontSize: "11px" }}></i>
                        </a>
                      </td>
                    </tr>
                    <tr>
                      <td>8</td>
                      <td><strong>Perempuan sebagai Tenaga Profesional (%)</strong></td>
                      <td><code>Tabel 465/2</code></td>
                      <td>SAKERNAS (Klasifikasi Baku Jabatan)</td>
                      <td>Tahun 2024</td>
                      <td>
                        <a
                          href="https://www.bps.go.id/id/statistics-table/2/NDY1IzI=/the-percentage-of-female-professional-staff.html"
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ color: "#1F5FCC", fontWeight: "600", textDecoration: "underline" }}
                        >
                          Buka Portal BPS <i className="fa-solid fa-arrow-up-right-from-square" style={{ fontSize: "11px" }}></i>
                        </a>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div style={{
                background: "#F8FAFC",
                border: "1px solid #DDE4EE",
                borderRadius: "8px",
                padding: "16px 20px",
                fontSize: "13px",
                color: "#334155",
                lineHeight: "1.6"
              }}>
                <h4 style={{ margin: "0 0 8px 0", fontSize: "14px", fontWeight: "700", color: "#0B2F63" }}>
                  Integritas &amp; Otentisitas Metadata
                </h4>
                <p style={{ margin: 0 }}>
                  Semua indikator pada sistem visualisasi ini mengacu langsung pada nilai data resmi terpublikasi oleh Badan Pusat Statistik (BPS) Republik Indonesia untuk periode tahun 2024 tanpa adanya pembobotan fiktif atau pengubahan nilai aktual. Untuk 14 daerah pedalaman di provinsi pemekaran Papua yang mengalami kekosongan data akibat keterbatasan akses survei lapangan, imputasi estimasi dilakukan dengan prosedur ilmiah terstandarisasi <em>K-Nearest Neighbors</em> (KNN, k=5) pada basis data spasial.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Tab 9: Tentang Dasbor & Institusi */}
        <section
          className={`tab-pane ${activeTab === "tab-about" ? "active" : ""}`}
        >
          <div className="card">
            <div className="card-header">
              <div>
                <div className="card-title">
                  <i className="fa-solid fa-circle-info" style={{ color: "#1F5FCC" }}></i>
                  Tentang Dasbor &amp; Laboratorium Pengembang
                </div>
                <div className="card-caption">
                  Informasi profil institusi pengembang, latar belakang penelitian, metodologi analitis, dan panduan sitasi resmi.
                </div>
              </div>
              <span className="badge badge-bps">Politeknik Statistika STIS</span>
            </div>

            <div style={{ padding: "20px 24px", display: "flex", flexDirection: "column", gap: "20px" }}>
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                gap: "16px"
              }}>
                <div className="kpi-card accent-blue">
                  <h4 style={{ fontSize: "14.5px", fontWeight: "700", color: "#0B2F63", margin: "0 0 8px 0" }}>
                    Politeknik Statistika STIS
                  </h4>
                  <p style={{ fontSize: "12.5px", color: "#475569", lineHeight: "1.6", margin: 0 }}>
                    Politeknik Statistika STIS adalah Perguruan Tinggi Kedinasan di bawah naungan Badan Pusat Statistik (BPS) Republik Indonesia yang bertugas menghasilkan tenaga ahli statistik dan komputasi statistik yang profesional, berintegritas, dan berwawasan teknologi informasi mutakhir.
                  </p>
                </div>

                <div className="kpi-card accent-blue">
                  <h4 style={{ fontSize: "14.5px", fontWeight: "700", color: "#0B2F63", margin: "0 0 8px 0" }}>
                    Pengembang Dasbor
                  </h4>
                  <p style={{ fontSize: "12.5px", color: "#475569", lineHeight: "1.6", margin: 0 }}>
                    <strong style={{ color: "#0B2F63" }}>Danang Ivan Pangestu</strong><br />
                    <span>NIM: 222313036 &bull; Kelas: 3SD2</span><br />
                    <span style={{ fontSize: "11.5px", color: "#64748B" }}>Program Studi Komputasi Statistik, Politeknik Statistika STIS</span>
                  </p>
                </div>

                <div className="kpi-card accent-green">
                  <h4 style={{ fontSize: "14.5px", fontWeight: "700", color: "#0B2F63", margin: "0 0 8px 0" }}>
                    Tujuan &amp; Urgensi Penelitian
                  </h4>
                  <p style={{ fontSize: "12.5px", color: "#475569", lineHeight: "1.6", margin: 0 }}>
                    Dasbor ini dibangun untuk menginvestigasi disparitas spasial antara partisipasi ekonomi dan peran perempuan dalam pengambilan keputusan publik di 514 kabupaten/kota dan 38 provinsi di Indonesia, guna memberikan bukti empiris bagi perumusan kebijakan afirmasi gender yang berbasis kewilayahan.
                  </p>
                </div>
              </div>

              <div style={{
                background: "#F8FAFC",
                border: "1px solid #DDE4EE",
                borderRadius: "8px",
                padding: "16px 20px"
              }}>
                <h4 style={{ fontSize: "14px", fontWeight: "700", color: "#0B2F63", margin: "0 0 10px 0" }}>
                  Fondasi Metodologis &amp; Analisis Data
                </h4>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "14px", fontSize: "12.5px", color: "#475569" }}>
                  <div>
                    <strong style={{ color: "#1F5FCC" }}>1. Tipologi Kuadran 4-Sektor:</strong> Memetakan wilayah berdasarkan ambang batas median nasional Skor Ekonomi (34.50) dan Skor Keputusan (47.60) untuk membedakan wilayah maju seimbang, representasi kuat, tertinggal ganda, dan fenomena <em>sticky floor</em>.
                  </div>
                  <div>
                    <strong style={{ color: "#1F5FCC" }}>2. Autokorelasi Spasial (Moran&apos;s I &amp; LISA):</strong> Memvalidasi signifikansi pengelompokan geografis secara kuantitatif dengan indeks Moran&apos;s I (0.354 pada keputusan, 0.450 pada ekonomi, p = 0.001).
                  </div>
                  <div>
                    <strong style={{ color: "#1F5FCC" }}>3. Reduksi Dimensi (PCA):</strong> Principal Component Analysis mereduksi 8 dimensi indikator gender ke dalam 2 komponen utama yang menerangkan 66.9% total variansi nasional.
                  </div>
                </div>
              </div>

              <div>
                <h4 style={{ fontSize: "14px", fontWeight: "700", color: "#0B2F63", margin: "0 0 10px 0" }}>
                  Pedoman Sitasi Resmi (Citation Guide)
                </h4>
                <div style={{
                  background: "#0B2F63",
                  color: "#E2E8F0",
                  padding: "14px 18px",
                  borderRadius: "6px",
                  fontFamily: "monospace",
                  fontSize: "12px",
                  lineHeight: "1.6",
                  overflowX: "auto"
                }}>
                  Politeknik Statistika STIS &amp; Badan Pusat Statistik. (2024). <i>Eksplorasi Disparitas Spasial Partisipasi Ekonomi &amp; Pengambilan Keputusan Perempuan di Indonesia</i> [Interactive Institutional Analytics Dashboard]. BPS RI &amp; Politeknik Statistika STIS.
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Slide-over Detail Drawer for Selected District / Province */}
        <aside
          className={`detail-drawer ${selectedKabDetail ? "open" : ""}`}
          aria-label="Panel Detail Wilayah"
        >
          {selectedKabDetail && (
            <>
              <div className="detail-drawer-header">
                <div>
                  <div style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.5px", opacity: 0.85, fontWeight: "600" }}>
                    {selectedKabDetail.tipe || (isProvinsi ? "Provinsi" : "Kabupaten/Kota")} &bull; Kode: {selectedKabDetail.kode_wilayah}
                  </div>
                  <h3 style={{ margin: "4px 0 2px 0", fontSize: "16px", fontWeight: "700", color: "#FFFFFF" }}>
                    {selectedKabDetail.nama_resmi}
                  </h3>
                  <div style={{ fontSize: "12px", opacity: 0.85 }}>
                    {selectedKabDetail.provinsi} &bull; Gugus: {selectedKabDetail.pulau}
                  </div>
                </div>
                <button
                  onClick={() => setSelectedKabDetail(null)}
                  style={{
                    background: "rgba(255, 255, 255, 0.15)",
                    border: "none",
                    borderRadius: "4px",
                    color: "#FFFFFF",
                    width: "28px",
                    height: "28px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "14px"
                  }}
                  title="Tutup Panel"
                >
                  <i className="fa-solid fa-xmark"></i>
                </button>
              </div>

              <div className="detail-drawer-body">
                {/* Kuadran Badge */}
                <div style={{
                  padding: "12px 14px",
                  borderRadius: "6px",
                  backgroundColor: selectedKabDetail.kuadran?.includes("I (") ? "#F0FDF4" :
                                   selectedKabDetail.kuadran?.includes("II (") ? "#EFF6FF" :
                                   selectedKabDetail.kuadran?.includes("III (") ? "#FEF2F2" : "#FFFBEB",
                  border: `1px solid ${selectedKabDetail.kuadran?.includes("I (") ? "#BBF7D0" :
                                       selectedKabDetail.kuadran?.includes("II (") ? "#BFDBFE" :
                                       selectedKabDetail.kuadran?.includes("III (") ? "#FECACA" : "#FDE68A"}`
                }}>
                  <div style={{
                    fontSize: "12px",
                    fontWeight: "700",
                    color: selectedKabDetail.kuadran?.includes("I (") ? "#16A34A" :
                           selectedKabDetail.kuadran?.includes("II (") ? "#2563EB" :
                           selectedKabDetail.kuadran?.includes("III (") ? "#DC2626" : "#D97706",
                    marginBottom: "4px"
                  }}>
                    {selectedKabDetail.kuadran?.includes("I (") ? "KUADRAN I: Maju & Seimbang" :
                     selectedKabDetail.kuadran?.includes("II (") ? "KUADRAN II: Representasi Kuat" :
                     selectedKabDetail.kuadran?.includes("III (") ? "KUADRAN III: Tertinggal Ganda" :
                     "KUADRAN IV: Pekerja Tanpa Kuasa"}
                  </div>
                  <div style={{ fontSize: "11.5px", color: "#475569", lineHeight: "1.45" }}>
                    {selectedKabDetail.kuadran?.includes("I (") ? "Partisipasi ekonomi & keterwakilan keputusan publik berada di atas median nasional." :
                     selectedKabDetail.kuadran?.includes("II (") ? "Keterwakilan publik tinggi meski kontribusi ekonomi pasar kerja masih di bawah median nasional." :
                     selectedKabDetail.kuadran?.includes("III (") ? "Berada di bawah median nasional pada dimensi ekonomi maupun kepemimpinan publik." :
                     "TPAK perempuan tinggi di pasar kerja namun minim representasi dalam pengambilan keputusan publik (sticky floor)."}
                  </div>
                </div>

                {/* Skor Komposit */}
                <div>
                  <div style={{ fontSize: "11.5px", fontWeight: "700", textTransform: "uppercase", color: "#667085", letterSpacing: "0.4px", marginBottom: "8px" }}>
                    Indeks Komposit &amp; Sintesis
                  </div>
                  <div className="detail-stat-row">
                    <div className="detail-stat-box">
                      <span className="detail-stat-label">IKPP Komposit</span>
                      <span className="detail-stat-val" style={{ color: "#1F5FCC" }}>{selectedKabDetail.ikpp_komposit}</span>
                    </div>
                    <div className="detail-stat-box">
                      <span className="detail-stat-label">Skor Keputusan</span>
                      <span className="detail-stat-val" style={{ color: "#0B2F63" }}>{selectedKabDetail.skor_keputusan}</span>
                    </div>
                    <div className="detail-stat-box">
                      <span className="detail-stat-label">Skor Ekonomi</span>
                      <span className="detail-stat-val" style={{ color: "#16A34A" }}>{selectedKabDetail.skor_ekonomi}</span>
                    </div>
                    <div className="detail-stat-box">
                      <span className="detail-stat-label">Pengeluaran Riil</span>
                      <span className="detail-stat-val" style={{ fontSize: "13px" }}>Rp{Number(selectedKabDetail.pengeluaran).toLocaleString("id-ID")}</span>
                    </div>
                  </div>
                </div>

                {/* Indikator Gender BPS */}
                <div>
                  <div style={{ fontSize: "11.5px", fontWeight: "700", textTransform: "uppercase", color: "#667085", letterSpacing: "0.4px", marginBottom: "8px" }}>
                    Indikator Gender Utama (BPS 2024)
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 10px", background: "#F8FAFC", borderRadius: "4px", border: "1px solid #E2E8F0", fontSize: "12px" }}>
                      <span>Keterwakilan di Parlemen</span>
                      <strong>{selectedKabDetail.parlemen}%</strong>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 10px", background: "#F8FAFC", borderRadius: "4px", border: "1px solid #E2E8F0", fontSize: "12px" }}>
                      <span>Sumbangan Pendapatan</span>
                      <strong>{selectedKabDetail.pendapatan}%</strong>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 10px", background: "#F8FAFC", borderRadius: "4px", border: "1px solid #E2E8F0", fontSize: "12px" }}>
                      <span>Tenaga Profesional</span>
                      <strong>{selectedKabDetail.profesional}%</strong>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 10px", background: "#F8FAFC", borderRadius: "4px", border: "1px solid #E2E8F0", fontSize: "12px" }}>
                      <span>TPAK Perempuan</span>
                      <strong>{selectedKabDetail.tpak}%</strong>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 10px", background: "#F8FAFC", borderRadius: "4px", border: "1px solid #E2E8F0", fontSize: "12px" }}>
                      <span>Angka Harapan Hidup (AHH)</span>
                      <strong>{selectedKabDetail.ahh} Tahun</strong>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 10px", background: "#F8FAFC", borderRadius: "4px", border: "1px solid #E2E8F0", fontSize: "12px" }}>
                      <span>Rata-rata Lama Sekolah (RLS)</span>
                      <strong>{selectedKabDetail.rls} Tahun</strong>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 10px", background: "#F8FAFC", borderRadius: "4px", border: "1px solid #E2E8F0", fontSize: "12px" }}>
                      <span>Harapan Lama Sekolah (HLS)</span>
                      <strong>{selectedKabDetail.hls} Tahun</strong>
                    </div>
                  </div>
                </div>

                {/* Filter shortcut button */}
                <button
                  className="btn-export"
                  style={{ width: "100%", justifyContent: "center", height: "36px", marginTop: "4px" }}
                  onClick={() => {
                    setSelectedProv(selectedKabDetail.provinsi);
                    setSelectedPulau(selectedKabDetail.pulau);
                    setSelectedKabDetail(null);
                  }}
                >
                  <i className="fa-solid fa-filter"></i>
                  <span>Filter ke Provinsi {selectedKabDetail.provinsi}</span>
                </button>
              </div>
            </>
          )}
        </aside>

        {/* Help / Guidance Modal */}
        {helpModalOpen && (
          <div className="modal-backdrop" onClick={() => setHelpModalOpen(false)}>
            <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <div className="modal-title">
                  <i className="fa-solid fa-circle-question" style={{ marginRight: "8px" }}></i>
                  Panduan Penggunaan &amp; Kamus Analitik Dasbor
                </div>
                <button className="modal-close-btn" onClick={() => setHelpModalOpen(false)}>
                  &times;
                </button>
              </div>
              <div className="modal-body">
                <div>
                  <h4 style={{ margin: "0 0 4px 0", color: "#0B2F63", fontSize: "14px" }}>
                    1. Struktur Modul Dasbor
                  </h4>
                  <p style={{ margin: 0, fontSize: "12.5px" }}>
                    Gunakan sidebar navigasi di sisi kiri untuk berpindah modul analisis (Ringkasan &amp; Storytelling, Analisis Geospasial, Analisis Multivariat, Analisis Berhierarki, dan Pangkalan Data).
                  </p>
                </div>
                <div>
                  <h4 style={{ margin: "0 0 4px 0", color: "#0B2F63", fontSize: "14px" }}>
                    2. Filter Wilayah &amp; Segmented Control
                  </h4>
                  <p style={{ margin: 0, fontSize: "12.5px" }}>
                    Filter Bar horizontal di bawah header memungkinkan pemilahan berdasarkan Gugus Pulau, Provinsi, dan Kuadran. Tombol segmented control beralih secara instan antara tingkat <strong>Kab/Kota (514 wilayah)</strong> dan <strong>Provinsi (38 wilayah)</strong>.
                  </p>
                </div>
                <div>
                  <h4 style={{ margin: "0 0 4px 0", color: "#0B2F63", fontSize: "14px" }}>
                    3. Matriks Tipologi Kuadran 4-Sektor
                  </h4>
                  <p style={{ margin: 0, fontSize: "12.5px" }}>
                    Kuadran diklasifikasikan menggunakan garis median nasional: <strong>Skor Ekonomi = 34.50</strong> dan <strong>Skor Pengambilan Keputusan = 47.60</strong>. Kuadran I (Maju &amp; Seimbang), Kuadran II (Representasi Kuat), Kuadran III (Tertinggal Ganda), dan Kuadran IV (Pekerja Tanpa Kuasa / Sticky Floor).
                  </p>
                </div>
                <div>
                  <h4 style={{ margin: "0 0 4px 0", color: "#0B2F63", fontSize: "14px" }}>
                    4. Interaksi Peta &amp; Slide-over Detail
                  </h4>
                  <p style={{ margin: 0, fontSize: "12.5px" }}>
                    Arahkan kursor pada poligon peta untuk melihat nilai indikator. Klik pada poligon wilayah untuk membuka panel detail di sebelah kanan tanpa menutup peta.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Filter Popup Modal */}
        {filterModalOpen && (
          <div className="modal-backdrop" onClick={() => setFilterModalOpen(false)}>
            <div className="modal-dialog filter-modal-dialog" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <div className="modal-title">
                  <i className="fa-solid fa-sliders" style={{ marginRight: "8px", color: "#60A5FA" }}></i>
                  Pengaturan Filter &amp; Parameter Analisis
                </div>
                <button
                  className="modal-close-btn"
                  onClick={() => setFilterModalOpen(false)}
                  aria-label="Tutup Pop Up Filter"
                >
                  &times;
                </button>
              </div>

              <div className="modal-body filter-modal-body">
                {/* Tingkat Wilayah */}
                {activeTab !== "tab-hierarchical" && (
                  <div className="filter-modal-group">
                    <label className="filter-modal-label">
                      <i className="fa-solid fa-map-location-dot" style={{ color: "#1F5FCC", marginRight: "6px" }}></i>
                      Tingkat Agregasi Wilayah:
                    </label>
                    <div className="segmented-control" style={{ width: "100%", height: "38px" }}>
                      <button
                        className={`segmented-btn ${selectedTipe === "Kab/Kota" ? "active" : ""}`}
                        onClick={() => setSelectedTipe("Kab/Kota")}
                        type="button"
                      >
                        <span className="desktop-only">Kabupaten / Kota (514 Wilayah)</span>
                        <span className="mobile-only">Kab/Kota (514)</span>
                      </button>
                      <button
                        className={`segmented-btn ${selectedTipe === "Provinsi" ? "active" : ""}`}
                        onClick={() => setSelectedTipe("Provinsi")}
                        type="button"
                      >
                        <span className="desktop-only">Provinsi (38 Wilayah)</span>
                        <span className="mobile-only">Provinsi (38)</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Grid 2 Kolom: Pulau & Provinsi */}
                <div className="filter-modal-grid-2">
                  <div className="filter-modal-group">
                    <label className="filter-modal-label">
                      <i className="fa-solid fa-earth-asia" style={{ color: "#1F5FCC", marginRight: "6px" }}></i>
                      Gugus Pulau:
                    </label>
                    <select
                      className="filter-select"
                      value={selectedPulau}
                      onChange={(e) => {
                        setSelectedPulau(e.target.value);
                        setSelectedProv("Semua Provinsi");
                      }}
                      style={{ width: "100%", height: "38px" }}
                    >
                      <option value="Semua Pulau">Semua Pulau (Nasional)</option>
                      {[...new Set(allKabkota.map((d) => d.pulau))].map((p) => (
                        <option key={p} value={p}>
                          {p}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="filter-modal-group">
                    <label className="filter-modal-label">
                      <i className="fa-solid fa-landmark" style={{ color: "#1F5FCC", marginRight: "6px" }}></i>
                      Provinsi:
                    </label>
                    <select
                      className="filter-select"
                      value={selectedProv}
                      onChange={(e) => setSelectedProv(e.target.value)}
                      style={{ width: "100%", height: "38px" }}
                    >
                      {availableProvs.map((p) => (
                        <option key={p} value={p}>
                          {p}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Kuadran Tipologi */}
                <div className="filter-modal-group">
                  <label className="filter-modal-label">
                    <i className="fa-solid fa-chart-pie" style={{ color: "#1F5FCC", marginRight: "6px" }}></i>
                    Tipologi Kuadran Gender (Ekonomi vs Keputusan):
                  </label>
                  <select
                    className="filter-select"
                    value={selectedKuadran}
                    onChange={(e) => setSelectedKuadran(e.target.value)}
                    style={{ width: "100%", height: "38px" }}
                  >
                    <option value="Semua Kuadran">Semua Kuadran (Tanpa Filter Tipologi)</option>
                    <option value="Kuadran I (Ekonomi Tinggi, Keputusan Tinggi)">
                      Kuadran I — Maju &amp; Seimbang (Ekonomi Tinggi, Keputusan Tinggi)
                    </option>
                    <option value="Kuadran II (Ekonomi Rendah, Keputusan Tinggi)">
                      Kuadran II — Representasi Kuat (Ekonomi Rendah, Keputusan Tinggi)
                    </option>
                    <option value="Kuadran III (Ekonomi Rendah, Keputusan Rendah)">
                      Kuadran III — Tertinggal Ganda (Ekonomi Rendah, Keputusan Rendah)
                    </option>
                    <option value="Kuadran IV (Ekonomi Tinggi, Keputusan Rendah)">
                      Kuadran IV — Pekerja Tanpa Kuasa (Ekonomi Tinggi, Keputusan Rendah)
                    </option>
                  </select>
                </div>

                {/* Palet Warna */}
                <div className="filter-modal-group">
                  <label className="filter-modal-label">
                    <i className="fa-solid fa-palette" style={{ color: "#1F5FCC", marginRight: "6px" }}></i>
                    Skema Palet Warna (Peta &amp; Heatmap):
                  </label>
                  <select
                    className="filter-select"
                    value={selectedPalette}
                    onChange={(e) => setSelectedPalette(e.target.value)}
                    style={{ width: "100%", height: "38px" }}
                  >
                    <option value="Viridis">Viridis — Perseptual Standar BPS (Aman &amp; Akurat)</option>
                    <option value="Cividis">Cividis — Colorblind-Safe (Ramah Buta Warna)</option>
                    <option value="Plasma">Plasma — Kontras Hangat (Ungu ke Kuning Terang)</option>
                    <option value="Turbo">Turbo — Spektrum Pelangi Penuh</option>
                  </select>
                </div>

                {/* Dynamic Summary Box */}
                <div className="filter-modal-summary-box">
                  <div className="filter-summary-title">
                    <i className="fa-solid fa-circle-info" style={{ color: "#1F5FCC" }}></i>
                    <span>Ringkasan Data Terpilih:</span>
                  </div>
                  <div className="filter-summary-stats">
                    <div>Cakupan: <strong>{filteredKabkota.length} dari {isProvinsi ? "38" : "514"} Wilayah</strong></div>
                    <div>Gugus Pulau: <strong>{selectedPulau}</strong></div>
                    <div>Provinsi: <strong>{selectedProv}</strong></div>
                    <div>Tipologi: <strong>{selectedKuadran.split("(")[0].trim()}</strong></div>
                  </div>
                </div>
              </div>

              <div className="modal-footer filter-modal-footer">
                <button
                  className="btn-secondary"
                  onClick={resetFilters}
                  type="button"
                >
                  <i className="fa-solid fa-rotate-left"></i>
                  <span>Reset Default</span>
                </button>
                <button
                  className="btn-primary"
                  onClick={() => setFilterModalOpen(false)}
                  type="button"
                >
                  <i className="fa-solid fa-check"></i>
                  <span>Terapkan Filter ({filteredKabkota.length} Wilayah)</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
