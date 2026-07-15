import { useEffect, useRef } from 'react'
import { animate } from 'animejs'
import DrawnSVG from './DrawnSVG'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'

/**
 * A scattered decorative doodle: draws in (once), then breathes with a gentle
 * idle wiggle. Purely ornamental — always aria-hidden.
 *
 * @param {object} props
 * @param {string} props.slot          manifest stroke slot
 * @param {object} props.style         absolute-position styles (top/left/rotate via wrapper)
 * @param {string} [props.className]
 * @param {number} [props.drawDelay]   seconds before it draws (default 0)
 * @param {number} [props.strokeWidth] default 4
 * @param {string} [props.stroke]      default var(--color-pen)
 * @param {string} [props.trigger]     DrawnSVG trigger (default 'inview')
 */
export default function Doodle({
  slot,
  style,
  className = '',
  drawDelay = 0,
  strokeWidth = 4,
  stroke = 'var(--color-pen)',
  trigger = 'inview',
}) {
  const ref = useRef(null)
  const reduce = usePrefersReducedMotion()

  useEffect(() => {
    if (reduce || !ref.current) return
    const anim = animate(ref.current, {
      rotate: [-3, 3],
      translateY: [-2, 2],
      duration: 3600,
      ease: 'inOutSine',
      loop: true,
      alternate: true,
      delay: drawDelay * 1000 + 400,
    })
    return () => anim?.pause?.()
  }, [reduce, drawDelay])

  return (
    <span
      ref={ref}
      className={`pointer-events-none absolute inline-block ${className}`}
      style={style}
      aria-hidden="true"
    >
      <DrawnSVG
        slot={slot}
        trigger={trigger}
        delay={drawDelay}
        duration={0.9}
        stroke={stroke}
        strokeWidth={strokeWidth}
        className="h-full w-full"
      />
    </span>
  )
}
