import { useState, type FormEvent } from 'react'
import { Modal } from '../../components/ui/Modal'
import { QUESTIONS } from '../../config/questions'
import { formatDuration } from '../../lib/dates'
import { useItems } from '../../store/useItems'

interface CheckpointModalProps {
  open: boolean
  onClose: () => void
  itemId: string
  /** The finished session length, in milliseconds. */
  durationMs: number
}

export function CheckpointModal({ open, onClose, itemId, durationMs }: CheckpointModalProps) {
  return (
    <Modal open={open} onClose={onClose} eyebrow="Session complete" title="Save checkpoint">
      <CheckpointForm itemId={itemId} durationMs={durationMs} onClose={onClose} />
    </Modal>
  )
}

// Only mounted while the popup is open, so the answers start empty every time.
function CheckpointForm({ itemId, durationMs, onClose }: Omit<CheckpointModalProps, 'open'>) {
  const { saveCheckpoint } = useItems()
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [error, setError] = useState('')

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    const cleaned: Record<string, string> = {}
    for (const question of QUESTIONS) {
      const text = (answers[question.id] ?? '').trim()
      if (text) cleaned[question.id] = text
    }
    if (Object.keys(cleaned).length === 0) {
      setError('Answer at least one question so this checkpoint is worth remembering.')
      return
    }
    saveCheckpoint(itemId, cleaned)
    onClose()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      <p className="text-sm text-muted">
        Time on the clock: <span className="font-semibold text-text">{formatDuration(durationMs)}</span>
      </p>

      {QUESTIONS.map((question, index) => {
        const fieldId = `question-${question.id}`
        return (
          <div key={question.id}>
            <label htmlFor={fieldId} className="mb-2 block text-sm font-medium">
              <span className="mr-2 font-display text-accent">{index + 1}</span>
              {question.prompt}
            </label>
            <textarea
              id={fieldId}
              data-autofocus={index === 0 ? true : undefined}
              className="field"
              rows={2}
              placeholder={question.placeholder}
              value={answers[question.id] ?? ''}
              onChange={(e) => setAnswers((prev) => ({ ...prev, [question.id]: e.target.value }))}
            />
          </div>
        )
      })}

      <p role="alert" className="min-h-5 text-sm text-alert">
        {error}
      </p>

      <div className="flex justify-end gap-3">
        <button type="button" className="btn" onClick={onClose}>
          Not yet
        </button>
        <button type="submit" className="btn btn-primary">
          Save checkpoint
        </button>
      </div>
    </form>
  )
}
