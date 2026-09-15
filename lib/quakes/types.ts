export interface Quake {
  id: string
  mag: number
  place: string
  lat: number
  lon: number
  depth: number // km
  time: number  // epoch ms
}

export interface QuakeFeed {
  latest: Quake | null
  high24: Quake | null
  highs24: Quake[]
  recent: Quake[]
  source: 'live' | 'fallback'
}
