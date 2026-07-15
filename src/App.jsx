import { lazy, Suspense } from 'react'
import { useLenis } from './hooks/useLenis'
import HeroPage from './components/HeroPage'
import PageTurn from './components/PageTurn'
import WorkPage, { WorkCover } from './components/WorkPage'
import ApplyCTA from './components/ApplyCTA'
import SignOff from './components/SignOff'
import SignatureCapture from './components/SignatureCapture'

const PaperAtmosphere = lazy(() => import('./components/PaperAtmosphere'))

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

      <PageTurn front={<HeroPage />} back={<WorkCover />} />

      <main className="paper-surface ruled relative">
        <WorkPage />
        <ApplyCTA />
        <SignOff />
      </main>
    </>
  )
}
