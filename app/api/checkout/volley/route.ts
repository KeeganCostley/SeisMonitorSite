// Creates a Volley "payment request" and hands the client the hosted-page
// URL to redirect to -- Volley handles bank selection, the redirect into
// the customer's own banking app, and approval from there. See
// lib/volleyClient.ts and https://developers.volley.nz/docs/payment-requests.
import { NextRequest, NextResponse } from 'next/server'
import { createPaymentRequest } from '@/lib/volleyClient'
import { getProduct } from '@/lib/products'

export async function POST(req: NextRequest) {
  let body: { productId?: string }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  const product = getProduct(body.productId ?? '')
  if (!product) return NextResponse.json({ error: 'Unknown product' }, { status: 400 })

  const origin = req.nextUrl.origin
  try {
    const request = await createPaymentRequest({
      amountCents: product.amountCents,
      currency: product.currency,
      message: product.name,
      merchantIdentifier: product.id,
      successRedirectUrl: origin + '/order/success', // Volley appends ?payment_id=...&merchant_identifier=... itself
      failureRedirectUrl: origin + '/order/cancelled',
    })
    return NextResponse.json({ url: request.url })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Volley checkout failed'
    return NextResponse.json({ error: message }, { status: 502 })
  }
}
