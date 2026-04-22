import { useEffect, useMemo, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import SectionLabel from './ui/SectionLabel'
import { computeEstimate, formatInr, formatInrRange } from '../lib/maywoodEstimate'
import { buttonClasses } from '../lib/buttonStyles'
import { saveCalculatorLead } from '../utils/adminDataStore'
import { isValidEmail } from '../lib/validation'
import { track } from '../utils/tracking'

const TABS = [
  { id: 'budget', label: 'Budget Calculator' },
  { id: 'emi', label: 'EMI Calculator' },
  { id: 'timeline', label: 'Timeline Estimator' },
]

const PROPERTY_OPTIONS = ['2BHK', '3BHK', 'Villa', 'Office', 'Retail']

const PROPERTY_TO_BUCKET = {
  '2BHK': 'Residential',
  '3BHK': 'Residential',
  Villa: 'Residential',
  Office: 'Commercial',
  Retail: 'Retail',
}

const DEFAULT_AREA = {
  '2BHK': 1000,
  '3BHK': 1300,
  Villa: 2200,
  Office: 1500,
  Retail: 600,
}

const SCOPE_LABELS = ['Kitchen', 'Wardrobes', 'Living & Dining', 'Bedrooms', 'Full Home']

const SCOPE_TO_INTERNAL = {
  Residential: {
    Kitchen: 'Modular Kitchen',
    Wardrobes: 'Wardrobes & Storage',
    'Living & Dining': 'Living & Dining',
    Bedrooms: 'Bedrooms',
    'Full Home': 'Full Home Interiors',
  },
  Commercial: {
    Kitchen: 'Breakout Areas',
    Wardrobes: 'Cabin & Conference',
    'Living & Dining': 'Reception & Lobby',
    Bedrooms: 'Open Workstations',
    'Full Home': 'Full Office Fit-out',
  },
  Retail: {
    Kitchen: 'Display Fixtures',
    Wardrobes: 'Storage & Back Office',
    'Living & Dining': 'Storefront & Façade',
    Bedrooms: 'Trial Rooms',
    'Full Home': 'Full Store Fit-out',
  },
}

function mapScopesToInternal(bucket, selectedLabels) {
  const map = SCOPE_TO_INTERNAL[bucket] || {}
  return selectedLabels.map((l) => map[l]).filter(Boolean)
}

/** EMI: annualRatePercent 0–100 */
function emiFromInputs(principal, annualRatePercent, months) {
  if (!principal || principal <= 0 || months <= 0) return 0
  const annual = annualRatePercent / 100
  const r = annual / 12
  if (r === 0) return principal / months
  const pow = (1 + r) ** months
  return (principal * r * pow) / (pow - 1)
}

function totalPayable(emi, months) {
  return emi * months
}

const inputClass =
  'w-full border-0 border-b border-brand-charcoal-soft/40 bg-transparent py-3 font-body text-[15px] text-brand-charcoal outline-none transition-colors placeholder:text-brand-mist/50 focus:border-brand-brass'

const labelClass =
  'mb-2 block font-body text-[10px] font-semibold uppercase tracking-[0.14em] text-brand-mist'

const PHASE_RATIOS = [
  { key: 'design', label: 'Design & Planning', ratio: 0.22 },
  { key: 'pre', label: 'Pre-Production', ratio: 0.12 },
  { key: 'mfg', label: 'Manufacturing', ratio: 0.38 },
  { key: 'install', label: 'Installation', ratio: 0.18 },
  { key: 'finish', label: 'Finishing & Handover', ratio: 0.1 },
]

function computeTimelineDays(scopeLabels, finish, sizeSqft) {
  let days = 35
  const n = scopeLabels.length
  if (n > 1) days += (n - 1) * 5
  if (finish === 'premium') days += 10
  const onlyKitchenWardrobe =
    n === 2 &&
    scopeLabels.includes('Kitchen') &&
    scopeLabels.includes('Wardrobes') &&
    !scopeLabels.includes('Full Home')
  if (onlyKitchenWardrobe) days -= 3
  const sizeBump = Math.max(0, Math.floor((sizeSqft - 1200) / 400)) * 2
  days += sizeBump
  return Math.max(28, Math.round(days))
}

function splitPhases(totalDays) {
  return PHASE_RATIOS.map(({ key, label, ratio }) => ({
    key,
    label,
    days: Math.max(1, Math.round(totalDays * ratio)),
  }))
}

export default function MaywoodCalculator({
  className = '',
  contactGate = false,
  calculatorLeadSource = undefined,
  showTabs = null,
  resultCta = null,
}) {
  const visibleTabs = useMemo(() => {
    if (!showTabs?.length) return TABS
    const allowed = new Set(showTabs)
    return TABS.filter((t) => allowed.has(t.id))
  }, [showTabs])

  const [contactUnlocked, setContactUnlocked] = useState(!contactGate)
  const [gateName, setGateName] = useState('')
  const [gatePhoneDigits, setGatePhoneDigits] = useState('')
  const [gateEmail, setGateEmail] = useState('')
  const [gateError, setGateError] = useState('')

  const [tab, setTab] = useState('budget')
  const prevTabRef = useRef('budget')

  useEffect(() => {
    const ids = visibleTabs.map((t) => t.id)
    if (ids.length === 0) return
    setTab((current) => (ids.includes(current) ? current : ids[0]))
  }, [visibleTabs])

  const [propertyType, setPropertyType] = useState('3BHK')
  const [areaSqft, setAreaSqft] = useState(String(DEFAULT_AREA['3BHK']))
  const [scopeSel, setScopeSel] = useState(['Kitchen', 'Living & Dining'])

  const [projectValue, setProjectValue] = useState('800000')
  const [downPayment, setDownPayment] = useState('0')
  const [tenure, setTenure] = useState(36)
  const [interestPct, setInterestPct] = useState(5)

  const [tlScope, setTlScope] = useState(['Kitchen', 'Full Home'])
  const [tlSize, setTlSize] = useState('1200')
  const [tlFinish, setTlFinish] = useState('mid')

  const bucket = PROPERTY_TO_BUCKET[propertyType]

  /** Mid-range: standard rates from computeEstimate (no finish multiplier). */
  const budgetResult = useMemo(() => {
    const area = Math.max(1, parseFloat(String(areaSqft).replace(/,/g, '')) || 1)
    const internal = mapScopesToInternal(bucket, scopeSel)
    if (internal.length === 0) return null
    const { totalMin, totalMax } = computeEstimate(bucket, internal, area)
    return {
      low: Math.round(totalMin),
      high: Math.round(totalMax),
      area,
    }
  }, [bucket, scopeSel, areaSqft])

  useEffect(() => {
    if (tab === 'emi' && prevTabRef.current === 'budget' && budgetResult) {
      const mid = Math.round((budgetResult.low + budgetResult.high) / 2)
      setProjectValue(String(mid))
    }
    prevTabRef.current = tab
  }, [tab, budgetResult])

  const perSqft = useMemo(() => {
    if (!budgetResult) return null
    const mid = (budgetResult.low + budgetResult.high) / 2
    return Math.round(mid / budgetResult.area)
  }, [budgetResult])

  const principal = useMemo(() => {
    const pv = parseFloat(String(projectValue).replace(/,/g, '')) || 0
    const dp = parseFloat(String(downPayment).replace(/,/g, '')) || 0
    return Math.max(0, pv - dp)
  }, [projectValue, downPayment])

  const emi = useMemo(
    () => emiFromInputs(principal, interestPct, tenure),
    [principal, interestPct, tenure],
  )

  const emi60 = useMemo(
    () => emiFromInputs(principal, interestPct, 60),
    [principal, interestPct],
  )

  const totalPaid = useMemo(() => totalPayable(emi, tenure), [emi, tenure])
  const totalInterest = useMemo(() => Math.max(0, totalPaid - principal), [totalPaid, principal])

  const principalPct = totalPaid > 0 ? Math.min(100, Math.round((principal / totalPaid) * 100)) : 0
  const interestPctBar = 100 - principalPct

  const timelineTotal = useMemo(() => {
    const size = Math.max(1, parseFloat(String(tlSize).replace(/,/g, '')) || 1)
    return computeTimelineDays(tlScope, tlFinish, size)
  }, [tlScope, tlSize, tlFinish])

  const phases = useMemo(() => {
    const parts = splitPhases(timelineTotal)
    const sum = parts.reduce((a, p) => a + p.days, 0)
    const drift = timelineTotal - sum
    if (drift !== 0 && parts.length) {
      parts[parts.length - 1] = { ...parts[parts.length - 1], days: parts[parts.length - 1].days + drift }
    }
    return parts
  }, [timelineTotal])

  const toggleScope = (key, list, setList) => {
    setList((prev) => (prev.includes(key) ? prev.filter((x) => x !== key) : [...prev, key]))
  }

  const gateValid =
    gateName.trim().length > 0 && gatePhoneDigits.length === 10 && isValidEmail(gateEmail)

  const handleGateSubmit = async (e) => {
    e.preventDefault()
    if (!gateValid) return
    setGateError('')
    try {
      if (calculatorLeadSource) {
        await saveCalculatorLead({
          name: gateName.trim(),
          phone: `+91${gatePhoneDigits}`,
          email: gateEmail.trim(),
          source: calculatorLeadSource,
        })
      }
      track.formSubmit('calculator_lead_gate')
      setContactUnlocked(true)
    } catch {
      setGateError('Could not save your details. Please try again.')
    }
  }

  const outputCard = (children) => (
    <div className="mt-8 rounded-sm bg-[#1a1612] px-6 py-8 sm:px-8">{children}</div>
  )

  const showResultCta = Boolean(resultCta) && (contactUnlocked || !contactGate)

  const calculatorBody = (
    <>
      <div className="flex flex-wrap gap-2 border-b border-[rgba(184,150,90,0.25)] sm:gap-8">
        {visibleTabs.map(({ id, label }) => (
          <button
            key={id}
            type="button"
            onClick={() => setTab(id)}
            className={[
              'border-b-2 pb-3 font-body text-[11px] font-medium uppercase tracking-[0.12em] transition-colors sm:text-[12px]',
              tab === id
                ? 'border-brand-brass text-brand-brass'
                : 'border-transparent text-brand-mist hover:text-brand-charcoal/80',
            ].join(' ')}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="mt-8">
        {tab === 'budget' && (
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-10">
            <div className="space-y-6">
              <div>
                <label className={labelClass}>Property Type</label>
                <select
                  value={propertyType}
                  onChange={(e) => {
                    const p = e.target.value
                    setPropertyType(p)
                    setAreaSqft(String(DEFAULT_AREA[p] ?? 1000))
                  }}
                  className={`${inputClass} cursor-pointer appearance-none bg-transparent`}
                >
                  {PROPERTY_OPTIONS.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelClass}>Approximate Area (sq ft)</label>
                <input
                  type="number"
                  min={100}
                  step={50}
                  value={areaSqft}
                  onChange={(e) => setAreaSqft(e.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <span className={labelClass}>Scope</span>
                <div className="mt-3 flex flex-wrap gap-3">
                  {SCOPE_LABELS.map((s) => (
                    <label
                      key={s}
                      className="flex cursor-pointer items-center gap-2 font-body text-[13px] text-brand-charcoal"
                    >
                      <input
                        type="checkbox"
                        checked={scopeSel.includes(s)}
                        onChange={() => toggleScope(s, scopeSel, setScopeSel)}
                        className="h-4 w-4 rounded border-brand-brass-pale text-brand-brass focus:ring-brand-brass"
                      />
                      {s}
                    </label>
                  ))}
                </div>
              </div>
            </div>
            {outputCard(
              <>
                <p className="font-body text-[10px] font-semibold uppercase tracking-[0.2em] text-brand-mist-light">
                  Estimated budget range
                </p>
                {budgetResult ? (
                  <>
                    <p className="mt-4 font-display text-[clamp(26px,4vw,36px)] font-light leading-tight text-brand-brass">
                      {formatInrRange(budgetResult.low, budgetResult.high)}
                    </p>
                    <p className="mt-3 font-body text-[12px] leading-relaxed text-brand-mist-light">
                      Mid-range pricing (standard materials &amp; finishes)
                    </p>
                    {perSqft != null ? (
                      <p className="mt-4 font-body text-[13px] leading-relaxed text-brand-mist-light">
                        Approx.{' '}
                        <span className="text-brand-brass">{formatInr(perSqft)}</span> / sq ft (mid-point of range)
                      </p>
                    ) : null}
                  </>
                ) : (
                  <p className="mt-4 font-body text-[14px] text-brand-mist-light">Select at least one scope.</p>
                )}
              </>,
            )}
          </div>
        )}

        {tab === 'emi' && (
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-10">
            <div className="space-y-6">
              <div>
                <label className={labelClass}>Project Value (₹)</label>
                <input
                  type="number"
                  min={0}
                  value={projectValue}
                  onChange={(e) => setProjectValue(e.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Down Payment (₹)</label>
                <input
                  type="number"
                  min={0}
                  value={downPayment}
                  onChange={(e) => setDownPayment(e.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <span className={labelClass.replace('mb-2', 'mb-0')}>Tenure</span>
                  <span className="font-body text-[13px] font-medium text-brand-brass">{tenure} months</span>
                </div>
                <input
                  type="range"
                  min={6}
                  max={60}
                  step={1}
                  value={tenure}
                  onChange={(e) => setTenure(Number(e.target.value))}
                  className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-brand-brass-pale/40 accent-brand-brass"
                />
                <div className="mt-1 flex justify-between font-body text-[10px] text-brand-mist">
                  <span>6 mo</span>
                  <span>60 mo</span>
                </div>
              </div>
              <div>
                <label className={labelClass}>Interest Rate (p.a.)</label>
                <select
                  value={interestPct}
                  onChange={(e) => setInterestPct(Number(e.target.value))}
                  className={`${inputClass} cursor-pointer appearance-none bg-transparent`}
                >
                  <option value={0}>0%</option>
                  <option value={3}>3%</option>
                  <option value={5}>5%</option>
                  <option value={7}>7%</option>
                </select>
              </div>
            </div>
            {outputCard(
              <>
                <p className="font-body text-[10px] font-semibold uppercase tracking-[0.2em] text-brand-mist-light">
                  Monthly EMI
                </p>
                <p className="mt-3 font-display text-[clamp(28px,4vw,40px)] font-light leading-none text-brand-brass">
                  {formatInr(Math.round(emi))}{' '}
                  <span className="text-[0.45em] font-body font-normal text-brand-mist-light">/ month</span>
                </p>
                <div className="mt-6 rounded-sm border border-brand-brass/35 bg-[#252220] px-4 py-4">
                  <p className="font-body text-[10px] font-semibold uppercase tracking-[0.14em] text-brand-brass">
                    5-year (60 mo) EMI
                  </p>
                  <p className="mt-2 font-display text-[22px] font-light text-brand-ivory">
                    {formatInr(Math.round(emi60))}{' '}
                    <span className="text-[0.5em] font-body font-normal text-brand-mist-light">/ month</span>
                  </p>
                  <p className="mt-1 font-body text-[11px] text-brand-mist">Same principal &amp; rate · 60-month term</p>
                </div>
                <div className="mt-6 space-y-2 border-t border-white/10 pt-6">
                  <div className="flex justify-between font-body text-[13px] text-brand-mist-light">
                    <span>Total amount payable</span>
                    <span className="text-brand-ivory">{formatInr(Math.round(totalPaid))}</span>
                  </div>
                  <div className="flex justify-between font-body text-[13px] text-brand-mist-light">
                    <span>Total interest</span>
                    <span className="text-brand-ivory">{formatInr(Math.round(totalInterest))}</span>
                  </div>
                </div>
                <div className="mt-6">
                  <p className="font-body text-[10px] font-semibold uppercase tracking-[0.12em] text-brand-mist-light">
                    Principal vs interest
                  </p>
                  <div className="mt-2 flex h-3 w-full overflow-hidden rounded-sm bg-white/10">
                    <div
                      className="h-full bg-brand-brass"
                      style={{ width: `${principalPct}%` }}
                      title="Principal"
                    />
                    <div
                      className="h-full bg-brand-mist/50"
                      style={{ width: `${interestPctBar}%` }}
                      title="Interest"
                    />
                  </div>
                  <div className="mt-2 flex justify-between font-body text-[11px] text-brand-mist">
                    <span>Principal {principalPct}%</span>
                    <span>Interest {interestPctBar}%</span>
                  </div>
                </div>
              </>,
            )}
          </div>
        )}

        {tab === 'timeline' && visibleTabs.some((t) => t.id === 'timeline') && (
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-10">
            <div className="space-y-6">
              <div>
                <span className={labelClass}>Project Scope</span>
                <div className="mt-3 flex flex-wrap gap-3">
                  {SCOPE_LABELS.map((s) => (
                    <label
                      key={s}
                      className="flex cursor-pointer items-center gap-2 font-body text-[13px] text-brand-charcoal"
                    >
                      <input
                        type="checkbox"
                        checked={tlScope.includes(s)}
                        onChange={() => toggleScope(s, tlScope, setTlScope)}
                        className="h-4 w-4 rounded border-brand-brass-pale text-brand-brass focus:ring-brand-brass"
                      />
                      {s}
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label className={labelClass}>Size (sq ft)</label>
                <input
                  type="number"
                  min={100}
                  step={50}
                  value={tlSize}
                  onChange={(e) => setTlSize(e.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <span className={labelClass}>Finish Level</span>
                <div className="mt-3 flex flex-wrap gap-2">
                  {[
                    { id: 'basic', label: 'Basic' },
                    { id: 'mid', label: 'Mid-Range' },
                    { id: 'premium', label: 'Premium' },
                  ].map(({ id, label: lb }) => (
                    <button
                      key={id}
                      type="button"
                      onClick={() => setTlFinish(id)}
                      className={[
                        'rounded-full border px-4 py-2 font-body text-[11px] font-medium uppercase tracking-[0.08em] transition-colors',
                        tlFinish === id
                          ? 'border-brand-brass bg-[rgba(184,150,90,0.15)] text-brand-charcoal'
                          : 'border-brand-brass-pale/60 bg-transparent text-brand-mist hover:border-brand-brass/50',
                      ].join(' ')}
                    >
                      {lb}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            {outputCard(
              <>
                <p className="font-body text-[10px] font-semibold uppercase tracking-[0.2em] text-brand-mist-light">
                  Estimated timeline
                </p>
                <p className="mt-4 font-display text-[clamp(28px,4vw,40px)] font-light text-brand-brass">{timelineTotal} days</p>
                <ul className="mt-8 space-y-4 border-t border-white/10 pt-6">
                  {phases.map((p) => (
                    <li key={p.key} className="flex items-center justify-between gap-4 font-body text-[13px]">
                      <span className="text-brand-mist-light">{p.label}</span>
                      <span className="shrink-0 text-brand-ivory">{p.days} days</span>
                    </li>
                  ))}
                  <li className="flex items-center justify-between border-t border-brand-brass/30 pt-4 font-body text-[13px] font-medium">
                    <span className="text-brand-brass">Total</span>
                    <span className="text-brand-brass">{timelineTotal} days</span>
                  </li>
                </ul>
              </>,
            )}
          </div>
        )}
      </div>

      {showResultCta && resultCta ? (
        <div className="mt-8 flex flex-col items-center">
          <Link
            to={resultCta.to}
            onClick={() => track.quoteClick()}
            className={buttonClasses(
              'ctaPrimary',
              ['w-full max-w-md justify-center sm:w-auto', resultCta.ctaClassName].filter(Boolean).join(' '),
            )}
          >
            {resultCta.label}
          </Link>
          {resultCta.subtext ? (
            <p className="mt-3 max-w-md text-center font-body text-[13px] font-normal leading-relaxed text-brand-mist">
              {resultCta.subtext}
            </p>
          ) : null}
        </div>
      ) : null}
    </>
  )

  return (
    <div className={['w-full', className].filter(Boolean).join(' ')}>
      {contactGate && !contactUnlocked ? (
        <form onSubmit={handleGateSubmit} className="space-y-8">
          <div>
            <SectionLabel>See it in numbers</SectionLabel>
            <h2 className="mt-6 font-display text-[clamp(26px,4vw,36px)] font-light leading-[1.12] text-brand-charcoal">
              Find out what your project actually costs.
            </h2>
            <p className="mt-4 max-w-[520px] font-body text-[15px] font-normal leading-relaxed text-brand-mist">
              Share your details and we&apos;ll show you real estimates instantly.
            </p>
          </div>
          <div>
            <label className={labelClass}>Full Name</label>
            <input
              type="text"
              value={gateName}
              onChange={(e) => setGateName(e.target.value)}
              className={inputClass}
              required
              autoComplete="name"
            />
          </div>
          <div>
            <label className={labelClass}>Phone Number</label>
            <div className="flex border-b border-brand-charcoal-soft/40 focus-within:border-brand-brass">
              <span className="shrink-0 py-3 pr-3 font-body text-[15px] text-brand-mist">+91</span>
              <input
                type="tel"
                inputMode="numeric"
                autoComplete="tel-national"
                maxLength={10}
                value={gatePhoneDigits}
                onChange={(e) => setGatePhoneDigits(e.target.value.replace(/\D/g, '').slice(0, 10))}
                className="min-w-0 flex-1 border-0 bg-transparent py-3 font-body text-[15px] text-brand-charcoal outline-none placeholder:text-brand-mist/50"
                placeholder="98765 43210"
                required
              />
            </div>
          </div>
          <div>
            <label className={labelClass}>Email Address</label>
            <input
              type="email"
              value={gateEmail}
              onChange={(e) => setGateEmail(e.target.value)}
              className={inputClass}
              required
              autoComplete="email"
            />
          </div>
          <button
            type="submit"
            disabled={!gateValid}
            className={[
              'flex w-full items-center justify-center gap-2 disabled:pointer-events-none disabled:opacity-40',
              buttonClasses('primary'),
            ].join(' ')}
          >
            SHOW ME THE NUMBERS →
          </button>
          {gateError ? <p className="font-body text-[13px] font-normal text-red-600">{gateError}</p> : null}
          <p className="text-center font-body text-[12px] font-normal text-brand-mist">
            No spam. No sales calls until you&apos;re ready.
          </p>
        </form>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        >
          {calculatorBody}
        </motion.div>
      )}
    </div>
  )
}
