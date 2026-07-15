# Jackson Sword — portfolio

A single-page, handwritten-journal portfolio for Jackson Sword. Everything reads
as pen-on-paper and animates in a "drawn out" style: the hero roles write in and
get crossed out, the page turns in 3D, drawn logos and clips fill the work page,
and a hand-drawn ellipse loops around the **apply** button.

## Stack

- **Vite + React 18**, Tailwind 3
- **GSAP + ScrollTrigger** — hero strike timeline, 3D page-turn scrub
- **Lenis** — smooth scroll (wired to ScrollTrigger on one RAF loop)
- **Framer Motion** — SVG stroke-draws (`pathLength`)
- **anime.js v4** — per-word handwriting write-on
- **Three.js** — faint drifting paper-dust layer (lazy-loaded, code-split)

## Run

```bash
npm install
npm run dev        # http://localhost:5173
npm run build && npm run preview
```

## Swapping in real drawings (no code changes)

Every hand-drawn mark is a **slot** in `src/assets/drawings/manifest.js`
(signature, face, logos, doodles, strikes, apply-ellipse, badges). To replace a
placeholder with Jackson's real drawing:

1. Open **`/?sign`** on the site (iPad/touch is smoothest).
2. Pick the slot from the dropdown, draw the mark, hit **Export**.
3. Paste the exported `viewBox` + `paths` over that slot in the manifest.

The export shape already matches the manifest slot shape, so it's copy-paste.

## Swapping the paper

Replace `public/textures/paper.svg` with a photo of Jackson's real journal (e.g.
`paper.jpg`) and point `--paper-image` in `src/index.css` at it. Everything
re-skins automatically.

## Content

All copy lives in `src/data/content.js` — roles, collaborations, services,
case-study names, and the apply link (`applyHref`, currently a placeholder `#`).

## Verify

```bash
node scripts/shoot.mjs           # screenshots at 375 / 768 / 1440 → screenshots/
node scripts/shoot.mjs reduced   # same, with reduced-motion (full static end-state)
```

Both must report `hScroll=false errors=0` at every breakpoint.

## Notes / TODO

- Video cards are poster placeholders with sample view counts — drop real 9:16
  mp4s into `public/videos/` and reference them in `content.js` (`videos[].src`).
- Run the `design-whimsy-injector` pass once the real drawings are in place.
- `identity.applyHref` in `content.js` is `#` — swap for the real form URL.
# jacksonswebsite
