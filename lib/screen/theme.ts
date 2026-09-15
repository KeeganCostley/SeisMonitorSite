// Colour tokens ported verbatim from the firmware's design handoff
// (SeisMonitor/docs/design_handoff_landscape_ui/screens/sm-land-rings.jsx
// and sm-land-alert.jsx) — the "soft HUD" phosphor palette.

export const SCREEN_W = 320
export const SCREEN_H = 240
export const HEADER_H = 22

export const THEME = {
  bg: '#03080a',
  ink: '#b8e6c4',
  primary: '#7fd69a',
  secondary: '#4a8a68',
  sub: '#355a48',
  rule: '#0e1a16',
  latest: '#9de8b2',
  highest: '#d4e88a',
  mapLand: '#0c1813',
  mapOutline: '#00b347',
  // Map distance rings -- converted from the firmware's CURRENT constants (main.cpp: t.ring1=0x0820
  // "softer", t.ring2=0x0841, t.ring3=0x10A2, t.ring4=0x18E3), not the original design-handoff mockup
  // (sm-land-rings.jsx) this theme was first ported from. The firmware deliberately dimmed these after
  // that mockup -- its own "softer" comment says so -- to the point the inner 3 rings are barely
  // perceptible against the background and only the outermost is faintly visible; the mockup's much
  // brighter values (#0e1c17...#2b4938, previously used here) made all four look bold and equal, which
  // is what didn't match the real device. Confirmed by encoding each value with the exact truncation
  // the firmware's own documented pair uses (0x08E2 -> "#0e1c17" in its comment: R8=R5<<3|R5>>2 etc.)
  // and checking it round-trips back to the same uint16 constant.
  ring1: '#080400',
  ring2: '#080808',
  ring3: '#101410',
  ring4: '#181c18',
  // Seismograph panel grid -- this is what the mockup's "ring1" (#0e1c17) actually corresponds to in
  // the firmware: a DIFFERENT constant (seismoGrid), not the map's ring1. Kept at the original bright
  // mockup value since that's genuinely still what the firmware uses for it (see main.cpp: t.seismoGrid
  // = 0x08E2 // #0e1c17 ring1 -- the "ring1" in that comment is just its own historical name from the
  // mockup, not a claim that it equals the map's ring1).
  seismoGrid: '#0e1c17',
  edge: '#234a36',
  edgeDim: '#16301f',
} as const

// Globe colours -- converted from the firmware's RGB565 constants in
// renderGlobe() (SeisMonitor/src/main.cpp), not re-picked by eye.
export const GLOBE = {
  fill: '#001008',
  limb: '#00ff8c',
  meshFront: '#00be63',
  meshBack: '#002400',
  eqFront: '#00ff63',
  coastBack: '#002800',
} as const

export const GLOBE_R = 74.0 // matches the firmware's GLOBE_R exactly (same 320x240 space)
export const GLOBE_TILT_COS = 0.9131
export const GLOBE_TILT_SIN = 0.4078

// Region metadata -- values, header labels (CJK rendered directly since the
// canvas isn't limited to the firmware's bitmap glyph set), and API region key.
export const REGIONS = [
  { value: 'nz',         label: 'New Zealand', headerLabel: 'AOTEAROA NEW ZEALAND' },
  { value: 'japan',      label: 'Japan',       headerLabel: '日本 JAPAN' },
  { value: 'california', label: 'California',  headerLabel: 'CALIFORNIA, USA' },
  { value: 'china',      label: 'China',       headerLabel: '中国 CHINA' },
  { value: 'global',     label: 'Global',      headerLabel: 'GLOBAL' },
] as const
export type RegionValue = (typeof REGIONS)[number]['value']

// Severity ramp climbs in both luminance and saturation, so a worse quake
// reads as a brighter, hotter colour on the additive display (the firmware's
// old ramp put M7 red as the *dimmest* pixel on screen — this is the design
// team's proposed fix, see sm-land-alert.jsx).
export function severityColor(mag: number): string {
  if (mag >= 7.0) return '#ff5d4d'
  if (mag >= 6.0) return '#ff9538'
  if (mag >= 5.0) return '#ffcf47'
  if (mag >= 4.0) return '#cfe25f'
  return '#7fd69a'
}
