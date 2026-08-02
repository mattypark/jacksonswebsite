import { lazy, Suspense } from 'react'
import { useLenis } from './hooks/useLenis'
import NameHeader from './components/NameHeader'
import WorkPage from './components/WorkPage'
import ApplyCTA from './components/ApplyCTA'
import SignOff from './components/SignOff'
import SignatureCapture from './components/SignatureCapture'
import PaperCard from './components/PaperCard'

const PaperAtmosphere = lazy(() => import('./components/PaperAtmosphere'))

/**
 * Name, then work. Nothing between them.
 *
 * The site used to open on a full-screen hero (intro lines, taped photo,
 * artist line) and a scroll-scrubbed crumple before the work page. It's all
 * gone: HeroPage, TapedPhoto, ArtistLine and CrumpleTransition are still in
 * the repo but nothing renders them.
 */
export default function App() {
  useLenis()

  // Drawing-capture tool lives at /?sign
  if (typeof window !== 'undefined' && window.location.search.includes('sign')) {
    return <SignatureCapture />
  }

  return (
    <>
      <Suspense fallback={null}>
        <PaperAtmosphere />
      </Suspense>

      <NameHeader />

      {/* The desk. Individual blocks are their own sheets of paper (PaperCard),
          so the surface underneath them is the grey wall/desk the whole site
          sits on — not another sheet. */}
      <main className="desk-surface relative">
        <WorkPage />

        <div className="mx-auto w-full max-w-[105rem] px-[clamp(1rem,4vw,4.5rem)] pb-24">
          <PaperCard rotate={-0.4}>
            <ApplyCTA />
            <SignOff />
          </PaperCard>
        </div>
      </main>
    </>
  )
}
