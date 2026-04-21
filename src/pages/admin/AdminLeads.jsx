import { Fragment, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { ChevronDown, ChevronUp, Inbox, Loader2, Trash2, Phone, UserCheck } from 'lucide-react'
import { buttonClasses } from '../../lib/buttonStyles'
import {
  deleteLead,
  exportToCSV,
  getAllLeads,
  LEADS_UPDATED_EVENT,
  markLeadContacted,
} from '../../utils/adminDataStore'

const SOURCE_FILTERS = [
  { id: 'all', label: 'All', match: () => true },
  { id: 'quote', label: 'Quote Requests', match: (r) => r.type === 'quote' },
  { id: 'consultation', label: 'Consultations', match: (r) => r.type === 'consultation' },
  { id: 'calculator', label: 'Calculator', match: (r) => r.type === 'calculator' },
  { id: 'partner', label: 'Partner Applications', match: (r) => r.type === 'partner' },
]

const DATE_FILTERS = [
  { id: 'today', label: 'Today' },
  { id: 'week', label: 'This Week' },
  { id: 'month', label: 'This Month' },
  { id: 'all', label: 'All Time' },
]

const BADGE_BY_TYPE = {
  quote: { label: 'Quote Request', className: 'bg-[#B8965A]/15 text-[#8B6914] border-[#B8965A]/35' },
  consultation: { label: 'Consultation', className: 'bg-blue-50 text-blue-800 border-blue-200/80' },
  partner: { label: 'Partner Application', className: 'bg-green-50 text-green-800 border-green-200/80' },
  calculator: { label: 'Calculator Lead', className: 'bg-purple-50 text-purple-800 border-purple-200/80' },
}

const PAGE_SIZE = 20

function displayName(row) {
  const n = row.fullName ?? row.name
  return n && String(n).trim() ? String(n).trim() : '—'
}

function displayEmail(row) {
  const e = row.email
  return e && String(e).trim() ? String(e).trim() : '—'
}

function displayPhone(row) {
  const p = row.phone
  return p && String(p).trim() ? String(p).trim() : '—'
}

function formatFieldLabel(key) {
  return String(key)
    .replace(/([A-Z])/g, ' $1')
    .replace(/_/g, ' ')
    .replace(/^\s+/, '')
    .replace(/\b\w/g, (c) => c.toUpperCase())
}

function startOfLocalDay(d) {
  const x = new Date(d)
  x.setHours(0, 0, 0, 0)
  return x
}

function startOfWeekMonday(d) {
  const x = new Date(d)
  const day = x.getDay()
  const diff = day === 0 ? -6 : 1 - day
  x.setDate(x.getDate() + diff)
  x.setHours(0, 0, 0, 0)
  return x
}

function startOfMonth(d) {
  const x = new Date(d.getFullYear(), d.getMonth(), 1)
  x.setHours(0, 0, 0, 0)
  return x
}

function matchesDateFilter(row, dateFilterId) {
  if (dateFilterId === 'all') return true
  const ts = new Date(row.timestamp)
  if (Number.isNaN(ts.getTime())) return false
  const now = new Date()
  if (dateFilterId === 'today') {
    return ts >= startOfLocalDay(now) && ts < startOfLocalDay(new Date(now.getTime() + 86400000))
  }
  if (dateFilterId === 'week') return ts >= startOfWeekMonday(now)
  if (dateFilterId === 'month') return ts >= startOfMonth(now)
  return true
}

function digitsOnly(s) {
  return String(s || '').replace(/\D/g, '')
}

function matchesSearch(row, q) {
  const raw = q.trim().toLowerCase()
  if (!raw) return true
  const name = displayName(row).toLowerCase()
  const phoneDigits = digitsOnly(displayPhone(row))
  const searchDigits = digitsOnly(raw)
  if (searchDigits.length > 0 && phoneDigits.includes(searchDigits)) return true
  if (name.includes(raw)) return true
  return false
}

function formatTableDateTime(iso) {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return '—'
  return d.toLocaleString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  })
}

function sortedEntries(record) {
  const preferred = ['id', 'type', 'sourcePage', 'timestamp']
  const keys = Object.keys(record).sort((a, b) => {
    const ia = preferred.indexOf(a)
    const ib = preferred.indexOf(b)
    if (ia !== -1 || ib !== -1) {
      if (ia === -1) return 1
      if (ib === -1) return -1
      return ia - ib
    }
    return a.localeCompare(b)
  })
  return keys.map((k) => [k, record[k]])
}

export default function AdminLeads() {
  const [searchParams, setSearchParams] = useSearchParams()
  const uncontactedOnly = searchParams.get('uncontacted') === '1'

  const [leads, setLeads] = useState([])
  const [loading, setLoading] = useState(true)
  const [sourceFilter, setSourceFilter] = useState('all')
  const [dateFilter, setDateFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [expandedId, setExpandedId] = useState(null)
  const [toast, setToast] = useState(null)

  const refresh = useCallback(async () => {
    setLoading(true)
    try {
      setLeads(await getAllLeads())
    } finally {
      setLoading(false)
    }
  }, [])

  const toastTimerRef = useRef(null)

  useEffect(() => {
    refresh()
  }, [refresh])

  useEffect(() => {
    const onLeads = () => {
      refresh()
    }
    window.addEventListener(LEADS_UPDATED_EVENT, onLeads)
    const onVis = () => {
      if (document.visibilityState === 'visible') refresh()
    }
    document.addEventListener('visibilitychange', onVis)
    return () => {
      window.removeEventListener(LEADS_UPDATED_EVENT, onLeads)
      document.removeEventListener('visibilitychange', onVis)
    }
  }, [refresh])

  const filtered = useMemo(() => {
    const matcher = SOURCE_FILTERS.find((f) => f.id === sourceFilter)?.match ?? (() => true)
    return leads.filter((r) => {
      if (uncontactedOnly && r.contacted) return false
      return matcher(r) && matchesDateFilter(r, dateFilter) && matchesSearch(r, search)
    })
  }, [leads, sourceFilter, dateFilter, search, uncontactedOnly])

  useEffect(() => {
    setPage(1)
  }, [sourceFilter, dateFilter, search])

  useEffect(() => {
    const maxPage = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE) || 1)
    if (page > maxPage) setPage(maxPage)
  }, [filtered.length, page])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE) || 1)
  const pageSlice = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE
    return filtered.slice(start, start + PAGE_SIZE)
  }, [filtered, page])

  const globalIndexStart = (page - 1) * PAGE_SIZE

  const showToast = (message) => {
    setToast(message)
    if (toastTimerRef.current) window.clearTimeout(toastTimerRef.current)
    toastTimerRef.current = window.setTimeout(() => setToast(null), 2800)
  }

  const handleExport = async () => {
    const rows = await getAllLeads()
    exportToCSV(rows, `maywood-leads-${Date.now()}.csv`)
  }

  const handleRowClick = (id) => {
    setExpandedId((prev) => (prev === id ? null : id))
  }

  const handleMarkContacted = async (e, row) => {
    e.stopPropagation()
    await markLeadContacted(row.table, row.id)
    await refresh()
  }

  const handleDelete = async (e, row) => {
    e.stopPropagation()
    if (!window.confirm('Remove this lead from storage? This cannot be undone.')) return
    await deleteLead(row.table, row.id)
    setExpandedId((prev) => (prev === row.id ? null : prev))
    await refresh()
  }

  const handleCopyPhone = async (e, phone) => {
    e.stopPropagation()
    const p = String(phone || '').trim()
    if (!p) {
      showToast('No phone number')
      return
    }
    try {
      await navigator.clipboard.writeText(p)
      showToast('Phone copied to clipboard')
    } catch {
      showToast('Could not copy')
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[420px] items-center justify-center rounded-lg border border-brand-brass-pale/40 bg-white shadow-sm">
        <Loader2 className="h-10 w-10 animate-spin text-brand-brass" aria-label="Loading" />
      </div>
    )
  }

  if (leads.length === 0) {
    return (
      <div className="flex min-h-[420px] flex-col items-center justify-center rounded-lg border border-brand-brass-pale/40 bg-white px-8 py-16 text-center shadow-sm">
        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-brand-ivory-deep text-brand-brass/50">
          <Inbox className="h-12 w-12" strokeWidth={1.25} aria-hidden />
        </div>
        <p className="mt-8 max-w-md font-body text-[15px] leading-relaxed text-brand-mist">
          No leads captured yet. Share the website to start collecting.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {uncontactedOnly ? (
        <div className="flex flex-col gap-3 rounded-lg border border-brand-brass/35 bg-brand-brass/10 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-body text-[13px] text-brand-charcoal">Showing uncontacted leads only.</p>
          <button
            type="button"
            onClick={() => setSearchParams({})}
            className="self-start rounded-sm border border-brand-brass-pale/60 px-3 py-1.5 font-body text-[12px] text-brand-charcoal hover:border-brand-brass sm:self-auto"
          >
            Clear filter
          </button>
        </div>
      ) : null}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="font-display text-[26px] font-light text-brand-charcoal lg:text-[28px]">All Leads</h1>
          <p className="mt-1 font-body text-[14px] text-brand-mist">Every contact captured across the website</p>
        </div>
        <button type="button" onClick={handleExport} className={buttonClasses('primary', 'shrink-0 py-2.5 text-[11px]')}>
          Export CSV
        </button>
      </div>

      <div className="flex flex-col gap-4 rounded-lg border border-brand-brass-pale/35 bg-white p-4 shadow-sm lg:flex-row lg:flex-wrap lg:items-center lg:justify-between">
        <div className="flex flex-wrap gap-2">
          <span className="mr-1 self-center font-body text-[11px] font-semibold uppercase tracking-[0.1em] text-brand-mist">
            Source
          </span>
          {SOURCE_FILTERS.map(({ id, label }) => (
            <button
              key={id}
              type="button"
              onClick={() => setSourceFilter(id)}
              className={[
                'rounded-full border px-3 py-1.5 font-body text-[12px] transition-colors',
                sourceFilter === id
                  ? 'border-brand-brass bg-brand-brass/15 font-medium text-brand-charcoal'
                  : 'border-brand-brass-pale/60 text-brand-mist hover:border-brand-brass/50 hover:text-brand-charcoal',
              ].join(' ')}
            >
              {label}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          <span className="mr-1 self-center font-body text-[11px] font-semibold uppercase tracking-[0.1em] text-brand-mist">
            Date
          </span>
          {DATE_FILTERS.map(({ id, label }) => (
            <button
              key={id}
              type="button"
              onClick={() => setDateFilter(id)}
              className={[
                'rounded-full border px-3 py-1.5 font-body text-[12px] transition-colors',
                dateFilter === id
                  ? 'border-brand-brass bg-brand-brass/15 font-medium text-brand-charcoal'
                  : 'border-brand-brass-pale/60 text-brand-mist hover:border-brand-brass/50 hover:text-brand-charcoal',
              ].join(' ')}
            >
              {label}
            </button>
          ))}
        </div>
        <label className="block w-full min-w-[200px] flex-1 lg:max-w-sm">
          <span className="sr-only">Search by name or phone</span>
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name or phone…"
            className="w-full rounded-sm border border-brand-brass-pale/50 bg-brand-ivory-deep/50 px-3 py-2 font-body text-[14px] text-brand-charcoal outline-none ring-brand-brass/30 placeholder:text-brand-mist focus:border-brand-brass focus:ring-2"
          />
        </label>
      </div>

      <div className="overflow-hidden rounded-lg border border-brand-brass-pale/35 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[920px] border-collapse text-left">
            <thead>
              <tr className="border-b border-brand-brass-pale/40 bg-brand-ivory-deep/60">
                <th className="px-4 py-3 font-body text-[11px] font-semibold uppercase tracking-[0.1em] text-brand-mist">
                  #
                </th>
                <th className="px-4 py-3 font-body text-[11px] font-semibold uppercase tracking-[0.1em] text-brand-mist">
                  Name
                </th>
                <th className="px-4 py-3 font-body text-[11px] font-semibold uppercase tracking-[0.1em] text-brand-mist">
                  Phone
                </th>
                <th className="px-4 py-3 font-body text-[11px] font-semibold uppercase tracking-[0.1em] text-brand-mist">
                  Email
                </th>
                <th className="px-4 py-3 font-body text-[11px] font-semibold uppercase tracking-[0.1em] text-brand-mist">
                  Source
                </th>
                <th className="px-4 py-3 font-body text-[11px] font-semibold uppercase tracking-[0.1em] text-brand-mist">
                  Date &amp; Time
                </th>
                <th className="px-4 py-3 font-body text-[11px] font-semibold uppercase tracking-[0.1em] text-brand-mist">
                  Details
                </th>
                <th className="px-4 py-3 font-body text-[11px] font-semibold uppercase tracking-[0.1em] text-brand-mist">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {pageSlice.map((row, i) => {
                const badge = BADGE_BY_TYPE[row.type] || BADGE_BY_TYPE.calculator
                const isExpanded = expandedId === row.id
                const contacted = row.contacted
                const phone = displayPhone(row)
                const num = globalIndexStart + i + 1

                return (
                  <Fragment key={row.id}>
                    <tr
                      role="button"
                      tabIndex={0}
                      onClick={() => handleRowClick(row.id)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault()
                          handleRowClick(row.id)
                        }
                      }}
                      className={[
                        'cursor-pointer border-b border-brand-brass-pale/25 transition-colors',
                        isExpanded ? 'bg-brand-brass/8' : 'hover:bg-brand-ivory-deep/40',
                      ].join(' ')}
                    >
                      <td className="px-4 py-3 font-body text-[13px] tabular-nums text-brand-mist">{num}</td>
                      <td className="max-w-[200px] px-4 py-3">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-body text-[14px] text-brand-charcoal">{displayName(row)}</span>
                          {contacted ? (
                            <span className="inline-flex items-center rounded-full border border-green-200 bg-green-50 px-2 py-0.5 font-body text-[10px] font-semibold uppercase tracking-[0.06em] text-green-800">
                              Contacted
                            </span>
                          ) : null}
                        </div>
                      </td>
                      <td className="px-4 py-3 font-body text-[13px] text-brand-charcoal">{phone}</td>
                      <td className="max-w-[220px] truncate px-4 py-3 font-body text-[13px] text-brand-mist" title={displayEmail(row)}>
                        {displayEmail(row)}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={[
                            'inline-block rounded border px-2 py-0.5 font-body text-[10px] font-semibold uppercase tracking-[0.06em]',
                            badge.className,
                          ].join(' ')}
                        >
                          {badge.label}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 font-body text-[13px] text-brand-charcoal">
                        {formatTableDateTime(row.timestamp)}
                      </td>
                      <td className="px-4 py-3 font-body text-[12px] text-brand-brass">
                        <span className="inline-flex items-center gap-1">
                          {isExpanded ? (
                            <>
                              <ChevronUp className="h-4 w-4" aria-hidden />
                              Collapse
                            </>
                          ) : (
                            <>
                              <ChevronDown className="h-4 w-4" aria-hidden />
                              Expand
                            </>
                          )}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap items-center gap-2">
                          {!contacted ? (
                            <button
                              type="button"
                              onClick={(e) => handleMarkContacted(e, row)}
                              className="inline-flex items-center gap-1 rounded-sm border border-green-200 bg-green-50 px-2 py-1 font-body text-[11px] font-medium text-green-800 transition-colors hover:bg-green-100"
                            >
                              <UserCheck className="h-3.5 w-3.5 shrink-0" aria-hidden />
                              <span className="whitespace-nowrap">Mark as Contacted</span>
                            </button>
                          ) : null}
                          <button
                            type="button"
                            onClick={(e) => handleCopyPhone(e, phone)}
                            className="inline-flex items-center gap-1 rounded-sm border border-brand-brass-pale/50 px-2 py-1 font-body text-[11px] text-brand-charcoal transition-colors hover:border-brand-brass"
                          >
                            <Phone className="h-3.5 w-3.5 shrink-0" aria-hidden />
                            Copy Phone
                          </button>
                          <button
                            type="button"
                            onClick={(e) => handleDelete(e, row)}
                            className="inline-flex items-center gap-1 rounded-sm border border-red-200 bg-red-50 px-2 py-1 font-body text-[11px] text-red-800 transition-colors hover:bg-red-100"
                            title="Delete"
                          >
                            <Trash2 className="h-3.5 w-3.5" aria-hidden />
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                    {isExpanded ? (
                      <tr className="bg-brand-ivory-deep/30">
                        <td colSpan={8} className="px-4 py-6">
                          <div className="rounded-sm border border-brand-brass-pale/40 bg-white p-6">
                            <p className="font-body text-[11px] font-semibold uppercase tracking-[0.12em] text-brand-brass">
                              Full submission
                            </p>
                            {row.type === 'quote' ? (
                              <div className="mt-4 rounded-sm border border-brand-brass-pale/30 bg-brand-ivory-deep/40 p-4">
                                <p className="font-body text-[10px] font-semibold uppercase tracking-[0.1em] text-brand-mist">
                                  Quote summary
                                </p>
                                <dl className="mt-3 grid gap-2 font-body text-[13px] sm:grid-cols-2">
                                  {row.propertyType != null && (
                                    <>
                                      <dt className="text-brand-mist">Property type</dt>
                                      <dd className="text-brand-charcoal">{String(row.propertyType)}</dd>
                                    </>
                                  )}
                                  {row.scope != null && (
                                    <>
                                      <dt className="text-brand-mist">Scope</dt>
                                      <dd className="text-brand-charcoal">
                                        {Array.isArray(row.scope) ? row.scope.join(', ') : String(row.scope)}
                                      </dd>
                                    </>
                                  )}
                                  {row.area != null && (
                                    <>
                                      <dt className="text-brand-mist">Area</dt>
                                      <dd className="text-brand-charcoal">
                                        {String(row.area)}
                                        {row.areaUnit ? ` ${row.areaUnit}` : ''}
                                      </dd>
                                    </>
                                  )}
                                  {(row.estimateLow != null || row.estimateHigh != null) && (
                                    <>
                                      <dt className="text-brand-mist">Estimate range</dt>
                                      <dd className="font-medium text-brand-charcoal">
                                        ₹{row.estimateLow != null ? Number(row.estimateLow).toLocaleString('en-IN') : '—'} – ₹
                                        {row.estimateHigh != null ? Number(row.estimateHigh).toLocaleString('en-IN') : '—'}
                                      </dd>
                                    </>
                                  )}
                                </dl>
                              </div>
                            ) : null}
                            {row.type === 'consultation' ? (
                              <div className="mt-4 rounded-sm border border-brand-brass-pale/30 bg-brand-ivory-deep/40 p-4">
                                <p className="font-body text-[10px] font-semibold uppercase tracking-[0.1em] text-brand-mist">
                                  Consultation preferences
                                </p>
                                <dl className="mt-3 grid gap-2 font-body text-[13px] sm:grid-cols-2">
                                  {row.preferredDate != null && row.preferredDate !== '' && (
                                    <>
                                      <dt className="text-brand-mist">Preferred date</dt>
                                      <dd className="text-brand-charcoal">{String(row.preferredDate)}</dd>
                                    </>
                                  )}
                                  {row.timeSlot != null && row.timeSlot !== '' && (
                                    <>
                                      <dt className="text-brand-mist">Time slot</dt>
                                      <dd className="text-brand-charcoal">{String(row.timeSlot)}</dd>
                                    </>
                                  )}
                                  {row.preferredCenter != null && row.preferredCenter !== '' && (
                                    <>
                                      <dt className="text-brand-mist">Center</dt>
                                      <dd className="text-brand-charcoal">{String(row.preferredCenter)}</dd>
                                    </>
                                  )}
                                  {row.projectNote != null && row.projectNote !== '' && (
                                    <>
                                      <dt className="text-brand-mist">Project note</dt>
                                      <dd className="col-span-2 text-brand-charcoal">{String(row.projectNote)}</dd>
                                    </>
                                  )}
                                </dl>
                              </div>
                            ) : null}
                            {row.type === 'partner' ? (
                              <div className="mt-4 rounded-sm border border-brand-brass-pale/30 bg-brand-ivory-deep/40 p-4">
                                <p className="font-body text-[10px] font-semibold uppercase tracking-[0.1em] text-brand-mist">
                                  Partner application
                                </p>
                                <dl className="mt-3 grid gap-2 font-body text-[13px] sm:grid-cols-2">
                                  {row.company != null && String(row.company).trim() !== '' ? (
                                    <>
                                      <dt className="text-brand-mist">Company</dt>
                                      <dd className="text-brand-charcoal">{String(row.company)}</dd>
                                    </>
                                  ) : null}
                                  {row.partnerType != null && String(row.partnerType).trim() !== '' ? (
                                    <>
                                      <dt className="text-brand-mist">Partner type</dt>
                                      <dd className="text-brand-charcoal">{String(row.partnerType)}</dd>
                                    </>
                                  ) : null}
                                  {row.city != null && String(row.city).trim() !== '' ? (
                                    <>
                                      <dt className="text-brand-mist">City</dt>
                                      <dd className="text-brand-charcoal">{String(row.city)}</dd>
                                    </>
                                  ) : null}
                                  {row.about != null && String(row.about).trim() !== '' ? (
                                    <>
                                      <dt className="col-span-2 text-brand-mist">About</dt>
                                      <dd className="col-span-2 text-brand-charcoal">{String(row.about)}</dd>
                                    </>
                                  ) : null}
                                  {row.agreed != null ? (
                                    <>
                                      <dt className="text-brand-mist">Agreed to terms</dt>
                                      <dd className="text-brand-charcoal">{String(row.agreed)}</dd>
                                    </>
                                  ) : null}
                                </dl>
                              </div>
                            ) : null}
                            <dl className="mt-6 space-y-3">
                              {sortedEntries(row).map(([key, value]) => (
                                <div key={key} className="border-b border-brand-brass-pale/20 pb-3 last:border-0 last:pb-0">
                                  <dt className="font-body text-[10px] font-semibold uppercase tracking-[0.1em] text-brand-brass">
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
                        </td>
                      </tr>
                    ) : null}
                  </Fragment>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="text-center font-body text-[14px] text-brand-mist">
          No leads match your filters. Try adjusting search or filters.
        </p>
      ) : (
        <div className="flex flex-col items-center justify-between gap-4 border-t border-brand-brass-pale/30 pt-4 sm:flex-row">
          <p className="font-body text-[13px] text-brand-mist">
            Showing {globalIndexStart + 1}–{Math.min(globalIndexStart + pageSlice.length, filtered.length)} of{' '}
            {filtered.length}
            {filtered.length !== leads.length ? ` (filtered from ${leads.length} total)` : ''}
          </p>
          <div className="flex items-center gap-3">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className={[
                'rounded-sm border px-4 py-2 font-body text-[12px] font-medium',
                page <= 1
                  ? 'cursor-not-allowed border-brand-brass-pale/40 text-brand-mist'
                  : 'border-brand-brass-pale/60 text-brand-charcoal hover:border-brand-brass',
              ].join(' ')}
            >
              Previous
            </button>
            <span className="font-body text-[13px] tabular-nums text-brand-mist">
              Page {page} of {totalPages}
            </span>
            <button
              type="button"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              className={[
                'rounded-sm border px-4 py-2 font-body text-[12px] font-medium',
                page >= totalPages
                  ? 'cursor-not-allowed border-brand-brass-pale/40 text-brand-mist'
                  : 'border-brand-brass-pale/60 text-brand-charcoal hover:border-brand-brass',
              ].join(' ')}
            >
              Next
            </button>
          </div>
        </div>
      )}

      {toast ? (
        <div
          role="status"
          className="fixed bottom-6 right-6 z-[300] max-w-sm rounded-sm border border-brand-brass-pale/50 bg-brand-charcoal px-4 py-3 font-body text-[13px] text-brand-ivory shadow-lg"
        >
          {toast}
        </div>
      ) : null}
    </div>
  )
}
