import ProductSubPage from '../../components/products/ProductSubPage'
import { IMAGES } from '../../config/images'

const scopeCards = [
  {
    title: 'Open Workstations',
    body: 'Modular desk systems, cable management, acoustic panels.',
    imageSrc: IMAGES.corporate.workstations,
    imageAlt: 'Corporate open-plan workstations — Maywood Interiors Bangalore',
  },
  {
    title: 'Cabin & Conference',
    body: 'Executive cabins, boardrooms, VC-ready meeting rooms.',
    imageSrc: IMAGES.corporate.conference,
    imageAlt: 'Conference room — Maywood Interiors Bangalore',
  },
  {
    title: 'Reception & Lobbies',
    body: 'First-impression spaces that communicate brand value.',
    imageSrc: IMAGES.corporate.reception,
    imageAlt: 'Corporate reception — Maywood Interiors Bangalore',
  },
  {
    title: 'Breakout & Café Areas',
    body: 'Collaborative zones that improve retention and culture.',
    imageSrc: IMAGES.corporate.breakout,
    imageAlt: 'Office breakout lounge — Maywood Interiors Bangalore',
  },
  {
    title: 'IT & Server Rooms',
    body: 'Raised flooring, cable trays, precision fit-outs.',
    imageSrc: '/assets/images/generated/it-server-room.png',
    imageAlt: 'Corporate workstations — Maywood Interiors Bangalore',
  },
  {
    title: 'Retail Banking / Finance',
    body: 'Compliance-friendly layouts with premium finishes.',
    imageSrc: '/assets/images/generated/corporate-retail-banking.png',
    imageAlt: 'Corporate office interior — Maywood Interiors Bangalore',
  },
]

export default function CorporateSpaces() {
  return (
    <ProductSubPage
      breadcrumbName="Corporate & Office Spaces"
      categoryTag="Commercial"
      heroHeadline="Workspaces that reflect your ambition."
      heroItalicFromIndex={3}
      heroSubtext="From 500 to 50,000 sq ft — office interiors designed for culture, productivity, and brand identity."
      heroImageSrc={IMAGES.corporate.hero}
      heroImageAlt="Corporate office interior — Maywood Interiors Bangalore"
      overviewHeading="Scale without compromise."
      overviewBody="Commercial programmes need programme management, factory throughput, and site discipline. We align design intent with procurement and installation so large rollouts stay consistent and on schedule."
      overviewFeatures={[
        'Dedicated commercial project manager',
        'Factory production for speed at scale',
        'Post-handover AMC available',
      ]}
      overviewImageSrc={IMAGES.corporate.reception}
      overviewImageAlt="Corporate reception — Maywood Interiors Bangalore"
      scopeAnimatedTitle="Built for scale. Delivered on schedule."
      scopeCards={scopeCards}
      processSectionId="process-corporate"
    />
  )
}
