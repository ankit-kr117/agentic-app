import type { Checkpoint, Item } from '../types'
import { addDays, dayNumber, toDateKey } from './dates'

// saved   = at least one checkpoint that day
// missed  = a past day of a daily item with no checkpoint (shown as "NULL")
// pending = today, daily item, nothing saved yet
// none    = a day of a not-daily item with nothing saved (not shown on the timeline)
// before  = earlier than the item's first day, future = later than today
export type DayStatus = 'saved' | 'missed' | 'pending' | 'none' | 'before' | 'future'

export interface DayEntry {
  dateKey: string
  dayNumber: number
  status: DayStatus
  checkpoints: Checkpoint[]
  totalMs: number
}

export function itemCreatedKey(item: Item): string {
  return toDateKey(item.createdAt)
}

export function checkpointsByDay(item: Item): Map<string, Checkpoint[]> {
  const map = new Map<string, Checkpoint[]>()
  for (const cp of item.checkpoints) {
    const list = map.get(cp.dateKey)
    if (list) list.push(cp)
    else map.set(cp.dateKey, [cp])
  }
  for (const list of map.values()) list.sort((a, b) => a.savedAt - b.savedAt)
  return map
}

export function lastCheckpointKey(item: Item): string | null {
  let last: string | null = null
  for (const cp of item.checkpoints) {
    if (last === null || cp.dateKey > last) last = cp.dateKey
  }
  return last
}

export function dayStatus(
  item: Item,
  dateKey: string,
  todayKey: string,
  byDay: Map<string, Checkpoint[]> = checkpointsByDay(item),
): DayStatus {
  if (byDay.has(dateKey)) return 'saved'
  if (dateKey < itemCreatedKey(item)) return 'before'
  if (dateKey > todayKey) return 'future'
  if (!item.daily) return 'none'
  return dateKey === todayKey ? 'pending' : 'missed'
}

/**
 * Timeline rows, newest first.
 * Daily items list every day since creation (so missed days show up as NULL).
 * Other items list only the days that have checkpoints.
 */
export function buildDays(item: Item, todayKey: string): DayEntry[] {
  const byDay = checkpointsByDay(item)
  const createdKey = itemCreatedKey(item)

  let keys: string[]
  if (item.daily) {
    const lastKey = lastCheckpointKey(item)
    const endKey = lastKey !== null && lastKey > todayKey ? lastKey : todayKey
    keys = []
    for (let key = createdKey; key <= endKey; key = addDays(key, 1)) keys.push(key)
  } else {
    keys = [...byDay.keys()].sort()
  }

  return keys
    .map((dateKey): DayEntry => {
      const checkpoints = byDay.get(dateKey) ?? []
      return {
        dateKey,
        dayNumber: dayNumber(createdKey, dateKey),
        status: dayStatus(item, dateKey, todayKey, byDay),
        checkpoints,
        totalMs: checkpoints.reduce((sum, cp) => sum + cp.durationMs, 0),
      }
    })
    .reverse()
}

export function countMissed(item: Item, todayKey: string): number {
  return buildDays(item, todayKey).filter((d) => d.status === 'missed').length
}
