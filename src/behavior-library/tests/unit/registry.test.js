import assert from 'node:assert/strict'
import test from 'node:test'
import React, { createElement, isValidElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { behaviorRegistry } from '../../registry'
import { PageRenderer } from '../../../page-builder/PageRenderer'

globalThis.React = React

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

test('pointer-overlay renders children unchanged for coarse pointers and reduced motion', () => {
  const child = createElement('main', null, 'Original page')

  setMediaMatches({ finePointer: false, reducedMotion: false })
  const coarse = behaviorRegistry['pointer-overlay'].render({ variant: 'cursor' })(child)
  assert.equal(renderToStaticMarkup(coarse), '<main>Original page</main>')

  setMediaMatches({ finePointer: true, reducedMotion: true })
  const reduced = behaviorRegistry['pointer-overlay'].render({ variant: 'cursor' })(child)
  assert.equal(renderToStaticMarkup(reduced), '<main>Original page</main>')
})

test('scroll-director renders the final readable state for reduced motion', () => {
  setMediaMatches({ reducedMotion: true })
  const child = createElement('main', null, 'Readable page')
  const wrapper = behaviorRegistry['scroll-director'].render({})(child)

  assert.equal(renderToStaticMarkup(wrapper), '<main>Readable page</main>')
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

test('PageRenderer renders a page with a pointer-overlay behavior', () => {
  setMediaMatches({ finePointer: false, reducedMotion: false })
  const spec = {
    version: 1,
    theme: 'studio',
    sections: [
      {
        id: 'future-heading',
        component: 'section.gradient-heading',
        props: { text: 'Future in motion' },
      },
    ],
    behaviors: [{ component: 'pointer-overlay', props: { variant: 'cursor' } }],
  }

  const markup = renderToStaticMarkup(createElement(PageRenderer, { spec }))

  assert.match(markup, /^<main data-theme="studio">/)
  assert.match(markup, /Future in motion/)
})
