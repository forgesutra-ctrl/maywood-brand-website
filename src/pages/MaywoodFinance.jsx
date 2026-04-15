import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Link } from 'react-router-dom'
import SectionLabel from '../components/ui/SectionLabel'
import AnimatedText from '../components/ui/AnimatedText'
import { buttonClasses } from '../lib/buttonStyles'

const MotionLink = motion(Link)

const tapTransition = { type: 'tween', duration: 0.15, ease: [0.16, 1, 0.3, 1] }

const motionEase = [0.16, 1, 0.3, 1]

const FINANCE_STEPS = [
  {
    n: 1,
    title: 'Apply Online',
    desc: 'Fill in a simple form. No branch visits, no lengthy paperwork.',
  },
  {
    n: 2,
    title: 'Get Approved',
    desc: 'Approval in as little as 24 hours. Our team handles coordination.',
  },
  {
    n: 3,
    title: 'Start Your Project',
    desc: 'Work begins immediately. Pay as your project progresses.',
  },
]

const SCENARIOS = [
  {
    type: '2BHK Full Interiors',
    value: '₹8,00,000',
    emi: '₹24,999',
    emiNote: 'for 36 months',
  },
  {
    type: 'Modular Kitchen + 2 Wardrobes',
    value: '₹3,00,000',
    emi: '₹9,499',
    emiNote: 'for 36 months',
  },
  {
    type: 'Office Workspace (1000 sq ft)',
    value: '₹15,00,000',
    emi: '₹46,999',
    emiNote: 'for 36 months',
  },
]

const INCLUDED = ['Design', 'Materials', 'Manufacturing', 'Installation']

function FinanceProcessFlow() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-10% 0px', amount: 0.15 })

  return (
    <div ref={ref} className="relative mt-16 lg:mt-20">
      <div
        className="pointer-events-none absolute left-[12%] right-[12%] top-[26px] hidden h-px bg-[rgba(184,150,90,0.3)] lg:block"
        aria-hidden
      />

      <div className="grid grid-cols-1 gap-14 lg:grid-cols-3 lg:gap-8">
        {FINANCE_STEPS.map(({ n, title, desc }, i) => (
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
              style={{ boxShadow: '0 0 0 4px #F7F3ED' }}
            >
              <span className="font-display text-[20px] font-normal text-brand-brass">{n}</span>
            </div>
            <h3 className="mt-8 font-display text-[20px] font-normal leading-snug text-brand-charcoal">{title}</h3>
            <p className="mt-3 max-w-[280px] font-body text-[13px] font-normal leading-relaxed text-brand-mist">{desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

export default function MaywoodFinance() {
  return (
    <main className="flex-1">
      {/* Hero */}
      <section className="relative flex min-h-[70vh] flex-col bg-brand-charcoal">
        <div className="mx-auto flex w-full max-w-[1400px] flex-1 flex-col justify-center px-6 pb-8 pt-16 lg:px-24 lg:pb-12 lg:pt-28">
          <SectionLabel light>Maywood Finance</SectionLabel>

          <AnimatedText
            text="Design the home you want. Not the one you can afford right now."
            tag="h1"
            getWordClassName={(_w, i, n) => (i >= n - 2 ? 'italic text-[#D4B483]' : '')}
            className="mt-8 max-w-[1100px] font-display text-[clamp(38px,5vw,58px)] font-light leading-[1.06] text-brand-ivory"
          />

          <p className="mt-6 max-w-[520px] font-body text-[15px] font-normal leading-relaxed text-brand-mist-light">
            Maywood Finance makes premium interiors accessible with simple, flexible EMI plans — approved quickly, with
            minimal paperwork.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <MotionLink
              to="#eligibility-cta"
              className={buttonClasses('primary')}
              whileTap={{ scale: 0.98 }}
              transition={tapTransition}
            >
              Check Eligibility
            </MotionLink>
            <a
              href="tel:+910000000000"
              className={buttonClasses('ghost', 'text-brand-ivory hover:border-brand-brass')}
            >
              Talk to an Advisor
            </a>
          </div>
        </div>

        <div className="relative z-[1] px-6 pb-12 sm:px-10 lg:px-24">
          <div className="mx-auto max-w-[900px] border border-brand-brass-pale/80 bg-brand-ivory-deep px-8 py-8 shadow-[0_24px_48px_-20px_rgba(0,0,0,0.35)] sm:px-12">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-3 sm:gap-6">
              <div className="text-center sm:text-left">
                <p className="font-display text-[28px] font-light leading-none text-brand-charcoal sm:text-[32px]">
                  From ₹4,999/mo
                </p>
                <p className="mt-2 font-body text-[10px] font-medium uppercase tracking-[0.14em] text-brand-mist">
                  Starting EMI
                </p>
              </div>
              <div className="text-center sm:border-x sm:border-brand-brass-pale/40 sm:px-4">
                <p className="font-display text-[28px] font-light leading-none text-brand-charcoal sm:text-[32px]">
                  6–36 Months
                </p>
                <p className="mt-2 font-body text-[10px] font-medium uppercase tracking-[0.14em] text-brand-mist">
                  Flexible tenure
                </p>
              </div>
              <div className="text-center sm:text-right">
                <p className="font-display text-[28px] font-light leading-none text-brand-charcoal sm:text-[32px]">
                  24 Hr
                </p>
                <p className="mt-2 font-body text-[10px] font-medium uppercase tracking-[0.14em] text-brand-mist">
                  Approval time
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-brand-ivory px-6 py-16 lg:px-24 lg:py-28">
        <div className="mx-auto max-w-[1200px]">
          <SectionLabel>The Process</SectionLabel>

          <AnimatedText
            text="Three steps to your new space."
            tag="h2"
            className="mt-6 font-display text-[clamp(30px,4vw,44px)] font-light leading-[1.08] text-brand-charcoal"
          />

          <FinanceProcessFlow />
        </div>
      </section>

      {/* Example scenarios */}
      <section className="bg-brand-ivory-deep px-6 py-16 lg:px-24 lg:py-28">
        <div className="mx-auto max-w-[1400px]">
          <SectionLabel>See It In Numbers</SectionLabel>

          <AnimatedText
            text="What does your project cost per month?"
            tag="h2"
            className="mt-6 max-w-[900px] font-display text-[clamp(30px,4vw,44px)] font-light leading-[1.08] text-brand-charcoal"
          />

          <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-3 md:gap-8">
            {SCENARIOS.map((s) => (
              <article
                key={s.type}
                className="rounded-[2px] border-[0.5px] border-brand-brass-pale bg-brand-ivory p-10"
              >
                <p className="font-body text-[11px] font-semibold uppercase tracking-[0.14em] text-brand-brass">
                  {s.type}
                </p>
                <p className="mt-5 font-display text-[36px] font-light leading-none text-brand-charcoal">{s.value}</p>
                <div className="mt-6 flex flex-wrap items-baseline gap-2">
                  <span className="font-display text-[22px] font-normal text-brand-brass">
                    {s.emi} / month
                  </span>
                  <span className="font-body text-[12px] text-brand-mist">{s.emiNote}</span>
                </div>
                <ul className="mt-8 space-y-2 border-t border-brand-ivory-deep pt-6">
                  {INCLUDED.map((item) => (
                    <li key={item} className="flex gap-2 font-body text-[13px] leading-relaxed text-brand-mist">
                      <span className="text-brand-brass/80" aria-hidden>
                        +
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>

          <p className="mx-auto mt-12 max-w-2xl text-center font-body text-[12px] italic leading-relaxed text-brand-mist">
            EMI amounts are indicative. Final rates based on profile and tenure.
          </p>
        </div>
      </section>

      {/* Eligibility CTA */}
      <section
        id="eligibility-cta"
        className="scroll-mt-28 bg-brand-brass px-6 py-16 text-center lg:px-24 lg:py-24"
      >
        <div className="mx-auto max-w-[720px]">
          <AnimatedText
            text="Find out your EMI in 2 minutes."
            tag="h2"
            className="justify-center font-display text-[clamp(30px,4vw,48px)] font-light leading-[1.08] text-brand-charcoal"
          />

          <p className="mx-auto mt-6 max-w-md font-body text-[15px] font-normal leading-relaxed text-brand-charcoal/60">
            Share a few details — we&apos;ll show you what&apos;s possible before you commit to anything.
          </p>

          <MotionLink
            to="/instant-quote"
            className={['mt-10 inline-flex', buttonClasses('dark')].join(' ')}
            whileTap={{ scale: 0.98 }}
            transition={tapTransition}
          >
            Check Eligibility Now
          </MotionLink>
        </div>
      </section>
    </main>
  )
}
