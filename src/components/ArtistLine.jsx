import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { artistLine } from '../data/content'
import { drawings } from '../assets/drawings/manifest'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'

/**
 * The answer to the intro's trailing "am a ...". Words settle in, the underline
 * draws, the ":)" pops.
 *
 * This replaces the old RoleStrikeList: five struck job titles ahead of this
 * line made the opening long, and the strikes fought the taped photo for
 * attention. One line, one mark.
 */
export default function ArtistLine({ startDelay = 0, onDone }) {
  const reduce = usePrefersReducedMotion()
  const scopeRef = useRef(null)
  const wordRefs = useRef([])
  const underlineRefs = useRef([])
  const smileRef = useRef(null)

  // Keep the ":)" separable so it can pop on its own.
  const smileIdx = artistLine.lastIndexOf(':)')
  const words = (smileIdx === -1 ? artistLine : artistLine.slice(0, smileIdx)).trim().split(' ')
  const smile = smileIdx === -1 ? null : ':)'

  useEffect(() => {
    if (reduce) {
      window.__heroDone = true
      onDone?.()
      return
    }

    const ctx = gsap.context(() => {
      const wordEls = wordRefs.current.filter(Boolean)
      gsap.set(wordEls, { opacity: 0, x: -8, filter: 'blur(2px)' })

      // Each path carries its own dash length — a shared dasharray would
      // under- or over-shoot every path but one.
      underlineRefs.current.forEach((p) => {
        if (!p) return
        const len = p.getTotalLength()
        gsap.set(p, { strokeDasharray: len, strokeDashoffset: len })
      })
      if (smileRef.current) gsap.set(smileRef.current, { scale: 0, transformOrigin: '50% 60%' })

      const tl = gsap.timeline({
        delay: startDelay,
        onComplete: () => {
          window.__heroDone = true
          onDone?.()
        },
      })

      tl.to(wordEls, {
        opacity: 1,
        x: 0,
        filter: 'blur(0px)',
        duration: 0.34,
        stagger: 0.06,
        ease: 'power2.out',
      })
      tl.to(
        underlineRefs.current.filter(Boolean),
        { strokeDashoffset: 0, duration: 0.5, ease: 'power2.out', stagger: 0.08 },
        '+=0.1',
      )
      if (smileRef.current) {
        tl.to(smileRef.current, { scale: 1, duration: 0.5, ease: 'back.out(3)' }, '<0.1')
      }
    }, scopeRef)

    return () => ctx.revert()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduce])

  return (
    <div ref={scopeRef} className="relative w-fit">
      <p className="hand-hero relative whitespace-nowrap pr-2 text-[clamp(1.7rem,0.9rem+4.4vw,4rem)] leading-[1.18] text-ink">
        {words.map((w, i) => (
          <span
            key={i}
            ref={(el) => (wordRefs.current[i] = el)}
            // whitespace-pre: an inline-block trims its own trailing space, which
            // would run the words together.
            className="inline-block whitespace-pre"
            style={{ opacity: reduce ? 1 : 0 }}
          >
            {w}
            {i < words.length - 1 ? ' ' : ''}
          </span>
        ))}
        {smile && (
          <span
            ref={(el) => (wordRefs.current[words.length] = el)}
            className="ml-2 inline-block text-pen"
            style={{ opacity: reduce ? 1 : 0 }}
          >
            <span ref={smileRef} className="inline-block">
              {smile}
            </span>
          </span>
        )}

        {/* hand-drawn underline */}
        <svg
          className="pointer-events-none absolute -bottom-3 left-0 h-4 w-full overflow-visible"
          viewBox={drawings.doodleUnderline.viewBox}
          preserveAspectRatio="none"
          fill="none"
          aria-hidden="true"
        >
          {drawings.doodleUnderline.paths.map((d, i) => (
            <path
              key={i}
              ref={(el) => (underlineRefs.current[i] = el)}
              d={d}
              stroke="var(--color-pen)"
              strokeWidth="6"
              strokeLinecap="round"
              style={reduce ? { strokeDashoffset: 0 } : undefined}
            />
          ))}
        </svg>
      </p>
    </div>
  )
}
