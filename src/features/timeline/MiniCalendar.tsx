import { useMemo, useState } from 'react'
import { formatDateLong, toDateKey } from '../../lib/dates'
import { checkpointsByDay, dayStatus, type DayStatus } from '../../lib/timeline'
import type { Item } from '../../types'

interface MiniCalendarProps {
  item: Item
  todayKey: string
  onSelectDay: (dateKey: string) => void
}

const WEEKDAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S']

const STATUS_TEXT: Record<DayStatus, string> = {
  saved: 'checkpoint saved',
  missed: 'no checkpoint',
  pending: 'not saved yet',
  none: '',
  before: '',
  future: '',
}

const STATUS_STYLE: Record<DayStatus, string> = {
  saved: 'bg-accent font-semibold text-ink hover:bg-[#f3c566]',
  missed: 'border border-alert/60 text-alert hover:bg-alert/10',
  pending: 'text-text hover:bg-raised',
  none: 'text-muted/70',
  before: 'text-muted/30',
  future: 'text-muted/40',
}

export function MiniCalendar({ item, todayKey, onSelectDay }: MiniCalendarProps) {
  const [cursor, setCursor] = useState(() => {
    const [year, month] = todayKey.split('-').map(Number)
    return { year, month: month - 1 }
  })
  const byDay = useMemo(() => checkpointsByDay(item), [item])

  const firstWeekday = new Date(cursor.year, cursor.month, 1).getDay() // 0 = Sunday
  const daysInMonth = new Date(cursor.year, cursor.month + 1, 0).getDate()
  const cells: (string | null)[] = [
    ...Array<null>(firstWeekday).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => toDateKey(new Date(cursor.year, cursor.month, i + 1))),
  ]
  while (cells.length % 7 !== 0) cells.push(null)

  function shiftMonth(amount: number) {
    setCursor((prev) => {
      const d = new Date(prev.year, prev.month + amount, 1)
      return { year: d.getFullYear(), month: d.getMonth() }
    })
  }

  const monthName = new Date(cursor.year, cursor.month, 1).toLocaleDateString('en-IN', { month: 'long' })

  return (
    <section aria-label="Calendar" className="rounded-2xl border border-line bg-panel/60 p-5">
      <div className="mb-4 flex items-center justify-between">
        <button type="button" className="btn btn-small" onClick={() => shiftMonth(-1)} aria-label="Previous month">
          ‹
        </button>
        <p className="text-center leading-none">
          <span className="font-script text-3xl text-accent">{monthName}</span>{' '}
          <span className="font-display text-xl tracking-wide">{cursor.year}</span>
        </p>
        <button type="button" className="btn btn-small" onClick={() => shiftMonth(1)} aria-label="Next month">
          ›
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center">
        {WEEKDAYS.map((label, i) => (
          <span key={i} aria-hidden="true" className="pb-1 text-xs text-muted">
            {label}
          </span>
        ))}

        {cells.map((dateKey, i) => {
          if (!dateKey) return <span key={`blank-${i}`} />
          const status = dayStatus(item, dateKey, todayKey, byDay)
          const clickable = status === 'saved' || status === 'missed' || status === 'pending'
          const isToday = dateKey === todayKey
          const isDeadline = item.deadline === dateKey
          const label = [
            formatDateLong(dateKey),
            STATUS_TEXT[status],
            isToday ? 'today' : '',
            isDeadline ? 'deadline' : '',
          ]
            .filter(Boolean)
            .join(', ')

          return (
            <button
              key={dateKey}
              type="button"
              disabled={!clickable}
              onClick={() => onSelectDay(dateKey)}
              aria-label={label}
              className={`relative aspect-square rounded-md text-sm transition-colors disabled:cursor-default ${STATUS_STYLE[status]} ${
                isToday ? 'outline-2 -outline-offset-2 outline-accent' : ''
              }`}
            >
              {Number(dateKey.slice(8))}
              {isDeadline && (
                <span
                  aria-hidden="true"
                  className="absolute right-1 top-1 h-1.5 w-1.5 rotate-45 bg-text"
                />
              )}
            </button>
          )
        })}
      </div>

      <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted">
        <li className="flex items-center gap-1.5">
          <span aria-hidden="true" className="h-2.5 w-2.5 rounded-sm bg-accent" /> Saved
        </li>
        <li className="flex items-center gap-1.5">
          <span aria-hidden="true" className="h-2.5 w-2.5 rounded-sm border border-alert" /> NULL
        </li>
        <li className="flex items-center gap-1.5">
          <span aria-hidden="true" className="h-2.5 w-2.5 rounded-sm outline-2 -outline-offset-2 outline-accent" /> Today
        </li>
        <li className="flex items-center gap-1.5">
          <span aria-hidden="true" className="h-1.5 w-1.5 rotate-45 bg-text" /> Deadline
        </li>
      </ul>
    </section>
  )
}
