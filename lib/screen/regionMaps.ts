// Generic renderer for the Japan/California/China flat maps -- one projection + draw routine shared
// across all three, mirroring the firmware's own design: SeisMonitor/src/main.cpp uses ONE generic
// equirectangular-with-cos(lat) fit (getMapProj()) for every region, just parametrized by that
// region's bounds and box size -- not custom math per region. NZ keeps its own existing, already-
// verified code path in draw.ts untouched; this module is only for the three regions that were
// falling back to the globe.
import { THEME } from './theme'

export interface Bounds { latMin: number; latMax: number; lonMin: number; lonMax: number }
export interface NamedPoint { name: string; lat: number; lon: number }

// Matches getMapProj() + mapLatToScreen()/mapLonToScreen() in main.cpp exactly: fit the region's
// lat/lon span into a boxW x boxH box (with `margin` inside it), correcting longitude by cos(centre
// latitude) so the aspect ratio reads true at that latitude, then centring whichever axis has room
// left over once the other is maxed out.
export function regionProject(bounds: Bounds, boxW: number, boxH: number, margin: number) {
  const latSpan = bounds.latMax - bounds.latMin
  const lonSpan = bounds.lonMax - bounds.lonMin
  const cLat = (bounds.latMin + bounds.latMax) * 0.5
  const cosLat = Math.cos((cLat * Math.PI) / 180)
  const effLon = lonSpan * cosLat
  const innerW = boxW - 2 * margin
  const innerH = boxH - 2 * margin
  const scale = Math.min(innerW / effLon, innerH / latSpan)
  const offX = margin + (innerW - scale * effLon) * 0.5
  const offY = margin + (innerH - scale * latSpan) * 0.5
  return (lat: number, lon: number): [number, number] => [
    offX + (lon - bounds.lonMin) * cosLat * scale,
    offY + (bounds.latMax - lat) * scale,
  ]
}

export interface RegionMapData {
  bounds: Bounds
  land: [number, number][][]
  features: [number, number][][]
  cities: NamedPoint[]
  islets?: NamedPoint[]
}

// Draws land (filled + outlined), dotted fault/trench/island-chain texture, city dots and small
// island dots into the CURRENT canvas transform (caller translates to the map box's top-left first,
// same convention as NZ's map in draw.ts). Returns the projection fn so the caller can place quake
// markers and any one-off region-specific extras (e.g. California's Salton Sea) with the same transform.
export function drawRegionMap(ctx: CanvasRenderingContext2D, boxW: number, boxH: number, data: RegionMapData) {
  const t = THEME
  const project = regionProject(data.bounds, boxW, boxH, 8)

  const strokePath = (pts: [number, number][], close: boolean) => {
    ctx.beginPath()
    pts.forEach(([lat, lon], i) => {
      const [x, y] = project(lat, lon)
      if (i === 0) ctx.moveTo(x, y)
      else ctx.lineTo(x, y)
    })
    if (close) ctx.closePath()
  }

  ctx.fillStyle = t.mapLand
  ctx.strokeStyle = t.mapOutline
  ctx.lineWidth = 1.1
  ctx.lineJoin = 'round'
  ctx.lineCap = 'round'
  for (const poly of data.land) {
    strokePath(poly, true)
    ctx.fill()
    ctx.stroke()
  }

  // Dotted texture -- trenches, faults, offshore island chains. t.edge is the closest existing
  // theme token to the firmware's GEO_DIM (0x2227 -> #21493a vs. edge's #234a36 -- a near-exact
  // match, confirmed by converting the RGB565 constant rather than re-picking a colour by eye).
  ctx.strokeStyle = t.edge
  ctx.lineWidth = 0.6
  ctx.setLineDash([1, 2])
  for (const line of data.features) {
    strokePath(line, false)
    ctx.stroke()
  }
  ctx.setLineDash([])

  if (data.islets) {
    ctx.fillStyle = t.mapOutline
    for (const p of data.islets) {
      const [x, y] = project(p.lat, p.lon)
      ctx.beginPath()
      ctx.arc(x, y, 1.2, 0, Math.PI * 2)
      ctx.fill()
    }
  }

  // t.primary is the exact colour (#7fd69a, confirmed from the firmware's own mapCity comment),
  // not an approximation.
  ctx.fillStyle = t.primary
  for (const p of data.cities) {
    const [x, y] = project(p.lat, p.lon)
    ctx.beginPath()
    ctx.arc(x, y, 1.4, 0, Math.PI * 2)
    ctx.fill()
  }

  return project
}

// One epicentre marker: dashed line to the box centre + ring-and-dot glyph -- same look as NZ's
// markers in draw.ts, factored out so the three new regions don't each re-implement it.
export function drawRegionMarker(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  centerX: number,
  centerY: number,
  color: string,
  outerR: number,
  outerA: number,
  midR: number,
  innerR: number
) {
  const h = color.replace('#', '')
  const r = parseInt(h.slice(0, 2), 16)
  const g = parseInt(h.slice(2, 4), 16)
  const b = parseInt(h.slice(4, 6), 16)

  ctx.strokeStyle = color
  ctx.globalAlpha = 0.5
  ctx.lineWidth = 0.4
  ctx.setLineDash([1.5, 2])
  ctx.beginPath()
  ctx.moveTo(centerX, centerY)
  ctx.lineTo(x, y)
  ctx.stroke()
  ctx.setLineDash([])
  ctx.globalAlpha = 1

  ctx.fillStyle = `rgba(${r},${g},${b},${outerA})`
  ctx.beginPath()
  ctx.arc(x, y, outerR, 0, Math.PI * 2)
  ctx.fill()

  ctx.strokeStyle = color
  ctx.lineWidth = 0.7
  ctx.beginPath()
  ctx.arc(x, y, midR, 0, Math.PI * 2)
  ctx.stroke()

  ctx.fillStyle = color
  ctx.beginPath()
  ctx.arc(x, y, innerR, 0, Math.PI * 2)
  ctx.fill()
}
