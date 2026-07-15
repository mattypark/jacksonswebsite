import WriteOn from './WriteOn'
import DrawnSVG from './DrawnSVG'
import { cta, identity } from '../data/content'

/**
 * "with love," + a self-drawing signature. The last thing on the page.
 */
export default function SignOff() {
  return (
    <section className="relative mx-auto flex w-full max-w-3xl flex-col items-end px-6 pb-28 pr-10 sm:pr-16">
      <WriteOn
        as="p"
        text={cta.signoff}
        trigger="inview"
        perWord={90}
        className="hand-title text-[clamp(1.4rem,1rem+1.6vw,2.2rem)] text-ink-soft"
      />
      <DrawnSVG
        slot="signature"
        trigger="inview"
        duration={2}
        delay={0.4}
        stagger={1.8}
        stroke="var(--color-ink)"
        strokeWidth={6}
        className="mt-1 w-[min(80vw,22rem)]"
        label={`${identity.name} signature`}
      />
    </section>
  )
}
