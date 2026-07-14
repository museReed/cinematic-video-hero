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
      component: 'cinematic.hero-reveal' as const,
      props: { eyebrow: 'Testing', title: 'Fixed templates' },
    },
    {
      id: 'moving-message',
      component: 'creator.scroll-marquee' as const,
      props: { text: 'Only registry components', repeat: 3, speed: 'normal' },
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
    assert.deepEqual(componentTags, ['HeroReveal', 'ScrollMarquee'])
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
