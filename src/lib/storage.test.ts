import assert from 'node:assert/strict'
import { test } from 'node:test'
import { normalizeItem } from './storage'

test('a valid saved item is accepted', () => {
  const item = normalizeItem({
    id: 'a',
    kind: 'craft',
    name: 'Guitar',
    createdAt: 1,
    deadline: '2026-12-01',
    daily: true,
    timer: { status: 'paused', startedAt: 5, accumulatedMs: 10 },
    checkpoints: [{ id: 'c', dateKey: '2026-10-14', savedAt: 2, durationMs: 3, answers: { learned: 'chords' } }],
  })
  assert.ok(item)
  assert.equal(item.kind, 'craft')
  assert.equal(item.checkpoints.length, 1)
  assert.equal(item.timer?.status, 'paused')
})

test('missing optional fields get safe defaults', () => {
  const item = normalizeItem({ id: 'a', kind: 'journey', name: 'Rust', createdAt: 1 })
  assert.ok(item)
  assert.equal(item.deadline, null)
  assert.equal(item.daily, false)
  assert.equal(item.timer, null)
  assert.deepEqual(item.checkpoints, [])
})

test('broken data is rejected instead of crashing the app', () => {
  assert.equal(normalizeItem(null), null)
  assert.equal(normalizeItem('text'), null)
  assert.equal(normalizeItem([]), null)
  assert.equal(normalizeItem({ id: 'a', kind: 'wizard', name: 'x', createdAt: 1 }), null)
  assert.equal(normalizeItem({ id: 1, kind: 'mission', name: 'x', createdAt: 1 }), null)
})

test('broken checkpoints and timers are dropped, the item survives', () => {
  const item = normalizeItem({
    id: 'a',
    kind: 'mission',
    name: 'x',
    createdAt: 1,
    timer: { status: 'weird' },
    checkpoints: [{ nope: true }, null, { id: 'c', dateKey: 'd', savedAt: 1, durationMs: 1, answers: { a: 5, b: 'ok' } }],
  })
  assert.ok(item)
  assert.equal(item.timer, null)
  assert.equal(item.checkpoints.length, 1)
  assert.deepEqual(item.checkpoints[0].answers, { b: 'ok' })
})
