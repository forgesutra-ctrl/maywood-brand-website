import { Fragment, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { CalendarDays, ChevronDown, ChevronLeft, ChevronRight, ChevronUp, Inbox, LayoutList, Phone, Trash2, UserCheck } from 'lucide-react'
import { buttonClasses } from '../../lib/buttonStyles'
import {
  ADMIN_CONSULTATION_STATUS_KEY,
  ADMIN_CONTACTED_IDS_KEY,
  ADMIN_LEADS_STORAGE_KEY,
  cycleConsultationStatus,
  deleteLeadById,
  exportToCSV,
  getAllLeads,
  getConsultationStatusForId,
  getContactedLeadIds,
  markLeadContacted,
} from '../../utils/adminDataStore'
import {
  addDays,
  DATE_FILTER_IDS,
  displayEmail,
  displayName,
  displayPhone,
  formatDayMonth,
  formatFieldLabel,
  formatShortWeekday,
  formatTableDateTime,
  matchesDateFilter,
  matchesSearch,
  sortedEntries,
  startOfWeekMonday,
  toYyyyMmDd,
  truncateText,
} from '../../utils/adminPageUtils'

const PAGE_SIZE = 20

const STATUS_CLASS = {
  pending: 'border-amber-200 bg-amber-50 text-amber-900',
  confirmed: 'border-blue-200 bg-blue-50 text-blue-800',
  completed: 'border-green-200 bg-green-50 text-green-800',
}

const STATUS_LABEL = {
  pending: 'Pending',
  confirmed: 'Confirmed',
  completed: 'Completed',
}

export default function AdminConsultations() {
  const [leads, setLeads] = useState(() => getAllLeads().filter((r) => r.type === 'consultation'))
  const [contactedRev, setContactedRev] = useState(0)
  const [statusRev, setStatusRev] = useState(0)
  const [dateFilter, setDateFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [expandedId, setExpandedId] = useState(null)
  const [toast, setToast] = useState(null)
  const [view, setView] = useState('table')
  const [weekOffset, setWeekOffset] = useState(0)
  const toastTimerRef = useRef(null)

  const contactedIds = useMemo(() => {
    void contactedRev
    void leads.length
    return getContactedLeadIds()
  }, [leads, contactedRev])

  const getStatus = useCallback(
    (id) => {
      void statusRev
      return getConsultationStatusForId(id)
    },
    [statusRev],
  )

  const refresh = useCallback(() => {
    setLeads(getAllLeads().filter((r) => r.type === 'consultation'))
    setContactedRev((r) => r + 1)
    setStatusRev((r) => r + 1)
  }, [])

  useEffect(() => {
    const onStorage = (e) => {
      if (
        e.key === ADMIN_LEADS_STORAGE_KEY ||
        e.key === ADMIN_CONTACTED_IDS_KEY ||
        e.key === ADMIN_CONSULTATION_STATUS_KEY ||
        e.key === null
      ) {
        refresh()
      }
    }
    window.addEventListener('storage', onStorage)
    const onVis = () => {
      if (document.visibilityState === 'visible') {
        setLeads(getAllLeads().filter((r) => r.type === 'consultation'))
        setContactedRev((r) => r + 1)
        setStatusRev((r) => r + 1)
      }
    }
    document.addEventListener('visibilitychange', onVis)
    return () => {
      window.removeEventListener('storage', onStorage)
      document.removeEventListener('visibilitychange', onVis)
    }
  }, [refresh])

  const searchOnly = useMemo(() => leads.filter((r) => matchesSearch(r, search)), [leads, search])

  const filtered = useMemo(() => {
    return searchOnly.filter((r) => matchesDateFilter(r, dateFilter))
  }, [searchOnly, dateFilter])

  useEffect(() => {
    setPage(1)
  }, [dateFilter, search])

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

  const weekMonday = useMemo(() => addDays(startOfWeekMonday(new Date()), weekOffset * 7), [weekOffset])

  const weekDays = useMemo(() => Array.from({ length: 7 }, (_, i) => addDays(weekMonday, i)), [weekMonday])

  const calendarBuckets = useMemo(() => {
    const map = Object.fromEntries(weekDays.map((d) => [toYyyyMmDd(d), []]))
    for (const row of searchOnly) {
      const pd = row.preferredDate
      if (!pd || typeof pd !== 'string') continue
      if (map[pd]) map[pd].push(row)
    }
    return map
  }, [searchOnly, weekDays])

  const unscheduled = useMemo(
    () => searchOnly.filter((r) => !r.preferredDate || String(r.preferredDate).trim() === ''),
    [searchOnly],
  )

  const showToast = (message) => {
    setToast(message)
    if (toastTimerRef.current) window.clearTimeout(toastTimerRef.current)
    toastTimerRef.current = window.setTimeout(() => setToast(null), 2800)
  }

  const handleExport = () => {
    exportToCSV(
      getAllLeads().filter((r) => r.type === 'consultation'),
      `maywood-consultations-${Date.now()}.csv`,
    )
  }

  const handleRowClick = (id) => {
    setExpandedId((prev) => (prev === id ? null : id))
  }

  const handleStatusClick = (e, id) => {
    e.stopPropagation()
    cycleConsultationStatus(id)
    setStatusRev((r) => r + 1)
  }

  const handleMarkContacted = (e, id) => {
    e.stopPropagation()
    markLeadContacted(id)
    setContactedRev((r) => r + 1)
  }

  const handleDelete = (e, id) => {
    e.stopPropagation()
    if (!window.confirm('Remove this booking from storage? This cannot be undone.')) return
    deleteLeadById(id)
    setExpandedId((prev) => (prev === id ? null : prev))
    setLeads(getAllLeads().filter((r) => r.type === 'consultation'))
    setContactedRev((r) => r + 1)
    setStatusRev((r) => r + 1)
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

  if (leads.length === 0) {
    return (
      <div className="flex min-h-[420px] flex-col items-center justify-center rounded-lg border border-brand-brass-pale/40 bg-white px-8 py-16 text-center shadow-sm">
        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-brand-ivory-deep text-brand-brass/50">
          <Inbox className="h-12 w-12" strokeWidth={1.25} aria-hidden />
        </div>
        <p className="mt-8 max-w-md font-body text-[15px] leading-relaxed text-brand-mist">
          No consultation bookings yet. Appointments from the website will appear here.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="font-display text-[26px] font-light text-brand-charcoal lg:text-[28px]">Consultations</h1>
          <p className="mt-1 font-body text-[14px] text-brand-mist">Appointments booked through the website</p>
        </div>
        <button type="button" onClick={handleExport} className={buttonClasses('primary', 'shrink-0 py-2.5 text-[11px]')}>
          Export CSV
        </button>
      </div>

      <div className="flex flex-col gap-4 rounded-lg border border-brand-brass-pale/35 bg-white p-4 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="inline-flex rounded-sm border border-brand-brass-pale/50 p-0.5">
            <button
              type="button"
              onClick={() => setView('table')}
              className={[
                'inline-flex items-center gap-2 rounded-sm px-3 py-2 font-body text-[12px] font-medium transition-colors',
                view === 'table' ? 'bg-brand-brass/20 text-brand-charcoal' : 'text-brand-mist hover:text-brand-charcoal',
              ].join(' ')}
            >
              <LayoutList className="h-4 w-4" aria-hidden />
              Table
            </button>
            <button
              type="button"
              onClick={() => setView('calendar')}
              className={[
                'inline-flex items-center gap-2 rounded-sm px-3 py-2 font-body text-[12px] font-medium transition-colors',
                view === 'calendar' ? 'bg-brand-brass/20 text-brand-charcoal' : 'text-brand-mist hover:text-brand-charcoal',
              ].join(' ')}
            >
              <CalendarDays className="h-4 w-4" aria-hidden />
              Week calendar
            </button>
          </div>
        </div>
        <div className="flex flex-col gap-4 lg:flex-row lg:flex-wrap lg:items-center lg:justify-between">
          <div className="flex flex-wrap gap-2">
            <span className="mr-1 self-center font-body text-[11px] font-semibold uppercase tracking-[0.1em] text-brand-mist">
              Date
            </span>
            {DATE_FILTER_IDS.map(({ id, label }) => (
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
      </div>

      {view === 'calendar' ? (
        <div className="space-y-4">
          <p className="font-body text-[12px] text-brand-mist">
            Week view uses preferred appointment dates. Search applies; submission date filters apply to the table only.
          </p>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => setWeekOffset((w) => w - 1)}
              className="inline-flex items-center gap-1 rounded-sm border border-brand-brass-pale/60 px-3 py-2 font-body text-[12px] text-brand-charcoal hover:border-brand-brass"
            >
              <ChevronLeft className="h-4 w-4" aria-hidden />
              Prev week
            </button>
            <button
              type="button"
              onClick={() => setWeekOffset(0)}
              className="rounded-sm border border-brand-brass-pale/60 px-3 py-2 font-body text-[12px] text-brand-mist hover:border-brand-brass hover:text-brand-charcoal"
            >
              This week
            </button>
            <button
              type="button"
              onClick={() => setWeekOffset((w) => w + 1)}
              className="inline-flex items-center gap-1 rounded-sm border border-brand-brass-pale/60 px-3 py-2 font-body text-[12px] text-brand-charcoal hover:border-brand-brass"
            >
              Next week
              <ChevronRight className="h-4 w-4" aria-hidden />
            </button>
          </div>
          <div className="overflow-x-auto rounded-lg border border-brand-brass-pale/35 bg-white p-4 shadow-sm">
            <div className="grid min-w-[720px] grid-cols-7 gap-2">
              {weekDays.map((d) => {
                const key = toYyyyMmDd(d)
                const items = calendarBuckets[key] || []
                return (
                  <div key={key} className="flex min-h-[180px] flex-col rounded-sm border border-brand-brass-pale/30 bg-brand-ivory-deep/30 p-2">
                    <p className="border-b border-brand-brass-pale/25 pb-2 font-body text-[11px] font-semibold uppercase tracking-[0.08em] text-brand-mist">
                      {formatShortWeekday(d)}
                    </p>
                    <p className="mt-1 font-body text-[13px] font-medium text-brand-charcoal">{formatDayMonth(d)}</p>
                    <ul className="mt-2 flex flex-1 flex-col gap-2 overflow-y-auto">
                      {items.map((row) => (
                        <li
                          key={row.id}
                          className="rounded-sm border border-brand-brass-pale/40 bg-white p-2 font-body text-[11px] leading-snug text-brand-charcoal shadow-sm"
                        >
                          <span className="font-medium">{displayName(row)}</span>
                          {row.timeSlot ? (
                            <span className="mt-1 block text-brand-mist">{row.timeSlot}</span>
                          ) : null}
                          {row.preferredCenter ? (
                            <span className="mt-0.5 block line-clamp-2 text-brand-mist">{row.preferredCenter}</span>
                          ) : null}
                        </li>
                      ))}
                    </ul>
                  </div>
                )
              })}
            </div>
          </div>
          {unscheduled.length > 0 ? (
            <div className="rounded-lg border border-amber-200/60 bg-amber-50/50 px-4 py-3 font-body text-[13px] text-brand-charcoal">
              <span className="font-semibold text-amber-900">No preferred date set ({unscheduled.length}): </span>
              {unscheduled.map((r) => displayName(r)).join(', ')}
            </div>
          ) : null}
        </div>
      ) : null}

      {view === 'table' ? (
        <>
          <div className="overflow-hidden rounded-lg border border-brand-brass-pale/35 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1100px] border-collapse text-left">
                <thead>
                  <tr className="border-b border-brand-brass-pale/40 bg-brand-ivory-deep/60">
                    <th className="px-3 py-3 font-body text-[10px] font-semibold uppercase tracking-[0.08em] text-brand-mist">
                      #
                    </th>
                    <th className="px-3 py-3 font-body text-[10px] font-semibold uppercase tracking-[0.08em] text-brand-mist">
                      Name
                    </th>
                    <th className="px-3 py-3 font-body text-[10px] font-semibold uppercase tracking-[0.08em] text-brand-mist">
                      Phone
                    </th>
                    <th className="px-3 py-3 font-body text-[10px] font-semibold uppercase tracking-[0.08em] text-brand-mist">
                      Email
                    </th>
                    <th className="px-3 py-3 font-body text-[10px] font-semibold uppercase tracking-[0.08em] text-brand-mist">
                      Preferred Date
                    </th>
                    <th className="px-3 py-3 font-body text-[10px] font-semibold uppercase tracking-[0.08em] text-brand-mist">
                      Time Slot
                    </th>
                    <th className="min-w-[120px] px-3 py-3 font-body text-[10px] font-semibold uppercase tracking-[0.08em] text-brand-mist">
                      Preferred Center
                    </th>
                    <th className="min-w-[120px] px-3 py-3 font-body text-[10px] font-semibold uppercase tracking-[0.08em] text-brand-mist">
                      Project Note
                    </th>
                    <th className="px-3 py-3 font-body text-[10px] font-semibold uppercase tracking-[0.08em] text-brand-mist">
                      Status
                    </th>
                    <th className="px-3 py-3 font-body text-[10px] font-semibold uppercase tracking-[0.08em] text-brand-mist">
                      Details
                    </th>
                    <th className="px-3 py-3 font-body text-[10px] font-semibold uppercase tracking-[0.08em] text-brand-mist">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {pageSlice.map((row, i) => {
                    const isExpanded = expandedId === row.id
                    const contacted = contactedIds.has(row.id)
                    const phone = displayPhone(row)
                    const num = globalIndexStart + i + 1
                    const st = getStatus(row.id)
                    const note = row.projectNote ?? row.note ?? ''

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
                          <td className="px-3 py-3 font-body text-[12px] tabular-nums text-brand-mist">{num}</td>
                          <td className="max-w-[120px] px-3 py-3">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="font-body text-[13px] text-brand-charcoal">{displayName(row)}</span>
                              {contacted ? (
                                <span className="inline-flex items-center rounded-full border border-green-200 bg-green-50 px-2 py-0.5 font-body text-[9px] font-semibold uppercase tracking-[0.06em] text-green-800">
                                  Contacted
                                </span>
                              ) : null}
                            </div>
                          </td>
                          <td className="whitespace-nowrap px-3 py-3 font-body text-[12px] text-brand-charcoal">{phone}</td>
                          <td className="max-w-[160px] truncate px-3 py-3 font-body text-[12px] text-brand-mist" title={displayEmail(row)}>
                            {displayEmail(row)}
                          </td>
                          <td className="whitespace-nowrap px-3 py-3 font-body text-[12px] text-brand-charcoal">
                            {row.preferredDate ? String(row.preferredDate) : '—'}
                          </td>
                          <td className="max-w-[120px] px-3 py-3 font-body text-[12px] text-brand-charcoal">
                            {row.timeSlot ? String(row.timeSlot) : '—'}
                          </td>
                          <td className="max-w-[140px] px-3 py-3 font-body text-[12px] leading-snug text-brand-charcoal">
                            {row.preferredCenter ? String(row.preferredCenter) : '—'}
                          </td>
                          <td className="max-w-[160px] px-3 py-3 font-body text-[12px] text-brand-mist" title={note ? String(note) : ''}>
                            {truncateText(note, 56)}
                          </td>
                          <td className="px-3 py-3">
                            <button
                              type="button"
                              onClick={(e) => handleStatusClick(e, row.id)}
                              className={[
                                'rounded-full border px-2.5 py-1 font-body text-[10px] font-semibold uppercase tracking-[0.06em] transition-opacity hover:opacity-90',
                                STATUS_CLASS[st] || STATUS_CLASS.pending,
                              ].join(' ')}
                            >
                              {STATUS_LABEL[st] || STATUS_LABEL.pending}
                            </button>
                          </td>
                          <td className="px-3 py-3 font-body text-[11px] text-brand-brass">
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
                          <td className="px-3 py-3">
                            <div className="flex flex-wrap items-center gap-2">
                              {!contacted ? (
                                <button
                                  type="button"
                                  onClick={(e) => handleMarkContacted(e, row.id)}
                                  className="inline-flex items-center gap-1 rounded-sm border border-green-200 bg-green-50 px-2 py-1 font-body text-[10px] font-medium text-green-800 transition-colors hover:bg-green-100"
                                >
                                  <UserCheck className="h-3 w-3 shrink-0" aria-hidden />
                                  <span className="whitespace-nowrap">Mark as Contacted</span>
                                </button>
                              ) : null}
                              <button
                                type="button"
                                onClick={(e) => handleCopyPhone(e, phone)}
                                className="inline-flex items-center gap-1 rounded-sm border border-brand-brass-pale/50 px-2 py-1 font-body text-[10px] text-brand-charcoal transition-colors hover:border-brand-brass"
                              >
                                <Phone className="h-3 w-3 shrink-0" aria-hidden />
                                Copy Phone
                              </button>
                              <button
                                type="button"
                                onClick={(e) => handleDelete(e, row.id)}
                                className="inline-flex items-center gap-1 rounded-sm border border-red-200 bg-red-50 px-2 py-1 font-body text-[10px] text-red-800 transition-colors hover:bg-red-100"
                              >
                                <Trash2 className="h-3 w-3 shrink-0" aria-hidden />
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                        {isExpanded ? (
                          <tr className="bg-brand-ivory-deep/30">
                            <td colSpan={11} className="px-4 py-6">
                              <div className="rounded-sm border border-brand-brass-pale/40 bg-white p-6">
                                <p className="font-body text-[11px] font-semibold uppercase tracking-[0.12em] text-brand-brass">
                                  Full booking details
                                </p>
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
              No consultations match your filters. Try adjusting search or date range.
            </p>
          ) : (
            <div className="flex flex-col items-center justify-between gap-4 border-t border-brand-brass-pale/30 pt-4 sm:flex-row">
              <p className="font-body text-[13px] text-brand-mist">
                Showing {globalIndexStart + 1}–{Math.min(globalIndexStart + pageSlice.length, filtered.length)} of {filtered.length}
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
        </>
      ) : null}

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
