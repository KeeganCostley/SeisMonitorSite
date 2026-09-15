import { getCopy, c } from '@/lib/copy'

// Masthead + nav. Plain text, no sticky header, no JS -- period-accurate.
// Text pulled live from copy.md; hrefs are structural and stay in code.
export default function Navbar() {
  const copy = getCopy()
  return (
    <>
      <div className="top">
        <div className="wm">{c(copy, 'Wordmark', 'SEISMO')}</div>
        <div className="it">{c(copy, 'Tagline')}</div>
        <div className="loc">{c(copy, 'Location line')}</div>
      </div>

      <hr className="d" />

      <div className="nav">
        <a href="#what">{c(copy, 'Nav link 1', 'What it is')}</a><span className="sep">|</span>
        <a href="#order">{c(copy, 'Nav link 2', 'Order')}</a><span className="sep">|</span>
        <a href="#model">{c(copy, 'Nav link 3', 'The model')}</a><span className="sep">|</span>
        <a href="#spec">{c(copy, 'Nav link 4', 'Specifications')}</a><span className="sep">|</span>
        <a href="#pix">{c(copy, 'Nav link 5', 'Gallery')}</a><span className="sep">|</span>
        <a href="/update">{c(copy, 'Nav link 6', 'Firmware')}</a><span className="new">NEW</span>
      </div>
    </>
  )
}
