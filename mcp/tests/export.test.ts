import assert from 'node:assert/strict'
import { access, rm } from 'node:fs/promises'
import path from 'node:path'
import test from 'node:test'
import { exportPage, exportPageInputSchema, resolveExportPath } from '../tools/exportPage'

const inlineExportPath = path.resolve(process.cwd(), 'exported-pages', 'inline-export.tsx')

const heroSpec = {
  version: 1 as const,
  theme: 'studio' as const,
  sections: [
    {
      id: 'opening-hero',
      component: 'section.hero' as const,
      props: { eyebrow: 'Testing', title: 'Fixed templates' },
    },
    {
      id: 'moving-message',
      component: 'section.marquee' as const,
      props: { content: 'text', text: 'Only registry components', speed: 'normal' },
    },
  ],
}

async function pathExists(filePath: string) {
  try {
    await access(filePath)
    return true
  } catch {
    return false
  }
}

test('exports a valid spec using only registry component tags', async () => {
  try {
    const result = await exportPage({ spec: heroSpec })
    assert.equal(result.ok, true)
    if (!result.ok) return

    assert.match(result.source, /export default function GeneratedPage\(\)/)
    assert.match(result.source, /data-theme="studio"/)
    const componentTags = [...result.source.matchAll(/<([A-Z][A-Za-z0-9]*)\b/g)].map((match) => match[1])
    assert.deepEqual(componentTags, ['Hero', 'Marquee'])
  } finally {
    await rm(inlineExportPath, { force: true })
  }
})

test('flattens pricing card children into the cards prop', async () => {
  const pricingSpec = {
    version: 1 as const,
    theme: 'claude2code' as const,
    sections: [
      {
        id: 'pricing',
        component: 'studio.pricing' as const,
        props: { heading: 'Choose a plan' },
        children: [
          {
            component: 'studio.pricing-card' as const,
            props: {
              title: 'Monthly',
              price: '$5,000',
              unit: 'Monthly',
              features: ['Dedicated team'],
              dark: true,
              ctaLabel: 'Start a chat',
            },
          },
        ],
      },
    ],
  }

  try {
    const result = await exportPage({ spec: pricingSpec })
    assert.equal(result.ok, true)
    if (!result.ok) return

    assert.match(result.source, /cards=\{\[/)
    assert.doesNotMatch(result.source, /<PricingCard\b/)
    assert.match(result.source, /<PricingSection\b/)
  } finally {
    await rm(inlineExportPath, { force: true })
  }
})

test('exports all canonical B2 section tags through their registry templates', async () => {
  const b2Spec = {
    version: 1 as const,
    theme: 'studio' as const,
    sections: [
      {
        id: 'testimonials',
        component: 'section.testimonial-carousel' as const,
        props: {
          items: [
            { quote: 'Precise and thoughtful.', author: 'Mara', company: 'Northstar' },
            { quote: 'Our strongest launch.', author: 'Alex', company: 'Nexgate' },
          ],
        },
      },
      {
        id: 'comparison',
        component: 'section.split-video-scrub' as const,
        props: {
          left: 'https://d8j0ntlcm91z4.cloudfront.net/demo.mp4',
          right: 'https://d8j0ntlcm91z4.cloudfront.net/demo.mp4',
          mode: 'independent',
        },
      },
      {
        id: 'archive',
        component: 'section.masonry-grid' as const,
        props: {
          items: [
            { src: '/characters/fluent-astronaut.png', aspect: 0.8 },
            { src: '/characters/fluent-mage.png', aspect: 1.2 },
          ],
        },
      },
      {
        id: 'quote',
        component: 'section.quote-parallax' as const,
        props: {
          quote: 'We built the studio we wanted to work with.',
          author: 'Viktor Oddy',
          portrait: '/characters/fluent-mage.png',
        },
      },
    ],
  }

  try {
    const result = await exportPage({ spec: b2Spec })
    assert.equal(result.ok, true)
    if (!result.ok) return

    const componentTags = [...result.source.matchAll(/<([A-Z][A-Za-z0-9]*)\b/g)].map((match) => match[1])
    assert.deepEqual(componentTags, ['TestimonialCarousel', 'SplitVideoScrub', 'MasonryGrid', 'QuoteParallax'])
  } finally {
    await rm(inlineExportPath, { force: true })
  }
})

test('exports all canonical B3 section tags through their registry templates', async () => {
  const cardItems = [
    { title: 'Observe', body: 'Start with the frame.' },
    { title: 'Compose', image: '/characters/fluent-astronaut.png' },
  ]
  const b3Spec = {
    version: 1 as const,
    theme: 'studio' as const,
    sections: [
      {
        id: 'focus-cards',
        component: 'section.scroll-scale-cards' as const,
        props: { items: cardItems, scaleRange: { min: 0.88 } },
      },
      {
        id: 'narrative-stack',
        component: 'section.sticky-card-stack' as const,
        props: { items: cardItems, offsetPx: 28 },
      },
      {
        id: 'projects',
        component: 'section.project-stack' as const,
        props: {
          items: [
            { name: 'Evr', description: 'An ambitious product story.', image: '/characters/fluent-mage.png' },
            { name: 'Orbit', description: 'A launch told in motion.', image: '/characters/fluent-astronaut.png' },
          ],
        },
      },
      {
        id: 'manifesto',
        component: 'section.scroll-character-reveal' as const,
        props: { text: 'Make every character count.' },
      },
      {
        id: 'display-type',
        component: 'section.gradient-heading' as const,
        props: { text: 'Future in motion' },
      },
    ],
  }

  try {
    const result = await exportPage({ spec: b3Spec })
    assert.equal(result.ok, true)
    if (!result.ok) return

    const componentTags = [...result.source.matchAll(/<([A-Z][A-Za-z0-9]*)\b/g)].map((match) => match[1])
    assert.deepEqual(componentTags, ['ScrollScaleCards', 'StickyCardStack', 'ProjectStack', 'ScrollCharacterReveal', 'GradientHeading'])
  } finally {
    await rm(inlineExportPath, { force: true })
  }
})

test('rejects invalid specs without writing a file', async () => {
  await rm(inlineExportPath, { force: true })

  const unknownComponent = await exportPage({
    spec: {
      ...heroSpec,
      sections: [{ ...heroSpec.sections[0], component: 'unknown.component' }],
    },
  })
  assert.equal(unknownComponent.ok, false)
  assert.equal(await pathExists(inlineExportPath), false)

  const missingVersion = await exportPage({ spec: { theme: heroSpec.theme, sections: heroSpec.sections } })
  assert.equal(missingVersion.ok, false)
  assert.equal(await pathExists(inlineExportPath), false)
})

test('rejects path traversal names and keeps paths inside exported-pages', async () => {
  const outsidePath = path.resolve(process.cwd(), 'escape.tsx')
  await rm(outsidePath, { force: true })

  assert.equal(exportPageInputSchema.safeParse({ name: '../escape' }).success, false)
  const pathResult = resolveExportPath('../escape')
  assert.equal(pathResult.ok, false)

  const result = await exportPage({ name: '../escape' })
  assert.equal(result.ok, false)
  assert.equal(await pathExists(outsidePath), false)
})
