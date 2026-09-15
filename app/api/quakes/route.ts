// Server-side proxy + normaliser for the live quake feeds -- same feeds and
// endpoints the firmware itself polls (see SeisMonitor/src/main.cpp,
// API_NZ / API_GLOBAL). Runs server-side so the browser never hits GeoNet or
// USGS directly (avoids CORS and keeps our own cache in front of both).
import { NextRequest, NextResponse } from 'next/server'
import type { Quake, QuakeFeed } from '@/lib/quakes/types'

export const revalidate = 60

const API_NZ = 'https://api.geonet.org.nz/quake?MMI=2'
const API_GLOBAL = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_day.geojson'

// Sample data straight from the design handoff (sm-common.jsx) so the demo
// screen never shows an empty panel if both upstream feeds are unreachable.
const FALLBACK: Record<'nz' | 'global', QuakeFeed> = {
  nz: {
    latest: { id: 'fallback-latest', mag: 2.4, place: 'Porirua, New Zealand', lat: -41.13, lon: 174.84, depth: 12, time: Date.now() - 4 * 60000 },
    high24: { id: 'fallback-high24', mag: 4.1, place: '25 km NW Wellington', lat: -41.12, lon: 174.52, depth: 38, time: Date.now() - 3 * 3600000 },
    recent: [],
    source: 'fallback',
  },
  global: {
    latest: { id: 'fallback-latest-g', mag: 5.2, place: 'Off E. Honshu, Japan', lat: 37.1, lon: 141.8, depth: 35, time: Date.now() - 11 * 60000 },
    high24: { id: 'fallback-high24-g', mag: 6.4, place: 'S. Sandwich Islands', lat: -59.4, lon: -27.2, depth: 20, time: Date.now() - 6 * 3600000 },
    recent: [],
    source: 'fallback',
  },
}

interface GeoNetFeature {
  geometry: { coordinates: [number, number] }
  properties: { publicID: string; time: string; depth: number; magnitude: number; locality: string }
}
interface USGSFeature {
  id: string
  geometry: { coordinates: [number, number, number] }
  properties: { mag: number; place: string; time: number }
}

function buildFeed(quakes: Quake[]): QuakeFeed {
  if (quakes.length === 0) return { latest: null, high24: null, recent: [], source: 'live' }
  const sorted = [...quakes].sort((a, b) => b.time - a.time)
  const latest = sorted[0]
  const dayAgo = Date.now() - 24 * 3600000
  const within24h = quakes.filter((q) => q.time >= dayAgo)
  const high24 = (within24h.length ? within24h : quakes).reduce((a, b) => (b.mag > a.mag ? b : a))
  return { latest, high24, recent: sorted.slice(0, 20), source: 'live' }
}

async function fetchNZ(): Promise<QuakeFeed> {
  const res = await fetch(API_NZ, {
    headers: { Accept: 'application/vnd.geo+json;version=2' },
    next: { revalidate: 60 },
  })
  if (!res.ok) throw new Error('GeoNet ' + res.status)
  const json = (await res.json()) as { features: GeoNetFeature[] }
  const quakes: Quake[] = json.features.map((f) => ({
    id: f.properties.publicID,
    mag: f.properties.magnitude,
    place: f.properties.locality,
    lat: f.geometry.coordinates[1],
    lon: f.geometry.coordinates[0],
    depth: f.properties.depth,
    time: new Date(f.properties.time).getTime(),
  }))
  return buildFeed(quakes)
}

async function fetchGlobal(): Promise<QuakeFeed> {
  const res = await fetch(API_GLOBAL, { next: { revalidate: 60 } })
  if (!res.ok) throw new Error('USGS ' + res.status)
  const json = (await res.json()) as { features: USGSFeature[] }
  const quakes: Quake[] = json.features.map((f) => ({
    id: f.id,
    mag: f.properties.mag,
    place: f.properties.place,
    lat: f.geometry.coordinates[1],
    lon: f.geometry.coordinates[0],
    depth: f.geometry.coordinates[2],
    time: f.properties.time,
  }))
  return buildFeed(quakes)
}

export async function GET(req: NextRequest) {
  const region = req.nextUrl.searchParams.get('region') === 'global' ? 'global' : 'nz'
  try {
    const feed = region === 'nz' ? await fetchNZ() : await fetchGlobal()
    if (!feed.latest) return NextResponse.json(FALLBACK[region])
    return NextResponse.json(feed)
  } catch {
    return NextResponse.json(FALLBACK[region])
  }
}
