// Real GeoNet/firmware NZ coastline polygons and projection — ported verbatim
// from SeisMonitor/docs/design_handoff_landscape_ui/screens/sm-common.jsx,
// which itself mirrors the firmware's drawNZMap() in src/main.cpp. Same data,
// same equirectangular projection, so the map on this screen matches the
// physical device pixel-for-pixel.

export const NZ_NORTH_LL: [number, number][] = [
  [-34.42,172.68],[-34.45,173.05],[-34.87,173.38],[-35.22,174.05],
  [-35.83,174.55],[-36.30,174.80],[-36.63,174.83],[-36.84,174.80],
  [-37.05,175.30],[-36.50,175.35],[-36.85,175.72],[-37.22,175.92],
  [-37.63,176.18],[-37.97,177.00],[-37.69,178.55],[-38.67,178.02],
  [-39.10,177.85],[-39.48,176.92],[-39.65,177.10],[-40.35,176.62],
  [-40.90,176.20],[-41.45,175.40],[-41.30,174.78],[-41.15,174.85],
  [-40.88,175.00],[-40.30,175.00],[-39.93,175.05],[-39.50,174.25],
  [-39.28,173.75],[-39.05,174.05],[-38.70,174.55],[-38.30,174.65],
  [-37.80,174.75],[-37.40,174.65],[-37.02,174.52],[-36.85,174.42],
  [-36.40,174.13],[-35.93,173.85],[-35.55,173.45],[-35.20,173.10],
  [-34.75,172.78],[-34.42,172.68],
]
export const NZ_SOUTH_LL: [number, number][] = [
  [-40.50,172.68],[-40.65,172.90],[-40.78,172.62],[-40.95,173.00],
  [-41.10,173.45],[-41.10,174.03],[-41.22,174.15],[-41.35,174.30],
  [-41.72,174.18],[-42.15,173.88],[-42.42,173.68],[-42.85,173.45],
  [-43.30,172.88],[-43.55,172.75],[-43.62,172.95],[-43.83,173.08],
  [-43.82,172.65],[-44.10,172.00],[-44.38,171.50],[-44.72,171.18],
  [-45.10,170.98],[-45.52,170.68],[-45.78,170.72],[-45.88,170.73],
  [-45.92,170.50],[-46.22,170.05],[-46.45,169.45],[-46.67,168.36],
  [-46.60,168.00],[-46.40,167.55],[-46.15,166.60],[-45.75,166.50],
  [-45.30,166.85],[-44.63,167.85],[-44.15,168.08],[-43.98,168.62],
  [-43.88,169.05],[-43.47,170.18],[-42.72,170.97],[-42.45,171.21],
  [-41.75,171.60],[-41.25,172.10],[-40.78,172.15],[-40.50,172.68],
]
export const NZ_STEWART_LL: [number, number][] = [
  [-46.65,167.80],[-46.72,168.05],[-46.82,168.22],[-46.97,168.15],
  [-47.05,167.80],[-46.95,167.45],[-46.80,167.40],[-46.68,167.55],
  [-46.65,167.80],
]

export interface NZProjection {
  north: [number, number][]
  south: [number, number][]
  stewart: [number, number][]
  project: (lat: number, lon: number) => [number, number]
}

// Project lat/lon polygons to fit a (w,h) box, equirectangular with a
// cos(centerLat) longitude correction — identical to the firmware's map.
export function nzProject(w: number, h: number, margin = 4): NZProjection {
  const all = [...NZ_NORTH_LL, ...NZ_SOUTH_LL, ...NZ_STEWART_LL]
  let latMin = Infinity, latMax = -Infinity, lonMin = Infinity, lonMax = -Infinity
  for (const [lat, lon] of all) {
    if (lat < latMin) latMin = lat
    if (lat > latMax) latMax = lat
    if (lon < lonMin) lonMin = lon
    if (lon > lonMax) lonMax = lon
  }
  const latSpan = latMax - latMin
  const lonSpan = lonMax - lonMin
  const cLat = (latMin + latMax) / 2
  const cosLat = Math.cos((cLat * Math.PI) / 180)
  const effLon = lonSpan * cosLat
  const innerW = w - margin * 2
  const innerH = h - margin * 2
  const scale = Math.min(innerW / effLon, innerH / latSpan)
  const offX = margin + (innerW - scale * effLon) / 2
  const offY = margin + (innerH - scale * latSpan) / 2

  const project = (lat: number, lon: number): [number, number] => [
    offX + (lon - lonMin) * scale * cosLat,
    offY + (latMax - lat) * scale,
  ]
  const toPoints = (poly: [number, number][]) => poly.map(([lat, lon]) => project(lat, lon))

  return {
    north: toPoints(NZ_NORTH_LL),
    south: toPoints(NZ_SOUTH_LL),
    stewart: toPoints(NZ_STEWART_LL),
    project,
  }
}
