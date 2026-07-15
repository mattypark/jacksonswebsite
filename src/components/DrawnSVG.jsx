import { motion } from 'framer-motion'
import { getStroke, getMedia } from '../assets/drawings/manifest'
import { EASE } from '../lib/motion'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'
import DrawnMedia from './DrawnMedia'

/**
 * Renders any manifest slot, whichever kind it is.
 *
 * A stroke slot draws itself as SVG (framer-motion pathLength), paths in array
 * order. A media slot is Jackson's real art and is handed to DrawnMedia. Call
 * sites don't care which — that's the point: a slot can be swapped from
 * placeholder stroke to real art without touching the component using it.
 *
 * `stroke` / `strokeWidth` / `stagger` apply to stroke slots only; media slots
 * ignore them (raster ink has its own color and weight baked in).
 *
 * @param {object}   props
 * @param {string}   props.slot         manifest slot name (e.g. "signature")
 * @param {string}  [props.trigger]     'mount' | 'inview' | 'hold'  (default 'mount')
 *                                       'hold' renders undrawn until `draw` is true
 * @param {boolean} [props.draw]        controlled draw state for trigger='hold'
 * @param {string}  [props.stroke]      CSS color (default var(--color-ink))
 * @param {number}  [props.strokeWidth] in viewBox units (default 6)
 * @param {number}  [props.duration]    per-path draw seconds (default 1.4)
 * @param {number}  [props.delay]       lead-in seconds (default 0)
 * @param {number}  [props.stagger]     seconds between paths (default 0.35)
 * @param {() => void} [props.onDone]   fires when the last path finishes
 * @param {string}  [props.className]
 * @param {string}  [props.label]       accessible name; omit → decorative (aria-hidden)
 */
export default function DrawnSVG({
  slot,
  trigger = 'mount',
  draw = false,
  stroke = 'var(--color-ink)',
  strokeWidth = 6,
  duration = 1.4,
  delay = 0,
  stagger = 0.35,
  onDone,
  className = '',
  label,
}) {
  const reduce = usePrefersReducedMotion()

  const mediaData = getMedia(slot)
  if (mediaData) {
    return (
      <DrawnMedia
        data={mediaData}
        trigger={trigger}
        draw={draw}
        duration={duration}
        delay={delay}
        onDone={onDone}
        className={className}
        label={label}
      />
    )
  }

  const data = getStroke(slot)
  if (!data) return null

  const decorative = !label
  const lastIndex = data.paths.length - 1

  // Resolve the target draw state per trigger mode.
  const animateProp = (i) => {
    const full = { pathLength: 1, opacity: 1 }
    if (reduce) return full
    if (trigger === 'hold') return draw ? full : { pathLength: 0, opacity: 1 }
    if (trigger === 'inview') return undefined // handled by whileInView
    return full // 'mount'
  }

  const transition = (i) =>
    reduce
      ? { duration: 0 }
      : {
          pathLength: { duration, ease: EASE, delay: delay + i * stagger },
          opacity: { duration: 0.01, delay: delay + i * stagger },
        }

  return (
    <svg
      viewBox={data.viewBox}
      className={className}
      fill="none"
      stroke={stroke}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      role={decorative ? undefined : 'img'}
      aria-label={decorative ? undefined : label}
      aria-hidden={decorative ? 'true' : undefined}
    >
      {data.paths.map((d, i) => (
        <motion.path
          key={i}
          d={d}
          initial={reduce ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 1 }}
          animate={animateProp(i)}
          whileInView={trigger === 'inview' && !reduce ? { pathLength: 1, opacity: 1 } : undefined}
          viewport={trigger === 'inview' ? { once: true, margin: '-10% 0px -10% 0px' } : undefined}
          transition={transition(i)}
          onAnimationComplete={i === lastIndex ? onDone : undefined}
        />
      ))}
    </svg>
  )
}
