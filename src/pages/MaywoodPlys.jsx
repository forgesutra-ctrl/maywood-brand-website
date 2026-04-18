import { createElement } from 'react'
import { Link } from 'react-router-dom'
import { Droplet, Layers, Shield } from 'lucide-react'
import SectionLabel from '../components/ui/SectionLabel'
import AnimatedText from '../components/ui/AnimatedText'
import { buttonClasses } from '../lib/buttonStyles'
import { IMAGES } from '../config/images'

/** Home section uses `/images/maywood-premium-plywood-label.png`; sheet JPG may live under assets */
const PLYWOOD_SHEET_SRC_PRIMARY = '/assets/images/maywood-plys-sheet.jpg'
const PLYWOOD_SHEET_SRC_FALLBACK = '/images/maywood-premium-plywood-label.png'

const TRUST_BADGES = [
  {
    Icon: Shield,
    title: 'Termite Proof',
    subtext: 'Factory-treated against termite infestation',
  },
  {
    Icon: Droplet,
    title: 'Moisture Resistant',
    subtext: "BWR grade — built for Bangalore's climate",
  },
  {
    Icon: Layers,
    title: '11-Layer Core',
    subtext: 'Semi-hardwood core for superior strength',
  },
]

function onPlySheetImgError(e) {
  const el = e.currentTarget
  if (el.src.includes('maywood-plys-sheet.jpg')) {
    el.src = PLYWOOD_SHEET_SRC_FALLBACK
  } else {
    el.src = '/assets/images/fallback.jpg'
  }
}

const PLY_COMPARISON_ROWS = [
  {
    feature: 'Source',
    maywood: 'In-house manufactured',
    market: 'Third-party supplier',
    marketPrefix: 'cross',
  },
  {
    feature: 'Grade',
    maywood: 'IS: 303 certified',
    market: 'Often unverified',
    marketPrefix: 'cross',
  },
  {
    feature: 'Standard',
    maywood: 'BWR / MR Grade',
    market: 'Varies by vendor',
    marketPrefix: 'dash',
  },
  {
    feature: 'Core Material',
    maywood: '11 Layers Semi Hardwood',
    market: 'Unknown layers',
    marketPrefix: 'cross',
  },
  {
    feature: 'Glue Type',
    maywood: 'MUF – Melamine Urea Formaldehyde',
    market: 'Often UF (lower grade)',
    marketPrefix: 'cross',
  },
  {
    feature: 'Termite Resistance',
    maywood: 'Yes — treated',
    market: 'Not guaranteed',
    marketPrefix: 'cross',
  },
  {
    feature: 'Moisture Resistance',
    maywood: 'Yes — BWR grade',
    market: 'Varies',
    marketPrefix: 'dash',
  },
  {
    feature: 'Price Markup',
    maywood: 'Zero — direct to project',
    market: '20–40% supplier markup',
    marketPrefix: 'cross',
  },
  {
    feature: 'Quality Control',
    maywood: 'Factory inspected every batch',
    market: 'No visibility',
    marketPrefix: 'cross',
  },
  {
    feature: 'Warranty',
    maywood: 'Backed by Maywood',
    market: 'No accountability',
    marketPrefix: 'cross',
  },
]

export default function MaywoodPlys() {
  return (
    <main className="flex-1">
      <section className="relative flex min-h-[60vh] flex-col justify-center overflow-hidden px-6 py-24 lg:px-24">
        <img
          src={IMAGES.kitchens.hero}
          alt="Modular kitchen design — Maywood Interiors Bangalore"
          loading="eager"
          className="absolute inset-0 w-full h-full object-cover object-center block"
          onError={(e) => {
            e.currentTarget.src = '/assets/images/fallback.jpg'
          }}
        />
        <div className="absolute inset-0 bg-[#1C1915]/70" aria-hidden />
        <div className="relative z-[2] mx-auto w-full max-w-[1400px]">
          <SectionLabel light>Maywood Plys</SectionLabel>
          <AnimatedText
            text="In-house plywood. Better pricing. Full traceability."
            tag="h1"
            getWordClassName={(_w, i) => (i >= 3 ? 'italic text-[#D4B483]' : '')}
            className="mt-8 max-w-[900px] font-display text-[clamp(36px,5vw,56px)] font-light leading-[1.08] text-brand-ivory"
          />
          <p className="mt-6 max-w-[520px] font-body text-[15px] font-normal leading-[1.85] text-brand-mist-light">
            Our own plywood range cuts supplier markups and gives every Maywood project a consistent, certified core — from
            kitchens to commercial fit-outs.
          </p>
          <div className="mt-10 flex w-full max-w-xl flex-col gap-4 sm:max-w-none sm:flex-row sm:items-center">
            <Link
              to="/#consultation"
              className={['inline-flex w-full justify-center sm:w-auto', buttonClasses('primary')].join(' ')}
            >
              Talk to a Materials Specialist
            </Link>
            <Link
              to="/experience-centers"
              className={[
                'inline-flex w-full justify-center sm:w-auto',
                buttonClasses('ghost', 'text-brand-brass-light hover:border-brand-brass-light'),
              ].join(' ')}
            >
              Book free consultation
            </Link>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-[11fr_9fr]">
        <div className="relative flex min-h-[420px] flex-col items-center justify-center bg-[#1a1612] px-8 py-16 lg:min-h-[520px] lg:px-12 lg:py-20">
          <div className="relative w-full max-w-[min(100%,440px)] -rotate-3 shadow-2xl">
            <div className="rounded-sm bg-[#f5f0eb]/95 p-6 sm:p-8 ring-1 ring-[rgba(184,150,90,0.35)]">
              <img
                src={PLYWOOD_SHEET_SRC_PRIMARY}
                alt="Maywood Plys certified plywood sheet — IS:303, BWR grade"
                loading="lazy"
                className="mx-auto block h-auto w-full max-h-[min(65vh,480px)] object-contain object-center"
                onError={onPlySheetImgError}
              />
            </div>
          </div>
          <p className="mx-auto mt-10 max-w-[400px] text-center font-body text-[11px] font-medium uppercase leading-relaxed tracking-[0.14em] text-brand-brass sm:text-[12px]">
            IS:303 Certified · BWR Grade · CML No. CM/L-6400083602
          </p>
        </div>
        <div className="flex flex-col justify-center bg-brand-ivory px-6 py-16 lg:px-12 lg:py-20 xl:pr-24">
          <SectionLabel>Why Maywood Plys</SectionLabel>
          <h2 className="mt-6 font-display text-[clamp(28px,3.5vw,36px)] font-normal leading-[1.12] text-brand-charcoal">
            Grade you can specify. Supply you can trust.
          </h2>
          <p className="mt-6 font-body text-[14px] font-normal leading-[1.9] text-brand-mist">
            We manufacture and season our own boards, so moisture content, bonding and dimensional stability stay within
            tight tolerances — the foundation for furniture that lasts in Bangalore&apos;s climate.
          </p>
          <div className="mt-10 flex flex-col gap-4">
            {TRUST_BADGES.map(({ Icon, title, subtext }) => (
              <div
                key={title}
                className="flex gap-4 border-l border-brand-brass bg-[#1a1612] px-4 py-4 sm:px-5"
              >
                {createElement(Icon, {
                  className: 'mt-0.5 h-5 w-5 shrink-0 text-brand-brass',
                  strokeWidth: 1.5,
                  'aria-hidden': true,
                })}
                <div className="min-w-0">
                  <p className="font-body text-[15px] font-medium leading-snug text-white">{title}</p>
                  <p className="mt-1 font-body text-[13px] font-normal leading-relaxed text-brand-mist-light">{subtext}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-brand-ivory-deep px-6 py-20 lg:px-24">
        <div className="mx-auto max-w-[1100px]">
          <SectionLabel>Grades &amp; Finishes</SectionLabel>
          <AnimatedText
            text="One source. Every project."
            tag="h2"
            className="mt-6 font-display text-[clamp(28px,4vw,40px)] font-light leading-[1.1] text-brand-charcoal"
          />
          <div className="relative mt-12 aspect-[16/9] max-h-[520px] w-full overflow-hidden">
            <img
              src={IMAGES.livingRooms.wide}
              alt="Living and dining interior — Maywood Interiors Bangalore"
              loading="lazy"
              className="w-full h-full object-cover object-[center_28%] block"
              onError={(e) => {
                e.currentTarget.src = '/assets/images/fallback.jpg'
              }}
            />
          </div>
        </div>
      </section>

      <section className="bg-brand-charcoal px-6 py-20 lg:px-24">
        <div className="mx-auto max-w-[1200px]">
          <SectionLabel light>Why it matters</SectionLabel>
          <h2 className="mt-6 font-display text-[clamp(28px,3.5vw,40px)] font-light leading-[1.1] text-brand-ivory">
            How we compare.
          </h2>
          <p className="mt-4 max-w-[640px] font-body text-[14px] font-normal leading-relaxed text-brand-mist-light">
            Most interior firms use third-party plywood with unknown grades and hidden markups. Here&apos;s the difference.
          </p>

          <div className="mt-12 overflow-x-auto rounded-sm border border-[rgba(184,150,90,0.22)]">
            <table className="w-full min-w-[720px] border-collapse text-left font-body text-[13px]">
              <thead>
                <tr className="bg-[#1a1612]">
                  <th
                    scope="col"
                    className="border-b border-[rgba(184,150,90,0.2)] px-4 py-4 font-body text-[11px] font-semibold uppercase tracking-[0.14em] text-brand-brass sm:px-5"
                  >
                    Feature
                  </th>
                  <th
                    scope="col"
                    className="border-b border-[rgba(184,150,90,0.2)] px-4 py-4 font-body text-[11px] font-semibold uppercase tracking-[0.14em] text-brand-brass sm:px-5"
                  >
                    Maywood Plys
                  </th>
                  <th
                    scope="col"
                    className="border-b border-[rgba(184,150,90,0.2)] px-4 py-4 font-body text-[11px] font-semibold uppercase tracking-[0.14em] text-brand-brass sm:px-5"
                  >
                    Market Plywood
                  </th>
                </tr>
              </thead>
              <tbody>
                {PLY_COMPARISON_ROWS.map((row) => (
                  <tr key={row.feature} className="border-b border-[rgba(184,150,90,0.14)] last:border-b-0">
                    <th
                      scope="row"
                      className="bg-[#252220] px-4 py-3.5 font-body font-medium text-brand-ivory sm:px-5"
                    >
                      {row.feature}
                    </th>
                    <td className="bg-[#f5f0eb] px-4 py-3.5 font-normal leading-relaxed text-brand-charcoal sm:px-5">
                      <span className="mr-2 inline-block text-[11px] font-medium text-brand-brass" aria-hidden>
                        ✓
                      </span>
                      {row.maywood}
                    </td>
                    <td className="bg-[rgba(255,255,255,0.96)] px-4 py-3.5 font-normal leading-relaxed text-brand-mist sm:px-5">
                      <span className="mr-2 inline-block text-[11px] text-brand-mist/70" aria-hidden>
                        {row.marketPrefix === 'dash' ? '—' : '✗'}
                      </span>
                      {row.market}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="mt-8 max-w-[720px] font-body text-[12px] font-normal italic leading-relaxed text-brand-mist-light">
            All Maywood projects use Maywood Plys as standard — no substitutions, no surprises.
          </p>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
            <Link
              to="/instant-quote"
              className={['inline-flex w-full justify-center sm:w-auto', buttonClasses('primary')].join(' ')}
            >
              Get a free quote
            </Link>
            <Link
              to="/experience-centers"
              className={[
                'inline-flex w-full justify-center sm:w-auto',
                buttonClasses('ghost', 'text-brand-brass-light hover:border-brand-brass-light'),
              ].join(' ')}
            >
              Book free consultation
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
