import DrawnSVG from './DrawnSVG'
import VideoCard from './VideoCard'
import { collaborations, videos } from '../data/content'

/**
 * Left column of page 2 — the brands Jackson has worked with (his drawn logos,
 * boiling) and a scatter of short-form clips with view badges.
 */
export default function Collaborations() {
  return (
    <div className="relative">
      <h3 className="mb-6">
        <span className="sr-only">Collaborations</span>
        <DrawnSVG
          slot="headingCollaborations"
          trigger="inview"
          duration={0.9}
          className="w-[clamp(11rem,8rem+12vw,17rem)]"
        />
      </h3>

      <ul className="mb-10 space-y-4">
        {collaborations.map((c, i) => (
          <li key={c.name} className="flex items-center gap-4">
            {/* Square box: the logo loops are a square 1920² canvas. */}
            <span className="flex h-14 w-14 shrink-0 items-center justify-center">
              <DrawnSVG
                slot={c.logoSlot}
                trigger="inview"
                duration={0.9}
                delay={i * 0.12}
                className="h-full w-full"
                label={`${c.name} logo`}
              />
            </span>
            <span className="hand-title text-[clamp(1.4rem,1rem+1.4vw,2.2rem)] text-ink-soft">
              {c.name}
            </span>
          </li>
        ))}
      </ul>

      {/* clip scatter */}
      <div className="flex flex-wrap gap-x-6 gap-y-10 pr-2">
        {videos.map((v, i) => (
          <VideoCard key={v.id} video={v} rotate={[-3, 2, -1.5, 2.5][i % 4]} />
        ))}
      </div>
    </div>
  )
}
