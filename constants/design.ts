// ─── SEISMONITOR DESIGN CONSTANTS ─────────────────────────────────────────────
// Single source of truth for JS/canvas values.
// Mirror colour changes here AND in tailwind.config.ts.
// ──────────────────────────────────────────────────────────────────────────────

export const COLORS = {
  // Warm dark — earthy, not blue-black
  background:    '#0e0e0b',
  surface:       '#161612',
  surfaceRaised: '#1e1e19',

  // Muted sage — organic, not neon
  accent:        '#5aaf78',   // seismograph trace (slightly vivid so the data reads)
  accentUI:      '#8aaa8e',   // UI elements — softer, more muted
  accentDim:     '#456e52',

  // Warm text
  textPrimary:   '#c8c3b2',
  textMuted:     '#6a6658',
  textFaint:     '#3d3c36',

  border:        'rgba(255,255,255,0.055)',
} as const

// ── Seismograph Canvas ─────────────────────────────────────────────────────────
export const SEISMOGRAPH = {
  lineWidth:    1.4,
  glowBlur:     6,      // reduced — more matte instrument feel
  glowAlpha:    0.75,
  scrollSpeed:  0.9,    // slightly slower — less frenetic

  canvasHeight: 140,

  quietMinFrames: 300,
  quietMaxFrames: 600,
  baselineNoise:  0.018,
  pWaveDuration:  55,
  sWaveDuration:  110,
  codaDuration:   140,
  minMagnitude:   0.20,
  maxMagnitude:   0.80,
} as const

// ── Framer Motion Variants ─────────────────────────────────────────────────────
export const VARIANTS = {
  fadeUp: {
    hidden: { opacity: 0, y: 20 },
    show:   { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.25, 0.1, 0.25, 1] } },
  },
  staggerContainer: {
    hidden: {},
    show:   { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
  },
  cardReveal: {
    hidden: { opacity: 0, y: 16 },
    show:   { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] } },
  },
} as const

// ── Copy ───────────────────────────────────────────────────────────────────────
export const COPY = {
  siteName:    'Seismonitor',
  tagline:     'Feel the Earth.',
  subTagline:  'Before it feels you.',
  description: 'A handmade device that listens to the ground. Real-time seismic data from GeoNet and USGS, displayed on a 3.5″ screen. Built in New Zealand.',
  ctaPrimary:  'Join the waitlist',
  ctaSecondary: 'Learn more',
  madeIn:      'Made in Aotearoa New Zealand',
} as const

// ── Pricing ────────────────────────────────────────────────────────────────────
export const PRICING = {
  productName:   'Seismonitor One',
  priceEarly:    '179',
  priceFull:     '199',
  currency:      'NZD',
  shippingNote:  'Free shipping within NZ · Est. Q4 2025',
} as const
