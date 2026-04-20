import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Check, ChevronRight } from 'lucide-react'
import ConsultationBookingModal from '../components/ConsultationBookingModal'
import MaywoodCalculator from '../components/MaywoodCalculator'
import {
  computeEstimate,
  emiMonthly,
  formatInr,
  formatInrRange,
  parseAreaNumber,
  SQMT_TO_SQFT,
} from '../lib/maywoodEstimate'
import { buttonBaseClass, buttonClasses } from '../lib/buttonStyles'

const STEP_LABELS = [
  'Your Details',
  'Property Type',
  'Scope',
  'Area',
  'Location',
  'Estimate',
]

const PROPERTY_CARDS = [
  { type: 'Residential', emoji: '🏠', label: 'Residential' },
  { type: 'Commercial', emoji: '🏢', label: 'Commercial' },
  { type: 'Retail', emoji: '🛍', label: 'Retail' },
]

const SCOPE_BY_PROPERTY = {
  Residential: [
    'Modular Kitchen',
    'Wardrobes & Storage',
    'Living & Dining',
    'Bedrooms',
    'Full Home Interiors',
    'Home Office',
    'Pooja Room',
    'Bathrooms',
  ],
  Commercial: [
    'Full Office Fit-out',
    'Open Workstations',
    'Cabin & Conference',
    'Reception & Lobby',
    'Breakout Areas',
    'IT & Server Room',
  ],
  Retail: [
    'Full Store Fit-out',
    'Storefront & Façade',
    'Display Fixtures',
    'Trial Rooms',
    'Checkout & POS',
    'Storage & Back Office',
  ],
}

const AREA_PILLS = {
  Residential: [500, 800, 1000, 1200, 1500, '2000+'],
  Commercial: [500, 1000, 2000, 5000, '10000+'],
  Retail: [200, 500, 800, '1500+'],
}

function pillToSqft(pill) {
  if (typeof pill === 'number') return pill
  const s = String(pill).replace('+', '')
  const n = parseInt(s, 10)
  return Number.isFinite(n) ? n : 0
}

function applyAreaPill(pill, areaUnit, setAreaInput) {
  const sqft = pillToSqft(pill)
  if (areaUnit === 'sqmt') {
    setAreaInput(String(Math.max(1, Math.round(sqft / SQMT_TO_SQFT))))
  } else {
    setAreaInput(String(sqft))
  }
}

function isValidEmail(s) {
  return /^\S+@\S+\.\S+$/.test(String(s).trim())
}

const inputClass =
  'w-full border-0 border-b border-brand-charcoal-soft/30 bg-transparent py-3 font-body text-[16px] text-brand-charcoal outline-none transition-colors placeholder:text-brand-mist/55 focus:border-brand-brass'

const labelClass =
  'mb-2 block font-body text-[11px] font-semibold uppercase tracking-[0.14em] text-brand-brass'

export default function InstantQuote() {
  const [step, setStep] = useState(1)
  const [fullName, setFullName] = useState('')
  const [phoneDigits, setPhoneDigits] = useState('')
  const [email, setEmail] = useState('')
  const [propertyType, setPropertyType] = useState(null)
  const [scope, setScope] = useState([])
  const [areaInput, setAreaInput] = useState('')
  const [areaUnit, setAreaUnit] = useState('sqft')
  const [location, setLocation] = useState('')
  const [estimateLow, setEstimateLow] = useState(0)
  const [estimateHigh, setEstimateHigh] = useState(0)
  const [breakdown, setBreakdown] = useState([])

  const [consultationModalOpen, setConsultationModalOpen] = useState(false)
  const [consultationModalKey, setConsultationModalKey] = useState(0)

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [step])

  const openConsultationModal = () => {
    setConsultationModalKey((k) => k + 1)
    setConsultationModalOpen(true)
  }

  const phoneFull = phoneDigits.length === 10 ? `+91${phoneDigits}` : ''
  const step1Valid =
    fullName.trim().length > 0 && phoneDigits.length === 10 && isValidEmail(email)

  const areaSqft = useMemo(
    () => (propertyType ? parseAreaNumber(areaInput, areaUnit) : null),
    [areaInput, areaUnit, propertyType],
  )

  const estimateMid = useMemo(
    () => (estimateLow + estimateHigh) / 2,
    [estimateLow, estimateHigh],
  )
  const emiApprox = useMemo(() => emiMonthly(estimateMid, 0.12, 36), [estimateMid])

  const toggleScope = (key) => {
    setScope((prev) => (prev.includes(key) ? prev.filter((s) => s !== key) : [...prev, key]))
  }

  const handleStep1Submit = (e) => {
    e.preventDefault()
    if (!step1Valid) return
    setStep(2)
  }

  const selectProperty = (type) => {
    setPropertyType(type)
    setScope([])
    setStep(3)
  }

  const handleStep5Submit = (e) => {
    e.preventDefault()
    if (!location.trim() || !propertyType || !areaSqft || scope.length === 0) return

    const { breakdown: bd, totalMin, totalMax } = computeEstimate(propertyType, scope, areaSqft)
    setBreakdown(bd)
    setEstimateLow(totalMin)
    setEstimateHigh(totalMax)

    const payload = {
      name: fullName.trim(),
      phone: phoneFull,
      email: email.trim(),
      propertyType,
      scope: [...scope],
      area: areaInput.trim(),
      areaUnit,
      location: location.trim(),
      estimateLow: Math.round(totalMin),
      estimateHigh: Math.round(totalMax),
      timestamp: new Date().toISOString(),
    }
    console.log(payload)

    setStep(6)
  }

  const goBack = () => {
    if (step <= 1) return
    if (step === 3) {
      setStep(2)
      setScope([])
      return
    }
    if (step === 4) {
      setStep(3)
      return
    }
    if (step === 5) {
      setStep(4)
      return
    }
    if (step === 6) {
      setStep(5)
      return
    }
    setStep((s) => s - 1)
  }

  const progressPct = Math.min(100, (step / 6) * 100)

  const stepContent = (() => {
    switch (step) {
      case 1:
        return (
          <motion.div
            key="s1"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3 }}
            className="mx-auto max-w-[480px]"
          >
            <h1 className="font-display text-[clamp(32px,5vw,44px)] font-light leading-[1.08] text-brand-charcoal">
              Let&apos;s get started.
            </h1>
            <p className="mt-4 font-body text-[15px] font-normal leading-relaxed text-brand-mist">
              Share your details and we&apos;ll prepare a personalised estimate for you.
            </p>
            <form onSubmit={handleStep1Submit} className="mt-10 space-y-8">
              <div>
                <label className={labelClass}>Full Name</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className={inputClass}
                  required
                  autoComplete="name"
                />
              </div>
              <div>
                <label className={labelClass}>Phone Number</label>
                <div className="flex border-b border-brand-charcoal-soft/30 focus-within:border-brand-brass">
                  <span className="shrink-0 py-3 pr-3 font-body text-[16px] text-brand-mist">+91</span>
                  <input
                    type="tel"
                    inputMode="numeric"
                    autoComplete="tel-national"
                    maxLength={10}
                    value={phoneDigits}
                    onChange={(e) => setPhoneDigits(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    className="min-w-0 flex-1 border-0 bg-transparent py-3 font-body text-[16px] text-brand-charcoal outline-none placeholder:text-brand-mist/55"
                    placeholder="98765 43210"
                    required
                  />
                </div>
              </div>
              <div>
                <label className={labelClass}>Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={inputClass}
                  required
                  autoComplete="email"
                />
              </div>
              <p className="font-body text-[12px] font-normal leading-relaxed text-brand-mist">
                Your details are safe with us. No spam, ever.
              </p>
              <button
                type="submit"
                disabled={!step1Valid}
                className={buttonClasses(
                  'primary',
                  'flex w-full items-center justify-center gap-2 py-4 text-[13px] tracking-[0.1em] disabled:pointer-events-none disabled:opacity-40',
                )}
              >
                GET MY ESTIMATE
                <ChevronRight className="h-4 w-4" strokeWidth={2} aria-hidden />
              </button>
            </form>
          </motion.div>
        )
      case 2:
        return (
          <motion.div
            key="s2"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3 }}
            className="mx-auto max-w-[900px]"
          >
            <h2 className="text-center font-display text-[clamp(28px,4vw,40px)] font-light leading-[1.1] text-brand-charcoal">
              What type of space are you designing?
            </h2>
            <div className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-6">
              {PROPERTY_CARDS.map(({ type, emoji, label }) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => selectProperty(type)}
                  className="flex min-h-[120px] flex-col items-center justify-center rounded-sm border border-brand-brass-pale bg-brand-ivory-deep/40 px-6 py-10 text-center transition-all hover:border-brand-brass hover:bg-brand-brass-pale/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-brass md:min-h-[160px]"
                >
                  <span className="text-4xl md:text-5xl" aria-hidden>
                    {emoji}
                  </span>
                  <span className="mt-4 font-display text-[20px] font-normal text-brand-charcoal">{label}</span>
                </button>
              ))}
            </div>
          </motion.div>
        )
      case 3:
        return (
          <motion.div
            key="s3"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3 }}
            className="mx-auto max-w-[720px]"
          >
            <h2 className="font-display text-[clamp(28px,4vw,40px)] font-light leading-[1.1] text-brand-charcoal">
              What are you looking to do?
            </h2>
            <p className="mt-3 font-body text-[14px] font-normal text-brand-mist">Select all that apply</p>
            <div className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {SCOPE_BY_PROPERTY[propertyType].map((item) => {
                const selected = scope.includes(item)
                return (
                  <button
                    key={item}
                    type="button"
                    onClick={() => toggleScope(item)}
                    className={[
                      'relative flex items-center gap-3 rounded-sm border px-4 py-4 text-left font-body text-[14px] transition-all',
                      selected
                        ? 'border-brand-brass bg-brand-brass-pale/50 text-brand-charcoal'
                        : 'border-brand-ivory-deep text-brand-charcoal hover:border-brand-brass/45',
                    ].join(' ')}
                  >
                    <span
                      className={[
                        'flex h-6 w-6 shrink-0 items-center justify-center rounded-full border',
                        selected ? 'border-brand-brass bg-brand-brass text-[#1C1915]' : 'border-brand-mist/40 bg-transparent',
                      ].join(' ')}
                      aria-hidden
                    >
                      {selected ? <Check className="h-3.5 w-3.5" strokeWidth={2.5} /> : null}
                    </span>
                    {item}
                  </button>
                )
              })}
            </div>
            <button
              type="button"
              disabled={scope.length === 0}
              onClick={() => setStep(4)}
              className={buttonClasses(
                'primary',
                'mt-12 flex w-full max-w-md items-center justify-center gap-2 py-4 disabled:pointer-events-none disabled:opacity-40',
              )}
            >
              Next
              <ChevronRight className="h-4 w-4" strokeWidth={2} aria-hidden />
            </button>
          </motion.div>
        )
      case 4:
        return (
          <motion.div
            key="s4"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3 }}
            className="mx-auto max-w-[520px] text-center"
          >
            <h2 className="font-display text-[clamp(28px,4vw,40px)] font-light leading-[1.1] text-brand-charcoal">
              How large is your space?
            </h2>
            <p className="mt-3 font-body text-[14px] font-normal text-brand-mist">
              An approximate size helps us give a better estimate
            </p>
            <div className="mt-2 flex justify-center gap-2 pt-8">
              <button
                type="button"
                onClick={() => setAreaUnit('sqft')}
                className={[
                  'rounded-sm px-4 py-2 font-body text-[11px] font-semibold uppercase tracking-[0.12em] transition-colors',
                  areaUnit === 'sqft'
                    ? 'bg-brand-charcoal text-brand-ivory'
                    : 'border border-brand-ivory-deep text-brand-mist hover:border-brand-brass',
                ].join(' ')}
              >
                Sq Ft
              </button>
              <button
                type="button"
                onClick={() => setAreaUnit('sqmt')}
                className={[
                  'rounded-sm px-4 py-2 font-body text-[11px] font-semibold uppercase tracking-[0.12em] transition-colors',
                  areaUnit === 'sqmt'
                    ? 'bg-brand-charcoal text-brand-ivory'
                    : 'border border-brand-ivory-deep text-brand-mist hover:border-brand-brass',
                ].join(' ')}
              >
                Sq Mt
              </button>
            </div>
            <input
              type="text"
              inputMode="decimal"
              value={areaInput}
              onChange={(e) => setAreaInput(e.target.value)}
              className="mt-6 w-full max-w-[280px] border-0 border-b-2 border-brand-charcoal/25 bg-transparent py-2 text-center font-display text-[clamp(40px,8vw,64px)] font-light leading-none text-brand-charcoal outline-none transition-colors focus:border-brand-brass"
              placeholder="0"
              autoComplete="off"
            />
            <p className="mt-2 font-body text-[12px] text-brand-mist">{areaUnit === 'sqft' ? 'Square feet' : 'Square metres'}</p>
            <div className="mt-10 flex flex-wrap justify-center gap-2">
              {AREA_PILLS[propertyType].map((pill) => (
                <button
                  key={String(pill)}
                  type="button"
                  onClick={() => applyAreaPill(pill, areaUnit, setAreaInput)}
                  className="rounded-full border border-brand-brass/50 bg-brand-ivory-deep/50 px-4 py-2 font-body text-[12px] font-medium text-brand-charcoal transition-colors hover:border-brand-brass hover:bg-brand-brass-pale/40"
                >
                  {pill}
                  {typeof pill === 'number' ? (areaUnit === 'sqmt' ? ' m²' : ' sq ft') : ''}
                </button>
              ))}
            </div>
            <button
              type="button"
              disabled={!areaSqft}
              onClick={() => setStep(5)}
              className={buttonClasses(
                'primary',
                'mt-14 flex w-full items-center justify-center gap-2 py-4 disabled:pointer-events-none disabled:opacity-40',
              )}
            >
              Next
              <ChevronRight className="h-4 w-4" strokeWidth={2} aria-hidden />
            </button>
          </motion.div>
        )
      case 5:
        return (
          <motion.div
            key="s5"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3 }}
            className="mx-auto max-w-[480px]"
          >
            <h2 className="font-display text-[clamp(28px,4vw,40px)] font-light leading-[1.1] text-brand-charcoal">
              Which area in Bangalore?
            </h2>
            <form onSubmit={handleStep5Submit} className="mt-10 space-y-10">
              <div>
                <label className={labelClass}>Location</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className={inputClass}
                  placeholder="e.g. Whitefield, Koramangala, HSR Layout"
                  required
                  autoComplete="off"
                />
              </div>
              <button
                type="submit"
                disabled={!location.trim()}
                className={buttonClasses(
                  'primary',
                  'flex w-full items-center justify-center gap-2 py-4 disabled:pointer-events-none disabled:opacity-40',
                )}
              >
                SHOW MY ESTIMATE
                <ChevronRight className="h-4 w-4" strokeWidth={2} aria-hidden />
              </button>
            </form>
          </motion.div>
        )
      case 6:
        return (
          <motion.div
            key="s6"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.35 }}
            className="mx-auto max-w-[640px]"
          >
            <p className="font-body text-[10px] font-semibold uppercase tracking-[0.22em] text-brand-brass">
              YOUR PERSONALISED ESTIMATE
            </p>
            <p className="mt-6 font-display text-[clamp(32px,5vw,48px)] font-light leading-[1.08] text-brand-charcoal">
              {formatInrRange(estimateLow, estimateHigh)}
            </p>
            <p className="mt-4 font-body text-[14px] font-normal leading-relaxed text-brand-mist">
              Based on your inputs — mid-range materials and finishes
            </p>
            <div className="mt-10 rounded-sm border border-brand-brass-pale bg-brand-ivory-deep/50 px-6 py-8">
              <ul className="space-y-4 border-b border-brand-ivory-deep/80 pb-6">
                {breakdown.map((row) => (
                  <li key={row.label} className="flex flex-col gap-1 sm:flex-row sm:justify-between sm:gap-4">
                    <span className="font-body text-[14px] font-medium text-brand-charcoal">{row.label}</span>
                    <span className="font-body text-[13px] text-brand-mist">{row.line}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-6 font-body text-[15px] font-medium text-brand-brass">
                As low as {formatInr(Math.round(emiApprox))} / month on 36-month plan
              </p>
            </div>
            <MaywoodCalculator className="mt-10" contactGate={false} />
            <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:flex-wrap">
              <button
                type="button"
                onClick={openConsultationModal}
                className={buttonClasses('ctaSecondary', 'w-full justify-center sm:flex-1 focus-visible:ring-offset-brand-ivory')}
              >
                BOOK A FREE CONSULTATION
              </button>
              <a
                href="https://wa.me/919606977677"
                target="_blank"
                rel="noopener noreferrer"
                className={[
                  buttonBaseClass,
                  'inline-flex w-full items-center justify-center rounded-[2px] border border-brand-charcoal/35 bg-transparent px-9 py-[14px] font-body text-[12px] font-medium uppercase tracking-[0.12em] text-brand-charcoal transition-colors hover:border-brand-brass hover:text-brand-brass sm:flex-1',
                ].join(' ')}
              >
                SPEAK TO A DESIGNER
              </a>
            </div>
            <p className="mt-10 font-body text-[12px] font-normal leading-relaxed text-brand-mist">
              Estimates are indicative. Final pricing confirmed after site visit.
            </p>
          </motion.div>
        )
      default:
        return null
    }
  })()

  return (
    <main className="flex-1 bg-brand-ivory px-5 py-10 sm:px-8 lg:px-12 lg:py-16">
      <div className="mx-auto max-w-[900px]">
        <div className="mb-10">
          <div className="h-[2px] w-full rounded-full bg-[rgba(184,150,90,0.2)]">
            <div
              className="h-full rounded-full bg-brand-brass transition-[width] duration-500 ease-out"
              style={{ width: `${progressPct}%` }}
            />
          </div>
          <p className="mt-3 font-body text-[11px] font-medium uppercase tracking-[0.16em] text-brand-mist">
            Step {step} of 6
            <span className="mx-2 text-brand-brass/40" aria-hidden>
              ·
            </span>
            <span className="text-brand-brass">{STEP_LABELS[step - 1]}</span>
          </p>
        </div>

        {step > 1 && step < 6 ? (
          <button
            type="button"
            onClick={goBack}
            className="mb-8 font-body text-[12px] font-medium uppercase tracking-[0.12em] text-brand-brass transition-colors hover:text-brand-charcoal"
          >
            ← Back
          </button>
        ) : null}

        <AnimatePresence mode="wait">{stepContent}</AnimatePresence>
      </div>

      <ConsultationBookingModal
        key={consultationModalKey}
        isOpen={consultationModalOpen}
        onClose={() => setConsultationModalOpen(false)}
        prefillName={fullName.trim()}
        prefillPhone={phoneFull || (phoneDigits ? `+91${phoneDigits}` : '')}
        prefillEmail={email.trim()}
      />
    </main>
  )
}
