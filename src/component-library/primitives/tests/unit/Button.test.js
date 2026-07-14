import assert from 'node:assert/strict'
import test from 'node:test'
import { Button } from '../../Button'

test('renders an anchor for href and a button otherwise', () => {
  const link = Button({ href: 'https://example.com/work', children: 'View work' })
  const button = Button({ children: 'Start a chat' })

  assert.equal(link.type, 'a')
  assert.equal(link.props.href, 'https://example.com/work')
  assert.equal(link.props.rel, 'noopener noreferrer')
  assert.equal(button.type, 'button')
  assert.equal(button.props.type, 'button')
})

test('applies the requested variant classes', () => {
  const primary = Button({ children: 'Primary' })
  const secondary = Button({ variant: 'secondary', children: 'Secondary' })
  const tertiary = Button({ variant: 'tertiary', children: 'Tertiary' })

  assert.match(primary.props.className, /bg-primary/)
  assert.match(primary.props.className, /shadow-\[var\(--shadow-button-primary\)\]/)
  assert.match(secondary.props.className, /bg-card/)
  assert.match(secondary.props.className, /shadow-\[var\(--shadow-button-secondary\)\]/)
  assert.match(tertiary.props.className, /shadow-\[var\(--shadow-button-tertiary\)\]/)
})

test('blocks disabled button and anchor interaction', () => {
  const button = Button({ disabled: true, children: 'Disabled' })
  const link = Button({ href: '/work', disabled: true, children: 'Disabled link' })
  let prevented = false

  link.props.onClick({ preventDefault: () => (prevented = true) })

  assert.equal(button.props.disabled, true)
  assert.equal(link.props['aria-disabled'], true)
  assert.equal(link.props.tabIndex, -1)
  assert.equal(prevented, true)
})
