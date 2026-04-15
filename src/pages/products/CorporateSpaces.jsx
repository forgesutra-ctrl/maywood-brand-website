import ProductSubPage from '../../components/products/ProductSubPage'

const scopeCards = [
  {
    title: 'Open Workstations',
    body: 'Modular desk systems, cable management, acoustic panels.',
  },
  {
    title: 'Cabin & Conference',
    body: 'Executive cabins, boardrooms, VC-ready meeting rooms.',
  },
  {
    title: 'Reception & Lobbies',
    body: 'First-impression spaces that communicate brand value.',
  },
  {
    title: 'Breakout & Café Areas',
    body: 'Collaborative zones that improve retention and culture.',
  },
  {
    title: 'IT & Server Rooms',
    body: 'Raised flooring, cable trays, precision fit-outs.',
  },
  {
    title: 'Retail Banking / Finance',
    body: 'Compliance-friendly layouts with premium finishes.',
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
      overviewHeading="Scale without compromise."
      overviewBody="Commercial programmes need programme management, factory throughput, and site discipline. We align design intent with procurement and installation so large rollouts stay consistent and on schedule."
      overviewFeatures={[
        'Dedicated commercial project manager',
        'Factory production for speed at scale',
        'Post-handover AMC available',
      ]}
      overviewImageLabel="Office fit-out"
      scopeAnimatedTitle="Built for scale. Delivered on schedule."
      scopeCards={scopeCards}
      processSectionId="process-corporate"
    />
  )
}
