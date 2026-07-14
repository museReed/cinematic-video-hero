import assert from 'node:assert/strict'
import test from 'node:test'
import {
  fullBleedVideoPropsSchema,
  heroPropsSchema,
  masonryGridPropsSchema,
  marqueePropsSchema,
  quoteParallaxPropsSchema,
  safeHrefSchema,
  splitVideoScrubPropsSchema,
  testimonialCarouselPropsSchema,
} from '../../../src/component-library/schemas'

const videoSrc = 'https://d8j0ntlcm91z4.cloudfront.net/demo.mp4'

test('hero accepts cinematic and editorial layouts', () => {
  assert.equal(heroPropsSchema.safeParse({ eyebrow: 'Intro', title: 'A new wave', layout: 'cinematic' }).success, true)
  assert.equal(
    heroPropsSchema.safeParse({ eyebrow: 'Studio', title: 'The bold way', body: 'A small creative studio.', layout: 'editorial' }).success,
    true,
  )
  assert.equal(heroPropsSchema.parse({ eyebrow: 'Intro', title: 'A new wave' }).layout, 'cinematic')
})

test('full-bleed video validates interaction, fallback, and focal boundaries', () => {
  assert.equal(
    fullBleedVideoPropsSchema.safeParse({
      src: videoSrc,
      focalY: -30,
      interaction: 'none',
      fallback: 'radial-glow',
    }).success,
    true,
  )
  assert.equal(
    fullBleedVideoPropsSchema.safeParse({
      src: videoSrc,
      focalY: 40,
      interaction: 'scrub',
      fallback: 'solid',
    }).success,
    true,
  )
  assert.equal(fullBleedVideoPropsSchema.safeParse({ src: videoSrc, focalY: -31 }).success, false)
  assert.equal(fullBleedVideoPropsSchema.safeParse({ src: videoSrc, focalY: 41 }).success, false)
  assert.equal(fullBleedVideoPropsSchema.safeParse({ src: videoSrc, focalY: 0.5 }).success, false)
})

test('marquee validates text and gif-rail branches', () => {
  const textResult = marqueePropsSchema.safeParse({ content: 'text', text: 'Make every frame count', speed: 'normal' })
  assert.equal(textResult.success, true)
  if (textResult.success && textResult.data.content === 'text') assert.equal(textResult.data.rows, 2)

  assert.equal(
    marqueePropsSchema.safeParse({
      content: 'gif-rail',
      items: ['/characters/fluent-astronaut.png', '/characters/fluent-mage.png'],
      speed: 'fast',
    }).success,
    true,
  )
  assert.equal(
    marqueePropsSchema.safeParse({ content: 'gif-rail', items: ['/characters/fluent-astronaut.png'], speed: 'slow' }).success,
    false,
  )
})

test('testimonial carousel enforces item, timing, width, and strict object boundaries', () => {
  const items = [
    { quote: 'Precise and thoughtful.', author: 'Mara', company: 'Northstar' },
    { quote: 'Our strongest launch.', author: 'Alex', company: 'Nexgate' },
  ]
  assert.equal(testimonialCarouselPropsSchema.parse({ items }).autoAdvanceMs, 3000)
  assert.equal(testimonialCarouselPropsSchema.safeParse({ items, autoAdvanceMs: 2000, cardWidth: 240 }).success, true)
  assert.equal(testimonialCarouselPropsSchema.safeParse({ items: items.slice(0, 1) }).success, false)
  assert.equal(testimonialCarouselPropsSchema.safeParse({ items, autoAdvanceMs: 1999 }).success, false)
  assert.equal(testimonialCarouselPropsSchema.safeParse({ items, cardWidth: 601 }).success, false)
  assert.equal(testimonialCarouselPropsSchema.safeParse({ items, unexpected: true }).success, false)
  assert.equal(
    testimonialCarouselPropsSchema.safeParse({ items: [{ ...items[0], unexpected: true }, items[1]] }).success,
    false,
  )
})

test('split video scrub validates modes and ordered dead-zone thresholds', () => {
  assert.equal(splitVideoScrubPropsSchema.parse({ left: videoSrc, right: videoSrc }).mode, 'independent')
  assert.equal(
    splitVideoScrubPropsSchema.safeParse({
      left: videoSrc,
      right: videoSrc,
      mode: 'dead-zone',
      deadZone: { left: 0.42, right: 0.58 },
    }).success,
    true,
  )
  assert.equal(
    splitVideoScrubPropsSchema.safeParse({
      left: videoSrc,
      right: videoSrc,
      mode: 'dead-zone',
      deadZone: { left: 0.6, right: 0.4 },
    }).success,
    false,
  )
  assert.equal(
    splitVideoScrubPropsSchema.safeParse({
      left: videoSrc,
      right: videoSrc,
      mode: 'independent',
      deadZone: { left: 0.42, right: 0.58 },
    }).success,
    false,
  )
})

test('masonry grid validates allowlisted items, aspect bounds, columns, and defaults', () => {
  const items = [
    { src: '/characters/fluent-astronaut.png', aspect: 0.3 },
    { src: '/characters/fluent-mage.png', aspect: 3 },
  ]
  assert.equal(masonryGridPropsSchema.safeParse({ items }).success, true)
  assert.deepEqual(masonryGridPropsSchema.parse({ items, columns: {} }).columns, { mobile: 2, desktop: 3 })
  assert.equal(masonryGridPropsSchema.safeParse({ items, columns: { mobile: 1, desktop: 4 } }).success, true)
  assert.equal(masonryGridPropsSchema.safeParse({ items: [{ ...items[0], aspect: 0.29 }, items[1]] }).success, false)
  assert.equal(masonryGridPropsSchema.safeParse({ items, columns: { mobile: 2, desktop: 5 } }).success, false)
  assert.equal(masonryGridPropsSchema.safeParse({ items, columns: { mobile: 2, desktop: 3, extra: true } }).success, false)
})

test('quote parallax validates copy, companies, portrait allowlist, and strictness', () => {
  const valid = {
    quote: 'We built the studio we wanted to work with.',
    author: 'Viktor Oddy',
    companies: ['Apple', 'IDEO', 'Polygon'],
    portrait: '/characters/fluent-mage.png',
  }
  assert.equal(quoteParallaxPropsSchema.safeParse(valid).success, true)
  assert.equal(quoteParallaxPropsSchema.safeParse({ ...valid, companies: [...valid.companies, 'Fourth'] }).success, false)
  assert.equal(quoteParallaxPropsSchema.safeParse({ ...valid, portrait: 'https://example.com/portrait.png' }).success, false)
  assert.equal(quoteParallaxPropsSchema.safeParse({ ...valid, extra: true }).success, false)
})

test('safe href allows HTTPS and anchors while rejecting executable protocols', () => {
  assert.equal(safeHrefSchema.safeParse('https://example.com/work').success, true)
  assert.equal(safeHrefSchema.safeParse('#contact').success, true)
  assert.equal(safeHrefSchema.safeParse('/work').success, true)
  assert.equal(safeHrefSchema.safeParse('javascript:alert(1)').success, false)
  assert.equal(safeHrefSchema.safeParse('data:text/html,bad').success, false)
  assert.equal(safeHrefSchema.safeParse('//example.com/work').success, false)
})
