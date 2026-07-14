import assert from 'node:assert/strict'
import test from 'node:test'
import { buildThemeCss, THEMES, THEME_VARIABLES } from '../../index.ts'

test('every theme defines the full token contract', () => {
  for (const theme of Object.values(THEMES)) {
    assert.deepEqual(Object.keys(theme), [...THEME_VARIABLES])
  }
  assert.equal(THEMES.claude2code['--primary'], '#F4731C')
  assert.equal(THEMES.claude2code['--muted'], '#E1D9C9')
})

test('buildThemeCss emits data-theme selectors and token declarations', () => {
  const css = buildThemeCss()

  assert.match(css, /\[data-theme='studio'\] \{/)
  assert.match(css, /\[data-theme='claude2code'\] \{/)
  assert.match(css, /--primary: #051A24;/)
  assert.match(css, /--fs-display: clamp\(2\.25rem, 5vw, 4\.5rem\);/)
})
