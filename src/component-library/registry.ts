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

export const componentRegistry = {
  'cinematic.hero-reveal': {
    component: HeroReveal,
    propsSchema: heroRevealPropsSchema,
    allowedChildren: [],
    topLevel: true,
    description: 'Full-screen cinematic hero with a staggered eyebrow, title, and optional call to action.',
    examples: [{ eyebrow: 'Introduction', title: 'Built to move', ctaLabel: 'Explore' }],
  },
  'cinematic.video-loop': {
    component: VideoLoop,
    propsSchema: videoLoopPropsSchema,
    allowedChildren: [],
    topLevel: true,
    description: 'Full-screen RAF-driven video fade loop using an allowlisted HTTPS source.',
    examples: [{ src: 'https://d8j0ntlcm91z4.cloudfront.net/demo.mp4', caption: 'A cinematic loop' }],
  },
  'creator.depth-carousel': {
    component: DepthCarousel,
    propsSchema: depthCarouselPropsSchema,
    allowedChildren: [],
    topLevel: true,
    description: 'Four-image depth carousel with role transitions and optional timed advancement.',
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
    topLevel: true,
    description: 'Two-row animated text marquee with constrained repeat count and speed.',
    examples: [{ text: 'Make every frame count', repeat: 4, speed: 'normal' }],
  },
  'studio.pricing': {
    component: PricingSection,
    propsSchema: pricingPropsSchema,
    allowedChildren: ['studio.pricing-card'],
    topLevel: true,
    description: 'Responsive pricing section composed from one to three validated pricing cards.',
    examples: [{ heading: 'Choose how we work together' }],
  },
  'studio.pricing-card': {
    component: PricingCard,
    propsSchema: pricingCardPropsSchema,
    allowedChildren: [],
    topLevel: false,
    description: 'Dark or light pricing card with a price, unit, feature list, and call to action.',
    examples: [{ title: 'Monthly Partnership', price: '$5,000', unit: 'Monthly', features: ['Dedicated product team'], dark: true, ctaLabel: 'Start a chat' }],
  },
} as const

export type ComponentId = keyof typeof componentRegistry
