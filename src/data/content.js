// All page copy in one place. Placeholder-but-real — swap freely.

export const identity = {
  name: 'Jackson Sword',
  age: 23,
  city: 'NYC',
  domain: 'jacksonsword.com',
  applyHref: '#', // TODO: swap for the real application form URL
}

// Roles that write in and get struck out, in order. The last one stays.
export const roles = [
  { text: 'professional editor', struck: true },
  { text: 'brand collaborator', struck: true },
  { text: 'content coach', struck: true },
  { text: 'creative director', struck: true },
  { text: 'branding consultant', struck: true },
  { text: 'multifaceted artist :)', struck: false },
]

export const intro = {
  greeting: 'Hey,',
  lines: [`my name is ${'Jackson Sword'},`, `i'm 23, live in NYC, and am a..`],
}

export const workHeading = "here's all i've done and all i can do for you:"

// Left column — collaborations. Each maps to a drawn-logo slot in the manifest.
export const collaborations = [
  { name: 'Phia', logoSlot: 'logoPhia' },
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

// Right column — services.
// `titleSlot` is Jackson's hand-lettered version of `title`. The text stays as the
// real heading for screen readers and search; the lettering renders on top of it.
export const services = [
  {
    titleSlot: 'serviceTitle1',
    title: 'creative direction // personal brand consulting',
    body:
      'I work one-on-one with founders and creators to sharpen who they are on camera and off. We find the through-line, then build a look, a voice, and a posting rhythm that actually sounds like you.',
    points: [
      'worked with 200+ creators and founders to grow their personal brands',
      'case studies: dillon, jeff, matty p, jayda, saint',
    ],
  },
  {
    titleSlot: 'serviceTitle2',
    title: 'growth operation',
    body:
      'Content is the top of the funnel — I build the rest. Offers, landing flows, and the systems that turn a viral week into a real pipeline instead of a spike you forget.',
    points: ['built out full acquisition funnels end-to-end', 'case study: the bent'],
  },
  {
    titleSlot: 'serviceTitle3',
    title: 'videography & creative team management',
    body:
      'In-person shoots, vlogs, and formats — plus the briefs and the team to keep them running when you can not. I direct the edit so every deliverable lands on-brand without you in the room.',
    points: ['in-person shoots, vlogs, repeatable formats', 'editor briefs + creative team management'],
  },
  {
    titleSlot: 'serviceTitle4',
    title: 'brand collaboration & professional editing',
    body:
      'Editing that respects the story and the pacing, and partnerships that feel native instead of bolted on. Open to brand work when the fit is real.',
    points: ['worked with brands across lifestyle, tech, and fashion', 'open to new partnerships'],
  },
]

export const cta = {
  lead: "if you're interested in working together, fill out the form and apply below",
  button: 'apply',
  signoff: 'with love,',
}
