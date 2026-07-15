import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { roles } from '../data/content'
import { drawings, strikeVariants } from '../assets/drawings/manifest'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'

/**
 * The heart of the hero: roles write in one at a time, each gets a hand-drawn
 * strike, until "multifaceted artist :)" stays and gets underlined. One GSAP
 * master timeline owns the clock so it's skippable (tl.progress(1)).
 */
export default function RoleStrikeList({ startDelay = 0, onDone }) {
  const reduce = usePrefersReducedMotion()
  const scopeRef = useRef(null)
  const rowRefs = useRef([])
  const wordRefs = useRef([]) // wordRefs[rowIndex] = [span, span, ...]
  const strikeRefs = useRef([]) // strikeRefs[rowIndex] = [path, path, ...]
  const underlineRefs = useRef([]) // [path, path, ...]
  const smileRef = useRef(null)
  const tlRef = useRef(null)
  const [done, setDone] = useState(false)

  const lastIndex = roles.length - 1

  useEffect(() => {
    const finish = () => {
      window.__heroDone = true
      setDone(true)
      onDone?.()
    }

    if (reduce) {
      finish()
      return
    }

    const ctx = gsap.context(() => {
      // Prep: hide all words; set strike/underline dashes to fully hidden.
      wordRefs.current.forEach((words) => {
        gsap.set(words, { opacity: 0, x: -8, filter: 'blur(2px)' })
      })
      // Each path carries its own dash length, so prep them individually — a
      // shared dasharray would under/over-shoot every path but one.
      strikeRefs.current.flat().forEach((p) => {
        if (!p) return
        const len = p.getTotalLength()
        gsap.set(p, { strokeDasharray: len, strokeDashoffset: len, opacity: 1 })
      })
      underlineRefs.current.forEach((p) => {
        if (!p) return
        const len = p.getTotalLength()
        gsap.set(p, { strokeDasharray: len, strokeDashoffset: len })
      })
      if (smileRef.current) gsap.set(smileRef.current, { scale: 0, transformOrigin: '50% 60%' })

      const tl = gsap.timeline({ delay: startDelay, onComplete: finish })
      tlRef.current = tl

      roles.forEach((role, i) => {
        const words = wordRefs.current[i] || []
        // write-in
        tl.to(words, {
          opacity: 1,
          x: 0,
          filter: 'blur(0px)',
          duration: 0.34,
          stagger: 0.05,
          ease: 'power2.out',
        })

        if (role.struck) {
          tl.to({}, { duration: 0.42 }) // "thinking" pause
          tl.to(
            (strikeRefs.current[i] || []).filter(Boolean),
            { strokeDashoffset: 0, duration: 0.26, ease: 'power2.inOut', stagger: 0.06 },
            '>-0.02',
          )
          tl.to(rowRefs.current[i], { opacity: 0.5, duration: 0.3 }, '<0.05')
          tl.to({}, { duration: 0.12 })
        }
      })

      // Final row flourish: underline draw + smile pop.
      tl.to(underlineRefs.current.filter(Boolean), { strokeDashoffset: 0, duration: 0.5, ease: 'power2.out', stagger: 0.08 }, '+=0.15')
      if (smileRef.current) {
        tl.to(smileRef.current, { scale: 1, duration: 0.5, ease: 'back.out(3)' }, '<0.1')
      }
    }, scopeRef)

    return () => ctx.revert()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduce])

  const skip = () => {
    if (tlRef.current) tlRef.current.progress(1)
  }

  const splitLast = () => {
    // "multifaceted artist :)" — keep the ":)" separable for the pop.
    const text = roles[lastIndex].text
    const smileIdx = text.lastIndexOf(':)')
    if (smileIdx === -1) return { words: text.split(' '), smile: null }
    const main = text.slice(0, smileIdx).trim()
    return { words: main.split(' '), smile: ':)' }
  }

  return (
    <div ref={scopeRef} className="relative">
      <ul className="hand-hero space-y-1 text-[clamp(1.55rem,0.7rem+4.6vw,4.3rem)] leading-[1.18] text-ink">
        {roles.map((role, i) => {
          const isLast = i === lastIndex
          const strikeSlot = strikeVariants[i % strikeVariants.length]
          const strikeData = drawings[strikeSlot]
          const { words, smile } = isLast ? splitLast() : { words: role.text.split(' '), smile: null }

          return (
            <li
              key={i}
              ref={(el) => (rowRefs.current[i] = el)}
              className="relative block w-fit whitespace-nowrap pr-2"
              style={{ marginLeft: `${Math.min(i, 4) * 3.5}%` }}
            >
              <span className={isLast ? 'relative text-ink' : 'relative'}>
                {words.map((w, wi) => (
                  <span
                    key={wi}
                    ref={(el) => {
                      if (!wordRefs.current[i]) wordRefs.current[i] = []
                      wordRefs.current[i][wi] = el
                    }}
                    className="inline-block"
                    style={{ opacity: reduce ? 1 : 0 }}
                  >
                    {w}
                    {wi < words.length - 1 ? ' ' : ''}
                  </span>
                ))}
                {smile && (
                  <span
                    ref={(el) => {
                      if (!wordRefs.current[i]) wordRefs.current[i] = []
                      wordRefs.current[i][words.length] = el
                    }}
                    className="ml-2 inline-block text-pen"
                    style={{ opacity: reduce ? 1 : 0 }}
                  >
                    <span ref={smileRef} className="inline-block">
                      {smile}
                    </span>
                  </span>
                )}
              </span>

              {/* strike overlay (struck rows only) */}
              {role.struck && (
                <svg
                  className="pointer-events-none absolute left-0 top-1/2 h-[0.5em] w-full -translate-y-1/2 overflow-visible"
                  viewBox={strikeData.viewBox}
                  preserveAspectRatio="none"
                  fill="none"
                  aria-hidden="true"
                >
                  {strikeData.paths.map((d, pi) => (
                    <path
                      key={pi}
                      ref={(el) => {
                        if (!strikeRefs.current[i]) strikeRefs.current[i] = []
                        strikeRefs.current[i][pi] = el
                      }}
                      d={d}
                      stroke="var(--color-rust)"
                      strokeWidth="7"
                      strokeLinecap="round"
                      style={reduce ? { strokeDashoffset: 0 } : undefined}
                    />
                  ))}
                </svg>
              )}

              {/* underline (final row only) */}
              {isLast && (
                <svg
                  className="pointer-events-none absolute -bottom-3 left-0 h-4 w-full overflow-visible"
                  viewBox={drawings.doodleUnderline.viewBox}
                  preserveAspectRatio="none"
                  fill="none"
                  aria-hidden="true"
                >
                  {drawings.doodleUnderline.paths.map((d, pi) => (
                    <path
                      key={pi}
                      ref={(el) => (underlineRefs.current[pi] = el)}
                      d={d}
                      stroke="var(--color-pen)"
                      strokeWidth="6"
                      strokeLinecap="round"
                      style={reduce ? { strokeDashoffset: 0 } : undefined}
                    />
                  ))}
                </svg>
              )}
            </li>
          )
        })}
      </ul>

      {!done && !reduce && (
        <button
          onClick={skip}
          className="label mt-6 inline-block text-faint transition-colors hover:text-ink"
        >
          skip →
        </button>
      )}
    </div>
  )
}
