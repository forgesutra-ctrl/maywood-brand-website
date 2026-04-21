import { Link } from 'react-router-dom'
import { buttonClasses } from '../lib/buttonStyles'

export default function NotFound() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center bg-brand-ivory px-6 py-24 text-center">
      <p className="font-body text-[11px] font-semibold uppercase tracking-[0.2em] text-brand-brass">Error</p>
      <h1 className="mt-4 font-display text-[clamp(36px,6vw,52px)] font-light leading-tight text-brand-charcoal">
        404 — Page Not Found
      </h1>
      <p className="mt-4 max-w-md font-body text-[15px] leading-relaxed text-brand-mist">
        The page you&apos;re looking for doesn&apos;t exist or may have moved.
      </p>
      <Link to="/" className={['mt-10 inline-flex', buttonClasses('primary', 'px-8 py-3.5 text-[11px]')].join(' ')}>
        GO HOME
      </Link>
    </main>
  )
}
