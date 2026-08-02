import DrawnSVG from './DrawnSVG'
import Doodle from './Doodle'
import PaperCard from './PaperCard'
import { services } from '../data/content'

/**
 * What Jackson does — one sheet of paper per service, laid out two-up and
 * offset so they overlap like notes pushed around a desk.
 *
 * This used to be a single `<ol>` running down one column, which made four
 * distinct offers read as one long block of text. The list semantics are kept:
 * it's still an ordered list, the sheets are just the list items.
 *
 * The headings are Jackson's real hand-lettering, not type. Each is an image
 * inside a real <h3>/<h4> whose text is visually hidden: the heading still exists
 * for screen readers, search engines, and find-in-page, while what you see is his
 * ink. Losing the semantic heading to a picture of a heading is not a trade worth
 * making.
 */

// Per-sheet tilt and vertical offset. Index-matched to `services` — the second
// column hangs lower so the sheets interlock instead of sitting in a neat grid.
const SHEETS = [
  { rotate: -0.7, offset: 'md:mt-0' },
  { rotate: 0.6, offset: 'md:mt-16' },
  { rotate: 0.5, offset: 'md:-mt-8' },
  { rotate: -0.5, offset: 'md:mt-8' },
]

export default function Services() {
  return (
    <div className="relative">
      <h3 className="relative mb-8 w-fit">
        <span className="sr-only">Services</span>
        <DrawnSVG
          slot="headingServices"
          trigger="inview"
          duration={0.9}
          className="w-[clamp(7rem,5rem+8vw,11rem)]"
        />
        <Doodle
          slot="doodleArrow"
          style={{ right: '-3.5rem', top: '0.25rem', width: '2.6rem', height: '2.6rem' }}
          drawDelay={0.3}
        />
      </h3>

      <ol className="grid grid-cols-1 gap-x-[clamp(1rem,2vw,2.5rem)] gap-y-[clamp(1.5rem,3vw,3rem)] md:grid-cols-2">
        {services.map((s, i) => {
          const sheet = SHEETS[i % SHEETS.length]
          return (
            <li key={i} className={sheet.offset}>
              <PaperCard rotate={sheet.rotate} lift={i % 2 === 1} className="h-full">
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
                <p className="mt-4 text-ink-soft">{s.body}</p>
                {s.caseStudies?.length > 0 && (
                  <div className="mt-4">
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
              </PaperCard>
            </li>
          )
        })}
      </ol>
    </div>
  )
}
