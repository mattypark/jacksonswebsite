import { useState } from 'react'

/**
 * A photo stuck to the page with two strips of tape, corner-to-corner. Sits
 * mid-hero between the intro line and the artist line.
 *
 * The image is a swappable slot: if `src` 404s (or is left empty) the frame
 * falls back to a ruled placeholder rather than a broken-image icon, so the
 * layout is final before the real photo exists.
 *
 * Tape is neutral matte, not the blue from the mockup — the palette went all
 * black-and-white so Jackson's line work carries the only contrast.
 *
 * @param {object}  props
 * @param {string}  props.src
 * @param {string} [props.alt]
 * @param {string} [props.className]
 * @param {number} [props.rotate]  degrees of tilt on the photo (default -1.5)
 */
export default function TapedPhoto({ src, alt = '', className = '', rotate = -1.5 }) {
  const [failed, setFailed] = useState(false)

  return (
    <figure
      className={`relative w-[clamp(9rem,7rem+9vw,15rem)] ${className}`}
      style={{ transform: `rotate(${rotate}deg)` }}
    >
      {/* tape — straddling the top-left and bottom-right corners */}
      <Tape className="left-0 top-0" angle={-42} />
      <Tape className="left-full top-full" angle={-42} />

      <div
        className="relative aspect-[4/5] w-full overflow-hidden bg-paper-deep"
        style={{ boxShadow: 'var(--shadow-page)' }}
      >
        {failed || !src ? (
          <div
            className="ruled flex h-full w-full items-center justify-center bg-paper-deep"
            aria-hidden="true"
          >
            <span className="label text-faint">photo</span>
          </div>
        ) : (
          <img
            src={src}
            alt={alt}
            width={480}
            height={600}
            loading="eager"
            // lowercase: React 18 doesn't map the camelCase form to the attribute
            fetchpriority="high"
            onError={() => setFailed(true)}
            className="h-full w-full object-cover"
          />
        )}
      </div>
    </figure>
  )
}

/** One strip of matte tape. Translucent so the paper grain reads through it. */
function Tape({ className = '', angle = 0 }) {
  return (
    <span
      aria-hidden="true"
      className={`pointer-events-none absolute z-10 block h-5 w-24 sm:h-6 sm:w-28 ${className}`}
      style={{
        // centre the strip on the corner it's anchored to, then angle it
        transform: `translate(-50%, -50%) rotate(${angle}deg)`,
        background:
          'linear-gradient(180deg, rgba(255,255,255,0.66), rgba(210,210,210,0.6) 55%, rgba(255,255,255,0.5))',
        boxShadow: 'var(--shadow-tape)',
        // torn-ish ends
        clipPath:
          'polygon(2% 0%, 98% 4%, 100% 96%, 3% 100%, 0% 52%)',
        mixBlendMode: 'multiply',
      }}
    />
  )
}
