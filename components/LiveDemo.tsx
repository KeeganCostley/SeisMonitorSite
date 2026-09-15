'use client'

import { useRef, useState } from 'react'
import dynamic from 'next/dynamic'
import { motion } from 'framer-motion'
import { VARIANTS } from '@/constants/design'

// Three.js touches the DOM/canvas on mount -- load client-only, no SSR.
const DeviceViewer = dynamic(() => import('@/components/DeviceViewer'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center text-ink-faint text-xs font-mono tracking-widest uppercase">
      Loading the model...
    </div>
  ),
})

export default function LiveDemo() {
  const [ready, setReady] = useState(false)
  const triggerRef = useRef<() => void>(() => {})

  return (
    <section id="demo" className="relative py-24 bg-bg">
      <div className="divider" />
      <div className="max-w-site mx-auto px-6">
        <motion.p
          variants={VARIANTS.fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.5 }}
          className="font-mono text-[10px] tracking-widest uppercase text-ink-muted mb-4"
        >
          Live demo
        </motion.p>

        <motion.div
          variants={VARIANTS.fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="grid md:grid-cols-[1.1fr,1fr] gap-12 items-center"
        >
          <div>
            <h2 className="font-heading font-semibold text-ink text-2xl md:text-3xl mb-4">
              This is the actual print. Running the actual screen.
            </h2>
            <p className="text-ink-muted text-sm leading-relaxed mb-6 max-w-md">
              Drag to rotate it. The screen you are looking at is not a photo -- it is the
              same monitor UI the device runs, drawing live seismic data pulled from GeoNet
              right now. Every few seconds it shows what an alert actually looks like on
              the device, cycling through real recent quakes.
            </p>
            <button
              onClick={() => triggerRef.current()}
              disabled={!ready}
              className="
                px-5 py-2.5 rounded-sm text-xs font-semibold tracking-widest uppercase
                border border-border text-ink-muted
                hover:border-sage/40 hover:text-sage
                disabled:opacity-40 disabled:cursor-not-allowed
                transition-all duration-300
              "
            >
              Trigger an alert
            </button>
            <p className="text-ink-faint text-[10px] font-mono mt-4 tracking-widest">
              Model + screen rendered live in your browser -- nothing pre-rendered.
            </p>
          </div>

          <div className="relative aspect-square rounded-sm border border-border bg-bg-surface overflow-hidden">
            <DeviceViewer onReady={(trigger) => { triggerRef.current = trigger; setReady(true) }} />
          </div>
        </motion.div>
      </div>
    </section>
  )
}
