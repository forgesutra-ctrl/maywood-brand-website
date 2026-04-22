import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Facebook, Instagram, Linkedin, Loader2, Mail, MapPin, Phone, Youtube } from 'lucide-react'
import SectionLabel from '../components/ui/SectionLabel'
import AnimatedText from '../components/ui/AnimatedText'
import { buttonClasses } from '../lib/buttonStyles'
import { supabase } from '../lib/supabase'
import { isValidEmail } from '../lib/validation'
import { track } from '../utils/tracking'
import { SOCIAL } from '../config/social'

const fieldClassDark =
  'w-full border-b border-white/25 bg-transparent py-2 font-body text-[15px] text-brand-ivory outline-none transition-colors placeholder:text-brand-mist-light/50 focus:border-brand-brass'

const initialContact = {
  fullName: '',
  phone: '',
  email: '',
  message: '',
}

const submitErrorClass = 'font-body text-[13px] font-normal text-red-400'

export default function Contact() {
  const [contact, setContact] = useState(initialContact)
  const [sent, setSent] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')

  const handleContactSubmit = async (e) => {
    e.preventDefault()
    setSubmitError('')
    if (!isValidEmail(contact.email)) {
      setSubmitError('Please enter a valid email address.')
      return
    }
    try {
      setIsSubmitting(true)
      const { error } = await supabase.from('contact_messages').insert({
        full_name: contact.fullName.trim(),
        phone: contact.phone.trim(),
        email: contact.email.trim(),
        message: contact.message.trim(),
        source_page: 'contact',
      })
      if (error) throw error
      track.formSubmit('contact_page')
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
      <section
        className="flex min-h-[220px] flex-col justify-center bg-[#1a1612] px-8 py-16 lg:px-24"
        aria-labelledby="contact-hero-title"
      >
        <div className="mx-auto w-full max-w-3xl text-center">
          <p className="mb-3 text-xs uppercase tracking-[0.2em] text-[#c9a465]">GET IN TOUCH</p>
          <h1 id="contact-hero-title" className="font-serif text-4xl font-light text-white md:text-5xl">
            Let&apos;s Talk About Your Space.
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-sm text-white/60">
            Whether you have a project brief or just an idea — our team is ready to listen.
          </p>
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
                  34, 4th Cross Rd, RR Nagar via Uttarahalli Main Rd, Vaddara Palya, Kodipur, Bengaluru – 560061
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
                      to="/instant-quote"
                      onClick={() => track.quoteClick()}
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
