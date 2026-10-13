import { useState } from 'react'
import { formatClock } from '../../lib/dates'
import { elapsedMs } from '../../lib/timer'
import { useItems } from '../../store/useItems'
import type { Item } from '../../types'
import { CheckpointModal } from './CheckpointModal'

interface SessionTimerProps {
  item: Item
  /** The current time in ms (ticks every second while the timer runs). */
  now: number
}

export function SessionTimer({ item, now }: SessionTimerProps) {
  const { startTimer, pauseTimer, resumeTimer, discardTimer } = useItems()
  const [finishing, setFinishing] = useState(false)

  const timer = item.timer
  const running = timer?.status === 'running'
  const elapsed = elapsedMs(timer, now)

  function finish() {
    if (running) pauseTimer(item.id)
    setFinishing(true)
  }

  function discard() {
    if (window.confirm('Discard this session? Its time will not be saved.')) discardTimer(item.id)
  }

  return (
    <section aria-label="Work session" className="rounded-2xl border border-line bg-panel/60 p-5 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-5">
        <div>
          <p className="font-script text-3xl leading-none text-accent">Session</p>
          <p
            role="timer"
            aria-live="off"
            className={`font-display text-6xl leading-tight tabular-nums tracking-wide sm:text-7xl ${
              timer ? 'text-text' : 'text-muted'
            }`}
          >
            {formatClock(elapsed)}
          </p>
          <p className="mt-1 flex items-center gap-2 text-sm text-muted">
            {running && <span className="beacon h-2 w-2 rounded-full bg-accent" aria-hidden="true" />}
            {!timer && 'Start the timer when you begin working.'}
            {timer?.status === 'running' && 'Running'}
            {timer?.status === 'paused' && 'Paused'}
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          {!timer && (
            <button type="button" className="btn btn-primary" onClick={() => startTimer(item.id)}>
              Start session
            </button>
          )}
          {timer?.status === 'running' && (
            <button type="button" className="btn" onClick={() => pauseTimer(item.id)}>
              Pause
            </button>
          )}
          {timer?.status === 'paused' && (
            <button type="button" className="btn" onClick={() => resumeTimer(item.id)}>
              Resume
            </button>
          )}
          {timer && (
            <>
              <button type="button" className="btn btn-primary" onClick={finish}>
                Finish &amp; save checkpoint
              </button>
              <button type="button" className="btn btn-danger" onClick={discard}>
                Discard
              </button>
            </>
          )}
        </div>
      </div>

      <p className="mt-4 text-xs text-muted">Time is only counted while you run the timer yourself.</p>

      <CheckpointModal
        open={finishing && timer !== null}
        onClose={() => setFinishing(false)}
        itemId={item.id}
        durationMs={elapsed}
      />
    </section>
  )
}
