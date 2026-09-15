'use client'

import { useEffect, useRef, useState } from 'react'

export interface CarouselPhoto {
  src: string
  alt: string
  num: string
  cap: string
}

const ADVANCE_MS = 4200

// One photo at a time, all the same frame, auto-advancing like a slideshow.
// Was a deliberately uneven table per the design handoff, but that read as
// chaotic in practice -- this replaces it outright. Photo list + captions
// come from the server-component parent (Gallery.tsx), sourced from copy.md.
export default function GalleryCarousel({ photos }: { photos: CarouselPhoto[] }) {
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    if (paused || photos.length < 2) return
    timerRef.current = setInterval(() => {
      setIndex(i => (i + 1) % photos.length)
    }, ADVANCE_MS)
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [paused, photos.length])

  if (photos.length === 0) return null
  const go = (i: number) => setIndex(((i % photos.length) + photos.length) % photos.length)
  const photo = photos[Math.min(index, photos.length - 1)]

  return (
    <>
      <div
        className="carousel"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <div className="carousel-frame">
          {photos.map((p, i) => (
            <img key={p.src} src={p.src} alt={p.alt} className={i === index ? 'active' : ''} loading={i === 0 ? 'eager' : 'lazy'} />
          ))}
          <span className="carousel-arrow prev" onClick={() => go(index - 1)} role="button" aria-label="Previous photo">&#8249;</span>
          <span className="carousel-arrow next" onClick={() => go(index + 1)} role="button" aria-label="Next photo">&#8250;</span>
        </div>
        <div className="carousel-dots">
          {photos.map((p, i) => (
            <span
              key={p.src}
              className={'carousel-dot' + (i === index ? ' active' : '')}
              onClick={() => go(i)}
              role="button"
              aria-label={'Go to photo ' + (i + 1)}
            />
          ))}
        </div>
      </div>
      <div className="carousel-cap"><i>{photo.num}.</i>{photo.cap}</div>
    </>
  )
}
