import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Loader2 } from 'lucide-react'
import ConsultationBookingModal from '../components/ConsultationBookingModal'
import SectionLabel from '../components/ui/SectionLabel'
import { supabase } from '../lib/supabase'

const PROPERTY_TYPES = ['Residential', 'Commercial', 'Retail']

const SCOPE_BY_PROPERTY = {
  Residential: [
    'Full interiors',
    'Modular Kitchen',
    'Wardrobes & Storage',
    'Living & Dining',
    'Bedrooms',
    'Home Office',
    'Pooja / Puja Room',
    'Bathrooms',
  ],
  Commercial: [
    'Full office fit-out',
    'Open Workstations',
    'Cabin & Conference Rooms',
    'Reception & Lobby',
    'Breakout & Café Areas',
    'IT & Server Rooms',
    'Washrooms',
  ],
  Retail: [
    'Full store fit-out',
    'Storefront & Façade',
    'Display Fixtures',
    'Trial Rooms',
    'Checkout & POS Area',
    'Storage & Back Office',
    'Signage Integration',
  ],
}

const BUDGET_BY_PROPERTY = {
  Residential: [
    'Under ₹5 Lakhs',
    '₹5L – ₹10L',
    '₹10L – ₹20L',
    '₹20L – ₹35L',
    '₹35L – ₹50L',
    'Above ₹50L',
  ],
  Commercial: [
    'Under ₹10 Lakhs',
    '₹10L – ₹25L',
    '₹25L – ₹50L',
    '₹50L – ₹1 Cr',
    'Above ₹1 Cr',
  ],
  Retail: [
    'Under ₹5 Lakhs',
    '₹5L – ₹15L',
    '₹15L – ₹30L',
    '₹30L – ₹50L',
    'Above ₹50L',
  ],
}

const AREA_PLACEHOLDER_BY_PROPERTY = {
  Residential: 'e.g. 1200 sq ft',
  Commercial: 'e.g. 5000 sq ft',
  Retail: 'e.g. 800 sq ft',
}

/** Indicative Bangalore market rates: per sq ft, lump sum, or per room */
const SCOPE_RATES_BY_PROPERTY = {
  Residential: {
    'Full interiors': { kind: 'sqft', min: 1200, max: 1800 },
    'Modular Kitchen': { kind: 'flat', min: 150_000, max: 350_000 },
    'Wardrobes & Storage': { kind: 'flat', min: 60_000, max: 150_000 },
    'Living & Dining': { kind: 'flat', min: 80_000, max: 180_000 },
    Bedrooms: { kind: 'perRoom', min: 70_000, max: 150_000, rooms: 1 },
    'Home Office': { kind: 'flat', min: 50_000, max: 120_000 },
    'Pooja / Puja Room': { kind: 'flat', min: 40_000, max: 90_000 },
  },
  Commercial: {
    'Full office fit-out': { kind: 'sqft', min: 1500, max: 2200 },
    'Open Workstations': { kind: 'sqft', min: 900, max: 1400 },
    'Cabin & Conference Rooms': { kind: 'sqft', min: 1200, max: 2000 },
    'Reception & Lobby': { kind: 'sqft', min: 1000, max: 1800 },
  },
  Retail: {
    'Full store fit-out': { kind: 'sqft', min: 1200, max: 2000 },
    'Storefront & Façade': { kind: 'sqft', min: 800, max: 1500 },
    'Display Fixtures': { kind: 'sqft', min: 600, max: 1200 },
  },
}

const ESTIMATE_DISCLAIMER =
  'Estimates are indicative and based on mid-range Bangalore market rates for 2025-26. Final pricing shared after site visit and scope confirmation.'

function parseAreaSqft(raw) {
  const cleaned = String(raw ?? '')
    .replace(/,/g, '')
    .match(/[\d.]+/)
  if (!cleaned) return null
  const n = parseFloat(cleaned[0])
  return Number.isFinite(n) && n > 0 ? n : null
}

function formatInr(n) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(Math.round(n))
}

function computeLiveEstimate(propertyType, projectScope, areaSqft) {
  const area = parseAreaSqft(areaSqft)
  const table = SCOPE_RATES_BY_PROPERTY[propertyType] || {}
  const unpriced = projectScope.filter((label) => !table[label])
  const breakdown = []
  let sumSqftMin = 0
  let sumSqftMax = 0
  let flatMin = 0
  let flatMax = 0

  for (const label of projectScope) {
    const rate = table[label]
    if (!rate) continue
    if (rate.kind === 'flat') {
      flatMin += rate.min
      flatMax += rate.max
      breakdown.push({
        label,
        detail: `${formatInr(rate.min)} – ${formatInr(rate.max)} (lump sum)`,
        min: rate.min,
        max: rate.max,
      })
    } else if (rate.kind === 'perRoom') {
      const rooms = rate.rooms ?? 1
      const cMin = rate.min * rooms
      const cMax = rate.max * rooms
      flatMin += cMin
      flatMax += cMax
      breakdown.push({
        label,
        detail: `${formatInr(rate.min)} – ${formatInr(rate.max)}/room × ${rooms} → ${formatInr(cMin)} – ${formatInr(cMax)}`,
        min: cMin,
        max: cMax,
      })
    } else {
      sumSqftMin += rate.min
      sumSqftMax += rate.max
      if (area) {
        const cMin = rate.min * area
        const cMax = rate.max * area
        breakdown.push({
          label,
          detail: `${formatInr(rate.min)} – ${formatInr(rate.max)}/sq ft → ${formatInr(cMin)} – ${formatInr(cMax)}`,
          min: cMin,
          max: cMax,
        })
      } else {
        breakdown.push({
          label,
          detail: `${formatInr(rate.min)} – ${formatInr(rate.max)}/sq ft`,
          min: null,
          max: null,
        })
      }
    }
  }

  if (!area) {
    return {
      area: null,
      unpriced,
      breakdown,
      totalMin: null,
      totalMax: null,
      hasSqftScopes: sumSqftMin > 0,
    }
  }

  const totalMin = flatMin + sumSqftMin * area
  const totalMax = flatMax + sumSqftMax * area

  return {
    area,
    unpriced,
    breakdown,
    totalMin,
    totalMax,
    hasSqftScopes: sumSqftMin > 0,
  }
}

const initialForm = {
  propertyType: 'Residential',
  projectScope: [],
  areaSqft: '',
  budgetRange: '',
  location: '',
  fullName: '',
  phone: '',
  email: '',
}

export default function InstantQuote() {
  const [form, setForm] = useState(initialForm)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [success, setSuccess] = useState(false)
  const [consultationModalOpen, setConsultationModalOpen] = useState(false)
  const [consultationModalKey, setConsultationModalKey] = useState(0)

  const openConsultationModal = () => {
    setConsultationModalKey((k) => k + 1)
    setConsultationModalOpen(true)
  }

  const liveEstimate = useMemo(
    () => computeLiveEstimate(form.propertyType, form.projectScope, form.areaSqft),
    [form.propertyType, form.projectScope, form.areaSqft],
  )

  const showEstimatePanel = form.projectScope.length > 0

  const toggleScope = (label) => {
    setForm((prev) => ({
      ...prev,
      projectScope: prev.projectScope.includes(label)
        ? prev.projectScope.filter((s) => s !== label)
        : [...prev.projectScope, label],
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitError('')

    try {
      setIsSubmitting(true)

      const { error } = await supabase.from('quote_requests').insert({
        property_type: form.propertyType,
        project_scope: form.projectScope.length ? form.projectScope : [],
        area_sqft: form.areaSqft.trim(),
        budget_range: form.budgetRange,
        location: form.location.trim(),
        full_name: form.fullName.trim(),
        phone: form.phone.trim(),
        email: form.email.trim(),
      })

      if (error) throw error

      setSuccess(true)
      setForm(initialForm)
    } catch {
      setSubmitError('Something went wrong. Please try again or call us directly.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (success) {
    return (
      <main className="flex-1 bg-brand-ivory px-6 py-16 lg:px-24 lg:py-24">
        <div className="mx-auto max-w-lg rounded-sm border border-brand-brass-pale bg-brand-ivory-deep px-10 py-14 text-center shadow-[0_24px_48px_-24px_rgba(28,25,21,0.12)]">
          <p className="font-display text-[36px] font-light leading-tight text-brand-charcoal">Thank you</p>
          <p className="mt-4 font-body text-[15px] font-normal leading-relaxed text-brand-mist">
            We&apos;ve received your request. A Maywood specialist will contact you within 24 hours with next steps.
          </p>
          <Link
            to="/"
            className="mt-10 inline-flex border-b border-brand-brass pb-0.5 font-body text-[12px] font-semibold uppercase tracking-[0.14em] text-brand-brass transition-colors hover:text-brand-charcoal"
          >
            Back to home
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="flex-1 bg-brand-ivory px-6 py-16 lg:px-24 lg:py-20">
      <div className="mx-auto max-w-[720px]">
        <SectionLabel>Instant Quote</SectionLabel>
        <h1 className="mt-4 font-display text-[clamp(38px,5vw,52px)] font-light leading-[1.06] text-brand-charcoal">
          Tell us about your project
        </h1>
        <p className="mt-4 max-w-xl font-body text-[15px] font-normal leading-relaxed text-brand-mist">
          Share a few details — we&apos;ll prepare a tailored estimate. No obligation.
        </p>

        <form onSubmit={handleSubmit} className="mt-12 space-y-10">
          <fieldset className="space-y-3">
            <legend className="font-body text-[11px] font-semibold uppercase tracking-[0.16em] text-brand-brass">
              Property type
            </legend>
            <div className="flex flex-wrap gap-3">
              {PROPERTY_TYPES.map((type) => (
                <label
                  key={type}
                  className={[
                    'cursor-pointer rounded-sm border px-4 py-2.5 font-body text-[13px] transition-colors',
                    form.propertyType === type
                      ? 'border-brand-brass bg-brand-brass-pale/40 text-brand-charcoal'
                      : 'border-brand-ivory-deep text-brand-mist hover:border-brand-brass/50',
                  ].join(' ')}
                >
                  <input
                    type="radio"
                    name="propertyType"
                    value={type}
                    checked={form.propertyType === type}
                    onChange={() =>
                      setForm((p) => ({
                        ...p,
                        propertyType: type,
                        projectScope: [],
                        budgetRange: '',
                      }))
                    }
                    className="sr-only"
                  />
                  {type}
                </label>
              ))}
            </div>
          </fieldset>

          <fieldset className="space-y-3">
            <legend className="font-body text-[11px] font-semibold uppercase tracking-[0.16em] text-brand-brass">
              Project scope <span className="font-normal text-brand-mist">(select all that apply)</span>
            </legend>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {SCOPE_BY_PROPERTY[form.propertyType].map((opt) => (
                <label
                  key={opt}
                  className="flex cursor-pointer items-center gap-2 rounded-sm border border-brand-ivory-deep px-3 py-2 font-body text-[13px] text-brand-charcoal hover:border-brand-brass/40"
                >
                  <input
                    type="checkbox"
                    checked={form.projectScope.includes(opt)}
                    onChange={() => toggleScope(opt)}
                    className="h-3.5 w-3.5 rounded border-brand-mist text-brand-brass focus:ring-brand-brass"
                  />
                  {opt}
                </label>
              ))}
            </div>
          </fieldset>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <label className="block">
              <span className="mb-2 block font-body text-[11px] font-semibold uppercase tracking-[0.14em] text-brand-brass">
                Approx. area (sq ft)
              </span>
              <input
                type="text"
                value={form.areaSqft}
                onChange={(e) => setForm((p) => ({ ...p, areaSqft: e.target.value }))}
                className="w-full border-b border-brand-charcoal-soft/30 bg-transparent py-2 font-body text-[15px] text-brand-charcoal outline-none transition-colors placeholder:text-brand-mist/60 focus:border-brand-brass"
                placeholder={AREA_PLACEHOLDER_BY_PROPERTY[form.propertyType]}
                autoComplete="off"
              />
            </label>
            <label className="block">
              <span className="mb-2 block font-body text-[11px] font-semibold uppercase tracking-[0.14em] text-brand-brass">
                Budget range
              </span>
              <select
                value={form.budgetRange}
                onChange={(e) => setForm((p) => ({ ...p, budgetRange: e.target.value }))}
                className="w-full cursor-pointer border-b border-brand-charcoal-soft/30 bg-transparent py-2 font-body text-[15px] text-brand-charcoal outline-none focus:border-brand-brass"
                required
              >
                <option value="">Select range</option>
                {BUDGET_BY_PROPERTY[form.propertyType].map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <AnimatePresence>
            {showEstimatePanel ? (
              <motion.div
                key="live-estimate"
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                className="rounded-sm border border-brand-brass-pale bg-brand-ivory-deep/50 px-6 py-8 shadow-[0_20px_40px_-28px_rgba(28,25,21,0.18)]"
              >
                <p className="font-body text-[10px] font-semibold uppercase tracking-[0.2em] text-brand-brass">
                  YOUR ESTIMATE
                </p>

                <AnimatePresence mode="wait">
                  {!liveEstimate.area ? (
                    <motion.p
                      key="need-area"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="mt-5 font-body text-[15px] leading-relaxed text-brand-mist"
                    >
                      Enter your area above to see your estimate
                    </motion.p>
                  ) : liveEstimate.breakdown.length === 0 ? (
                    <motion.div
                      key="no-preset"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <p className="mt-5 font-display text-[clamp(22px,3.5vw,30px)] font-light leading-snug text-brand-charcoal">
                        Indicative ranges aren&apos;t preset for these selections. We&apos;ll outline costs after a
                        consultation.
                      </p>
                      <p className="mt-6 font-body text-[11px] leading-relaxed text-brand-mist">{ESTIMATE_DISCLAIMER}</p>
                      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                        <button
                          type="button"
                          onClick={openConsultationModal}
                          className="inline-flex flex-1 items-center justify-center rounded-[2px] bg-[#B8965A] px-6 py-[14px] text-center font-body text-[11px] font-medium uppercase tracking-[0.12em] text-[#1C1915] transition-opacity hover:opacity-90 sm:min-w-[200px]"
                        >
                          Book a consultation
                        </button>
                        <button
                          type="button"
                          onClick={() => window.print()}
                          className="inline-flex flex-1 items-center justify-center rounded-[2px] border border-brand-charcoal/25 bg-transparent px-6 py-[14px] text-center font-body text-[11px] font-medium uppercase tracking-[0.12em] text-brand-charcoal transition-colors hover:border-brand-brass hover:text-brand-brass sm:min-w-[200px]"
                        >
                          Save my quote
                        </button>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="totals"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.35 }}
                    >
                      <p className="mt-4 font-display text-[clamp(28px,4.2vw,40px)] font-light leading-[1.12] text-brand-charcoal">
                        {formatInr(liveEstimate.totalMin)} – {formatInr(liveEstimate.totalMax)}
                      </p>

                      <ul className="mt-6 space-y-3 border-t border-brand-ivory-deep pt-5">
                        {liveEstimate.breakdown.map((row) => (
                          <li key={row.label} className="font-body text-[13px] leading-snug text-brand-charcoal">
                            <span className="font-medium text-brand-charcoal">{row.label}</span>
                            <span className="text-brand-mist"> — </span>
                            <span className="text-brand-mist">{row.detail}</span>
                          </li>
                        ))}
                        {liveEstimate.unpriced.map((label) => (
                          <li key={label} className="font-body text-[13px] leading-snug text-brand-mist">
                            <span className="text-brand-charcoal/80">{label}</span>
                            <span> — scoped after site visit</span>
                          </li>
                        ))}
                      </ul>

                      <p className="mt-6 font-body text-[11px] leading-relaxed text-brand-mist">{ESTIMATE_DISCLAIMER}</p>

                      <p className="mt-3 font-body text-[13px] font-medium text-brand-brass">
                        As low as {formatInr(Math.round(liveEstimate.totalMin / 36))}/month on 36-month plan
                      </p>

                      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                        <button
                          type="button"
                          onClick={openConsultationModal}
                          className="inline-flex flex-1 items-center justify-center rounded-[2px] bg-[#B8965A] px-6 py-[14px] text-center font-body text-[11px] font-medium uppercase tracking-[0.12em] text-[#1C1915] transition-opacity hover:opacity-90 sm:min-w-[200px]"
                        >
                          Book a consultation
                        </button>
                        <button
                          type="button"
                          onClick={() => window.print()}
                          className="inline-flex flex-1 items-center justify-center rounded-[2px] border border-brand-charcoal/25 bg-transparent px-6 py-[14px] text-center font-body text-[11px] font-medium uppercase tracking-[0.12em] text-brand-charcoal transition-colors hover:border-brand-brass hover:text-brand-brass sm:min-w-[200px]"
                        >
                          Save my quote
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ) : null}
          </AnimatePresence>

          <label className="block">
            <span className="mb-2 block font-body text-[11px] font-semibold uppercase tracking-[0.14em] text-brand-brass">
              Location
            </span>
            <input
              type="text"
              value={form.location}
              onChange={(e) => setForm((p) => ({ ...p, location: e.target.value }))}
              className="w-full border-b border-brand-charcoal-soft/30 bg-transparent py-2 font-body text-[15px] text-brand-charcoal outline-none placeholder:text-brand-mist/60 focus:border-brand-brass"
              placeholder="Area or neighbourhood in Bangalore"
              required
            />
          </label>

          <div className="space-y-6 border-t border-brand-ivory-deep pt-10">
            <p className="font-body text-[11px] font-semibold uppercase tracking-[0.16em] text-brand-brass">
              Your details
            </p>
            <label className="block">
              <span className="mb-2 block font-body text-[12px] text-brand-mist">Full name</span>
              <input
                type="text"
                value={form.fullName}
                onChange={(e) => setForm((p) => ({ ...p, fullName: e.target.value }))}
                className="w-full border-b border-brand-charcoal-soft/30 bg-transparent py-2 font-body text-[15px] text-brand-charcoal outline-none focus:border-brand-brass"
                required
                autoComplete="name"
              />
            </label>
            <label className="block">
              <span className="mb-2 block font-body text-[12px] text-brand-mist">Phone</span>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
                className="w-full border-b border-brand-charcoal-soft/30 bg-transparent py-2 font-body text-[15px] text-brand-charcoal outline-none focus:border-brand-brass"
                required
                autoComplete="tel"
              />
            </label>
            <label className="block">
              <span className="mb-2 block font-body text-[12px] text-brand-mist">Email</span>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                className="w-full border-b border-brand-charcoal-soft/30 bg-transparent py-2 font-body text-[15px] text-brand-charcoal outline-none focus:border-brand-brass"
                required
                autoComplete="email"
              />
            </label>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex min-w-[200px] items-center justify-center gap-2 rounded-[2px] bg-[#B8965A] px-9 py-[14px] font-body text-[12px] font-medium uppercase tracking-[0.12em] text-[#1C1915] transition-opacity hover:opacity-90 disabled:pointer-events-none disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" strokeWidth={2} aria-hidden />
                  Sending…
                </>
              ) : (
                'Submit request'
              )}
            </button>
            {submitError ? (
              <p className="mt-4 font-body text-[13px] text-red-600">{submitError}</p>
            ) : null}
          </div>
        </form>
      </div>

      <ConsultationBookingModal
        key={consultationModalKey}
        isOpen={consultationModalOpen}
        onClose={() => setConsultationModalOpen(false)}
        prefillName={form.fullName}
        prefillPhone={form.phone}
        prefillEmail={form.email}
      />
    </main>
  )
}
