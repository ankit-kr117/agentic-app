import { Link, Outlet } from 'react-router-dom'
import { useItems } from '../../store/useItems'

export function AppShell() {
  const { saveFailed } = useItems()

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-20 border-b border-line/70 bg-ink/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3">
          <Link to="/" className="flex items-baseline gap-1 rounded-md" aria-label="CheckPoint home">
            <span className="font-script text-4xl leading-none text-accent">Check</span>
            <span className="font-display text-2xl uppercase tracking-[0.12em]">Point</span>
          </Link>
        </div>
      </header>

      {saveFailed && (
        <div role="alert" className="border-b border-alert/40 bg-alert/10 px-5 py-2 text-center text-sm text-alert">
          Your browser would not save the latest change. Check that storage is allowed for this site.
        </div>
      )}

      <main className="mx-auto w-full max-w-6xl flex-1 px-5 py-8 sm:py-12">
        <Outlet />
      </main>

      <footer className="border-t border-line/70 px-5 py-4 text-center text-xs text-muted">
        Prototype: your data is saved in this browser only, not synced across devices.
      </footer>
    </div>
  )
}
