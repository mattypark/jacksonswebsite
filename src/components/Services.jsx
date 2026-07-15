import DrawnSVG from './DrawnSVG'
import Doodle from './Doodle'
import { services } from '../data/content'

/**
 * Right column of page 2 — what Jackson does, penned as journal notes with
 * bulleted sub-points.
 *
 * The headings are Jackson's real hand-lettering, not type. Each is an image
 * inside a real <h3>/<h4> whose text is visually hidden: the heading still exists
 * for screen readers, search engines, and find-in-page, while what you see is his
 * ink. Losing the semantic heading to a picture of a heading is not a trade worth
 * making.
 */
export default function Services() {
  return (
    <div className="relative">
      <h3 className="mb-6">
        <span className="sr-only">Services</span>
        <DrawnSVG
          slot="headingServices"
          trigger="inview"
          duration={0.9}
          className="w-[clamp(7rem,5rem+8vw,11rem)]"
        />
      </h3>

      <Doodle
        slot="doodleArrow"
        style={{ right: '-1rem', top: '-0.5rem', width: '2.6rem', height: '2.6rem' }}
        drawDelay={0.3}
      />

      <ol className="space-y-7">
        {services.map((s, i) => (
          <li key={i} className="relative">
            {/* Width-driven: these are ~800px of lettering on a ~90px-tall canvas.
                Sized by height they'd render smaller than the body copy under them. */}
            <h4 className="leading-tight">
              <span className="sr-only">{s.title}</span>
              <DrawnSVG
                slot={s.titleSlot}
                trigger="inview"
                duration={1.1}
                delay={0.1}
                className="w-[min(100%,30rem)]"
              />
            </h4>
            <p className="mt-3 max-w-prose text-ink-soft">{s.body}</p>
            <ul className="mt-2 space-y-1 pl-5">
              {s.points.map((p, pi) => (
                <li key={pi} className="relative text-muted">
                  <span
                    className="absolute -left-4 top-2 h-1.5 w-1.5 rounded-full bg-rust"
                    aria-hidden="true"
                  />
                  {p}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ol>
    </div>
  )
}
