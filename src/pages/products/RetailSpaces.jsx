import ProductSubPage from '../../components/products/ProductSubPage'
import { IMAGES } from '../../config/images'

const altA = 'Corporate reception — Maywood Interiors Bangalore'
const altB = 'Hospitality lounge interior — Maywood Interiors Bangalore'

const scopeCards = [
  {
    title: 'Storefront & Façade',
    body: 'The first 3 seconds of customer experience.',
    imageSrc: '/assets/images/generated/retail-storefront-facade.png',
    imageAlt: altA,
  },
  {
    title: 'Display Fixtures',
    body: 'Gondolas, wall systems, island units — all manufactured in-house.',
    imageSrc: IMAGES.spas.waiting,
    imageAlt: altB,
  },
  {
    title: 'Trial Rooms',
    body: 'Lighting, mirrors, space — the moment decisions are made.',
    imageSrc: IMAGES.corporate.reception,
    imageAlt: altA,
  },
  {
    title: 'Checkout & POS',
    body: 'Flow-optimised layouts that reduce abandonment.',
    imageSrc: IMAGES.spas.waiting,
    imageAlt: altB,
  },
  {
    title: 'Storage & Back Office',
    body: 'Clean, efficient operational spaces behind the scenes.',
    imageSrc: '/assets/images/generated/retail-storage-backoffice.png',
    imageAlt: altA,
  },
  {
    title: 'Signage Integration',
    body: 'Structural provisions for brand signage and digital displays.',
    imageSrc: IMAGES.spas.waiting,
    imageAlt: altB,
  },
]

export default function RetailSpaces() {
  return (
    <ProductSubPage
      breadcrumbName="Retail Spaces"
      categoryTag="Retail"
      heroHeadline="Interiors that sell before your staff does."
      heroItalicFromIndex={4}
      heroSubtext="Retail fit-outs designed to maximize footfall, increase dwell time, and drive purchase decisions through environment."
      heroImageSrc={IMAGES.spas.waiting}
      heroImageAlt="Hospitality lounge interior — Maywood Interiors Bangalore"
      overviewHeading="The fit-out is your first salesperson."
      overviewBody="We design around sightlines, dwell zones, and conversion paths — then build fixtures in our factory so you reopen faster with finishes that survive heavy footfall."
      overviewFeatures={[
        'VM (visual merchandising) led design',
        'Fast-track execution to minimize closure time',
        'Durable materials for high foot-traffic zones',
      ]}
      overviewImageSrc={IMAGES.corporate.reception}
      overviewImageAlt="Corporate reception — Maywood Interiors Bangalore"
      scopeAnimatedTitle="From façade to fitting room."
      scopeCards={scopeCards}
      processSectionId="process-retail"
    />
  )
}
