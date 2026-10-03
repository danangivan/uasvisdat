import './globals.css';
import Script from 'next/script';

export const metadata = {
  title: 'Disparitas Gender 514 Kab/Kota Indonesia — Visualisasi Analitik (Next.js)',
  description: 'Eksplorasi Disparitas Spasial Partisipasi Ekonomi dan Pengambilan Keputusan Perempuan di 514 Kabupaten/Kota Indonesia Melalui Visualisasi Analitik (BPS 2024)',
  icons: {
    icon: 'https://upload.wikimedia.org/wikipedia/commons/2/28/Lambang_Politeknik_Statistika_STIS.png',
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
        />
        <link
          rel="stylesheet"
          href="/leaflet/leaflet.css"
        />
      </head>
      <body>
        {children}
        {/* Local Leaflet & Plotly Scripts */}
        <Script
          src="/leaflet/leaflet.js"
          strategy="beforeInteractive"
        />
        <Script
          src="/leaflet-heat.js"
          strategy="afterInteractive"
        />
        <Script
          src="https://cdn.plot.ly/plotly-2.35.2.min.js"
          strategy="beforeInteractive"
        />
      </body>
    </html>
  );
}
