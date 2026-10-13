import assert from 'node:assert/strict'
import { test } from 'node:test'
import {
  addDays,
  dayNumber,
  daysBetween,
  deadlineLabel,
  formatClock,
  formatDuration,
  isValidDateKey,
  relativeDay,
  toDateKey,
} from './dates'

test('toDateKey uses the local calendar day', () => {
  assert.equal(toDateKey(new Date(2026, 9, 14, 23, 59)), '2026-10-14')
  assert.equal(toDateKey(new Date(2026, 0, 5, 0, 1)), '2026-01-05')
})

test('addDays crosses month, year and leap-day boundaries', () => {
  assert.equal(addDays('2026-10-31', 1), '2026-11-01')
  assert.equal(addDays('2026-12-31', 1), '2027-01-01')
  assert.equal(addDays('2028-02-28', 1), '2028-02-29')
  assert.equal(addDays('2026-03-01', -1), '2026-02-28')
})

test('daysBetween and dayNumber count whole days (even across DST changes)', () => {
  assert.equal(daysBetween('2026-10-13', '2026-10-14'), 1)
  assert.equal(daysBetween('2026-03-07', '2026-03-09'), 2)
  assert.equal(daysBetween('2026-11-01', '2026-10-30'), -2)
  assert.equal(dayNumber('2026-10-13', '2026-10-13'), 1)
  assert.equal(dayNumber('2026-10-13', '2026-10-14'), 2)
  assert.equal(dayNumber('2026-12-30', '2027-01-02'), 4)
})

test('isValidDateKey rejects bad input', () => {
  assert.equal(isValidDateKey('2026-10-14'), true)
  assert.equal(isValidDateKey('2026-02-30'), false)
  assert.equal(isValidDateKey('14-10-2026'), false)
  assert.equal(isValidDateKey(''), false)
})

test('formatDuration', () => {
  assert.equal(formatDuration(0), '0m')
  assert.equal(formatDuration(30_000), '<1m')
  assert.equal(formatDuration(45 * 60_000), '45m')
  assert.equal(formatDuration(125 * 60_000), '2h 05m')
  assert.equal(formatDuration(120 * 60_000), '2h 00m')
})

test('formatClock', () => {
  assert.equal(formatClock(0), '00:00:00')
  assert.equal(formatClock(3_725_000), '01:02:05')
  assert.equal(formatClock(-5), '00:00:00')
})

test('deadlineLabel', () => {
  assert.deepEqual(deadlineLabel('2026-10-20', '2026-10-14'), { text: '6 days left', overdue: false, soon: false })
  assert.deepEqual(deadlineLabel('2026-10-15', '2026-10-14'), { text: '1 day left', overdue: false, soon: true })
  assert.deepEqual(deadlineLabel('2026-10-14', '2026-10-14'), { text: 'Due today', overdue: false, soon: true })
  assert.deepEqual(deadlineLabel('2026-10-12', '2026-10-14'), { text: '2 days overdue', overdue: true, soon: false })
})

test('relativeDay', () => {
  assert.equal(relativeDay('2026-10-14', '2026-10-14'), 'today')
  assert.equal(relativeDay('2026-10-13', '2026-10-14'), 'yesterday')
  assert.equal(relativeDay('2026-10-10', '2026-10-14'), '4 days ago')
})
