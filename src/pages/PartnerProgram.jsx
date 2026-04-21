import { useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Loader2, Shield, Star } from 'lucide-react'
import SectionLabel from '../components/ui/SectionLabel'
import AnimatedText from '../components/ui/AnimatedText'
import { buttonClasses } from '../lib/buttonStyles'
import { supabase } from '../lib/supabase'
import { savePartnerApplication } from '../utils/adminDataStore'

const motionEase = [0.16, 1, 0.3, 1]

const HERO_STATS = [
  { value: '₹450 Cr+', label: 'Addressable Market in Bangalore 2026' },
  { value: '15–20%', label: 'Partner Margin Per Project' },
  { value: '45 Days', label: 'Standard Delivery Timeline' },
]

const OPPORTUNITY_CARDS = [
  {
    title: 'Customers want certainty',
    desc: 'Modern homeowners demand transparent pricing, committed timelines, and guaranteed quality over vague promises.',
  },
  {
    title: 'Modular adoption rising',
    desc: 'Shift from on-site carpentry to factory-finished modular solutions is accelerating due to superior finish and durability.',
  },
  {
    title: 'Execution becoming organized',
    desc: 'The market is consolidating around organized players who can deliver standardized, professional experiences at scale.',
  },
]

const MAYWOOD_HANDLES = [
  'Manufacturing & Quality Control',
  'Central Marketing & Leads',
  'Technology & Project Management',
  'Procurement & Logistics',
  'Installation Standards & Warranty',
]

const PARTNER_HANDLES = [
  'Local Lead Gen & Networking',
  'Run the Experience Center',
  'Consult, Quote, Design and Close',
  'On-site Coordination with PM',
  'Community Relationships & Local Hiring',
]

const GROWTH_PHASES = [
  {
    phase: '01',
    title: 'Launch',
    range: 'Months 0–3',
    desc: 'Experience Center fit-out & branding, first product demos & staff training, first 5 projects executed',
  },
  {
    phase: '02',
    title: 'Stable',
    range: 'Months 4–12',
    desc: 'Consistent 5–8 projects/month, positive NPS score, process optimization & refinement',
  },
  {
    phase: '03',
    title: 'Growth',
    range: 'Year 2',
    desc: 'Team scaling, 10–15 projects/month, referral network fully active',
  },
  {
    phase: '04',
    title: 'Multi-Center',
    range: 'Year 3+',
    desc: 'Second location launch, city leadership role, maximized equity value & exit options',
  },
]

const ABSORB_CARDS = [
  {
    title: 'Execution Risk',
    desc: 'Forget delayed timelines and poor finishing. We guarantee delivery schedules and enforce strict quality control.',
  },
  {
    title: 'Vendor Management',
    desc: 'No juggling carpenters, electricians, or suppliers. Single point of reliable contact for every project.',
  },
  {
    title: 'Manufacturing Investment',
    desc: 'Scale without capital expenditure. Plug into our factory infrastructure without spending on machinery.',
  },
  {
    title: 'Technical Coordination',
    desc: 'Our central engineering team handles cutting lists, production drawings, and hardware compatibility.',
  },
]

const SUPPORT_ITEMS = [
  {
    n: '01',
    title: 'Marketing',
    desc: 'Centralized digital campaigns, brand collateral, and qualified lead generation support',
  },
  {
    n: '02',
    title: 'Technology',
    desc: 'Proprietary CRM, 3D design software, and real-time project tracking dashboards',
  },
  {
    n: '03',
    title: 'Project Management',
    desc: 'Dedicated PMs ensuring site readiness, schedule adherence, and quality benchmarks',
  },
  {
    n: '04',
    title: 'Procurement',
    desc: 'Bulk sourcing, hardware logistics, and inventory management at scale',
  },
  {
    n: '05',
    title: 'Warranty',
    desc: '10-year structural warranty coverage giving customers complete peace of mind',
  },
]

const IDEAL_CRITERIA = [
  {
    n: '01',
    title: 'Customer Obsession',
    desc: 'Operator-entrepreneurs who prioritize customer experience above all else',
  },
  {
    n: '02',
    title: 'Industry Experience',
    desc: 'Background in interiors, real estate, or home improvement preferred',
  },
  {
    n: '03',
    title: 'Investment Capability',
    desc: 'Financial readiness to invest in experience center setup and working capital',
  },
  {
    n: '04',
    title: 'Strong Local Network',
    desc: 'Established connections with local builders, architects, and community',
  },
  {
    n: '05',
    title: 'High Integrity',
    desc: 'Uncompromising focus on compliance, quality standards, and ethical practices',
  },
]

const SELECTION_STEPS = [
  { n: '01', title: 'Application', desc: 'Submit partner profile & initial capabilities' },
  { n: '02', title: 'Discussion', desc: 'Strategic interview & business alignment' },
  { n: '03', title: 'Approval', desc: 'Due diligence, agreement & sign-off' },
  { n: '04', title: 'Launch', desc: 'Onboarding, center setup & training' },
]

const PARTNER_TYPES = [
  'Architect',
  'Interior Designer',
  'Contractor & Builder',
  'Real Estate Agent',
  'Investor',
  'Other',
]

const REVENUE_BULLETS = [
  'Based on average 2BHK/3BHK interior project including modular furniture, kitchen, and civil work',
  'No sliding scales or hidden tiers — flat percentage on total project value executed',
  'Pure margin with zero inventory cost or manufacturing overhead',
]

const inputClass =
  'w-full border-b border-brand-charcoal-soft/30 bg-transparent py-2 font-body text-[15px] text-brand-charcoal outline-none transition-colors placeholder:text-brand-mist/60 focus:border-brand-brass'

const initialForm = {
  fullName: '',
  company: '',
  partnerType: '',
  phone: '',
  email: '',
  city: 'Bangalore',
  about: '',
  agreed: false,
}

function HeroStatStrip() {
  return (
    <div className="flex flex-wrap items-end justify-between gap-10 sm:gap-12 lg:gap-16">
      {HERO_STATS.map(({ value, label }) => (
        <div key={label} className="min-w-0 flex-1 sm:flex-none">
          <p className="font-display text-[clamp(28px,4vw,36px)] font-light leading-none text-brand-brass">{value}</p>
          <p className="mt-2 max-w-[220px] font-body text-[10px] font-medium uppercase leading-snug tracking-[0.12em] text-brand-mist-light">
            {label}
          </p>
        </div>
      ))}
    </div>
  )
}

function SelectionProcessRow() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-10% 0px', amount: 0.15 })

  return (
    <div ref={ref} className="relative mt-14 lg:mt-20">
      <div
        className="pointer-events-none absolute left-[8%] right-[8%] top-[22px] hidden h-px bg-[rgba(184,150,90,0.25)] lg:block"
        aria-hidden
      />
      <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
        {SELECTION_STEPS.map(({ n, title, desc }, i) => (
          <motion.div
            key={title}
            className="relative flex flex-col items-center text-center lg:items-center"
            initial={{ y: 28, opacity: 0 }}
            animate={inView ? { y: 0, opacity: 1 } : { y: 28, opacity: 0 }}
            transition={{ duration: 0.55, delay: 0.08 + i * 0.1, ease: motionEase }}
          >
            <div
              className="relative z-[1] flex h-[48px] w-[48px] shrink-0 items-center justify-center rounded-full border-[0.5px] border-brand-brass bg-brand-charcoal-mid"
              style={{ boxShadow: '0 0 0 4px #1C1915' }}
            >
              <span className="font-display text-[16px] font-normal text-brand-brass">{n}</span>
            </div>
            <h3 className="mt-6 font-display text-[18px] font-normal leading-snug text-brand-ivory">{title}</h3>
            <p className="mt-3 max-w-[240px] font-body text-[12px] font-normal leading-relaxed text-brand-mist">{desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

const submitErrorClass = 'font-body text-[13px] font-normal text-red-600'

export default function PartnerProgram() {
  const [form, setForm] = useState(initialForm)
  const [submitted, setSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitError('')
    try {
      setIsSubmitting(true)
      const { error } = await supabase.from('partner_applications').insert({
        full_name: form.fullName.trim(),
        company_name: form.company.trim(),
        partner_type: form.partnerType,
        phone: form.phone.trim(),
        email: form.email.trim(),
        city: form.city.trim(),
        business_description: form.about.trim(),
      })
      if (error) throw error
      savePartnerApplication({
        fullName: form.fullName.trim(),
        company: form.company.trim(),
        partnerType: form.partnerType,
        phone: form.phone.trim(),
        email: form.email.trim(),
        city: form.city.trim(),
        about: form.about.trim(),
        agreed: form.agreed,
      })
      setSubmitted(true)
      setForm(initialForm)
    } catch {
      setSubmitError('Something went wrong. Please try again or call us directly.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="flex-1">
      {/* HERO */}
      <section className="relative flex min-h-[72vh] w-full flex-col overflow-hidden">
        <img
          src="/assets/images/partners-hero.jpg"
          alt=""
          loading="eager"
          className="absolute inset-0 h-full w-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-black/70" aria-hidden />
        <div className="relative z-10 flex flex-1 flex-col">
          <div className="flex flex-1 flex-col justify-center px-6 py-28 lg:px-24 lg:py-32">
            <div className="mx-auto w-full max-w-[1400px]">
              <SectionLabel light>Partner Program</SectionLabel>

              <AnimatedText
                text="Build a Scalable Interior Business. Backed by Maywood."
                tag="h1"
                getWordClassName={(_w, i) => (i >= 6 ? 'italic text-[#D4B483]' : '')}
                className="mt-8 max-w-[1100px] font-display text-[60px] font-light leading-[1.06] text-brand-ivory max-lg:text-[clamp(34px,8vw,60px)]"
              />

              <p className="mt-8 max-w-[560px] font-body text-[15px] font-normal leading-[1.85] text-brand-mist-light">
                Join Bangalore&apos;s most reliable interior execution network. We handle manufacturing, quality,
                technology and logistics — you focus on clients and growth.
              </p>

              <div className="mt-10 flex flex-wrap items-center gap-4">
                <a href="#apply" className={[buttonClasses('primary'), 'uppercase tracking-[0.12em]'].join(' ')}>
                  Apply to Partner
                </a>
                <a
                  href="/partner-deck.pdf"
                  className={[buttonClasses('ghost', 'text-brand-ivory hover:border-brand-brass'), 'uppercase tracking-[0.12em]'].join(
                    ' ',
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Download Program Overview
                </a>
              </div>
            </div>
          </div>

          <div className="border-t border-white/[0.08] bg-brand-ivory-deep px-6 py-10 lg:px-24">
            <div className="mx-auto max-w-[1400px]">
              <HeroStatStrip />
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2 — The Problem We Solve */}
      <section className="bg-brand-ivory px-6 py-24 lg:px-24 lg:py-32">
        <div className="mx-auto max-w-[1400px]">
          <SectionLabel>The Opportunity</SectionLabel>
          <AnimatedText
            text="The interior industry is consolidating. Be on the right side."
            tag="h2"
            getWordClassName={(_w, i) => (i >= 5 ? 'italic' : '')}
            className="mt-6 max-w-[920px] font-display text-[clamp(30px,4vw,48px)] font-light leading-[1.08] text-brand-charcoal"
          />

          <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-3 md:gap-8">
            {OPPORTUNITY_CARDS.map((card) => (
              <article
                key={card.title}
                className="rounded-[2px] border-[0.5px] border-brand-brass-pale bg-brand-ivory-deep p-8 transition-colors duration-200 hover:border-brand-brass md:px-8 md:py-10"
              >
                <h3 className="font-display text-[22px] font-normal leading-snug text-brand-charcoal">{card.title}</h3>
                <p className="mt-4 font-body text-[13px] font-normal leading-[1.8] text-brand-mist">{card.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 3 — The Partner Model */}
      <section className="bg-brand-charcoal px-6 py-24 lg:px-24 lg:py-32">
        <div className="mx-auto max-w-[1400px]">
          <SectionLabel light>The Model</SectionLabel>
          <AnimatedText
            text="A clear division of labor. Maximum efficiency."
            tag="h2"
            getWordClassName={(_w, i) => (i >= 5 ? 'italic text-[#D4B483]' : '')}
            className="mt-6 max-w-[900px] font-display text-[clamp(30px,4vw,48px)] font-light leading-[1.08] text-brand-ivory"
          />
          <p className="mt-6 max-w-[560px] font-body text-[15px] font-normal leading-relaxed text-brand-mist">
            Partners focus on growth while Maywood handles the heavy lifting.
          </p>

          <div className="mt-14 grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12">
            <div className="rounded-[2px] border border-brand-brass/25 bg-brand-charcoal-mid/40 p-8 lg:p-10">
              <div className="flex h-12 w-12 items-center justify-center rounded-full border border-brand-brass/40 bg-brand-charcoal">
                <Shield className="h-6 w-6 text-brand-brass" strokeWidth={1.25} aria-hidden />
              </div>
              <h3 className="mt-6 font-display text-[22px] font-normal text-brand-ivory">Maywood Handles</h3>
              <ul className="mt-6 space-y-3 border-t border-white/10 pt-6">
                {MAYWOOD_HANDLES.map((line) => (
                  <li key={line} className="flex gap-3 font-body text-[13px] font-normal leading-[1.75] text-brand-mist">
                    <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-brand-brass" aria-hidden />
                    <span>{line}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-[2px] border border-brand-brass/25 bg-brand-charcoal-mid/40 p-8 lg:p-10">
              <div className="flex h-12 w-12 items-center justify-center rounded-full border border-brand-brass/40 bg-brand-charcoal">
                <Star className="h-6 w-6 text-brand-brass" strokeWidth={1.25} aria-hidden />
              </div>
              <h3 className="mt-6 font-display text-[22px] font-normal text-brand-ivory">Partner Handles</h3>
              <ul className="mt-6 space-y-3 border-t border-white/10 pt-6">
                {PARTNER_HANDLES.map((line) => (
                  <li key={line} className="flex gap-3 font-body text-[13px] font-normal leading-[1.75] text-brand-mist">
                    <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-brand-brass" aria-hidden />
                    <span>{line}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4 — Revenue Model */}
      <section className="bg-brand-ivory px-6 py-24 lg:px-24 lg:py-32">
        <div className="mx-auto max-w-[900px] text-center">
          <SectionLabel className="justify-center">The Numbers</SectionLabel>
          <h2 className="mt-6 font-display text-[clamp(30px,4vw,44px)] font-light leading-[1.08] text-brand-charcoal">
            High margin. Zero manufacturing overhead.
          </h2>

          <div className="mx-auto mt-12 max-w-xl rounded-[2px] border border-brand-brass/25 bg-[#1a1612] px-6 py-10 md:px-10">
            <div className="space-y-6 text-center">
              <div>
                <p className="font-display text-[clamp(28px,5vw,36px)] font-light text-brand-brass">₹8,00,000</p>
                <p className="mt-2 font-body text-[11px] font-medium uppercase tracking-[0.14em] text-brand-mist-light">
                  Average Project Value
                </p>
              </div>
              <p className="font-display text-2xl font-light text-brand-mist">×</p>
              <div>
                <p className="font-display text-[clamp(28px,5vw,36px)] font-light text-brand-brass">15–20%</p>
                <p className="mt-2 font-body text-[11px] font-medium uppercase tracking-[0.14em] text-brand-mist-light">
                  Flat Partner Margin
                </p>
              </div>
              <p className="font-display text-2xl font-light text-brand-mist">=</p>
              <div>
                <p className="font-display text-[clamp(28px,5vw,36px)] font-light text-brand-brass">
                  ₹1,20,000 – ₹1,60,000
                </p>
                <p className="mt-2 font-body text-[11px] font-medium uppercase tracking-[0.14em] text-brand-mist-light">
                  Partner Earnings Per Project
                </p>
              </div>
            </div>
          </div>

          <ul className="mx-auto mt-10 max-w-[640px] space-y-4 text-left">
            {REVENUE_BULLETS.map((line) => (
              <li key={line} className="flex gap-3 font-body text-[13px] font-normal leading-[1.8] text-brand-mist">
                <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-brand-brass" aria-hidden />
                <span>{line}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* SECTION 5 — Partner Growth Journey */}
      <section className="bg-brand-charcoal px-6 py-24 lg:px-24 lg:py-32">
        <div className="mx-auto max-w-[1400px]">
          <SectionLabel light>Your Growth Path</SectionLabel>
          <h2 className="mt-6 max-w-[900px] font-display text-[clamp(30px,4vw,48px)] font-light leading-[1.08] text-brand-ivory">
            From launch to market leadership.
          </h2>

          <div className="mt-14 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
            {GROWTH_PHASES.map(({ phase, title, range, desc }) => (
              <div
                key={phase}
                className="relative rounded-[2px] border border-brand-brass/20 bg-brand-charcoal-mid/30 p-6 pt-8 lg:p-8"
              >
                <span className="font-display text-[40px] font-light leading-none text-brand-brass/[0.2]">{phase}</span>
                <h3 className="mt-4 font-display text-[20px] font-normal text-brand-ivory">{title}</h3>
                <p className="mt-1 font-body text-[10px] font-semibold uppercase tracking-[0.16em] text-brand-brass">{range}</p>
                <p className="mt-4 font-body text-[12px] font-normal leading-relaxed text-brand-mist">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 6 — What Maywood Removes */}
      <section className="bg-brand-ivory px-6 py-24 lg:px-24 lg:py-32">
        <div className="mx-auto max-w-[1400px]">
          <SectionLabel>What We Absorb</SectionLabel>
          <AnimatedText
            text="We handle the complexity. You handle the clients."
            tag="h2"
            getWordClassName={(_w, i) => (i >= 4 ? 'italic' : '')}
            className="mt-6 max-w-[900px] font-display text-[clamp(30px,4vw,48px)] font-light leading-[1.08] text-brand-charcoal"
          />

          <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:gap-8">
            {ABSORB_CARDS.map((card) => (
              <article
                key={card.title}
                className="rounded-[2px] border-[0.5px] border-brand-brass-pale bg-brand-ivory-deep p-8 transition-colors duration-200 hover:border-brand-brass lg:p-10"
              >
                <h3 className="font-display text-[20px] font-normal leading-snug text-brand-charcoal">{card.title}</h3>
                <p className="mt-4 font-body text-[13px] font-normal leading-[1.8] text-brand-mist">{card.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 7 — Central Support System */}
      <section className="bg-brand-charcoal px-6 py-24 lg:px-24 lg:py-32">
        <div className="mx-auto max-w-[1400px]">
          <SectionLabel light>What You Get</SectionLabel>
          <h2 className="mt-6 max-w-[920px] font-display text-[clamp(30px,4vw,48px)] font-light leading-[1.08] text-brand-ivory">
            A complete backend built for your success.
          </h2>

          <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {SUPPORT_ITEMS.map((item) => (
              <article
                key={item.n}
                className="relative overflow-hidden rounded-[2px] border border-brand-brass/20 bg-brand-charcoal-mid/40 p-8"
              >
                <span className="font-display text-[32px] font-light leading-none text-brand-brass/[0.25]" aria-hidden>
                  {item.n}
                </span>
                <h3 className="mt-4 font-display text-[20px] font-normal text-brand-ivory">{item.title}</h3>
                <p className="mt-3 font-body text-[12px] font-normal leading-relaxed text-brand-mist">{item.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 8 — Ideal Partner Profile */}
      <section className="bg-brand-ivory px-6 py-24 lg:px-24 lg:py-32">
        <div className="mx-auto max-w-[1400px]">
          <SectionLabel>Who We&apos;re Looking For</SectionLabel>
          <h2 className="mt-6 max-w-[900px] font-display text-[clamp(30px,4vw,48px)] font-light leading-[1.08] text-brand-charcoal">
            Not just an investor. An operator.
          </h2>
          <p className="mt-6 max-w-[560px] font-body text-[15px] font-normal leading-relaxed text-brand-mist">
            We are selective. We partner with entrepreneurs who share our vision for excellence and scale.
          </p>
          <span className="mt-6 inline-flex rounded-full border border-[rgba(184,150,90,0.6)] bg-transparent px-4 py-1.5 font-body text-[10px] font-semibold uppercase tracking-[0.14em] text-[#B8965A]">
            By invitation only
          </span>

          <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {IDEAL_CRITERIA.map((item) => (
              <article
                key={item.n}
                className="rounded-[2px] border-[0.5px] border-brand-brass-pale bg-brand-ivory-deep p-8 transition-colors duration-200 hover:border-brand-brass"
              >
                <span className="font-display text-[28px] font-light text-brand-brass/[0.35]">{item.n}</span>
                <h3 className="mt-4 font-display text-[19px] font-normal text-brand-charcoal">{item.title}</h3>
                <p className="mt-3 font-body text-[13px] font-normal leading-[1.8] text-brand-mist">{item.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 9 — Selection Process */}
      <section className="bg-brand-charcoal px-6 py-24 lg:px-24 lg:py-32">
        <div className="mx-auto max-w-[1400px]">
          <SectionLabel light>The Process</SectionLabel>
          <AnimatedText
            text="From application to launch in 2–3 weeks."
            tag="h2"
            getWordClassName={(_w, i) => (i >= 3 ? 'italic text-[#D4B483]' : '')}
            className="mt-6 max-w-[920px] font-display text-[clamp(30px,4vw,48px)] font-light leading-[1.08] text-brand-ivory"
          />
          <SelectionProcessRow />
        </div>
      </section>

      {/* SECTION 10 — Application Form */}
      <section id="apply" className="scroll-mt-28 bg-brand-ivory px-6 py-24 lg:px-24 lg:py-32">
        <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-14 lg:grid-cols-2 lg:gap-20 lg:items-start">
          <div>
            <SectionLabel>Apply Now</SectionLabel>
            <h2 className="mt-6 max-w-[520px] font-display text-[clamp(30px,4vw,44px)] font-light leading-[1.08] text-brand-charcoal">
              Ready to partner with Maywood?
            </h2>
            <p className="mt-6 max-w-md font-body text-[14px] font-normal leading-relaxed text-brand-mist">
              Takes 5 minutes. Our team will reach out within 48 hours.
            </p>
          </div>

          <div className="lg:pt-2">
            {submitted ? (
              <div className="rounded-[2px] border-[0.5px] border-brand-brass bg-brand-ivory-deep px-8 py-10">
                <p className="font-body text-[15px] font-normal leading-relaxed text-brand-charcoal">
                  Application received. Our team will reach out within 48 hours.
                </p>
                <Link
                  to="/"
                  className="mt-8 inline-block border-b border-brand-brass pb-0.5 font-body text-[12px] font-semibold uppercase tracking-[0.14em] text-brand-brass transition-colors hover:text-brand-charcoal"
                >
                  Back to Home
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-8">
                <label className="block">
                  <span className="mb-2 block font-body text-[11px] font-semibold uppercase tracking-[0.14em] text-brand-brass">
                    Full name <span className="text-red-600">*</span>
                  </span>
                  <input
                    type="text"
                    value={form.fullName}
                    onChange={(e) => setForm((p) => ({ ...p, fullName: e.target.value }))}
                    className={inputClass}
                    required
                    autoComplete="name"
                  />
                </label>
                <label className="block">
                  <span className="mb-2 block font-body text-[11px] font-semibold uppercase tracking-[0.14em] text-brand-brass">
                    Company / Firm name
                  </span>
                  <input
                    type="text"
                    value={form.company}
                    onChange={(e) => setForm((p) => ({ ...p, company: e.target.value }))}
                    className={inputClass}
                    autoComplete="organization"
                  />
                </label>
                <label className="block">
                  <span className="mb-2 block font-body text-[11px] font-semibold uppercase tracking-[0.14em] text-brand-brass">
                    Partner type
                  </span>
                  <select
                    value={form.partnerType}
                    onChange={(e) => setForm((p) => ({ ...p, partnerType: e.target.value }))}
                    className={inputClass}
                    required
                  >
                    <option value="">Select type</option>
                    {PARTNER_TYPES.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="block">
                  <span className="mb-2 block font-body text-[11px] font-semibold uppercase tracking-[0.14em] text-brand-brass">
                    Phone number <span className="text-red-600">*</span>
                  </span>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
                    className={inputClass}
                    required
                    autoComplete="tel"
                  />
                </label>
                <label className="block">
                  <span className="mb-2 block font-body text-[11px] font-semibold uppercase tracking-[0.14em] text-brand-brass">
                    Email address <span className="text-red-600">*</span>
                  </span>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                    className={inputClass}
                    required
                    autoComplete="email"
                  />
                </label>
                <label className="block">
                  <span className="mb-2 block font-body text-[11px] font-semibold uppercase tracking-[0.14em] text-brand-brass">
                    City
                  </span>
                  <input
                    type="text"
                    value={form.city}
                    onChange={(e) => setForm((p) => ({ ...p, city: e.target.value }))}
                    className={inputClass}
                    placeholder="Bangalore"
                    autoComplete="address-level2"
                  />
                </label>
                <label className="block">
                  <span className="mb-2 block font-body text-[11px] font-semibold uppercase tracking-[0.14em] text-brand-brass">
                    Tell us briefly about your business and the types of projects you typically work on
                  </span>
                  <textarea
                    value={form.about}
                    onChange={(e) => setForm((p) => ({ ...p, about: e.target.value }))}
                    rows={4}
                    className={`${inputClass} resize-none`}
                  />
                </label>
                <label className="flex cursor-pointer items-start gap-3">
                  <input
                    type="checkbox"
                    checked={form.agreed}
                    onChange={(e) => setForm((p) => ({ ...p, agreed: e.target.checked }))}
                    className="mt-1 h-3.5 w-3.5 rounded border-brand-mist text-brand-brass focus:ring-brand-brass"
                    required
                  />
                  <span className="font-body text-[13px] font-normal leading-relaxed text-brand-charcoal">
                    I have read the partner program overview and want to know more
                  </span>
                </label>
                <div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`flex w-full items-center justify-center gap-2 uppercase tracking-[0.12em] ${buttonClasses('primary')} disabled:pointer-events-none disabled:opacity-50`}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" strokeWidth={2} aria-hidden />
                        Sending…
                      </>
                    ) : (
                      'Submit Application'
                    )}
                  </button>
                  {submitError ? <p className={`mt-4 ${submitErrorClass}`}>{submitError}</p> : null}
                </div>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* SECTION 11 — Bottom CTA */}
      <section className="bg-brand-brass px-6 py-16 text-center lg:px-24 lg:py-20">
        <div className="mx-auto max-w-[720px]">
          <p className="font-display text-[clamp(28px,4vw,36px)] font-normal leading-[1.15] text-brand-charcoal">
            Have questions before applying?
          </p>
          <p className="mx-auto mt-6 max-w-lg font-body text-[14px] font-normal leading-relaxed text-brand-charcoal/65">
            Schedule a 15-minute call with our partnerships team.
          </p>
          <a
            href="https://wa.me/919606977677"
            target="_blank"
            rel="noopener noreferrer"
            className={['mt-10 inline-flex', buttonClasses('dark')].join(' ')}
          >
            Schedule a Call
          </a>
        </div>
      </section>

      {/* Partners contact — page footer strip */}
      <section className="border-t border-white/10 bg-brand-charcoal px-6 py-10 lg:px-24" aria-label="Partners contact">
        <div className="mx-auto flex max-w-[1400px] flex-col items-center justify-center gap-4 sm:flex-row sm:gap-12">
          <a
            href="mailto:partners@maywood.in"
            className="font-body text-[14px] font-normal text-brand-mist-light transition-colors hover:text-brand-brass"
          >
            partners@maywood.in
          </a>
          <a
            href="tel:+919606546020"
            className="font-body text-[14px] font-normal text-brand-mist-light transition-colors hover:text-brand-brass"
          >
            +91 96065 46020
          </a>
        </div>
      </section>
    </main>
  )
}
