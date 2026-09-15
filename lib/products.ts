// Single source of truth for what's actually for sale -- both checkout routes
// (Stripe and Volley) and the order log read prices from here, so the two
// processors can never drift out of sync with each other or with the copy.md
// price display. Changing a price here does NOT change copy.md's display
// text automatically -- keep the two in sync by hand for now.
export type ProductId = 'prototype-001' | 'diy-kit'

export interface Product {
  id: ProductId
  name: string
  amountCents: number // NZD, smallest unit
  currency: 'NZD'
}

export const PRODUCTS: Record<ProductId, Product> = {
  'prototype-001': { id: 'prototype-001', name: 'Seismonitor -- Prototype 001', amountCents: 7995, currency: 'NZD' },
  'diy-kit': { id: 'diy-kit', name: 'Seismonitor -- DIY Kit', amountCents: 5995, currency: 'NZD' },
}

export function getProduct(id: string): Product | null {
  return id in PRODUCTS ? PRODUCTS[id as ProductId] : null
}

export function formatAmount(cents: number): string {
  return (cents / 100).toFixed(2)
}
