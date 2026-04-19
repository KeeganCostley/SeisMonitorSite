'use client'

import { motion } from 'framer-motion'
import { VARIANTS } from '@/constants/design'

const GALLERY_ITEMS = [
  { id: 'front',    label: 'Device — front',       span: 'col-span-2 row-span-2' },
  { id: 'mt-cook',  label: 'Mt Cook edition',       span: 'col-span-1 row-span-1' },
  { id: 'display',  label: 'Display close-up',      span: 'col-span-1 row-span-1' },
  { id: 'screen',   label: 'Map view',              span: 'col-span-1 row-span-1' },
  { id: 'rear',     label: 'Rear panel',            span: 'col-span-1 row-span-1' },
  { id: 'packag',   label: 'Packaging',             span: 'col-span-2 row-span-1' },
]

function Tile({ label, className }: { label: string; className?: string }) {
  return (
    <div
      className={`
        relative rounded-sm border border-border bg-bg-surface
        flex items-end p-4 overflow-hidden
        ${className}
      `}
    >
      {/* Placeholder centre mark */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-8 h-px bg-ink-faint" />
        <div className="absolute w-px h-8 bg-ink-faint" />
      </div>

      {/* Label */}
      <p className="relative z-10 font-mono text-[10px] tracking-widest uppercase text-ink-faint">
        {label}
      </p>
    </div>
  )
}

export default function Gallery() {
  return (
    <section id="gallery" className="relative py-24 bg-bg-surface">
      <div className="divider" />

      <div className="max-w-site mx-auto px-6">

        <motion.p
          variants={VARIANTS.fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.5 }}
          className="font-mono text-[10px] tracking-widest uppercase text-ink-muted mb-12"
        >
          Product photos
        </motion.p>

        <motion.div
          variants={VARIANTS.staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.1 }}
          className="grid grid-cols-2 lg:grid-cols-4 auto-rows-[200px] gap-2"
        >
          {GALLERY_ITEMS.map((item) => (
            <motion.div key={item.id} variants={VARIANTS.cardReveal} className={item.span}>
              <Tile label={item.label} className="h-full" />
            </motion.div>
          ))}
        </motion.div>

        <motion.p
          variants={VARIANTS.fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="mt-4 text-ink-faint text-[10px] font-mono"
        >
          Photos coming soon.
        </motion.p>
      </div>
    </section>
  )
}
