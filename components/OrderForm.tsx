'use client'

import { useState } from 'react'

function isValidEmail(v: string) {
  return v.indexOf('@') >= 1 && v.indexOf('.') >= 0
}

// Exact mock interaction from the design handoff: invalid shows "That
// email?" for 1600ms then reverts; valid disables the button and swaps its
// colours. Kept as a mock on purpose -- wiring a real backend, and real
// payment collection, are still open questions (see
// design_handoff_seismo_site/README.md). The copy reads as a real order;
// the mechanism underneath is still just an email capture for now.
export default function OrderForm({ buttonLabel = 'Order' }: { buttonLabel?: string }) {
  const [email, setEmail] = useState('')
  const [label, setLabel] = useState(buttonLabel)
  const [state, setState] = useState<'idle' | 'invalid' | 'done'>('idle')

  function handleClick() {
    if (state === 'done') return
    if (!isValidEmail(email.trim())) {
      setState('invalid')
      setLabel('That email?')
      setTimeout(() => {
        setState('idle')
        setLabel(buttonLabel)
      }, 1600)
      return
    }
    setState('done')
    setLabel('Got you \u2014 thanks')
  }

  return (
    <>
      <input
        type="email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        placeholder="you@example.com"
        disabled={state === 'done'}
      />
      <button
        className="go"
        onClick={handleClick}
        disabled={state === 'done'}
        style={state === 'done' ? { background: 'var(--grn-d)', color: 'var(--ink)' } : undefined}
      >
        {label}
      </button>
    </>
  )
}
