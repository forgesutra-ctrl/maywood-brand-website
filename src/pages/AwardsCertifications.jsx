import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { Check } from 'lucide-react'

const ISO_CERTIFICATE_DISPLAY = [
  {
    imgSrc: '/assets/certificates/iso-9001.png',
    alt: 'ISO 9001:2015 Certificate — Maywood Interiors',
  },
  {
    imgSrc: '/assets/certificates/iso-45001.png',
    alt: 'ISO 45001:2018 Certificate — Maywood Interiors',
  },
]

const TOP_100_AWARD = {
  imgSrc: '/assets/awards/top-100-interiors-india.jpg',
  alt: 'Top 100 Interior Designers & Architects of India — Top Interiors India, 2025 — Maywood Interiors Private Limited',
}

const TIMELINE_MILESTONES = [
  {
    year: '2015',
    title: 'Founded',
    description: 'Started as a single design studio in Bangalore with one conviction — quality without compromise.',
  },
  {
    year: '2018',
    title: 'Factory Launch',
    description: 'Opened our in-house manufacturing facility — the first step toward full vertical integration.',
  },
  {
    year: '2020',
    title: 'Maywood Plys',
    description: 'Launched our own plywood range, cutting out supplier markups and taking control of material quality.',
  },
  {
    year: '2022',
    title: '500+ Projects',
    description: 'Crossed 500 completed projects across residential, commercial, and hospitality segments.',
  },
  {
    year: '2023',
    title: 'Maywood Finance',
    description: 'Launched our in-house financing arm — making premium interiors accessible to every budget.',
  },
  {
    year: '2024',
    title: 'ISO Certified',
    description: 'Received dual ISO certification — 9001 and 45001 — validating our systems and processes.',
  },
]

export default function AwardsCertifications() {
  const [certLightbox, setCertLightbox] = useState(null)
  const [certLightboxVisible, setCertLightboxVisible] = useState(false)

  useEffect(() => {
    if (!certLightbox) {
      setCertLightboxVisible(false)
      return
    }
    setCertLightboxVisible(false)
    const id = window.setTimeout(() => setCertLightboxVisible(true), 16)
    return () => window.clearTimeout(id)
  }, [certLightbox])

  useEffect(() => {
    if (!certLightbox) return
    const onKey = (e) => {
      if (e.key === 'Escape') setCertLightbox(null)
    }
    window.addEventListener('keydown', onKey)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
    }
  }, [certLightbox])

  return (
    <main className="flex-1 bg-[#f5f0eb]">
      <section id="awards" className="scroll-mt-28 bg-[#f5f0eb]">
        <div className="mx-auto max-w-[1400px] px-6 py-24 lg:px-24">
          <h1 className="text-center font-display text-[clamp(28px,3.5vw,40px)] font-light leading-[1.1] text-brand-charcoal">
            Industry Recognition
          </h1>
          <div className="mx-auto mt-10 flex w-full max-w-xs flex-col items-center">
            <button
              type="button"
              onClick={() => setCertLightbox({ src: TOP_100_AWARD.imgSrc, alt: TOP_100_AWARD.alt })}
              className="w-full border-0 bg-transparent p-0 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c9a465] focus-visible:ring-offset-2 focus-visible:ring-offset-[#f5f0eb]"
            >
              <img
                src={TOP_100_AWARD.imgSrc}
                alt={TOP_100_AWARD.alt}
                loading="lazy"
                className="mx-auto block w-full max-w-xs cursor-zoom-in rounded-xl object-contain shadow-lg transition-all duration-300 hover:scale-105"
              />
            </button>
            <p className="mt-6 text-center font-body text-[15px] font-medium leading-snug text-brand-charcoal">
              Top 100 Interior Design Companies in India
            </p>
            <p className="mt-2 text-center font-body text-[13px] font-normal text-brand-mist">
              Recognized for quality, execution, and innovation
            </p>
          </div>

          <h2 className="mt-20 text-center font-display text-[clamp(28px,3.5vw,40px)] font-light leading-[1.1] text-brand-charcoal">
            Certified for Quality and Safety
          </h2>
          <div className="mx-auto mt-10 grid max-w-4xl grid-cols-1 gap-8 sm:grid-cols-2 sm:gap-6 lg:gap-8">
            <div className="flex flex-col rounded-[12px] border border-[rgba(184,150,90,0.25)] bg-white/50 p-4 shadow-sm sm:p-5">
              <button
                type="button"
                onClick={() => setCertLightbox({ src: ISO_CERTIFICATE_DISPLAY[0].imgSrc, alt: ISO_CERTIFICATE_DISPLAY[0].alt })}
                className="w-full border-0 bg-transparent p-0 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c9a465] focus-visible:ring-offset-2 focus-visible:ring-offset-[#f5f0eb]"
              >
                <img
                  src={ISO_CERTIFICATE_DISPLAY[0].imgSrc}
                  alt={ISO_CERTIFICATE_DISPLAY[0].alt}
                  loading="lazy"
                  className="w-full max-h-[min(52vh,360px)] cursor-zoom-in rounded-xl object-contain object-top shadow-lg transition-all duration-300 hover:scale-[1.02] hover:brightness-105"
                />
              </button>
              <h3 className="mt-4 font-body text-[15px] font-semibold leading-snug text-brand-charcoal">
                ISO 9001 — Quality Management Systems
              </h3>
              <p className="mt-2 font-body text-[14px] font-normal leading-relaxed text-brand-mist">
                Ensures consistent processes and reliable delivery
              </p>
              <button
                type="button"
                onClick={() => setCertLightbox({ src: ISO_CERTIFICATE_DISPLAY[0].imgSrc, alt: ISO_CERTIFICATE_DISPLAY[0].alt })}
                className="mt-3 self-start border-0 bg-transparent p-0 font-body text-[12px] font-medium text-[#c9a465] underline-offset-2 transition hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c9a465] focus-visible:ring-offset-2"
              >
                View Certificate →
              </button>
            </div>
            <div className="flex flex-col rounded-[12px] border border-[rgba(184,150,90,0.25)] bg-white/50 p-4 shadow-sm sm:p-5">
              <button
                type="button"
                onClick={() => setCertLightbox({ src: ISO_CERTIFICATE_DISPLAY[1].imgSrc, alt: ISO_CERTIFICATE_DISPLAY[1].alt })}
                className="w-full border-0 bg-transparent p-0 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c9a465] focus-visible:ring-offset-2 focus-visible:ring-offset-[#f5f0eb]"
              >
                <img
                  src={ISO_CERTIFICATE_DISPLAY[1].imgSrc}
                  alt={ISO_CERTIFICATE_DISPLAY[1].alt}
                  loading="lazy"
                  className="w-full max-h-[min(52vh,360px)] cursor-zoom-in rounded-xl object-contain object-top shadow-lg transition-all duration-300 hover:scale-[1.02] hover:brightness-105"
                />
              </button>
              <h3 className="mt-4 font-body text-[15px] font-semibold leading-snug text-brand-charcoal">
                ISO 45001 — Occupational Health &amp; Safety
              </h3>
              <p className="mt-2 font-body text-[14px] font-normal leading-relaxed text-brand-mist">
                Ensures safe and structured environments
              </p>
              <button
                type="button"
                onClick={() => setCertLightbox({ src: ISO_CERTIFICATE_DISPLAY[1].imgSrc, alt: ISO_CERTIFICATE_DISPLAY[1].alt })}
                className="mt-3 self-start border-0 bg-transparent p-0 font-body text-[12px] font-medium text-[#c9a465] underline-offset-2 transition hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c9a465] focus-visible:ring-offset-2"
              >
                View Certificate →
              </button>
            </div>
          </div>

          <h3 className="mt-16 text-center font-display text-[clamp(22px,2.5vw,28px)] font-light text-brand-charcoal">
            What This Means for You
          </h3>
          <ul className="mx-auto mt-8 grid max-w-lg grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-x-8 sm:gap-y-3">
            {[
              'Structured execution',
              'Consistent quality',
              'Safer processes',
              'Reliable timelines',
            ].map((label) => (
              <li key={label} className="flex items-start gap-2.5">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#c9a465]" strokeWidth={2.5} aria-hidden />
                <span className="font-body text-[14px] font-normal leading-snug text-brand-charcoal">{label}</span>
              </li>
            ))}
          </ul>
          <p className="mt-14 text-center font-display text-[18px] font-light italic text-[#c9a465] sm:text-[19px]">
            Built on systems. Proven through delivery.
          </p>
        </div>

        <div className="bg-[#1a1612] px-6 pb-24 pt-16 lg:px-24 lg:pb-28 lg:pt-20">
          <div className="mx-auto max-w-[1400px] overflow-x-auto [-webkit-overflow-scrolling:touch] md:overflow-visible">
            <div className="relative min-w-[1320px] md:min-w-0">
              <div
                className="pointer-events-none absolute left-12 right-12 top-[9px] h-px bg-[rgba(184,150,90,0.45)] md:left-8 md:right-8"
                aria-hidden
              />
              <div className="relative z-[1] flex w-max gap-6 md:w-full md:gap-4 lg:gap-6">
                {TIMELINE_MILESTONES.map((m) => (
                  <div
                    key={m.year + m.title}
                    className="w-[200px] flex-shrink-0 px-2 pb-2 pt-1 text-center md:w-auto md:flex-1 md:px-3 md:pb-0 md:pt-0"
                  >
                    <div className="mx-auto mb-5 flex h-[18px] items-start justify-center md:mb-6">
                      <span
                        className="mt-0 h-3 w-3 shrink-0 rounded-full border-2 border-brand-brass bg-[#1a1612]"
                        aria-hidden
                      />
                    </div>
                    <p className="font-display text-[18px] font-normal text-brand-brass">{m.year}</p>
                    <p className="mt-3 font-display text-[17px] font-normal leading-snug text-brand-ivory">{m.title}</p>
                    <p className="mt-3 font-body text-[12px] font-normal leading-[1.75] text-brand-mist-light">{m.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {certLightbox
        ? createPortal(
            <div
              role="dialog"
              aria-modal="true"
              aria-label={certLightbox.alt}
              className={`fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 transition-opacity duration-300 ease-out ${
                certLightboxVisible ? 'opacity-100' : 'opacity-0'
              }`}
              onClick={() => setCertLightbox(null)}
            >
              <button
                type="button"
                aria-label="Close certificate preview"
                className="absolute right-4 top-4 z-[1] cursor-pointer border-0 bg-transparent p-2 text-3xl leading-none text-white"
                onClick={(e) => {
                  e.stopPropagation()
                  setCertLightbox(null)
                }}
              >
                ×
              </button>
              <img
                src={certLightbox.src}
                alt={certLightbox.alt}
                className="max-h-[90vh] max-w-[90vw] object-contain"
                onClick={(e) => e.stopPropagation()}
              />
            </div>,
            document.body,
          )
        : null}
    </main>
  )
}
