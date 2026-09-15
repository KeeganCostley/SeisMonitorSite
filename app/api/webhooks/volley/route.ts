// Volley calls this when a payment's status changes -- this, not the
// redirect back to /order/success, is the source of truth (Volley's own
// docs say so explicitly). Configure the endpoint URL at
// https://dashboard.volley.nz/webhooks -> https://<your-domain>/api/webhooks/volley,
// subscribed to payment.status_updated. VOLLEY_WEBHOOK_SECRET comes from
// that same page (shown once, at creation time).
//
// NOTE: Volley's public docs describe the *event types* (payment.status_updated,
// data.status one of successful/cancelled/failed/unconfirmed) but not the
// full webhook body schema field-by-field. Rather than guess at exactly
// which field holds the payment id, this reads it from whichever of a few
// plausible locations is present, then re-fetches the payment from the API
// as the actual source of truth for everything else (amount, email,
// status) -- so a wrong guess here just means a missed webhook, not a bad
// order record. Confirm the real shape against a sandbox test delivery
// (Volley's dashboard can show recent deliveries) and simplify this once
// you've seen one for real.
import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { getPayment } from '@/lib/volleyClient'
import { getProduct } from '@/lib/products'
import { recordOrder } from '@/lib/orders/log'

function verifySignature(rawBody: string, header: string | null, secretBase64: string): boolean {
  if (!header) return false
  const expected = header.startsWith('sha256=') ? header.slice(7) : header
  const key = Buffer.from(secretBase64, 'base64')
  const calculated = crypto.createHmac('sha256', key).update(rawBody, 'utf8').digest('hex')
  const a = Buffer.from(calculated)
  const b = Buffer.from(expected)
  return a.length === b.length && crypto.timingSafeEqual(a, b)
}

function extractPaymentId(data: unknown): string | null {
  if (!data || typeof data !== 'object') return null
  const d = data as Record<string, unknown>
  const candidates = [d.id, d.payment_id, (d.object as Record<string, unknown> | undefined)?.id]
  const found = candidates.find((v) => typeof v === 'string')
  return (found as string) ?? null
}

export async function POST(req: NextRequest) {
  const secret = process.env.VOLLEY_WEBHOOK_SECRET
  if (!secret) return NextResponse.json({ error: 'Webhook not configured' }, { status: 500 })

  const rawBody = await req.text()
  const signature = req.headers.get('x-volley-signature')
  if (!verifySignature(rawBody, signature, secret)) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  let event: { type?: string; data?: unknown }
  try {
    event = JSON.parse(rawBody)
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  if (event.type === 'payment.status_updated') {
    const paymentId = extractPaymentId(event.data)
    if (paymentId) {
      try {
        const payment = await getPayment(paymentId)
        const product = payment.merchant_identifier ? getProduct(payment.merchant_identifier) : null
        if (product && payment.status === 'successful') {
          recordOrder({
            processor: 'volley',
            processorPaymentId: payment.id,
            productId: product.id,
            productName: product.name,
            amountCents: product.amountCents,
            currency: product.currency,
            customerEmail: payment.cust_info?.email ?? null,
            paidAt: new Date().toISOString(),
          })
        }
      } catch {
        // A failed lookup here just means this delivery didn't record an
        // order -- Volley retries the webhook, so a transient API error
        // self-heals on the next attempt.
      }
    }
  }

  return NextResponse.json({ received: true })
}
