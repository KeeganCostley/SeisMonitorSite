'use client'

import { useRef, useState } from 'react'
import dynamic from 'next/dynamic'
import { REGIONS } from '@/lib/screen/theme'
import type { RegionValue } from '@/lib/screen/theme'

// Three.js touches the DOM/canvas on mount -- load client-only, no SSR.
// This is the actual live-data 3D viewer (real STL + real GeoNet/USGS feed on
// the screen texture), promoted to the hero position -- the first thing a
// visitor sees, ahead of any heading or explanation.
const DeviceViewer = dynamic(() => import('./DeviceViewer'), {
  ssr: false,
  loading: () => (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%',
      fontFamily: "'Courier New',monospace", fontSize: 11, letterSpacing: '0.18em',
      textTransform: 'uppercase', color: 'var(--ink-3)',
    }}>
      Loading model_
    </div>
  ),
})

interface Copy {
  captionTemplate: string // contains a literal "{source}" token, swapped for GeoNet/USGS
  alertLink: string
  caveat: string
  downloadLabel: string
  hint: string
}

export default function LiveDemoClient({ copy }: { copy: Copy }) {
  const [ready, setReady] = useState(false)
  const [region, setRegion] = useState<RegionValue>('nz')
  const triggerRef = useRef<() => void>(() => {})
  const source = region === 'nz' ? 'GeoNet' : 'USGS'
  const caption = copy.captionTemplate.replace('{source}', source)

  return (
    <>
      <div className="region-picker">
        {REGIONS.map((r) => (
          <button
            key={r.value}
            className={'region-btn' + (region === r.value ? ' active' : '')}
            onClick={() => setRegion(r.value)}
          >
            {r.label}
          </button>
        ))}
      </div>

      <div className="three" style={{ height: 460 }}>
        <div className="stage" style={{ height: 460 }}>
          <DeviceViewer region={region} onReady={(trigger) => { triggerRef.current = trigger; setReady(true) }} />
        </div>
        <a className="dl" href="/models/seismonitor-body.stl" download>{copy.downloadLabel}</a>
        <div className="hint">{copy.hint}</div>
      </div>
      <div className="cap">
        {caption}
        {' '}
        <a
          href="#model"
          onClick={(e) => { e.preventDefault(); if (ready) triggerRef.current() }}
          style={{ color: ready ? undefined : 'var(--ink-3)', cursor: ready ? 'pointer' : 'default' }}
        >
          {copy.alertLink}
        </a>
      </div>
      <div className="constr">{copy.caveat}</div>
    </>
  )
}
