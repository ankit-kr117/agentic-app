import { Link } from 'react-router-dom'

export function NotFoundPage({ message = 'That page does not exist.' }: { message?: string }) {
  return (
    <div className="py-20 text-center">
      <p className="font-script text-5xl leading-none text-accent">Lost the trail</p>
      <h1 className="mt-2 font-display text-6xl uppercase tracking-wide">404</h1>
      <p className="mt-3 text-muted">{message}</p>
      <Link to="/" className="btn mt-8">
        Back to dashboard
      </Link>
    </div>
  )
}
