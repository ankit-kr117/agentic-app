import assert from 'node:assert/strict'
import { test } from 'node:test'
import type { Checkpoint, Item } from '../types'
import { buildDays, countMissed, dayStatus, lastCheckpointKey } from './timeline'

function checkpoint(dateKey: string, savedAt: number, durationMs = 3_600_000): Checkpoint {
  return { id: `${dateKey}-${savedAt}`, dateKey, savedAt, durationMs, answers: { learned: 'x' } }
}

// Created on 10 Oct 2026 (local), so that day is Day 1.
function makeItem(daily: boolean, checkpoints: Checkpoint[]): Item {
  return {
    id: 'a',
    kind: 'mission',
    name: 'Python',
    createdAt: new Date(2026, 9, 10, 12).getTime(),
    deadline: null,
    daily,
    timer: null,
    checkpoints,
  }
}

const cps = [
  checkpoint('2026-10-10', new Date(2026, 9, 10, 20).getTime()),
  checkpoint('2026-10-12', new Date(2026, 9, 12, 9).getTime()),
  checkpoint('2026-10-12', new Date(2026, 9, 12, 21).getTime(), 1_800_000),
]

test('daily item lists every day newest first, with missed days as NULL', () => {
  const days = buildDays(makeItem(true, cps), '2026-10-13')
  assert.deepEqual(
    days.map((d) => [d.dateKey, d.dayNumber, d.status]),
    [
      ['2026-10-13', 4, 'pending'],
      ['2026-10-12', 3, 'saved'],
      ['2026-10-11', 2, 'missed'],
      ['2026-10-10', 1, 'saved'],
    ],
  )
})

test('several checkpoints on one day are grouped and totalled', () => {
  const day = buildDays(makeItem(true, cps), '2026-10-13').find((d) => d.dateKey === '2026-10-12')
  assert.ok(day)
  assert.equal(day.checkpoints.length, 2)
  assert.equal(day.totalMs, 3_600_000 + 1_800_000)
  assert.ok(day.checkpoints[0].savedAt < day.checkpoints[1].savedAt)
})

test('not-daily item lists only days that have checkpoints', () => {
  const days = buildDays(makeItem(false, cps), '2026-10-13')
  assert.deepEqual(
    days.map((d) => d.dateKey),
    ['2026-10-12', '2026-10-10'],
  )
  assert.equal(countMissed(makeItem(false, cps), '2026-10-13'), 0)
})

test('countMissed counts only past daily days without a checkpoint', () => {
  assert.equal(countMissed(makeItem(true, cps), '2026-10-13'), 1)
  assert.equal(countMissed(makeItem(true, cps), '2026-10-16'), 4)
})

test('brand new item shows today as pending, or nothing if not daily', () => {
  assert.deepEqual(
    buildDays(makeItem(true, []), '2026-10-10').map((d) => [d.dayNumber, d.status]),
    [[1, 'pending']],
  )
  assert.deepEqual(buildDays(makeItem(false, []), '2026-10-10'), [])
})

test('dayStatus covers every case', () => {
  const item = makeItem(true, cps)
  assert.equal(dayStatus(item, '2026-10-09', '2026-10-13'), 'before')
  assert.equal(dayStatus(item, '2026-10-10', '2026-10-13'), 'saved')
  assert.equal(dayStatus(item, '2026-10-11', '2026-10-13'), 'missed')
  assert.equal(dayStatus(item, '2026-10-13', '2026-10-13'), 'pending')
  assert.equal(dayStatus(item, '2026-10-14', '2026-10-13'), 'future')
  assert.equal(dayStatus(makeItem(false, cps), '2026-10-11', '2026-10-13'), 'none')
})

test('lastCheckpointKey', () => {
  assert.equal(lastCheckpointKey(makeItem(true, cps)), '2026-10-12')
  assert.equal(lastCheckpointKey(makeItem(true, [])), null)
})

test('a checkpoint dated after "today" (clock changed) still appears on a daily timeline', () => {
  const item = makeItem(true, [checkpoint('2026-10-15', 1)])
  const keys = buildDays(item, '2026-10-13').map((d) => d.dateKey)
  assert.equal(keys[0], '2026-10-15')
})
