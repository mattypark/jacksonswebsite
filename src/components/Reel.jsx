import VideoCard from './VideoCard'
import { videos } from '../data/content'

/**
 * The clip grid. Two up, so four clips read as one block of work rather than a
 * loose scatter down the left margin — it sits beside `AboutPanel`.
 *
 * Each card keeps its own tilt and its own in-view play behaviour.
 */
export default function Reel() {
  return (
    <div className="grid grid-cols-2 gap-x-[clamp(1rem,2.5vw,2.5rem)] gap-y-[clamp(1.5rem,3vw,3rem)] justify-items-center">
      {videos.map((v, i) => (
        <VideoCard key={v.id} video={v} rotate={[-3, 2, -1.5, 2.5][i % 4]} />
      ))}
    </div>
  )
}
