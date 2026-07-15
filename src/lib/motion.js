// Shared motion constants. Journal-paced — unhurried, a little springy.

export const EASE = [0.16, 1, 0.3, 1]
export const EASE_CSS = 'cubic-bezier(0.16, 1, 0.3, 1)'

// A pen-nib overshoot for marks that "snap" into place.
export const EASE_INK = [0.34, 1.56, 0.64, 1]

export const fadeUp = {
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE } },
}

export const viewport = { once: true, margin: '-12% 0px -8% 0px' }

// Words settle in with a light spring, like ink drying.
export const inkWord = {
  hidden: { opacity: 0, y: 18, rotate: -2 },
  show: {
    opacity: 1,
    y: 0,
    rotate: 0,
    transition: { type: 'spring', stiffness: 380, damping: 18, mass: 0.7 },
  },
}

export const inkStagger = (delayChildren = 0) => ({
  hidden: {},
  show: { transition: { staggerChildren: 0.06, delayChildren } },
})
