'use client'

import { useEffect, useRef } from 'react'
import { COLORS, SEISMOGRAPH } from '@/constants/design'

type Phase = 'quiet' | 'p-wave' | 's-wave' | 'coda'

interface SeisState {
  phase: Phase
  phaseProgress: number
  amplitude: number
  eventMagnitude: number
  eventFrequency: number
  quietCountdown: number
}

function createSeisState(): SeisState {
  return {
    phase: 'quiet',
    phaseProgress: 0,
    amplitude: 0,
    eventMagnitude: 0.5,
    eventFrequency: 0.45,
    quietCountdown: Math.floor(
      SEISMOGRAPH.quietMinFrames +
      Math.random() * (SEISMOGRAPH.quietMaxFrames - SEISMOGRAPH.quietMinFrames)
    ),
  }
}

function nextSample(s: SeisState): number {
  const noise = () => (Math.random() - 0.5) * SEISMOGRAPH.baselineNoise

  switch (s.phase) {
    case 'quiet': {
      s.amplitude = s.amplitude * 0.96 + noise()
      s.quietCountdown--
      if (s.quietCountdown <= 0) {
        s.phase = 'p-wave'
        s.phaseProgress = 0
        s.eventMagnitude =
          SEISMOGRAPH.minMagnitude +
          Math.random() * (SEISMOGRAPH.maxMagnitude - SEISMOGRAPH.minMagnitude)
        s.eventFrequency = 0.3 + Math.random() * 0.35
      }
      break
    }
    case 'p-wave': {
      const t = s.phaseProgress / SEISMOGRAPH.pWaveDuration
      s.amplitude =
        Math.sin(s.phaseProgress * s.eventFrequency * 1.2) *
        s.eventMagnitude * 0.30 *
        Math.exp(-t * 2.5) + noise()
      s.phaseProgress++
      if (s.phaseProgress >= SEISMOGRAPH.pWaveDuration) {
        s.phase = 's-wave'
        s.phaseProgress = 0
      }
      break
    }
    case 's-wave': {
      const t = s.phaseProgress / SEISMOGRAPH.sWaveDuration
      s.amplitude =
        Math.sin(s.phaseProgress * s.eventFrequency * 0.6) *
        s.eventMagnitude *
        Math.exp(-t * 1.1) + noise()
      s.phaseProgress++
      if (s.phaseProgress >= SEISMOGRAPH.sWaveDuration) {
        s.phase = 'coda'
        s.phaseProgress = 0
      }
      break
    }
    case 'coda': {
      const t = s.phaseProgress / SEISMOGRAPH.codaDuration
      s.amplitude =
        s.amplitude * 0.97 +
        Math.sin(s.phaseProgress * s.eventFrequency * 0.25) *
        s.eventMagnitude * 0.18 *
        Math.exp(-t * 3) + noise()
      s.phaseProgress++
      if (s.phaseProgress >= SEISMOGRAPH.codaDuration) {
        s.phase = 'quiet'
        s.phaseProgress = 0
        s.amplitude = 0
        s.quietCountdown = Math.floor(
          SEISMOGRAPH.quietMinFrames +
          Math.random() * (SEISMOGRAPH.quietMaxFrames - SEISMOGRAPH.quietMinFrames)
        )
      }
      break
    }
  }

  return Math.max(-1, Math.min(1, s.amplitude))
}

function drawTrace(
  ctx: CanvasRenderingContext2D,
  buffer: Float32Array,
  w: number,
  h: number
) {
  ctx.clearRect(0, 0, w, h)

  const midY  = h / 2
  const range = h * 0.42

  // Faint baseline
  ctx.beginPath()
  ctx.strokeStyle = COLORS.accent
  ctx.lineWidth = 0.5
  ctx.globalAlpha = 0.1
  ctx.shadowBlur = 0
  ctx.moveTo(0, midY)
  ctx.lineTo(w, midY)
  ctx.stroke()

  // Soft outer halo
  ctx.beginPath()
  ctx.strokeStyle = COLORS.accent
  ctx.lineWidth = 5
  ctx.globalAlpha = 0.06
  ctx.shadowBlur = 0
  for (let x = 0; x < w; x++) {
    const y = midY - buffer[x] * range
    x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
  }
  ctx.stroke()

  // Primary trace — matte, restrained glow
  ctx.beginPath()
  ctx.strokeStyle = COLORS.accent
  ctx.lineWidth = SEISMOGRAPH.lineWidth
  ctx.globalAlpha = SEISMOGRAPH.glowAlpha
  ctx.shadowBlur = SEISMOGRAPH.glowBlur
  ctx.shadowColor = COLORS.accent
  ctx.lineJoin = 'round'
  ctx.lineCap = 'round'
  for (let x = 0; x < w; x++) {
    const y = midY - buffer[x] * range
    x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
  }
  ctx.stroke()

  ctx.shadowBlur = 0
  ctx.globalAlpha = 1
}

interface Props {
  className?: string
  height?: number
}

export default function SeismographCanvas({
  className = '',
  height = SEISMOGRAPH.canvasHeight,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resize = () => {
      canvas.width  = canvas.offsetWidth
      canvas.height = height
    }
    resize()

    const w      = canvas.width
    const buffer = new Float32Array(w)
    const state  = createSeisState()

    // Pre-fill so the trace isn't blank on first frame
    for (let i = 0; i < w; i++) buffer[i] = nextSample(state)

    let rafId = 0

    function frame() {
      const shift = Math.ceil(SEISMOGRAPH.scrollSpeed)
      buffer.copyWithin(0, shift)
      for (let i = w - shift; i < w; i++) buffer[i] = nextSample(state)
      drawTrace(ctx!, buffer, w, height)
      rafId = requestAnimationFrame(frame)
    }

    rafId = requestAnimationFrame(frame)

    const ro = new ResizeObserver(() => {
      resize()
      buffer.fill(0)
    })
    ro.observe(canvas)

    return () => {
      cancelAnimationFrame(rafId)
      ro.disconnect()
    }
  }, [height])

  return (
    <canvas
      ref={canvasRef}
      className={`w-full canvas-fade ${className}`}
      style={{ height }}
      aria-hidden="true"
    />
  )
}
