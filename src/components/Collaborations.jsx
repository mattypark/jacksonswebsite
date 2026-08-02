import DrawnSVG from './DrawnSVG'
import { collaborations } from '../data/content'

/**
 * The brands Jackson has worked with — his drawn logos, boiling.
 *
 * The clip scatter used to live here too. It moved out to `Reel` so the logos
 * can sit on their own sheet: a list of four names doesn't need the same
 * width as a grid of video cards.
 */
export default function Collaborations() {
  return (
    <div className="relative">
      <h3 className="mb-6">
        <span className="sr-only">Collaborations</span>
        <DrawnSVG
          slot="headingCollaborations"
          trigger="inview"
          duration={0.9}
          className="w-[clamp(11rem,8rem+12vw,17rem)]"
        />
      </h3>

      <ul className="space-y-4">
        {collaborations.map((c, i) => (
          <li key={c.name} className="flex items-center gap-4">
            {/* Square box: the logo loops are a square 1920² canvas. */}
            <span className="flex h-14 w-14 shrink-0 items-center justify-center">
              <DrawnSVG
                slot={c.logoSlot}
                trigger="inview"
                duration={0.9}
                delay={i * 0.12}
                className="h-full w-full"
                label={`${c.name} logo`}
              />
            </span>
            <span className="hand-title text-[clamp(1.4rem,1rem+1.4vw,2.2rem)] text-ink-soft">
              {c.name}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}
