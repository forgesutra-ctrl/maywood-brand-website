import { Fragment } from 'react'
import { motion } from 'framer-motion'
import { Shield } from 'lucide-react'
import { Link } from 'react-router-dom'
import HeroImageCarousel from '../components/home/HeroImageCarousel'
import MaywoodDifferenceSection from '../components/home/MaywoodDifferenceSection'
import MaywoodPlysSection from '../components/MaywoodPlysSection'
import ProcessSection from '../components/sections/ProcessSection'
import SectionLabel from '../components/ui/SectionLabel'
import AnimatedText from '../components/ui/AnimatedText'
import { buttonBaseClass, buttonClasses } from '../lib/buttonStyles'
import { IMAGES } from '../config/images'

const MotionLink = motion(Link)

const tapTransition = { type: 'tween', duration: 0.15, ease: [0.16, 1, 0.3, 1] }

const motionEase = [0.16, 1, 0.3, 1]

const HERO_STATS = [
  { value: '500+', label: 'Projects Delivered' },
  { value: '45 Days', label: 'Avg. Execution' },
  { value: '10 Yr', label: 'Warranty' },
]

const MARQUEE_ITEMS = [
  'In-house Plywood',
  'Own Manufacturing Facility',
  'Flexible EMI',
  'ISO 9001 & 45001',
  'End-to-End Execution',
  'Bangalore-Based',
  '500+ Projects',
  '10 Year Warranty',
]

const SERVICE_CARDS = [
  {
    n: '01',
    title: 'Home Interiors',
    body: 'Kitchens, wardrobes, living rooms, home offices and more — designed for how Bangalore families actually live.',
    to: '/products',
    imageSrc: IMAGES.livingRooms.hero,
    imageAlt: 'Premium Indian living room interior — Maywood Interiors Bangalore',
  },
  {
    n: '02',
    title: 'Commercial Spaces',
    body: 'IT parks, corporate offices, co-working environments — functional interiors that perform at scale.',
    to: '/products',
    imageSrc: IMAGES.corporate.hero,
    imageAlt: 'Corporate office interior — Maywood Interiors Bangalore',
  },
  {
    n: '03',
    title: 'Retail & Hospitality',
    body: 'Cafes, restaurants, hotels, spas, salons — immersive brand environments that drive footfall.',
    to: '/products',
    imageSrc: IMAGES.spas.hero,
    imageAlt: 'Spa reception interior — Maywood Interiors Bangalore',
  },
]

const MAYWOOD_ADVANTAGE_ITEMS = [
  {
    stat: '35%',
    label: 'Faster timelines',
    description: 'Our factory cuts delivery time vs industry standard',
  },
  {
    stat: '20-30%',
    label: 'Better pricing',
    description: 'In-house plywood removes supplier markups entirely',
  },
  {
    stat: '100%',
    label: 'Quality controlled',
    description: 'Every piece inspected at factory before it reaches your home',
  },
  {
    stat: '1',
    label: 'Single accountability',
    description: 'One team owns your project from design to final installation',
  },
]

const DIFFERENTIATOR_CARDS = [
  {
    pill: 'Cost Advantage',
    title: 'Maywood Plys — Our In-House Plywood',
    body: 'We manufacture our own plywood range, cutting out supplier markups entirely. The result: 20–30% better pricing on materials without compromising on grade.',
  },
  {
    pill: 'Faster Timelines',
    title: 'Our Own Production Facility',
    body: 'With a factory in Bangalore, we control every stage of manufacturing — no waiting on third-party vendors. Average project timelines are 35% shorter than industry standard.',
  },
  {
    pill: 'Zero Upfront Barrier',
    title: 'Maywood Finance — Design Now, Pay Later',
    body: 'Flexible EMI plans starting at ₹4,999/month make premium interiors accessible. No compromise on design because of budget constraints.',
  },
  {
    pill: 'Single Accountability',
    title: 'End-to-End Execution',
    body: 'One team owns your project from first design consultation to final snag-list. No vendor juggling, no blame games, no delays.',
  },
]

const offeringCardVariants = {
  rest: {},
  hover: {},
}

const offeringBarVariants = {
  rest: { scaleX: 0 },
  hover: {
    scaleX: 1,
    transition: { duration: 0.38, ease: motionEase },
  },
}

const OFFERING_CARDS = [
  {
    title: 'Modular Kitchens',
    body: 'Precision-built for Indian cooking habits. Hettich hardware. Maywood Plys core.',
    imageSrc: IMAGES.kitchens.hero,
    imageAlt: 'Modular kitchen design — Maywood Interiors Bangalore',
  },
  {
    title: 'Wardrobes',
    body: 'Floor-to-ceiling, walk-in, sliding. Every configuration, engineered for your space.',
    imageSrc: IMAGES.wardrobes.hero,
    imageAlt: 'Wardrobe interior — Maywood Interiors Bangalore',
  },
  {
    title: 'Home Offices',
    body: 'Work-from-home spaces that inspire focus. Cable management built-in.',
    imageSrc: IMAGES.homeOffice.hero,
    imageAlt: 'Home office interior — Maywood Interiors Bangalore',
  },
  {
    title: 'Corporate Offices',
    body: 'From 500 to 50,000 sq ft — workspaces that reflect your brand.',
    imageSrc: '/assets/images/generated/corporate-office-open.png',
    imageAlt: 'Corporate reception — Maywood Interiors Bangalore',
  },
  {
    title: 'Cafes & Restaurants',
    body: 'Atmosphere is revenue. We design for footfall and dwell time.',
    imageSrc: '/assets/images/generated/hospitality-event-spaces.png',
    imageAlt: 'Hospitality lounge interior — Maywood Interiors Bangalore',
  },
  {
    title: 'Spas & Salons',
    body: 'Sensory environments that build loyalty and command premium pricing.',
    imageSrc: IMAGES.spas.treatmentRoom,
    imageAlt: 'Spa treatment room — Maywood Interiors Bangalore',
  },
]

function StatBlocks({ className = '', surface = 'dark' }) {
  const labelClass =
    surface === 'light'
      ? 'text-brand-mist'
      : 'text-brand-mist-light'
  const valueClass = surface === 'light' ? 'text-brand-charcoal' : 'text-brand-brass'

  return (
    <div className={['flex flex-wrap items-end gap-10 sm:gap-14 lg:gap-16', className].filter(Boolean).join(' ')}>
      {HERO_STATS.map(({ value, label }) => (
        <div key={label} className="min-w-0">
          <p className={['font-display text-[36px] font-light leading-none', valueClass].join(' ')}>{value}</p>
          <p className={['mt-2 font-body text-[10px] font-medium uppercase tracking-[0.14em]', labelClass].join(' ')}>
            {label}
          </p>
        </div>
      ))}
    </div>
  )
}

function MarqueeStrip() {
  const row = (setKey) => (
    <div className="flex shrink-0 items-center gap-5 px-8">
      {MARQUEE_ITEMS.map((label, i) => (
        <Fragment key={`${setKey}-${label}-${i}`}>
          <span className="whitespace-nowrap font-body text-[11px] font-medium uppercase tracking-[0.1em] text-brand-charcoal">
            {label}
          </span>
          {i < MARQUEE_ITEMS.length - 1 && (
            <span
              className="mx-0.5 h-1 w-1 shrink-0 rounded-full bg-brand-brass-pale opacity-90"
              aria-hidden
            />
          )}
        </Fragment>
      ))}
    </div>
  )

  return (
    <div className="bg-brand-brass py-[13px]">
      <div className="overflow-hidden">
        <div className="home-marquee-track flex">
          {row('a')}
          {row('b')}
        </div>
      </div>
    </div>
  )
}

export default function Home() {
  return (
    <main className="flex-1 overflow-x-hidden">
      <section className="grid min-h-[min(100svh,1200px)] grid-cols-1 lg:grid-cols-[55fr_45fr] lg:min-h-[calc(100svh-1px)]">
        <div className="relative flex min-h-[520px] min-w-0 flex-col justify-between bg-brand-charcoal px-6 py-16 lg:min-h-0 lg:px-14 lg:py-16 xl:px-20 xl:py-20">
          <p
            className="pointer-events-none absolute left-6 top-28 hidden origin-left -rotate-90 whitespace-nowrap font-body text-[10px] font-medium uppercase tracking-[0.25em] text-brand-brass lg:left-8 lg:block xl:left-10"
            aria-hidden
          >
            EST. 2015 · BANGALORE
          </p>

          <div className="max-w-xl min-w-0 space-y-8 lg:pl-6 xl:pl-4">
            <SectionLabel light className="relative z-[1]">
              Bangalore&apos;s Integrated Interior Company
            </SectionLabel>

            <AnimatedText
              text="Spaces crafted with intention."
              tag="h1"
              getWordClassName={(_w, i, n) => (i === n - 1 ? 'italic text-[#D4B483]' : '')}
              className="font-display font-light text-[clamp(38px,5.5vw,80px)] leading-[1.05] text-brand-ivory"
            />

            <p className="max-w-[400px] font-body text-[15px] font-light leading-[1.85] text-[rgba(247,243,237,0.55)]">
              From in-house plywood to precision manufacturing and flexible financing — Maywood delivers complete
              interior solutions for homes and businesses across Bangalore.
            </p>

            <div className="flex w-full max-w-xl flex-col gap-4 pt-2 sm:max-w-none sm:flex-row sm:flex-wrap sm:items-center">
              <MotionLink
                to="/instant-quote"
                className={buttonClasses('primary', 'w-full justify-center sm:w-auto')}
                whileTap={{ scale: 0.98 }}
                transition={tapTransition}
              >
                Get Instant Quote
              </MotionLink>
              <Link
                to="/experience-centers"
                className={buttonClasses('ghost', 'w-full justify-center text-brand-brass-light hover:border-brand-brass-light sm:w-auto')}
              >
                Book free consultation
              </Link>
            </div>
          </div>

          <div className="mt-14 border-t border-white/[0.06] pt-10 lg:mt-0 lg:border-t-0 lg:pt-0">
            <StatBlocks className="lg:pl-6 xl:pl-4" />
          </div>
        </div>

        <div className="relative flex min-h-[360px] min-w-0 flex-col overflow-hidden lg:min-h-0">
          <div className="relative min-h-[320px] min-w-0 flex-1 lg:min-h-0">
            <div className="absolute inset-0 overflow-hidden bg-brand-charcoal">
              <HeroImageCarousel className="h-full min-h-full w-full" />
            </div>

            <div className="absolute right-6 top-6 z-[3] w-[180px] bg-brand-brass-pale p-5 shadow-[0_20px_40px_-16px_rgba(28,25,21,0.35)]">
              <p className="font-body text-[9px] font-semibold uppercase tracking-[0.18em] text-brand-brass">
                ISO Certified
              </p>
              <p className="mt-2 font-display text-[24px] font-light leading-tight text-brand-charcoal">
                9001 · 45001
              </p>
            </div>
          </div>

          <div className="relative z-[1] -mt-10 px-6 pb-10 lg:-mt-16 lg:px-0 lg:pb-12">
            <div className="border border-brand-brass-pale bg-brand-ivory-deep px-8 py-7 shadow-[0_24px_48px_-20px_rgba(28,25,21,0.2)]">
              <StatBlocks surface="light" className="justify-between gap-8 sm:gap-10" />
            </div>
          </div>
        </div>
      </section>

      <MarqueeStrip />

      <div id="consultation" className="h-0 scroll-mt-28" aria-hidden />

      <section className="bg-brand-ivory px-6 py-16 lg:px-24 lg:py-32">
        <div className="mx-auto max-w-[1400px]">
          <SectionLabel>What We Do</SectionLabel>

          <AnimatedText
            text="One company. Every space."
            tag="h2"
            getWordClassName={(_w, i) => (i >= 2 ? 'italic' : '')}
            className="mt-6 max-w-[900px] font-display text-[clamp(30px,4vw,50px)] font-light leading-[1.08] text-brand-charcoal"
          />

          <p className="mt-6 max-w-[500px] font-body text-[15px] font-normal leading-relaxed text-brand-mist">
            Residential, commercial, retail — Maywood brings the same structured precision to every project, every time.
          </p>

          <div className="mt-16 grid grid-cols-1 gap-px bg-[rgba(184,150,90,0.2)] md:grid-cols-3">
            {SERVICE_CARDS.map(({ n, title, body, to, imageSrc, imageAlt }) => (
              <motion.article
                key={n}
                className="group relative flex flex-col bg-brand-ivory"
                initial={false}
                whileHover={{ backgroundColor: '#1C1915' }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
              >
                <div className="relative h-[240px] w-full max-w-full shrink-0 overflow-hidden">
                  <img
                    src={imageSrc}
                    alt={imageAlt}
                    loading="lazy"
                    className="w-full h-full object-cover object-[center_28%] block"
                    onError={(e) => {
                      e.currentTarget.src = '/assets/images/fallback.jpg'
                    }}
                  />
                </div>

                <div className="relative px-10 pb-10 pt-10">
                  <span className="pointer-events-none absolute right-8 top-8 font-display text-[56px] font-light leading-none text-[rgba(184,150,90,0.2)] transition-colors duration-300 group-hover:text-[rgba(255,255,255,0.06)]">
                    {n}
                  </span>

                  <h3 className="relative pr-16 font-display text-[28px] font-light text-brand-charcoal transition-colors duration-300 group-hover:text-brand-ivory">
                    {title}
                  </h3>

                  <p className="relative mt-4 font-body text-[13px] font-normal leading-[1.8] text-brand-mist transition-colors duration-300 group-hover:text-brand-ivory/70">
                    {body}
                  </p>

                  <Link
                    to={to}
                    className="mt-8 inline-flex items-center gap-1 font-body text-[12px] font-medium uppercase tracking-[0.12em] text-brand-brass transition-colors duration-300 group-hover:text-brand-brass-light"
                  >
                    Explore
                    <span aria-hidden className="text-[13px] font-light">
                      →
                    </span>
                  </Link>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <MaywoodDifferenceSection differentiators={DIFFERENTIATOR_CARDS} />

      <section
        className="border-y border-[rgba(184,150,90,0.45)] bg-[#1a1612] px-6 py-12"
        aria-label="Maywood Advantage"
      >
        <div className="mx-auto max-w-[1400px]">
          <div className="grid grid-cols-1 max-sm:divide-y-0 divide-y divide-[rgba(184,150,90,0.35)] sm:grid-cols-2 sm:divide-x sm:divide-y-0 lg:grid-cols-4">
            {MAYWOOD_ADVANTAGE_ITEMS.map((item) => (
              <div key={item.label} className="group px-4 py-8 text-center sm:px-6 lg:px-8">
                <p className="font-display text-[48px] font-light leading-none text-brand-brass/70 transition-colors duration-300 group-hover:text-brand-brass">
                  {item.stat}
                </p>
                <p className="mt-4 font-body text-[14px] font-semibold uppercase tracking-[0.12em] text-white">
                  {item.label}
                </p>
                <p className="mt-3 font-body text-[13px] font-normal leading-relaxed text-brand-mist-light">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-brand-ivory-deep px-6 py-16 lg:px-24 lg:py-32">
        <div className="mx-auto max-w-[1400px]">
          <SectionLabel>What We Build</SectionLabel>

          <AnimatedText
            text="From one room to an entire building."
            tag="h2"
            getWordClassName={(_w, i, n) => (i >= n - 2 ? 'italic' : '')}
            className="mt-6 max-w-[1000px] font-display text-[clamp(30px,4vw,44px)] font-light leading-[1.08] text-brand-charcoal"
          />

          <div className="mt-16 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:gap-5">
            {OFFERING_CARDS.map((card) => (
              <motion.article
                key={card.title}
                className="group relative overflow-hidden bg-brand-ivory"
                variants={offeringCardVariants}
                initial="rest"
                whileHover="hover"
              >
                <motion.div
                  className="pointer-events-none absolute left-0 top-0 z-[2] h-[2px] w-full origin-left bg-brand-brass"
                  variants={offeringBarVariants}
                />
                <div className="relative h-[180px] w-full max-w-full shrink-0 overflow-hidden">
                  <img
                    src={card.imageSrc}
                    alt={card.imageAlt}
                    loading="lazy"
                    className="w-full h-full object-cover object-[center_28%] block"
                  />
                </div>
                <div className="relative z-[1] p-8">
                  <h3 className="font-display text-[20px] font-normal leading-snug text-brand-charcoal">{card.title}</h3>
                  <p className="mt-3 line-clamp-2 font-body text-[13px] font-normal leading-relaxed text-brand-mist">
                    {card.body}
                  </p>
                  <Link
                    to="/products"
                    className="mt-6 inline-flex font-body text-[11px] font-semibold uppercase tracking-[0.14em] text-brand-brass opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  >
                    View projects →
                  </Link>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-brand-ivory px-6 py-16 lg:px-24 lg:py-28">
        <div className="mx-auto max-w-[1400px]">
          <SectionLabel>Selected Work</SectionLabel>
          <AnimatedText
            text="Spaces we've delivered across Bangalore."
            tag="h2"
            getWordClassName={(_w, i, n) => (i >= n - 2 ? 'italic' : '')}
            className="mt-6 max-w-[900px] font-display text-[clamp(28px,3.5vw,42px)] font-light leading-[1.08] text-brand-charcoal"
          />
          <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {IMAGES.portfolio.map((item) => (
              <article
                key={item.title}
                className="group overflow-hidden border border-brand-brass-pale/60 bg-brand-ivory-deep/50"
              >
                <div className="relative h-[220px] w-full max-w-full overflow-hidden">
                  <img
                    src={item.src}
                    alt={item.alt}
                    loading="lazy"
                    className="w-full h-full object-cover object-[center_28%] block"
                    onError={(e) => {
                      e.currentTarget.src = '/assets/images/fallback.jpg'
                    }}
                  />
                </div>
                <div className="px-4 py-4">
                  <p className="font-body text-[10px] font-medium uppercase tracking-[0.14em] text-brand-brass">{item.tag}</p>
                  <h3 className="mt-2 font-display text-[18px] font-normal text-brand-charcoal">{item.title}</h3>
                  <p className="mt-2 font-body text-[12px] font-normal leading-relaxed text-brand-mist">{item.detail}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <MaywoodPlysSection />

      <ProcessSection />

      <section
        className="relative overflow-hidden px-6 py-16 lg:px-24 lg:py-28"
        style={{
          background: 'linear-gradient(135deg, #1a1612 0%, #0f0d0a 100%)',
        }}
      >
        <p
          className="pointer-events-none absolute -left-4 top-1/2 -translate-y-1/2 select-none font-display text-[min(42vw,380px)] font-light leading-none text-brand-brass/[0.04]"
          aria-hidden
        >
          “
        </p>
        <div className="relative z-[1] mx-auto flex max-w-[1400px] flex-col lg:grid lg:grid-cols-2 lg:items-center lg:gap-20">
          <div className="lg:pr-4">
            <span className="inline-flex rounded-sm border border-brand-brass px-3.5 py-1.5 font-body text-[10px] font-semibold uppercase tracking-[0.18em] text-brand-brass">
              Maywood Finance
            </span>

            <AnimatedText
              text="Design now. Pay later."
              tag="h2"
              getWordClassName={(_w, i) => (i >= 2 ? 'italic text-[#D4B483]' : '')}
              className="mt-8 font-display text-[clamp(32px,4vw,48px)] font-light leading-[1.06] text-brand-ivory"
            />

            <p className="mt-6 max-w-xl font-body text-[16px] font-normal leading-[1.9] text-brand-mist-light">
              Your dream interior shouldn&apos;t be held hostage by budget timing. Maywood Finance offers flexible,
              zero-hassle EMI plans — so you can start now and pay as your project comes to life.
            </p>

            <ul className="mt-10 space-y-4">
              {[
                'EMI plans starting at ₹4,999/month',
                'Flexible tenures from 6 to 36 months',
                'Quick approval, minimal documentation',
              ].map((line) => (
                <li key={line} className="flex gap-3 font-body text-[15px] font-normal leading-relaxed text-brand-ivory">
                  <span className="shrink-0 font-display text-brand-brass" aria-hidden>
                    —
                  </span>
                  <span>{line}</span>
                </li>
              ))}
            </ul>

            <MotionLink
              to="/maywood-finance"
              className={['mt-10 inline-flex', buttonClasses('primary')].join(' ')}
              whileTap={{ scale: 0.98 }}
              transition={tapTransition}
            >
              Check Your Eligibility
            </MotionLink>
          </div>

          <div
            className="my-12 h-px w-full max-w-md shrink-0 self-center bg-[rgba(184,150,90,0.35)] lg:hidden"
            aria-hidden
          />

          <div className="flex justify-center lg:justify-end">
            <div className="w-full max-w-md rounded-sm border border-[rgba(184,150,90,0.45)] bg-[#1e1a14] p-10 shadow-[0_24px_48px_-24px_rgba(0,0,0,0.45),inset_0_1px_0_rgba(184,150,90,0.08)]">
              <p className="font-body text-[11px] font-semibold uppercase tracking-[0.2em] text-brand-brass">
                Estimated Monthly EMI
              </p>
              <p className="mt-5 font-display text-[clamp(56px,8vw,76px)] font-light leading-none text-brand-ivory">
                ₹8,499
              </p>
              <p className="mt-4 font-body text-[13px] font-normal text-brand-mist">
                for a ₹3,00,000 project · 36 months
              </p>
              <div className="my-8 h-px w-full bg-[rgba(184,150,90,0.22)]" aria-hidden />
              <p className="font-body text-[14px] font-normal leading-relaxed text-brand-mist-light">
                Includes: 3D design, manufacturing, materials & installation
              </p>
              <p className="mt-4 font-body text-[12px] italic leading-relaxed text-brand-mist">
                Actual EMI calculated after consultation.
              </p>
              <MotionLink
                to="#consultation"
                className={['mt-8 flex w-full justify-center', buttonClasses('primary')].join(' ')}
                whileTap={{ scale: 0.98 }}
                transition={tapTransition}
              >
                Book Free Consultation
              </MotionLink>
            </div>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-[#1C1915]">
        <div className="bg-[#1e1a14] px-6 py-14 lg:px-24 lg:py-20">
          <div className="mx-auto flex max-w-[1400px] flex-col divide-y divide-[rgba(184,150,90,0.22)] sm:flex-row sm:divide-x sm:divide-y-0">
            {[
              { value: '500+', label: 'Projects Completed' },
              { value: '₹50 Cr+', label: 'Interior Value Delivered' },
              { value: '45 Days', label: 'Average Timeline' },
              { value: '4.8★', label: 'Client Satisfaction' },
            ].map((stat) => (
              <div
                key={stat.label}
                className="group relative flex flex-1 flex-col items-center justify-center px-4 py-10 text-center transition-[filter] duration-300 hover:brightness-110 sm:py-12 sm:pl-8 sm:pr-8"
              >
                <div
                  className="pointer-events-none absolute left-1/2 top-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 bg-[radial-gradient(circle,rgba(184,150,90,0.14)_0%,transparent_68%)] opacity-90 transition-opacity duration-300 group-hover:opacity-100"
                  aria-hidden
                />
                <p className="relative z-[1] font-display text-[48px] font-light leading-none text-brand-brass-light">
                  {stat.value}
                </p>
                <p className="relative z-[1] mt-4 max-w-[12rem] font-body text-[11px] font-medium uppercase tracking-[0.12em] text-brand-mist-light">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="px-6 py-16 lg:px-24 lg:py-20">
          <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-6 md:grid-cols-2 md:gap-8">
            <div className="flex gap-4 rounded-sm border border-[rgba(184,150,90,0.4)] bg-[#1a1612] px-8 py-7">
              <Shield className="mt-0.5 h-7 w-7 shrink-0 text-brand-brass" strokeWidth={1.25} aria-hidden />
              <div>
                <p className="font-display text-[20px] font-normal text-brand-ivory">ISO 9001:2015</p>
                <p className="mt-2 font-body text-[14px] font-normal leading-relaxed text-brand-mist-light">
                  Quality Management System
                </p>
              </div>
            </div>
            <div className="flex gap-4 rounded-sm border border-[rgba(184,150,90,0.4)] bg-[#1a1612] px-8 py-7">
              <Shield className="mt-0.5 h-7 w-7 shrink-0 text-brand-brass" strokeWidth={1.25} aria-hidden />
              <div>
                <p className="font-display text-[20px] font-normal text-brand-ivory">ISO 45001:2018</p>
                <p className="mt-2 font-body text-[14px] font-normal leading-relaxed text-brand-mist-light">
                  Occupational Health & Safety
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-[rgba(184,150,90,0.03)] px-6 py-16 lg:px-24 lg:py-24">
          <div className="relative mx-auto max-w-[700px] text-center">
            <span
              className="pointer-events-none block font-display text-[96px] font-light leading-[0.85] text-brand-brass/35"
              aria-hidden
            >
              “
            </span>
            <blockquote className="relative z-[1] -mt-2 font-display text-[20px] font-light italic leading-[1.8] text-brand-ivory">
              Maywood transformed our 3BHK in Whitefield completely. The quality of their plywood, the speed of
              execution, and the finish — I&apos;ve recommended them to four neighbours already.
            </blockquote>
            <p className="relative z-[1] mt-8 font-body text-[13px] font-medium uppercase tracking-[0.14em] text-brand-brass">
              — Priya Raghavan, Whitefield, Bangalore
            </p>
          </div>
        </div>
      </section>

      <section className="bg-brand-brass px-6 py-16 lg:px-24 lg:py-28">
        <div className="mx-auto max-w-[900px] text-center">
          <AnimatedText
            text="Ready to build your space?"
            tag="h2"
            getWordClassName={(_w, i, n) => (i >= n - 2 ? 'italic' : '')}
            className="mx-auto justify-center font-display text-[clamp(30px,4vw,54px)] font-light leading-[1.06] text-brand-charcoal"
          />

          <p className="mx-auto mt-6 max-w-[500px] font-body text-[15px] font-normal leading-relaxed text-brand-charcoal/65">
            Get a no-obligation estimate in minutes. Our team will reach out within 24 hours.
          </p>

          <div className="mx-auto mt-10 flex w-full max-w-md flex-col gap-4 sm:max-w-none sm:flex-row sm:items-center sm:justify-center">
            <MotionLink
              to="/instant-quote"
              className={buttonClasses('dark', 'w-full justify-center sm:w-auto')}
              whileTap={{ scale: 0.98 }}
              transition={tapTransition}
            >
              Get Instant Quote
            </MotionLink>
            <MotionLink
              to="/experience-centers"
              className={[
                buttonBaseClass,
                'w-full justify-center rounded-[2px] px-9 py-[14px] sm:w-auto',
                'border border-[rgba(28,25,21,0.35)] bg-transparent text-brand-charcoal hover:border-brand-charcoal',
                'focus-visible:ring-offset-brand-brass',
              ].join(' ')}
              whileTap={{ scale: 0.98 }}
              transition={tapTransition}
            >
              Book free consultation
            </MotionLink>
          </div>
        </div>
      </section>
    </main>
  )
}
