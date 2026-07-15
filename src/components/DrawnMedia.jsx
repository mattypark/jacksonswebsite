import { useEffect, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { EASE } from '../lib/motion'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'

/**
 * Renders a manifest media-slot: Jackson's real art, as raster or video.
 *
 * Three reveal modes, set per slot in the manifest:
 *   'wipe'  — clip-path sweeps left→right so the drawing appears to be written.
 *             Used where the art is a mark that has a natural writing direction.
 *   'video' — the hand-drawn boil loop (VP9 + alpha). Plays only while in view.
 *   'fade'  — plain opacity, for marks with no direction to write in.
 *
 * Not called directly — DrawnSVG delegates here when a slot is media-backed,
 * so call sites keep using <DrawnSVG slot="..."> regardless of slot kind.
 */
export default function DrawnMedia({
  data,
  trigger = 'mount',
  draw = false,
  duration = 1.4,
  delay = 0,
  onDone,
  className = '',
  label,
}) {
  const reduce = usePrefersReducedMotion()
  const ref = useRef(null)
  const videoRef = useRef(null)
  const inView = useInView(ref, { once: false, margin: '-10% 0px -10% 0px' })

  const decorative = !label
  const a11y = decorative
    ? { 'aria-hidden': 'true' }
    : { role: 'img', 'aria-label': label }

  // Decoding 1920² video for a mark that renders at ~100px is pure waste when it
  // isn't on screen. Pause off-screen; honor reduced-motion by never playing.
  const isVideo = data.reveal === 'video' && !reduce
  useEffect(() => {
    const el = videoRef.current
    if (!el) return
    if (inView) {
      const play = el.play()
      // Autoplay can still be refused (low-power mode); the poster stays up.
      if (play?.catch) play.catch(() => {})
    } else {
      el.pause()
    }
  }, [inView, isVideo])

  // Width-driven, height auto: the art keeps its own aspect ratio and the caller
  // sizes it by width. Height-driven sizing shrinks wide hand-lettering to nothing.
  // object-left so lettering hangs off the left margin instead of centring in its
  // box; square doodles fill their box exactly, so it's a no-op for them.
  const fit = 'block w-full h-auto object-contain object-left'

  if (isVideo) {
    return (
      <span ref={ref} className={`block ${className}`} {...a11y}>
        <video
          ref={videoRef}
          src={data.video}
          poster={data.img}
          muted
          loop
          playsInline
          preload="none"
          className={fit}
        />
      </span>
    )
  }

  // Reduced motion, or a still-only slot: show the finished drawing, no motion.
  if (reduce) {
    return (
      <span ref={ref} className={`block ${className}`} {...a11y}>
        <img src={data.img} alt="" className={fit} />
      </span>
    )
  }

  const hidden =
    data.reveal === 'wipe'
      ? { clipPath: 'inset(0 100% 0 0)', opacity: 1 }
      : { opacity: 0 }
  const shown =
    data.reveal === 'wipe'
      ? { clipPath: 'inset(0 0% 0 0)', opacity: 1 }
      : { opacity: 1 }

  // 'hold' waits on the `draw` prop; 'inview' is driven by whileInView below.
  const animate = trigger === 'hold' ? (draw ? shown : hidden) : trigger === 'inview' ? undefined : shown

  return (
    <motion.span
      ref={ref}
      className={`block ${className}`}
      initial={hidden}
      animate={animate}
      whileInView={trigger === 'inview' ? shown : undefined}
      viewport={trigger === 'inview' ? { once: true, margin: '-10% 0px -10% 0px' } : undefined}
      transition={{ duration, ease: EASE, delay }}
      onAnimationComplete={onDone}
      {...a11y}
    >
      <img src={data.img} alt="" className={fit} />
    </motion.span>
  )
}
