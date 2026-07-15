import { useEffect, useState } from 'react'

const QUERY = '(prefers-reduced-motion: reduce)'

// Read synchronously so the very first render already has the correct value —
// animation effects must never fire once with the wrong preference and then
// flip, which would leave GSAP's reverted inline styles fighting React.
function initialReduced() {
  if (typeof window === 'undefined' || !window.matchMedia) return false
  return window.matchMedia(QUERY).matches
}

/**
 * Tracks the user's reduced-motion preference, reactively.
 */
export function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(initialReduced)

  useEffect(() => {
    const mq = window.matchMedia(QUERY)
    setReduced(mq.matches)
    const onChange = (e) => setReduced(e.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  return reduced
}
