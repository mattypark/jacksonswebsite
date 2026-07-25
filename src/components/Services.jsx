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
            {/* Height-normalised so the four hand-lettered headings read as peers.
                Sizing by width made tall-aspect titles ("Personal Brand Consulting")
                balloon. Fixed height + auto width + max-w-full keeps them consistent
                and prevents overflow on narrow screens. The [&_img] overrides beat
                DrawnMedia's default w-full/h-auto (higher descendant specificity). */}
            <h4 className="leading-tight">
              <span className="sr-only">{s.title}</span>
              <div className="h-[clamp(2rem,1.2rem+2.2vw,3.4rem)] [&_img]:h-full [&_img]:w-auto [&_img]:max-w-full [&_img]:object-left">
                <DrawnSVG
                  slot={s.titleSlot}
                  trigger="inview"
                  duration={1.1}
                  delay={0.1}
                  className="h-full"
                />
              </div>
            </h4>
            <p className="mt-3 max-w-prose text-ink-soft">{s.body}</p>
            {s.caseStudies?.length > 0 && (
              <div className="mt-3">
                <span className="label">case studies</span>
                <ul className="mt-1.5 flex flex-wrap gap-x-2 gap-y-1.5">
                  {s.caseStudies.map((c) => {
                    const chip =
                      'inline-block rounded-full border px-3 py-1 text-[0.95em]'
                    // No href → plain chip (handle not yet supplied). Never ship a
                    // guessed social link.
                    return (
                      <li key={c.label}>
                        {c.href ? (
                          <a
                            href={c.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`${chip} border-ink/25 text-ink-soft transition-colors duration-200 hover:border-ink hover:text-ink`}
                          >
                            {c.label}
                          </a>
                        ) : (
                          <span className={`${chip} border-ink/15 text-muted`}>
                            {c.label}
                          </span>
                        )}
                      </li>
                    )
                  })}
                </ul>
              </div>
            )}
          </li>
        ))}
      </ol>
    </div>
  )
}
