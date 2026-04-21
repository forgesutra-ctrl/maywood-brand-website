import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { buttonClasses } from '../../lib/buttonStyles'
import { getAllLeads, getContactedLeadIds } from '../../utils/adminDataStore'
import { startOfWeekMonday } from '../../utils/adminPageUtils'
import { getSourceLabels } from '../../utils/adminSettingsStore'

function ymdLocal(d) {
  const x = new Date(d)
  if (Number.isNaN(x.getTime())) return ''
  const y = x.getFullYear()
  const m = String(x.getMonth() + 1).padStart(2, '0')
  const day = String(x.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

const RANGE_OPTIONS = [
  { id: '7d', label: 'Last 7 Days' },
  { id: '30d', label: 'Last 30 Days' },
  { id: '90d', label: 'Last 90 Days' },
  { id: 'all', label: 'All Time' },
]

const SOURCE_KEY_IDS = [
  'instant-quote',
  'finance-calculator',
  'homepage-calculator',
  'consultation-modal',
  'partner-form',
]

function startOfLocalDay(d) {
  const x = new Date(d)
  x.setHours(0, 0, 0, 0)
  return x
}

function endOfLocalDay(d) {
  const x = new Date(d)
  x.setHours(23, 59, 59, 999)
  return x
}

function subtractDays(d, n) {
  const x = new Date(d)
  x.setDate(x.getDate() - n)
  return x
}

/** Inclusive calendar-day range for "last N days" including today */
function getAnalyticsRange(rangeId) {
  const now = new Date()
  const end = endOfLocalDay(now)
  if (rangeId === 'all') return { start: null, end }
  const days = rangeId === '7d' ? 7 : rangeId === '30d' ? 30 : 90
  const start = startOfLocalDay(subtractDays(now, days - 1))
  return { start, end }
}

function inTimestampRange(row, start, end) {
  const ts = new Date(row.timestamp)
  if (Number.isNaN(ts.getTime())) return false
  if (!start) return ts <= end
  return ts >= start && ts <= end
}

function enumerateDays(start, end) {
  const out = []
  const d = new Date(start)
  d.setHours(0, 0, 0, 0)
  const last = new Date(end)
  last.setHours(0, 0, 0, 0)
  while (d <= last) {
    out.push(new Date(d))
    d.setDate(d.getDate() + 1)
  }
  return out
}

function leadsPerDay(leadsInRange, start, end) {
  if (!start) {
    if (leadsInRange.length === 0) return { days: [], counts: [], max: 1 }
    let minT = Infinity
    let maxT = -Infinity
    for (const r of leadsInRange) {
      const t = new Date(r.timestamp).getTime()
      if (!Number.isNaN(t)) {
        minT = Math.min(minT, t)
        maxT = Math.max(maxT, t)
      }
    }
    if (minT === Infinity) return { days: [], counts: [], max: 1 }
    const s = startOfLocalDay(new Date(minT))
    const e = endOfLocalDay(new Date(maxT))
    return buildDailySeries(leadsInRange, s, e)
  }
  return buildDailySeries(leadsInRange, start, end)
}

function buildDailySeries(leadsInRange, start, end) {
  const days = enumerateDays(start, end)
  const keys = days.map((d) => ymdLocal(d))
  const map = Object.fromEntries(keys.map((k) => [k, 0]))
  for (const r of leadsInRange) {
    const k = ymdLocal(new Date(r.timestamp))
    if (k && map[k] !== undefined) map[k] += 1
  }
  const counts = keys.map((k) => map[k])
  const max = Math.max(1, ...counts)
  return { days, counts, max }
}

function LineChart({ days, counts, max, insufficient }) {
  const w = 640
  const h = 220
  const pad = { l: 44, r: 16, t: 16, b: 36 }
  const iw = w - pad.l - pad.r
  const ih = h - pad.t - pad.b
  const n = Math.max(1, counts.length)
  const points = counts.map((c, i) => {
    const x = pad.l + (n === 1 ? iw / 2 : (i / (n - 1)) * iw)
    const y = pad.t + ih - (c / max) * ih
    return `${x},${y}`
  })
  const polyline = points.join(' ')
  const fillPoints =
    counts.length === 0 ? '' : `${pad.l},${pad.t + ih} ${polyline} ${pad.l + iw},${pad.t + ih}`

  if (insufficient) {
    return (
      <div className="flex h-[220px] items-center justify-center rounded-sm border border-dashed border-brand-brass-pale/60 bg-brand-ivory-deep/40">
        <p className="px-4 text-center font-body text-[13px] text-brand-mist">Add more leads to see trends.</p>
      </div>
    )
  }

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="h-auto w-full max-w-full" role="img" aria-label="Lead volume over time">
      <defs>
        <linearGradient id="analyticsLineFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#B8965A" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#B8965A" stopOpacity="0" />
        </linearGradient>
      </defs>
      {counts.length > 0 ? <polygon fill="url(#analyticsLineFill)" points={fillPoints} /> : null}
      <polyline
        fill="none"
        stroke="#B8965A"
        strokeWidth="2.5"
        strokeLinejoin="round"
        strokeLinecap="round"
        points={polyline}
      />
      {counts.map((c, i) => {
        const x = pad.l + (n === 1 ? iw / 2 : (i / (n - 1)) * iw)
        const y = pad.t + ih - (c / max) * ih
        return <circle key={i} cx={x} cy={y} r="4" fill="#1a1612" stroke="#B8965A" strokeWidth="2" />
      })}
      <text x={pad.l} y={h - 8} className="fill-brand-mist text-[10px]" fontFamily="inherit">
        {days[0]
          ? days[0].toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
          : ''}{' '}
        —{' '}
        {days[days.length - 1]
          ? days[days.length - 1].toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
          : ''}
      </text>
    </svg>
  )
}

function DonutChart({ contactedPct, insufficient }) {
  const size = 180
  const stroke = 22
  const r = (size - stroke) / 2
  const c = size / 2
  const circ = 2 * Math.PI * r
  const dash = (contactedPct / 100) * circ

  if (insufficient) {
    return (
      <div className="flex h-[200px] flex-col items-center justify-center gap-2">
        <div className="h-36 w-36 rounded-full border-2 border-dashed border-brand-brass-pale/50 bg-brand-ivory-deep/40" />
        <p className="text-center font-body text-[12px] text-brand-mist">Add more leads to see trends.</p>
      </div>
    )
  }

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="mx-auto" role="img" aria-label="Response rate">
      <circle cx={c} cy={c} r={r} fill="none" stroke="rgba(28,25,21,0.12)" strokeWidth={stroke} />
      <circle
        cx={c}
        cy={c}
        r={r}
        fill="none"
        stroke="#B8965A"
        strokeWidth={stroke}
        strokeDasharray={`${dash} ${circ - dash}`}
        strokeLinecap="round"
        transform={`rotate(-90 ${c} ${c})`}
      />
      <text x={c} y={c - 6} textAnchor="middle" className="fill-brand-charcoal font-display text-[26px] font-light">
        {Math.round(contactedPct)}%
      </text>
      <text x={c} y={c + 14} textAnchor="middle" className="fill-brand-mist font-body text-[11px]">
        contacted
      </text>
    </svg>
  )
}

export default function AdminAnalytics() {
  const [rangeId, setRangeId] = useState('30d')
  const [labelTick, setLabelTick] = useState(0)

  useEffect(() => {
    const onLabels = () => setLabelTick((t) => t + 1)
    window.addEventListener('maywood-admin-settings-changed', onLabels)
    return () => window.removeEventListener('maywood-admin-settings-changed', onLabels)
  }, [])

  const sourceLabels = useMemo(() => getSourceLabels(), [labelTick])

  const allLeads = getAllLeads()
  const contactedIds = getContactedLeadIds()

  const { start, end } = useMemo(() => getAnalyticsRange(rangeId), [rangeId])

  const leadsInRange = useMemo(() => {
    return allLeads.filter((r) => inTimestampRange(r, start, end))
  }, [allLeads, start, end])

  const lineData = useMemo(() => leadsPerDay(leadsInRange, start, end), [leadsInRange, start, end])
  const insufficientLine = leadsInRange.length === 0 || lineData.counts.length === 0

  const funnel = useMemo(() => {
    const calc = leadsInRange.filter((r) => r.type === 'calculator').length
    const quote = leadsInRange.filter((r) => r.type === 'quote').length
    const consult = leadsInRange.filter((r) => r.type === 'consultation').length
    const partner = leadsInRange.filter((r) => r.type === 'partner').length
    const stages = [
      { id: 'calc', label: 'Calculator Interactions', count: calc },
      { id: 'quote', label: 'Quote Requests', count: quote },
      { id: 'consult', label: 'Consultation Bookings', count: consult },
      { id: 'partner', label: 'Partner Applications', count: partner },
    ]
    const max = Math.max(1, calc, quote, consult, partner)
    return stages.map((s, i) => {
      const prevCount = i === 0 ? null : stages[i - 1].count
      const pctPrev =
        prevCount == null || prevCount === 0 ? null : Math.round((s.count / prevCount) * 1000) / 10
      return { ...s, pctPrev, max, idx: i }
    })
  }, [leadsInRange])

  const insufficientFunnel = leadsInRange.length === 0

  const now = new Date()
  const weekStart = startOfWeekMonday(now)
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)
  monthStart.setHours(0, 0, 0, 0)

  const sourceStats = useMemo(() => {
    const totalInRange = leadsInRange.length
    return SOURCE_KEY_IDS.map((key) => {
      const label = sourceLabels[key] || key
      const inRange = leadsInRange.filter((r) => r.sourcePage === key).length
      const thisWeek = allLeads.filter(
        (r) => r.sourcePage === key && new Date(r.timestamp) >= weekStart,
      ).length
      const thisMonth = allLeads.filter(
        (r) => r.sourcePage === key && new Date(r.timestamp) >= monthStart,
      ).length
      const pct = totalInRange === 0 ? 0 : Math.round((inRange / totalInRange) * 1000) / 10
      return { key, label, total: inRange, thisWeek, thisMonth, pct }
    })
  }, [leadsInRange, allLeads, weekStart, monthStart, sourceLabels])

  const topLocations = useMemo(() => {
    const quotes = leadsInRange.filter((r) => r.type === 'quote')
    const map = {}
    for (const r of quotes) {
      const loc = r.location != null ? String(r.location).trim() : ''
      if (!loc) continue
      const key = loc.toLowerCase().replace(/\s+/g, ' ')
      map[key] = (map[key] || 0) + 1
    }
    return Object.entries(map)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([label, count]) => ({ label, count }))
  }, [leadsInRange])

  const maxLoc = Math.max(1, ...topLocations.map((x) => x.count))

  const scopeCounts = useMemo(() => {
    const quotes = leadsInRange.filter((r) => r.type === 'quote')
    const map = {}
    for (const r of quotes) {
      const sc = r.scope
      const list = Array.isArray(sc) ? sc : sc != null ? [String(sc)] : []
      for (const item of list) {
        const k = String(item).trim()
        if (!k) continue
        map[k] = (map[k] || 0) + 1
      }
    }
    return Object.entries(map)
      .sort((a, b) => b[1] - a[1])
      .map(([label, count]) => ({ label, count }))
  }, [leadsInRange])

  const maxScope = Math.max(1, ...scopeCounts.map((x) => x.count))

  const response = useMemo(() => {
    const total = leadsInRange.length
    const contacted = leadsInRange.filter((r) => contactedIds.has(r.id)).length
    const pending = total - contacted
    const pct = total === 0 ? 0 : (contacted / total) * 100
    return { total, contacted, pending, pct }
  }, [leadsInRange, contactedIds])

  const insufficientResponse = leadsInRange.length === 0

  return (
    <div className="space-y-10">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h1 className="font-display text-[26px] font-light text-brand-charcoal lg:text-[28px]">Analytics</h1>
          <p className="mt-1 font-body text-[14px] text-brand-mist">Website engagement and lead performance</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {RANGE_OPTIONS.map(({ id, label }) => (
            <button
              key={id}
              type="button"
              onClick={() => setRangeId(id)}
              className={[
                'rounded-full border px-3 py-1.5 font-body text-[12px] transition-colors',
                rangeId === id
                  ? 'border-brand-brass bg-brand-brass/15 font-medium text-brand-charcoal'
                  : 'border-brand-brass-pale/60 text-brand-mist hover:border-brand-brass/50 hover:text-brand-charcoal',
              ].join(' ')}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <section className="rounded-lg border border-brand-brass-pale/35 bg-[#f5f0eb] p-6 shadow-sm">
        <h2 className="font-display text-lg font-light text-brand-charcoal">Lead volume over time</h2>
        <p className="mt-1 font-body text-[12px] text-brand-mist">Total leads captured per day in the selected range.</p>
        <div className="mt-6">
          <LineChart
            days={lineData.days}
            counts={lineData.counts}
            max={lineData.max}
            insufficient={insufficientLine}
          />
        </div>
      </section>

      <section className="rounded-lg border border-brand-brass-pale/35 bg-white p-6 shadow-sm">
        <h2 className="font-display text-lg font-light text-brand-charcoal">Conversion funnel</h2>
        <p className="mt-1 font-body text-[12px] text-brand-mist">
          Calculator → Quote → Consultation → Partner (% of previous stage).
        </p>
        {insufficientFunnel ? (
          <p className="mt-8 text-center font-body text-[13px] text-brand-mist">Add more leads to see trends.</p>
        ) : (
          <div className="mx-auto mt-8 max-w-xl space-y-4">
            {funnel.map((s) => {
              const widthPct = (s.count / s.max) * 100
              const taper = 100 - s.idx * 10
              return (
                <div key={s.id} className="w-full">
                  <div className="mb-1 flex justify-between font-body text-[12px] text-brand-charcoal">
                    <span className="font-medium">{s.label}</span>
                    <span className="tabular-nums text-brand-mist">
                      {s.count}
                      {s.idx > 0 && s.pctPrev != null ? (
                        <span className="ml-2 text-brand-brass">({s.pctPrev}% of previous)</span>
                      ) : null}
                    </span>
                  </div>
                  <div className="flex justify-center" style={{ width: `${taper}%` }}>
                    <div className="h-11 w-full overflow-hidden rounded-sm bg-brand-ivory-deep">
                      <div
                        className="h-full min-w-[4px] rounded-sm bg-brand-brass transition-all"
                        style={{ width: `${Math.max(4, widthPct)}%` }}
                      />
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </section>

      <section className="rounded-lg border border-brand-brass-pale/35 bg-white p-6 shadow-sm">
        <h2 className="font-display text-lg font-light text-brand-charcoal">Lead source performance</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[640px] border-collapse text-left">
            <thead>
              <tr className="border-b border-brand-brass-pale/40 bg-brand-ivory-deep/60">
                <th className="px-4 py-3 font-body text-[10px] font-semibold uppercase tracking-[0.1em] text-brand-mist">
                  Source
                </th>
                <th className="px-4 py-3 font-body text-[10px] font-semibold uppercase tracking-[0.1em] text-brand-mist">
                  Total leads
                </th>
                <th className="px-4 py-3 font-body text-[10px] font-semibold uppercase tracking-[0.1em] text-brand-mist">
                  This week
                </th>
                <th className="px-4 py-3 font-body text-[10px] font-semibold uppercase tracking-[0.1em] text-brand-mist">
                  This month
                </th>
                <th className="px-4 py-3 font-body text-[10px] font-semibold uppercase tracking-[0.1em] text-brand-mist">
                  % of total
                </th>
              </tr>
            </thead>
            <tbody>
              {sourceStats.map((row) => (
                <tr key={row.key} className="border-b border-brand-brass-pale/20">
                  <td className="px-4 py-3 font-body text-[14px] text-brand-charcoal">{row.label}</td>
                  <td className="px-4 py-3 font-body text-[14px] tabular-nums text-brand-charcoal">{row.total}</td>
                  <td className="px-4 py-3 font-body text-[14px] tabular-nums text-brand-mist">{row.thisWeek}</td>
                  <td className="px-4 py-3 font-body text-[14px] tabular-nums text-brand-mist">{row.thisMonth}</td>
                  <td className="px-4 py-3 font-body text-[14px] tabular-nums text-brand-brass">{row.pct}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {leadsInRange.length === 0 ? (
          <p className="mt-4 text-center font-body text-[13px] text-brand-mist">Add more leads to see trends.</p>
        ) : null}
      </section>

      <section className="rounded-lg border border-brand-brass-pale/35 bg-white p-6 shadow-sm">
        <h2 className="font-display text-lg font-light text-brand-charcoal">Top locations</h2>
        <p className="mt-1 font-body text-[12px] text-brand-mist">From quote request location field (Bangalore areas).</p>
        {topLocations.length === 0 ? (
          <p className="mt-6 text-center font-body text-[13px] text-brand-mist">Add more leads to see trends.</p>
        ) : (
          <ul className="mt-6 space-y-3">
            {topLocations.map((item, i) => (
              <li key={item.label} className="flex items-center gap-4">
                <span className="w-6 font-body text-[12px] font-medium tabular-nums text-brand-mist">{i + 1}</span>
                <div className="min-w-0 flex-1">
                  <div className="mb-1 flex justify-between font-body text-[13px]">
                    <span className="truncate capitalize text-brand-charcoal">{item.label}</span>
                    <span className="ml-2 shrink-0 tabular-nums text-brand-mist">{item.count}</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-brand-ivory-deep">
                    <div
                      className="h-full rounded-full bg-brand-brass"
                      style={{ width: `${(item.count / maxLoc) * 100}%` }}
                    />
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="rounded-lg border border-brand-brass-pale/35 bg-white p-6 shadow-sm">
        <h2 className="font-display text-lg font-light text-brand-charcoal">Popular scopes</h2>
        <p className="mt-1 font-body text-[12px] text-brand-mist">Selected scopes on instant quote requests.</p>
        {scopeCounts.length === 0 ? (
          <p className="mt-6 text-center font-body text-[13px] text-brand-mist">Add more leads to see trends.</p>
        ) : (
          <div className="mt-6 space-y-4">
            {scopeCounts.map((item) => (
              <div key={item.label}>
                <div className="mb-1 flex justify-between font-body text-[13px]">
                  <span className="text-brand-charcoal">{item.label}</span>
                  <span className="tabular-nums text-brand-mist">{item.count}</span>
                </div>
                <div className="h-2.5 overflow-hidden rounded-full bg-brand-ivory-deep">
                  <div
                    className="h-full rounded-full bg-brand-brass"
                    style={{ width: `${(item.count / maxScope) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="rounded-lg border border-brand-brass-pale/35 bg-white p-6 shadow-sm">
        <h2 className="font-display text-lg font-light text-brand-charcoal">Response rate</h2>
        <p className="mt-1 font-body text-[12px] text-brand-mist">Leads marked as contacted in the selected range.</p>
        <div className="mt-6 flex flex-col items-center gap-6 md:flex-row md:items-start md:justify-center md:gap-12">
          <DonutChart contactedPct={response.pct} insufficient={insufficientResponse} />
          <div className="max-w-sm text-center md:text-left">
            {insufficientResponse ? (
              <p className="font-body text-[13px] text-brand-mist">Add more leads to see trends.</p>
            ) : (
              <>
                <p className="font-body text-[14px] text-brand-charcoal">
                  <span className="font-medium text-brand-brass">{response.pending}</span> leads have not been contacted
                  yet.
                </p>
                <Link
                  to="/admin/leads?uncontacted=1"
                  className={['mt-4 inline-block', buttonClasses('primary', 'py-2.5 text-[11px]')].join(' ')}
                >
                  View Uncontacted Leads
                </Link>
              </>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}
