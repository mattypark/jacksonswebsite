import { useEffect } from 'react'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/**
 * Smooth momentum scroll wired to GSAP ScrollTrigger on a single RAF loop.
 *
 * Lenis is driven by gsap.ticker (NOT its own requestAnimationFrame), so there
 * is exactly one animation loop and ScrollTrigger stays in lockstep with the
 * smoothed scroll position. Disabled entirely under reduced-motion — the page
 * then uses native scroll and ScrollTrigger reads window scroll directly.
 */
export function useLenis() {
  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) {
      ScrollTrigger.refresh()
      return
    }

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    })

    lenis.on('scroll', ScrollTrigger.update)

    const onTick = (time) => {
      // gsap.ticker time is in seconds; Lenis wants milliseconds.
      lenis.raf(time * 1000)
    }
    gsap.ticker.add(onTick)
    gsap.ticker.lagSmoothing(0)

    ScrollTrigger.refresh()

    return () => {
      lenis.off('scroll', ScrollTrigger.update)
      gsap.ticker.remove(onTick)
      lenis.destroy()
    }
  }, [])
}
