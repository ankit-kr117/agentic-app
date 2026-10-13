import type { TimerState } from '../types'

/** Milliseconds on the clock right now. */
export function elapsedMs(timer: TimerState | null, now: number): number {
  if (!timer) return 0
  if (timer.status === 'paused') return timer.accumulatedMs
  return timer.accumulatedMs + Math.max(0, now - timer.startedAt)
}

export function startedTimer(now: number): TimerState {
  return { status: 'running', startedAt: now, accumulatedMs: 0 }
}

export function pausedTimer(timer: TimerState, now: number): TimerState {
  if (timer.status === 'paused') return timer
  return { status: 'paused', startedAt: timer.startedAt, accumulatedMs: elapsedMs(timer, now) }
}

export function resumedTimer(timer: TimerState, now: number): TimerState {
  if (timer.status === 'running') return timer
  return { status: 'running', startedAt: now, accumulatedMs: timer.accumulatedMs }
}
