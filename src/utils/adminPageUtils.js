export const DATE_FILTER_IDS = [
  { id: 'today', label: 'Today' },
  { id: 'week', label: 'This Week' },
  { id: 'month', label: 'This Month' },
  { id: 'all', label: 'All Time' },
]

export function displayName(row) {
  const n = row.fullName ?? row.name
  return n && String(n).trim() ? String(n).trim() : '—'
}

export function displayEmail(row) {
  const e = row.email
  return e && String(e).trim() ? String(e).trim() : '—'
}

export function displayPhone(row) {
  const p = row.phone
  return p && String(p).trim() ? String(p).trim() : '—'
}

export function formatFieldLabel(key) {
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

export function startOfWeekMonday(d) {
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

export function matchesDateFilter(row, dateFilterId) {
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

export function digitsOnly(s) {
  return String(s || '').replace(/\D/g, '')
}

export function matchesSearch(row, q) {
  const raw = q.trim().toLowerCase()
  if (!raw) return true
  const name = displayName(row).toLowerCase()
  const phoneDigits = digitsOnly(displayPhone(row))
  const searchDigits = digitsOnly(raw)
  if (searchDigits.length > 0 && phoneDigits.includes(searchDigits)) return true
  if (name.includes(raw)) return true
  return false
}

export function formatTableDateTime(iso) {
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

export function sortedEntries(record) {
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

export function truncateText(s, max = 48) {
  const t = String(s ?? '').trim()
  if (!t) return '—'
  return t.length <= max ? t : `${t.slice(0, max)}…`
}

export function addDays(date, days) {
  const d = new Date(date)
  d.setDate(d.getDate() + days)
  return d
}

export function toYyyyMmDd(d) {
  const x = new Date(d)
  const y = x.getFullYear()
  const m = String(x.getMonth() + 1).padStart(2, '0')
  const day = String(x.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export function formatShortWeekday(d) {
  return new Date(d).toLocaleDateString('en-IN', { weekday: 'short' })
}

export function formatDayMonth(d) {
  return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
}
