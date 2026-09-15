import { getCopy, c } from '@/lib/copy'

// Dedicated, minimal nav for /update -- kept separate from the landing
// page's Navbar.tsx (the 90s masthead+nav) so this page isn't dragged into
// that redesign. Restyle this alongside Update.html's own overhaul -- see
// design_handoff_seismo_site/README.md, "Page 2" -- that's still open.
export default function UpdateNavbar() {
  const copy = getCopy()
  return (
    <header className="border-b border-border bg-bg">
      <nav className="max-w-site mx-auto px-6 h-14 flex items-center justify-between">
        <a href="/" className="font-heading font-semibold tracking-[0.2em] text-xs uppercase text-ink">
          {c(copy, 'Nav logo', 'Seismonitor')}
        </a>
        <a
          href="/#order"
          className="text-xs tracking-widest uppercase text-ink-muted hover:text-sage transition-colors duration-300"
        >
          {c(copy, 'Nav link', 'Pre-order \u2192')}
        </a>
      </nav>
    </header>
  )
}
