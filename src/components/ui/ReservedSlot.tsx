// An empty, clearly marked space for a section you add later.
export function ReservedSlot({ title }: { title: string }) {
  return (
    <section
      aria-label={`${title} (reserved)`}
      className="rounded-xl border border-dashed border-line px-5 py-6 text-center"
    >
      <p className="font-script text-2xl leading-none text-muted">Reserved</p>
      <p className="mt-1 font-display text-lg uppercase tracking-wide text-muted">{title}</p>
      <p className="mt-1 text-sm text-muted/80">Space for what you add next.</p>
    </section>
  )
}
