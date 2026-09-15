'use client'

import { useEffect, useState } from 'react'

// A per-browser localStorage count, not a real metric -- the design handoff
// leaves this as an open question (real counter vs. "a knowing period
// joke"); kept as the joke for now, exactly as specified.
const BASE = 1487

export default function VisitorCounter() {
  const [count, setCount] = useState<string | null>(null)

  useEffect(() => {
    const KEY = 'seismonitor.hits'
    let n = 0
    try {
      n = (parseInt(localStorage.getItem(KEY) || '0', 10) || 0) + 1
      localStorage.setItem(KEY, String(n))
    } catch {
      n = 1
    }
    setCount(String(BASE + n).padStart(5, '0'))
  }, [])

  return <span className="counter">{count ?? '00000'}</span>
}
