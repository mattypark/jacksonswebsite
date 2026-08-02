import TapedPhoto from './TapedPhoto'
import WriteOn from './WriteOn'
import { heroPhoto } from '../data/content'

/**
 * Jackson himself, taped to a sheet on the right of the reel — the one bit of
 * "who am I" left after the hero came off the homepage. The caption does the
 * work the old intro line used to do, in six words.
 */
export default function AboutPanel() {
  return (
    <div className="flex flex-col items-center gap-6">
      <TapedPhoto
        src={heroPhoto.src}
        alt={heroPhoto.alt}
        rotate={1.5}
        className="!w-[clamp(11rem,9rem+10vw,19rem)]"
      />
      <WriteOn
        as="p"
        text={heroPhoto.caption}
        trigger="inview"
        perWord={70}
        className="hand-title text-center text-[clamp(1.1rem,0.85rem+1.1vw,1.7rem)] text-ink-soft"
      />
    </div>
  )
}
