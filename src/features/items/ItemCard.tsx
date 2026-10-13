import type { CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import { dayNumber, deadlineLabel, relativeDay } from '../../lib/dates'
import { countMissed, dayStatus, itemCreatedKey, lastCheckpointKey } from '../../lib/timeline'
import type { Item } from '../../types'

interface ItemCardProps {
  item: Item
  todayKey: string
  /** Position in its list, used to stagger the entrance animation. */
  index: number
}

export function ItemCard({ item, todayKey, index }: ItemCardProps) {
  const today = Math.max(1, dayNumber(itemCreatedKey(item), todayKey))
  const lastKey = lastCheckpointKey(item)
  const savedToday = dayStatus(item, todayKey, todayKey) === 'saved'
  const missed = item.daily ? countMissed(item, todayKey) : 0
  const deadline = item.deadline ? deadlineLabel(item.deadline, todayKey) : null
  const running = item.timer?.status === 'running'

  return (
    <Link
      to={`/item/${item.id}`}
      style={{ '--i': index } as CSSProperties}
      className="rise group block rounded-xl border border-line bg-panel p-4 transition-colors hover:border-accent"
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="min-w-0 break-words font-display text-xl uppercase leading-tight tracking-wide group-hover:text-accent">
          {item.name}
        </h3>
        <span className="shrink-0 font-script text-2xl leading-none text-accent">Day {today}</span>
      </div>

      <p className="mt-2 text-sm text-muted">
        {lastKey ? `Last checkpoint ${relativeDay(lastKey, todayKey)}` : 'No checkpoints yet'}
      </p>

      <div className="mt-3 flex flex-wrap gap-2 text-xs">
        {running && (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-accent/50 px-2.5 py-1 text-accent">
            <span className="beacon h-1.5 w-1.5 rounded-full bg-accent" aria-hidden="true" />
            Session running
          </span>
        )}
        {item.daily && savedToday && (
          <span className="rounded-full border border-accent/50 px-2.5 py-1 text-accent">Saved today</span>
        )}
        {item.daily && !savedToday && (
          <span className="rounded-full border border-line px-2.5 py-1 text-muted">Daily · waiting today</span>
        )}
        {!item.daily && <span className="rounded-full border border-line px-2.5 py-1 text-muted">At your pace</span>}
        {missed > 0 && (
          <span className="rounded-full border border-alert/50 px-2.5 py-1 text-alert">
            {missed} NULL day{missed === 1 ? '' : 's'}
          </span>
        )}
        {deadline && (
          <span
            className={`rounded-full border px-2.5 py-1 ${
              deadline.overdue ? 'border-alert/50 text-alert' : deadline.soon ? 'border-accent/50 text-accent' : 'border-line text-muted'
            }`}
          >
            {deadline.text}
          </span>
        )}
      </div>
    </Link>
  )
}
