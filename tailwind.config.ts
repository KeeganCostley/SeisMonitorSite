import type { Config } from 'tailwindcss'

// ─── DESIGN SYSTEM ────────────────────────────────────────────────────────────
// Adjust colours here (and in constants/design.ts) to retheme the whole site.
// ──────────────────────────────────────────────────────────────────────────────

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // ── Colours ────────────────────────────────────────────────────────────
      colors: {
        bg: {
          DEFAULT: '#0e0e0b',  // warm near-black — earthy, not blue
          surface: '#161612',
          raised:  '#1e1e19',
        },
        border: {
          DEFAULT: 'rgba(255,255,255,0.055)',
          soft:    'rgba(255,255,255,0.035)',
        },
        sage: {
          DEFAULT: '#8aaa8e',  // muted sage — UI accent
          dim:     '#6a8a6e',
          vivid:   '#5aaf78',  // seismograph trace only
          faint:   'rgba(138,170,142,0.1)',
        },
        ink: {
          DEFAULT: '#c8c3b2',  // warm off-white
          muted:   '#6a6658',
          faint:   '#3d3c36',
        },
      },

      // ── Typography ─────────────────────────────────────────────────────────
      fontFamily: {
        heading: ['var(--font-space-grotesk)', 'system-ui', 'sans-serif'],
        body:    ['var(--font-inter)',          'system-ui', 'sans-serif'],
        mono:    ['var(--font-jetbrains-mono)', 'monospace'],
      },

      // ── Layout ─────────────────────────────────────────────────────────────
      maxWidth: {
        site: '1160px',
      },

      // ── Shadows — no glows, just depth ─────────────────────────────────────
      boxShadow: {
        card:   '0 1px 3px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.05)',
        'card-hover': '0 4px 12px rgba(0,0,0,0.4), 0 0 0 1px rgba(138,170,142,0.15)',
      },

      // ── Animations ─────────────────────────────────────────────────────────
      keyframes: {
        'fade-up': {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-up':    'fade-up 0.7s cubic-bezier(0.25,0.1,0.25,1) both',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4,0,0.6,1) infinite',
      },
    },
  },
  plugins: [],
}

export default config
