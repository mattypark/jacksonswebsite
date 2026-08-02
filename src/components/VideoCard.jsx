import { useEffect, useRef, useState } from 'react'
import DrawnSVG from './DrawnSVG'

/**
 * A short-form video card, poster-first. If a real mp4 is supplied it plays on
 * intersection; otherwise a titled placeholder stands in. A paper texture is
 * multiplied over the top so clips read as pasted into the journal, with a
 * tape-corner doodle and a hand-drawn view-count badge.
 *
 * @param {object} props
 * @param {{ id, title, poster, src?, views, reach }} props.video
 * @param {number} [props.rotate]  degrees of playful tilt
 */
export default function VideoCard({ video, rotate = 0 }) {
  const videoRef = useRef(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const el = videoRef.current
    if (!el || !video.src) return
    const io = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting)
        if (entry.isIntersecting) el.play?.().catch(() => {})
        else el.pause?.()
      },
      { threshold: 0.4 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [video.src])

  return (
    <figure
      // Grows with the viewport — at a fixed 190px the grid left most of a wide
      // screen empty next to the sheets it sits beside.
      className="relative w-full max-w-[clamp(11rem,15vw,17rem)] shrink-0"
      style={{ transform: `rotate(${rotate}deg)` }}
    >
      <div className="relative aspect-[9/16] overflow-hidden rounded-[10px] bg-paper-deep shadow-[var(--shadow-tape)] ring-1 ring-line">
        {video.src ? (
          <video
            ref={videoRef}
            className="h-full w-full object-cover"
            src={video.src}
            poster={video.poster ?? undefined}
            muted
            loop
            playsInline
            preload="metadata"
          />
        ) : (
          // Placeholder "clip" — a warm gradient with the title penned on.
          <div className="flex h-full w-full flex-col justify-end bg-[linear-gradient(165deg,#8f8f8f,#4a4a4a_60%,#242424)] p-3">
            <span className="scrawl text-[0.95rem] leading-tight text-paper drop-shadow">
              {video.title}
            </span>
          </div>
        )}

        {/* paper multiply overlay — blends the clip into the page */}
        <div
          className="pointer-events-none absolute inset-0 opacity-40 mix-blend-multiply"
          style={{
            backgroundImage: 'var(--paper-image)',
            backgroundSize: 'cover',
          }}
          aria-hidden="true"
        />

        {/* tape corner */}
        <div
          className="pointer-events-none absolute -left-2 -top-2 h-8 w-14 -rotate-45 bg-[rgba(255,255,255,0.62)] shadow-sm"
          aria-hidden="true"
        />
      </div>

      {/* hand-drawn view-count badge */}
      <figcaption className="absolute -bottom-4 -right-3 flex h-16 w-16 items-center justify-center">
        <DrawnSVG
          slot="badgeCircle"
          trigger="inview"
          duration={0.8}
          stroke="var(--color-rust)"
          strokeWidth={5}
          className="absolute inset-0 h-full w-full"
        />
        <span className="hand-title text-center text-[0.9rem] leading-none text-ink">
          {video.views}
          <span className="block text-[0.6rem] text-muted">views</span>
        </span>
      </figcaption>
    </figure>
  )
}
