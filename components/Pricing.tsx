import { getCopy, c } from '@/lib/copy'
import { renderInline, linkifyWord } from '@/lib/renderInline'
import OrderForm from './OrderForm'
import CheckoutButtons from './CheckoutButtons'

export default function Pricing() {
  const copy = getCopy()
  const diyLine2 = c(copy, 'Tier 2 -- DIY Kit -- "Then what" text, line 2')
  const diyLine2Parts = linkifyWord(diyLine2, 'the firmware page', '/update')

  return (
    <div className="wrap" id="order">
      <h2 className="hd"><span className="n">01</span>{c(copy, 'Order -- Section heading', 'Order')}</h2>
      <div className="sublab">{c(copy, 'Order -- Section sublabel')}</div>

      <div style={{
        fontFamily: "'Courier New',monospace", fontSize: 11, letterSpacing: '0.14em',
        textTransform: 'uppercase', color: 'var(--grn-d)', marginBottom: 6,
      }}>
        {c(copy, 'Tier 1 -- Assembled -- Tier label')}
      </div>
      <table className="ord">
        <tbody>
          <tr>
            <td className="k">Price</td>
            <td>
              <span className="amt">{c(copy, 'Tier 1 -- Assembled -- Price')}<small>NZD</small>
                <span className="was">{c(copy, 'Tier 1 -- Assembled -- Price tag')}</span>
              </span>
            </td>
          </tr>
          <tr>
            <td className="k">Your email</td>
            <td><CheckoutButtons productId="prototype-001" /></td>
          </tr>
          <tr>
            <td className="k">Then what</td>
            <td className="fineprint">
              {c(copy, 'Tier 1 -- Assembled -- "Then what" text, line 1')}<br />
              {c(copy, 'Tier 1 -- Assembled -- "Then what" text, line 2')}<br />
              {renderInline(c(copy, 'Tier 1 -- Assembled -- "Then what" text, line 3'))}
            </td>
          </tr>
        </tbody>
      </table>

      <p className="note" style={{ marginTop: 16 }}>
        {c(copy, 'Transition line between the two tiers')}
      </p>

      <div style={{
        fontFamily: "'Courier New',monospace", fontSize: 11, letterSpacing: '0.14em',
        textTransform: 'uppercase', color: 'var(--grn-d)', marginBottom: 6, marginTop: 18,
      }}>
        {c(copy, 'Tier 2 -- DIY Kit -- Tier label')}
      </div>
      <table className="ord">
        <tbody>
          <tr>
            <td className="k">Price</td>
            <td>
              <span className="amt">{c(copy, 'Tier 2 -- DIY Kit -- Price')}<small>NZD</small>
                <span className="was">{c(copy, 'Tier 2 -- DIY Kit -- Price tag')}</span>
              </span>
            </td>
          </tr>
          <tr>
            <td className="k">Your email</td>
            <td><CheckoutButtons productId="diy-kit" /></td>
          </tr>
          <tr>
            <td className="k">Then what</td>
            <td className="fineprint">
              {c(copy, 'Tier 2 -- DIY Kit -- "Then what" text, line 1')}<br />
              {diyLine2Parts}<br />
              {c(copy, 'Tier 2 -- DIY Kit -- "Then what" text, line 3')}
            </td>
          </tr>
        </tbody>
      </table>

      <div style={{ marginTop: 40, paddingTop: 24, borderTop: '1px solid var(--rule)' }}>
        <div className="sublab">{c(copy, 'Coming next -- Label')}</div>
        <p style={{ color: 'var(--ink-2)' }}>
          {renderInline(c(copy, 'Coming next -- Paragraph'))}
        </p>
        <OrderForm buttonLabel={c(copy, 'Coming next -- Button', 'Keep me posted')} />
      </div>
    </div>
  )
}
