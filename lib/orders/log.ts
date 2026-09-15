// A confirmed-sales record -- append-only JSON file, not a database. That's
// a deliberate choice for a first batch sold in low volume: it's zero extra
// accounts/services to set up, human-readable, and both Stripe's and
// Volley's own dashboards remain the authoritative record of the actual
// payment. This file is a convenience log so you can see every order in one
// place without switching between two dashboards.
//
// Only written to from the two webhook handlers, and only on a *confirmed*
// payment -- never on checkout start, so it can't fill up with abandoned
// checkouts. Revisit this (real database) if/when order volume makes a flat
// file awkward.
import fs from 'fs'
import path from 'path'
import type { ProductId } from '../products'

const ORDERS_PATH = path.join(process.cwd(), 'data', 'orders.json')

export interface Order {
  processor: 'stripe' | 'volley'
  processorPaymentId: string
  productId: ProductId
  productName: string
  amountCents: number
  currency: string
  customerEmail: string | null
  paidAt: string // ISO
}

function readAll(): Order[] {
  try {
    const raw = fs.readFileSync(ORDERS_PATH, 'utf-8')
    return JSON.parse(raw) as Order[]
  } catch {
    return []
  }
}

// Idempotent -- webhooks can and will redeliver the same event, so this
// no-ops if processorPaymentId is already recorded rather than double-logging.
export function recordOrder(order: Order): void {
  const orders = readAll()
  if (orders.some((o) => o.processorPaymentId === order.processorPaymentId)) return
  orders.push(order)
  fs.mkdirSync(path.dirname(ORDERS_PATH), { recursive: true })
  fs.writeFileSync(ORDERS_PATH, JSON.stringify(orders, null, 2))
}

export function getAllOrders(): Order[] {
  return readAll()
}
