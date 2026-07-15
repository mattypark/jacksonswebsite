import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'

gsap.registerPlugin(ScrollTrigger)

/**
 * Journal page-turn. `front` (page 1) sits over `back` (page 2); as you scroll
 * the tall trigger section, the front page flips away around its left edge to
 * reveal the back — a real page turn, scrubbed by scroll.
 *
 * Uses CSS `position: sticky` for the pin (Lenis-friendly, no pin-spacer
 * surprises) and ScrollTrigger only to scrub the rotation. Under reduced-motion
 * both pages simply stack and scroll.
 *
 * @param {object} props
 * @param {import('react').ReactNode} props.front  page 1 (flips away)
 * @param {import('react').ReactNode} props.back   page 2 (revealed)
 * @param {number} [props.scroll]  trigger length in vh (default 200)
 */
export default function PageTurn({ front, back, scroll = 200 }) {
  const reduce = usePrefersReducedMotion()
  const triggerRef = useRef(null)
  const frontRef = useRef(null)
  const shadowRef = useRef(null)
  const curlRef = useRef(null)

  useEffect(() => {
    if (reduce || !triggerRef.current) return

    const ctx = gsap.context(() => {
      gsap.set(frontRef.current, { transformPerspective: 1600, transformOrigin: 'left center' })

      // Flip occupies the middle of the scroll range — page 1 stays readable
      // at the top, turns, and page 2 is fully open before the pin releases.
      const FLIP_START = 0.32
      const FLIP_END = 0.9
      const map = (p) => gsap.utils.clamp(0, 1, (p - FLIP_START) / (FLIP_END - FLIP_START))

      const st = ScrollTrigger.create({
        trigger: triggerRef.current,
        start: 'top top',
        end: 'bottom bottom',
        scrub: true,
        onUpdate: (self) => {
          const fp = map(self.progress)
          const rot = fp * -168
          gsap.set(frontRef.current, {
            rotateY: rot,
            // a touch of z-lift so the turning page floats off the spine
            z: Math.sin(fp * Math.PI) * 60,
          })
          // shed shadow across the spread as the page lifts, then clears
          gsap.set(shadowRef.current, { opacity: Math.sin(fp * Math.PI) * 0.4 })
          // right-edge curl highlight, fades once the page is past vertical
          gsap.set(curlRef.current, { opacity: fp > 0 && fp < 0.5 ? 0.5 - fp : 0 })
          // stop catching clicks once it's turned past halfway
          frontRef.current.style.pointerEvents = fp > 0.5 ? 'none' : 'auto'
        },
      })

      return () => st.kill()
    }, triggerRef)

    return () => ctx.revert()
  }, [reduce])

  if (reduce) {
    return (
      <>
        {front}
        {back}
      </>
    )
  }

  return (
    <section ref={triggerRef} className="relative" style={{ height: `${scroll}vh` }}>
      <div
        className="sticky top-0 h-[100svh] overflow-hidden"
        style={{ perspective: '1600px' }}
      >
        {/* page 2 — revealed beneath */}
        <div className="absolute inset-0">{back}</div>

        {/* spread shadow that sweeps as the page lifts */}
        <div
          ref={shadowRef}
          className="pointer-events-none absolute inset-0 z-10 opacity-0"
          style={{
            background:
              'linear-gradient(105deg, rgba(0,0,0,0) 30%, rgba(0,0,0,0.32) 60%, rgba(0,0,0,0) 85%)',
          }}
          aria-hidden="true"
        />

        {/* page 1 — flips away around the left edge */}
        <div
          ref={frontRef}
          className="paper-surface absolute inset-0 z-20 will-change-transform [backface-visibility:hidden]"
        >
          {front}
          {/* right-edge curl highlight */}
          <div
            ref={curlRef}
            className="pointer-events-none absolute inset-y-0 right-0 w-24 opacity-0"
            style={{
              background: 'linear-gradient(to left, rgba(255,255,255,0.7), rgba(255,255,255,0))',
            }}
            aria-hidden="true"
          />
        </div>
      </div>
    </section>
  )
}
