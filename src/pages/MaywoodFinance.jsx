import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Link } from 'react-router-dom'
import SectionLabel from '../components/ui/SectionLabel'
import AnimatedText from '../components/ui/AnimatedText'
import MaywoodCalculator from '../components/MaywoodCalculator'
import { buttonClasses } from '../lib/buttonStyles'
import { track } from '../utils/tracking'

const MotionLink = motion(Link)

const tapTransition = { type: 'tween', duration: 0.15, ease: [0.16, 1, 0.3, 1] }

const motionEase = [0.16, 1, 0.3, 1]

const FINANCE_STEPS = [
  {
    n: 1,
    title: 'Apply & Plan',
    desc: 'Submit your details and get your design and quote',
  },
  {
    n: 2,
    title: 'Get Approved',
    desc: 'Quick approval with minimal documentation',
  },
  {
    n: 3,
    title: 'Build & Move In',
    desc: 'We design, manufacture, and deliver your home — before your EMIs begin',
  },
]

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
      <section className="relative flex min-h-[70vh] flex-col overflow-hidden">
        <img
          src="/assets/images/finance-hero.jpg"
          alt=""
          className="absolute inset-0 h-full w-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-black/65" aria-hidden />
        <div className="relative z-10 flex flex-1 flex-col">
          <div className="mx-auto flex w-full max-w-[1400px] flex-1 flex-col justify-center px-6 pb-8 pt-16 lg:px-24 lg:pb-12 lg:pt-28">
            <SectionLabel light>Maywood Finance</SectionLabel>

            <AnimatedText
              text="Get premium home interiors. Pay smart."
              tag="h1"
              getWordClassName={(_w, i, n) => (i >= n - 2 ? 'italic text-[#D4B483]' : '')}
              className="mt-8 max-w-[1100px] font-display text-[clamp(38px,5vw,58px)] font-light leading-[1.06] text-brand-ivory"
            />

            <p className="mt-6 max-w-[520px] font-body text-[15px] font-normal leading-relaxed text-brand-mist-light">
              Special EMI plans starting from 0%* to 7% — making high-quality interiors more affordable than ever.
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
                href="tel:+919606977677"
                className={buttonClasses('ghost', 'text-brand-ivory hover:border-brand-brass')}
              >
                Talk to an Advisor
              </a>
            </div>
          </div>

          <div className="px-6 pb-12 sm:px-10 lg:px-24">
            <div className="mx-auto max-w-[900px] border border-brand-brass-pale/80 bg-brand-ivory-deep px-8 py-8 shadow-[0_24px_48px_-20px_rgba(0,0,0,0.35)] sm:px-12">
              <div className="grid grid-cols-1 gap-8 sm:grid-cols-3 sm:gap-6">
              <div className="text-center sm:text-left">
                <p className="font-display text-[28px] font-light leading-none text-brand-charcoal sm:text-[32px]">
                  ₹4,999/mo
                </p>
                <p className="mt-2 font-body text-[10px] font-medium uppercase tracking-[0.14em] text-brand-mist">
                  STARTING EMI
                </p>
              </div>
              <div className="flex flex-col items-center text-center sm:border-x sm:border-brand-brass-pale/40 sm:px-4">
                <p className="font-display text-[28px] font-light leading-none text-brand-charcoal sm:text-[32px]">
                  0% – 7%
                </p>
                <span className="mt-2 inline-flex rounded-full border border-brand-brass/60 bg-[rgba(184,150,90,0.12)] px-2.5 py-1 font-body text-[9px] font-semibold uppercase tracking-[0.12em] text-brand-brass">
                  INDUSTRY BEST
                </span>
                <p className="mt-2 font-body text-[10px] font-medium uppercase tracking-[0.14em] text-brand-mist">
                  RATE OF INTEREST
                </p>
              </div>
              <div className="text-center sm:text-right">
                <p className="font-display text-[28px] font-light leading-none text-brand-charcoal sm:text-[32px]">
                  6 – 60 Months
                </p>
                <p className="mt-2 font-body text-[10px] font-medium uppercase tracking-[0.14em] text-brand-mist">
                  EMI TENURE
                </p>
              </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-brand-ivory px-6 py-16 lg:px-24 lg:py-28">
        <div className="mx-auto max-w-[1200px]">
          <SectionLabel>THE PROCESS</SectionLabel>

          <AnimatedText
            text="From Approval to Move-In. Simplified."
            tag="h2"
            className="mt-6 font-display text-[clamp(30px,4vw,44px)] font-light leading-[1.08] text-brand-charcoal"
          />

          <p className="mt-4 max-w-[640px] font-body text-[15px] font-normal leading-relaxed text-brand-mist">
            A seamless process — from financing to a fully completed home.
          </p>

          <FinanceProcessFlow />
        </div>
      </section>

      {/* Project cost calculator */}
      <section className="bg-[#f5f0eb] px-6 py-16 lg:px-24 lg:py-28">
        <div className="mx-auto max-w-[1400px]">
          <SectionLabel>See it in numbers</SectionLabel>

          <h2 className="mt-6 max-w-[900px] font-display text-[clamp(30px,4vw,44px)] font-light leading-[1.08] text-brand-charcoal">
            What does your project actually cost per month?
          </h2>
          <p className="mt-4 max-w-[640px] font-body text-[15px] font-normal leading-relaxed text-brand-mist">
            Real examples. Real numbers. No surprises.
          </p>

          <MaywoodCalculator className="mt-10" contactGate calculatorLeadSource="finance-page" />

          <p className="mx-auto mt-12 max-w-[720px] text-center font-body text-[12px] font-normal italic leading-relaxed text-brand-mist">
            EMI amounts are indicative. Final rates based on applicant profile, tenure, and lending partner approval.
            Maywood Finance is facilitated through partner NBFCs.
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
            onClick={() => track.eligibilityClick()}
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
