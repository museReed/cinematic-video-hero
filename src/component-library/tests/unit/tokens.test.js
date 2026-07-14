import assert from 'node:assert/strict'
import test from 'node:test'
import { Z_LAYERS } from '../../tokens'

test('exports the shared z-index layer contract', () => {
  assert.deepEqual(Z_LAYERS, {
    content: 10,
    panel: 30,
    chrome: 50,
  })
})
