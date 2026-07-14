import { DepthCarousel } from './components/DepthCarousel'
import { HeroReveal } from './components/HeroReveal'
import { PricingCard, PricingSection } from './components/Pricing'
import { ScrollMarquee } from './components/ScrollMarquee'
import { VideoLoop } from './components/VideoLoop'
import {
  depthCarouselPropsSchema,
  heroRevealPropsSchema,
  pricingCardPropsSchema,
  pricingPropsSchema,
  scrollMarqueePropsSchema,
  videoLoopPropsSchema,
} from './schemas'

// Registry doubles as the AI selection guide: `useWhen` / `avoidWhen` tell an AI page builder
// when to pick each component; `allowedEnhancements` lists the section-scope behaviors it accepts.
export const componentRegistry = {
  'cinematic.hero-reveal': {
    component: HeroReveal,
    propsSchema: heroRevealPropsSchema,
    allowedChildren: [],
    allowedEnhancements: ['inview-entrance'],
    topLevel: true,
    description: 'Full-screen cinematic hero with a staggered eyebrow, title, and optional call to action.',
    useWhen: ['Opening a page', 'A single dominant hero statement', 'Establishing brand tone immediately'],
    avoidWhen: ['A secondary mid-page block (use a plain heading)'],
    examples: [{ eyebrow: 'Introduction', title: 'Built to move', ctaLabel: 'Explore' }],
  },
  'cinematic.video-loop': {
    component: VideoLoop,
    propsSchema: videoLoopPropsSchema,
    allowedChildren: [],
    allowedEnhancements: [],
    topLevel: true,
    description: 'Full-screen RAF-driven video fade loop using an allowlisted HTTPS source.',
    useWhen: ['An immersive moving background', 'Video is the main subject'],
    avoidWhen: ['Mobile-first or bandwidth-constrained pages', 'Text-heavy content'],
    examples: [{ src: 'https://d8j0ntlcm91z4.cloudfront.net/demo.mp4', caption: 'A cinematic loop' }],
  },
  'creator.depth-carousel': {
    component: DepthCarousel,
    propsSchema: depthCarouselPropsSchema,
    allowedChildren: [],
    allowedEnhancements: [],
    topLevel: true,
    description: 'Four-image depth carousel with role transitions and optional timed advancement.',
    useWhen: ['Four parallel roles/styles rotated with a 3D depth feel'],
    avoidWhen: ['Variable item counts', 'Reading precise detail of each item'],
    examples: [{
      title: '3D Shape',
      images: [
        { src: '/characters/fluent-astronaut.png', bg: '#746BE8' },
        { src: '/characters/fluent-ninja.png', bg: '#39304F' },
        { src: '/characters/fluent-mage.png', bg: '#31A7E8' },
        { src: '/characters/fluent-superhero.png', bg: '#ED6CA8' },
      ],
    }],
  },
  'creator.scroll-marquee': {
    component: ScrollMarquee,
    propsSchema: scrollMarqueePropsSchema,
    allowedChildren: [],
    allowedEnhancements: [],
    topLevel: true,
    description: 'Two-row animated text marquee with constrained repeat count and speed.',
    useWhen: ['A full-width animated rhythm of repeated text'],
    avoidWhen: ['Users need to stop and read each item'],
    examples: [{ text: 'Make every frame count', repeat: 4, speed: 'normal' }],
  },
  'studio.pricing': {
    component: PricingSection,
    propsSchema: pricingPropsSchema,
    allowedChildren: ['studio.pricing-card'],
    allowedEnhancements: ['inview-entrance'],
    topLevel: true,
    description: 'Responsive pricing section composed from one to three validated pricing cards.',
    useWhen: ['Comparing one to three plans side by side'],
    avoidWhen: ['A single plan (use a CTA block)'],
    examples: [{ heading: 'Choose how we work together' }],
  },
  'studio.pricing-card': {
    component: PricingCard,
    propsSchema: pricingCardPropsSchema,
    allowedChildren: [],
    allowedEnhancements: [],
    topLevel: false,
    description: 'Dark or light pricing card with a price, unit, feature list, and call to action.',
    useWhen: ['A single plan inside a pricing section'],
    avoidWhen: ['Standalone use outside studio.pricing'],
    examples: [{ title: 'Monthly Partnership', price: '$5,000', unit: 'Monthly', features: ['Dedicated product team'], dark: true, ctaLabel: 'Start a chat' }],
  },
} as const

export type ComponentId = keyof typeof componentRegistry
