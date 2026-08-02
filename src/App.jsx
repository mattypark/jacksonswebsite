import { lazy, Suspense } from 'react'
import { useLenis } from './hooks/useLenis'
import NameHeader from './components/NameHeader'
import WorkPage from './components/WorkPage'
import ApplyCTA from './components/ApplyCTA'
import SignOff from './components/SignOff'
import SignatureCapture from './components/SignatureCapture'

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

      <main className="paper-surface ruled relative">
        <WorkPage />
        <ApplyCTA />
        <SignOff />
      </main>
    </>
  )
}
