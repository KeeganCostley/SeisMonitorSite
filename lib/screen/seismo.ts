// Seismograph trace — ported from sm-common.jsx's seisTrace(). Deterministic
// pseudo-random P/S/surface/coda-wave shape (same LCG seed math as the
// prototype), used to drive the idle seismograph and matched to a real
// magnitude at alert time.

export function seisTrace(n: number, seed = 7, intensity = 1): number[] {
  const out: number[] = []
  let s = seed
  const rng = () => {
    s = (s * 9301 + 49297) % 233280
    return s / 233280 - 0.5
  }
  for (let i = 0; i < n; i++) {
    const t = i / n
    let y = rng() * 0.05
    const p = Math.exp(-(((t - 0.32) * 20) ** 2))
    y += p * (Math.sin(i * 0.85) * 0.35 + rng() * 0.2)
    const sw = Math.exp(-(((t - 0.52) * 7) ** 2))
    y += sw * (Math.sin(i * 0.5) * 0.85 + Math.sin(i * 0.28) * 0.4 + rng() * 0.25)
    const coda = Math.exp(-(((t - 0.72) * 3.5) ** 2))
    y += coda * (Math.sin(i * 0.35) * 0.3 + rng() * 0.2)
    out.push(y * intensity)
  }
  return out
}
