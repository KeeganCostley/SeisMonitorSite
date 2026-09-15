// Server-side proxy + normaliser for the live quake feeds -- same feeds,
// endpoints and region bounding boxes the firmware itself uses (see
// SeisMonitor/src/main.cpp: API_NZ/API_JAPAN/API_CHINA/API_CALIFORNIA/
// API_GLOBAL and BOUNDS_*). Runs server-side so the browser never hits
// GeoNet or USGS directly (avoids CORS and keeps our own cache in front).
import { NextRequest, NextResponse } from 'next/server'
import type { Quake, QuakeFeed } from '@/lib/quakes/types'

export const revalidate = 60

export type Region = 'nz' | 'japan' | 'china' | 'california' | 'global'

const API_NZ = 'https://api.geonet.org.nz/quake?MMI=2'
const API_JAPAN = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_day.geojson'
const API_CHINA = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_day.geojson'
const API_CALIFORNIA = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/1.0_day.geojson'
const API_GLOBAL = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_day.geojson'

interface Bounds { latMin: number; latMax: number; lonMin: number; lonMax: number }
const BOUNDS: Partial<Record<Region, Bounds>> = {
  japan: { latMin: 30.0, latMax: 45.5, lonMin: 129.0, lonMax: 146.0 },
  china: { latMin: 18.0, latMax: 54.0, lonMin: 73.0, lonMax: 135.0 },
  california: { latMin: 32.5, latMax: 42.0, lonMin: -124.5, lonMax: -114.0 },
}

// Small helper so each fallback entry only states its one "real" high24 quake once, not twice.
function fallbackFeed(latest: Quake, high24: Quake): QuakeFeed {
  return { latest, high24, highs24: [high24], recent: [], source: 'fallback' }
}

const FALLBACK: Record<Region, QuakeFeed> = {
  nz: fallbackFeed(
    { id: 'fallback-latest', mag: 2.4, place: 'Porirua, New Zealand', lat: -41.13, lon: 174.84, depth: 12, time: Date.now() - 4 * 60000 },
    { id: 'fallback-high24', mag: 4.1, place: '25 km NW Wellington', lat: -41.12, lon: 174.52, depth: 38, time: Date.now() - 3 * 3600000 }
  ),
  japan: fallbackFeed(
    { id: 'fallback-jp-latest', mag: 3.8, place: '40km E of Sendai, Japan', lat: 38.3, lon: 141.5, depth: 45, time: Date.now() - 20 * 60000 },
    { id: 'fallback-jp-high', mag: 5.1, place: 'Off the coast of Fukushima', lat: 37.4, lon: 141.6, depth: 30, time: Date.now() - 5 * 3600000 }
  ),
  china: fallbackFeed(
    { id: 'fallback-cn-latest', mag: 3.2, place: 'Sichuan Province, China', lat: 30.7, lon: 103.5, depth: 15, time: Date.now() - 45 * 60000 },
    { id: 'fallback-cn-high', mag: 4.4, place: 'Yunnan Province, China', lat: 25.0, lon: 100.2, depth: 10, time: Date.now() - 8 * 3600000 }
  ),
  california: fallbackFeed(
    { id: 'fallback-ca-latest', mag: 2.1, place: '8km NW of San Juan Bautista, CA', lat: 36.9, lon: -121.6, depth: 8, time: Date.now() - 15 * 60000 },
    { id: 'fallback-ca-high', mag: 3.6, place: '5km SE of Anza, CA', lat: 33.5, lon: -116.6, depth: 12, time: Date.now() - 6 * 3600000 }
  ),
  global: fallbackFeed(
    { id: 'fallback-latest-g', mag: 5.2, place: 'Off E. Honshu, Japan', lat: 37.1, lon: 141.8, depth: 35, time: Date.now() - 11 * 60000 },
    { id: 'fallback-high24-g', mag: 6.4, place: 'S. Sandwich Islands', lat: -59.4, lon: -27.2, depth: 20, time: Date.now() - 6 * 3600000 }
  ),
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

function inBounds(lat: number, lon: number, b?: Bounds): boolean {
  if (!b) return true
  return lat >= b.latMin && lat <= b.latMax && lon >= b.lonMin && lon <= b.lonMax
}

// A quake also counts as a "24h high" if it's within this fraction of the day's strongest magnitude
// -- e.g. a M4.8 top quake pulls in anything M3.84+. Matches the firmware's HIGHS24_BAND exactly
// (see SeisMonitor/src/main.cpp) so the site cycles through the same set the device does.
const HIGHS24_BAND = 0.8
const MAX_HIGHS24 = 4

function buildFeed(quakes: Quake[]): QuakeFeed {
  if (quakes.length === 0) return { latest: null, high24: null, highs24: [], recent: [], source: 'live' }
  const sorted = [...quakes].sort((a, b) => b.time - a.time)
  const latest = sorted[0]
  const dayAgo = Date.now() - 24 * 3600000
  const within24h = quakes.filter((q) => q.time >= dayAgo)

  let highs24: Quake[]
  if (within24h.length) {
    const strongest = within24h.reduce((a, b) => (b.mag > a.mag ? b : a))
    const band = strongest.mag * HIGHS24_BAND
    const others = within24h
      .filter((q) => q.id !== strongest.id && q.mag >= band)
      .sort((a, b) => b.time - a.time) // most recent qualifying quake next, matching the device
    highs24 = [strongest, ...others].slice(0, MAX_HIGHS24)
  } else {
    // No quake in the last 24h at all -- fall back to the feed's all-time max, same as the firmware,
    // and don't cycle (a single non-24h quake isn't a "24h high" in any real sense).
    highs24 = [quakes.reduce((a, b) => (b.mag > a.mag ? b : a))]
  }

  return { latest, high24: highs24[0], highs24, recent: sorted.slice(0, 20), source: 'live' }
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

async function fetchUSGS(url: string, region: Region): Promise<QuakeFeed> {
  const res = await fetch(url, { next: { revalidate: 60 } })
  if (!res.ok) throw new Error('USGS ' + res.status)
  const json = (await res.json()) as { features: USGSFeature[] }
  const bounds = BOUNDS[region]
  const quakes: Quake[] = json.features
    .map((f) => ({
      id: f.id,
      mag: f.properties.mag,
      place: f.properties.place,
      lat: f.geometry.coordinates[1],
      lon: f.geometry.coordinates[0],
      depth: f.geometry.coordinates[2],
      time: f.properties.time,
    }))
    .filter((q) => inBounds(q.lat, q.lon, bounds))
  return buildFeed(quakes)
}

const ENDPOINTS: Record<Exclude<Region, 'nz'>, string> = {
  japan: API_JAPAN,
  china: API_CHINA,
  california: API_CALIFORNIA,
  global: API_GLOBAL,
}

export async function GET(req: NextRequest) {
  const raw = req.nextUrl.searchParams.get('region')
  const region: Region = (['nz', 'japan', 'china', 'california', 'global'] as Region[]).includes(raw as Region)
    ? (raw as Region)
    : 'nz'
  try {
    const feed = region === 'nz' ? await fetchNZ() : await fetchUSGS(ENDPOINTS[region], region)
    if (!feed.latest) return NextResponse.json(FALLBACK[region])
    return NextResponse.json(feed)
  } catch {
    return NextResponse.json(FALLBACK[region])
  }
}
