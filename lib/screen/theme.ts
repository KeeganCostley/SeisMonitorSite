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
  ring1: '#0e1c17',
  ring2: '#16291f',
  ring3: '#20392b',
  ring4: '#2b4938',
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
