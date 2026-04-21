import { useCallback, useEffect, useMemo, useState } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'
import { ADMIN_LEADS_STORAGE_KEY, getAllLeads } from '../../utils/adminDataStore'
import { getSourceLabels } from '../../utils/adminSettingsStore'

const SOURCE_KEY_IDS = [
  'instant-quote',
  'finance-calculator',
  'homepage-calculator',
  'consultation-modal',
  'partner-form',
]

const BADGE_STYLES = {
  quote: { label: 'Quote Request', className: 'bg-[#B8965A]/15 text-[#8B6914] border-[#B8965A]/35' },
  consultation: { label: 'Consultation', className: 'bg-blue-50 text-blue-800 border-blue-200/80' },
  partner: { label: 'Partner Application', className: 'bg-green-50 text-green-800 border-green-200/80' },
  calculator: { label: 'Calculator Lead', className: 'bg-purple-50 text-purple-800 border-purple-200/80' },
}

function displayName(row) {
  const n = row.fullName ?? row.name
  return n && String(n).trim() ? String(n).trim() : '—'
}

function displayPhone(row) {
  const p = row.phone
  return p && String(p).trim() ? String(p).trim() : '—'
}

function startOfLocalDay(d) {
  const x = new Date(d)
  x.setHours(0, 0, 0, 0)
  return x
}

function isSameLocalDay(a, b) {
  return startOfLocalDay(a).getTime() === startOfLocalDay(b).getTime()
}

function formatFeedTimestamp(iso) {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return '—'
  const now = new Date()
  const diffMs = now.getTime() - d.getTime()
  const mins = Math.floor(diffMs / 60000)
  if (mins < 1) return 'Just now'
  if (mins < 60) return `${mins} minute${mins === 1 ? '' : 's'} ago`
  const hours = Math.floor(mins / 60)
  if (isSameLocalDay(d, now)) {
    return `Today, ${d.toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit', hour12: true })}`
  }
  const yest = new Date(now)
  yest.setDate(yest.getDate() - 1)
  if (isSameLocalDay(d, yest)) {
    return `Yesterday, ${d.toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit', hour12: true })}`
  }
  if (hours < 24) return `${hours} hour${hours === 1 ? '' : 's'} ago`
  return d.toLocaleString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  })
}

function formatFieldLabel(key) {
  return String(key)
    .replace(/([A-Z])/g, ' $1')
    .replace(/_/g, ' ')
    .replace(/^\s+/, '')
    .replace(/\b\w/g, (c) => c.toUpperCase())
}

function weekAgo() {
  const t = new Date()
  t.setDate(t.getDate() - 7)
  return t
}

function countInRange(rows, filterFn) {
  const w = weekAgo()
  return rows.filter((r) => {
    const ts = new Date(r.timestamp)
    return !Number.isNaN(ts.getTime()) && ts >= w && filterFn(r)
  }).length
}

function todayLocalDateString() {
  const t = new Date()
  const y = t.getFullYear()
  const m = String(t.getMonth() + 1).padStart(2, '0')
  const day = String(t.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

function DetailDrawer({ record, onClose }) {
  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [])

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  if (!record) return null

  const entries = Object.entries(record)

  return createPortal(
    <div className="fixed inset-0 z-[200] flex justify-end" role="presentation">
      <button
        type="button"
        className="absolute inset-0 bg-black/40 transition-opacity"
        aria-label="Close details"
        onClick={onClose}
      />
      <aside
        role="dialog"
        aria-modal="true"
        aria-labelledby="admin-drawer-title"
        className="relative z-[1] flex h-full w-full max-w-md flex-col bg-white shadow-2xl"
      >
        <div className="flex items-center justify-between border-b border-brand-brass-pale/50 px-6 py-4">
          <h2 id="admin-drawer-title" className="font-display text-lg font-light text-brand-charcoal">
            Submission details
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-sm p-1.5 text-brand-mist transition-colors hover:bg-brand-ivory-deep hover:text-brand-charcoal"
            aria-label="Close"
          >
            <X className="h-5 w-5" strokeWidth={1.75} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-6">
          <dl className="space-y-4">
            {entries.map(([key, value]) => (
              <div key={key}>
                <dt className="font-body text-[10px] font-semibold uppercase tracking-[0.12em] text-brand-brass">
                  {formatFieldLabel(key)}
                </dt>
                <dd className="mt-1 font-body text-[14px] text-brand-charcoal break-words">
                  {value === null || value === undefined
                    ? '—'
                    : typeof value === 'object'
                      ? JSON.stringify(value, null, 2)
                      : String(value)}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </aside>
    </div>,
    document.body,
  )
}

export default function AdminDashboard() {
  const [leads, setLeads] = useState(() => getAllLeads())
  const [drawerRecord, setDrawerRecord] = useState(null)
  const [labelTick, setLabelTick] = useState(0)

  useEffect(() => {
    const onLabels = () => setLabelTick((t) => t + 1)
    window.addEventListener('maywood-admin-settings-changed', onLabels)
    return () => window.removeEventListener('maywood-admin-settings-changed', onLabels)
  }, [])

  const sourceLabels = useMemo(() => getSourceLabels(), [labelTick])

  const refresh = useCallback(() => {
    setLeads(getAllLeads())
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === ADMIN_LEADS_STORAGE_KEY || e.key === null) refresh()
    }
    window.addEventListener('storage', onStorage)
    const onVis = () => {
      if (document.visibilityState === 'visible') refresh()
    }
    document.addEventListener('visibilitychange', onVis)
    return () => {
      window.removeEventListener('storage', onStorage)
      document.removeEventListener('visibilitychange', onVis)
    }
  }, [refresh])

  const stats = useMemo(() => {
    const total = leads.length
    const quotes = leads.filter((r) => r.type === 'quote').length
    const consultations = leads.filter((r) => r.type === 'consultation').length
    const partners = leads.filter((r) => r.type === 'partner').length
    return {
      total,
      quotes,
      consultations,
      partners,
      trendTotal: countInRange(leads, () => true),
      trendQuotes: countInRange(leads, (r) => r.type === 'quote'),
      trendConsultations: countInRange(leads, (r) => r.type === 'consultation'),
      trendPartners: countInRange(leads, (r) => r.type === 'partner'),
    }
  }, [leads])

  const sourceCounts = useMemo(() => {
    const map = Object.fromEntries(SOURCE_KEY_IDS.map((key) => [key, 0]))
    for (const r of leads) {
      const k = r.sourcePage
      if (k && map[k] !== undefined) map[k] += 1
    }
    return map
  }, [leads])

  const maxSource = useMemo(() => {
    let m = 0
    for (const key of SOURCE_KEY_IDS) m = Math.max(m, sourceCounts[key] || 0)
    return m || 1
  }, [sourceCounts])

  const todayStr = todayLocalDateString()

  const todayGlance = useMemo(() => {
    const todayStart = startOfLocalDay(new Date())
    const leadsToday = leads.filter((r) => {
      const ts = new Date(r.timestamp)
      return !Number.isNaN(ts.getTime()) && ts >= todayStart
    })
    const consultationsScheduledToday = leads.filter(
      (r) => r.type === 'consultation' && r.preferredDate === todayStr,
    ).length

    const bySource = {}
    for (const r of leadsToday) {
      const sp = r.sourcePage || 'unknown'
      bySource[sp] = (bySource[sp] || 0) + 1
    }
    const labelMap = Object.fromEntries(SOURCE_KEY_IDS.map((key) => [key, sourceLabels[key] || key]))
    const counts = Object.values(bySource)
    const maxCount = counts.length ? Math.max(...counts) : 0
    const winners = Object.entries(bySource).filter(([, v]) => v === maxCount && maxCount > 0)
    let mostActiveLabel = '—'
    if (leadsToday.length === 0) mostActiveLabel = '—'
    else if (winners.length > 1) mostActiveLabel = 'Tie'
    else if (winners.length === 1) mostActiveLabel = labelMap[winners[0][0]] || winners[0][0]

    return {
      leadsCapturedToday: leadsToday.length,
      consultationsScheduledToday,
      mostActiveLabel,
    }
  }, [leads, todayStr, sourceLabels])

  const recentTen = useMemo(() => leads.slice(0, 10), [leads])

  if (leads.length === 0) {
    return (
      <div className="rounded-lg border border-brand-brass-pale/50 bg-white p-12 text-center shadow-sm">
        <p className="font-body text-[15px] leading-relaxed text-brand-mist">
          No leads yet. They&apos;ll appear here as customers interact with the site.
        </p>
      </div>
    )
  }

  const statCards = [
    { value: stats.total, label: 'Total Leads', trend: stats.trendTotal },
    { value: stats.quotes, label: 'Quote Requests', trend: stats.trendQuotes },
    { value: stats.consultations, label: 'Consultations Booked', trend: stats.trendConsultations },
    { value: stats.partners, label: 'Partner Applications', trend: stats.trendPartners },
  ]

  return (
    <div className="space-y-10">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statCards.map((card) => (
          <div
            key={card.label}
            className="rounded-lg border border-brand-brass-pale/30 bg-white p-6 shadow-[0_4px_24px_rgba(28,25,21,0.06)]"
          >
            <p className="font-display text-[clamp(32px,5vw,44px)] font-light leading-none text-brand-brass">
              {card.value}
            </p>
            <p className="mt-3 font-body text-[13px] font-medium text-brand-charcoal">{card.label}</p>
            <p className="mt-2 font-body text-[12px] font-medium text-green-600">
              ↑ {card.trend} this week
            </p>
          </div>
        ))}
      </div>

      <section className="rounded-lg border border-brand-brass-pale/30 bg-white p-6 shadow-[0_4px_24px_rgba(28,25,21,0.06)]">
        <h2 className="font-display text-lg font-light text-brand-charcoal">Recent activity</h2>
        <p className="mt-1 font-body text-[12px] text-brand-mist">Last 10 submissions, newest first.</p>
        <ul className="mt-6 divide-y divide-brand-brass-pale/25">
          {recentTen.map((row) => {
            const badge = BADGE_STYLES[row.type] || BADGE_STYLES.calculator
            return (
              <li key={row.id} className="flex flex-col gap-3 py-4 first:pt-0 last:pb-0 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0 flex-1">
                  <span
                    className={[
                      'inline-block rounded border px-2 py-0.5 font-body text-[10px] font-semibold uppercase tracking-[0.08em]',
                      badge.className,
                    ].join(' ')}
                  >
                    {badge.label}
                  </span>
                  <p className="mt-2 font-body text-[15px] text-brand-charcoal">{displayName(row)}</p>
                  <p className="mt-0.5 font-body text-[13px] text-brand-mist">{displayPhone(row)}</p>
                  <p className="mt-1 font-body text-[12px] text-brand-mist/90">{formatFeedTimestamp(row.timestamp)}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setDrawerRecord(row)}
                  className="shrink-0 self-start font-body text-[12px] font-medium text-brand-brass underline-offset-2 hover:underline"
                >
                  View Details
                </button>
              </li>
            )
          })}
        </ul>
      </section>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <section className="rounded-lg border border-brand-brass-pale/30 bg-white p-6 shadow-[0_4px_24px_rgba(28,25,21,0.06)]">
          <h2 className="font-display text-lg font-light text-brand-charcoal">Lead source breakdown</h2>
          <p className="mt-1 font-body text-[12px] text-brand-mist">By source page (all time).</p>
          <div className="mt-6 space-y-4">
            {SOURCE_KEY_IDS.map((key) => {
              const label = sourceLabels[key] || key
              const n = sourceCounts[key] || 0
              const pct = Math.round((n / maxSource) * 100)
              return (
                <div key={key}>
                  <div className="mb-1 flex justify-between font-body text-[13px]">
                    <span className="text-brand-charcoal">{label}</span>
                    <span className="tabular-nums text-brand-mist">{n}</span>
                  </div>
                  <div className="h-2.5 w-full overflow-hidden rounded-full bg-brand-ivory-deep">
                    <div
                      className="h-full rounded-full bg-brand-brass transition-[width] duration-500 ease-out"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        <section className="rounded-lg border border-brand-brass-pale/30 bg-white p-6 shadow-[0_4px_24px_rgba(28,25,21,0.06)]">
          <h2 className="font-display text-lg font-light text-brand-charcoal">Today at a glance</h2>
          <ul className="mt-4 space-y-3 font-body text-[14px] text-brand-charcoal">
            <li className="flex justify-between gap-4 border-b border-brand-brass-pale/20 pb-3">
              <span className="text-brand-mist">Leads captured today</span>
              <span className="font-medium tabular-nums">{todayGlance.leadsCapturedToday}</span>
            </li>
            <li className="flex justify-between gap-4 border-b border-brand-brass-pale/20 pb-3">
              <span className="text-brand-mist">Consultations scheduled today</span>
              <span className="font-medium tabular-nums">{todayGlance.consultationsScheduledToday}</span>
            </li>
            <li className="flex justify-between gap-4 pt-1">
              <span className="text-brand-mist">Most active page today</span>
              <span className="max-w-[55%] text-right font-medium leading-snug">{todayGlance.mostActiveLabel}</span>
            </li>
          </ul>
        </section>
      </div>

      {drawerRecord ? <DetailDrawer record={drawerRecord} onClose={() => setDrawerRecord(null)} /> : null}
    </div>
  )
}
