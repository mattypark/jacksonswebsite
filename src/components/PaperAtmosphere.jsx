import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'

const PARTICLE_COUNT = 70
const DPR_CAP = 1.5

// A soft round sprite so motes read as dust, not square pixels.
function makeDotTexture() {
  const size = 64
  const canvas = document.createElement('canvas')
  canvas.width = canvas.height = size
  const ctx = canvas.getContext('2d')
  const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2)
  g.addColorStop(0, 'rgba(255,255,255,1)')
  g.addColorStop(0.4, 'rgba(255,255,255,0.6)')
  g.addColorStop(1, 'rgba(255,255,255,0)')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, size, size)
  const tex = new THREE.CanvasTexture(canvas)
  return tex
}

/**
 * A whisper of drifting paper dust over the page — a fixed, transparent WebGL
 * layer. Deliberately faint; it adds depth without touching legibility.
 *
 * Lazy-loaded and self-contained: bails out under reduced-motion or when WebGL
 * is unavailable, caps DPR, and fully disposes on unmount.
 */
export default function PaperAtmosphere() {
  const mountRef = useRef(null)
  const reduce = usePrefersReducedMotion()

  useEffect(() => {
    if (reduce || !mountRef.current) return

    // Bail cleanly if WebGL isn't available.
    let renderer
    try {
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
    } catch {
      return
    }

    const mount = mountRef.current
    const width = window.innerWidth
    const height = window.innerHeight

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, DPR_CAP))
    renderer.setSize(width, height)
    renderer.setClearColor(0x000000, 0)
    mount.appendChild(renderer.domElement)

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 100)
    camera.position.z = 6

    // Random motes in a slab in front of the camera.
    const positions = new Float32Array(PARTICLE_COUNT * 3)
    const speeds = new Float32Array(PARTICLE_COUNT)
    const RANGE_X = 12
    const RANGE_Y = 9
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      positions[i * 3] = (Math.random() - 0.5) * RANGE_X
      positions[i * 3 + 1] = (Math.random() - 0.5) * RANGE_Y
      positions[i * 3 + 2] = (Math.random() - 0.5) * 4
      speeds[i] = 0.06 + Math.random() * 0.12
    }
    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))

    const dotTexture = makeDotTexture()
    // Neutral grey, not the old warm tan — on a white page a warm mote reads as
    // a stain. The sprite's white gradient is only an alpha mask; this tints it.
    const material = new THREE.PointsMaterial({
      color: 0x6f6f6f,
      map: dotTexture,
      size: 0.1,
      sizeAttenuation: true,
      transparent: true,
      opacity: 0.24,
      depthWrite: false,
    })
    const points = new THREE.Points(geometry, material)
    scene.add(points)

    // Pointer parallax — very gentle.
    const pointer = { x: 0, y: 0 }
    const onPointer = (e) => {
      pointer.x = (e.clientX / window.innerWidth - 0.5) * 2
      pointer.y = (e.clientY / window.innerHeight - 0.5) * 2
    }
    window.addEventListener('pointermove', onPointer)

    const onResize = () => {
      const w = window.innerWidth
      const h = window.innerHeight
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
    }
    window.addEventListener('resize', onResize)

    let rafId
    let last = performance.now()
    const pos = geometry.attributes.position

    const tick = (now) => {
      const dt = Math.min((now - last) / 1000, 0.05)
      last = now

      for (let i = 0; i < PARTICLE_COUNT; i++) {
        let y = pos.array[i * 3 + 1] + speeds[i] * dt
        // gentle horizontal sway
        pos.array[i * 3] += Math.sin(now * 0.0002 + i) * 0.0015
        if (y > RANGE_Y / 2) y = -RANGE_Y / 2
        pos.array[i * 3 + 1] = y
      }
      pos.needsUpdate = true

      camera.position.x += (pointer.x * 0.5 - camera.position.x) * 0.03
      camera.position.y += (-pointer.y * 0.4 - camera.position.y) * 0.03
      camera.lookAt(scene.position)

      renderer.render(scene, camera)
      rafId = requestAnimationFrame(tick)
    }
    rafId = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener('pointermove', onPointer)
      window.removeEventListener('resize', onResize)
      geometry.dispose()
      material.dispose()
      dotTexture.dispose()
      renderer.dispose()
      if (renderer.domElement.parentNode === mount) mount.removeChild(renderer.domElement)
    }
  }, [reduce])

  if (reduce) return null

  return (
    <div
      ref={mountRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[5]"
    />
  )
}
