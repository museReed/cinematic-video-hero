import { DepthCarousel } from './components/DepthCarousel'
import { Footer } from './components/Footer'
import { FullBleedVideo } from './components/FullBleedVideo'
import { Hero } from './components/Hero'
import { Marquee } from './components/Marquee'
import { PricingCard, PricingSection } from './components/Pricing'
import {
  depthCarouselPropsSchema,
  footerPropsSchema,
  fullBleedVideoPropsSchema,
  heroPropsSchema,
  marqueePropsSchema,
  pricingCardPropsSchema,
  pricingPropsSchema,
} from './schemas'

// Registry doubles as the AI selection guide: `useWhen` / `avoidWhen` tell an AI page builder
// when to pick each component; `allowedEnhancements` lists the section-scope behaviors it accepts.
export const componentRegistry = {
  'section.hero': {
    component: Hero,
    propsSchema: heroPropsSchema,
    allowedChildren: [],
    allowedEnhancements: ['inview-entrance'],
    topLevel: true,
    description: 'Centered opening hero with an eyebrow, title, optional body and call to action.',
    useWhen: ['Opening a page', 'A single dominant hero statement', 'Establishing brand tone immediately'],
    avoidWhen: ['A secondary mid-page block (use a plain heading)'],
    examples: [{ eyebrow: 'Introduction', title: 'Built to move', ctaLabel: 'Explore', layout: 'cinematic' }],
  },
  'section.full-bleed-video': {
    component: FullBleedVideo,
    propsSchema: fullBleedVideoPropsSchema,
    allowedChildren: [],
    allowedEnhancements: [],
    topLevel: true,
    description: 'Full-screen video with atmospheric looping or pointer-driven scrubbing and a resilient fallback.',
    useWhen: ['An immersive moving background', 'Video is the main subject'],
    avoidWhen: ['Mobile-first or bandwidth-constrained pages', 'Text-heavy content'],
    examples: [{ src: 'https://d8j0ntlcm91z4.cloudfront.net/demo.mp4', caption: 'A cinematic loop', interaction: 'none' }],
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
  'section.marquee': {
    component: Marquee,
    propsSchema: marqueePropsSchema,
    allowedChildren: [],
    allowedEnhancements: [],
    topLevel: true,
    description: 'Full-width infinite marquee for repeated text or an allowlisted image rail.',
    useWhen: ['Showing a full-width row of logos or work', 'Adding an animated rhythm across the page'],
    avoidWhen: ['Users need to stop and read each item'],
    examples: [{ content: 'text', text: 'Make every frame count', speed: 'normal', rows: 2 }],
  },
  'section.footer': {
    component: Footer,
    propsSchema: footerPropsSchema,
    allowedChildren: [],
    allowedEnhancements: [],
    topLevel: true,
    description: 'Grouped footer navigation with company details and a persistent conversion pill.',
    useWhen: ['Closing a page with navigation and a conversion action'],
    avoidWhen: ['A mid-page section'],
    examples: [{
      ctaLabel: 'Start a chat',
      columns: [{ heading: 'Explore', links: [{ label: 'Work', href: '#work' }] }],
      company: 'Vortex Studio Limited',
      location: 'Austin, USA',
      bottomCtaLabel: 'Start a chat',
    }],
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
