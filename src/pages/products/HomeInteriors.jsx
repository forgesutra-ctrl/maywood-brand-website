import ProductSubPage from '../../components/products/ProductSubPage'

const scopeCards = [
  {
    title: 'Modular Kitchens',
    body: 'Hettich fittings, Maywood Plys carcass, laminates and shutters tailored to your cooking style.',
  },
  {
    title: 'Wardrobes & Storage',
    body: 'Floor-to-ceiling, walk-in, sliding — every configuration, engineered for your room.',
  },
  {
    title: 'Living & Dining',
    body: 'TV units, crockery units, display shelving, false ceilings.',
  },
  {
    title: 'Bedrooms',
    body: 'Bed frames, side tables, study units — all manufactured in-house.',
  },
  {
    title: 'Home Office',
    body: 'Ergonomic layouts, cable management, acoustic considerations.',
  },
  {
    title: 'Bathrooms',
    body: 'Vanity units, mirror frames, storage — finishing details that matter.',
  },
]

export default function HomeInteriors() {
  return (
    <ProductSubPage
      breadcrumbName="Home Interiors"
      categoryTag="Residential"
      heroHeadline="Your home, designed to live in."
      heroItalicFromIndex={4}
      heroSubtext="Full-home interiors built around how Bangalore families actually use their spaces — not just how they look in a render."
      overviewHeading="Complete home transformation, one team."
      overviewBody="We plan every zone for real daily use — storage, circulation, finishes, and lighting — then manufacture and install with our own factory and site teams. One contract, one timeline, no hand-offs to unknown vendors."
      overviewFeatures={[
        'In-house plywood throughout',
        '3D visualisation before production',
        '45-day average completion',
      ]}
      overviewImageLabel="Residential project"
      scopeAnimatedTitle="Every room. One timeline."
      scopeCards={scopeCards}
      processSectionId="process-home-interiors"
    />
  )
}
