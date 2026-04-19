import type { Metadata } from 'next'
import { Space_Grotesk, Inter, JetBrains_Mono } from 'next/font/google'
import './globals.css'

// ── Fonts ──────────────────────────────────────────────────────────────────────
const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-space-grotesk',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-inter',
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
})

// ── Metadata ───────────────────────────────────────────────────────────────────
export const metadata: Metadata = {
  title: 'SeisMonitor — Real-Time Earthquake Monitoring. Made in New Zealand.',
  description:
    'SeisMonitor is a consumer earthquake monitoring device powered by ESP32, ' +
    'a full-colour TFT display, and real-time data from GeoNet & USGS. ' +
    'Featuring a signature 3D-printed Mt Cook edition enclosure.',
  keywords: [
    'earthquake monitor', 'seismograph', 'GeoNet', 'USGS', 'ESP32',
    'New Zealand', 'seismic sensor', 'home earthquake alert',
  ],
  openGraph: {
    title: 'SeisMonitor — Feel the Earth Before It Feels You',
    description: 'Real-time earthquake monitoring device. Made in Aotearoa New Zealand.',
    type: 'website',
  },
}

// ── Root Layout ────────────────────────────────────────────────────────────────
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${inter.variable} ${jetbrainsMono.variable}`}
    >
      <body className="bg-bg text-ink font-body antialiased">
        {children}
      </body>
    </html>
  )
}
