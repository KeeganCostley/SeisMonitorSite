// Minimal cubic-bezier easing evaluator (Newton-Raphson + bisection fallback),
// the same technique browsers use for CSS `cubic-bezier()` timing functions.
// Used to reproduce the design prototype's `cubic-bezier(0,.45,.5,1)` ring
// easing on a canvas instead of a CSS animation.

function bezierComponent(t: number, p1: number, p2: number): number {
  const c = 3 * p1
  const b = 3 * (p2 - p1) - c
  const a = 1 - c - b
  return ((a * t + b) * t + c) * t
}
function bezierComponentDerivative(t: number, p1: number, p2: number): number {
  const c = 3 * p1
  const b = 3 * (p2 - p1) - c
  const a = 1 - c - b
  return (3 * a * t + 2 * b) * t + c
}

export function cubicBezier(x1: number, y1: number, x2: number, y2: number) {
  return (x: number): number => {
    if (x <= 0) return 0
    if (x >= 1) return 1
    let t = x
    for (let i = 0; i < 8; i++) {
      const xEst = bezierComponent(t, x1, x2) - x
      const d = bezierComponentDerivative(t, x1, x2)
      if (Math.abs(d) < 1e-6) break
      t -= xEst / d
    }
    return bezierComponent(t, y1, y2)
  }
}
