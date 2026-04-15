import { useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import SectionLabel from '../components/ui/SectionLabel'
import AnimatedText from '../components/ui/AnimatedText'
import { buttonClasses } from '../lib/buttonStyles'
import { supabase } from '../lib/supabase'

const MotionLink = motion(Link)
const tapTransition = { type: 'tween', duration: 0.15, ease: [0.16, 1, 0.3, 1] }
const motionEase = [0.16, 1, 0.3, 1]

const HERO_STATS = [
  { value: '₹2 Cr+', label: 'Partner Payouts This Year' },
  { value: '85+', label: 'Active Partners' },
  { value: 'Priority', label: 'Project Execution for Partners' },
]

const PARTNER_TYPES = [
  'Architect',
  'Interior Designer',
  'Contractor',
  'Builder',
  'Real Estate Agent',
  'Developer',
  'Other',
]

const PARTNER_CARDS = [
  {
    title: 'Architects & Interior Designers',
    desc: 'Bring us your designed projects. We manufacture and execute — you retain your design relationship and earn a referral fee on every project.',
    bestFor: 'Firms with design capability but without execution infrastructure.',
  },
  {
    title: 'Contractors & Builders',
    desc: 'Add interior fit-outs to your offering without building a team. We handle everything — you focus on your core civil work.',
    bestFor: 'Civil contractors who want to upsell interiors to their clients.',
  },
  {
    title: 'Real Estate Agents & Developers',
    desc: 'Offer ready-to-move-in interiors as a value-add to your buyers. Earn referral income on every client you bring to Maywood.',
    bestFor: 'Agents and developers who want to offer a differentiated package.',
  },
]

const BENEFIT_CARDS = [
  {
    title: 'Revenue Share on Every Project',
    desc: 'A competitive commission structure on every project you refer or co-execute. Payouts processed within 30 days of project completion. No cap.',
  },
  {
    title: 'Dedicated Partner Manager',
    desc: 'You get a named Maywood contact — not a call centre. One person who owns your account, your projects and your commission tracking.',
  },
  {
    title: 'Manufacturing Priority',
    desc: 'Partner projects jump the production queue. Faster timelines mean faster closures and faster payments for everyone.',
  },
  {
    title: 'Co-Marketing Support',
    desc: 'We feature partner projects on our website, social media and in our experience centers. Your portfolio grows with every project.',
  },
]

const PROCESS_STEPS = [
  {
    n: '1',
    title: 'Apply & Get Approved',
    desc: 'Fill in the partner application. Our team reviews and responds within 48 hours.',
  },
  {
    n: '2',
    title: 'Refer a Project',
    desc: 'Bring us a client or a project scope. We take it from there — design, production, execution.',
  },
  {
    n: '3',
    title: 'Earn Your Commission',
    desc: 'Project completes, invoice raised, commission paid. Transparent tracking at every stage.',
  },
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
          <p className="mt-2 font-body text-[10px] font-medium uppercase tracking-[0.14em] text-brand-mist-light">{label}</p>
        </div>
      ))}
    </div>
  )
}

function PartnerProcessFlow() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-10% 0px', amount: 0.15 })

  return (
    <div ref={ref} className="relative mt-16 lg:mt-24">
      <div
        className="pointer-events-none absolute left-[12%] right-[12%] top-[26px] hidden h-px bg-[rgba(184,150,90,0.3)] lg:block"
        aria-hidden
      />

      <div className="grid grid-cols-1 gap-14 sm:grid-cols-3 lg:gap-6">
        {PROCESS_STEPS.map(({ n, title, desc }, i) => (
          <motion.div
            key={title}
            className="relative flex flex-col items-center text-center"
            initial={{ y: 28, opacity: 0 }}
            animate={inView ? { y: 0, opacity: 1 } : { y: 28, opacity: 0 }}
            transition={{
              duration: 0.55,
              delay: 0.1 + i * 0.12,
              ease: motionEase,
            }}
          >
            <div
              className="relative z-[1] flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-full border-[0.5px] border-brand-brass bg-brand-charcoal-mid"
              style={{ boxShadow: '0 0 0 4px #1C1915' }}
            >
              <span className="font-display text-[20px] font-normal text-brand-brass">{n}</span>
            </div>
            <h3 className="mt-8 font-display text-[20px] font-normal leading-snug text-brand-ivory">{title}</h3>
            <p className="mt-3 max-w-[260px] font-body text-[12px] font-normal leading-relaxed text-brand-mist">{desc}</p>
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
      // Enable RLS + anon insert policy on this table in Supabase
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
      <section className="relative flex min-h-[65vh] flex-col bg-brand-charcoal">
        <div className="flex flex-1 flex-col justify-center px-6 py-32 lg:px-24">
          <div className="mx-auto w-full max-w-[1400px]">
            <SectionLabel light>Partner Program</SectionLabel>

            <AnimatedText
              text="Grow your business. Backed by Maywood."
              tag="h1"
              getWordClassName={(_w, i) => (i >= 3 ? 'italic text-[#D4B483]' : '')}
              className="mt-8 max-w-[1100px] font-display text-[60px] font-light leading-[1.06] text-brand-ivory max-lg:text-[clamp(38px,8vw,60px)]"
            />

            <p className="mt-8 max-w-[520px] font-body text-[15px] font-normal leading-[1.85] text-brand-mist-light">
              Whether you&apos;re an architect, designer, contractor or real estate professional — Maywood&apos;s partner
              program gives you manufacturing muscle, execution support, and a revenue share model that rewards every
              referral.
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-4">
              <a href="#apply" className={buttonClasses('primary')}>
                Apply to Partner
              </a>
              <a
                href="/partner-deck.pdf"
                className={buttonClasses('ghost', 'text-brand-ivory hover:border-brand-brass')}
                target="_blank"
                rel="noopener noreferrer"
              >
                Download Partner Deck
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-white/[0.08] bg-brand-ivory-deep px-6 py-10 lg:px-24">
          <div className="mx-auto max-w-[1400px]">
            <HeroStatStrip />
          </div>
        </div>
      </section>

      <section className="bg-brand-ivory px-6 py-32 lg:px-24">
        <div className="mx-auto max-w-[1400px]">
          <SectionLabel>Who We Work With</SectionLabel>
          <AnimatedText
            text="Built for the people who build Bangalore."
            tag="h2"
            getWordClassName={(_w, i) => (i >= 5 ? 'italic' : '')}
            className="mt-6 max-w-[900px] font-display text-[clamp(30px,4vw,48px)] font-light leading-[1.08] text-brand-charcoal"
          />
          <p className="mt-6 max-w-[500px] font-body text-[14px] font-normal leading-relaxed text-brand-mist">
            We work best with professionals who already shape how Bangalore lives and works — and want a manufacturing
            partner who can deliver without diluting their brand.
          </p>

          <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-3 md:gap-8">
            {PARTNER_CARDS.map((card) => (
              <article
                key={card.title}
                className="rounded-[2px] border-[0.5px] border-brand-brass-pale bg-brand-ivory-deep p-8 transition-colors duration-200 hover:border-brand-brass md:px-8 md:py-10"
              >
                <div className="h-9 w-9 rounded-[2px] bg-brand-brass-pale ring-1 ring-brand-brass/15" aria-hidden />
                <h3 className="mt-6 font-display text-[22px] font-normal leading-snug text-brand-charcoal">{card.title}</h3>
                <p className="mt-4 font-body text-[13px] font-normal leading-[1.8] text-brand-mist">{card.desc}</p>
                <div className="mt-8 border-t border-brand-brass-pale/60 pt-6">
                  <p className="font-body text-[10px] font-medium uppercase tracking-[0.18em] text-brand-brass">Best for:</p>
                  <p className="mt-2 font-body text-[13px] font-normal leading-relaxed text-brand-mist">{card.bestFor}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-brand-ivory-deep px-6 py-32 lg:px-24">
        <div className="mx-auto max-w-[1400px]">
          <SectionLabel>What You Get</SectionLabel>
          <AnimatedText
            text="More than a referral program."
            tag="h2"
            getWordClassName={(_w, i) => (i >= 3 ? 'italic' : '')}
            className="mt-6 max-w-[900px] font-display text-[clamp(30px,4vw,48px)] font-light leading-[1.08] text-brand-charcoal"
          />

          <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8">
            {BENEFIT_CARDS.map((card, index) => (
              <article
                key={card.title}
                className="relative overflow-hidden rounded-[2px] border-[0.5px] border-brand-brass-pale bg-brand-ivory p-10 transition-colors duration-200 hover:border-brand-brass"
              >
                <span
                  className="pointer-events-none absolute right-6 top-4 font-display text-[48px] font-light leading-none text-brand-brass/[0.15]"
                  aria-hidden
                >
                  {String(index + 1).padStart(2, '0')}
                </span>
                <h3 className="relative font-display text-[22px] font-normal leading-snug text-brand-charcoal">{card.title}</h3>
                <p className="relative mt-4 font-body text-[13px] font-normal leading-[1.8] text-brand-mist">{card.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-brand-charcoal px-6 py-28 lg:px-24">
        <div className="mx-auto max-w-[1400px]">
          <SectionLabel light>The Process</SectionLabel>
          <AnimatedText
            text="Start earning in three steps."
            tag="h2"
            getWordClassName={(_w, i) => (i >= 3 ? 'italic text-[#D4B483]' : '')}
            className="mt-6 max-w-[920px] font-display text-[clamp(30px,4vw,48px)] font-light leading-[1.08] text-brand-ivory"
          />
          <PartnerProcessFlow />
        </div>
      </section>

      <section id="apply" className="scroll-mt-28 bg-brand-ivory px-6 py-32 lg:px-24">
        <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-14 lg:grid-cols-2 lg:gap-20 lg:items-start">
          <div>
            <SectionLabel>Apply Now</SectionLabel>
            <AnimatedText
              text="Ready to partner with Maywood?"
              tag="h2"
              className="mt-6 max-w-[520px] font-display text-[clamp(30px,4vw,44px)] font-light leading-[1.08] text-brand-charcoal"
            />
            <p className="mt-6 max-w-md font-body text-[14px] font-normal leading-relaxed text-brand-mist">
              Takes 3 minutes. Our team will reach out within 48 hours.
            </p>
            <ul className="mt-10 space-y-4">
              {[
                'No exclusivity required — you keep all your existing relationships',
                'Commission structure shared on approval call',
                'Already working with a Maywood client? Mention it in the form',
              ].map((line) => (
                <li key={line} className="flex gap-3 font-body text-[14px] font-normal leading-relaxed text-brand-charcoal">
                  <span className="shrink-0 font-display text-brand-brass" aria-hidden>
                    —
                  </span>
                  <span>{line}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:pt-2">
            {submitted ? (
              <div className="rounded-[2px] border-[0.5px] border-brand-brass bg-brand-ivory-deep px-8 py-10">
                <p className="font-body text-[15px] font-normal leading-relaxed text-brand-charcoal">
                  Application received. Your partner manager will reach out within 48 hours.
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
                    Full name
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
                    required
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
                    Phone number
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
                    Email address
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
                    required
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
                    I&apos;ve read the partner program overview and want to know more
                  </span>
                </label>
                <div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`flex w-full items-center justify-center gap-2 ${buttonClasses('primary')} disabled:pointer-events-none disabled:opacity-50`}
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

      <section className="bg-brand-brass px-6 py-16 text-center lg:px-24">
        <div className="mx-auto max-w-[720px]">
          <p className="font-display text-[36px] font-normal leading-[1.15] text-brand-charcoal">
            Have questions before applying?
          </p>
          <p className="mx-auto mt-6 max-w-lg font-body text-[14px] font-normal leading-relaxed text-brand-charcoal/65">
            Schedule a 15-minute intro call with our partnerships team.
          </p>
          <MotionLink
            to="/#consultation"
            className={['mt-10 inline-flex', buttonClasses('dark')].join(' ')}
            whileTap={{ scale: 0.98 }}
            transition={tapTransition}
          >
            Schedule a Call
          </MotionLink>
        </div>
      </section>
    </main>
  )
}
