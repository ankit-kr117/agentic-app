import { useState, type CSSProperties } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ReservedSlot } from '../components/ui/ReservedSlot'
import { KINDS } from '../config/kinds'
import { SessionTimer } from '../features/sessions/SessionTimer'
import { MiniCalendar } from '../features/timeline/MiniCalendar'
import { Timeline, type TimelineFocus } from '../features/timeline/Timeline'
import { dayNumber, deadlineLabel, formatDuration, toDateKey } from '../lib/dates'
import { itemCreatedKey } from '../lib/timeline'
import { useNow } from '../lib/useNow'
import { useItems } from '../store/useItems'
import { NotFoundPage } from './NotFoundPage'

export function ItemPage() {
  const { id } = useParams()
  const { getItem } = useItems()
  const item = id ? getItem(id) : undefined

  const timerRunning = item?.timer?.status === 'running'
  const now = useNow(timerRunning ? 1000 : 30_000)
  const [focus, setFocus] = useState<TimelineFocus | null>(null)

  if (!item) return <NotFoundPage message="We could not find that one. It may live in a different browser." />

  const todayKey = toDateKey(now)
  const kind = KINDS[item.kind]
  const totalMs = item.checkpoints.reduce((sum, cp) => sum + cp.durationMs, 0)
  const deadline = item.deadline ? deadlineLabel(item.deadline, todayKey) : null

  return (
    <div>
      <Link to="/" className="rise inline-block text-sm text-muted transition-colors hover:text-accent">
        ← Dashboard
      </Link>

      <header className="rise mb-8 mt-4" style={{ '--i': 1 } as CSSProperties}>
        <p className="font-script text-4xl leading-none text-accent">
          {kind.script} · {kind.singular}
        </p>
        <h1 className="mt-1 break-words font-display text-5xl uppercase leading-[0.95] tracking-wide sm:text-7xl">
          {item.name}
        </h1>

        <dl className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Stat label="Today is" value={`Day ${Math.max(1, dayNumber(itemCreatedKey(item), todayKey))}`} />
          <Stat label="Time logged" value={formatDuration(totalMs)} />
          <Stat label="Checkpoints" value={String(item.checkpoints.length)} />
          <Stat
            label={item.daily ? 'Daily · deadline' : 'Own pace · deadline'}
            value={deadline ? deadline.text : 'None'}
            tone={deadline?.overdue ? 'alert' : deadline?.soon ? 'accent' : 'default'}
          />
        </dl>
      </header>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_21rem]">
        <div className="rise lg:col-start-1 lg:row-start-1" style={{ '--i': 2 } as CSSProperties}>
          <SessionTimer item={item} now={now} />
        </div>

        <div className="rise lg:col-start-2 lg:row-span-2 lg:row-start-1" style={{ '--i': 3 } as CSSProperties}>
          <div className="lg:sticky lg:top-20">
            <MiniCalendar
              item={item}
              todayKey={todayKey}
              onSelectDay={(dateKey) => setFocus({ dateKey, nonce: Date.now() })}
            />
          </div>
        </div>

        <div className="rise lg:col-start-1 lg:row-start-2" style={{ '--i': 4 } as CSSProperties}>
          <Timeline item={item} todayKey={todayKey} focus={focus} />
        </div>
      </div>

      {/* Room to grow: replace these placeholders with the sections you add next. */}
      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        <ReservedSlot title="Section one" />
        <ReservedSlot title="Section two" />
      </div>
    </div>
  )
}

function Stat({ label, value, tone = 'default' }: { label: string; value: string; tone?: 'default' | 'accent' | 'alert' }) {
  const color = tone === 'alert' ? 'text-alert' : tone === 'accent' ? 'text-accent' : 'text-text'
  return (
    <div className="rounded-xl border border-line bg-panel/60 px-4 py-3">
      <dt className="text-xs text-muted">{label}</dt>
      <dd className={`font-display text-2xl uppercase tracking-wide ${color}`}>{value}</dd>
    </div>
  )
}
