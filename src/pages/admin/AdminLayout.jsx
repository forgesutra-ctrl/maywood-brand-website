import { useEffect, useMemo, useState } from 'react'
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import BrandLogo from '../../components/ui/BrandLogo'
import { buttonClasses } from '../../lib/buttonStyles'
import { ADMIN_LEADS_STORAGE_KEY, exportToCSV, getAllLeads } from '../../utils/adminDataStore'
import {
  ensureAdminInstallDate,
  getNotifyPreference,
  getSoundPreference,
  playNotificationBeep,
} from '../../utils/adminSettingsStore'

const AUTH_KEY = 'maywood_admin_auth'

const NAV = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: '📊' },
  { to: '/admin/leads', label: 'All Leads', icon: '👥' },
  { to: '/admin/quotes', label: 'Quote Requests', icon: '💬' },
  { to: '/admin/consultations', label: 'Consultations', icon: '📅' },
  { to: '/admin/partners', label: 'Partner Applications', icon: '🤝' },
  { to: '/admin/analytics', label: 'Analytics', icon: '📈' },
  { to: '/admin/settings', label: 'Settings', icon: '⚙️' },
]

const PATH_TITLES = {
  '/admin/dashboard': 'Dashboard',
  '/admin/leads': 'All Leads',
  '/admin/quotes': 'Quote Requests',
  '/admin/consultations': 'Consultations',
  '/admin/partners': 'Partner Applications',
  '/admin/analytics': 'Analytics',
  '/admin/settings': 'Settings',
}

export default function AdminLayout() {
  const navigate = useNavigate()
  const location = useLocation()
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(t)
  }, [])

  useEffect(() => {
    ensureAdminInstallDate()
  }, [])

  useEffect(() => {
    const last = { n: getAllLeads().length }
    const tick = () => {
      const next = getAllLeads().length
      if (next > last.n) {
        if (getNotifyPreference() && typeof Notification !== 'undefined' && Notification.permission === 'granted') {
          try {
            new Notification('Maywood Interiors', { body: 'A new lead was captured.' })
          } catch {
            /* ignore */
          }
        }
        if (getSoundPreference()) playNotificationBeep()
      }
      last.n = next
    }
    const id = setInterval(tick, 3000)
    const onStorage = (e) => {
      if (e.key === ADMIN_LEADS_STORAGE_KEY || e.key === null) tick()
    }
    window.addEventListener('storage', onStorage)
    return () => {
      clearInterval(id)
      window.removeEventListener('storage', onStorage)
    }
  }, [])

  const pageTitle = PATH_TITLES[location.pathname] || 'Admin'

  const datetimeLabel = useMemo(
    () =>
      now.toLocaleString('en-IN', {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
      }),
    [now],
  )

  const handleLogout = () => {
    sessionStorage.removeItem(AUTH_KEY)
    navigate('/admin/login', { replace: true })
  }

  const handleExportCsv = () => {
    exportToCSV(getAllLeads(), `maywood-leads-${Date.now()}.csv`)
  }

  const showExport = ['/admin/dashboard', '/admin/leads', '/admin/quotes', '/admin/consultations', '/admin/partners'].includes(
    location.pathname,
  )

  const pageOwnsHeader = [
    '/admin/leads',
    '/admin/quotes',
    '/admin/consultations',
    '/admin/partners',
    '/admin/analytics',
    '/admin/settings',
  ].includes(location.pathname)

  return (
    <div className="flex min-h-screen bg-brand-ivory">
      <aside className="flex w-[260px] shrink-0 flex-col border-r border-white/10 bg-[#1a1612] px-4 py-6 lg:w-[280px]">
        <NavLink to="/admin/dashboard" className="mb-10 block shrink-0 px-2">
          <BrandLogo to={null} variant="footer" className="block" />
        </NavLink>
        <nav className="flex flex-1 flex-col gap-1">
          {NAV.map(({ to, label, icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/admin/dashboard'}
              className={({ isActive }) =>
                [
                  'rounded-sm px-3 py-2.5 font-body text-[13px] leading-snug transition-colors',
                  isActive
                    ? 'bg-brand-brass/15 font-medium text-brand-brass'
                    : 'text-brand-mist-light hover:bg-white/5 hover:text-brand-ivory',
                ].join(' ')
              }
            >
              <span className="mr-2 inline-block w-5 text-center" aria-hidden>
                {icon}
              </span>
              {label}
            </NavLink>
          ))}
        </nav>
        <button
          type="button"
          onClick={handleLogout}
          className={[
            'mt-6 w-full rounded-sm border border-brand-brass/40 px-3 py-2.5 font-body text-[12px] font-medium uppercase tracking-[0.1em] text-brand-brass transition-colors hover:bg-white/5',
          ].join(' ')}
        >
          Log out
        </button>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex flex-wrap items-center justify-between gap-4 border-b border-brand-brass-pale/40 bg-brand-ivory px-6 py-4 lg:px-8">
          {pageOwnsHeader ? (
            <div className="min-h-[1.5rem] min-w-0 flex-1" aria-hidden />
          ) : (
            <h1 className="font-display text-[24px] font-light text-brand-charcoal">{pageTitle}</h1>
          )}
          <div className="flex flex-wrap items-center gap-4">
            <time className="font-body text-[12px] tabular-nums text-brand-mist" dateTime={now.toISOString()}>
              {datetimeLabel}
            </time>
            {showExport && !pageOwnsHeader ? (
              <button type="button" onClick={handleExportCsv} className={buttonClasses('primary', 'py-2.5 text-[11px]')}>
                Export CSV
              </button>
            ) : null}
          </div>
        </header>
        <main className="flex-1 bg-[#f7f3ed] p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
