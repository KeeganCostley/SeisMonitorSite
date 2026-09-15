import { getCopy, c } from '@/lib/copy'

// #what -- plain serif prose, no heading.
// "Main paragraph" comes from copy.md as one string; the GeoNet/USGS links
// are structural (their href is fixed in code) but wrap whichever words the
// edited text actually contains -- if you rename or remove "GeoNet"/"USGS"
// the sentence still renders fine, just without that particular link.
function linkify(text: string, word: string, href: string) {
  const i = text.indexOf(word)
  if (i < 0) return [text]
  return [
    text.slice(0, i),
    <a key={word} href={href} target="_blank" rel="noopener noreferrer">{word}</a>,
    text.slice(i + word.length),
  ]
}

export default function WhatItIs() {
  const copy = getCopy()
  const paragraph = c(copy, 'Main paragraph')
  const [before, geonetLink, rest] = linkify(paragraph, 'GeoNet', 'https://www.geonet.org.nz/')
  const restParts = typeof rest === 'string' ? linkify(rest, 'USGS', 'https://earthquake.usgs.gov/') : [rest]

  return (
    <div className="wrap" id="what">
      <p>
        {before}{geonetLink}{restParts}
        <br />
        <span style={{ color: 'var(--ink-2)', fontSize: 13, fontStyle: 'italic' }}>
          {c(copy, 'Italic line under it')}
        </span>
      </p>
    </div>
  )
}
