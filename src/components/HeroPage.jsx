import { useState } from 'react'
import WriteOn from './WriteOn'
import ArtistLine from './ArtistLine'
import TapedPhoto from './TapedPhoto'
import DrawnSVG from './DrawnSVG'
import Doodle from './Doodle'
import { intro, heroPhoto } from '../data/content'

/**
 * Journal page 1, short version. "hey," / one intro line that trails off into a
 * taped photo / "multifaceted artist :)" underneath. The old opening spent five
 * struck job titles and two intro lines getting here — this says it once.
 */
export default function HeroPage() {
  // Gate the artist line until the intro finishes writing.
  const [introDone, setIntroDone] = useState(false)

  return (
    <section
      aria-labelledby="hero-heading"
      className="relative mx-auto flex min-h-[100svh] w-full max-w-6xl flex-col justify-center px-6 py-16 sm:px-10 md:px-16"
    >
      {/* self-portrait doodle, top-right */}
      <div className="pointer-events-none absolute right-4 top-10 w-20 rotate-6 sm:right-10 sm:top-14 sm:w-32 md:w-40">
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
      {/* star sits in the greeting's left margin — no margin to sit in on phones */}
      <Doodle slot="doodleStar" className="hidden sm:block" style={{ left: '2%', top: '22%', width: '2.6rem', height: '2.6rem' }} drawDelay={1.2} />
      <Doodle slot="doodleSword" style={{ right: '7%', bottom: '14%', width: '3.6rem', height: '3.6rem' }} drawDelay={1.6} />
      <Doodle slot="doodleSpiral" style={{ left: '7%', bottom: '12%', width: '2.6rem', height: '2.6rem' }} drawDelay={2} />
      <Doodle slot="doodleCurvedArrow" style={{ left: '15%', top: '9%', width: '2.8rem', height: '2.8rem' }} drawDelay={2.4} />
      <Doodle slot="doodleHashtag" style={{ right: '3%', top: '46%', width: '2.4rem', height: '2.4rem' }} drawDelay={2.8} />

      <h1 id="hero-heading" className="sr-only">
        Jackson Sword — multifaceted artist
      </h1>

      {/* Intro: greeting hangs left, the line indents under it and trails off. */}
      <header className="max-w-4xl">
        <WriteOn
          as="p"
          text={intro.greeting}
          className="hand-hero mb-1 text-[clamp(2.2rem,1.3rem+4.6vw,4.4rem)] text-ink"
          perWord={90}
        />
        <WriteOn
          as="p"
          text={intro.line}
          className="hand-title ml-[6%] text-[clamp(1.35rem,0.8rem+2.6vw,2.5rem)] text-ink-soft"
          delay={420}
          perWord={55}
          onComplete={() => setIntroDone(true)}
        />
      </header>

      {/* Photo answers the trailing "...", artist line answers the photo. */}
      <div className="mt-10 flex flex-col items-center gap-8 sm:mt-14">
        <TapedPhoto src={heroPhoto.src} alt={heroPhoto.alt} />
        <div className="min-h-[3.5rem]">{introDone && <ArtistLine startDelay={0.15} />}</div>
      </div>
    </section>
  )
}
