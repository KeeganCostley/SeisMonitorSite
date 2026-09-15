'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

const NAV_LINKS = [
  { label: 'Live demo', href: '/#demo'     },
  { label: 'Features',  href: '/#features' },
  { label: 'Gallery',   href: '/#gallery'  },
  { label: 'Pricing',   href: '/#pricing'  },
  { label: 'About',     href: '/#about'    },
  { label: 'Update',    href: '/update'    },
]

export default function Navbar() {
  const [scrolled,  setScrolled]  = useState(false)
  const [menuOpen,  setMenuOpen]  = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <motion.header
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, delay: 0.2 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? 'bg-bg/75 backdrop-blur-sm border-b border-border' : 'bg-transparent'
      }`}
    >
      <nav className="max-w-site mx-auto px-6 h-14 flex items-center justify-between">

        {/* Logo — plain, no flash */}
        <a href="/" className="font-heading font-semibold tracking-[0.2em] text-xs uppercase text-ink">
          Seismonitor
        </a>

        {/* Desktop links */}
        <ul className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map(({ label, href }) => (
            <li key={href}>
              <a
                href={href}
                className="text-xs text-ink-muted hover:text-ink transition-colors duration-300 tracking-widest uppercase"
              >
                {label}
              </a>
            </li>
          ))}
        </ul>

        {/* CTA — understated */}
        <div className="hidden md:block">
          <a
            href="/#pricing"
            className="text-xs tracking-widest uppercase text-ink-muted hover:text-sage transition-colors duration-300"
          >
            Waitlist →
          </a>
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden flex flex-col gap-1.5 p-1"
          onClick={() => setMenuOpen(v => !v)}
          aria-label="Toggle menu"
        >
          <span className={`block h-px w-5 bg-ink-muted transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-[7px]' : ''}`} />
          <span className={`block h-px w-5 bg-ink-muted transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`} />
          <span className={`block h-px w-5 bg-ink-muted transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-[7px]' : ''}`} />
        </button>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="md:hidden bg-bg/95 backdrop-blur-sm border-b border-border px-6 pb-6"
        >
          <ul className="flex flex-col gap-5 pt-5">
            {NAV_LINKS.map(({ label, href }) => (
              <li key={href}>
                <a
                  href={href}
                  onClick={() => setMenuOpen(false)}
                  className="text-xs tracking-widest uppercase text-ink-muted hover:text-ink transition-colors"
                >
                  {label}
                </a>
              </li>
            ))}
            <li>
              <a
                href="/#pricing"
                onClick={() => setMenuOpen(false)}
                className="text-xs tracking-widest uppercase text-sage"
              >
                Waitlist →
              </a>
            </li>
          </ul>
        </motion.div>
      )}
    </motion.header>
  )
}
