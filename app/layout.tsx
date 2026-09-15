import type { Metadata } from 'next'
import { getCopy, c } from '@/lib/copy'
import './globals.css'

// No webfonts -- the landing page is set in system Georgia/Verdana/Courier New
// (see the .seismo-90s block in globals.css); /update keeps its own look via
// the bg/ink/sage tokens below, now falling back to system-ui without Inter.

// -- Metadata -- generated per-request so copy.md edits take effect live ---------
export async function generateMetadata(): Promise<Metadata> {
  const copy = getCopy()
  const title = c(copy, 'Main page -- Browser tab title', 'Seismonitor -- a desk seismograph, made in New Zealand')
  const description = c(copy, 'Main page -- Search description')
  return {
    title,
    description,
    keywords: [
      'earthquake monitor', 'seismograph', 'GeoNet', 'USGS', 'ESP32',
      'New Zealand', 'seismic sensor', 'desk seismograph',
    ],
    openGraph: {
      title: c(copy, 'Link-preview title', title),
      description: c(copy, 'Link-preview description', description),
      type: 'website',
    },
  }
}

// -- Root Layout ------------------------------------------------------------------
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-bg text-ink font-body antialiased">
        {children}
      </body>
    </html>
  )
}
