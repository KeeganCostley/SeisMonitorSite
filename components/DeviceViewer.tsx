'use client'

import { Suspense, useEffect, useMemo, useRef } from 'react'
import type { MutableRefObject } from 'react'
import { Canvas, useFrame, useLoader } from '@react-three/fiber'
import { OrbitControls, ContactShadows, PerspectiveCamera } from '@react-three/drei'
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js'
import * as THREE from 'three'
import { drawMonitorNZ, drawAlert } from '@/lib/screen/draw'
import { seisTrace } from '@/lib/screen/seismo'
import {
  SCREEN_CENTER,
  SCREEN_NORMAL,
  SCREEN_UP,
  SCREEN_RIGHT,
  SCREEN_VISIBLE_W,
  SCREEN_VISIBLE_H,
  SCREEN_OFFSET,
} from '@/lib/screen/enclosureGeometry'
import { SAMPLE_ALERT_QUAKES } from '@/lib/screen/sampleQuakes'
import type { Quake, QuakeFeed } from '@/lib/quakes/types'

const IDLE_MS = 26000 // time on the monitor screen between demo alerts
const ALERT_MS = 6000 // how long the alert takeover holds (device does 25s; shortened for a site preview)
const FEED_POLL_MS = 60000

const EMPTY_FEED: QuakeFeed = { latest: null, high24: null, recent: [], source: 'fallback' }

function BodyMesh({ url, color }: { url: string; color: string }) {
  const geometry = useLoader(STLLoader, url)
  return (
    <mesh geometry={geometry} castShadow receiveShadow>
      <meshStandardMaterial color={color} roughness={0.82} metalness={0.08} />
    </mesh>
  )
}

type Mode = 'monitor' | 'alert'

function useQuakeCycle() {
  const feedRef = useRef<QuakeFeed>(EMPTY_FEED)
  const modeRef = useRef<Mode>('monitor')
  const alertQuakeRef = useRef<Quake | null>(null)
  const alertStartRef = useRef(0)
  const cycleIndexRef = useRef(0)
  const manualTriggerRef = useRef<() => void>(() => {})

  useEffect(() => {
    let stopped = false
    const poll = () => {
      fetch('/api/quakes?region=nz')
        .then((r) => r.json())
        .then((feed: QuakeFeed) => {
          if (!stopped) feedRef.current = feed
        })
        .catch(() => {})
    }
    poll()
    const pollId = setInterval(poll, FEED_POLL_MS)

    let alertTimer: ReturnType<typeof setTimeout> | null = null
    let idleTimer: ReturnType<typeof setTimeout> | null = null

    const fireAlert = () => {
      const pool = feedRef.current.recent.length ? feedRef.current.recent : SAMPLE_ALERT_QUAKES
      const q = pool[cycleIndexRef.current % pool.length]
      cycleIndexRef.current += 1
      alertQuakeRef.current = q
      alertStartRef.current = performance.now()
      modeRef.current = 'alert'
      alertTimer = setTimeout(() => {
        modeRef.current = 'monitor'
        idleTimer = setTimeout(fireAlert, IDLE_MS)
      }, ALERT_MS)
    }
    idleTimer = setTimeout(fireAlert, IDLE_MS)
    manualTriggerRef.current = () => {
      if (alertTimer) clearTimeout(alertTimer)
      if (idleTimer) clearTimeout(idleTimer)
      fireAlert()
    }

    return () => {
      stopped = true
      clearInterval(pollId)
      if (alertTimer) clearTimeout(alertTimer)
      if (idleTimer) clearTimeout(idleTimer)
    }
  }, [])

  return { feedRef, modeRef, alertQuakeRef, alertStartRef, manualTriggerRef }
}

function ScreenMesh({
  feedRef,
  modeRef,
  alertQuakeRef,
  alertStartRef,
}: {
  feedRef: MutableRefObject<QuakeFeed>
  modeRef: MutableRefObject<Mode>
  alertQuakeRef: MutableRefObject<Quake | null>
  alertStartRef: MutableRefObject<number>
}) {
  const canvasEl = useMemo(() => {
    const c = document.createElement('canvas')
    c.width = 640
    c.height = 480
    return c
  }, [])
  const ctx2d = useMemo(() => canvasEl.getContext('2d'), [canvasEl])
  const texture = useMemo(() => {
    const tex = new THREE.CanvasTexture(canvasEl)
    tex.colorSpace = THREE.SRGBColorSpace
    return tex
  }, [canvasEl])
  const seismoRef = useRef(seisTrace(220, 24, 1))
  const lastReseedRef = useRef(0)
  const lastDrawRef = useRef(0)

  const { position, quaternion } = useMemo(() => {
    const normal = new THREE.Vector3(...SCREEN_NORMAL).normalize()
    const up = new THREE.Vector3(...SCREEN_UP).normalize()
    const right = new THREE.Vector3(...SCREEN_RIGHT).normalize()
    const basis = new THREE.Matrix4().makeBasis(right, up, normal)
    const quaternion = new THREE.Quaternion().setFromRotationMatrix(basis)
    const center = new THREE.Vector3(...SCREEN_CENTER)
    const position = center.add(normal.clone().multiplyScalar(SCREEN_OFFSET))
    return { position, quaternion }
  }, [])

  useFrame((state) => {
    const now = state.clock.elapsedTime * 1000
    const throttle = modeRef.current === 'alert' ? 33 : 66 // ~30fps alert, ~15fps idle
    if (now - lastDrawRef.current < throttle) return
    lastDrawRef.current = now
    if (!ctx2d) return

    if (now - lastReseedRef.current > 8000) {
      lastReseedRef.current = now
      seismoRef.current = seisTrace(220, Math.floor(now / 1000), 1)
    }

    ctx2d.save()
    ctx2d.scale(2, 2)
    if (modeRef.current === 'alert' && alertQuakeRef.current) {
      drawAlert(ctx2d, {
        quake: alertQuakeRef.current,
        elapsedMs: performance.now() - alertStartRef.current,
      })
    } else {
      drawMonitorNZ(ctx2d, {
        latest: feedRef.current.latest,
        high24: feedRef.current.high24,
        seismoSamples: seismoRef.current,
        nowMs: Date.now(),
      })
    }
    ctx2d.restore()
    texture.needsUpdate = true
  })

  return (
    <mesh position={position} quaternion={quaternion}>
      <planeGeometry args={[SCREEN_VISIBLE_W, SCREEN_VISIBLE_H]} />
      <meshBasicMaterial map={texture} toneMapped={false} />
    </mesh>
  )
}

const BODY_URL = '/models/seismonitor-body.stl'
const CAP_URL = '/models/seismonitor-base-plate.stl'
const ROCK_COLOR = '#26251f'

function Scene(cycle: ReturnType<typeof useQuakeCycle>) {
  return (
    <group rotation={[-Math.PI / 2, 0, 0]}>
      <Suspense fallback={null}>
        <BodyMesh url={BODY_URL} color={ROCK_COLOR} />
        <BodyMesh url={CAP_URL} color={ROCK_COLOR} />
        <ScreenMesh
          feedRef={cycle.feedRef}
          modeRef={cycle.modeRef}
          alertQuakeRef={cycle.alertQuakeRef}
          alertStartRef={cycle.alertStartRef}
        />
      </Suspense>
    </group>
  )
}

export default function DeviceViewer({ onReady }: { onReady?: (trigger: () => void) => void }) {
  const cycle = useQuakeCycle()

  useEffect(() => {
    if (onReady) onReady(() => cycle.manualTriggerRef.current())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Canvas shadows dpr={[1, 2]} gl={{ antialias: true }}>
      <PerspectiveCamera makeDefault position={[70, 90, 190]} fov={32} near={1} far={2000} />
      <ambientLight intensity={0.55} />
      <directionalLight position={[120, 180, 100]} intensity={1.1} castShadow />
      <directionalLight position={[-100, 60, -80]} intensity={0.35} color="#7fd69a" />
      <pointLight position={[0, 40, 120]} intensity={0.3} />
      <Scene {...cycle} />
      <ContactShadows position={[0, -46, 0]} opacity={0.5} scale={220} blur={2.4} far={80} />
      <OrbitControls
        enablePan={false}
        minDistance={110}
        maxDistance={320}
        autoRotate
        autoRotateSpeed={0.6}
        target={[0, 8, 0]}
      />
    </Canvas>
  )
}
