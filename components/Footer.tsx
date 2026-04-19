export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-border bg-bg">
      <div className="max-w-site mx-auto px-6 py-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <span className="font-heading font-semibold tracking-[0.2em] text-xs uppercase text-ink-muted">
          Seismonitor
        </span>
        <p className="text-ink-faint text-[10px] font-mono">
          © {year} · Made in Aotearoa New Zealand · Data: GeoNet / USGS
        </p>
      </div>
    </footer>
  )
}
