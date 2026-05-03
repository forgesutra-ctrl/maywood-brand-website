export const SQMT_TO_SQFT = 10.7639

/** Master scope selections: mutually exclusive with line items; estimate uses only this sqft rate when selected. */
export const MASTER_SCOPE_BY_PROPERTY_TYPE = {
  Residential: 'Full Home Interiors',
  Commercial: 'Full Office Fit-out',
  Retail: 'Full Store Fit-out',
}

export function getMasterScopeKey(propertyType) {
  return MASTER_SCOPE_BY_PROPERTY_TYPE[propertyType] ?? null
}

/** Keys passed to estimate: when master is selected, ignore all other scopes (UI may still mirror selections). */
export function scopeKeysForEstimate(propertyType, scopeKeys) {
  const master = getMasterScopeKey(propertyType)
  if (!master || !scopeKeys.includes(master)) return scopeKeys
  return [master]
}

export const QUALITY_TIERS = {
  Premium: {
    label: 'Premium',
    tagline: 'For the budget conscious',
    material: 'Plywood with Laminate',
    finish: 'Matte Laminate',
    hardware: 'Ebco',
    warranty: '10 Years',
  },
  'Premium Plus': {
    label: 'Premium Plus',
    tagline: 'For the value conscious',
    material: 'Plywood and HDHMR',
    finish: 'Matte / High Gloss, 500+ designs',
    hardware: 'Hettich',
    warranty: '10 Years',
    popular: true,
  },
  Luxury: {
    label: 'Luxury',
    tagline: 'Best of design & style',
    material: 'BWP Plywood',
    finish: 'Gloss / Acrylic / Rattan / Duco',
    hardware: 'Hettich',
    warranty: '10 Years',
  },
}

// All rates are Maywood rates (10% below Bangalore market)
// Flat rates are per item. sqft rates are per sq ft. perRoom rates are per bedroom.
export const SCOPE_RATES = {
  Residential: {
    'Full Home Interiors': {
      kind: 'sqft',
      Premium: { min: 700, max: 900 },
      'Premium Plus': { min: 900, max: 1200 },
      Luxury: { min: 1200, max: 2000 },
    },
    'Modular Kitchen': {
      kind: 'flat',
      Premium: { min: 135000, max: 225000 },
      'Premium Plus': { min: 225000, max: 360000 },
      Luxury: { min: 360000, max: 630000 },
    },
    'Wardrobes & Storage': {
      kind: 'perRoom',
      Premium: { min: 36000, max: 67500 },
      'Premium Plus': { min: 67500, max: 108000 },
      Luxury: { min: 108000, max: 162000 },
    },
    'Living & Dining': {
      kind: 'flat',
      Premium: { min: 72000, max: 135000 },
      'Premium Plus': { min: 135000, max: 225000 },
      Luxury: { min: 225000, max: 360000 },
    },
    Bedrooms: {
      kind: 'perRoom',
      Premium: { min: 54000, max: 90000 },
      'Premium Plus': { min: 90000, max: 162000 },
      Luxury: { min: 162000, max: 270000 },
    },
    'Home Office': {
      kind: 'flat',
      Premium: { min: 54000, max: 108000 },
      'Premium Plus': { min: 90000, max: 162000 },
      Luxury: { min: 135000, max: 225000 },
    },
    'Pooja Room': {
      kind: 'flat',
      Premium: { min: 31500, max: 54000 },
      'Premium Plus': { min: 45000, max: 72000 },
      Luxury: { min: 63000, max: 108000 },
    },
    Bathrooms: {
      kind: 'perRoom',
      Premium: { min: 45000, max: 81000 },
      'Premium Plus': { min: 67500, max: 108000 },
      Luxury: { min: 108000, max: 180000 },
    },
    Balcony: {
      kind: 'flat',
      Premium: { min: 27000, max: 45000 },
      'Premium Plus': { min: 40500, max: 63000 },
      Luxury: { min: 58500, max: 90000 },
    },
  },
  Commercial: {
    'Full Office Fit-out': {
      kind: 'sqft',
      Premium: { min: 700, max: 900 },
      'Premium Plus': { min: 900, max: 1200 },
      Luxury: { min: 1200, max: 2000 },
    },
    'Open Workstations': {
      kind: 'sqft',
      Premium: { min: 810, max: 1260 },
      'Premium Plus': { min: 1260, max: 1980 },
      Luxury: { min: 1800, max: 2700 },
    },
    'Cabin & Conference': {
      kind: 'sqft',
      Premium: { min: 1080, max: 1620 },
      'Premium Plus': { min: 1620, max: 2340 },
      Luxury: { min: 2340, max: 3600 },
    },
    'Reception & Lobby': {
      kind: 'sqft',
      Premium: { min: 900, max: 1440 },
      'Premium Plus': { min: 1440, max: 2160 },
      Luxury: { min: 2160, max: 3240 },
    },
    'Breakout Areas': {
      kind: 'sqft',
      Premium: { min: 720, max: 1080 },
      'Premium Plus': { min: 1080, max: 1620 },
      Luxury: { min: 1620, max: 2520 },
    },
    'IT & Server Room': {
      kind: 'flat',
      Premium: { min: 108000, max: 180000 },
      'Premium Plus': { min: 135000, max: 225000 },
      Luxury: { min: 180000, max: 270000 },
    },
  },
  Retail: {
    'Full Store Fit-out': {
      kind: 'sqft',
      Premium: { min: 700, max: 900 },
      'Premium Plus': { min: 900, max: 1200 },
      Luxury: { min: 1200, max: 2000 },
    },
    'Storefront & Façade': {
      kind: 'sqft',
      Premium: { min: 720, max: 1260 },
      'Premium Plus': { min: 1260, max: 1980 },
      Luxury: { min: 1980, max: 2880 },
    },
    'Display Fixtures': {
      kind: 'sqft',
      Premium: { min: 540, max: 900 },
      'Premium Plus': { min: 900, max: 1440 },
      Luxury: { min: 1440, max: 2160 },
    },
    'Trial Rooms': {
      kind: 'flat',
      Premium: { min: 54000, max: 90000 },
      'Premium Plus': { min: 81000, max: 135000 },
      Luxury: { min: 108000, max: 180000 },
    },
    'Checkout & POS': {
      kind: 'flat',
      Premium: { min: 45000, max: 90000 },
      'Premium Plus': { min: 72000, max: 108000 },
      Luxury: { min: 90000, max: 162000 },
    },
    'Storage & Back Office': {
      kind: 'flat',
      Premium: { min: 36000, max: 72000 },
      'Premium Plus': { min: 54000, max: 90000 },
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

export function emiMonthly(principal, annualRate = 0.07, months = 36) {
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

export function computeEstimate(propertyType, scopeKeys, areaSqft, tier = 'Premium Plus', bedroomCount = 2) {
  const keys = scopeKeysForEstimate(propertyType, scopeKeys)
  const table = SCOPE_RATES[propertyType] || {}
  const breakdown = []
  let totalMin = 0
  let totalMax = 0

  for (const label of keys) {
    const rate = table[label]
    if (!rate) continue
    const tierRate = rate[tier] || rate['Premium Plus']
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
