'use client'

import { motion } from 'framer-motion'
import SeismographCanvas from './SeismographCanvas'
import { COPY, VARIANTS } from '@/constants/design'

export default function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col overflow-hidden bg-bg">

      {/* Very faint dot grid — just enough to give depth */}
      <div className="absolute inset-0 dot-grid opacity-40 pointer-events-none" />

      {/* Content — left-aligned, sparse */}
      <div className="relative z-10 flex flex-col flex-1 max-w-site mx-auto px-6 pt-40 pb-0 w-full">

        {/* Headline */}
        <motion.h1
          variants={VARIANTS.fadeUp}
          initial="hidden"
          animate="show"
          transition={{ delay: 0.15 }}
          className="font-heading font-semibold text-5xl sm:text-6xl lg:text-[5.5rem] leading-[1.04] tracking-tight text-ink"
        >
          {COPY.tagline}
          <br />
          <span className="text-ink-muted">{COPY.subTagline}</span>
        </motion.h1>

        {/* Single line description */}
        <motion.p
          variants={VARIANTS.fadeUp}
          initial="hidden"
          animate="show"
          transition={{ delay: 0.3 }}
          className="mt-8 max-w-sm text-ink-muted text-sm leading-relaxed"
        >
          {COPY.description}
        </motion.p>

        {/* One CTA */}
        <motion.div
          variants={VARIANTS.fadeUp}
          initial="hidden"
          animate="show"
          transition={{ delay: 0.45 }}
          className="mt-10"
        >
          <a
            href="#pricing"
            className="
              inline-block px-6 py-2.5 rounded text-xs font-semibold tracking-widest uppercase
              border border-border text-ink-muted
              hover:border-sage/40 hover:text-sage
              transition-all duration-300
            "
          >
            {COPY.ctaPrimary}
          </a>
        </motion.div>
      </div>

      {/* Seismograph strip */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7, duration: 1.2 }}
        className="relative w-full mt-16 mb-8"
      >
        {/* Metadata line */}
        <div className="max-w-site mx-auto px-6 mb-3 flex justify-between">
          <span className="font-mono text-[10px] text-ink-faint tracking-widest uppercase">
            GeoNet NZ · simulated
          </span>
          <span className="font-mono text-[10px] text-ink-faint tracking-widest">
            live
          </span>
        </div>

        <SeismographCanvas height={140} />

        {/* Fade into next section */}
        <div
          className="absolute bottom-0 left-0 right-0 h-20 pointer-events-none"
          style={{ background: 'linear-gradient(to bottom, transparent, #0e0e0b)' }}
        />
      </motion.div>
    </section>
  )
}
