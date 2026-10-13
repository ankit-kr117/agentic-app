import { useEffect, useId, useRef, type ReactNode } from 'react'

interface ModalProps {
  open: boolean
  onClose: () => void
  title: string
  /** Small calligraphy line above the title. */
  eyebrow?: string
  children: ReactNode
}

// Uses the browser's built-in <dialog>: it traps keyboard focus and closes on Esc for us.
export function Modal({ open, onClose, title, eyebrow, children }: ModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const titleId = useId()

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (open && !dialog.open) {
      dialog.showModal()
      dialog.querySelector<HTMLElement>('[data-autofocus]')?.focus()
    } else if (!open && dialog.open) {
      dialog.close()
    }
  }, [open])

  return (
    <dialog
      ref={dialogRef}
      className="modal"
      aria-labelledby={titleId}
      onClose={onClose}
      onClick={(event) => {
        // A click on the dark backdrop lands on the <dialog> itself.
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <div className="p-6 sm:p-8">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            {eyebrow && <p className="font-script text-3xl leading-none text-accent">{eyebrow}</p>}
            <h2 id={titleId} className="font-display text-3xl uppercase tracking-wide">
              {title}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="-mr-2 -mt-2 rounded-md p-2 text-2xl leading-none text-muted transition-colors hover:text-text"
          >
            ×
          </button>
        </div>
        {open && children}
      </div>
    </dialog>
  )
}
