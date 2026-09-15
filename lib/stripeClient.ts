import Stripe from 'stripe'

// Server-only. STRIPE_SECRET_KEY must be set in the environment (see
// .env.local.example) -- this throws at first use, not at import time, so
// the rest of the site keeps working before Stripe is configured.
export function getStripe(): Stripe {
  const key = process.env.STRIPE_SECRET_KEY
  if (!key) throw new Error('STRIPE_SECRET_KEY is not set -- see .env.local.example')
  return new Stripe(key)
}
