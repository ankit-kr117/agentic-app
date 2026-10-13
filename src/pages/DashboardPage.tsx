import { useState, type CSSProperties } from 'react'
import { NewItemModal } from '../features/items/NewItemModal'
import { ItemCard } from '../features/items/ItemCard'
import { KINDS, KIND_ORDER } from '../config/kinds'
import { toDateKey } from '../lib/dates'
import { useNow } from '../lib/useNow'
import { useItems } from '../store/useItems'
import type { Kind } from '../types'

export function DashboardPage() {
  const { items } = useItems()
  const now = useNow(60_000)
  const todayKey = toDateKey(now)
  const [modalKind, setModalKind] = useState<Kind | null>(null)
  // Remember the last kind so the popup keeps its content while it closes.
  const [lastKind, setLastKind] = useState<Kind>('mission')

  function openModal(kind: Kind) {
    setLastKind(kind)
    setModalKind(kind)
  }

  const dateText = new Date(now).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })

  return (
    <div>
      <section className="rise mb-10 flex flex-col gap-6 sm:mb-14 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="font-script text-4xl leading-none text-accent sm:text-5xl">{dateText}</p>
          <h1 className="mt-2 font-display text-5xl uppercase leading-[0.95] tracking-wide sm:text-7xl">
            Every step,
            <br />a checkpoint
          </h1>
        </div>
        <button type="button" className="btn btn-primary self-start sm:self-auto" onClick={() => openModal('mission')}>
          + Start something new
        </button>
      </section>

      <div className="grid gap-6 lg:grid-cols-3">
        {KIND_ORDER.map((kind, column) => {
          const list = items.filter((item) => item.kind === kind)
          const info = KINDS[kind]
          return (
            <section
              key={kind}
              aria-labelledby={`section-${kind}`}
              style={{ '--i': column + 1 } as CSSProperties}
              className="rise rounded-2xl border border-line bg-panel/60 p-5"
            >
              <div className="mb-5 flex items-start justify-between gap-3">
                <div>
                  <p className="font-script text-3xl leading-none text-accent">{info.script}</p>
                  <h2 id={`section-${kind}`} className="font-display text-3xl uppercase tracking-wide">
                    {info.plural} <span className="text-muted">{list.length}</span>
                  </h2>
                </div>
                <button
                  type="button"
                  className="btn btn-small"
                  onClick={() => openModal(kind)}
                  aria-label={`New ${info.singular.toLowerCase()}`}
                >
                  + New
                </button>
              </div>

              {list.length === 0 ? (
                <div className="rounded-xl border border-dashed border-line px-4 py-8 text-center">
                  <p className="text-sm text-muted">{info.blurb}.</p>
                  <p className="mt-1 text-sm text-muted">No {info.plural.toLowerCase()} yet.</p>
                  <button type="button" className="btn btn-small mt-4" onClick={() => openModal(kind)}>
                    Start your first {info.singular.toLowerCase()}
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {list.map((item, index) => (
                    <ItemCard key={item.id} item={item} todayKey={todayKey} index={index} />
                  ))}
                </div>
              )}
            </section>
          )
        })}
      </div>

      <NewItemModal open={modalKind !== null} initialKind={modalKind ?? lastKind} onClose={() => setModalKind(null)} />
    </div>
  )
}
