import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChoiceCard } from '../../components/ui/ChoiceCard'
import { Modal } from '../../components/ui/Modal'
import { KINDS, KIND_ORDER } from '../../config/kinds'
import { isValidDateKey, toDateKey } from '../../lib/dates'
import { useItems } from '../../store/useItems'
import type { Kind } from '../../types'

interface NewItemModalProps {
  open: boolean
  onClose: () => void
  /** Which kind is pre-selected when the popup opens. */
  initialKind: Kind
}

export function NewItemModal({ open, onClose, initialKind }: NewItemModalProps) {
  return (
    <Modal open={open} onClose={onClose} eyebrow="Begin" title="Start something new">
      <NewItemForm initialKind={initialKind} onClose={onClose} />
    </Modal>
  )
}

// Only mounted while the popup is open, so the form starts fresh every time.
function NewItemForm({ initialKind, onClose }: { initialKind: Kind; onClose: () => void }) {
  const { addItem } = useItems()
  const navigate = useNavigate()

  const [kind, setKind] = useState<Kind>(initialKind)
  const [name, setName] = useState('')
  const [hasDeadline, setHasDeadline] = useState(false)
  const [deadline, setDeadline] = useState('')
  const [daily, setDaily] = useState(true)
  const [error, setError] = useState('')

  const todayKey = toDateKey(Date.now())

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    if (!name.trim()) {
      setError('Give it a name first.')
      return
    }
    if (hasDeadline && (!isValidDateKey(deadline) || deadline < todayKey)) {
      setError('Pick a deadline that is today or later, or choose "No fixed deadline".')
      return
    }
    const item = addItem({ kind, name, deadline: hasDeadline ? deadline : null, daily })
    onClose()
    navigate(`/item/${item.id}`)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6" noValidate>
      <fieldset>
        <legend className="mb-2 text-sm text-muted">What is it?</legend>
        <div className="grid gap-2 sm:grid-cols-3">
          {KIND_ORDER.map((id) => (
            <ChoiceCard key={id} name="kind" value={id} checked={kind === id} onChange={(v) => setKind(v as Kind)}>
              <span className="block font-script text-xl leading-none text-accent">{KINDS[id].script}</span>
              <span className="block font-display text-lg uppercase tracking-wide">{KINDS[id].singular}</span>
            </ChoiceCard>
          ))}
        </div>
      </fieldset>

      <div>
        <label htmlFor="item-name" className="mb-2 block text-sm text-muted">
          Name
        </label>
        <input
          id="item-name"
          data-autofocus
          className="field"
          type="text"
          maxLength={80}
          placeholder="e.g. Python"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <fieldset>
        <legend className="mb-2 text-sm text-muted">Deadline</legend>
        <div className="grid gap-2 sm:grid-cols-2">
          <ChoiceCard name="deadline" value="none" checked={!hasDeadline} onChange={() => setHasDeadline(false)}>
            <span className="text-sm font-medium">No fixed deadline</span>
          </ChoiceCard>
          <ChoiceCard name="deadline" value="set" checked={hasDeadline} onChange={() => setHasDeadline(true)}>
            <span className="text-sm font-medium">Set a deadline</span>
          </ChoiceCard>
        </div>
        {hasDeadline && (
          <div className="mt-3">
            <label htmlFor="item-deadline" className="sr-only">
              Deadline date
            </label>
            <input
              id="item-deadline"
              className="field"
              type="date"
              min={todayKey}
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
            />
          </div>
        )}
      </fieldset>

      <fieldset>
        <legend className="mb-2 text-sm text-muted">How often will you work on it?</legend>
        <div className="grid gap-2 sm:grid-cols-2">
          <ChoiceCard name="cadence" value="daily" checked={daily} onChange={() => setDaily(true)}>
            <span className="block text-sm font-medium">Work on it daily</span>
            <span className="block text-xs text-muted">Days without a checkpoint show as NULL</span>
          </ChoiceCard>
          <ChoiceCard name="cadence" value="flex" checked={!daily} onChange={() => setDaily(false)}>
            <span className="block text-sm font-medium">Whenever I can</span>
            <span className="block text-xs text-muted">Only days you save are shown</span>
          </ChoiceCard>
        </div>
      </fieldset>

      <p role="alert" className="min-h-5 text-sm text-alert">
        {error}
      </p>

      <div className="flex justify-end gap-3">
        <button type="button" className="btn" onClick={onClose}>
          Cancel
        </button>
        <button type="submit" className="btn btn-primary">
          Create
        </button>
      </div>
    </form>
  )
}
