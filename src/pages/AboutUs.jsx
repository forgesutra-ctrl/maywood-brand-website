import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Facebook, Instagram, Linkedin, Loader2, Mail, MapPin, Phone, Youtube } from 'lucide-react'
import SectionLabel from '../components/ui/SectionLabel'
import AnimatedText from '../components/ui/AnimatedText'
import { buttonClasses } from '../lib/buttonStyles'
import { supabase } from '../lib/supabase'
import { IMAGES } from '../config/images'
import { SOCIAL } from '../config/social'

const STATS = [
  { value: '9 Years', label: 'In Business' },
  { value: '500+', label: 'Projects Completed' },
  { value: '200+', label: 'Team Members' },
  { value: '3', label: 'Business Verticals' },
]

const LEADERSHIP = [
  {
    name: '[Founder Name]',
    role: 'Founder & Managing Director',
    bio: '20 years in construction and interiors. Built Maywood from a single studio to a 200-person operation.',
    linkedin: 'https://linkedin.com',
    imageSrc: IMAGES.corporate.reception,
    imageAlt: 'Maywood corporate workspace — Maywood Interiors Bangalore',
  },
  {
    name: '[Design Director Name]',
    role: 'Head of Design',
    bio: 'Former hospitality designer with projects across India, Singapore and Dubai. Leads the Maywood design studio.',
    linkedin: 'https://linkedin.com',
    imageSrc: IMAGES.livingRooms.wide,
    imageAlt: 'Residential interior design context — Maywood Interiors Bangalore',
  },
  {
    name: '[Operations Name]',
    role: 'Head of Manufacturing & Operations',
    bio: 'Mechanical engineer by training. Built and runs the Maywood manufacturing facility.',
    linkedin: 'https://linkedin.com',
    imageSrc: IMAGES.livingRooms.secondary,
    imageAlt: 'Residential interior — Maywood Interiors Bangalore',
  },
]

const RECOGNITION_CERTS = [
  {
    title: 'ISO 9001:2015',
    subtitle: 'Quality Management System',
    description:
      'Our design, manufacturing, and delivery processes are certified to international quality standards — audited annually by an independent third-party body.',
    issuedBy: 'Bureau Veritas / TÜV / IAF Accredited Body',
  },
  {
    title: 'ISO 45001:2018',
    subtitle: 'Occupational Health & Safety',
    description:
      'Every Maywood worksite and factory floor meets international health and safety standards. Our team goes home safe. Every day.',
    issuedBy: 'Bureau Veritas / TÜV / IAF Accredited Body',
  },
]

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

function GoldShieldIcon({ className = 'h-12 w-12 text-brand-brass' }) {
  return (
    <svg className={className} viewBox="0 0 48 56" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <path
        d="M24 4L6 12v16c0 11.5 7.2 22.2 18 26 10.8-3.8 18-14.5 18-26V12L24 4z"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinejoin="round"
      />
    </svg>
  )
}

const fieldClassDark =
  'w-full border-b border-white/25 bg-transparent py-2 font-body text-[15px] text-brand-ivory outline-none transition-colors placeholder:text-brand-mist-light/50 focus:border-brand-brass'

const initialContact = {
  fullName: '',
  phone: '',
  email: '',
  message: '',
}

const submitErrorClass = 'font-body text-[13px] font-normal text-red-400'

export default function AboutUs() {
  const [contact, setContact] = useState(initialContact)
  const [sent, setSent] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')

  const handleContactSubmit = async (e) => {
    e.preventDefault()
    setSubmitError('')
    try {
      setIsSubmitting(true)
      const { error } = await supabase.from('contact_messages').insert({
        full_name: contact.fullName.trim(),
        phone: contact.phone.trim(),
        email: contact.email.trim(),
        message: contact.message.trim(),
        source_page: 'about-us',
      })
      if (error) throw error
      setSent(true)
      setContact(initialContact)
    } catch {
      setSubmitError('Something went wrong. Please try again or call us directly.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="flex-1">
      <section className="relative flex min-h-[65vh] flex-col justify-center overflow-hidden bg-brand-charcoal px-6 py-32 lg:px-24">
        <div className="mx-auto grid w-full max-w-[1400px] grid-cols-1 items-center gap-12 lg:grid-cols-[3fr_2fr] lg:gap-16">
          <div className="relative z-[1]">
            <SectionLabel light>About Maywood</SectionLabel>
            <AnimatedText
              text="We build spaces. We've been doing it since 2015."
              tag="h1"
              getWordClassName={(_w, i) => (i >= 7 ? 'italic text-[#D4B483]' : '')}
              className="mt-8 max-w-[900px] font-display text-[58px] font-light leading-[1.06] text-brand-ivory max-lg:text-[clamp(36px,8vw,58px)]"
            />
            <p className="mt-8 max-w-[480px] font-body text-[15px] font-normal leading-[1.85] text-brand-mist-light">
              Maywood started as a single design studio in Bangalore. Today we are a vertically integrated interior company —
              with our own plywood, our own factory, our own finance arm, and a team of 200+ people. The obsession with
              quality hasn&apos;t changed.
            </p>
          </div>
          <div className="relative z-[1] min-h-[360px] overflow-hidden lg:min-h-[460px]">
            <img
              src={IMAGES.livingRooms.wide}
              alt="Living and dining interior — Maywood Interiors Bangalore"
              loading="eager"
              className="w-full h-full min-h-[360px] object-cover object-[center_30%] block lg:min-h-[460px]"
              onError={(e) => {
                e.currentTarget.src = '/assets/images/fallback.jpg'
              }}
            />
          </div>
        </div>
      </section>

      <section className="bg-brand-ivory px-6 py-32 lg:px-24">
        <div className="mx-auto max-w-[1400px]">
          <SectionLabel>Our Story</SectionLabel>
          <AnimatedText
            text="From one studio to one roof."
            tag="h2"
            getWordClassName={(_w, i) => (i >= 4 ? 'italic' : '')}
            className="mt-6 max-w-[900px] font-display text-[clamp(30px,4vw,48px)] font-light leading-[1.08] text-brand-charcoal"
          />

          <div className="mt-14 grid grid-cols-1 gap-10 lg:grid-cols-[3fr_2fr] lg:gap-16 lg:items-start">
            <div>
              <p className="font-display text-[20px] font-normal leading-[1.75] text-brand-charcoal">
                Maywood began in 2015 with a simple conviction: that Bangalore deserved an interior company that could be held
                accountable end to end. Not a firm that designed and then handed you to contractors. Not a brand that sold you
                materials and left you to figure out the rest.
              </p>
            </div>
            <div className="font-body text-[13px] font-normal leading-[1.9] text-brand-mist">
              <p>
                We started with home interiors. Then we built our manufacturing facility to take control of quality and
                timelines. Then we launched Maywood Plys — our own plywood range — to own the material supply chain. Then
                Maywood Finance, to remove the budget barrier entirely.
              </p>
              <p className="mt-6">
                Today, every project that leaves Maywood is touched only by Maywood people — from the first design sketch to
                the final coat of polish. That&apos;s the difference.
              </p>
            </div>
          </div>

          <div className="relative mt-14 aspect-[21/9] max-h-[420px] w-full min-h-[200px] overflow-hidden">
            <img
              src="/assets/images/generated/about-design-studio.png"
              alt="Corporate reception — Maywood Interiors Bangalore"
              loading="lazy"
              className="w-full h-full object-cover object-[center_28%] block"
              onError={(e) => {
                e.currentTarget.src = '/assets/images/fallback.jpg'
              }}
            />
          </div>
        </div>
      </section>

      <section className="bg-brand-brass px-6 py-24 lg:px-24">
        <div className="mx-auto max-w-[1400px]">
          <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
            {STATS.map(({ value, label }) => (
              <div key={label} className="text-center">
                <p className="font-display text-[64px] font-light leading-none text-brand-charcoal">{value}</p>
                <p className="mt-4 font-body text-[11px] font-medium uppercase tracking-[0.18em] text-brand-charcoal/65">
                  {label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="team" className="scroll-mt-28 bg-brand-ivory px-6 py-32 lg:px-24">
        <div className="mx-auto max-w-[1400px]">
          <SectionLabel>Leadership</SectionLabel>
          <AnimatedText
            text="The people behind Maywood."
            tag="h2"
            className="mt-6 max-w-[900px] font-display text-[clamp(30px,4vw,48px)] font-light leading-[1.08] text-brand-charcoal"
          />

          <div className="mt-14 grid grid-cols-1 gap-10 md:grid-cols-3 md:gap-8">
            {LEADERSHIP.map((person) => (
              <article key={person.name} className="border border-brand-brass-pale/50 bg-brand-ivory">
                <div className="h-[260px] overflow-hidden">
                  <img
                    src={person.imageSrc}
                    alt={person.imageAlt}
                    loading="lazy"
                    className="w-full h-full rounded-sm object-cover object-center block"
                    onError={(e) => {
                      e.currentTarget.src = '/assets/images/fallback.jpg'
                    }}
                  />
                </div>
                <div className="p-6">
                  <h3 className="font-display text-[22px] font-normal leading-snug text-brand-charcoal">{person.name}</h3>
                  <p className="mt-2 font-body text-[12px] font-medium uppercase tracking-[0.14em] text-brand-brass">
                    {person.role}
                  </p>
                  <p className="mt-4 font-body text-[13px] font-normal leading-[1.65] text-brand-mist">{person.bio}</p>
                  <a
                    href={person.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-flex text-brand-mist transition-colors hover:text-brand-brass"
                    aria-label={`${person.name} on LinkedIn`}
                  >
                    <Linkedin className="h-4 w-4" strokeWidth={1.5} />
                  </a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#f5f0eb]">
        <div className="mx-auto max-w-[1400px] px-6 py-24 lg:px-24">
          <SectionLabel>Recognition</SectionLabel>
          <h2 className="mt-6 max-w-[900px] font-display text-[clamp(30px,4vw,48px)] font-light leading-[1.08] text-brand-charcoal">
            Standards that hold. Work that speaks.
          </h2>
          <p className="mt-4 max-w-[640px] font-body text-[15px] font-normal leading-relaxed text-brand-mist">
            Independently verified quality — in our processes, our materials, and our people.
          </p>

          <div className="mt-14 grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-10">
            {RECOGNITION_CERTS.map((c) => (
              <article
                key={c.title}
                className="rounded-sm border border-[rgba(184,150,90,0.4)] bg-[#f5f0eb] p-10"
              >
                <GoldShieldIcon className="mb-8 shrink-0" />
                <h3 className="font-display text-[26px] font-normal leading-snug text-brand-charcoal">{c.title}</h3>
                <p className="mt-2 font-body text-[14px] font-medium text-brand-brass">{c.subtitle}</p>
                <p className="mt-5 font-body text-[13px] font-normal leading-[1.85] text-brand-mist">{c.description}</p>
                <p className="mt-6 border-t border-[rgba(184,150,90,0.25)] pt-5 font-body text-[12px] font-normal leading-relaxed text-brand-mist">
                  <span className="font-semibold text-brand-charcoal">Issued by:</span> {c.issuedBy}
                </p>
              </article>
            ))}
          </div>
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

      <section id="contact" className="scroll-mt-28 bg-brand-charcoal px-6 py-32 lg:px-24">
        <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-14 lg:grid-cols-2 lg:gap-20 lg:items-start">
          <div>
            <SectionLabel light>Get in Touch</SectionLabel>
            <AnimatedText
              text="Let's talk about your space."
              tag="h2"
              getWordClassName={(_w, i) => (i >= 3 ? 'italic text-[#D4B483]' : '')}
              className="mt-6 max-w-[520px] font-display text-[clamp(30px,4vw,44px)] font-light leading-[1.08] text-brand-ivory"
            />
            <p className="mt-6 max-w-md font-body text-[14px] font-normal leading-relaxed text-brand-mist-light">
              Whether you have a project brief or just an idea — our team is ready to listen.
            </p>

            <ul className="mt-10 space-y-5">
              <li className="flex items-start gap-3">
                <Phone className="mt-0.5 h-4 w-4 shrink-0 text-brand-brass" strokeWidth={1.5} aria-hidden />
                <a href="tel:+919606977677" className="font-body text-[15px] font-normal text-brand-ivory hover:text-brand-brass-light">
                  +91 96069 77677
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-brand-brass" strokeWidth={1.5} aria-hidden />
                <a
                  href="mailto:hello@maywoodinteriors.com"
                  className="font-body text-[15px] font-normal text-brand-ivory hover:text-brand-brass-light"
                >
                  hello@maywoodinteriors.com
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand-brass" strokeWidth={1.5} aria-hidden />
                <span className="font-body text-[14px] font-normal leading-relaxed text-brand-mist-light">
                  Koramangala &amp; Whitefield, Bengaluru
                </span>
              </li>
            </ul>

            <p className="mt-10 font-body text-[11px] font-semibold uppercase tracking-[0.14em] text-brand-brass">
              Follow Us
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-5">
              <a
                href={SOCIAL.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#B8965A] transition-opacity duration-200 hover:opacity-70 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-brass focus-visible:ring-offset-2 focus-visible:ring-offset-brand-charcoal"
                aria-label="Maywood Interiors on Instagram"
              >
                <Instagram size={22} strokeWidth={1.5} />
              </a>
              <a
                href={SOCIAL.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#B8965A] transition-opacity duration-200 hover:opacity-70 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-brass focus-visible:ring-offset-2 focus-visible:ring-offset-brand-charcoal"
                aria-label="Maywood Interiors on Facebook"
              >
                <Facebook size={22} strokeWidth={1.5} />
              </a>
              <a
                href={SOCIAL.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#B8965A] transition-opacity duration-200 hover:opacity-70 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-brass focus-visible:ring-offset-2 focus-visible:ring-offset-brand-charcoal"
                aria-label="Maywood Interiors on LinkedIn"
              >
                <Linkedin size={22} strokeWidth={1.5} />
              </a>
              <a
                href={SOCIAL.youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#B8965A] transition-opacity duration-200 hover:opacity-70 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-brass focus-visible:ring-offset-2 focus-visible:ring-offset-brand-charcoal"
                aria-label="Maywood Interiors on YouTube"
              >
                <Youtube size={22} strokeWidth={1.5} />
              </a>
            </div>
          </div>

          <div className="[color-scheme:dark] lg:pt-2">
            {sent ? (
              <div className="rounded-[2px] border-[0.5px] border-brand-brass bg-brand-charcoal-mid/50 px-8 py-10">
                <p className="font-body text-[15px] font-normal leading-relaxed text-brand-mist-light">
                  Thank you — we&apos;ll get back to you shortly.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSent(false)
                    setSubmitError('')
                  }}
                  className="mt-8 font-body text-[12px] font-medium uppercase tracking-[0.12em] text-brand-brass-light underline-offset-4 hover:underline"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleContactSubmit} className="space-y-8">
                <label className="block">
                  <span className="mb-2 block font-body text-[11px] font-semibold uppercase tracking-[0.14em] text-brand-brass">
                    Full name
                  </span>
                  <input
                    type="text"
                    value={contact.fullName}
                    onChange={(e) => setContact((p) => ({ ...p, fullName: e.target.value }))}
                    className={fieldClassDark}
                    required
                    autoComplete="name"
                  />
                </label>
                <label className="block">
                  <span className="mb-2 block font-body text-[11px] font-semibold uppercase tracking-[0.14em] text-brand-brass">
                    Phone
                  </span>
                  <input
                    type="tel"
                    value={contact.phone}
                    onChange={(e) => setContact((p) => ({ ...p, phone: e.target.value }))}
                    className={fieldClassDark}
                    required
                    autoComplete="tel"
                  />
                </label>
                <label className="block">
                  <span className="mb-2 block font-body text-[11px] font-semibold uppercase tracking-[0.14em] text-brand-brass">
                    Email
                  </span>
                  <input
                    type="email"
                    value={contact.email}
                    onChange={(e) => setContact((p) => ({ ...p, email: e.target.value }))}
                    className={fieldClassDark}
                    required
                    autoComplete="email"
                  />
                </label>
                <label className="block">
                  <span className="mb-2 block font-body text-[11px] font-semibold uppercase tracking-[0.14em] text-brand-brass">
                    What would you like to discuss?
                  </span>
                  <textarea
                    value={contact.message}
                    onChange={(e) => setContact((p) => ({ ...p, message: e.target.value }))}
                    rows={4}
                    className={`${fieldClassDark} resize-none`}
                    required
                  />
                </label>
                <div>
                  <div className="flex flex-col gap-4">
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
                        'Send Message'
                      )}
                    </button>
                    <Link
                      to="/experience-centers"
                      className={buttonClasses(
                        'ctaSecondary',
                        'flex w-full justify-center focus-visible:ring-offset-brand-charcoal',
                      )}
                    >
                      Book free consultation
                    </Link>
                  </div>
                  {submitError ? <p className={`mt-4 ${submitErrorClass}`}>{submitError}</p> : null}
                </div>
              </form>
            )}
          </div>
        </div>
      </section>
    </main>
  )
}
