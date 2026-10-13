// The three kinds of things you can track. Their display names live in config/kinds.ts.
export type Kind = 'mission' | 'craft' | 'journey'

// One saved checkpoint = one finished work session + your answers to the questions.
export interface Checkpoint {
  id: string
  /** Local calendar day the checkpoint was saved on, as YYYY-MM-DD. */
  dateKey: string
  /** When it was saved (ms since epoch). */
  savedAt: number
  /** How long the session ran, in milliseconds. */
  durationMs: number
  /** Answers keyed by question id (see config/questions.ts). */
  answers: Record<string, string>
}

// A session timer that survives page refreshes.
export interface TimerState {
  status: 'running' | 'paused'
  /** When the current running stretch began (ms since epoch). */
  startedAt: number
  /** Time banked from earlier stretches, in milliseconds. */
  accumulatedMs: number
}

export interface Item {
  id: string
  kind: Kind
  name: string
  createdAt: number
  /** YYYY-MM-DD, or null when there is no fixed deadline. */
  deadline: string | null
  /** true = you plan to work on it every day. */
  daily: boolean
  timer: TimerState | null
  checkpoints: Checkpoint[]
}
