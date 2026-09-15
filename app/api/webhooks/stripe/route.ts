// Stripe calls this after a checkout completes -- this is the source of
// truth for "did the customer actually pay," not the success_url redirect
// (a customer can close the tab before the redirect fires, or the redirect
// itself is just a browser navigation with no proof behind it).
//
// Configure this URL in the Stripe Dashboard -> Developers -> Webhooks as
// https://<your-domain>/api/webhooks/stripe, subscribed to
// checkout.session.completed. STRIPE_WEBHOOK_SECRET below comes from that
// same dashboard page once the endpoint exists.
import { NextRequest, NextResponse } from 'next/server'
import { getStripe } from '@/lib/stripeClient'
import { getProduct } from '@/lib/products'
import { recordOrder } from '@/lib/orders/log'
import type Stripe from 'stripe'

export async function POST(req: NextRequest) {
  const signature = req.headers.get('stripe-signature')
  const secret = process.env.STRIPE_WEBHOOK_SECRET
  if (!signature || !secret) {
    return NextResponse.json({ error: 'Webhook not configured' }, { status: 500 })
  }

  const rawBody = await req.text() // must be the raw, unparsed body for signature verification
  let event: Stripe.Event
  try {
    event = getStripe().webhooks.constructEvent(rawBody, signature, secret)
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Invalid signature'
    return NextResponse.json({ error: message }, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session
    const productId = session.metadata?.productId
    const product = productId ? getProduct(productId) : null
    if (product && session.payment_status === 'paid') {
      recordOrder({
        processor: 'stripe',
        processorPaymentId: session.id,
        productId: product.id,
        productName: product.name,
        amountCents: product.amountCents,
        currency: product.currency,
        customerEmail: session.customer_details?.email ?? session.customer_email ?? null,
        paidAt: new Date().toISOString(),
      })
    }
  }

  return NextResponse.json({ received: true })
}
