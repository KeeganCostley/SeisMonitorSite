// Reads copy.md from the project root and parses it into a flat lookup.
// Server-only (uses fs). No caching at module scope on purpose -- every call
// re-reads the file from disk, so an edit + save in copy.md shows up on the
// next request without restarting the dev server or rebuilding.
//
// Format: any line "**Label:** value text" becomes copy['Label'] = 'value text'
// (an optional trailing italic aside like " *(note)*" is stripped -- it's
// instructions for the human editor, not content). See copy.md's own preamble
// for the editing rules.
import fs from 'fs'
import path from 'path'

const COPY_PATH = path.join(process.cwd(), 'copy.md')
const FIELD_RE = /^\*\*([^:*]+):\*\*\s?(.*)$/
const ASIDE_RE = /\s*\*\([^)]*\)\*/g // editor-only notes, anywhere in the line -- stripped from what renders

export function getCopy(): Record<string, string> {
  let text = ''
  try {
    text = fs.readFileSync(COPY_PATH, 'utf-8')
  } catch {
    return {}
  }
  const fields: Record<string, string> = {}
  for (const line of text.split('\n')) {
    const m = FIELD_RE.exec(line.trim())
    if (!m) continue
    const label = m[1].trim()
    const value = m[2].replace(ASIDE_RE, '').replace(/\s+/g, ' ').trim()
    fields[label] = value
  }
  return fields
}

// Safe lookup -- a missing/renamed label degrades to the fallback (or an
// empty string) instead of crashing the page.
export function c(copy: Record<string, string>, label: string, fallback = ''): string {
  return copy[label] ?? fallback
}
