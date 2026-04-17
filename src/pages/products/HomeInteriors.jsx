import ProductSubPage from '../../components/products/ProductSubPage'
import { IMAGES } from '../../config/images'

const scopeCards = [
  {
    title: 'Modular Kitchens',
    body: 'Hettich fittings, Maywood Plys carcass, laminates and shutters tailored to your cooking style.',
    imageSrc: IMAGES.kitchens.secondary,
    imageAlt: 'Modular kitchen design — Maywood Interiors Bangalore',
  },
  {
    title: 'Wardrobes & Storage',
    body: 'Floor-to-ceiling, walk-in, sliding — every configuration, engineered for your room.',
    imageSrc: IMAGES.wardrobes.hero,
    imageAlt: 'Wardrobe interior — Maywood Interiors Bangalore',
  },
  {
    title: 'Living & Dining',
    body: 'TV units, crockery units, display shelving, false ceilings.',
    imageSrc: IMAGES.livingRooms.tvWall,
    imageAlt: 'Living room TV wall — Maywood Interiors Bangalore',
  },
  {
    title: 'Bedrooms',
    body: 'Bed frames, side tables, study units — all manufactured in-house.',
    imageSrc: IMAGES.bedrooms.hero,
    imageAlt: 'Master bedroom interior — Maywood Interiors Bangalore',
  },
  {
    title: 'Home Office',
    body: 'Ergonomic layouts, cable management, acoustic considerations.',
    imageSrc: '/assets/images/generated/home-office.png',
    imageAlt: 'Home office interior — Maywood Interiors Bangalore',
  },
  {
    title: 'Pooja / Custom',
    body: 'Dedicated pooja units, mandir niches, and bespoke joinery tailored to your rituals and space.',
    imageSrc: IMAGES.pooja.hero,
    imageAlt: 'Pooja unit — Maywood Interiors Bangalore',
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
      heroImageSrc={IMAGES.livingRooms.hero}
      heroImageAlt="Premium Indian living room interior — Maywood Interiors Bangalore"
      overviewHeading="Complete home transformation, one team."
      overviewBody="We plan every zone for real daily use — storage, circulation, finishes, and lighting — then manufacture and install with our own factory and site teams. One contract, one timeline, no hand-offs to unknown vendors."
      overviewFeatures={[
        'In-house plywood throughout',
        '3D visualisation before production',
        '45-day average completion',
      ]}
      overviewImageSrc={IMAGES.livingRooms.wide}
      overviewImageAlt="Living and dining interior — Maywood Interiors Bangalore"
      scopeAnimatedTitle="Every room. One timeline."
      scopeCards={scopeCards}
      processSectionId="process-home-interiors"
    />
  )
}
