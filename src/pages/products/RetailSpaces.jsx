import ProductSubPage from '../../components/products/ProductSubPage'

const scopeCards = [
  {
    title: 'Storefront & Façade',
    body: 'The first 3 seconds of customer experience.',
  },
  {
    title: 'Display Fixtures',
    body: 'Gondolas, wall systems, island units — all manufactured in-house.',
  },
  {
    title: 'Trial Rooms',
    body: 'Lighting, mirrors, space — the moment decisions are made.',
  },
  {
    title: 'Checkout & POS',
    body: 'Flow-optimised layouts that reduce abandonment.',
  },
  {
    title: 'Storage & Back Office',
    body: 'Clean, efficient operational spaces behind the scenes.',
  },
  {
    title: 'Signage Integration',
    body: 'Structural provisions for brand signage and digital displays.',
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
      overviewHeading="The fit-out is your first salesperson."
      overviewBody="We design around sightlines, dwell zones, and conversion paths — then build fixtures in our factory so you reopen faster with finishes that survive heavy footfall."
      overviewFeatures={[
        'VM (visual merchandising) led design',
        'Fast-track execution to minimize closure time',
        'Durable materials for high foot-traffic zones',
      ]}
      overviewImageLabel="Retail fit-out"
      scopeAnimatedTitle="From façade to fitting room."
      scopeCards={scopeCards}
      processSectionId="process-retail"
    />
  )
}
