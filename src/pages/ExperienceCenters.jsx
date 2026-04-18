import { useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import ExperienceCenterPhotoGallery from '../components/ExperienceCenterPhotoGallery'
import SectionLabel from '../components/ui/SectionLabel'
import AnimatedText from '../components/ui/AnimatedText'
import { buttonClasses } from '../lib/buttonStyles'
import { supabase } from '../lib/supabase'
import { IMAGES } from '../config/images'

const MotionLink = motion(Link)
const tapTransition = { type: 'tween', duration: 0.15, ease: [0.16, 1, 0.3, 1] }
const motionEase = [0.16, 1, 0.3, 1]

const heroStripItems = [
  {
    title: 'Live Material Library',
    sub: '500+ finishes you can touch',
  },
  {
    title: 'Full Room Mockups',
    sub: 'See complete rooms, not just samples',
  },
  {
    title: 'On-site Designers',
    sub: 'Get expert advice during your visit',
  },
]

const RR_NAGAR = {
  name: 'RR Nagar Experience Center',
  addressLines: [
    '34, 4th Cross Rd, RR Nagar via,',
    'Uttarahalli Main Rd, Vaddara Palya,',
    'Kodipur, Bengaluru, Karnataka 560061',
  ],
  hours: 'Monday – Saturday, 10am – 7pm | Sunday 11am – 5pm',
  features: [
    'Full wardrobe and kitchen live displays',
    '300+ material and finish samples',
    'Dedicated design consultation bays',
    'ISO certified showroom',
  ],
  directionsUrl:
    'https://maps.google.com/?q=34,4th+Cross+Rd,Uttarahalli+Main+Rd,Vaddara+Palya,Kodipur,Bengaluru,Karnataka+560061',
  mapEmbedSrc:
    'https://maps.google.com/maps?q=34+4th+Cross+Rd+Uttarahalli+Main+Rd+Vaddara+Palya+Kodipur+Bengaluru+Karnataka+560061&output=embed',
}

const visitSteps = [
  {
    n: 1,
    title: 'Arrive & Explore',
    desc: 'Browse the full material library and live room displays at your own pace.',
  },
  {
    n: 2,
    title: 'Meet a Designer',
    desc: 'A dedicated Maywood designer walks you through options relevant to your project.',
  },
  {
    n: 3,
    title: 'Visualise Your Space',
    desc: 'See a rough 3D concept of your home using our on-site visualization tools.',
  },
  {
    n: 4,
    title: 'Get a Quote',
    desc: 'Walk out with a ballpark estimate and a clear next step.',
  },
]

const timeSlots = ['10am–12pm', '12pm–2pm', '2pm–4pm', '4pm–6pm']

const fieldClass =
  'w-full border-b border-white/25 bg-transparent py-2 font-body text-[15px] text-brand-ivory outline-none transition-colors placeholder:text-brand-mist-light/50 focus:border-brand-brass'

const initialVisitForm = {
  fullName: '',
  phone: '',
  location: '',
  date: '',
  timeSlot: '',
  note: '',
}

function VisitProcessFlow({ forDarkBackdrop = false }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-10% 0px', amount: 0.15 })

  const lineClass = forDarkBackdrop
    ? 'bg-white/30'
    : 'bg-[rgba(184,150,90,0.35)]'
  const circleClass = forDarkBackdrop
    ? 'relative z-[1] flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-full border border-white/60 bg-white/5 text-white'
    : 'relative z-[1] flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-full border-[0.5px] border-brand-brass bg-brand-ivory-deep'
  const circleShadow = forDarkBackdrop ? { boxShadow: '0 0 0 4px rgba(0,0,0,0.25)' } : { boxShadow: '0 0 0 4px #EDE8DF' }
  const numClass = forDarkBackdrop ? 'font-display text-[20px] font-normal text-white' : 'font-display text-[20px] font-normal text-brand-brass'
  const titleClass = forDarkBackdrop
    ? 'mt-8 font-display text-[20px] font-normal leading-snug text-white'
    : 'mt-8 font-display text-[20px] font-normal leading-snug text-brand-charcoal'
  const descClass = forDarkBackdrop
    ? 'mt-3 max-w-[200px] font-body text-[12px] font-normal leading-relaxed text-white/70'
    : 'mt-3 max-w-[200px] font-body text-[12px] font-normal leading-relaxed text-brand-mist'

  return (
    <div ref={ref} className={['relative mt-16 lg:mt-20', forDarkBackdrop ? 'z-10' : ''].filter(Boolean).join(' ')}>
      <div
        className={['pointer-events-none absolute left-[10%] right-[10%] top-[26px] hidden h-px lg:block', lineClass].join(
          ' ',
        )}
        aria-hidden
      />

      <div className="grid grid-cols-1 gap-14 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
        {visitSteps.map(({ n, title, desc }, i) => (
          <motion.div
            key={title}
            className="relative z-10 flex flex-col items-center text-center"
            initial={{ y: 28, opacity: 0 }}
            animate={inView ? { y: 0, opacity: 1 } : { y: 28, opacity: 0 }}
            transition={{
              duration: 0.55,
              delay: 0.1 + i * 0.12,
              ease: motionEase,
            }}
          >
            <div className={circleClass} style={circleShadow}>
              <span className={numClass}>{n}</span>
            </div>
            <h3 className={titleClass}>{title}</h3>
            <p className={descClass}>{desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

const submitErrorClass = 'font-body text-[13px] font-normal text-red-400'

export default function ExperienceCenters() {
  const [form, setForm] = useState(initialVisitForm)
  const [booked, setBooked] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')

  const handleBookSubmit = async (e) => {
    e.preventDefault()
    setSubmitError('')
    try {
      setIsSubmitting(true)
      // Enable RLS + anon insert policy on this table in Supabase
      const { error } = await supabase.from('showroom_visits').insert({
        full_name: form.fullName.trim(),
        phone: form.phone.trim(),
        preferred_location: form.location.trim(),
        preferred_date: form.date,
        preferred_time_slot: form.timeSlot,
        project_note: form.note.trim() || null,
      })
      if (error) throw error
      setBooked(true)
      setForm(initialVisitForm)
    } catch {
      setSubmitError('Something went wrong. Please try again or call us directly.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="flex-1">
      <section className="relative flex min-h-[65vh] flex-col justify-center overflow-hidden px-6 py-32 lg:px-24">
        <img
          src={IMAGES.livingRooms.wide}
          alt="Living and dining interior — Maywood Interiors Bangalore"
          loading="eager"
          className="absolute inset-0 w-full h-full object-cover object-center block"
          onError={(e) => {
            e.currentTarget.src = '/assets/images/fallback.jpg'
          }}
        />
        <div className="absolute inset-0 bg-[#1C1915]/75" aria-hidden />
        <div className="relative z-[2] mx-auto w-full max-w-[1400px]">
          <SectionLabel light>Experience Centers</SectionLabel>

          <AnimatedText
            text="See it. Touch it. Believe it."
            tag="h1"
            getWordClassName={(_w, i) => (i >= 4 ? 'italic text-[#D4B483]' : '')}
            className="mt-8 max-w-[1100px] font-display text-[64px] font-light leading-[1.06] text-brand-ivory max-lg:text-[clamp(40px,9vw,64px)]"
          />

          <p className="mt-8 max-w-[500px] font-body text-[15px] font-normal leading-[1.85] text-brand-mist-light">
            Our experience centers in Bangalore are designed to bring every material, finish and furniture style to life —
            before a single rupee is committed.
          </p>

          <a href="#book-visit" className={['mt-12 inline-flex', buttonClasses('primary')].join(' ')}>
            Book a Showroom Visit
          </a>

          <div className="mt-16 border-y-[0.5px] border-[rgba(184,150,90,0.2)] py-5">
            <div className="grid grid-cols-1 divide-y divide-[rgba(184,150,90,0.35)] md:grid-cols-3 md:divide-x md:divide-y-0">
              {heroStripItems.map((item) => (
                <div key={item.title} className="px-4 py-6 text-center first:pt-2 last:pb-2 md:px-6 md:py-0 md:first:pl-0 md:last:pr-0">
                  <p className="font-display text-[18px] font-normal text-brand-ivory">{item.title}</p>
                  <p className="mt-2 font-body text-[13px] font-normal leading-relaxed text-brand-mist-light">{item.sub}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-brand-ivory px-6 py-32 lg:px-24">
        <div className="mx-auto max-w-[1400px]">
          <SectionLabel>Our Locations</SectionLabel>
          <AnimatedText
            text="Visit us. See it in person."
            tag="h2"
            className="mt-6 max-w-[900px] font-display text-[clamp(30px,4vw,48px)] font-light leading-[1.08] text-brand-charcoal"
          />

          <article className="mx-auto mt-14 max-w-[min(100%,900px)] overflow-hidden rounded-sm bg-brand-ivory shadow-[0_20px_50px_-24px_rgba(28,25,21,0.12)] ring-1 ring-brand-brass-pale/60">
            <div className="h-[min(52vw,320px)] overflow-hidden sm:h-[340px]">
              <img
                src="/assets/images/experience-center/ec-hero.jpg"
                alt=""
                loading="lazy"
                className="block h-full w-full object-cover object-center"
              />
            </div>
            <div className="p-8 sm:p-10">
              <span className="inline-block rounded-[2px] border-[0.5px] border-brand-brass bg-[rgba(184,150,90,0.1)] px-3.5 py-1 font-body text-[10px] font-medium uppercase tracking-[0.18em] text-brand-brass">
                Now Open
              </span>
              <h3 className="mt-5 font-display text-[clamp(26px,3.5vw,32px)] font-normal leading-tight text-brand-charcoal">
                {RR_NAGAR.name}
              </h3>
              <address className="mt-4 not-italic">
                {RR_NAGAR.addressLines.map((line) => (
                  <p key={line} className="font-body text-[14px] font-normal leading-[1.7] text-brand-mist">
                    {line}
                  </p>
                ))}
              </address>
              <p className="mt-4 font-body text-[13px] font-normal leading-relaxed text-brand-mist">{RR_NAGAR.hours}</p>
              <div className="my-6 h-px bg-brand-brass-pale" aria-hidden />
              <ul className="space-y-3">
                {RR_NAGAR.features.map((b) => (
                  <li key={b} className="flex gap-3 font-body text-[13px] font-normal leading-relaxed text-brand-mist">
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-brand-brass" aria-hidden />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <a href="#book-visit" className={buttonClasses('primary')}>
                  Book a visit
                </a>
                <a
                  href={RR_NAGAR.directionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-body text-[12px] font-medium uppercase tracking-[0.14em] text-brand-brass transition-opacity hover:opacity-80"
                >
                  Get Directions →
                </a>
              </div>
            </div>
          </article>

          <div className="mx-auto mt-20 max-w-[min(100%,1100px)]">
            <ExperienceCenterPhotoGallery />
          </div>

          <div className="mx-auto mt-16 max-w-[1400px]">
            <iframe
              title="RR Nagar Experience Center on Google Maps"
              src={RR_NAGAR.mapEmbedSrc}
              className="h-[300px] w-full rounded-sm border-0 md:h-[450px]"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>

          <div className="mx-auto mt-24 max-w-[1400px] rounded-sm bg-brand-charcoal px-6 py-16 sm:px-10 sm:py-20 lg:px-16">
            <SectionLabel light>Expanding across Bangalore</SectionLabel>
            <h2 className="mt-6 font-display text-[clamp(26px,3.5vw,40px)] font-light leading-[1.1] text-brand-ivory">
              4 more centers coming soon.
            </h2>
            <p className="mt-4 max-w-xl font-body text-[14px] font-normal leading-relaxed text-white/70">
              We&apos;re bringing Maywood closer to you — across every corner of Bangalore.
            </p>
            <div className="mt-12 grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="flex flex-col items-center justify-center rounded-sm border border-dashed border-brand-brass/50 bg-brand-charcoal-mid/40 px-4 py-10 text-center sm:py-12"
                >
                  <span className="rounded-full border border-brand-brass/60 bg-brand-brass/10 px-5 py-2 font-body text-[11px] font-semibold uppercase tracking-[0.18em] text-brand-brass-light">
                    Coming soon
                  </span>
                  <p className="mt-4 font-body text-[12px] font-normal leading-snug text-white/60">
                    New location — opening 2025-26
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="relative w-full overflow-hidden bg-brand-charcoal px-6 py-28 lg:px-24">
        <img
          src="/assets/images/experience-center/gallery-02.png"
          alt=""
          loading="lazy"
          className="absolute inset-0 z-0 block h-full w-full object-cover object-center"
          onError={(e) => {
            e.currentTarget.src = '/assets/images/fallback.jpg'
          }}
        />
        <div
          className="absolute inset-0 z-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70"
          aria-hidden
        />
        <div className="relative z-10 mx-auto max-w-[1400px]">
          <SectionLabel className="relative z-10">During Your Visit</SectionLabel>
          <AnimatedText
            text="A visit designed around your decision."
            tag="h2"
            getWordClassName={(_w, i) => (i >= 4 ? 'italic text-[#D4B483]' : '')}
            className="relative z-10 mt-6 max-w-[920px] font-display text-[clamp(30px,4vw,48px)] font-light leading-[1.08] text-white"
          />
          <p className="relative z-10 mt-6 max-w-[500px] font-body text-[14px] font-normal leading-relaxed text-white/80">
            No pressure. No salespeople chasing you around. Just a structured, guided experience to help you make the right
            choices.
          </p>
          <VisitProcessFlow forDarkBackdrop />
        </div>
      </section>

      <section id="book-visit" className="scroll-mt-28 bg-brand-charcoal px-6 py-28 lg:px-24">
        <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-16 lg:grid-cols-2 lg:gap-20 lg:items-start">
          <div>
            <SectionLabel light>Book Your Visit</SectionLabel>
            <AnimatedText
              text="Reserve your spot today."
              tag="h2"
              getWordClassName={(_w, i) => (i >= 2 ? 'italic text-[#D4B483]' : '')}
              className="mt-6 max-w-[520px] font-display text-[clamp(30px,4vw,44px)] font-light leading-[1.08] text-brand-ivory"
            />
            <p className="mt-6 max-w-md font-body text-[14px] font-normal leading-relaxed text-brand-mist-light">
              Visits are by appointment to ensure you get dedicated time with a designer. Takes 2 minutes to book.
            </p>
            <ul className="mt-10 space-y-4">
              {[
                'No walk-ins turned away, but appointments get priority',
                'Visits typically last 60–90 minutes',
                "Bring your floor plan if you have one — we'll use it",
              ].map((line) => (
                <li key={line} className="flex gap-3 font-body text-[14px] font-normal leading-relaxed text-brand-mist-light">
                  <span className="shrink-0 font-display text-brand-brass" aria-hidden>
                    —
                  </span>
                  <span>{line}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="[color-scheme:dark] lg:pt-2">
            {booked ? (
              <div className="rounded-[2px] border-[0.5px] border-brand-brass bg-brand-charcoal-mid/50 px-8 py-10">
                <p className="font-body text-[15px] font-normal leading-relaxed text-brand-mist-light">
                  Your visit has been booked. We&apos;ll confirm via WhatsApp within 2 hours.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setBooked(false)
                    setSubmitError('')
                  }}
                  className="mt-8 font-body text-[12px] font-medium uppercase tracking-[0.12em] text-brand-brass-light underline-offset-4 hover:underline"
                >
                  Book another visit
                </button>
              </div>
            ) : (
              <form onSubmit={handleBookSubmit} className="space-y-8">
                <label className="block">
                  <span className="mb-2 block font-body text-[11px] font-semibold uppercase tracking-[0.14em] text-brand-brass">
                    Full name
                  </span>
                  <input
                    type="text"
                    value={form.fullName}
                    onChange={(e) => setForm((p) => ({ ...p, fullName: e.target.value }))}
                    className={fieldClass}
                    required
                    autoComplete="name"
                  />
                </label>
                <label className="block">
                  <span className="mb-2 block font-body text-[11px] font-semibold uppercase tracking-[0.14em] text-brand-brass">
                    Phone number
                  </span>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
                    className={fieldClass}
                    required
                    autoComplete="tel"
                  />
                </label>
                <label className="block">
                  <span className="mb-2 block font-body text-[11px] font-semibold uppercase tracking-[0.14em] text-brand-brass">
                    Preferred location
                  </span>
                  <select
                    value={form.location}
                    onChange={(e) => setForm((p) => ({ ...p, location: e.target.value }))}
                    className={fieldClass}
                    required
                  >
                    <option value="">Select center</option>
                    <option value="RR Nagar Experience Center">RR Nagar Experience Center</option>
                  </select>
                </label>
                <label className="block">
                  <span className="mb-2 block font-body text-[11px] font-semibold uppercase tracking-[0.14em] text-brand-brass">
                    Preferred date
                  </span>
                  <input
                    type="date"
                    value={form.date}
                    onChange={(e) => setForm((p) => ({ ...p, date: e.target.value }))}
                    className={fieldClass}
                    required
                  />
                </label>
                <label className="block">
                  <span className="mb-2 block font-body text-[11px] font-semibold uppercase tracking-[0.14em] text-brand-brass">
                    Preferred time slot
                  </span>
                  <select
                    value={form.timeSlot}
                    onChange={(e) => setForm((p) => ({ ...p, timeSlot: e.target.value }))}
                    className={fieldClass}
                    required
                  >
                    <option value="">Select slot</option>
                    {timeSlots.map((slot) => (
                      <option key={slot} value={slot}>
                        {slot}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="block">
                  <span className="mb-2 block font-body text-[11px] font-semibold uppercase tracking-[0.14em] text-brand-brass">
                    Brief note about your project
                  </span>
                  <textarea
                    value={form.note}
                    onChange={(e) => setForm((p) => ({ ...p, note: e.target.value }))}
                    rows={3}
                    className={`${fieldClass} resize-none`}
                  />
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
                        Booking…
                      </>
                    ) : (
                      'Book My Visit'
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
            Can&apos;t visit in person?
            <br />
            We&apos;ll come to you.
          </p>
          <p className="mx-auto mt-6 max-w-lg font-body text-[14px] font-normal leading-relaxed text-brand-charcoal/65">
            Book a home visit and our designer will bring samples, lookbooks and a quote — right to your door.
          </p>
          <MotionLink
            to="/#consultation"
            className={['mt-10 inline-flex', buttonClasses('dark')].join(' ')}
            whileTap={{ scale: 0.98 }}
            transition={tapTransition}
          >
            Request a Home Visit
          </MotionLink>
        </div>
      </section>
    </main>
  )
}
