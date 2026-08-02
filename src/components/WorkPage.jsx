import Collaborations from './Collaborations'
import Services from './Services'
import Reel from './Reel'
import AboutPanel from './AboutPanel'
import PaperCard from './PaperCard'
import { workHeading } from '../data/content'

/**
 * The work, in sections.
 *
 * Was two tall columns on one shared surface inside a max-w-6xl gutter, which
 * left most of a wide screen empty and made everything read as one continuous
 * document. Now it's three bands of paper sheets across a much wider container:
 *
 *   1. collaborations — logo list on its own sheet
 *   2. services       — one offset sheet per offer, two-up
 *   3. reel + about   — clip grid beside the taped photo of Jackson
 *
 * Every animation is unchanged; only where things sit has moved.
 */
export default function WorkPage() {
  return (
    <section
      aria-labelledby="work-heading"
      className="relative mx-auto w-full max-w-[105rem] px-[clamp(1rem,4vw,4.5rem)] pb-24 pt-[clamp(2.5rem,5vw,5rem)]"
    >
      <h2 id="work-heading" className="sr-only">
        {workHeading}
      </h2>

      <div className="flex flex-col gap-[clamp(3rem,6vw,7rem)]">
        {/* 1 — collaborations. Narrow sheet, pushed left: it's a list of four
            names and shouldn't stretch to the full width just because it can. */}
        <PaperCard rotate={-0.6} className="w-full max-w-md">
          <Collaborations />
        </PaperCard>

        {/* 2 — services */}
        <Services />

        {/* 3 — the reel, with Jackson taped up beside it */}
        <div className="grid grid-cols-1 items-center gap-[clamp(2rem,4vw,4rem)] lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)]">
          <Reel />
          <PaperCard rotate={0.8} lift className="lg:mt-10">
            <AboutPanel />
          </PaperCard>
        </div>
      </div>
    </section>
  )
}
