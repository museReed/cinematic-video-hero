import assert from 'node:assert/strict'
import test from 'node:test'
import { buildThemeCss } from '../../index.ts'

test('buildThemeCss emits glass surface and z-index variables', () => {
  const css = buildThemeCss()

  assert.match(css, /--z-content: 10;/)
  assert.match(css, /--z-panel: 30;/)
  assert.match(css, /--z-chrome: 50;/)
  assert.match(css, /\.glass \{/)
  assert.match(css, /\.glass::before \{/)
  assert.match(css, /border: 1px solid color-mix/)
  assert.match(css, /background-blend-mode: luminosity;/)
  assert.match(css, /-webkit-backdrop-filter: blur\(4px\);/)
  assert.match(css, /-webkit-mask:/)
  assert.match(css, /mask-composite: exclude;/)
})
