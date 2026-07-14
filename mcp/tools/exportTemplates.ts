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
  'cinematic.hero-reveal': componentTemplate('HeroReveal'),
  'cinematic.video-loop': componentTemplate('VideoLoop'),
  'creator.depth-carousel': componentTemplate('DepthCarousel'),
  'creator.scroll-marquee': componentTemplate('ScrollMarquee'),
  'studio.pricing': (props, children) => {
    const cards = children?.map((child) => child.props) ?? []
    const propsSource = jsxProps(props)
    return `<PricingSection ${propsSource} cards={${JSON.stringify(cards)}} />`
  },
  'studio.pricing-card': componentTemplate('PricingCard'),
}
