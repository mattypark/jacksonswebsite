import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { crumplePhoto } from '../data/content'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'

gsap.registerPlugin(ScrollTrigger)

/**
 * Page 1 gets crumpled up and thrown at page 2.
 *
 * Replaces the old page-turn flip. Scrubbed by scroll in three beats:
 *   hold      — page 1 sits still and readable
 *   crush     — it scales down, twists, and cross-fades into the crumpled-paper
 *               photo while a grey dot-grid floor rises behind it
 *   discard   — the ball drops away and page 2 is left open underneath
 *
 * The crumple photo is a swappable slot (see `crumplePhoto` in content.js). If
 * the file isn't there yet the ball falls back to a drawn paper wad so the
 * timing is still tunable.
 *
 * @param {object} props
 * @param {import('react').ReactNode} props.front  page 1 (gets crumpled)
 * @param {import('react').ReactNode} props.back   page 2 (revealed)
 * @param {number} [props.scroll]  trigger length in vh (default 240)
 */
export default function CrumpleTransition({ front, back, scroll = 240 }) {
  const reduce = usePrefersReducedMotion()
  const triggerRef = useRef(null)
  const frontRef = useRef(null)
  const ballRef = useRef(null)
  const floorRef = useRef(null)
  const shadowRef = useRef(null)
  const [photoFailed, setPhotoFailed] = useState(false)

  useEffect(() => {
    if (reduce || !triggerRef.current) return

    const ctx = gsap.context(() => {
      gsap.set(frontRef.current, { transformOrigin: '50% 45%' })
      gsap.set(ballRef.current, { opacity: 0, scale: 0.55, transformOrigin: '50% 50%' })
      gsap.set(floorRef.current, { opacity: 0 })
      gsap.set(shadowRef.current, { opacity: 0 })

      const HOLD_END = 0.24
      const CRUSH_END = 0.66
      // 0→1 across the crush beat, 0→1 across the discard beat.
      const crush = (p) => gsap.utils.clamp(0, 1, (p - HOLD_END) / (CRUSH_END - HOLD_END))
      const discard = (p) => gsap.utils.clamp(0, 1, (p - CRUSH_END) / (1 - CRUSH_END))

      const st = ScrollTrigger.create({
        trigger: triggerRef.current,
        start: 'top top',
        end: 'bottom bottom',
        scrub: true,
        onUpdate: (self) => {
          const c = crush(self.progress)
          const d = discard(self.progress)
          const eased = gsap.parseEase('power2.in')(c)

          // page 1 balls up: shrink hard, twist, and only wash out once it's
          // small — fading it early just leaves a ghost of page 2 showing
          // through a full-size sheet, which reads as a dissolve, not a crumple.
          gsap.set(frontRef.current, {
            scale: 1 - eased * 0.88,
            rotation: eased * -18,
            y: eased * 40,
            opacity: 1 - gsap.utils.clamp(0, 1, (c - 0.6) / 0.25),
            filter: `blur(${eased * 4}px) contrast(${1 + eased * 0.5})`,
          })
          frontRef.current.style.pointerEvents = c > 0.05 ? 'none' : 'auto'

          // grey dot-grid floor rises behind, then clears on the discard. It
          // goes opaque fast so page 2 stays hidden until the ball is gone.
          // The floor holds solid through the first half of the discard so the
          // ball falls against grey, not against a half-visible page 2.
          gsap.set(floorRef.current, {
            opacity: gsap.utils.clamp(0, 1, c * 3) * (1 - gsap.utils.clamp(0, 1, (d - 0.62) / 0.38)),
          })

          // the wad itself: takes over as page 1 washes out, settles, then drops
          const ballIn = gsap.utils.clamp(0, 1, (c - 0.55) / 0.35)
          // It's thrown away, so it accelerates out of frame rather than fading
          // in place — d² gives the fall some gravity.
          gsap.set(ballRef.current, {
            opacity: ballIn * (1 - gsap.utils.clamp(0, 1, (d - 0.55) / 0.45)),
            scale: 0.55 + ballIn * 0.45 - d * 0.2,
            rotation: -8 + ballIn * 14 + d * 46,
            y: d * d * 900,
          })
          gsap.set(shadowRef.current, {
            opacity: ballIn * 0.35 * (1 - gsap.utils.clamp(0, 1, d * 2.2)),
            scaleX: 0.7 + ballIn * 0.3,
          })
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
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        {/* page 2 — waiting underneath */}
        <div className="absolute inset-0">{back}</div>

        {/* grey dot-grid floor the wad lands on */}
        <div
          ref={floorRef}
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-10 opacity-0"
          style={{
            backgroundColor: '#6f6f6f',
            backgroundImage:
              'radial-gradient(circle, rgba(255,255,255,0.5) 1px, transparent 1.4px)',
            backgroundSize: '38px 38px',
          }}
        />

        {/* the crumpled ball + its contact shadow */}
        <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center">
          <div className="relative w-[clamp(14rem,40vw,34rem)]">
            <div
              ref={ballRef}
              className="relative aspect-[3/2] w-full opacity-0 will-change-transform"
            >
              {photoFailed || !crumplePhoto.src ? (
                <PaperWad />
              ) : (
                <img
                  src={crumplePhoto.src}
                  alt={crumplePhoto.alt}
                  loading="lazy"
                  onError={() => setPhotoFailed(true)}
                  className="h-full w-full object-cover"
                />
              )}
            </div>
            <div
              ref={shadowRef}
              aria-hidden="true"
              className="absolute -bottom-6 left-1/2 h-6 w-2/3 -translate-x-1/2 rounded-[50%] opacity-0 blur-md"
              style={{ background: 'rgba(0,0,0,0.55)' }}
            />
          </div>
        </div>

        {/* page 1 — gets crumpled */}
        <div
          ref={frontRef}
          className="paper-surface absolute inset-0 z-30 will-change-transform"
        >
          {front}
        </div>
      </div>
    </section>
  )
}

/**
 * Placeholder wad, used until a real crumple photo lands in /public/photos.
 * Drawn creases, not a photo — reads as paper without pretending to be one.
 */
function PaperWad() {
  return (
    <svg viewBox="0 0 300 200" className="h-full w-full" aria-hidden="true">
      <path
        d="M64 118 L48 74 L96 40 L156 30 L212 52 L246 92 L232 146 L178 172 L112 170 Z"
        fill="var(--color-paper)"
        stroke="var(--color-ink)"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      {[
        'M96 40 L120 96 L64 118',
        'M120 96 L178 172',
        'M120 96 L212 52',
        'M120 96 L232 146',
        'M156 30 L186 84 L246 92',
        'M186 84 L232 146',
      ].map((d, i) => (
        <path
          key={i}
          d={d}
          fill="none"
          stroke="var(--color-ink)"
          strokeWidth="1.6"
          strokeLinecap="round"
          opacity="0.5"
        />
      ))}
    </svg>
  )
}
