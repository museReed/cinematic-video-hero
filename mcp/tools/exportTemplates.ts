import type { ComponentId } from '../../src/component-library/registry'
import type { PageSpecChild } from '../../src/page-builder/PageSpec'

type ExportTemplate = (props: unknown, children?: PageSpecChild[]) => string

function jsxProps(props: unknown) {
  return Object.entries(props as Record<string, unknown>)
    .map(([name, value]) => `${name}={${JSON.stringify(value)}}`)
    .join(' ')
}

function componentTemplate(componentName: string): ExportTemplate {
  return (props) => `<${componentName} ${jsxProps(props)} />`
}

export const EXPORT_TEMPLATES: Record<ComponentId, ExportTemplate> = {
  'section.hero': componentTemplate('Hero'),
  'section.full-bleed-video': componentTemplate('FullBleedVideo'),
  'creator.depth-carousel': componentTemplate('DepthCarousel'),
  'section.marquee': componentTemplate('Marquee'),
  'section.testimonial-carousel': componentTemplate('TestimonialCarousel'),
  'section.split-video-scrub': componentTemplate('SplitVideoScrub'),
  'section.masonry-grid': componentTemplate('MasonryGrid'),
  'section.quote-parallax': componentTemplate('QuoteParallax'),
  'section.scroll-scale-cards': componentTemplate('ScrollScaleCards'),
  'section.sticky-card-stack': componentTemplate('StickyCardStack'),
  'section.project-stack': componentTemplate('ProjectStack'),
  'section.scroll-character-reveal': componentTemplate('ScrollCharacterReveal'),
  'section.gradient-heading': componentTemplate('GradientHeading'),
  'section.feature-grid': (props, children) => {
    const cards = children?.map((child) => child.props) ?? []
    const propsSource = jsxProps(props)
    return `<FeatureGrid ${propsSource} cards={${JSON.stringify(cards)}} />`
  },
  'section.feature-card': componentTemplate('FeatureCard'),
  'section.footer': componentTemplate('Footer'),
  'studio.pricing': (props, children) => {
    const cards = children?.map((child) => child.props) ?? []
    const propsSource = jsxProps(props)
    return `<PricingSection ${propsSource} cards={${JSON.stringify(cards)}} />`
  },
  'studio.pricing-card': componentTemplate('PricingCard'),
}
