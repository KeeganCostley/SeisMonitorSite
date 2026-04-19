'use client'

import { useState, FormEvent } from 'react'
import { motion } from 'framer-motion'
import { VARIANTS, PRICING, COPY } from '@/constants/design'

const INCLUDED = [
  'Seismonitor One device',
  'Enclosure of your choice',
  'USB-C cable',
  'Free shipping within NZ',
  'OTA firmware updates',
]

export default function Pricing() {
  const [email,     setEmail]     = useState('')
  const [edition,   setEdition]   = useState<'standard' | 'mt-cook'>('mt-cook')
  const [submitted, setSubmitted] = useState(false)
  const [error,     setError]     = useState('')

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    const trimmed = email.trim()
    if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setError('Enter a valid email.')
      return
    }
    // TODO: wire to Mailchimp / ConvertKit / Resend
    console.log('Waitlist:', { email: trimmed, edition })
    setSubmitted(true)
  }

  return (
    <section id="pricing" className="relative py-24 bg-bg">
      <div className="divider" />

      <div className="max-w-site mx-auto px-6">

        <motion.p
          variants={VARIANTS.fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.5 }}
          className="font-mono text-[10px] tracking-widest uppercase text-ink-muted mb-12"
        >
          Pricing
        </motion.p>

        <motion.div
          variants={VARIANTS.fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="grid md:grid-cols-2 gap-16 max-w-3xl"
        >

          {/* Left: product */}
          <div>
            <p className="font-heading font-semibold text-ink text-2xl mb-1">
              {PRICING.productName}
            </p>
            <p className="text-ink-muted text-xs mb-8">Consumer seismic monitor</p>

            {/* Price */}
            <div className="flex items-baseline gap-2 mb-8">
              <span className="font-heading font-semibold text-4xl text-ink">
                ${PRICING.priceEarly}
              </span>
              <span className="text-ink-muted text-xs font-mono">{PRICING.currency}</span>
              <span className="text-ink-faint text-xs line-through">
                ${PRICING.priceFull}
              </span>
            </div>

            {/* Edition */}
            <div className="mb-8">
              <p className="text-[10px] font-mono tracking-widest uppercase text-ink-muted mb-3">
                Edition
              </p>
              <div className="flex flex-col gap-2">
                {[
                  { id: 'standard', label: 'Standard enclosure' },
                  { id: 'mt-cook',  label: 'Mt Cook edition' },
                ].map(ed => (
                  <button
                    key={ed.id}
                    onClick={() => setEdition(ed.id as 'standard' | 'mt-cook')}
                    className={`
                      flex items-center justify-between px-4 py-2.5 rounded-sm border text-left text-xs
                      transition-all duration-200
                      ${edition === ed.id
                        ? 'border-sage/40 text-ink'
                        : 'border-border text-ink-muted hover:border-border/60'
                      }
                    `}
                  >
                    <span>{ed.label}</span>
                    {edition === ed.id && (
                      <span className="w-1.5 h-1.5 rounded-full bg-sage" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Included */}
            <div>
              <p className="text-[10px] font-mono tracking-widest uppercase text-ink-muted mb-3">
                Includes
              </p>
              <ul className="space-y-1.5">
                {INCLUDED.map(item => (
                  <li key={item} className="flex items-center gap-2.5 text-xs text-ink-muted">
                    <span className="w-1 h-1 rounded-full bg-sage opacity-60" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right: waitlist */}
          <div className="flex flex-col justify-center">
            {submitted ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <p className="font-heading font-semibold text-ink text-lg mb-2">
                  You're on the list.
                </p>
                <p className="text-ink-muted text-xs leading-relaxed">
                  We'll be in touch when pre-orders open.
                </p>
                <p className="text-ink-faint text-[10px] font-mono mt-4 tracking-widest">
                  {PRICING.shippingNote}
                </p>
              </motion.div>
            ) : (
              <>
                <p className="font-heading font-semibold text-ink text-lg mb-1">
                  Reserve your unit.
                </p>
                <p className="text-ink-muted text-xs leading-relaxed mb-6">
                  No payment now. We'll email when pre-orders open with your early-bird price locked in.
                </p>

                <form onSubmit={handleSubmit} className="space-y-3" noValidate>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="
                      w-full px-4 py-2.5 rounded-sm text-xs
                      bg-bg-surface border border-border text-ink
                      placeholder:text-ink-faint
                      focus:border-sage/40 focus:outline-none
                      transition-colors duration-200
                    "
                  />
                  {error && <p className="text-red-400/80 text-xs">{error}</p>}

                  <button
                    type="submit"
                    className="
                      w-full py-2.5 rounded-sm text-xs font-semibold tracking-widest uppercase
                      border border-border text-ink-muted
                      hover:border-sage/40 hover:text-sage
                      transition-all duration-300
                    "
                  >
                    {COPY.ctaPrimary}
                  </button>
                </form>

                <p className="text-ink-faint text-[10px] font-mono mt-4 tracking-widest">
                  {PRICING.shippingNote}
                </p>
              </>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
