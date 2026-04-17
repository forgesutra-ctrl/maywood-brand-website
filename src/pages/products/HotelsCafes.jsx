import ProductSubPage from '../../components/products/ProductSubPage'
import { IMAGES } from '../../config/images'

const altBreakout = 'Office breakout lounge — Maywood Interiors Bangalore'
const altWaiting = 'Hospitality lounge interior — Maywood Interiors Bangalore'

const scopeCards = [
  {
    title: 'Restaurant Dining Areas',
    body: 'Table layouts, banquettes, acoustic management.',
    imageSrc: IMAGES.corporate.breakout,
    imageAlt: altBreakout,
  },
  {
    title: 'Cafes & Coffee Bars',
    body: 'Counter design, seating mix, brand-led material palette.',
    imageSrc: IMAGES.spas.waiting,
    imageAlt: altWaiting,
  },
  {
    title: 'Hotel Lobbies & Rooms',
    body: 'Scalable room fit-outs, furniture packages.',
    imageSrc: IMAGES.corporate.breakout,
    imageAlt: altBreakout,
  },
  {
    title: 'Bars & Lounges',
    body: 'Backbar, booth seating, feature walls that become the brand.',
    imageSrc: IMAGES.spas.waiting,
    imageAlt: altWaiting,
  },
  {
    title: 'Kitchen & Back-of-House',
    body: 'Functional, regulation-compliant fit-outs.',
    imageSrc: '/assets/images/generated/hospitality-kitchen-boh.png',
    imageAlt: altBreakout,
  },
  {
    title: 'Event Spaces',
    body: 'Flexible environments for banquets, conferences, private dining.',
    imageSrc: '/assets/images/generated/hospitality-event-spaces.png',
    imageAlt: altWaiting,
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
      heroImageSrc={IMAGES.spas.waiting}
      heroImageAlt="Hospitality lounge interior — Maywood Interiors Bangalore"
      overviewHeading="Designed for experience. Built for operations."
      overviewBody="Hospitality interiors must balance guest emotion with BOH efficiency. We coordinate acoustics and lighting, specify cleanable surfaces, and engineer circulation so service stays smooth during rush hours."
      overviewFeatures={[
        'F&B operational flow integrated into design',
        'Acoustic and lighting design coordination',
        'Durable, cleanable surfaces throughout',
      ]}
      overviewImageSrc={IMAGES.corporate.breakout}
      overviewImageAlt="Office breakout lounge — Maywood Interiors Bangalore"
      scopeAnimatedTitle="Front-of-house to back-of-house."
      scopeCards={scopeCards}
      processSectionId="process-hospitality"
    />
  )
}
