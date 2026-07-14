import assert from 'node:assert/strict'
import test from 'node:test'
import {
  fullBleedVideoPropsSchema,
  heroPropsSchema,
  marqueePropsSchema,
  safeHrefSchema,
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

test('safe href allows HTTPS and anchors while rejecting executable protocols', () => {
  assert.equal(safeHrefSchema.safeParse('https://example.com/work').success, true)
  assert.equal(safeHrefSchema.safeParse('#contact').success, true)
  assert.equal(safeHrefSchema.safeParse('/work').success, true)
  assert.equal(safeHrefSchema.safeParse('javascript:alert(1)').success, false)
  assert.equal(safeHrefSchema.safeParse('data:text/html,bad').success, false)
  assert.equal(safeHrefSchema.safeParse('//example.com/work').success, false)
})
