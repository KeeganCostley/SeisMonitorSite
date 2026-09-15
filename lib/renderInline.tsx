import type { ReactNode } from 'react'

// Converts "**bold**" segments in a copy.md value into <b> tags -- the only
// inline markup copy.md values are allowed to use. Plain strings with no
// "**" pass through unchanged.
export function renderInline(text: string): ReactNode[] {
  const parts = text.split(/(\*\*[^*]+\*\*)/g)
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <b key={i} style={{ fontWeight: 700 }}>{part.slice(2, -2)}</b>
    }
    return part ? <span key={i}>{part}</span> : null
  })
}

// Splits text around the first occurrence of `word`, wrapping it in a link.
// Used for lines whose href is fixed in code but whose surrounding words
// (and the linked word itself) still come from copy.md -- if the word isn't
// found (renamed/removed), the text still renders, just without that link.
export function linkifyWord(text: string, word: string, href: string): ReactNode[] {
  const i = text.indexOf(word)
  if (i < 0) return [text]
  return [
    text.slice(0, i),
    <a key={word} href={href} target="_blank" rel="noopener noreferrer">{word}</a>,
    text.slice(i + word.length),
  ]
}
