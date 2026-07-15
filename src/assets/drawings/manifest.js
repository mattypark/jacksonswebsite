/**
 * Drawing manifest — the single source of truth for every hand-drawn mark.
 *
 * Two slot kinds:
 *
 *   stroke slot → { viewBox, paths: [...] }
 *       Vector paths animated as a pen draw (framer-motion pathLength).
 *       Drawn in array order, so author them in natural stroke order.
 *
 *   media slot  → { kind: 'media', img, video?, reveal }
 *       Jackson's real art. `reveal` is how it arrives on screen:
 *         'video' — his hand-drawn boil loop (VP9 + alpha, plays in view)
 *         'wipe'  — clip-path sweep left→right, reads as being written
 *         'fade'  — plain opacity
 *
 * Media assets are produced by `node scripts/ingest-assets.mjs` from the raw
 * delivery in incoming/. Do not hand-edit anything under public/drawings or
 * public/videos — rerun the script.
 *
 * The stroke slots below are the only PLACEHOLDERS left: Jackson sent no art for
 * the self-portrait, the strikethroughs, the role underline, or the badge circle.
 * To replace one: open /?sign, draw it, Export, paste the viewBox + paths here.
 */

export const drawings = {
  // --- Self-portrait doodle (top-right of hero) — PLACEHOLDER, no source art ---
  faceDrawing: {
    viewBox: '0 0 200 240',
    paths: [
      // head
      'M 42 96 C 40 44 160 44 160 100 C 160 156 128 196 100 196 C 72 196 44 150 42 96 Z',
      // hair
      'M 44 84 C 58 42 142 42 158 88 C 150 62 120 50 100 52 C 78 54 54 62 44 84',
      // eyes
      'M 72 104 C 77 97 89 97 94 104',
      'M 110 104 C 115 97 127 97 132 104',
      // nose
      'M 100 112 C 98 124 96 130 106 132',
      // smile
      'M 78 148 C 94 166 116 166 130 146',
    ],
  },

  // --- Ellipse drawn around the "apply" mark — PLACEHOLDER, no source art.
  // Jackson sent the WORD "apply" (see media.applyWord), not a circle around it,
  // so this stays a real stroke draw-on. ---
  applyCircle: {
    viewBox: '0 0 320 130',
    paths: [
      'M 66 34 C 156 10 300 20 300 66 C 300 112 168 126 76 116 C 6 108 8 42 96 30 C 128 25 162 24 196 28',
    ],
  },

  // --- Wobbly strikethroughs (cycled across the roles) — PLACEHOLDER ---
  strike1: { viewBox: '0 0 400 40', paths: ['M 8 22 C 120 14 260 30 392 18'] },
  strike2: { viewBox: '0 0 400 40', paths: ['M 6 20 C 140 30 250 10 394 24'] },
  strike3: { viewBox: '0 0 400 40', paths: ['M 10 24 C 100 16 300 26 390 16'] },
  strike4: { viewBox: '0 0 400 40', paths: ['M 8 18 C 160 26 240 12 392 22'] },

  // --- Wobbly underline under "multifaceted artist :)" — PLACEHOLDER ---
  doodleUnderline: {
    viewBox: '0 0 440 40',
    paths: ['M 10 24 C 130 8 320 34 430 14'],
  },

  // --- Hand-drawn badge circle (wraps view-count numbers) — PLACEHOLDER ---
  badgeCircle: {
    viewBox: '0 0 120 120',
    paths: ['M 60 12 C 96 12 112 40 108 66 C 104 96 78 110 54 108 C 24 106 8 78 14 50 C 20 24 44 12 70 14'],
  },
}

/**
 * Jackson's real art.
 *
 * Every doodle and logo shipped as a 1920² ProRes boil loop WITH an alpha
 * channel — finished art redrawn each frame so the ink jitters. The poster is a
 * mid-clip frame, which doubles as the reduced-motion still.
 */
export const media = {
  // --- Doodles (boil loops) ---
  doodleStar: { kind: 'media', reveal: 'video', img: '/drawings/doodleStar.png', video: '/videos/doodleStar.webm' },
  doodleSpiral: { kind: 'media', reveal: 'video', img: '/drawings/doodleSpiral.png', video: '/videos/doodleSpiral.webm' },
  doodleArrow: { kind: 'media', reveal: 'video', img: '/drawings/doodleArrow.png', video: '/videos/doodleArrow.webm' },
  doodleCurvedArrow: { kind: 'media', reveal: 'video', img: '/drawings/doodleCurvedArrow.png', video: '/videos/doodleCurvedArrow.webm' },
  doodleHashtag: { kind: 'media', reveal: 'video', img: '/drawings/doodleHashtag.png', video: '/videos/doodleHashtag.webm' },
  // Jackson *Sword* — his own mark. Replaces the old placeholder chess knight.
  doodleSword: { kind: 'media', reveal: 'video', img: '/drawings/doodleSword.png', video: '/videos/doodleSword.webm' },

  // --- Collaboration logos (boil loops) ---
  logoPhia: { kind: 'media', reveal: 'video', img: '/drawings/logoPhia.png', video: '/videos/logoPhia.webm' },
  logoInstagram: { kind: 'media', reveal: 'video', img: '/drawings/logoInstagram.png', video: '/videos/logoInstagram.webm' },
  logoAdobe: { kind: 'media', reveal: 'video', img: '/drawings/logoAdobe.png', video: '/videos/logoAdobe.webm' },
  logoBrick: { kind: 'media', reveal: 'video', img: '/drawings/logoBrick.png', video: '/videos/logoBrick.webm' },
  logoEditors: { kind: 'media', reveal: 'video', img: '/drawings/logoEditors.png', video: '/videos/logoEditors.webm' },

  // --- Still-only marks (no .mov twin was delivered) ---
  // Signature and the "apply" word are written left-to-right, so they wipe.
  signature: { kind: 'media', reveal: 'wipe', img: '/drawings/signature.png' },
  applyWord: { kind: 'media', reveal: 'wipe', img: '/drawings/applyWord.png' },
  // Scatter marks have no writing direction — fade.
  doodleDots: { kind: 'media', reveal: 'fade', img: '/drawings/doodleDots.png' },
  doodlePlus: { kind: 'media', reveal: 'fade', img: '/drawings/doodlePlus.png' },

  // --- Hand-lettered headings ---
  headingName: { kind: 'media', reveal: 'wipe', img: '/drawings/headingName.png' },
  headingServices: { kind: 'media', reveal: 'wipe', img: '/drawings/headingServices.png' },
  headingCollaborations: { kind: 'media', reveal: 'wipe', img: '/drawings/headingCollaborations.png' },

  // --- The four service titles, hand-lettered. Index-aligned with services[] in
  // content.js (the source title*.png numbering was NOT in that order). ---
  serviceTitle1: { kind: 'media', reveal: 'wipe', img: '/drawings/serviceTitle1.png' },
  serviceTitle2: { kind: 'media', reveal: 'wipe', img: '/drawings/serviceTitle2.png' },
  serviceTitle3: { kind: 'media', reveal: 'wipe', img: '/drawings/serviceTitle3.png' },
  serviceTitle4: { kind: 'media', reveal: 'wipe', img: '/drawings/serviceTitle4.png' },
}

// Strike variants, cycled by index so no two consecutive strikes match.
export const strikeVariants = ['strike1', 'strike2', 'strike3', 'strike4']

/** Look up a stroke slot; returns null for an unknown/non-stroke slot. */
export function getStroke(slot) {
  return drawings[slot] ?? null
}

/** Look up a media slot; returns null for an unknown/non-media slot. */
export function getMedia(slot) {
  return media[slot] ?? null
}

/** Every slot name the site knows about, both kinds. Used by the /?sign tool. */
export function allSlots() {
  return [...Object.keys(drawings), ...Object.keys(media)]
}
