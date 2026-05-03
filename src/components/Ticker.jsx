const homeItems = [
  'Bangalore-Based',
  '100+ Projects',
  '10 Year Warranty',
  'In-House Plywood',
  'Own Manufacturing Facility',
  'Flexible EMI',
  'ISO 9001 & 45001',
  'End-to-End Execution',
]

const teamItems = [
  '50+ Team Members',
  '2 Years',
  '100+ Projects Delivered',
  '1 Shared Vision',
]

/** Four concatenated loops for marquee width — timing/spacing unchanged on track. */
function buildRepeatedItems(items) {
  return [...items, ...items, ...items, ...items]
}

function MarqueeStrip({ stripId, repeated }) {
  return (
    <div className="flex shrink-0 items-center">
      {repeated.map((item, i) => (
        <span key={`${stripId}-${i}`} style={{ display: 'inline-flex', alignItems: 'center', gap: 0 }}>
          <span
            style={{
              padding: '0 28px',
              fontSize: '10px',
              fontWeight: '600',
              letterSpacing: '2px',
              textTransform: 'uppercase',
              color: '#c9a465',
              whiteSpace: 'nowrap',
            }}
          >
            {item}
          </span>
          <span style={{ color: 'rgba(201,164,101,0.4)', fontSize: '8px' }} aria-hidden>
            ◆
          </span>
        </span>
      ))}
    </div>
  )
}

export default function Ticker({ type = 'home' }) {
  const items = type === 'team' ? teamItems : homeItems
  const repeated = buildRepeatedItems(items)

  return (
    <div className="bg-[#1a1612]">
      <div className="flex h-[40px] items-center overflow-hidden">
        <div className="home-marquee-track flex" style={{ display: 'flex', width: 'fit-content' }}>
          <MarqueeStrip stripId="a" repeated={repeated} />
          <MarqueeStrip stripId="b" repeated={repeated} />
        </div>
      </div>
    </div>
  )
}
