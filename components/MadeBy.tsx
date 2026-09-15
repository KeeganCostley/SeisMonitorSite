import { getCopy, c } from '@/lib/copy'

// 05 Made by -- a list of lines, not a card grid. Order is deliberate.
const COUNT = 5

export default function MadeBy() {
  const copy = getCopy()
  const credits = Array.from({ length: COUNT }, (_, i) => ({
    name: c(copy, 'Credit ' + (i + 1) + ' name'),
    role: c(copy, 'Credit ' + (i + 1) + ' role'),
  })).filter((p) => p.name)

  return (
    <div className="wrap">
      <h2 className="hd"><span className="n">04</span>{c(copy, 'Made by -- Section heading', 'Made by')}</h2>
      <div className="sublab">{c(copy, 'Made by -- Section sublabel')}</div>

      <div className="madeby">
        {credits.map((p, i) => (
          <span key={p.name}>
            <b>{p.name}</b> <span className="r">&#183; {p.role}</span>
            {i < credits.length - 1 && <br />}
          </span>
        ))}
      </div>
    </div>
  )
}
