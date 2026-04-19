import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import SectionLabel from '../ui/SectionLabel'
import AnimatedText from '../ui/AnimatedText'
import { PROCESS_STEPS } from '../../data/processSteps'

const motionEase = [0.16, 1, 0.3, 1]

const defaultHeadlineClass = (_w, i) => (i >= 2 ? 'italic text-[#D4B483]' : '')

export default function ProcessSection({
  sectionId = 'process',
  steps = PROCESS_STEPS,
  label = 'How It Works',
  headline = 'Your project. Our process.',
  subtext = 'Four structured stages. Complete transparency at every step.',
  headlineGetWordClassName = defaultHeadlineClass,
  /** When true, use wide timeline grid + mobile vertical connector (homepage 6 steps) */
  timelineLayout = false,
}) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-10% 0px', amount: 0.15 })
  const isHomeTimeline = timelineLayout

  return (
    <section
      id={sectionId}
      className="relative scroll-mt-28 overflow-hidden bg-brand-charcoal px-6 py-16 lg:px-24 lg:py-32"
    >
      <div className="relative z-[1] mx-auto max-w-[1400px]">
        <SectionLabel light>{label}</SectionLabel>

        <AnimatedText
          text={headline}
          tag="h2"
          getWordClassName={headlineGetWordClassName}
          className="mt-6 max-w-[920px] font-display text-[clamp(30px,4vw,48px)] font-light leading-[1.06] text-brand-ivory"
        />

        <p className="mt-6 max-w-2xl font-body text-[15px] font-normal leading-relaxed text-brand-mist-light">
          {subtext}
        </p>

        <div ref={ref} className="relative z-[1] mt-16 lg:mt-20">
          {/* Desktop: horizontal dashed connector */}
          <div
            className={[
              'pointer-events-none absolute z-0 hidden h-0 border-t border-dashed border-[rgba(184,150,90,0.45)] lg:block',
              isHomeTimeline ? 'left-[3%] right-[3%] top-[58px]' : 'left-[5%] right-[5%] top-[52px]',
            ].join(' ')}
            aria-hidden
          />

          {/* Mobile / tablet: vertical dashed connector (homepage timeline only) */}
          {isHomeTimeline ? (
            <div
              className="pointer-events-none absolute left-3 top-0 z-0 block h-[calc(100%-2rem)] w-0 border-l border-dashed border-[rgba(184,150,90,0.45)] lg:hidden"
              aria-hidden
            />
          ) : null}

          <div
            className={[
              'relative z-[1] grid gap-8',
              isHomeTimeline
                ? 'grid-cols-1 pl-8 md:grid-cols-2 md:pl-8 lg:grid-cols-6 lg:gap-4 lg:pl-0 xl:gap-5'
                : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6',
            ].join(' ')}
          >
            {steps.map(({ n, title, desc }, i) => (
              <motion.div
                key={`${title}-${n}`}
                className="relative overflow-hidden rounded-sm border border-[rgba(184,150,90,0.2)] bg-[rgba(28,25,21,0.55)] p-6 text-left shadow-[inset_0_1px_0_rgba(255,255,255,0.03)] sm:p-7"
                initial={{ y: 28, opacity: 0 }}
                animate={inView ? { y: 0, opacity: 1 } : { y: 28, opacity: 0 }}
                transition={{
                  duration: 0.55,
                  delay: 0.1 + i * 0.08,
                  ease: motionEase,
                }}
              >
                <div
                  className="pointer-events-none absolute -left-[20%] -top-[30%] h-[140%] w-[140%] bg-[radial-gradient(ellipse_55%_50%_at_50%_0%,rgba(184,150,90,0.06),transparent_62%)]"
                  aria-hidden
                />
                <div className="relative">
                  <p className="font-display text-[48px] font-light leading-none text-brand-brass lg:text-[52px]">
                    {String(n).padStart(2, '0')}
                  </p>
                  <h3 className="mt-3 font-display text-[18px] font-normal leading-snug text-brand-ivory">{title}</h3>
                  <p className="mt-3 font-body text-[14px] font-normal leading-relaxed text-[#B5B0A8]">{desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
