export const SQMT_TO_SQFT = 10.7639

export const QUALITY_TIERS = {
  Essential: {
    label: 'Essential',
    tagline: 'Functional and durable — ideal for rental homes',
    material: 'Particle Board with Laminate',
    finish: 'Matte Laminate',
    hardware: 'Ebco',
    warranty: '1 Year',
  },
  Comfort: {
    label: 'Comfort',
    tagline: 'Quality finishes — ideal for first-time homeowners',
    material: 'BWP Plywood with Laminate',
    finish: 'Matte Laminate',
    hardware: 'Hettich',
    warranty: '1 Year',
    popular: true,
  },
  Luxury: {
    label: 'Luxury',
    tagline: 'Premium materials — best of design and style',
    material: 'BWP Plywood with Acrylic/Gloss',
    finish: 'Gloss / Acrylic',
    hardware: 'Hettich / Blum',
    warranty: '1 Year',
  },
}

// All rates are Maywood rates (10% below Bangalore market)
// Flat rates are per item. sqft rates are per sq ft. perRoom rates are per bedroom.
export const SCOPE_RATES = {
  Residential: {
    'Full Home Interiors': {
      kind: 'sqft',
      Essential: { min: 1080, max: 1620 },
      Comfort: { min: 1620, max: 2520 },
      Luxury: { min: 2700, max: 4050 },
    },
    'Modular Kitchen': {
      kind: 'flat',
      Essential: { min: 135000, max: 225000 },
      Comfort: { min: 225000, max: 360000 },
      Luxury: { min: 360000, max: 630000 },
    },
    'Wardrobes & Storage': {
      kind: 'perRoom',
      Essential: { min: 36000, max: 67500 },
      Comfort: { min: 67500, max: 108000 },
      Luxury: { min: 108000, max: 162000 },
    },
    'Living & Dining': {
      kind: 'flat',
      Essential: { min: 72000, max: 135000 },
      Comfort: { min: 135000, max: 225000 },
      Luxury: { min: 225000, max: 360000 },
    },
    Bedrooms: {
      kind: 'perRoom',
      Essential: { min: 54000, max: 90000 },
      Comfort: { min: 90000, max: 162000 },
      Luxury: { min: 162000, max: 270000 },
    },
    'Home Office': {
      kind: 'flat',
      Essential: { min: 54000, max: 108000 },
      Comfort: { min: 90000, max: 162000 },
      Luxury: { min: 135000, max: 225000 },
    },
    'Pooja Room': {
      kind: 'flat',
      Essential: { min: 31500, max: 54000 },
      Comfort: { min: 45000, max: 72000 },
      Luxury: { min: 63000, max: 108000 },
    },
    Bathrooms: {
      kind: 'perRoom',
      Essential: { min: 45000, max: 81000 },
      Comfort: { min: 67500, max: 108000 },
      Luxury: { min: 108000, max: 180000 },
    },
    Balcony: {
      kind: 'flat',
      Essential: { min: 27000, max: 45000 },
      Comfort: { min: 40500, max: 63000 },
      Luxury: { min: 58500, max: 90000 },
    },
  },
  Commercial: {
    'Full Office Fit-out': {
      kind: 'sqft',
      Essential: { min: 1080, max: 1620 },
      Comfort: { min: 1620, max: 2520 },
      Luxury: { min: 2520, max: 3600 },
    },
    'Open Workstations': {
      kind: 'sqft',
      Essential: { min: 810, max: 1260 },
      Comfort: { min: 1260, max: 1980 },
      Luxury: { min: 1800, max: 2700 },
    },
    'Cabin & Conference': {
      kind: 'sqft',
      Essential: { min: 1080, max: 1620 },
      Comfort: { min: 1620, max: 2340 },
      Luxury: { min: 2340, max: 3600 },
    },
    'Reception & Lobby': {
      kind: 'sqft',
      Essential: { min: 900, max: 1440 },
      Comfort: { min: 1440, max: 2160 },
      Luxury: { min: 2160, max: 3240 },
    },
    'Breakout Areas': {
      kind: 'sqft',
      Essential: { min: 720, max: 1080 },
      Comfort: { min: 1080, max: 1620 },
      Luxury: { min: 1620, max: 2520 },
    },
    'IT & Server Room': {
      kind: 'flat',
      Essential: { min: 108000, max: 180000 },
      Comfort: { min: 135000, max: 225000 },
      Luxury: { min: 180000, max: 270000 },
    },
  },
  Retail: {
    'Full Store Fit-out': {
      kind: 'sqft',
      Essential: { min: 1080, max: 1620 },
      Comfort: { min: 1620, max: 2520 },
      Luxury: { min: 2520, max: 3600 },
    },
    'Storefront & Façade': {
      kind: 'sqft',
      Essential: { min: 720, max: 1260 },
      Comfort: { min: 1260, max: 1980 },
      Luxury: { min: 1980, max: 2880 },
    },
    'Display Fixtures': {
      kind: 'sqft',
      Essential: { min: 540, max: 900 },
      Comfort: { min: 900, max: 1440 },
      Luxury: { min: 1440, max: 2160 },
    },
    'Trial Rooms': {
      kind: 'flat',
      Essential: { min: 54000, max: 90000 },
      Comfort: { min: 81000, max: 135000 },
      Luxury: { min: 108000, max: 180000 },
    },
    'Checkout & POS': {
      kind: 'flat',
      Essential: { min: 45000, max: 90000 },
      Comfort: { min: 72000, max: 108000 },
      Luxury: { min: 90000, max: 162000 },
    },
    'Storage & Back Office': {
      kind: 'flat',
      Essential: { min: 36000, max: 72000 },
      Comfort: { min: 54000, max: 90000 },
      Luxury: { min: 81000, max: 135000 },
    },
  },
}

export function formatInr(n) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(Math.round(n))
}

export function formatInrRange(low, high) {
  return `${formatInr(low)} — ${formatInr(high)}`
}

export function formatLakh(n) {
  const lakh = n / 100000
  return `₹${lakh % 1 === 0 ? lakh.toFixed(0) : lakh.toFixed(1)} Lakh`
}

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
  return unit === 'sqmt' ? n * SQMT_TO_SQFT : n
}

export function bedroomCountFromBhk(bhk) {
  const map = {
    '1 BHK': 1,
    '2 BHK': 2,
    '3 BHK': 3,
    '4 BHK': 4,
    '4 BHK+': 5,
  }
  return map[bhk] || 1
}

export function computeEstimate(propertyType, scopeKeys, areaSqft, tier = 'Comfort', bedroomCount = 2) {
  const table = SCOPE_RATES[propertyType] || {}
  const breakdown = []
  let totalMin = 0
  let totalMax = 0

  for (const label of scopeKeys) {
    const rate = table[label]
    if (!rate) continue
    const tierRate = rate[tier] || rate['Comfort']
    let cMin = 0
    let cMax = 0
    let line = ''

    if (rate.kind === 'sqft') {
      cMin = tierRate.min * areaSqft
      cMax = tierRate.max * areaSqft
      line = `${formatInr(tierRate.min)} — ${formatInr(tierRate.max)} / sq ft → ${formatInr(cMin)} — ${formatInr(cMax)}`
    } else if (rate.kind === 'perRoom') {
      cMin = tierRate.min * bedroomCount
      cMax = tierRate.max * bedroomCount
      line = `${formatInr(tierRate.min)} — ${formatInr(tierRate.max)} × ${bedroomCount} ${bedroomCount === 1 ? 'room' : 'rooms'} → ${formatInr(cMin)} — ${formatInr(cMax)}`
    } else {
      cMin = tierRate.min
      cMax = tierRate.max
      line = `${formatInr(cMin)} — ${formatInr(cMax)}`
    }

    totalMin += cMin
    totalMax += cMax
    breakdown.push({ label, low: cMin, high: cMax, line })
  }

  return { breakdown, totalMin, totalMax }
}
