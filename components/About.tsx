import { getCopy, c } from '@/lib/copy'

// #spec -- Specifications table. Rows come from copy.md's "Spec -- X" fields;
// the Firmware row's link stays structural (href fixed in code).
const SPEC_LABELS = ['Processor', 'Screen', 'Network', 'Data from', 'Body', 'Power', 'Firmware', 'Weight']

export default function About() {
  const copy = getCopy()
  return (
    <div className="wrap" id="spec">
      <h2 className="hd"><span className="n">02</span>{c(copy, 'Specifications -- Section heading', 'Specifications')}</h2>
      <div className="sublab">{c(copy, 'Specifications -- Section sublabel')}</div>

      <table className="spec">
        <tbody>
          {SPEC_LABELS.map((label) => (
            <tr key={label}>
              <td className="l">{label}</td>
              <td className="v">
                {label === 'Firmware'
                  ? <>{c(copy, 'Spec -- Firmware', 'C++')}, and you can <a href="/update">reflash it here</a></>
                  : c(copy, 'Spec -- ' + label)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
