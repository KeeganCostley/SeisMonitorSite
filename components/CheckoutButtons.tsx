'use client'

import { useState } from 'react'
import type { ProductId } from '@/lib/products'

// Real checkout -- redirects to Stripe's or Volley's own hosted payment
// page (card details / bank approval happen there, never on this site).
// Replaces the old email-capture mock for the two priced tiers; the
// "coming next" pre-order teaser still uses OrderForm.tsx (no price yet).
export default function CheckoutButtons({ productId }: { productId: ProductId }) {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState<'stripe' | 'volley' | null>(null)
  const [error, setError] = useState('')

  async function pay(processor: 'stripe' | 'volley') {
    setError('')
    setLoading(processor)
    try {
      const res = await fetch('/api/checkout/' + processor, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, email: email.trim() || undefined }),
      })
      const data = await res.json()
      if (!res.ok || !data.url) throw new Error(data.error || 'Checkout could not start')
      window.location.href = data.url
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Checkout could not start')
      setLoading(null)
    }
  }

  return (
    <>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@example.com (optional)"
      />
      <div style={{ display: 'flex', gap: 8, marginTop: 8, flexWrap: 'wrap' }}>
        <button className="go" onClick={() => pay('stripe')} disabled={loading !== null}>
          {loading === 'stripe' ? 'Redirecting\u2026' : 'Pay by card'}
        </button>
        <button
          className="go"
          onClick={() => pay('volley')}
          disabled={loading !== null}
          style={{ background: 'transparent', color: 'var(--grn)', borderColor: 'var(--grn)' }}
        >
          {loading === 'volley' ? 'Redirecting\u2026' : 'Pay by bank (lower fees)'}
        </button>
      </div>
      {error && <p className="note" style={{ color: 'var(--amb)', marginTop: 6 }}>{error}</p>}
    </>
  )
}
