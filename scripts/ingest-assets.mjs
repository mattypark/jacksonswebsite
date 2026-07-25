/**
 * Transcode Jackson's raw asset delivery into web-ready files.
 *
 *   incoming/asset sheet/            (gitignored, 1.4 GB of ProRes + PNG)
 *     Animated/*.mov   qtrle ARGB 1920x1920  ->  public/videos/*.webm   (VP9 + alpha)
 *                                            ->  public/drawings/*.png  (poster frame)
 *     *.png            small line art        ->  public/drawings/*.png
 *     Website bg.png   2560x1440 opaque      ->  public/textures/paper.jpg
 *
 * The .mov files are hand-drawn "boil" loops: finished art redrawn each frame so it
 * jitters. Every frame is a complete drawing, so any frame makes a valid poster.
 *
 * Alpha is the whole ballgame. VP9 carries it in a separate plane flagged by the
 * container's alpha_mode=1. Two flags are load-bearing and must not be removed:
 *   -pix_fmt yuva420p   the 'a' is the alpha plane
 *   -auto-alt-ref 0     libvpx silently drops alpha when alt-ref frames are on
 *
 * Run: node scripts/ingest-assets.mjs
 */
import { execFileSync } from 'node:child_process'
import { mkdirSync, readdirSync, statSync, copyFileSync, existsSync } from 'node:fs'
import { join, basename, extname } from 'node:path'

const SRC = 'incoming/asset sheet'
const OUT_VIDEO = 'public/videos'
const OUT_DRAW = 'public/drawings'
const OUT_TEX = 'public/textures'

/** Source basename -> the slot name the site knows it by. */
const VIDEO_SLOTS = {
  'star': 'doodleStar',
  'spiral': 'doodleSpiral',
  'arrow': 'doodleArrow',
  'curved arrow': 'doodleCurvedArrow',
  'sword': 'doodleSword',
  'hashtag': 'doodleHashtag',
  'instagram': 'logoInstagram',
  'adobe': 'logoAdobe',
  'brick': 'logoBrick',
  'foureditors': 'logoEditors',
}

/**
 * Still-only art from the original asset sheet. No .mov twin exists for any.
 *
 * The title*.png numbering does NOT match services[] order — checked by eye, so
 * don't "fix" it to look tidy. Only titles 2 and 4 survive the 2026-07-24 copy
 * rewrite; title3 ("Growth Operation") and title5 (combined "Creative Direction //
 * Personal Brand Consulting") are RETIRED — services 1 and 2 now come from
 * EXTRA_TITLE_SLOTS below.
 *   title2 = "Videography & Creative Team Management"   (services[2])
 *   title4 = "Brand Collaboration & Professional Editing" (services[3])
 */
const STILL_SLOTS = {
  'Signature': 'signature',
  'apply': 'applyWord',
  'DOTS': 'doodleDots',
  'PLUS': 'doodlePlus',
  'Name': 'headingName',
  'Services': 'headingServices',
  'Collaborations': 'headingCollaborations',
  'title2': 'serviceTitle3',
  'title4': 'serviceTitle4',
}

/**
 * Revised title art (2026-07-24). Copy split into two sections, redrawn by
 * Jackson. Sourced from incoming/extra-titles/ (the two files from ~/Downloads),
 * not the original asset sheet.
 *   creativeDirectionParasocial = "Creative Direction (▨PARASOCIAL)"  (services[0])
 *   personalBrandConsulting     = "Personal Brand Consulting"          (services[1])
 */
const EXTRA_TITLE_SLOTS = {
  'creativeDirectionParasocial': 'serviceTitle1',
  'personalBrandConsulting': 'serviceTitle2',
}
const EXTRA_SRC = 'incoming/extra-titles'

const ff = (args) => execFileSync('ffmpeg', ['-y', '-v', 'error', ...args], { stdio: 'pipe' })
const probe = (file, entries) =>
  execFileSync('ffprobe', [
    '-v', 'error', '-select_streams', 'v:0',
    '-show_entries', `stream=${entries}`, '-of', 'csv=p=0', file,
  ]).toString().trim()

const kb = (f) => `${(statSync(f).size / 1024).toFixed(0)} KB`

for (const d of [OUT_VIDEO, OUT_DRAW, OUT_TEX]) mkdirSync(d, { recursive: true })

if (!existsSync(SRC)) {
  console.error(`Missing ${SRC}. Extract the delivery zip into incoming/ first.`)
  process.exit(1)
}

let total = 0

console.log('\nVideos  (ProRes/qtrle ARGB -> VP9 WebM + alpha, native 1920px)\n')
for (const file of readdirSync(join(SRC, 'Animated')).filter((f) => f.endsWith('.mov'))) {
  const stem = basename(file, '.mov')
  const slot = VIDEO_SLOTS[stem]
  if (!slot) {
    console.log(`  ${stem.padEnd(16)} SKIPPED — no slot mapped`)
    continue
  }
  const src = join(SRC, 'Animated', file)
  const webm = join(OUT_VIDEO, `${slot}.webm`)
  const poster = join(OUT_DRAW, `${slot}.png`)

  // -an: the .movs carry an audio track. A silent loop needs none, and an audio
  // track can block autoplay.
  ff(['-i', src, '-an',
    '-c:v', 'libvpx-vp9', '-pix_fmt', 'yuva420p', '-auto-alt-ref', '0',
    '-crf', '20', '-b:v', '0', '-row-mt', '1',
    webm])

  // Poster doubles as the reduced-motion still, so it must be a complete drawing.
  // Mid-clip frame, downscaled — it only has to hold until the video paints.
  const frames = Number(probe(src, 'nb_frames')) || 24
  ff(['-i', src, '-vf', `select=eq(n\\,${Math.floor(frames / 2)}),scale=1024:-1`,
    '-vsync', '0', '-frames:v', '1', '-update', '1', poster])

  // Guard the one failure that ships silently: alpha stripped => opaque black box.
  const alphaMode = execFileSync('ffprobe', ['-v', 'error', '-show_streams', webm])
    .toString().includes('alpha_mode=1')
  if (!alphaMode) throw new Error(`${webm}: alpha was stripped — refusing to ship an opaque box`)

  total += statSync(webm).size + statSync(poster).size
  console.log(`  ${slot.padEnd(20)} ${kb(webm).padStart(8)} webm  ${kb(poster).padStart(8)} poster  alpha:ok`)
}

// Copy a transparent PNG straight into public/drawings under its slot name.
function placeStill(srcDir, stem, slot) {
  const src = readdirSync(srcDir).find((f) => basename(f, extname(f)) === stem && f.endsWith('.png'))
  if (!src) {
    console.log(`  ${slot.padEnd(20)} MISSING (${stem}.png in ${srcDir})`)
    return
  }
  const dest = join(OUT_DRAW, `${slot}.png`)
  copyFileSync(join(srcDir, src), dest)
  total += statSync(dest).size
  console.log(`  ${slot.padEnd(20)} ${kb(dest).padStart(8)}  ${probe(dest, 'width,height').replace(',', 'x')}`)
}

console.log('\nStills\n')
for (const [stem, slot] of Object.entries(STILL_SLOTS)) placeStill(SRC, stem, slot)

console.log('\nRevised titles (2026-07-24)\n')
for (const [stem, slot] of Object.entries(EXTRA_TITLE_SLOTS)) placeStill(EXTRA_SRC, stem, slot)

console.log('\nPaper texture\n')
// Opaque rgb24 photo used as a full-bleed background — JPEG, no alpha needed.
//
// It's a photograph of a wall, so it arrives mid-grey with the room's shadow
// falloff baked in. The site is meant to read as WHITE paper with black ink, so:
//   hue=s=0      strip the faint green-grey cast (site is black and white)
//   curves       lift the whites toward paper-white, keeping the darks anchored
//                so the grain survives instead of blowing out to flat white
// Tune the curve here if the page ever reads too grey or too washed out.
const paper = join(OUT_TEX, 'paper.jpg')
ff(['-i', join(SRC, 'Website bg.png'),
  '-vf', 'hue=s=0,curves=all=0/0.10 0.5/0.80 1/1.0',
  '-q:v', '4', paper])
total += statSync(paper).size
console.log(`  paper.jpg            ${kb(paper).padStart(8)}  (from Website bg.png, 4.3 MB, desaturated)`)

console.log(`\nTotal shipped: ${(total / 1024 / 1024).toFixed(1)} MB  (source was 1.4 GB)\n`)
