import assert from 'node:assert/strict'
import test from 'node:test'
import { createElement, isValidElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { behaviorRegistry } from '../../registry'
import { PageRenderer } from '../../../page-builder/PageRenderer'

function setMediaMatches({ finePointer = false, reducedMotion = false }) {
  globalThis.window = {
    addEventListener() {},
    removeEventListener() {},
    matchMedia(query) {
      return {
        matches: query === '(pointer: fine)' ? finePointer : reducedMotion,
        addEventListener() {},
        removeEventListener() {},
      }
    },
  }
}

test('inview-entrance returns a usable wrapper and shows the final state for reduced motion', () => {
  setMediaMatches({ reducedMotion: true })
  const child = createElement('span', null, 'Visible content')
  const wrapper = behaviorRegistry['inview-entrance'].render({ delay: 0.2, x: 12, y: 24, duration: 0.5 })(child)

  assert.equal(isValidElement(wrapper), true)
  assert.equal(renderToStaticMarkup(wrapper), '<div><span>Visible content</span></div>')
})

test('pointer-magnet renders children unchanged for a coarse pointer', () => {
  setMediaMatches({ finePointer: false, reducedMotion: false })
  const child = createElement('section', { id: 'original' }, 'Original content')
  const wrapper = behaviorRegistry['pointer-magnet'].render({ strength: 4, radiusPx: 100 })(child)

  assert.equal(renderToStaticMarkup(wrapper), '<section id="original">Original content</section>')
})

test('PageRenderer renders a section with an inview enhancement', () => {
  setMediaMatches({ reducedMotion: true })
  const spec = {
    version: 1,
    theme: 'studio',
    sections: [
      {
        id: 'future-heading',
        component: 'section.gradient-heading',
        props: { text: 'Future in motion' },
        enhancements: [{ component: 'inview-entrance', props: {} }],
      },
    ],
  }

  const markup = renderToStaticMarkup(createElement(PageRenderer, { spec }))

  assert.match(markup, /^<main data-theme="studio"><div>/)
  assert.match(markup, /Future in motion/)
})
