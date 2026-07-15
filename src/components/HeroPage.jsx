import { useState } from 'react'
import WriteOn from './WriteOn'
import RoleStrikeList from './RoleStrikeList'
import DrawnSVG from './DrawnSVG'
import Doodle from './Doodle'
import { intro } from '../data/content'

/**
 * Journal page 1. "Hey, my name is Jackson Sword..." writes in, then the roles
 * strike-list plays. A self-portrait doodle sits top-right; doodles scatter.
 */
export default function HeroPage() {
  // Gate the roles list until the intro finishes writing.
  const [introDone, setIntroDone] = useState(false)

  return (
    <section
      aria-labelledby="hero-heading"
      className="relative mx-auto flex min-h-[100svh] w-full max-w-6xl flex-col justify-center px-6 py-16 sm:px-10 md:px-16"
    >
      {/* self-portrait doodle, top-right */}
      <div className="pointer-events-none absolute right-4 top-10 w-24 rotate-6 sm:right-10 sm:top-14 sm:w-36 md:w-44">
        <DrawnSVG
          slot="faceDrawing"
          trigger="mount"
          delay={0.4}
          duration={1.1}
          stagger={0.28}
          stroke="var(--color-ink)"
          strokeWidth={5}
          className="h-full w-full"
          label="A hand-drawn portrait of Jackson Sword"
        />
        <span className="label mt-1 block text-center text-faint">it's me</span>
      </div>

      {/* Scattered doodles — Jackson's boil loops. Source art is a square 1920²
          canvas with the mark centred, so keep the boxes square: a non-square box
          just letterboxes it. */}
      <Doodle slot="doodleStar" style={{ left: '2%', top: '20%', width: '2.6rem', height: '2.6rem' }} drawDelay={1.2} />
      <Doodle slot="doodleSword" style={{ right: '6%', bottom: '16%', width: '3.6rem', height: '3.6rem' }} drawDelay={1.6} />
      <Doodle slot="doodleSpiral" style={{ left: '8%', bottom: '10%', width: '2.6rem', height: '2.6rem' }} drawDelay={2} />
      <Doodle slot="doodleArrow" style={{ right: '20%', top: '12%', width: '3rem', height: '3rem' }} drawDelay={2.4} />
      <Doodle slot="doodleCurvedArrow" style={{ left: '16%', top: '8%', width: '2.8rem', height: '2.8rem' }} drawDelay={2.8} />
      <Doodle slot="doodleHashtag" style={{ right: '2%', top: '42%', width: '2.4rem', height: '2.4rem' }} drawDelay={3.2} />

      <header className="max-w-3xl">
        <WriteOn
          as="p"
          text={intro.greeting}
          className="hand-hero mb-2 text-[clamp(2.4rem,1.4rem+5vw,5rem)] text-ink"
          perWord={90}
        />
        <h1 id="hero-heading" className="sr-only">
          Jackson Sword — multifaceted artist
        </h1>
        <WriteOn
          as="p"
          text={intro.lines[0]}
          className="hand-title text-[clamp(1.5rem,0.9rem+3vw,2.8rem)] text-ink-soft"
          delay={420}
          perWord={70}
        />
        <WriteOn
          as="p"
          text={intro.lines[1]}
          className="hand-title mb-8 text-[clamp(1.5rem,0.9rem+3vw,2.8rem)] text-ink-soft"
          delay={1000}
          perWord={55}
          onComplete={() => setIntroDone(true)}
        />
      </header>

      {introDone && <RoleStrikeList startDelay={0.15} />}
    </section>
  )
}
