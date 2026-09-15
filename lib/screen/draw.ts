// Canvas2D port of the firmware landscape UI (sm-land-rings.jsx +
// sm-land-alert.jsx / Alert04a) -- draws the exact 320x240 monitor screen and
// alert takeover so a live canvas can be used as a Three.js texture on the
// 3D enclosure. Coordinates, panel geometry and colours are taken directly
// from the design handoff (SeisMonitor/docs/design_handoff_landscape_ui/),
// not eyeballed -- see that folders README for the source layout spec.
//
// Simplifications vs. the web prototype (acceptable at 3D-viewer scale):
//  - the settings-cog icon is a plain gear glyph instead of the vector path
//  - CSS blur() glows are approximated with a wider, fainter stroke
//  - CSS animation-delay on the alert rings loops from t=0 instead of only
//    delaying the first cycle (keeps the idle/ambient loop seamless)

import { THEME, SCREEN_W, SCREEN_H, HEADER_H, severityColor } from './theme'
import { nzProject } from './nzCoastline'
import { cubicBezier } from './bezier'
import type { Quake } from '@/lib/quakes/types'

const ringEase = cubicBezier(0, 0.45, 0.5, 1)

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace('#', '')
  return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)]
}
function rgba(hex: string, alpha: number): string {
  const c = hexToRgb(hex)
  return 'rgba(' + c[0] + ',' + c[1] + ',' + c[2] + ',' + Math.max(0, Math.min(1, alpha)) + ')'
}
function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t
}

function roundRectPath(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.arcTo(x + w, y, x + w, y + h, r)
  ctx.arcTo(x + w, y + h, x, y + h, r)
  ctx.arcTo(x, y + h, x, y, r)
  ctx.arcTo(x, y, x + w, y, r)
  ctx.closePath()
}

export function formatAgo(fromMs: number, nowMs: number): string {
  const diffMin = Math.max(0, Math.round((nowMs - fromMs) / 60000))
  if (diffMin < 60) return Math.max(1, diffMin) + 'M'
  const diffHr = Math.round(diffMin / 60)
  if (diffHr < 48) return diffHr + 'H'
  return Math.round(diffHr / 24) + 'D'
}

// Greedy 2-line wrap, close enough to the prototype balanced wrap at this size.
function wrapTwoLines(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): [string, string] {
  const words = text.split(' ')
  let line1 = ''
  let i = 0
  for (; i < words.length; i++) {
    const trial = line1 ? line1 + ' ' + words[i] : words[i]
    if (ctx.measureText(trial).width > maxWidth && line1) break
    line1 = trial
  }
  const line2 = words.slice(i).join(' ')
  return [line1, line2]
}

interface MonitorInput {
  latest: Quake | null
  high24: Quake | null
  seismoSamples: number[]
  nowMs: number
}

const PAD = 6
const GAP = 5
const CONTENT_TOP = HEADER_H + 4 // 26
const CONTENT_BOT = SCREEN_H - 6 // 234
const LEFT_X = 6
const LEFT_W = 106
const SEISMO_H = 42
const RIGHT_X = LEFT_X + LEFT_W + GAP // 117
const RIGHT_W = SCREEN_W - PAD - RIGHT_X // 197
const DATA_TOP = CONTENT_TOP // 26
const DATA_H = CONTENT_BOT - CONTENT_TOP - SEISMO_H - GAP // 161
const SEISMO_TOP = CONTENT_BOT - SEISMO_H // 192

export function drawMonitorNZ(ctx: CanvasRenderingContext2D, input: MonitorInput) {
  const t = THEME
  const latest = input.latest
  const high24 = input.high24
  const seismoSamples = input.seismoSamples
  const nowMs = input.nowMs

  // background
  ctx.fillStyle = t.bg
  ctx.fillRect(0, 0, SCREEN_W, SCREEN_H)

  // header
  ctx.strokeStyle = t.edge
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(0, HEADER_H + 0.5)
  ctx.lineTo(SCREEN_W, HEADER_H + 0.5)
  ctx.stroke()

  ctx.textBaseline = 'middle'
  ctx.font = '700 10px "JetBrains Mono", ui-monospace, monospace'
  ctx.fillStyle = t.primary
  ctx.textAlign = 'left'
  ctx.fillText('\u25C9 SEIS \u00B7 NZ', 10, HEADER_H / 2 + 1)

  const clock = new Date(nowMs)
  const hh = String(clock.getHours()).padStart(2, '0')
  const mm = String(clock.getMinutes()).padStart(2, '0')
  ctx.fillStyle = t.secondary
  ctx.textAlign = 'right'
  ctx.fillText(hh + ':' + mm + ' \u00B7 WIFI', SCREEN_W - 26, HEADER_H / 2 + 1)
  ctx.font = '10px sans-serif'
  ctx.fillText('\u2699', SCREEN_W - 10, HEADER_H / 2 + 1)

  // data panel
  roundRectPath(ctx, LEFT_X + 0.5, DATA_TOP + 0.5, LEFT_W - 1, DATA_H - 1, 3)
  ctx.strokeStyle = t.edge
  ctx.stroke()

  const cellH = DATA_H / 2
  const drawCell = (
    cy0: number,
    label: string,
    labelColor: string,
    q: Quake | null,
    fallbackMeta: string
  ) => {
    const cx = LEFT_X + LEFT_W / 2
    let y = cy0 + cellH / 2 - 24
    ctx.textAlign = 'center'
    ctx.font = '700 8px "JetBrains Mono", ui-monospace, monospace'
    ctx.fillStyle = labelColor
    ctx.fillText(label, cx, y)
    y += 15
    ctx.font = '700 18px "JetBrains Mono", ui-monospace, monospace'
    ctx.fillStyle = labelColor
    ctx.fillText(q ? 'M' + q.mag.toFixed(1) : '\u2014', cx, y)
    y += 15
    ctx.font = '700 11.5px Inter, sans-serif'
    ctx.fillStyle = t.ink
    const place = q ? q.place : 'Awaiting data...'
    if (ctx.measureText(place).width > LEFT_W - 12) {
      const wrapped = wrapTwoLines(ctx, place, LEFT_W - 12)
      ctx.fillText(wrapped[0], cx, y)
      if (wrapped[1]) {
        y += 13
        ctx.fillText(wrapped[1], cx, y)
      }
    } else {
      ctx.fillText(place, cx, y)
    }
    y += 15
    ctx.font = '400 8px "JetBrains Mono", ui-monospace, monospace'
    ctx.fillStyle = t.secondary
    ctx.fillText(q ? formatAgo(q.time, nowMs) + ' AGO \u00B7 ' + Math.round(q.depth) + 'KM' : fallbackMeta, cx, y)
  }

  drawCell(DATA_TOP, '\u25C6 LATEST', t.latest, latest, '')
  ctx.strokeStyle = t.edgeDim
  ctx.beginPath()
  ctx.moveTo(LEFT_X + 8, DATA_TOP + cellH + 0.5)
  ctx.lineTo(LEFT_X + LEFT_W - 8, DATA_TOP + cellH + 0.5)
  ctx.stroke()
  drawCell(DATA_TOP + cellH, '\u25C6 24H HIGH', t.highest, high24, '')

  // seismograph panel
  roundRectPath(ctx, LEFT_X + 0.5, SEISMO_TOP + 0.5, LEFT_W - 1, SEISMO_H - 1, 3)
  ctx.strokeStyle = t.edge
  ctx.stroke()

  ctx.save()
  roundRectPath(ctx, LEFT_X + 1, SEISMO_TOP + 1, LEFT_W - 2, SEISMO_H - 2, 2)
  ctx.clip()
  const sx = LEFT_X + 1
  const sy = SEISMO_TOP + 1
  const sw = LEFT_W - 2
  const sh = SEISMO_H - 2
  ctx.strokeStyle = t.ring1
  ctx.lineWidth = 0.3
  for (let i = 0; i < 3; i++) {
    const y = sy + ((i + 1) * sh) / 4
    ctx.beginPath()
    ctx.moveTo(sx, y)
    ctx.lineTo(sx + sw, y)
    ctx.stroke()
  }
  for (let i = 0; i <= 10; i++) {
    const x = sx + (i * sw) / 10
    const major = i % 5 === 0
    ctx.strokeStyle = t.secondary
    ctx.globalAlpha = major ? 0.7 : 0.4
    ctx.lineWidth = 0.4
    ctx.beginPath()
    ctx.moveTo(x, sy + sh / 2 - (major ? 3 : 1.5))
    ctx.lineTo(x, sy + sh / 2 + (major ? 3 : 1.5))
    ctx.stroke()
  }
  ctx.globalAlpha = 1
  ctx.strokeStyle = t.ring3
  ctx.lineWidth = 0.5
  ctx.beginPath()
  ctx.moveTo(sx, sy + sh / 2)
  ctx.lineTo(sx + sw, sy + sh / 2)
  ctx.stroke()

  const traceY = (i: number, samples: number[], padY: number) => {
    const mid = sh / 2
    let max = 0
    for (const s of samples) max = Math.max(max, Math.abs(s))
    if (max === 0) max = 1
    const scale = ((sh / 2) * (1 - padY)) / max
    return mid - samples[i] * scale
  }
  const drawTrace = (width: number, color: string, alpha: number) => {
    ctx.beginPath()
    for (let i = 0; i < seismoSamples.length; i++) {
      const x = sx + (i / (seismoSamples.length - 1)) * sw
      const y = sy + traceY(i, seismoSamples, 0.28)
      if (i === 0) ctx.moveTo(x, y)
      else ctx.lineTo(x, y)
    }
    ctx.strokeStyle = color
    ctx.lineWidth = width
    ctx.globalAlpha = alpha
    ctx.stroke()
    ctx.globalAlpha = 1
  }
  drawTrace(1.8, t.primary, 0.3) // soft glow underlay (no true blur on canvas)
  drawTrace(1, t.primary, 1)
  ctx.restore()

  ctx.font = '6.5px monospace'
  ctx.fillStyle = t.sub
  ctx.textAlign = 'left'
  ctx.fillText('Z', sx + 3, sy + 9)
  ctx.textAlign = 'right'
  ctx.fillText('60s', sx + sw - 3, sy + 9)

  // map panel
  const mpX = RIGHT_X
  const mpY = CONTENT_TOP
  const mpW = RIGHT_W - 1
  const mpH = CONTENT_BOT - CONTENT_TOP - 1
  roundRectPath(ctx, mpX + 0.5, mpY + 0.5, RIGHT_W - 1, mpH, 3)
  ctx.strokeStyle = t.edge
  ctx.stroke()

  ctx.save()
  roundRectPath(ctx, mpX + 1, mpY + 1, mpW - 1, mpH - 1, 2)
  ctx.clip()
  ctx.translate(mpX + 1, mpY + 1)

  const cx = (mpW - 1) / 2
  const cy = (mpH - 1) / 2
  const rings: [number, keyof typeof THEME, string][] = [
    [30, 'ring1', '100'],
    [54, 'ring2', '200'],
    [78, 'ring3', '300'],
    [98, 'ring4', '500'],
  ]
  const labelAngle = Math.PI * 0.82
  ctx.font = '6.5px monospace'
  ctx.textAlign = 'center'
  for (const ring of rings) {
    const r = ring[0]
    const colorKey = ring[1]
    const label = ring[2]
    ctx.beginPath()
    ctx.arc(cx, cy, r, 0, Math.PI * 2)
    ctx.strokeStyle = t[colorKey]
    ctx.lineWidth = 0.7
    ctx.setLineDash([2, 3])
    ctx.stroke()
    ctx.setLineDash([])
    ctx.fillStyle = t.sub
    ctx.fillText(label, cx + Math.cos(labelAngle) * r, cy + Math.sin(labelAngle) * r)
  }

  ctx.strokeStyle = t.secondary
  ctx.globalAlpha = 0.6
  ctx.lineWidth = 0.6
  ctx.beginPath()
  ctx.moveTo(cx - 6, cy)
  ctx.lineTo(cx + 6, cy)
  ctx.moveTo(cx, cy - 6)
  ctx.lineTo(cx, cy + 6)
  ctx.stroke()
  ctx.globalAlpha = 1

  const boxW = 150
  const boxH = 190
  const gx = cx - boxW / 2
  const gy = cy - boxH / 2
  const nz = nzProject(boxW, boxH, 8)

  ctx.save()
  ctx.translate(gx, gy)
  ctx.fillStyle = t.mapLand
  ctx.strokeStyle = t.mapOutline
  ctx.lineWidth = 1.1
  ctx.lineJoin = 'round'
  ctx.lineCap = 'round'
  const polys = [nz.north, nz.south, nz.stewart]
  for (const poly of polys) {
    ctx.beginPath()
    for (let i = 0; i < poly.length; i++) {
      const p = poly[i]
      if (i === 0) ctx.moveTo(p[0], p[1])
      else ctx.lineTo(p[0], p[1])
    }
    ctx.closePath()
    ctx.fill()
    ctx.stroke()
  }

  const drawMarker = (
    q: Quake | null,
    color: string,
    outerR: number,
    outerA: number,
    midR: number,
    innerR: number
  ) => {
    if (!q) return
    const proj = nz.project(q.lat, q.lon)
    const mx = proj[0]
    const my = proj[1]
    ctx.strokeStyle = color
    ctx.globalAlpha = 0.5
    ctx.lineWidth = 0.4
    ctx.setLineDash([1.5, 2])
    ctx.beginPath()
    ctx.moveTo(boxW / 2, boxH / 2)
    ctx.lineTo(mx, my)
    ctx.stroke()
    ctx.setLineDash([])
    ctx.globalAlpha = 1

    ctx.fillStyle = rgba(color, outerA)
    ctx.beginPath()
    ctx.arc(mx, my, outerR, 0, Math.PI * 2)
    ctx.fill()

    ctx.strokeStyle = color
    ctx.lineWidth = 0.7
    ctx.beginPath()
    ctx.arc(mx, my, midR, 0, Math.PI * 2)
    ctx.stroke()

    ctx.fillStyle = color
    ctx.beginPath()
    ctx.arc(mx, my, innerR, 0, Math.PI * 2)
    ctx.fill()
  }
  drawMarker(latest, t.latest, 9, 0.12, 4.5, 2)
  drawMarker(high24, t.highest, 8, 0.1, 3.5, 1.7)
  ctx.restore()
  ctx.restore()
}

interface AlertInput {
  quake: Quake
  elapsedMs: number
}

const ALERT_ORIGIN = { x: 16, y: 224 }
const ALERT_RING_COUNT = 5
const ALERT_MAX_R = 360
const ALERT_DUR_S = 2.4
const ALERT_THICK = 2

export function drawAlert(ctx: CanvasRenderingContext2D, input: AlertInput) {
  const quake = input.quake
  const elapsedMs = input.elapsedMs
  const c = severityColor(quake.mag)
  const tSec = elapsedMs / 1000

  ctx.fillStyle = THEME.bg
  ctx.fillRect(0, 0, SCREEN_W, SCREEN_H)

  // expanding shockwave rings, staggered, looping continuously
  for (let i = 0; i < ALERT_RING_COUNT; i++) {
    const delay = (i * ALERT_DUR_S) / ALERT_RING_COUNT
    const raw = (((tSec - delay) % ALERT_DUR_S) + ALERT_DUR_S) % ALERT_DUR_S
    const phase = raw / ALERT_DUR_S
    const e = ringEase(phase)
    const radius = ALERT_MAX_R * (0.06 + e * 0.94)
    const opacity = e < 0.7 ? lerp(1, 0.5, e / 0.7) : lerp(0.5, 0, (e - 0.7) / 0.3)
    ctx.beginPath()
    ctx.arc(ALERT_ORIGIN.x, ALERT_ORIGIN.y, radius, 0, Math.PI * 2)
    ctx.strokeStyle = rgba(c, opacity)
    ctx.lineWidth = ALERT_THICK
    ctx.stroke()
  }
  // origin core + soft glow
  const glow = ctx.createRadialGradient(ALERT_ORIGIN.x, ALERT_ORIGIN.y, 0, ALERT_ORIGIN.x, ALERT_ORIGIN.y, 10)
  glow.addColorStop(0, rgba(c, 0.9))
  glow.addColorStop(1, rgba(c, 0))
  ctx.fillStyle = glow
  ctx.beginPath()
  ctx.arc(ALERT_ORIGIN.x, ALERT_ORIGIN.y, 10, 0, Math.PI * 2)
  ctx.fill()
  ctx.fillStyle = c
  ctx.beginPath()
  ctx.arc(ALERT_ORIGIN.x, ALERT_ORIGIN.y, 3, 0, Math.PI * 2)
  ctx.fill()

  const rightEdge = SCREEN_W - 16
  ctx.textAlign = 'right'
  ctx.fillStyle = c
  ctx.font = '800 15px Inter, sans-serif'
  ctx.fillText('SEISMIC ACTIVITY', rightEdge, 30)
  ctx.fillText('DETECTED', rightEdge, 47)

  ctx.font = '600 60px Inter, sans-serif'
  ctx.fillStyle = c
  ctx.fillText('M' + quake.mag.toFixed(1), rightEdge, SCREEN_H - 54)

  ctx.font = '700 22px Inter, sans-serif'
  ctx.fillStyle = THEME.ink
  ctx.fillText(quake.place, rightEdge, SCREEN_H - 30)

  ctx.font = '13px "JetBrains Mono", ui-monospace, monospace'
  ctx.fillStyle = c
  ctx.fillText('NOW \u00B7 ' + Math.round(quake.depth) + 'KM DEEP', rightEdge, SCREEN_H - 12)
}
