// Thin wrapper around Volley's REST API (https://developers.volley.nz).
// No official Node SDK exists -- their own docs use plain fetch() -- so this
// is the whole client. Server-only; VOLLEY_API_KEY must never reach the
// browser (see .env.local.example).
const VOLLEY_BASE = 'https://api.volley.nz/v1'

function requireEnv(name: string): string {
  const v = process.env[name]
  if (!v) throw new Error(name + ' is not set -- see .env.local.example')
  return v
}

export interface VolleyPaymentRequest {
  id: string
  url: string // hosted page to redirect the customer to
  status: string
}

export async function createPaymentRequest(opts: {
  amountCents: number
  currency: string
  message: string
  merchantIdentifier: string // we store the productId here for the webhook to read back
  successRedirectUrl: string
  failureRedirectUrl: string
}): Promise<VolleyPaymentRequest> {
  const apiKey = requireEnv('VOLLEY_API_KEY')
  const bankAccountId = requireEnv('VOLLEY_BANK_ACCOUNT_ID')
  const amount = (opts.amountCents / 100).toFixed(2) + ' ' + opts.currency

  const res = await fetch(VOLLEY_BASE + '/requests', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + apiKey },
    body: JSON.stringify({
      bank_account_id: bankAccountId,
      amount,
      message: opts.message.slice(0, 60), // the stricter of the two limits Volley's docs give
      type: 'single',
      merchant_identifier: opts.merchantIdentifier,
      success_redirect_url: opts.successRedirectUrl,
      failure_redirect_url: opts.failureRedirectUrl,
    }),
  })
  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error('Volley request creation failed (' + res.status + '): ' + text)
  }
  const json = (await res.json()) as { request: VolleyPaymentRequest }
  return json.request
}

export interface VolleyPayment {
  id: string
  request_id: string
  amount: { value: string; formatted: string }
  status: 'awaiting-consent' | 'successful' | 'cancelled' | 'failed' | 'unconfirmed' | string
  merchant_identifier: string | null
  cust_info?: { email?: string; first_name?: string; last_name?: string; phone?: string }
  provider?: string
  is_test_mode: boolean
}

// Webhook payloads are treated as a hint only (per Volley's own docs) -- this
// re-fetches the authoritative payment record before an order is logged.
export async function getPayment(paymentId: string): Promise<VolleyPayment> {
  const apiKey = requireEnv('VOLLEY_API_KEY')
  const res = await fetch(VOLLEY_BASE + '/payments/' + encodeURIComponent(paymentId), {
    headers: { Authorization: 'Bearer ' + apiKey },
  })
  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error('Volley payment lookup failed (' + res.status + '): ' + text)
  }
  const json = (await res.json()) as { payment: VolleyPayment }
  return json.payment
}
