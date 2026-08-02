// All page copy in one place. Placeholder-but-real — swap freely.

export const identity = {
  name: 'Jackson Sword',
  age: 23,
  city: 'NYC',
  domain: 'jacksonsword.com',
  applyHref: '#', // TODO: swap for the real application form URL
}

// The one role. No strike-list any more — the intro used to cycle five struck
// job titles before landing here, which made the opening long. It just says it.
export const artistLine = 'multifaceted artist :)'

export const intro = {
  greeting: 'hey,',
  // One line, one breath. Trails off into the taped photo, answered below by
  // `artistLine`.
  line: `my name is ${identity.name.toLowerCase()}, i'm ${identity.age}, live in ${identity.city}, am a ...`,
}

// Taped hero photo + the crumple that carries page 1 into the work page.
// Both are drop-in slots: put the real files at these paths and they take over
// from the placeholders with no code change.
export const heroPhoto = {
  src: '/photos/jackson.jpg',
  alt: 'Jackson Sword at his desk, mid-edit',
}

export const crumplePhoto = {
  src: '/photos/crumple.jpg',
  alt: '',
}

export const workHeading = "here's all i've done and all i can do for you:"

// Left column — collaborations. Each maps to a drawn-logo slot in the manifest.
export const collaborations = [
  { name: 'Instagram', logoSlot: 'logoInstagram' },
  { name: 'Adobe', logoSlot: 'logoAdobe' },
  { name: 'Brick', logoSlot: 'logoBrick' },
  { name: 'four editors', logoSlot: 'logoEditors' },
]

// Placeholder short-form video cards. Drop real mp4s into /public/videos later.
export const videos = [
  { id: 'v1', title: 'Make your content feel cinematic', poster: null, views: '1.2M', reach: '3.4M' },
  { id: 'v2', title: 'Enjoy your photos again', poster: null, views: '840K', reach: '2.1M' },
  { id: 'v3', title: 'Behind the edit', poster: null, views: '612K', reach: '1.5M' },
  { id: 'v4', title: 'Do you edit on Pr / Ae / Ci?', poster: null, views: '2.0M', reach: '4.8M' },
]

// Right column — services (copy rewrite 2026-07-24).
// `titleSlot` is Jackson's hand-lettered version of `title`; the text stays as the
// real heading for screen readers and search, lettering renders on top.
// `caseStudies` are Instagram handles → linked chips. Omit for sections with none.
const ig = (handle) => ({ label: handle, href: `https://instagram.com/${handle}` })

export const services = [
  {
    titleSlot: 'serviceTitle1',
    title: 'creative direction (parasocial)',
    body:
      'At Parasocial, my creative direction company, we work with creator-founders who have stories to tell but lack the means to tell them. We come on as a fractional creative direction team and partner with our clients to find their target association, desired aesthetics, and production style, then apply that to our backend funnel systems to ensure audience trust and conversions.',
    caseStudies: [
      ig('viralbestiesclub'),
      ig('saintharris'),
      ig('isaac.scruggss'),
      ig('peedur.p'),
      ig('van_minnen'),
    ],
  },
  {
    titleSlot: 'serviceTitle2',
    title: 'personal brand consulting',
    body:
      "Throughout my time as a content coach, I've helped over 200 creators improve their content's production quality, pace, reach, and engagement, as well as helped numerous accounts surpass 10,000 followers and beyond. My goal is to use artistic expression and creative idea representation to build accounts that stand out and build true presence.",
    caseStudies: [
      ig('matty.park'),
      ig('bouncebackpickle'),
      // TODO: Logan Walters — no IG handle supplied. Renders as a plain chip
      // until a real handle exists; swap to ig('<handle>') to make it a link.
      { label: 'Logan Walters', href: null },
    ],
  },
  {
    titleSlot: 'serviceTitle3',
    title: 'videography & creative team management',
    body:
      "I offer in-person shoots; vlogs, product short films, or otherwise. Along with creative team management, where I handle content format and editing briefs as well as the team's revisions process and general communication. I've managed multi-person teams across all niches and have run numerous content campaigns to produce a product or service.",
  },
  {
    titleSlot: 'serviceTitle4',
    title: 'brand collaboration & professional editing',
    body:
      "I've found partnering with companies who share my vision for content a very creatively fulfilling process, and I'm constantly looking for unique products or services to collaborate with. I'm also open to working on one-off videos as an editor.",
  },
]

export const cta = {
  lead: "if you're interested in working together, fill out the form and apply below",
  button: 'apply',
  signoff: 'with love,',
}
