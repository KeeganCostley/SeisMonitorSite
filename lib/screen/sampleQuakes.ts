// Fallback alert-demo quakes -- ported from sm-land-alert.jsx's sample states
// -- used only if a live feed genuinely returns nothing to cycle through.
import type { Quake } from '@/lib/quakes/types'

export const SAMPLE_ALERT_QUAKES: Quake[] = [
  { id: 'sample-routine', mag: 2.4, place: 'Porirua, New Zealand', lat: -41.13, lon: 174.84, depth: 12, time: Date.now() },
  { id: 'sample-notable', mag: 5.5, place: '35km E of Cheviot', lat: -42.8, lon: 173.6, depth: 29, time: Date.now() },
  { id: 'sample-severe', mag: 7.1, place: 'Off E. Honshu, Japan', lat: 37.1, lon: 141.8, depth: 38, time: Date.now() },
  { id: 'sample-long', mag: 3.9, place: '20km SW of Tokomaru Bay', lat: -38.3, lon: 178.1, depth: 45, time: Date.now() },
]
