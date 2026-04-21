/** localStorage key for all admin-captured leads */
export const ADMIN_LEADS_STORAGE_KEY = 'maywood_admin_leads_v1'
const STORAGE_KEY = ADMIN_LEADS_STORAGE_KEY

function makeId() {
  return `${Date.now()}-${String(Math.floor(1000 + Math.random() * 9000)).slice(-4)}`
}

function loadRecords() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function persistRecords(records) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(records))
}

function appendRecord(record) {
  const next = [...loadRecords(), record]
  persistRecords(next)
  return record
}

/**
 * @param {object} data — instant quote completion payload
 */
export function saveQuoteRequest(data) {
  const timestamp = new Date().toISOString()
  return appendRecord({
    id: makeId(),
    type: 'quote',
    sourcePage: 'instant-quote',
    timestamp,
    ...data,
  })
}

/**
 * @param {object} data — consultation modal fields
 */
export function saveConsultationBooking(data) {
  const timestamp = new Date().toISOString()
  return appendRecord({
    id: makeId(),
    type: 'consultation',
    sourcePage: 'consultation-modal',
    timestamp,
    ...data,
  })
}

/**
 * @param {object} data — partner form fields + sourcePage: 'partner-form'
 */
export function savePartnerApplication(data) {
  const timestamp = new Date().toISOString()
  return appendRecord({
    id: makeId(),
    type: 'partner',
    sourcePage: 'partner-form',
    timestamp,
    ...data,
  })
}

/**
 * @param {object} data — name, phone, email, source: 'finance-page' | 'homepage-calculator'
 */
export function saveCalculatorLead(data) {
  const timestamp = new Date().toISOString()
  const sourcePage =
    data.source === 'finance-page'
      ? 'finance-calculator'
      : data.source === 'homepage-calculator'
        ? 'homepage-calculator'
        : 'calculator'
  return appendRecord({
    id: makeId(),
    type: 'calculator',
    sourcePage,
    timestamp,
    ...data,
  })
}

export function getAllLeads() {
  return loadRecords().sort((a, b) => String(b.timestamp).localeCompare(String(a.timestamp)))
}

/** Persisted set of lead IDs marked as contacted (admin UI). */
export const ADMIN_CONTACTED_IDS_KEY = 'maywood_admin_contacted_leads_v1'

export function getContactedLeadIds() {
  try {
    const raw = localStorage.getItem(ADMIN_CONTACTED_IDS_KEY)
    if (!raw) return new Set()
    const parsed = JSON.parse(raw)
    return new Set(Array.isArray(parsed) ? parsed : [])
  } catch {
    return new Set()
  }
}

function persistContactedIds(set) {
  localStorage.setItem(ADMIN_CONTACTED_IDS_KEY, JSON.stringify([...set]))
}

export function markLeadContacted(id) {
  const next = getContactedLeadIds()
  next.add(id)
  persistContactedIds(next)
}

export function deleteLeadById(id) {
  const records = loadRecords().filter((r) => r.id !== id)
  persistRecords(records)
  const contacted = getContactedLeadIds()
  contacted.delete(id)
  persistContactedIds(contacted)
  removeConsultationStatus(id)
  removePartnerStatus(id)
}

/** Consultation workflow status (admin UI), keyed by lead id. */
export const ADMIN_CONSULTATION_STATUS_KEY = 'maywood_admin_consultation_status_v1'

const CONSULTATION_ORDER = ['pending', 'confirmed', 'completed']

function loadConsultationStatuses() {
  try {
    const raw = localStorage.getItem(ADMIN_CONSULTATION_STATUS_KEY)
    if (!raw) return {}
    const o = JSON.parse(raw)
    return typeof o === 'object' && o !== null && !Array.isArray(o) ? o : {}
  } catch {
    return {}
  }
}

function persistConsultationStatuses(map) {
  localStorage.setItem(ADMIN_CONSULTATION_STATUS_KEY, JSON.stringify(map))
}

function removeConsultationStatus(id) {
  const m = loadConsultationStatuses()
  if (m[id] === undefined) return
  delete m[id]
  persistConsultationStatuses(m)
}

export function getConsultationStatusForId(id) {
  const s = loadConsultationStatuses()[id]
  return CONSULTATION_ORDER.includes(s) ? s : 'pending'
}

export function cycleConsultationStatus(id) {
  const m = loadConsultationStatuses()
  const cur = getConsultationStatusForId(id)
  const idx = CONSULTATION_ORDER.indexOf(cur)
  const next = CONSULTATION_ORDER[(idx + 1) % CONSULTATION_ORDER.length]
  m[id] = next
  persistConsultationStatuses(m)
  return next
}

/** Partner application status (admin UI), keyed by lead id. */
export const ADMIN_PARTNER_STATUS_KEY = 'maywood_admin_partner_status_v1'

const PARTNER_ORDER = ['new', 'reviewing', 'approved', 'rejected']

function loadPartnerStatuses() {
  try {
    const raw = localStorage.getItem(ADMIN_PARTNER_STATUS_KEY)
    if (!raw) return {}
    const o = JSON.parse(raw)
    return typeof o === 'object' && o !== null && !Array.isArray(o) ? o : {}
  } catch {
    return {}
  }
}

function persistPartnerStatuses(map) {
  localStorage.setItem(ADMIN_PARTNER_STATUS_KEY, JSON.stringify(map))
}

function removePartnerStatus(id) {
  const m = loadPartnerStatuses()
  if (m[id] === undefined) return
  delete m[id]
  persistPartnerStatuses(m)
}

export function getPartnerStatusForId(id) {
  const s = loadPartnerStatuses()[id]
  return PARTNER_ORDER.includes(s) ? s : 'new'
}

export function cyclePartnerStatus(id) {
  const m = loadPartnerStatuses()
  const cur = getPartnerStatusForId(id)
  const idx = PARTNER_ORDER.indexOf(cur)
  const next = PARTNER_ORDER[(idx + 1) % PARTNER_ORDER.length]
  m[id] = next
  persistPartnerStatuses(m)
  return next
}

/**
 * Convert array of objects to CSV and trigger browser download.
 * @param {object[]} rows
 * @param {string} [filename]
 */
export function exportToCSV(rows, filename = 'maywood-leads.csv') {
  if (!rows?.length) {
    const blob = new Blob(['No data'], { type: 'text/csv;charset=utf-8;' })
    triggerDownload(blob, filename)
    return
  }
  const keys = [...new Set(rows.flatMap((r) => Object.keys(r)))]
  const escape = (v) => {
    const s = v == null ? '' : String(v)
    if (/[",\n\r]/.test(s)) return `"${s.replace(/"/g, '""')}"`
    return s
  }
  const header = keys.map(escape).join(',')
  const lines = rows.map((row) => keys.map((k) => escape(row[k])).join(','))
  const csv = [header, ...lines].join('\r\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  triggerDownload(blob, filename)
}

function triggerDownload(blob, filename) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.rel = 'noopener'
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

/** Removes all captured leads and related admin workflow state. */
export function clearAllCapturedLeads() {
  persistRecords([])
  persistContactedIds(new Set())
  try {
    localStorage.removeItem(ADMIN_CONSULTATION_STATUS_KEY)
    localStorage.removeItem(ADMIN_PARTNER_STATUS_KEY)
  } catch {
    /* ignore */
  }
}
