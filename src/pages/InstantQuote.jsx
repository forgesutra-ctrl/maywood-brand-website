import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import SectionLabel from '../components/ui/SectionLabel'
import { supabase } from '../lib/supabase'

const PROPERTY_TYPES = ['Residential', 'Commercial', 'Retail']

const SCOPE_OPTIONS = [
  'Full interiors',
  'Kitchen',
  'Wardrobes',
  'Living & dining',
  'Office / workspace',
  'Retail fit-out',
]

const BUDGET_OPTIONS = [
  'Under ₹5 lakhs',
  '₹5–10 lakhs',
  '₹10–20 lakhs',
  '₹20–40 lakhs',
  '₹40 lakhs+',
  'Prefer to discuss',
]

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
                    onChange={() => setForm((p) => ({ ...p, propertyType: type }))}
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
              {SCOPE_OPTIONS.map((opt) => (
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
                placeholder="e.g. 1200"
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
                {BUDGET_OPTIONS.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </label>
          </div>

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
    </main>
  )
}
