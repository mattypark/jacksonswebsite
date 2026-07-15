import WriteOn from './WriteOn'
import Collaborations from './Collaborations'
import Services from './Services'
import { workHeading } from '../data/content'

/**
 * The page-2 title card — revealed by the page turn. A centered journal
 * heading on the fresh page.
 */
export function WorkCover() {
  return (
    <div className="paper-surface ruled flex h-[100svh] w-full items-center justify-center px-6">
      <WriteOn
        as="h2"
        text={workHeading}
        className="hand-hero max-w-4xl text-center text-[clamp(2rem,1.1rem+4.5vw,4rem)] leading-tight text-ink"
      />
    </div>
  )
}

/**
 * Page-2 body — two journal columns: what Jackson's done (Collaborations) and
 * what he can do (Services). Collapses to one column below md.
 */
export default function WorkPage() {
  return (
    <section
      aria-labelledby="work-heading"
      className="relative mx-auto w-full max-w-6xl px-6 pb-24 pt-10 sm:px-10 md:px-16"
    >
      <h2 id="work-heading" className="sr-only">
        {workHeading}
      </h2>
      <div className="grid grid-cols-1 gap-x-14 gap-y-16 md:grid-cols-2">
        <Collaborations />
        <Services />
      </div>
    </section>
  )
}
