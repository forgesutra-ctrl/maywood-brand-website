import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Check, ChevronRight } from 'lucide-react'
import ConsultationBookingModal from '../components/ConsultationBookingModal'
import {
  computeEstimate,
  bedroomCountFromBhk,
  emiMonthly,
  formatInr,
  formatInrRange,
  formatLakh,
  getMasterScopeKey,
  parseAreaNumber,
  SQMT_TO_SQFT,
  QUALITY_TIERS,
} from '../lib/maywoodEstimate'
import { buttonClasses } from '../lib/buttonStyles'
import { saveQuoteRequest } from '../utils/adminDataStore'
import { isValidEmail } from '../lib/validation'
import { track } from '../utils/tracking'

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

const BHK_OPTIONS = ['1 BHK', '2 BHK', '3 BHK', '4 BHK', '4 BHK+']

const MASTER_SCOPE_NOTE_BY_PROPERTY = {
  Residential:
    'Full Home Interiors includes kitchen, wardrobes, living, bedrooms and all spaces.',
  Commercial:
    'Full office fit-out includes workstations, cabins, reception, breakout areas and all spaces.',
  Retail:
    'Full store fit-out includes storefront, displays, trial rooms, checkout and back office.',
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
  const [bhk, setBhk] = useState('2 BHK')
  const [location, setLocation] = useState('')
  const [estimateLow, setEstimateLow] = useState(0)
  const [estimateHigh, setEstimateHigh] = useState(0)
  const [breakdown, setBreakdown] = useState([])

  const [quoteSubmitError, setQuoteSubmitError] = useState('')

  const [selectedTier, setSelectedTier] = useState('Premium Plus')

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

  const bedroomCount = useMemo(() => bedroomCountFromBhk(bhk), [bhk])

  const handleScopeToggle = (item) => {
    const master = getMasterScopeKey(propertyType)
    if (!master) {
      setScope((prev) => (prev.includes(item) ? prev.filter((s) => s !== item) : [...prev, item]))
      return
    }
    if (item === master) {
      setScope((prev) => (prev.includes(master) ? [] : [master]))
      return
    }
    setScope((prev) => {
      const withoutMaster = prev.filter((s) => s !== master)
      if (withoutMaster.includes(item)) {
        return withoutMaster.filter((s) => s !== item)
      }
      return [...withoutMaster, item]
    })
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

  const handleStep5Submit = async (e) => {
    e.preventDefault()
    if (!location.trim() || !propertyType || !areaSqft || scope.length === 0) return

    setQuoteSubmitError('')

    const { breakdown: bd, totalMin, totalMax } = computeEstimate(
      propertyType,
      scope,
      areaSqft,
      selectedTier,
      bedroomCount,
    )

    try {
      await saveQuoteRequest({
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
        selected_tier: selectedTier,
        source: 'website',
      })
      track.formSubmit('instant_quote')
      setBreakdown(bd)
      setEstimateLow(totalMin)
      setEstimateHigh(totalMax)
      setStep(6)
    } catch {
      setQuoteSubmitError('We could not save your request. Check your connection and try again.')
    }
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
            <h1 className="text-center font-display text-[clamp(28px,4vw,40px)] font-light leading-[1.1] text-brand-charcoal">
              What type of space are you designing?
            </h1>
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
      case 3: {
        const scopeMasterKey = getMasterScopeKey(propertyType)
        const masterScopeSelected = Boolean(scopeMasterKey && scope.includes(scopeMasterKey))

        return (
          <motion.div
            key="s3"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3 }}
            className="mx-auto max-w-[720px]"
          >
            <h1 className="font-display text-[clamp(28px,4vw,40px)] font-light leading-[1.1] text-brand-charcoal">
              What are you looking to do?
            </h1>
            <p className="mt-3 font-body text-[14px] font-normal text-brand-mist">Select all that apply</p>
            <div className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {SCOPE_BY_PROPERTY[propertyType].map((item) => {
                const isMasterRow = Boolean(scopeMasterKey && item === scopeMasterKey)
                const visuallySelected =
                  scope.includes(item) || (masterScopeSelected && !isMasterRow)
                const disabledIndividual = masterScopeSelected && !isMasterRow
                return (
                  <button
                    key={item}
                    type="button"
                    disabled={disabledIndividual}
                    onClick={() => handleScopeToggle(item)}
                    className={[
                      'relative flex items-center gap-3 rounded-sm border px-4 py-4 text-left font-body text-[14px] transition-all',
                      disabledIndividual ? 'cursor-not-allowed opacity-40' : '',
                      visuallySelected
                        ? 'border-brand-brass bg-brand-brass-pale/50 text-brand-charcoal'
                        : 'border-brand-ivory-deep text-brand-charcoal hover:border-brand-brass/45',
                    ].join(' ')}
                  >
                    <span
                      className={[
                        'flex h-6 w-6 shrink-0 items-center justify-center rounded-full border',
                        visuallySelected
                          ? 'border-brand-brass bg-brand-brass text-[#1C1915]'
                          : 'border-brand-mist/40 bg-transparent',
                      ].join(' ')}
                      aria-hidden
                    >
                      {visuallySelected ? <Check className="h-3.5 w-3.5" strokeWidth={2.5} /> : null}
                    </span>
                    {item}
                  </button>
                )
              })}
            </div>
            {masterScopeSelected && MASTER_SCOPE_NOTE_BY_PROPERTY[propertyType] ? (
              <p className="mt-2 font-body text-xs italic text-brand-mist">
                {MASTER_SCOPE_NOTE_BY_PROPERTY[propertyType]}
              </p>
            ) : null}
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
      }
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
            <h1 className="font-display text-[clamp(28px,4vw,40px)] font-light leading-[1.1] text-brand-charcoal">
              How large is your space?
            </h1>
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
            <div className="mt-10">
              <p className="mb-4 font-body text-[11px] font-semibold uppercase tracking-[0.14em] text-brand-brass">
                Number of Bedrooms
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                {BHK_OPTIONS.map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setBhk(option)}
                    className={[
                      'rounded-full px-5 py-2 font-body text-[13px] font-medium transition-colors',
                      bhk === option
                        ? 'bg-brand-charcoal text-brand-ivory'
                        : 'border border-brand-brass/50 bg-brand-ivory-deep/50 text-brand-charcoal hover:border-brand-brass hover:bg-brand-brass-pale/40',
                    ].join(' ')}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
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
            <h1 className="font-display text-[clamp(28px,4vw,40px)] font-light leading-[1.1] text-brand-charcoal">
              Which area in Bangalore?
            </h1>
            <form onSubmit={handleStep5Submit} className="mt-10 space-y-10">
              <div>
                <label className={labelClass}>Location</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => {
                    setLocation(e.target.value)
                    setQuoteSubmitError('')
                  }}
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
              {quoteSubmitError ? (
                <p className="font-body text-[13px] font-normal text-red-600">{quoteSubmitError}</p>
              ) : null}
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
            className="mx-auto max-w-[680px]"
          >
            <div className="mb-8 grid grid-cols-3 gap-2 rounded-sm border border-brand-brass-pale p-1">
              {Object.keys(QUALITY_TIERS).map((tier) => {
                const { breakdown: bd, totalMin: tMin, totalMax: tMax } = computeEstimate(
                  propertyType,
                  scope,
                  areaSqft,
                  tier,
                  bedroomCount,
                )
                return (
                  <button
                    key={tier}
                    type="button"
                    onClick={() => {
                      setSelectedTier(tier)
                      setBreakdown(bd)
                      setEstimateLow(tMin)
                      setEstimateHigh(tMax)
                    }}
                    className={[
                      'relative rounded-sm px-3 py-3 text-center font-body text-[12px] font-semibold uppercase tracking-[0.1em] transition-all',
                      selectedTier === tier
                        ? 'bg-brand-charcoal text-brand-ivory'
                        : 'text-brand-mist hover:text-brand-charcoal',
                    ].join(' ')}
                  >
                    {QUALITY_TIERS[tier].popular && (
                      <span className="absolute -top-2 left-1/2 -translate-x-1/2 rounded-full bg-brand-brass px-2 py-0.5 font-body text-[9px] font-semibold uppercase tracking-wider text-white">
                        Popular
                      </span>
                    )}
                    {tier}
                  </button>
                )
              })}
            </div>

            <div className="mb-6">
              <p className="font-body text-[10px] font-semibold uppercase tracking-[0.22em] text-brand-brass">
                YOUR PERSONALISED ESTIMATE
              </p>
              <h1 className="mt-3 font-display text-[clamp(32px,5vw,48px)] font-light leading-[1.08] text-brand-charcoal">
                {formatInrRange(estimateLow, estimateHigh)}
              </h1>
              <p className="mt-2 font-body text-[13px] text-brand-mist">{QUALITY_TIERS[selectedTier].tagline}</p>
            </div>

            <div className="mb-6 rounded-sm border border-brand-brass-pale bg-brand-ivory-deep/40 px-6 py-6">
              <ul className="mb-5 space-y-3 border-b border-brand-ivory-deep pb-5">
                {breakdown.map((row) => (
                  <li key={row.label} className="flex flex-col gap-1 sm:flex-row sm:justify-between sm:gap-4">
                    <span className="font-body text-[13px] font-medium text-brand-charcoal">{row.label}</span>
                    <span className="font-body text-[12px] text-brand-mist">{row.line}</span>
                  </li>
                ))}
              </ul>
              <div
                style={{
                  marginTop: '16px',
                  background: 'linear-gradient(135deg, #1a1612 0%, #2c2420 100%)',
                  borderRadius: '8px',
                  padding: '20px 24px',
                  marginBottom: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '12px',
                }}
              >
                <div>
                  <p
                    style={{
                      color: '#c9a465',
                      fontSize: '10px',
                      letterSpacing: '2px',
                      textTransform: 'uppercase',
                      margin: '0 0 4px 0',
                    }}
                  >
                    MAYWOOD FINANCE — EMI OPTION
                  </p>
                  <p
                    style={{
                      color: '#ffffff',
                      fontSize: '28px',
                      fontFamily: 'Cormorant Garamond, serif',
                      fontWeight: '300',
                      margin: 0,
                      lineHeight: 1.1,
                    }}
                  >
                    {formatInr(Math.round(emiMonthly((estimateLow + estimateHigh) / 2, 0.07, 36)))}
                    <span style={{ fontSize: '14px', color: 'rgba(255,255,255,0.6)', marginLeft: '6px' }}>/ month</span>
                  </p>
                  <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '11px', margin: '4px 0 0 0' }}>
                    Starting at 7% p.a. • 36-month plan • No hidden charges • Instant approval
                  </p>
                </div>
                <a
                  href="/finance"
                  style={{
                    backgroundColor: '#c9a465',
                    color: '#ffffff',
                    padding: '10px 20px',
                    borderRadius: '4px',
                    fontSize: '11px',
                    fontWeight: '600',
                    letterSpacing: '1px',
                    textTransform: 'uppercase',
                    textDecoration: 'none',
                    whiteSpace: 'nowrap',
                  }}
                >
                  Learn More →
                </a>
              </div>
            </div>

            <div className="mb-6 overflow-hidden rounded-sm border border-brand-brass-pale">
              <div className="bg-brand-charcoal px-5 py-3">
                <p className="font-body text-[10px] font-semibold uppercase tracking-[0.18em] text-brand-brass">
                  What&apos;s Included — {selectedTier} Tier
                </p>
              </div>
              {[
                ['Material', QUALITY_TIERS[selectedTier].material],
                ['Finish', QUALITY_TIERS[selectedTier].finish],
                ['Hardware', QUALITY_TIERS[selectedTier].hardware],
                ['Warranty', QUALITY_TIERS[selectedTier].warranty],
                ['Delivery', '35–45 Working Days'],
                ['Installation', 'Included'],
              ].map(([label, value], i) => (
                <div
                  key={label}
                  className={[
                    'flex items-center justify-between px-5 py-3 font-body text-[13px]',
                    i % 2 === 0 ? 'bg-brand-ivory' : 'bg-brand-ivory-deep/40',
                  ].join(' ')}
                >
                  <span className="text-brand-mist">{label}</span>
                  <span className="font-medium text-brand-charcoal">{value}</span>
                </div>
              ))}
            </div>

            <p className="mb-8 font-body text-[11px] italic leading-relaxed text-brand-mist">
              This is an approximate estimate based on your selections. Final pricing is confirmed after a site visit and
              detailed scope discussion.
            </p>

            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={openConsultationModal}
                className={buttonClasses('ctaSecondary', 'w-full justify-center sm:flex-1')}
              >
                BOOK A FREE CONSULTATION
              </button>
              <a
                href="https://wa.me/919606977677"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => track.whatsappClick()}
                className="sm:flex-1"
                style={{
                  position: 'relative',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  width: '100%',
                  padding: '14px 24px',
                  backgroundColor: '#25D366',
                  color: '#ffffff',
                  borderRadius: '4px',
                  fontFamily: 'inherit',
                  fontSize: '12px',
                  fontWeight: '600',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  textDecoration: 'none',
                  cursor: 'pointer',
                  overflow: 'hidden',
                  animation: 'whatsappPulse 2s ease-in-out infinite',
                }}
              >
                <span
                  style={{
                    position: 'absolute',
                    inset: 0,
                    borderRadius: '4px',
                    border: '2px solid #25D366',
                    animation: 'rippleRing 2s ease-out infinite',
                    pointerEvents: 'none',
                  }}
                  aria-hidden
                />
                <span
                  style={{
                    position: 'absolute',
                    inset: 0,
                    borderRadius: '4px',
                    border: '2px solid #25D366',
                    animation: 'rippleRing 2s ease-out infinite',
                    animationDelay: '0.6s',
                    pointerEvents: 'none',
                  }}
                  aria-hidden
                />
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="white"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden
                  style={{ position: 'relative', zIndex: 1 }}
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                <span style={{ position: 'relative', zIndex: 1 }}>Speak to a Designer</span>
              </a>
            </div>
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
