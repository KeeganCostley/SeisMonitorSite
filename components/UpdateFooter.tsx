import { getCopy, c } from '@/lib/copy'

// Dedicated footer for /update -- see UpdateNavbar.tsx for why this isn't
// sharing the landing page's Footer.tsx.
export default function UpdateFooter() {
  const copy = getCopy()
  const year = new Date().getFullYear()
  return (
    <footer className="border-t border-border bg-bg">
      <div className="max-w-site mx-auto px-6 py-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <span className="font-heading font-semibold tracking-[0.2em] text-xs uppercase text-ink-muted">
          {c(copy, 'Footer wordmark', 'Seismonitor')}
        </span>
        <p className="text-ink-faint text-[10px] font-mono">
          &#169; {year} &#183; {c(copy, 'Footer line -- after year', 'Made in Aotearoa New Zealand · Data: GeoNet / USGS')}
        </p>
      </div>
    </footer>
  )
}
