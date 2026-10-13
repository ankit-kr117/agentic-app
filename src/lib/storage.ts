import { KIND_ORDER } from '../config/kinds'
import type { Checkpoint, Item, TimerState } from '../types'

// PROTOTYPE STORAGE: data lives in this browser only (localStorage).
// It is not synced across devices or users. A real backend comes in a later phase.
export const STORAGE_KEY = 'checkpoint:v1:items'

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function normalizeCheckpoint(value: unknown): Checkpoint | null {
  if (!isRecord(value)) return null
  const { id, dateKey, savedAt, durationMs, answers } = value
  if (typeof id !== 'string' || typeof dateKey !== 'string') return null
  if (typeof savedAt !== 'number' || typeof durationMs !== 'number') return null
  const cleanAnswers: Record<string, string> = {}
  if (isRecord(answers)) {
    for (const [key, text] of Object.entries(answers)) {
      if (typeof text === 'string') cleanAnswers[key] = text
    }
  }
  return { id, dateKey, savedAt, durationMs, answers: cleanAnswers }
}

function normalizeTimer(value: unknown): TimerState | null {
  if (!isRecord(value)) return null
  const { status, startedAt, accumulatedMs } = value
  if (status !== 'running' && status !== 'paused') return null
  if (typeof startedAt !== 'number' || typeof accumulatedMs !== 'number') return null
  return { status, startedAt, accumulatedMs }
}

/** Turns unknown saved data into a safe Item, or null if it is unusable. */
export function normalizeItem(value: unknown): Item | null {
  if (!isRecord(value)) return null
  const { id, kind, name, createdAt, deadline, daily, timer, checkpoints } = value
  if (typeof id !== 'string' || typeof name !== 'string' || typeof createdAt !== 'number') return null
  if (typeof kind !== 'string' || !(KIND_ORDER as string[]).includes(kind)) return null
  return {
    id,
    kind: kind as Item['kind'],
    name,
    createdAt,
    deadline: typeof deadline === 'string' ? deadline : null,
    daily: daily === true,
    timer: normalizeTimer(timer),
    checkpoints: Array.isArray(checkpoints)
      ? checkpoints.map(normalizeCheckpoint).filter((cp): cp is Checkpoint => cp !== null)
      : [],
  }
}

export function loadItems(): Item[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const data: unknown = JSON.parse(raw)
    if (!Array.isArray(data)) return []
    return data.map(normalizeItem).filter((item): item is Item => item !== null)
  } catch {
    return []
  }
}

/** Returns false if the browser refused to save (private mode, storage full, ...). */
export function saveItems(items: Item[]): boolean {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
    return true
  } catch {
    return false
  }
}
