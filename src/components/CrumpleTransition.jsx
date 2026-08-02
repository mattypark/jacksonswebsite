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
 *
 * The first version was an outlined octagon with a few creases through it — it
 * read as a folded napkin, not a ball of paper. Crumpled paper reads crumpled
 * because of *shading*: dozens of irregular facets, each catching light at a
 * different angle, with a ragged silhouette. So this is built as filled facets
 * in varying greys with no outline, and the crease lines only sit where two
 * facets meet.
 */
// Deliberately ragged: a smooth outline reads as a pebble. The in-and-out
// vertices are the torn corners sticking out of a real ball of paper. Facets
// are clipped to this, so it can be reshaped without touching them.
// Deliberately irregular. A smooth outline reads as a pebble and an evenly
// spiked one reads as a sunburst — real crumpled paper is mostly lumpy with a
// few torn corners sticking out and a few pinched notches. Facets are clipped
// to this, so it can be reshaped without touching them.
const WAD_SILHOUETTE =
  'M46 104 L52 80 L66 60 L88 46 L96 58 L118 34 L142 28 L150 44 L172 26 L198 34 L206 52 L228 46 L248 70 L238 84 L260 100 L250 124 L256 140 L230 146 L212 168 L196 154 L176 178 L150 176 L140 160 L120 178 L96 166 L88 146 L66 150 L50 128 Z'

// [path, grey]. Ordered back-to-front; greys run from deep shadow to blown
// highlight so the eye reads volume instead of a flat outline.
const WAD_FACETS = [
  ['M52 112 L44 82 L62 58 L104 74 L96 118 Z', '#d8d8d8'],
  ['M62 58 L92 40 L128 30 L134 62 L104 74 Z', '#f2f2f2'],
  ['M128 30 L164 26 L200 34 L182 66 L134 62 Z', '#ffffff'],
  ['M200 34 L228 48 L252 74 L220 84 L182 66 Z', '#e4e4e4'],
  ['M252 74 L258 104 L250 134 L222 122 L220 84 Z', '#cfcfcf'],
  ['M104 74 L134 62 L146 100 L118 112 L96 118 Z', '#fbfbfb'],
  ['M134 62 L182 66 L188 96 L146 100 Z', '#e9e9e9'],
  ['M182 66 L220 84 L222 122 L188 96 Z', '#f6f6f6'],
  ['M96 118 L118 112 L124 148 L96 152 Z', '#c4c4c4'],
  ['M118 112 L146 100 L162 132 L124 148 Z', '#ededed'],
  ['M146 100 L188 96 L196 130 L162 132 Z', '#fdfdfd'],
  ['M188 96 L222 122 L250 134 L212 146 L196 130 Z', '#dadada'],
  ['M52 112 L96 118 L96 152 L60 138 Z', '#bdbdbd'],
  ['M96 152 L124 148 L118 174 L82 158 Z', '#cccccc'],
  ['M124 148 L162 132 L158 178 L118 174 Z', '#e6e6e6'],
  ['M162 132 L196 130 L212 146 L196 172 L158 178 Z', '#d2d2d2'],
  ['M212 146 L250 134 L228 158 L196 172 Z', '#b6b6b6'],
]

// Hairline creases over the facet seams — the fold lines you actually see.
const WAD_CREASES = [
  'M104 74 L146 100 L188 96',
  'M146 100 L124 148',
  'M188 96 L212 146',
  'M96 118 L118 112 L162 132 L196 130',
  'M134 62 L146 100',
  'M220 84 L222 122',
  'M96 152 L124 148 L158 178',
]

function PaperWad() {
  return (
    <svg viewBox="0 0 300 200" className="h-full w-full" aria-hidden="true">
      <defs>
        {/* soft falloff so the whole ball sits in one light, not flat-lit */}
        <radialGradient id="wad-light" cx="38%" cy="28%" r="78%">
          <stop offset="0%" stopColor="#fff" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#000" stopOpacity="0.22" />
        </radialGradient>
        <clipPath id="wad-clip">
          <path d={WAD_SILHOUETTE} />
        </clipPath>
      </defs>

      <g clipPath="url(#wad-clip)">
        {/* base tone so the rim between the facet field and the torn edge is
            paper, not the bare gradient */}
        <path d={WAD_SILHOUETTE} fill="#e2e2e2" />
        {WAD_FACETS.map(([d, fill], i) => (
          <path key={i} d={d} fill={fill} />
        ))}
        {WAD_CREASES.map((d, i) => (
          <path
            key={i}
            d={d}
            fill="none"
            stroke="#000"
            strokeWidth="0.9"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.28"
          />
        ))}
        <path d={WAD_SILHOUETTE} fill="url(#wad-light)" />
      </g>

      {/* faint edge only — a hard outline is what made the first pass read flat */}
      <path
        d={WAD_SILHOUETTE}
        fill="none"
        stroke="#000"
        strokeWidth="1.1"
        strokeLinejoin="round"
        opacity="0.3"
      />
    </svg>
  )
}
