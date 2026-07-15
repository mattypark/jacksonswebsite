import { createElement, useEffect, useRef } from 'react'
import { animate, stagger } from 'animejs'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'

/**
 * Handwriting write-on: each word reveals left-to-right with a pen-wipe
 * (clip-path via a --wipe custom prop) plus a small settle. Reads as writing
 * without per-letter SVG paths.
 *
 * @param {object}   props
 * @param {string}   props.text          the line to write
 * @param {string}  [props.as]           tag name (default 'p')
 * @param {string}  [props.className]
 * @param {number}  [props.perWord]      ms between words (default 85)
 * @param {number}  [props.delay]        ms lead-in before the first word (default 0)
 * @param {string}  [props.trigger]      'mount' | 'inview' (default 'mount')
 * @param {() => void} [props.onComplete]
 */
export default function WriteOn({
  text,
  as = 'p',
  className = '',
  perWord = 85,
  delay = 0,
  trigger = 'mount',
  onComplete,
}) {
  const ref = useRef(null)
  const reduce = usePrefersReducedMotion()
  const words = text.split(' ')

  useEffect(() => {
    const root = ref.current
    if (!root) return
    const els = Array.from(root.querySelectorAll('.writeon-word'))
    if (els.length === 0) return

    if (reduce) {
      els.forEach((el) => {
        el.style.opacity = '1'
        el.style.setProperty('--wipe', '0')
        el.style.transform = 'none'
      })
      onComplete?.()
      return
    }

    let animation
    const run = () => {
      animation = animate(els, {
        opacity: [0, 1],
        translateY: [10, 0],
        '--wipe': [100, 0],
        duration: 460,
        delay: stagger(perWord, { start: delay }),
        ease: 'outExpo',
        onComplete: () => onComplete?.(),
      })
    }

    if (trigger === 'inview') {
      const io = new IntersectionObserver(
        (entries, obs) => {
          if (entries[0].isIntersecting) {
            obs.disconnect()
            run()
          }
        },
        { threshold: 0.25 },
      )
      io.observe(root)
      return () => {
        io.disconnect()
        animation?.pause?.()
      }
    }

    run()
    return () => animation?.pause?.()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduce, text])

  return createElement(
    as,
    { ref, className },
    words.map((w, i) => (
      <span
        key={i}
        className="writeon-word"
        style={{
          opacity: reduce ? 1 : 0,
          '--wipe': reduce ? 0 : 100,
          clipPath: 'inset(0 calc(var(--wipe, 0) * 1%) 0 0)',
        }}
      >
        {w}
        {i < words.length - 1 ? ' ' : ''}
      </span>
    )),
  )
}
