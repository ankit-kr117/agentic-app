import { useEffect, useMemo, useState } from 'react'
import { QUESTIONS } from '../../config/questions'
import { formatDateLong, formatDuration, formatTimeOfDay } from '../../lib/dates'
import { buildDays, type DayEntry } from '../../lib/timeline'
import type { Item } from '../../types'

export interface TimelineFocus {
  dateKey: string
  /** Changes on every click so selecting the same day twice still works. */
  nonce: number
}

interface TimelineProps {
  item: Item
  todayKey: string
  /** Set by the calendar to open and scroll to a day. */
  focus: TimelineFocus | null
}

export function Timeline({ item, todayKey, focus }: TimelineProps) {
  const days = useMemo(() => buildDays(item, todayKey), [item, todayKey])
  // The newest day with checkpoints starts open.
  const [openKeys, setOpenKeys] = useState<Set<string>>(() => {
    const first = days.find((day) => day.checkpoints.length > 0)
    return new Set(first ? [first.dateKey] : [])
  })

  useEffect(() => {
    if (!focus) return
    setOpenKeys((prev) => new Set(prev).add(focus.dateKey))
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    document.getElementById(`day-${focus.dateKey}`)?.scrollIntoView({
      behavior: reduceMotion ? 'auto' : 'smooth',
      block: 'center',
    })
  }, [focus])

  function setOpen(dateKey: string, isOpen: boolean) {
    setOpenKeys((prev) => {
      if (prev.has(dateKey) === isOpen) return prev
      const next = new Set(prev)
      if (isOpen) next.add(dateKey)
      else next.delete(dateKey)
      return next
    })
  }

  return (
    <section aria-labelledby="timeline-heading">
      <div className="mb-5">
        <p className="font-script text-3xl leading-none text-accent">The trail</p>
        <h2 id="timeline-heading" className="font-display text-3xl uppercase tracking-wide">
          Timeline
        </h2>
      </div>

      {days.length === 0 ? (
        <div className="rounded-xl border border-dashed border-line px-5 py-10 text-center">
          <p className="text-muted">No checkpoints yet.</p>
          <p className="mt-1 text-sm text-muted">Start a session above, then save your first checkpoint.</p>
        </div>
      ) : (
        <ol className="relative space-y-3 before:absolute before:bottom-3 before:left-[0.95rem] before:top-3 before:w-px before:bg-line">
          {days.map((day) => (
            <li key={day.dateKey} id={`day-${day.dateKey}`} className="relative pl-10">
              <DayNode status={day.status} />
              <DayRow day={day} open={openKeys.has(day.dateKey)} onToggle={(isOpen) => setOpen(day.dateKey, isOpen)} />
            </li>
          ))}
        </ol>
      )}
    </section>
  )
}

function DayNode({ status }: { status: DayEntry['status'] }) {
  const style =
    status === 'saved'
      ? 'border-accent bg-accent'
      : status === 'missed'
        ? 'border-alert bg-ink'
        : 'border-accent bg-ink beacon'
  return <span aria-hidden="true" className={`absolute left-[0.4rem] top-5 h-3.5 w-3.5 rounded-full border-2 ${style}`} />
}

function DayRow({ day, open, onToggle }: { day: DayEntry; open: boolean; onToggle: (open: boolean) => void }) {
  const heading = (
    <div className="flex flex-1 flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
      <div className="flex items-baseline gap-3">
        <span className="font-display text-2xl uppercase tracking-wide">Day {day.dayNumber}</span>
        <span className="text-sm text-muted">{formatDateLong(day.dateKey)}</span>
      </div>
      <div className="text-sm">
        {day.status === 'saved' && (
          <span className="text-accent">
            {formatDuration(day.totalMs)} · {day.checkpoints.length} checkpoint{day.checkpoints.length === 1 ? '' : 's'}
          </span>
        )}
        {day.status === 'missed' && (
          <span className="text-alert">
            <span className="font-display tracking-wider">NULL</span> · no checkpoint
          </span>
        )}
        {day.status === 'pending' && <span className="text-muted">Today · not saved yet</span>}
      </div>
    </div>
  )

  if (day.status !== 'saved') {
    return <div className="flex items-center rounded-xl border border-line bg-panel/60 px-4 py-3">{heading}</div>
  }

  return (
    <details
      open={open}
      onToggle={(event) => onToggle(event.currentTarget.open)}
      className="rounded-xl border border-line bg-panel/60 open:border-accent/40"
    >
      <summary className="day-summary flex items-center gap-3 rounded-xl px-4 py-3">
        {heading}
        <svg className="chevron h-4 w-4 shrink-0 text-muted transition-transform" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path d="M3 6l5 5 5-5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </summary>

      <div className="space-y-4 border-t border-line px-4 py-4">
        {day.checkpoints.map((checkpoint, index) => (
          <article key={checkpoint.id} className="space-y-3">
            <p className="text-xs uppercase tracking-wider text-muted">
              Session {index + 1} · {formatTimeOfDay(checkpoint.savedAt)} · {formatDuration(checkpoint.durationMs)}
            </p>
            <dl className="space-y-3">
              {QUESTIONS.filter((question) => checkpoint.answers[question.id]).map((question) => (
                <div key={question.id}>
                  <dt className="font-script text-xl leading-none text-accent">{question.prompt}</dt>
                  <dd className="mt-1 whitespace-pre-wrap text-sm leading-relaxed">{checkpoint.answers[question.id]}</dd>
                </div>
              ))}
            </dl>
          </article>
        ))}
      </div>
    </details>
  )
}
