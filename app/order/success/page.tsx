// Confirms the order server-side against the processor's own API rather
// than just trusting the redirect happened -- matches both Stripe's and
// Volley's own guidance that a redirect is a UX hint, not proof of payment.
import { getStripe } from '@/lib/stripeClient'
import { getPayment } from '@/lib/volleyClient'
import { getProduct } from '@/lib/products'

async function checkStripe(sessionId: string) {
  try {
    const session = await getStripe().checkout.sessions.retrieve(sessionId)
    if (session.payment_status !== 'paid') return null
    return getProduct(session.metadata?.productId ?? '')
  } catch {
    return null
  }
}

async function checkVolley(paymentId: string) {
  try {
    const payment = await getPayment(paymentId)
    if (payment.status !== 'successful') return null
    return getProduct(payment.merchant_identifier ?? '')
  } catch {
    return null
  }
}

export default async function OrderSuccessPage({
  searchParams,
}: {
  searchParams: { session_id?: string; payment_id?: string }
}) {
  const product = searchParams.session_id
    ? await checkStripe(searchParams.session_id)
    : searchParams.payment_id
      ? await checkVolley(searchParams.payment_id)
      : null

  return (
    <div className="seismo-90s">
      <div className="page-col">
        <div className="wrap" style={{ paddingTop: 60, paddingBottom: 60, textAlign: 'center' }}>
          {product ? (
            <>
              <h2 className="hd" style={{ justifyContent: 'center' }}>You&apos;re in.</h2>
              <p>
                Payment confirmed for <b>{product.name}</b>. I&apos;ll email you when there&apos;s
                something to tell you -- there&apos;s nothing more to do right now.
              </p>
            </>
          ) : (
            <>
              <h2 className="hd" style={{ justifyContent: 'center' }}>Still checking&hellip;</h2>
              <p className="note">
                Your payment redirected here, but I couldn&apos;t confirm it went through yet.
                If money left your account, don&apos;t worry -- it&apos;s logged the moment the
                processor confirms it, usually within a minute. Refresh this page, or email if
                you&apos;re still unsure.
              </p>
            </>
          )}
          <p style={{ marginTop: 24 }}><a href="/">&larr; Back to the site</a></p>
        </div>
      </div>
    </div>
  )
}
