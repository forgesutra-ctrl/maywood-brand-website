import ProductSubPage from '../../components/products/ProductSubPage'
import { IMAGES } from '../../config/images'

const scopeCards = [
  {
    title: 'Reception & Waiting',
    body: 'First impressions that build anticipation and trust.',
    imageSrc: IMAGES.spas.waiting,
    imageAlt: 'Spa waiting lounge — Maywood Interiors Bangalore',
  },
  {
    title: 'Treatment Rooms',
    body: 'Privacy, acoustics, lighting — every detail considered.',
    imageSrc: IMAGES.spas.treatmentRoom,
    imageAlt: 'Spa treatment room — Maywood Interiors Bangalore',
  },
  {
    title: 'Styling Stations',
    body: 'Mirror layouts, lighting rigs, storage for tools and products.',
    imageSrc: IMAGES.spas.salonStation,
    imageAlt: 'Salon styling station — Maywood Interiors Bangalore',
  },
  {
    title: 'Retail Display',
    body: 'Product shelving designed to drive in-salon purchases.',
    imageSrc: '/assets/images/generated/spa-retail-display.png',
    imageAlt: 'Wellness retail display area — Maywood Interiors Bangalore',
  },
  {
    title: 'Staff Areas',
    body: 'Functional, dignified back-of-house spaces.',
    imageSrc: '/assets/images/generated/spa-staff-areas.png',
    imageAlt: 'Spa reception — Maywood Interiors Bangalore',
  },
  {
    title: 'Washrooms',
    body: 'Premium finishes that reinforce your brand at every touchpoint.',
    imageSrc: IMAGES.spas.treatmentRoom,
    imageAlt: 'Wellness interior — Maywood Interiors Bangalore',
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
      heroImageSrc={IMAGES.spas.hero}
      heroImageAlt="Spa reception — Maywood Interiors Bangalore"
      overviewHeading="Where atmosphere is your product."
      overviewBody="Wellness brands live or die on ambience, hygiene, and durability. We specify moisture-smart materials, integrate services cleanly, and choreograph layouts for peak-hour flow without compromising the calm."
      overviewFeatures={[
        'Moisture-resistant materials throughout',
        'Concealed wiring and plumbing integration',
        'Designed for peak-hour operational flow',
      ]}
      overviewImageSrc={IMAGES.spas.treatmentRoom}
      overviewImageAlt="Spa treatment room — Maywood Interiors Bangalore"
      scopeAnimatedTitle="Designed for the experience."
      scopeCards={scopeCards}
      processSectionId="process-spas-salons"
    />
  )
}
