import assert from 'node:assert/strict'
import { test } from 'node:test'
import { elapsedMs, pausedTimer, resumedTimer, startedTimer } from './timer'

test('no timer means no time', () => {
  assert.equal(elapsedMs(null, 1_000_000), 0)
})

test('a running timer counts up from its start', () => {
  const timer = startedTimer(1_000)
  assert.equal(elapsedMs(timer, 1_000), 0)
  assert.equal(elapsedMs(timer, 61_000), 60_000)
})

test('pausing freezes the clock and resuming continues from it', () => {
  const running = startedTimer(0)
  const paused = pausedTimer(running, 30_000)
  assert.equal(paused.status, 'paused')
  assert.equal(elapsedMs(paused, 999_999), 30_000)

  const resumed = resumedTimer(paused, 100_000)
  assert.equal(resumed.status, 'running')
  assert.equal(elapsedMs(resumed, 110_000), 40_000)
})

test('pausing a paused timer or resuming a running one changes nothing', () => {
  const paused = pausedTimer(startedTimer(0), 5_000)
  assert.equal(pausedTimer(paused, 9_000), paused)
  const running = startedTimer(0)
  assert.equal(resumedTimer(running, 9_000), running)
})

test('a clock that jumps backwards never produces negative time', () => {
  assert.equal(elapsedMs(startedTimer(10_000), 5_000), 0)
})
