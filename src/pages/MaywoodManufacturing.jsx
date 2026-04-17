import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Link } from 'react-router-dom'
import SectionLabel from '../components/ui/SectionLabel'
import AnimatedText from '../components/ui/AnimatedText'
import { buttonClasses } from '../lib/buttonStyles'
import { IMAGES } from '../config/images'

const MotionLink = motion(Link)
const tapTransition = { type: 'tween', duration: 0.15, ease: [0.16, 1, 0.3, 1] }
const motionEase = [0.16, 1, 0.3, 1]

const HERO_STATS = [
  { value: '40,000 sq ft', label: 'Factory Floor Area' },
  { value: '200+', label: 'Skilled Craftspeople' },
  { value: '35%', label: 'Faster Than Industry Average' },
]

const MICRO_STATS = [
  { label: 'Production Capacity', value: '80 projects/month' },
  { label: 'CNC Machines', value: '12 units' },
  { label: 'Edge Banding Lines', value: '6 lines' },
  { label: 'Quality Checkpoints', value: '4 stages' },
]

const PROCESS_STEPS = [
  {
    title: 'Material Intake',
    desc: 'Maywood Plys and sourced materials are inspected and logged on arrival. No substandard raw material enters the production floor.',
  },
  {
    title: 'CNC Precision Cutting',
    desc: 'Computer-controlled cutting to tolerances of 0.1mm. Every panel is cut exactly to spec — no manual error.',
  },
  {
    title: 'Edge Banding & Surface Treatment',
    desc: 'All exposed edges sealed and finished. Surface laminates applied under controlled pressure for perfect adhesion.',
  },
  {
    title: 'Sub-Assembly',
    desc: 'Carcasses and components assembled in dedicated bays. Hardware fitted and pre-tested before the unit leaves the floor.',
  },
  {
    title: 'Quality Inspection',
    desc: 'Every piece passes a 22-point checklist before dispatch. Defect rate: under 0.3%.',
  },
  {
    title: 'Dispatch & Installation',
    desc: 'Units wrapped, loaded and delivered on schedule. Our own installation crews handle the on-site fit.',
  },
]

const QC_CARDS = [
  {
    n: '01',
    title: 'Raw Material Check',
    desc: 'Every batch of Maywood Plys and hardware is tested for grade, moisture content and dimensional accuracy before it enters production.',
  },
  {
    n: '02',
    title: 'In-Process Inspection',
    desc: 'Our QC team checks cutting tolerances, surface quality and hardware fitment at each production stage — not just at the end.',
  },
  {
    n: '03',
    title: 'Pre-Dispatch Audit',
    desc: 'Every finished unit undergoes a 22-point checklist audit. Only pieces that pass leave the factory.',
  },
]

const BENEFIT_CARDS = [
  {
    title: 'Better Pricing',
    desc: 'Owning our manufacturing eliminates subcontractor markups. Savings are passed directly to you — typically 15–25% below comparable outsourced interiors.',
  },
  {
    title: 'Faster Timelines',
    desc: 'No third-party production queues. Your project starts manufacturing the day after design approval — average lead time is 12 working days from factory to site.',
  },
  {
    title: 'Guaranteed Quality',
    desc: 'When we build it ourselves, we own the quality completely. Our 10-year warranty is only possible because we control every stage.',
  },
]

function HeroStatStrip() {
  return (
    <div className="flex flex-wrap items-end justify-between gap-10 sm:gap-12 lg:gap-16">
      {HERO_STATS.map(({ value, label }) => (
        <div key={label} className="min-w-0 flex-1 sm:flex-none">
          <p className="font-display text-[clamp(28px,4vw,36px)] font-light leading-none text-brand-brass">{value}</p>
          <p className="mt-2 font-body text-[10px] font-medium uppercase tracking-[0.14em] text-brand-mist-light">{label}</p>
        </div>
      ))}
    </div>
  )
}

const processStepImageAlt = [
  'Home office interior — Maywood Interiors Bangalore',
  'Corporate workstations — Maywood Interiors Bangalore',
  'Home office interior — Maywood Interiors Bangalore',
  'Corporate workstations — Maywood Interiors Bangalore',
  'Home office interior — Maywood Interiors Bangalore',
  'Corporate workstations — Maywood Interiors Bangalore',
]

const PROCESS_STEP_IMAGE_SRC = [
  '/assets/images/generated/mfg-step1-material-intake.png',
  '/assets/images/generated/mfg-step2-cnc-cutting.png',
  '/assets/images/generated/mfg-step3-edge-banding.png',
  '/assets/images/generated/mfg-step4-sub-assembly.png',
  '/assets/images/generated/mfg-step5-quality-inspection.png',
]

function processStepImageSrc(index) {
  if (index < PROCESS_STEP_IMAGE_SRC.length) return PROCESS_STEP_IMAGE_SRC[index]
  return index % 2 === 0 ? IMAGES.homeOffice.hero : IMAGES.corporate.workstations
}

function ProcessStepRow({ step, index }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-12% 0px', amount: 0.2 })
  const isEven = index % 2 === 1

  return (
    <motion.div
      ref={ref}
      className="relative grid grid-cols-1 gap-8 pb-20 lg:grid-cols-2 lg:gap-12 lg:pb-28"
      initial={{ opacity: 0, y: 36 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 36 }}
      transition={{ duration: 0.6, ease: motionEase, delay: 0.06 }}
    >
      <div
        className="pointer-events-none absolute left-[10px] top-1/2 z-[2] hidden h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-brand-ivory-deep bg-brand-brass lg:block"
        style={{ boxShadow: '0 0 0 4px #EDE8DF' }}
        aria-hidden
      />

      <div className={`relative ${isEven ? 'order-2' : 'order-1'}`}>
        <div className="relative z-[1]">
          <span
            className="pointer-events-none absolute -left-2 -top-4 font-display text-[48px] font-light leading-none text-brand-brass/[0.15] lg:-left-4 lg:-top-6"
            aria-hidden
          >
            {String(index + 1).padStart(2, '0')}
          </span>
          <h3 className="relative font-display text-[24px] font-normal leading-snug text-brand-charcoal">{step.title}</h3>
          <p className="relative mt-4 max-w-md font-body text-[13px] font-normal leading-[1.8] text-brand-mist">{step.desc}</p>
        </div>
      </div>

      <div className={`relative h-[260px] overflow-hidden lg:h-[260px] ${isEven ? 'order-1' : 'order-2'}`}>
        <img
          src={processStepImageSrc(index)}
          alt={processStepImageAlt[index] ?? 'Maywood manufacturing — interior reference'}
          loading="lazy"
          className="h-full w-full object-cover object-center"
        />
      </div>
    </motion.div>
  )
}

export default function MaywoodManufacturing() {
  return (
    <main className="flex-1">
      <section className="relative flex min-h-[70vh] flex-col overflow-hidden">
        <img
          src={IMAGES.corporate.hero}
          alt="Corporate office interior — Maywood Interiors Bangalore"
          loading="eager"
          className="absolute inset-0 h-full w-full object-cover object-center"
        />
        <div
          className="absolute inset-0"
          style={{ backgroundColor: 'rgba(28, 25, 21, 0.75)' }}
          aria-hidden
        />
        <div className="relative z-[2] flex flex-1 flex-col justify-center px-6 py-32 lg:px-24">
          <div className="mx-auto w-full max-w-[1400px]">
            <SectionLabel light>Maywood Manufacturing</SectionLabel>

            <AnimatedText
              text="Where your interiors are actually made."
              tag="h1"
              getWordClassName={(_w, i) => (i >= 4 ? 'italic text-[#D4B483]' : '')}
              className="mt-8 max-w-[1100px] font-display text-[64px] font-light leading-[1.06] text-brand-ivory max-lg:text-[clamp(38px,9vw,64px)]"
            />

            <p className="mt-8 max-w-[520px] font-body text-[15px] font-normal leading-[1.85] text-brand-mist-light">
              Our Bangalore manufacturing facility gives us complete control over quality, timelines and cost — advantages that
              pass directly to every client.
            </p>
          </div>
        </div>

        <div className="relative z-[2] border-t border-white/[0.08] bg-brand-ivory-deep px-6 py-10 lg:px-24">
          <div className="mx-auto max-w-[1400px]">
            <HeroStatStrip />
          </div>
        </div>
      </section>

      <section className="bg-brand-ivory px-6 py-32 lg:px-24">
        <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="min-h-[520px] overflow-hidden">
            <img
              src={IMAGES.homeOffice.hero}
              alt="Home office interior — Maywood Interiors Bangalore"
              loading="lazy"
              className="h-full min-h-[520px] w-full object-cover object-center"
            />
          </div>

          <div className="flex flex-col justify-center lg:pl-16">
            <SectionLabel>The Facility</SectionLabel>
            <AnimatedText
              text="Built to produce. Designed for precision."
              tag="h2"
              getWordClassName={(_w, i) => (i >= 4 ? 'italic' : '')}
              className="mt-6 max-w-[640px] font-display text-[clamp(30px,4vw,44px)] font-light leading-[1.08] text-brand-charcoal"
            />
            <p className="mt-6 max-w-[440px] font-body text-[14px] font-normal leading-[1.9] text-brand-mist">
              Our 40,000 sq ft facility on the outskirts of Bangalore houses CNC cutting, edge-banding, surface treatment,
              assembly and quality inspection — all under one roof. This isn&apos;t a warehouse. It&apos;s a precision
              manufacturing floor.
            </p>

            <div className="mt-10 grid grid-cols-2 gap-x-8 gap-y-8">
              {MICRO_STATS.map(({ label, value }) => (
                <div key={label}>
                  <p className="font-body text-[10px] font-medium uppercase tracking-[0.18em] text-brand-brass">{label}</p>
                  <p className="mt-2 font-display text-[28px] font-normal leading-none text-brand-charcoal">{value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-brand-ivory-deep px-6 py-32 lg:px-24">
        <div className="mx-auto max-w-[1400px]">
          <SectionLabel>How We Build</SectionLabel>
          <AnimatedText
            text="Precision at every stage."
            tag="h2"
            className="mt-6 max-w-[800px] font-display text-[clamp(30px,4vw,48px)] font-light leading-[1.08] text-brand-charcoal"
          />

          <div className="relative mt-16 lg:mt-24 lg:pl-16">
            <div
              className="pointer-events-none absolute bottom-0 left-[10px] top-0 hidden w-[2px] bg-brand-brass lg:block"
              aria-hidden
            />

            {PROCESS_STEPS.map((step, index) => (
              <ProcessStepRow key={step.title} step={step} index={index} />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-brand-charcoal px-6 py-32 lg:px-24">
        <div className="mx-auto max-w-[1400px]">
          <SectionLabel light>Quality Control</SectionLabel>
          <AnimatedText
            text="We don't inspect at the end. We inspect throughout."
            tag="h2"
            getWordClassName={(_w, i) => (i >= 8 ? 'italic text-[#D4B483]' : '')}
            className="mt-6 max-w-[920px] font-display text-[clamp(30px,4vw,48px)] font-light leading-[1.08] text-brand-ivory"
          />
          <p className="mt-6 max-w-[500px] font-body text-[14px] font-normal leading-relaxed text-brand-mist-light">
            Quality isn&apos;t a gate at the end of the line — it&apos;s embedded at every hand-off, tolerance check, and
            sign-off between stations.
          </p>

          <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-3 md:gap-8">
            {QC_CARDS.map((card) => (
              <article
                key={card.title}
                className="rounded-[2px] border-[0.5px] border-[rgba(184,150,90,0.2)] bg-brand-charcoal-mid p-10"
              >
                <p className="font-display text-[48px] font-light leading-none text-brand-brass">{card.n}</p>
                <h3 className="mt-6 font-display text-[22px] font-normal leading-snug text-brand-ivory">{card.title}</h3>
                <p className="mt-4 font-body text-[13px] font-normal leading-[1.8] text-brand-mist-light">{card.desc}</p>
              </article>
            ))}
          </div>

          <p className="mx-auto mt-14 max-w-2xl text-center font-body text-[12px] font-normal italic leading-relaxed text-brand-mist">
            Maywood Manufacturing is ISO 9001:2015 and ISO 45001:2018 certified.
          </p>
        </div>
      </section>

      <section className="bg-brand-ivory px-6 py-28 lg:px-24">
        <div className="mx-auto max-w-[1400px]">
          <SectionLabel>Client Benefits</SectionLabel>
          <AnimatedText
            text="Our factory. Your advantage."
            tag="h2"
            className="mt-6 max-w-[800px] font-display text-[clamp(30px,4vw,48px)] font-light leading-[1.08] text-brand-charcoal"
          />

          <div className="mt-14 grid grid-cols-1 gap-8 md:grid-cols-3 md:gap-8">
            {BENEFIT_CARDS.map((card) => (
              <article
                key={card.title}
                className="border-b-2 border-brand-brass bg-brand-ivory-deep px-8 pb-10 pt-8"
              >
                <h3 className="font-display text-[22px] font-normal leading-snug text-brand-charcoal">{card.title}</h3>
                <p className="mt-4 font-body text-[13px] font-normal leading-[1.8] text-brand-mist">{card.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-brand-brass px-6 py-20 text-center lg:px-24 lg:py-24">
        <div className="mx-auto max-w-[720px]">
          <AnimatedText
            text="Want to see the factory?"
            tag="h2"
            className="mx-auto justify-center font-display text-[clamp(30px,4vw,44px)] font-light leading-[1.08] text-brand-charcoal"
          />
          <p className="mx-auto mt-6 max-w-md font-body text-[15px] font-normal leading-relaxed text-brand-charcoal/80">
            We run monthly factory visits for clients and partners. Register your interest below.
          </p>
          <MotionLink
            to="/#consultation"
            className={['mt-10 inline-flex', buttonClasses('dark')].join(' ')}
            whileTap={{ scale: 0.98 }}
            transition={tapTransition}
          >
            Register for Factory Visit
          </MotionLink>
          <p className="mt-8 font-body text-[12px] font-normal text-brand-charcoal/60">
            Next open visit: first Saturday of every month, 10am
          </p>
        </div>
      </section>
    </main>
  )
}
