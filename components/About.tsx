'use client'

import { motion } from 'framer-motion'
import { VARIANTS } from '@/constants/design'

const SPECS = [
  ['Processor',   'ESP32-WROOM-32'],
  ['Display',     '3.5″ ILI9488 TFT · 320×480'],
  ['Connectivity','802.11 b/g/n WiFi'],
  ['Data',        'GeoNet NZ · USGS Global'],
  ['Enclosure',   'PLA · 3D-printed in NZ'],
  ['Power',       'USB-C 5V/1A'],
  ['Firmware',    'Custom C++ · OTA'],
]

export default function About() {
  return (
    <section id="about" className="relative py-24 bg-bg-surface">
      <div className="divider" />

      <div className="max-w-site mx-auto px-6">

        <motion.p
          variants={VARIANTS.fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.5 }}
          className="font-mono text-[10px] tracking-widest uppercase text-ink-muted mb-12"
        >
          About
        </motion.p>

        <div className="grid lg:grid-cols-2 gap-16 items-start">

          {/* ── Left: photo placeholder + brief text ── */}
          <motion.div
            variants={VARIANTS.fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
          >
            {/* Lab photo placeholder */}
            <div
              className="
                w-full aspect-[4/3] rounded-sm border border-border bg-bg
                flex items-center justify-center mb-8
              "
            >
              <div className="text-center">
                <div className="w-8 h-px bg-ink-faint mx-auto mb-1" />
                <div className="w-px h-8 bg-ink-faint mx-auto" />
                <p className="font-mono text-[10px] tracking-widest uppercase text-ink-faint mt-4">
                  Photo — in the lab
                </p>
              </div>
            </div>

            {/* Minimal text */}
            <p className="text-ink-muted text-sm leading-relaxed mb-4">
              Built in New Zealand, somewhere between curiosity and obsession.
              Seismonitor is a handmade IoT device — not a startup, not a product line.
              Just a thing that felt worth making.
            </p>
            <p className="text-ink-muted text-sm leading-relaxed">
              New Zealand sits on the Pacific Ring of Fire. The earth here moves constantly.
              This is a way to watch it.
            </p>

            <p className="font-mono text-[10px] tracking-widest uppercase text-ink-faint mt-8">
              Aotearoa New Zealand
            </p>
          </motion.div>

          {/* ── Right: specs only ── */}
          <motion.div
            variants={VARIANTS.fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
          >
            <p className="text-[10px] font-mono tracking-widest uppercase text-ink-muted mb-4">
              Technical specifications
            </p>

            <div className="divide-y divide-border">
              {SPECS.map(([key, val]) => (
                <div key={key} className="flex items-baseline gap-6 py-3">
                  <span className="font-mono text-[10px] tracking-wider uppercase text-ink-faint w-28 shrink-0">
                    {key}
                  </span>
                  <span className="text-ink-muted text-xs">{val}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
