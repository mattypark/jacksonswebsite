import { useCallback, useEffect, useRef, useState } from 'react'
import { drawings } from '../assets/drawings/manifest'

/**
 * Drawing capture page — reach it at  /?sign
 *
 * Draw any mark (signature, face, a logo, a doodle) with a touchscreen or iPad,
 * pick which manifest SLOT it fills, and Export. Paste the exported `viewBox`
 * + `paths` over that slot in src/assets/drawings/manifest.js — zero code
 * changes needed. The export shape matches the manifest stroke-slot shape.
 *
 * Only STROKE slots are listed. This tool emits path data, and a media slot is
 * backed by Jackson's raster/video art — it has nowhere to put a `d` string.
 * Derived from the manifest so a new slot can never drift out of this list;
 * in practice these are exactly the marks Jackson hasn't drawn yet.
 */
const SLOT_OPTIONS = Object.keys(drawings)

export default function SignatureCapture() {
  const canvasRef = useRef(null)
  const strokesRef = useRef([]) // [{ points: [{x,y,t}] }]
  const drawingRef = useRef(false)
  const startTimeRef = useRef(0)
  const [count, setCount] = useState(0)
  const [slot, setSlot] = useState(SLOT_OPTIONS[0])

  const redraw = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const dpr = window.devicePixelRatio || 1
    ctx.clearRect(0, 0, canvas.width / dpr, canvas.height / dpr)
    for (const stroke of strokesRef.current) {
      const pts = stroke.points
      if (pts.length < 2) continue
      ctx.beginPath()
      ctx.moveTo(pts[0].x, pts[0].y)
      for (let i = 1; i < pts.length; i++) {
        const mid = { x: (pts[i - 1].x + pts[i].x) / 2, y: (pts[i - 1].y + pts[i].y) / 2 }
        ctx.quadraticCurveTo(pts[i - 1].x, pts[i - 1].y, mid.x, mid.y)
      }
      ctx.stroke()
    }
  }, [])

  const fitCanvas = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const dpr = window.devicePixelRatio || 1
    const rect = canvas.getBoundingClientRect()
    canvas.width = rect.width * dpr
    canvas.height = rect.height * dpr
    const ctx = canvas.getContext('2d')
    ctx.scale(dpr, dpr)
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    ctx.strokeStyle = '#000000'
    ctx.lineWidth = 3.2
    redraw()
  }, [redraw])

  useEffect(() => {
    fitCanvas()
    window.addEventListener('resize', fitCanvas)
    return () => window.removeEventListener('resize', fitCanvas)
  }, [fitCanvas])

  const localPoint = (e) => {
    const rect = canvasRef.current.getBoundingClientRect()
    return { x: e.clientX - rect.left, y: e.clientY - rect.top, t: performance.now() - startTimeRef.current }
  }

  const onDown = (e) => {
    e.preventDefault()
    if (strokesRef.current.length === 0) startTimeRef.current = performance.now()
    drawingRef.current = true
    strokesRef.current.push({ points: [localPoint(e)] })
    setCount((c) => c + 1)
  }

  const onMove = (e) => {
    if (!drawingRef.current) return
    const stroke = strokesRef.current[strokesRef.current.length - 1]
    stroke.points.push(localPoint(e))
    redraw()
  }

  const onUp = () => {
    drawingRef.current = false
  }

  const clear = () => {
    strokesRef.current = []
    setCount(0)
    redraw()
  }

  const undo = () => {
    strokesRef.current.pop()
    setCount(strokesRef.current.length)
    redraw()
  }

  // Normalize points to a 0..1000 x viewBox, preserving aspect ratio.
  const buildExport = () => {
    const all = strokesRef.current.flatMap((s) => s.points)
    if (all.length < 2) return null
    const xs = all.map((p) => p.x)
    const ys = all.map((p) => p.y)
    const minX = Math.min(...xs)
    const minY = Math.min(...ys)
    const w = Math.max(...xs) - minX || 1
    const h = Math.max(...ys) - minY || 1
    const VW = 1000
    const VH = Math.round((h / w) * VW)
    const norm = (p) => ({
      x: +(((p.x - minX) / w) * VW).toFixed(2),
      y: +(((p.y - minY) / h) * VH).toFixed(2),
    })

    const strokes = strokesRef.current
      .map((s) => ({ points: s.points.map(norm) }))
      .filter((s) => s.points.length >= 2)

    const paths = strokes.map((s) => {
      const pts = s.points
      let d = `M ${pts[0].x} ${pts[0].y}`
      for (let i = 1; i < pts.length; i++) {
        const mid = {
          x: ((pts[i - 1].x + pts[i].x) / 2).toFixed(2),
          y: ((pts[i - 1].y + pts[i].y) / 2).toFixed(2),
        }
        d += ` Q ${pts[i - 1].x} ${pts[i - 1].y} ${mid.x} ${mid.y}`
      }
      return d
    })

    return { slot, viewBox: `0 0 ${VW} ${VH}`, paths }
  }

  const download = (filename, textContent, type) => {
    const blob = new Blob([textContent], { type })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    a.click()
    URL.revokeObjectURL(url)
  }

  const exportSlot = () => {
    const data = buildExport()
    if (!data) {
      alert('Draw something first — need at least one stroke.')
      return
    }
    // A ready-to-paste manifest snippet.
    const snippet = `${data.slot}: {\n  viewBox: '${data.viewBox}',\n  paths: [\n${data.paths
      .map((d) => `    '${d}',`)
      .join('\n')}\n  ],\n},`
    download(`${data.slot}.json`, JSON.stringify(data, null, 2), 'application/json')
    download(`${data.slot}.manifest.txt`, snippet, 'text/plain')
  }

  return (
    <div className="paper-surface flex min-h-[100svh] flex-col items-center justify-center gap-6 px-6 py-12">
      <div className="text-center">
        <p className="label">Drawing capture</p>
        <h1 className="hand-title mt-2 text-[clamp(2rem,1.4rem+2vw,3.2rem)] text-ink">Draw a mark</h1>
        <p className="mt-1 max-w-md text-muted">
          Pick the slot it fills, draw it (iPad is smoothest), then Export and paste it into the manifest.
        </p>
      </div>

      <label className="flex items-center gap-3 font-mono text-[0.72rem] uppercase tracking-label text-muted">
        Slot
        <select
          value={slot}
          onChange={(e) => setSlot(e.target.value)}
          className="rounded-lg border border-line bg-paper px-3 py-2 font-mono text-[0.72rem] text-ink"
        >
          {SLOT_OPTIONS.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </label>

      <canvas
        ref={canvasRef}
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerLeave={onUp}
        className="h-[46vh] w-full max-w-[820px] touch-none rounded-2xl border border-line bg-paper shadow-[var(--shadow-page)]"
        style={{ cursor: 'crosshair' }}
      />

      <div className="flex flex-wrap items-center justify-center gap-3">
        <button
          onClick={undo}
          className="rounded-full border border-line px-5 py-2.5 font-mono text-[0.72rem] uppercase tracking-label text-muted transition-colors hover:border-ink hover:text-ink"
        >
          Undo
        </button>
        <button
          onClick={clear}
          className="rounded-full border border-line px-5 py-2.5 font-mono text-[0.72rem] uppercase tracking-label text-muted transition-colors hover:border-ink hover:text-ink"
        >
          Clear
        </button>
        <button
          onClick={exportSlot}
          className="rounded-full bg-ink px-6 py-2.5 font-mono text-[0.72rem] uppercase tracking-label text-paper transition-transform duration-300 ease-out-expo hover:-translate-y-0.5"
        >
          Export "{slot}"
        </button>
      </div>

      <p className="font-mono text-[0.7rem] text-faint">
        {count} stroke{count === 1 ? '' : 's'} captured
      </p>
    </div>
  )
}
