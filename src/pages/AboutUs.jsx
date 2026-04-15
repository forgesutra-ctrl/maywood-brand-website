import { useState } from 'react'
import { Loader2, Mail, MapPin, Phone } from 'lucide-react'
import SectionLabel from '../components/ui/SectionLabel'
import AnimatedText from '../components/ui/AnimatedText'
import ImagePlaceholder from '../components/ui/ImagePlaceholder'
import { IconInstagram, IconLinkedin, IconYoutube } from '../components/ui/BrandSocialIcons'
import { buttonClasses } from '../lib/buttonStyles'
import { supabase } from '../lib/supabase'

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
    imageLabel: 'Founder portrait',
    linkedin: 'https://linkedin.com',
  },
  {
    name: '[Design Director Name]',
    role: 'Head of Design',
    bio: 'Former hospitality designer with projects across India, Singapore and Dubai. Leads the Maywood design studio.',
    imageLabel: 'Design director portrait',
    linkedin: 'https://linkedin.com',
  },
  {
    name: '[Operations Name]',
    role: 'Head of Manufacturing & Operations',
    bio: 'Mechanical engineer by training. Built and runs the Maywood manufacturing facility.',
    imageLabel: 'Operations lead portrait',
    linkedin: 'https://linkedin.com',
  },
]

const CERTS = [
  {
    title: 'Quality Management',
    standard: 'ISO 9001:2015',
    desc: 'Our processes, materials and outputs are certified to international quality management standards — audited annually by a third-party body.',
  },
  {
    title: 'Occupational Health & Safety',
    standard: 'ISO 45001:2018',
    desc: 'Every Maywood worksite and factory floor meets international health and safety standards. Our team goes home safe. Every day.',
  },
]

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
      // Enable RLS + anon insert policy on this table in Supabase
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
      <section className="flex min-h-[65vh] flex-col justify-center bg-brand-charcoal px-6 py-32 lg:px-24">
        <div className="mx-auto grid w-full max-w-[1400px] grid-cols-1 items-center gap-12 lg:grid-cols-[3fr_2fr] lg:gap-16">
          <div>
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
          <div className="min-h-[360px] lg:min-h-[460px]">
            <ImagePlaceholder
              label="Team / founder photography"
              className="h-full min-h-[360px] justify-center lg:min-h-[460px]"
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

          <div className="mt-14 grid grid-cols-1 gap-10 lg:grid-cols-[3fr_2fr] lg:gap-16">
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

      <section className="bg-brand-ivory px-6 py-32 lg:px-24">
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
                  <ImagePlaceholder label={person.imageLabel} className="h-full min-h-[260px]" />
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
                    <IconLinkedin className="h-4 w-4" />
                  </a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-brand-ivory-deep px-6 py-24 lg:px-24">
        <div className="mx-auto max-w-[1400px]">
          <SectionLabel>Certifications</SectionLabel>
          <AnimatedText
            text="Standards that hold us accountable."
            tag="h2"
            className="mt-6 max-w-[900px] font-display text-[clamp(30px,4vw,48px)] font-light leading-[1.08] text-brand-charcoal"
          />

          <div className="mt-14 grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-10">
            {CERTS.map((c) => (
              <article
                key={c.standard}
                className="rounded-[2px] border-[0.5px] border-brand-brass bg-brand-ivory px-8 py-12 sm:px-10 sm:py-14 lg:px-14"
              >
                <div className="mb-8 h-20 w-20 shrink-0 rounded-md bg-brand-brass-pale ring-1 ring-brand-brass/20" aria-hidden />
                <h3 className="font-display text-[26px] font-normal leading-snug text-brand-charcoal">{c.title}</h3>
                <p className="mt-3 font-body text-[14px] font-normal text-brand-brass">{c.standard}</p>
                <p className="mt-5 font-body text-[13px] font-normal leading-[1.8] text-brand-mist">{c.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-brand-charcoal px-6 py-32 lg:px-24">
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
                <a href="tel:+9198XXXXXXXX" className="font-body text-[15px] font-normal text-brand-ivory hover:text-brand-brass-light">
                  +91 98XXX XXXXX
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

            <div className="mt-8 flex items-center gap-5">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand-brass transition-colors hover:text-brand-brass-light"
                aria-label="Instagram"
              >
                <IconInstagram className="h-5 w-5" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand-brass transition-colors hover:text-brand-brass-light"
                aria-label="LinkedIn"
              >
                <IconLinkedin className="h-5 w-5" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand-brass transition-colors hover:text-brand-brass-light"
                aria-label="YouTube"
              >
                <IconYoutube className="h-5 w-5" />
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
