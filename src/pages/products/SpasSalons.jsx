import ProductSubPage from '../../components/products/ProductSubPage'

const scopeCards = [
  {
    title: 'Reception & Waiting',
    body: 'First impressions that build anticipation and trust.',
  },
  {
    title: 'Treatment Rooms',
    body: 'Privacy, acoustics, lighting — every detail considered.',
  },
  {
    title: 'Styling Stations',
    body: 'Mirror layouts, lighting rigs, storage for tools and products.',
  },
  {
    title: 'Retail Display',
    body: 'Product shelving designed to drive in-salon purchases.',
  },
  {
    title: 'Staff Areas',
    body: 'Functional, dignified back-of-house spaces.',
  },
  {
    title: 'Washrooms',
    body: 'Premium finishes that reinforce your brand at every touchpoint.',
  },
]

export default function SpasSalons() {
  return (
    <ProductSubPage
      breadcrumbName="Spas & Salons"
      categoryTag="Wellness"
      heroHeadline="Spaces that make clients come back."
      heroItalicFromIndex={4}
      heroSubtext="Sensory environments for salons, spas and wellness centres — designed for experience, built to withstand daily professional use."
      overviewHeading="Where atmosphere is your product."
      overviewBody="Wellness brands live or die on ambience, hygiene, and durability. We specify moisture-smart materials, integrate services cleanly, and choreograph layouts for peak-hour flow without compromising the calm."
      overviewFeatures={[
        'Moisture-resistant materials throughout',
        'Concealed wiring and plumbing integration',
        'Designed for peak-hour operational flow',
      ]}
      overviewImageLabel="Wellness interior"
      scopeAnimatedTitle="Designed for the experience."
      scopeCards={scopeCards}
      processSectionId="process-spas-salons"
    />
  )
}
