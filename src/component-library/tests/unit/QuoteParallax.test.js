import assert from 'node:assert/strict'
import test from 'node:test'
import { getQuoteParallaxOffset } from '../../components/QuoteParallax'

test('moves the portrait from below to above center as the section scrolls through the viewport', () => {
  assert.equal(getQuoteParallaxOffset(800, 600, 800), 100)
  assert.equal(getQuoteParallaxOffset(100, 600, 800), 0)
  assert.equal(getQuoteParallaxOffset(-600, 600, 800), -100)
})

test('clamps the portrait offset outside the viewport', () => {
  assert.equal(getQuoteParallaxOffset(1600, 600, 800), 100)
  assert.equal(getQuoteParallaxOffset(-1200, 600, 800), -100)
})
