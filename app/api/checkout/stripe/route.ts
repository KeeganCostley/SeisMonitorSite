// Creates a Stripe Checkout Session and hands the client the URL to redirect
// to. Card details are entered on Stripe's own hosted page -- they never
// touch this server, so there's no PCI-compliance burden here.
import { NextRequest, NextResponse } from 'next/server'
import { getStripe } from '@/lib/stripeClient'
import { getProduct } from '@/lib/products'

export async function POST(req: NextRequest) {
  let body: { productId?: string; email?: string }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  const product = getProduct(body.productId ?? '')
  if (!product) return NextResponse.json({ error: 'Unknown product' }, { status: 400 })

  const origin = req.nextUrl.origin
  try {
    const stripe = getStripe()
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: product.currency.toLowerCase(),
            unit_amount: product.amountCents,
            product_data: { name: product.name },
          },
        },
      ],
      customer_email: body.email || undefined,
      // Product id travels in metadata so the webhook knows what was bought
      // without trusting anything the client sent -- the amount/name are
      // re-derived from PRODUCTS server-side too.
      metadata: { productId: product.id },
      success_url: origin + '/order/success?session_id={CHECKOUT_SESSION_ID}',
      cancel_url: origin + '/order/cancelled',
    })
    if (!session.url) return NextResponse.json({ error: 'Stripe did not return a checkout URL' }, { status: 502 })
    return NextResponse.json({ url: session.url })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Stripe checkout failed'
    return NextResponse.json({ error: message }, { status: 502 })
  }
}
