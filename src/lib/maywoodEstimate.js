/** Rates keyed to property type (Residential | Commercial | Retail) and scope labels — same as Instant Quote */
export const SCOPE_RATES = {
  Residential: {
    'Full Home Interiors': { kind: 'sqft', min: 1200, max: 1800 },
    'Modular Kitchen': { kind: 'flat', min: 150_000, max: 350_000 },
    'Wardrobes & Storage': { kind: 'flat', min: 60_000, max: 150_000 },
    'Living & Dining': { kind: 'flat', min: 80_000, max: 180_000 },
    Bedrooms: { kind: 'perRoom', min: 70_000, max: 150_000, rooms: 1 },
    'Home Office': { kind: 'flat', min: 50_000, max: 120_000 },
    'Pooja Room': { kind: 'flat', min: 40_000, max: 90_000 },
    Bathrooms: { kind: 'flat', min: 40_000, max: 80_000 },
  },
  Commercial: {
    'Full Office Fit-out': { kind: 'sqft', min: 1500, max: 2200 },
    'Open Workstations': { kind: 'sqft', min: 900, max: 1400 },
    'Cabin & Conference': { kind: 'sqft', min: 1200, max: 2000 },
    'Reception & Lobby': { kind: 'sqft', min: 1000, max: 1800 },
    'Breakout Areas': { kind: 'sqft', min: 800, max: 1200 },
    'IT & Server Room': { kind: 'flat', min: 120_000, max: 200_000 },
  },
  Retail: {
    'Full Store Fit-out': { kind: 'sqft', min: 1200, max: 2000 },
    'Storefront & Façade': { kind: 'sqft', min: 800, max: 1500 },
    'Display Fixtures': { kind: 'sqft', min: 600, max: 1200 },
    'Trial Rooms': { kind: 'flat', min: 80_000, max: 150_000 },
    'Checkout & POS': { kind: 'flat', min: 60_000, max: 120_000 },
    'Storage & Back Office': { kind: 'flat', min: 50_000, max: 100_000 },
  },
}

export const SQMT_TO_SQFT = 10.7639

export function formatInr(n) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(Math.round(n))
}

export function formatInrRange(low, high) {
  return `${formatInr(low)} – ${formatInr(high)}`
}

/** EMI (monthly); annualRate as decimal e.g. 0.12 for 12% */
export function emiMonthly(principal, annualRate, months) {
  if (!principal || principal <= 0) return 0
  const r = annualRate / 12
  if (r === 0) return principal / months
  const pow = (1 + r) ** months
  return (principal * r * pow) / (pow - 1)
}

export function parseAreaNumber(raw, unit) {
  const cleaned = String(raw ?? '')
    .replace(/,/g, '')
    .match(/[\d.]+/)
  if (!cleaned) return null
  const n = parseFloat(cleaned[0])
  if (!Number.isFinite(n) || n <= 0) return null
  const sqft = unit === 'sqmt' ? n * SQMT_TO_SQFT : n
  return sqft
}

export function computeEstimate(propertyType, scopeKeys, areaSqft) {
  const table = SCOPE_RATES[propertyType] || {}
  const breakdown = []
  let flatMin = 0
  let flatMax = 0
  let sumSqftMin = 0
  let sumSqftMax = 0

  for (const label of scopeKeys) {
    const rate = table[label]
    if (!rate) continue
    if (rate.kind === 'flat') {
      flatMin += rate.min
      flatMax += rate.max
      breakdown.push({
        label,
        low: rate.min,
        high: rate.max,
        line: `${formatInr(rate.min)} – ${formatInr(rate.max)}`,
      })
    } else if (rate.kind === 'perRoom') {
      const rooms = rate.rooms ?? 1
      const cMin = rate.min * rooms
      const cMax = rate.max * rooms
      flatMin += cMin
      flatMax += cMax
      breakdown.push({
        label,
        low: cMin,
        high: cMax,
        line: `${formatInr(rate.min)} – ${formatInr(rate.max)} / room`,
      })
    } else {
      sumSqftMin += rate.min
      sumSqftMax += rate.max
      const cMin = rate.min * areaSqft
      const cMax = rate.max * areaSqft
      breakdown.push({
        label,
        low: cMin,
        high: cMax,
        line: `${formatInr(rate.min)} – ${formatInr(rate.max)} / sq ft → ${formatInr(cMin)} – ${formatInr(cMax)}`,
      })
    }
  }

  const totalMin = flatMin + sumSqftMin * areaSqft
  const totalMax = flatMax + sumSqftMax * areaSqft
  return { breakdown, totalMin, totalMax }
}
