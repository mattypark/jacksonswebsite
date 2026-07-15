// Verification screenshots. Usage:
//   node scripts/shoot.mjs [reduced]
//   URL=http://127.0.0.1:5180 node scripts/shoot.mjs
// Captures hero (after timeline), page-turn mid, work columns, apply CTA
// at 3 breakpoints into ./screenshots/.
//
// URL is overridable because 5173 is often taken by another project — pointing
// this at the wrong app silently "passes" against someone else's site.
import { chromium } from 'playwright'
import { mkdirSync } from 'node:fs'

const BASE_URL = process.env.URL ?? 'http://localhost:5173/'
const reduced = process.argv.includes('reduced')
const outDir = 'screenshots'
mkdirSync(outDir, { recursive: true })
const tag = reduced ? 'rm-' : ''

const sizes = [
  { name: '375', w: 375, h: 812 },
  { name: '768', w: 768, h: 1024 },
  { name: '1440', w: 1440, h: 900 },
]

const browser = await chromium.launch()
for (const s of sizes) {
  const ctx = await browser.newContext({
    viewport: { width: s.w, height: s.h },
    deviceScaleFactor: 1,
    reducedMotion: reduced ? 'reduce' : 'no-preference',
  })
  const page = await ctx.newPage()
  const errors = []
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()))
  page.on('pageerror', (e) => errors.push(String(e)))

  await page.goto(BASE_URL, { waitUntil: 'networkidle' })

  // Wait for the hero timeline to finish (or 12s cap).
  await page
    .waitForFunction(() => window.__heroDone === true, { timeout: 12000 })
    .catch(() => {})
  await page.waitForTimeout(500)
  await page.screenshot({ path: `${outDir}/${tag}hero-${s.name}.png` })

  // Full page height for context.
  const scrollH = await page.evaluate(() => document.body.scrollHeight)

  // Mid page-turn (~ scroll into the pinned range).
  await page.evaluate((h) => window.scrollTo(0, h * 0.28), scrollH)
  await page.waitForTimeout(700)
  await page.screenshot({ path: `${outDir}/${tag}turn-${s.name}.png` })

  // Work columns (~ 55%).
  await page.evaluate((h) => window.scrollTo(0, h * 0.6), scrollH)
  await page.waitForTimeout(900)
  await page.screenshot({ path: `${outDir}/${tag}work-${s.name}.png` })

  // Bottom / apply CTA.
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
  await page.waitForTimeout(1100)
  await page.screenshot({ path: `${outDir}/${tag}apply-${s.name}.png` })

  // Horizontal-overflow guard.
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
  )
  console.log(`[${s.name}] hScroll=${overflow} errors=${errors.length}`, errors.slice(0, 3))
  await ctx.close()
}
await browser.close()
console.log('done', reduced ? '(reduced motion)' : '')
