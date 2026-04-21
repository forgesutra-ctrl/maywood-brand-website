import { supabase } from './supabaseClient'

function logSupabaseError(context, error) {
  console.error(`[Maywood] SUPABASE ERROR ${context}:`, error?.message, error?.details, error?.hint, error?.code)
}

/** Smoke test: env vars + read on quote_requests (validates URL, key, RLS SELECT). */
export async function testSupabaseConnection() {
  const url = import.meta.env.VITE_SUPABASE_URL
  const key = import.meta.env.VITE_SUPABASE_ANON_KEY
  console.log('[Maywood] Testing Supabase connection...')
  console.log('[Maywood] VITE_SUPABASE_URL:', url || undefined)
  console.log('[Maywood] VITE_SUPABASE_ANON_KEY set:', Boolean(key))
  if (!url || !key) {
    console.error(
      '[Maywood] Missing Supabase env vars. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in Vercel → Settings → Environment Variables for all environments, then redeploy.',
    )
    return false
  }
  const { data, error } = await supabase.from('quote_requests').select('id').limit(1)
  if (error) {
    logSupabaseError('(read quote_requests)', error)
    return false
  }
  console.log('[Maywood] Supabase connection OK (quote_requests readable). Sample:', data)
  return true
}

function parseAreaSqftForDb(data) {
  if (data.area == null || String(data.area).trim() === '') return null
  const n = Number(String(data.area).replace(/,/g, ''))
  return Number.isFinite(n) ? n : null
}

function buildQuoteInsertRow(data) {
  const project_scope = Array.isArray(data.scope) ? data.scope.map((s) => String(s)) : []
  const low = data.estimateLow != null ? Number(data.estimateLow) : null
  const high = data.estimateHigh != null ? Number(data.estimateHigh) : null
  return {
    full_name: data.name != null ? String(data.name) : null,
    phone: data.phone != null ? String(data.phone) : null,
    email: data.email != null ? String(data.email) : null,
    property_type: data.propertyType != null ? String(data.propertyType) : null,
    project_scope,
    area_sqft: parseAreaSqftForDb(data),
    area_unit: data.areaUnit != null ? String(data.areaUnit) : null,
    location: data.location != null ? String(data.location) : null,
    estimate_low: Number.isFinite(low) ? low : null,
    estimate_high: Number.isFinite(high) ? high : null,
    source: data.source != null && String(data.source).trim() !== '' ? String(data.source) : 'instant-quote',
    status: 'new',
  }
}

/** Dispatched after lead mutations so open admin tabs can refetch (same-tab + custom event). */
export const LEADS_UPDATED_EVENT = 'maywood-leads-updated'

/** @deprecated Use LEADS_UPDATED_EVENT — kept briefly for grep; no localStorage key anymore. */
export const ADMIN_LEADS_STORAGE_KEY = LEADS_UPDATED_EVENT

export function notifyLeadsChanged() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(LEADS_UPDATED_EVENT))
  }
}

export const TABLE = {
  quote: 'quote_requests',
  consultation: 'consultation_bookings',
  calculator: 'calculator_leads',
  partner: 'partner_applications',
}

const CONSULTATION_ORDER = ['pending', 'confirmed', 'completed']
const PARTNER_ORDER = ['new', 'reviewing', 'approved', 'rejected']

function mapCalculatorSourceToPage(source) {
  if (source === 'finance-page' || source === 'finance-calculator') return 'finance-calculator'
  if (source === 'homepage-calculator') return 'homepage-calculator'
  return source || 'calculator'
}

function normalizeQuote(r) {
  const full_name = r.full_name ?? r.name
  const project_scope = r.project_scope ?? r.scope
  const area_sqft = r.area_sqft ?? r.area
  return {
    id: r.id,
    type: 'quote',
    table: TABLE.quote,
    timestamp: r.created_at,
    sourcePage: r.source || 'instant-quote',
    full_name,
    project_scope,
    area_sqft,
    name: full_name,
    phone: r.phone,
    email: r.email,
    propertyType: r.property_type,
    scope: project_scope,
    area: area_sqft,
    areaUnit: r.area_unit,
    location: r.location,
    estimateLow: r.estimate_low,
    estimateHigh: r.estimate_high,
    quoteStatus: r.status ?? 'new',
    contacted: Boolean(r.contacted),
  }
}

function normalizeConsultation(r) {
  return {
    id: r.id,
    type: 'consultation',
    table: TABLE.consultation,
    timestamp: r.created_at,
    sourcePage: r.source || 'consultation-modal',
    name: r.name,
    phone: r.phone,
    email: r.email,
    preferredDate: r.preferred_date,
    timeSlot: r.time_slot,
    preferredCenter: r.preferred_center,
    projectNote: r.project_note,
    consultationStatus: CONSULTATION_ORDER.includes(r.status) ? r.status : 'pending',
    contacted: Boolean(r.contacted),
  }
}

function normalizeCalculator(r) {
  const src = r.source || ''
  return {
    id: r.id,
    type: 'calculator',
    table: TABLE.calculator,
    timestamp: r.created_at,
    sourcePage: mapCalculatorSourceToPage(src),
    name: r.name,
    phone: r.phone,
    email: r.email,
    source: src,
    contacted: Boolean(r.contacted),
  }
}

function normalizePartner(r) {
  const full_name = r.full_name ?? r.name
  const company_name = r.company_name ?? r.company
  const business_description = r.business_description ?? r.about
  return {
    id: r.id,
    type: 'partner',
    table: TABLE.partner,
    timestamp: r.created_at,
    sourcePage: 'partner-form',
    full_name,
    company_name,
    business_description,
    name: full_name,
    fullName: full_name,
    company: company_name,
    partnerType: r.partner_type,
    phone: r.phone,
    email: r.email,
    city: r.city,
    about: business_description,
    partnerStatus: PARTNER_ORDER.includes(r.status) ? r.status : 'new',
    contacted: Boolean(r.contacted),
  }
}

/**
 * @param {{ excludeCalculatorConnectionTest?: boolean }} [options]
 */
export async function getAllLeads(options = {}) {
  const { excludeCalculatorConnectionTest = false } = options
  const calculatorQuery = (() => {
    let q = supabase.from('calculator_leads').select('*').order('created_at', { ascending: false })
    if (excludeCalculatorConnectionTest) q = q.neq('name', 'CONNECTION_TEST')
    return q
  })()
  const [quotes, consultations, calculators, partners] = await Promise.all([
    supabase.from('quote_requests').select('*').order('created_at', { ascending: false }),
    supabase.from('consultation_bookings').select('*').order('created_at', { ascending: false }),
    calculatorQuery,
    supabase.from('partner_applications').select('*').order('created_at', { ascending: false }),
  ])
  if (quotes.error) console.error('quote_requests:', quotes.error)
  if (consultations.error) console.error('consultation_bookings:', consultations.error)
  if (calculators.error) console.error('calculator_leads:', calculators.error)
  if (partners.error) console.error('partner_applications:', partners.error)

  return [
    ...(quotes.data || []).map(normalizeQuote),
    ...(consultations.data || []).map(normalizeConsultation),
    ...(calculators.data || []).map(normalizeCalculator),
    ...(partners.data || []).map(normalizePartner),
  ].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
}

export async function saveQuoteRequest(data) {
  const row = buildQuoteInsertRow(data)
  console.log('[Maywood] Attempting to save quote request:', row)
  const { data: result, error } = await supabase.from('quote_requests').insert([row]).select()
  if (error) {
    logSupabaseError('saving quote', error)
    throw error
  }
  console.log('[Maywood] Quote saved successfully:', result)
  notifyLeadsChanged()
  return { success: true, data: result }
}

export async function saveConsultationBooking(data) {
  const row = {
    name: data.name != null ? String(data.name) : null,
    phone: data.phone != null ? String(data.phone) : null,
    email: data.email != null ? String(data.email) : null,
    preferred_date: data.preferredDate != null ? String(data.preferredDate) : null,
    time_slot: data.timeSlot != null ? String(data.timeSlot) : null,
    preferred_center: data.preferredCenter != null ? String(data.preferredCenter) : null,
    project_note: data.projectNote != null ? String(data.projectNote) : null,
    source: 'consultation-modal',
  }
  console.log('[Maywood] Attempting to save consultation booking:', row)
  const { data: result, error } = await supabase.from('consultation_bookings').insert([row]).select()
  if (error) {
    logSupabaseError('saving consultation', error)
    throw error
  }
  console.log('[Maywood] Consultation saved successfully:', result)
  notifyLeadsChanged()
  return { success: true, data: result }
}

export async function saveCalculatorLead(data) {
  const dbSource =
    data.source === 'finance-page'
      ? 'finance-calculator'
      : data.source === 'homepage-calculator'
        ? 'homepage-calculator'
        : data.source != null && String(data.source).trim() !== ''
          ? String(data.source)
          : 'calculator'
  const row = {
    name: data.name != null ? String(data.name) : null,
    phone: data.phone != null ? String(data.phone) : null,
    email: data.email != null ? String(data.email) : null,
    source: dbSource,
  }
  console.log('[Maywood] Attempting to save calculator lead:', row)
  const { data: result, error } = await supabase.from('calculator_leads').insert([row]).select()
  if (error) {
    logSupabaseError('saving calculator lead', error)
    throw error
  }
  console.log('[Maywood] Calculator lead saved successfully:', result)
  notifyLeadsChanged()
  return { success: true, data: result }
}

export async function savePartnerApplication(data) {
  const row = {
    full_name: String(data.fullName ?? data.name ?? '').trim() || null,
    company_name: data.company != null ? String(data.company) : null,
    business_description: data.about != null ? String(data.about) : null,
    partner_type: data.partnerType != null ? String(data.partnerType) : null,
    phone: data.phone != null ? String(data.phone) : null,
    email: data.email != null ? String(data.email) : null,
    city: data.city != null ? String(data.city) : null,
  }
  console.log('[Maywood] Attempting to save partner application:', row)
  const { data: result, error } = await supabase.from('partner_applications').insert([row]).select()
  if (error) {
    logSupabaseError('saving partner application', error)
    throw error
  }
  console.log('[Maywood] Partner application saved successfully:', result)
  notifyLeadsChanged()
  return { success: true, data: result }
}

export async function updateLeadStatus(table, id, updates) {
  const { error } = await supabase.from(table).update(updates).eq('id', id)
  if (error) console.error('Update error:', error)
  else notifyLeadsChanged()
}

export async function deleteLead(table, id) {
  const { error } = await supabase.from(table).delete().eq('id', id)
  if (error) console.error('Delete error:', error)
  else notifyLeadsChanged()
}

export async function markLeadContacted(table, id) {
  await updateLeadStatus(table, id, { contacted: true })
}

export async function cycleConsultationStatus(row) {
  const cur = row.consultationStatus || 'pending'
  const idx = CONSULTATION_ORDER.indexOf(cur)
  const next = CONSULTATION_ORDER[(idx + 1) % CONSULTATION_ORDER.length]
  await updateLeadStatus(TABLE.consultation, row.id, { status: next })
  return next
}

export async function cyclePartnerStatus(row) {
  const cur = row.partnerStatus || 'new'
  const idx = PARTNER_ORDER.indexOf(cur)
  const next = PARTNER_ORDER[(idx + 1) % PARTNER_ORDER.length]
  await updateLeadStatus(TABLE.partner, row.id, { status: next })
  return next
}

/** Delete all rows in lead tables (not portfolio). */
export async function clearAllCapturedLeads() {
  const cutoff = '1970-01-01T00:00:00.000Z'
  for (const t of [TABLE.quote, TABLE.consultation, TABLE.calculator, TABLE.partner]) {
    const { error } = await supabase.from(t).delete().gte('created_at', cutoff)
    if (error) console.error('clearAllCapturedLeads', t, error)
  }
  notifyLeadsChanged()
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
