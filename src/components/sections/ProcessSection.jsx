import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import SectionLabel from '../ui/SectionLabel'
import AnimatedText from '../ui/AnimatedText'
import { PROCESS_STEPS } from '../../data/processSteps'

const motionEase = [0.16, 1, 0.3, 1]

export default function ProcessSection({ sectionId = 'process' }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-10% 0px', amount: 0.15 })

  return (
    <section
      id={sectionId}
      className="relative scroll-mt-28 overflow-hidden bg-brand-charcoal px-6 py-16 lg:px-24 lg:py-32"
    >
      <div className="relative z-[1] mx-auto max-w-[1400px]">
        <SectionLabel light>How It Works</SectionLabel>

        <AnimatedText
          text="Your project. Our process."
          tag="h2"
          getWordClassName={(_w, i) => (i >= 2 ? 'italic text-[#D4B483]' : '')}
          className="mt-6 max-w-[920px] font-display text-[clamp(30px,4vw,48px)] font-light leading-[1.06] text-brand-ivory"
        />

        <p className="mt-6 max-w-lg font-body text-[14px] font-normal leading-relaxed text-brand-mist-light">
          Four structured stages. Complete transparency at every step.
        </p>

        <div ref={ref} className="relative z-[1] mt-20 lg:mt-24">
          <div
            className="pointer-events-none absolute left-[10%] right-[10%] top-[26px] hidden h-px bg-[rgba(184,150,90,0.3)] lg:block"
            aria-hidden
          />

          <div className="grid grid-cols-1 gap-14 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
            {PROCESS_STEPS.map(({ n, title, desc }, i) => (
              <motion.div
                key={title}
                className="relative z-[1] flex flex-col items-center text-center"
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
                <p className="mt-3 max-w-[160px] font-body text-[12px] font-normal leading-relaxed text-brand-mist">
                  {desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
