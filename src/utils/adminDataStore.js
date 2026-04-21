import { supabase } from './supabaseClient'

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
  return {
    id: r.id,
    type: 'quote',
    table: TABLE.quote,
    timestamp: r.created_at,
    sourcePage: r.source || 'instant-quote',
    name: r.name,
    phone: r.phone,
    email: r.email,
    propertyType: r.property_type,
    scope: r.scope,
    area: r.area,
    areaUnit: r.area_unit,
    location: r.location,
    estimateLow: r.estimate_low,
    estimateHigh: r.estimate_high,
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
  return {
    id: r.id,
    type: 'partner',
    table: TABLE.partner,
    timestamp: r.created_at,
    sourcePage: 'partner-form',
    name: r.name,
    fullName: r.name,
    company: r.company,
    partnerType: r.partner_type,
    phone: r.phone,
    email: r.email,
    city: r.city,
    about: r.about,
    partnerStatus: PARTNER_ORDER.includes(r.status) ? r.status : 'new',
    contacted: Boolean(r.contacted),
  }
}

export async function getAllLeads() {
  const [quotes, consultations, calculators, partners] = await Promise.all([
    supabase.from('quote_requests').select('*').order('created_at', { ascending: false }),
    supabase.from('consultation_bookings').select('*').order('created_at', { ascending: false }),
    supabase.from('calculator_leads').select('*').order('created_at', { ascending: false }),
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
  const row = {
    name: data.name,
    phone: data.phone,
    email: data.email,
    property_type: data.propertyType,
    scope: data.scope,
    area: data.area,
    area_unit: data.areaUnit,
    location: data.location,
    estimate_low: data.estimateLow,
    estimate_high: data.estimateHigh,
    source: data.source || 'instant-quote',
    contacted: false,
  }
  const { error } = await supabase.from('quote_requests').insert([row])
  if (error) {
    console.error('Quote save error:', error)
    throw error
  }
  notifyLeadsChanged()
}

export async function saveConsultationBooking(data) {
  const row = {
    name: data.name,
    phone: data.phone,
    email: data.email,
    preferred_date: data.preferredDate,
    time_slot: data.timeSlot,
    preferred_center: data.preferredCenter,
    project_note: data.projectNote,
    status: 'pending',
    source: 'consultation-modal',
    contacted: false,
  }
  const { error } = await supabase.from('consultation_bookings').insert([row])
  if (error) {
    console.error('Consultation save error:', error)
    throw error
  }
  notifyLeadsChanged()
}

export async function saveCalculatorLead(data) {
  const dbSource =
    data.source === 'finance-page'
      ? 'finance-calculator'
      : data.source === 'homepage-calculator'
        ? 'homepage-calculator'
        : data.source || 'calculator'
  const row = {
    name: data.name,
    phone: data.phone,
    email: data.email,
    source: dbSource,
    contacted: false,
  }
  const { error } = await supabase.from('calculator_leads').insert([row])
  if (error) {
    console.error('Calculator lead save error:', error)
    throw error
  }
  notifyLeadsChanged()
}

export async function savePartnerApplication(data) {
  const row = {
    name: data.fullName ?? data.name,
    company: data.company,
    partner_type: data.partnerType,
    phone: data.phone,
    email: data.email,
    city: data.city,
    about: data.about,
    status: 'new',
    contacted: false,
  }
  const { error } = await supabase.from('partner_applications').insert([row])
  if (error) {
    console.error('Partner save error:', error)
    throw error
  }
  notifyLeadsChanged()
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
