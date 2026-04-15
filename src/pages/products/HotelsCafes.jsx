import ProductSubPage from '../../components/products/ProductSubPage'

const scopeCards = [
  {
    title: 'Restaurant Dining Areas',
    body: 'Table layouts, banquettes, acoustic management.',
  },
  {
    title: 'Cafes & Coffee Bars',
    body: 'Counter design, seating mix, brand-led material palette.',
  },
  {
    title: 'Hotel Lobbies & Rooms',
    body: 'Scalable room fit-outs, furniture packages.',
  },
  {
    title: 'Bars & Lounges',
    body: 'Backbar, booth seating, feature walls that become the brand.',
  },
  {
    title: 'Kitchen & Back-of-House',
    body: 'Functional, regulation-compliant fit-outs.',
  },
  {
    title: 'Event Spaces',
    body: 'Flexible environments for banquets, conferences, private dining.',
  },
]

export default function HotelsCafes() {
  return (
    <ProductSubPage
      breadcrumbName="Hotels, Cafes & Restaurants"
      categoryTag="Hospitality"
      heroHeadline="Atmosphere is revenue. We build both."
      heroItalicFromIndex={3}
      heroSubtext="Cafes, restaurants, hotels, and F&B spaces — immersive environments that command premium pricing and drive repeat visits."
      overviewHeading="Designed for experience. Built for operations."
      overviewBody="Hospitality interiors must balance guest emotion with BOH efficiency. We coordinate acoustics and lighting, specify cleanable surfaces, and engineer circulation so service stays smooth during rush hours."
      overviewFeatures={[
        'F&B operational flow integrated into design',
        'Acoustic and lighting design coordination',
        'Durable, cleanable surfaces throughout',
      ]}
      overviewImageLabel="Hospitality interior"
      scopeAnimatedTitle="Front-of-house to back-of-house."
      scopeCards={scopeCards}
      processSectionId="process-hospitality"
    />
  )
}
