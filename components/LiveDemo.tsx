import { getCopy, c } from '@/lib/copy'
import LiveDemoClient from './LiveDemoClient'

export default function LiveDemo() {
  const copy = getCopy()
  return (
    <div className="wrap" id="model">
      <LiveDemoClient
        copy={{
          captionTemplate: c(copy, 'Caption below the model'),
          alertLink: c(copy, 'Alert-trigger link (part of the caption above)', 'Show me an alert.'),
          caveat: c(copy, 'Caveat line'),
          downloadLabel: c(copy, 'Download button', '\u2193 STL'),
          hint: c(copy, 'Hint strip (bottom of the frame)'),
        }}
      />
    </div>
  )
}
