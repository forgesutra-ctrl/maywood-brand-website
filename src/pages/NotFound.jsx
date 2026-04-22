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
      <div className="mx-auto mt-10 max-w-[640px] space-y-6 text-left font-body text-[15px] leading-relaxed text-brand-mist">
        <p>
          You may have followed an outdated link, mistyped the address, or reached a URL that is no longer published.
          Maywood Interiors is Bangalore&apos;s vertically integrated interior company — we design, manufacture, and install
          residential and commercial spaces with in-house plywood, factory production, and optional financing. If you were
          trying to reach a service such as modular kitchens, wardrobes, office fit-outs, or our experience centers, the
          homepage and main navigation list all current destinations.
        </p>
        <p>
          For a ballpark estimate of your project, use our instant quote flow; to see materials and mockups in person, book
          through the experience centers page. Questions about partnerships, manufacturing, or Maywood Finance are linked
          from the site footer. If you believe this is a broken link on our site, tell us via the contact form so we
          can fix it — and thank you for your patience while you get back on track.
        </p>
      </div>
      <Link to="/" className={['mt-10 inline-flex', buttonClasses('primary', 'px-8 py-3.5 text-[11px]')].join(' ')}>
        GO HOME
      </Link>
    </main>
  )
}
