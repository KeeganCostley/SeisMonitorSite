import VisitorCounter from './VisitorCounter'
import { getCopy, c } from '@/lib/copy'
import { linkifyWord } from '@/lib/renderInline'

// "LAST UPDATED" is computed at render/build time, not hardcoded.
function formatDate(d: Date) {
  const day = d.getDate()
  const month = d.toLocaleString('en-NZ', { month: 'long' }).toUpperCase()
  return `${day} ${month} ${d.getFullYear()}`
}

export default function Footer() {
  const copy = getCopy()
  const year = new Date().getFullYear()
  const credits = c(copy, 'Credits line')
  const [before, geonetLink, rest] = linkifyWord(credits, 'GeoNet', 'https://www.geonet.org.nz/')
  const restParts = typeof rest === 'string' ? linkifyWord(rest, 'USGS', 'https://earthquake.usgs.gov/') : [rest]

  return (
    <div className="foot">
      {before}{geonetLink}{restParts}<br />
      {c(copy, 'Disclaimer line')}<br />
      <span style={{ display: 'inline-block', marginTop: 7 }}>
        {c(copy, 'Visitors label', 'Visitors')} <VisitorCounter />
      </span><br />
      <span className="mono" style={{ fontSize: 10, letterSpacing: '0.12em' }}>
        {c(copy, 'Last updated line', 'LAST UPDATED')} {formatDate(new Date())}
      </span><br />
      <span className="bv">
        {c(copy, 'Closing line -- before year')} {year} {c(copy, 'Closing line -- after year')}
      </span>
    </div>
  )
}
