'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { VARIANTS } from '@/constants/design'

// ─── WEB FLASHER ──────────────────────────────────────────────────────────────
// Flashes the latest firmware onto a SeisMonitor over USB, straight from the
// browser (Web Serial + esp-web-tools). Chrome / Edge on desktop only —
// Web Serial doesn't exist in Safari, Firefox, or any mobile browser.
// Firmware binary + manifest live in public/firmware/.
// ──────────────────────────────────────────────────────────────────────────────

const MANIFEST_URL = '/firmware/manifest.json'

interface FirmwareManifest {
  name: string
  version: string
  release_date?: string
  notes?: string[]
}

const STEPS = [
  {
    title: 'Plug it in',
    body: 'Connect your SeisMonitor to this computer with a USB-C cable. It must be a data cable — some charge-only cables look identical but won’t show up.',
  },
  {
    title: 'Connect',
    body: 'Click the update button and pick your device from the port list — it appears as a USB / COM serial port. Close anything else using the port first (Arduino IDE, serial monitors).',
  },
  {
    title: 'Wait for the reboot',
    body: 'Flashing takes about a minute. Keep the cable in. When it finishes, your SeisMonitor restarts itself on the new firmware — the version shows on the boot screen.',
  },
]

export default function FlashTool() {
  const [manifest, setManifest] = useState<FirmwareManifest | null>(null)
  const [supported, setSupported] = useState<boolean | null>(null)
  const [flasherReady, setFlasherReady] = useState(false)

  useEffect(() => {
    const ok = typeof navigator !== 'undefined' && 'serial' in navigator
    setSupported(ok)

    fetch(MANIFEST_URL)
      .then(r => (r.ok ? r.json() : null))
      .then(setManifest)
      .catch(() => setManifest(null))

    if (ok) {
      // Registers the <esp-web-install-button> custom element (browser-only).
      // Note: the pre-bundled build — the package's main entry needs @material/web
      // internals that webpack can't resolve.
      import('esp-web-tools/dist/web/install-button.js')
        .then(() => setFlasherReady(true))
        .catch(() => setSupported(false))
    }
  }, [])

  const version = manifest ? `v${manifest.version}` : null

  return (
    <section className="relative py-24 bg-bg min-h-screen">
      <div className="max-w-site mx-auto px-6">

        <motion.p
          variants={VARIANTS.fadeUp}
          initial="hidden"
          animate="show"
          className="font-mono text-[10px] tracking-widest uppercase text-ink-muted mb-12 pt-14"
        >
          Firmware
        </motion.p>

        <motion.div
          variants={VARIANTS.staggerContainer}
          initial="hidden"
          animate="show"
          className="grid md:grid-cols-2 gap-16 max-w-4xl"
        >

          {/* Left: what + how */}
          <motion.div variants={VARIANTS.fadeUp}>
            <h1 className="font-heading font-semibold text-ink text-3xl mb-3">
              Update your SeisMonitor.
            </h1>
            <p className="text-ink-muted text-sm leading-relaxed mb-10">
              New firmware ships regularly — better data, better maps, better alerts.
              Updating happens right here in the browser: plug your device into this
              computer, press the button, and it flashes itself. Nothing to install.
            </p>

            <ol className="space-y-6">
              {STEPS.map((step, i) => (
                <li key={step.title} className="flex gap-4">
                  <span className="font-mono text-[10px] text-sage pt-0.5 shrink-0">
                    0{i + 1}
                  </span>
                  <div>
                    <p className="text-ink text-sm font-semibold mb-1">{step.title}</p>
                    <p className="text-ink-muted text-xs leading-relaxed">{step.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </motion.div>

          {/* Right: latest release + the button */}
          <motion.div variants={VARIANTS.fadeUp} className="flex flex-col justify-start">
            <div className="rounded-sm border border-border bg-bg-surface p-6 shadow-card">

              <div className="flex items-baseline justify-between mb-1">
                <p className="text-[10px] font-mono tracking-widest uppercase text-ink-muted">
                  Latest release
                </p>
                {manifest?.release_date && (
                  <p className="text-[10px] font-mono text-ink-faint">
                    {manifest.release_date}
                  </p>
                )}
              </div>

              <p className="font-heading font-semibold text-ink text-2xl mb-5">
                {version ?? '—'}
              </p>

              {manifest?.notes && manifest.notes.length > 0 && (
                <ul className="space-y-1.5 mb-8">
                  {manifest.notes.map(note => (
                    <li key={note} className="flex gap-2.5 text-xs text-ink-muted leading-relaxed">
                      <span className="w-1 h-1 rounded-full bg-sage opacity-60 mt-1.5 shrink-0" />
                      {note}
                    </li>
                  ))}
                </ul>
              )}

              {/* The flasher itself */}
              {supported === false && (
                <div className="rounded-sm border border-border px-4 py-3">
                  <p className="text-xs text-ink-muted leading-relaxed">
                    This browser can&apos;t talk to USB devices. Open this page in{' '}
                    <span className="text-ink">Chrome</span> or{' '}
                    <span className="text-ink">Edge</span> on a computer — phones and
                    tablets can&apos;t flash firmware.
                  </p>
                </div>
              )}

              {supported && flasherReady && (
                <esp-web-install-button manifest={MANIFEST_URL}>
                  <button
                    slot="activate"
                    className="
                      w-full py-2.5 rounded-sm text-xs font-semibold tracking-widest uppercase
                      border border-sage/40 text-sage
                      hover:bg-sage-faint hover:border-sage/60
                      transition-all duration-300
                    "
                  >
                    Update firmware {version && `→ ${version}`}
                  </button>
                  <span slot="unsupported" className="text-xs text-ink-muted">
                    This browser doesn&apos;t support Web Serial.
                  </span>
                  <span slot="not-allowed" className="text-xs text-ink-muted">
                    Serial access is blocked — this page needs to be served over HTTPS.
                  </span>
                </esp-web-install-button>
              )}

              {supported && !flasherReady && (
                <div className="w-full py-2.5 rounded-sm text-xs text-center font-semibold tracking-widest uppercase border border-border text-ink-faint">
                  Loading flasher…
                </div>
              )}

              <p className="text-ink-faint text-[10px] leading-relaxed mt-4">
                Your settings — region, alert sensitivity — are kept. Choosing{' '}
                <span className="font-mono">Erase device</span> in the dialog wipes them
                back to defaults.
              </p>
            </div>

            <p className="text-ink-faint text-[10px] leading-relaxed mt-4 px-1">
              Trouble? If no port shows up, try another cable or USB socket. If the
              flash fails partway, just unplug, replug, and run it again — it can&apos;t
              brick the device.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
