import WriteOn from './WriteOn'
import DrawnSVG from './DrawnSVG'
import Doodle from './Doodle'
import { cta, identity } from '../data/content'

/**
 * Closing call-to-action. The lead line writes in, then a hand-drawn ellipse
 * loops itself around the word "apply", which is the link/button.
 */
export default function ApplyCTA() {
  return (
    <section
      aria-labelledby="apply-lead"
      className="relative mx-auto flex w-full max-w-3xl flex-col items-center px-6 pb-20 pt-10 text-center"
    >
      <WriteOn
        as="p"
        id="apply-lead"
        text={cta.lead}
        trigger="inview"
        perWord={60}
        className="hand-title text-[clamp(1.5rem,1rem+2.4vw,2.6rem)] leading-snug text-ink"
      />

      <a
        href={identity.applyHref}
        className="group relative mt-12 inline-flex items-center justify-center px-14 py-6 transition-transform duration-300 ease-out-expo hover:-rotate-1 hover:scale-[1.03]"
      >
        {/* Self-drawing ellipse. Still a placeholder stroke — Jackson sent the WORD
            "apply" but no circle around it, so this one keeps its real pen draw-on. */}
        <DrawnSVG
          slot="applyCircle"
          trigger="inview"
          duration={1}
          delay={0.4}
          stroke="var(--color-pen)"
          strokeWidth={4}
          className="pointer-events-none absolute inset-0 h-full w-full overflow-visible transition-colors"
        />
        {/* Jackson's handwriting. The link still needs an accessible name. */}
        <span className="sr-only">{cta.button}</span>
        <DrawnSVG
          slot="applyWord"
          trigger="inview"
          duration={0.8}
          delay={0.5}
          className="w-[clamp(6rem,4rem+6vw,9rem)]"
        />
        <Doodle
          slot="doodleStar"
          style={{ right: '-1.5rem', top: '-1rem', width: '2rem', height: '2rem' }}
          drawDelay={1.2}
        />
      </a>
    </section>
  )
}
