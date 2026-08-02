import WriteOn from './WriteOn'
import Doodle from './Doodle'
import { identity } from '../data/content'

/**
 * The whole top of the site: his name written on the studio wall, and then
 * straight into the work.
 *
 * Replaces the old hero — the intro, the taped photo, the artist line and the
 * crumple transition all lived above the work page and delayed it. The name is
 * the only thing that needs saying before the work speaks.
 *
 * The wall is grey so the paper sheet below reads as a sheet sitting on it.
 */
export default function NameHeader() {
  const [first, last] = identity.name.toLowerCase().split(' ')

  return (
    <header className="relative flex min-h-[46svh] w-full items-center justify-center overflow-hidden px-6 py-16 sm:min-h-[52svh]">
      {/* studio wall */}
      <div aria-hidden="true" className="desk-surface absolute inset-0" />
      {/* one soft light source across the wall */}
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          backgroundImage:
            'radial-gradient(circle at 30% 20%, rgba(255,255,255,0.14), transparent 55%)',
        }}
      />

      <h1 className="relative text-center">
        <span className="sr-only">{identity.name} — multifaceted artist</span>

        {/* The star is the mark he signs his name with, so it hangs off the
            first letter rather than sitting on its own line. */}
        <span aria-hidden="true" className="relative inline-block">
          <Doodle
            slot="doodleStar"
            trigger="mount"
            className="-left-6 -top-5 sm:-left-10 sm:-top-7"
            // The star slots are flat PNG/video art, so `stroke` doesn't reach
            // them — inverting is how black line work becomes white on the wall.
            style={{ width: '2.4rem', height: '2.4rem', filter: 'invert(1)' }}
            drawDelay={0.5}
          />
          <WriteOn
            as="span"
            text={first}
            className="hand-hero block text-[clamp(3rem,1.4rem+8vw,7.5rem)] leading-[0.92] text-paper"
            perWord={0}
          />
          <WriteOn
            as="span"
            text={last}
            className="hand-hero block pl-[0.35em] text-[clamp(3rem,1.4rem+8vw,7.5rem)] leading-[0.92] text-paper"
            delay={260}
            perWord={0}
            // shoot.mjs waits on this before capturing
            onComplete={() => {
              window.__heroDone = true
            }}
          />
        </span>
      </h1>
    </header>
  )
}
