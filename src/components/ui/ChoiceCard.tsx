import type { ReactNode } from 'react'

interface ChoiceCardProps {
  name: string
  value: string
  checked: boolean
  onChange: (value: string) => void
  children: ReactNode
}

// A radio button that looks like a small card. Fully keyboard accessible.
export function ChoiceCard({ name, value, checked, onChange, children }: ChoiceCardProps) {
  return (
    <label className="relative block cursor-pointer">
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={() => onChange(value)}
        className="peer sr-only"
      />
      <span className="block h-full rounded-lg border border-line bg-panel px-4 py-3 transition-colors hover:border-muted peer-checked:border-accent peer-checked:bg-raised peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-accent">
        {children}
      </span>
    </label>
  )
}
