import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { buttonClasses } from '../../lib/buttonStyles'
import { projectImages } from '../../data/projectImages'

const MotionLink = motion(Link)

const tapTransition = { type: 'tween', duration: 0.15, ease: [0.16, 1, 0.3, 1] }

const SLIDE_INTERVAL_MS = 3000
const CROSSFADE_MS = 700

function DifferenceSlideshow() {
  const slides = projectImages
  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (slides.length === 0) return
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % slides.length)
    }, SLIDE_INTERVAL_MS)
    return () => window.clearInterval(id)
  }, [slides.length])

  if (slides.length === 0) {
    return <div className="h-full w-full bg-brand-charcoal" aria-hidden />
  }

  return (
    <div className="relative h-full w-full overflow-hidden bg-brand-charcoal">
      {slides.map((img, i) => (
        <img
          key={img.src}
          src={img.src}
          alt=""
          decoding="async"
          className={[
            'absolute inset-0 w-full h-full object-cover object-center block',
            'transition-opacity ease-out',
            i === index ? 'z-[1] opacity-100' : 'z-0 opacity-0',
          ].join(' ')}
          style={{ transitionDuration: `${CROSSFADE_MS}ms` }}
          onError={(e) => {
            e.currentTarget.src = '/assets/images/fallback.jpg'
          }}
        />
      ))}
    </div>
  )
}

export default function MaywoodDifferenceSection({ differentiators }) {
  return (
    <section className="w-full bg-brand-ivory">
      <div className="grid grid-cols-1 lg:grid-cols-[55%_45%] lg:items-stretch">
        {/* Left — slideshow */}
        <div className="relative h-[250px] w-full min-h-0 overflow-hidden md:h-[480px] lg:h-full lg:min-h-[600px]">
          <div className="absolute inset-0">
            <DifferenceSlideshow />
          </div>
        </div>

        {/* Right — content */}
        <div className="flex flex-col justify-between bg-[#1a1612] p-8 sm:p-10 lg:p-[60px]">
          <div>
            <div className="flex items-center gap-3" role="presentation">
              <span
                className="h-px w-6 shrink-0 rounded-full bg-brand-brass-light"
                aria-hidden
              />
              <span className="font-body text-[11px] font-medium uppercase leading-none tracking-[0.22em] text-brand-brass-light">
                The Maywood Difference
              </span>
            </div>

            <h2 className="mt-6 font-display text-[clamp(28px,3.6vw,44px)] font-light leading-[1.08] text-brand-ivory">
              Built different. <span className="italic">Priced better.</span>{' '}
              <span className="italic">Delivered faster.</span>
            </h2>

            <div className="mt-10">
              {differentiators.map((card, i) => (
                <div
                  key={card.title}
                  className={[
                    'py-8 first:pt-0',
                    i > 0 ? 'border-t border-brand-brass/25' : '',
                  ].join(' ')}
                >
                  <p className="inline-flex rounded-full border border-brand-brass/40 bg-brand-brass/[0.08] px-3 py-1 font-body text-[10px] font-semibold uppercase tracking-[0.16em] text-brand-brass-light">
                    {card.pill}
                  </p>
                  <h3 className="mt-4 font-display text-[18px] font-normal leading-snug text-brand-ivory">
                    {card.title}
                  </h3>
                  <p className="mt-2 font-body text-[14px] font-normal leading-[1.75] text-brand-mist-light">
                    {card.body}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-12 lg:mt-14">
            <MotionLink
              to="#process"
              className={buttonClasses('primary', 'inline-flex')}
              whileTap={{ scale: 0.98 }}
              transition={tapTransition}
            >
              See How It Works
            </MotionLink>
          </div>
        </div>
      </div>
    </section>
  )
}
