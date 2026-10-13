// Dates are stored as local calendar-day keys like "2026-10-14".
// Comparing two keys as plain strings also orders them correctly.

const DAY_MS = 86_400_000

const pad = (n: number): string => String(n).padStart(2, '0')

export function toDateKey(value: number | Date): string {
  const d = typeof value === 'number' ? new Date(value) : value
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

export function parseDateKey(key: string): Date {
  const [y, m, d] = key.split('-').map(Number)
  return new Date(y, m - 1, d)
}

export function isValidDateKey(key: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(key)) return false
  return toDateKey(parseDateKey(key)) === key
}

function dayIndex(key: string): number {
  const [y, m, d] = key.split('-').map(Number)
  return Math.round(Date.UTC(y, m - 1, d) / DAY_MS)
}

/** Whole days from one key to another (negative if `toKey` is earlier). */
export function daysBetween(fromKey: string, toKey: string): number {
  return dayIndex(toKey) - dayIndex(fromKey)
}

export function addDays(key: string, amount: number): string {
  const d = parseDateKey(key)
  d.setDate(d.getDate() + amount)
  return toDateKey(d)
}

/** The day the item was created is Day 1. */
export function dayNumber(createdKey: string, dateKey: string): number {
  return daysBetween(createdKey, dateKey) + 1
}

/** "1h 05m", "45m", "<1m" */
export function formatDuration(ms: number): string {
  if (ms <= 0) return '0m'
  const totalMin = Math.floor(ms / 60_000)
  if (totalMin < 1) return '<1m'
  const h = Math.floor(totalMin / 60)
  const m = totalMin % 60
  return h > 0 ? `${h}h ${pad(m)}m` : `${m}m`
}

/** "01:02:05" for the live timer. */
export function formatClock(ms: number): string {
  const total = Math.max(0, Math.floor(ms / 1000))
  const h = Math.floor(total / 3600)
  const m = Math.floor((total % 3600) / 60)
  const s = total % 60
  return `${pad(h)}:${pad(m)}:${pad(s)}`
}

export function formatDateLong(key: string): string {
  return parseDateKey(key).toLocaleDateString('en-IN', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

export function formatTimeOfDay(ms: number): string {
  return new Date(ms).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
}

export interface DeadlineLabel {
  text: string
  overdue: boolean
  /** Due today or within 3 days. */
  soon: boolean
}

export function deadlineLabel(deadlineKey: string, todayKey: string): DeadlineLabel {
  const left = daysBetween(todayKey, deadlineKey)
  if (left < 0) {
    const n = -left
    return { text: `${n} day${n === 1 ? '' : 's'} overdue`, overdue: true, soon: false }
  }
  if (left === 0) return { text: 'Due today', overdue: false, soon: true }
  return { text: `${left} day${left === 1 ? '' : 's'} left`, overdue: false, soon: left <= 3 }
}

/** "today", "yesterday", "3 days ago" */
export function relativeDay(dateKey: string, todayKey: string): string {
  const n = daysBetween(dateKey, todayKey)
  if (n <= 0) return 'today'
  if (n === 1) return 'yesterday'
  return `${n} days ago`
}
