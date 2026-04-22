import { Link } from 'react-router-dom'
import { Facebook, Instagram, Linkedin, Youtube } from 'lucide-react'
import BrandLogo from '../ui/BrandLogo'
import { SOCIAL } from '../../config/social'
import { useLegal } from '../legal/LegalLinks'

const solutionsLinks = [
  { label: 'Home Interiors', to: '/products/home-interiors' },
  { label: 'Corporate & Office Spaces', to: '/products/corporate-spaces' },
  { label: 'Spas & Salons', to: '/products/spas-salons' },
  { label: 'Retail Spaces', to: '/products/retail-spaces' },
  { label: 'Hotels, Cafes & Restaurants', to: '/products/hotels-cafes' },
]

const companyLinks = [
  { label: 'Maywood Process', to: '/maywood-process' },
  { label: 'The Team', to: '/team' },
  { label: 'Awards & Certifications', to: '/awards-certifications' },
  { label: 'Manufacturing', to: '/manufacturing' },
  { label: 'Maywood Ply', to: '/maywood-plys' },
  { label: 'Maywood Finance', to: '/finance' },
  { label: 'Partner Program', to: '/partners' },
  { label: 'Experience Centers', to: '/experience-centers' },
  { label: 'Portfolio', to: '/portfolio' },
  { label: 'About Us', to: '/about' },
]

const columnTitleClass =
  'mb-5 font-body text-[10px] font-medium uppercase tracking-[0.22em] text-brand-brass'

const footerLinkClass =
  'block font-body text-[13px] leading-relaxed text-brand-mist-light transition-colors duration-200 hover:text-brand-brass-light'

const socialIconClass =
  'text-[#B8965A] transition-opacity duration-200 hover:opacity-70 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-brass focus-visible:ring-offset-2 focus-visible:ring-offset-brand-charcoal'

export default function Footer() {
  const { openTerms, openPrivacy, openRefund, openShipping, openPayment } = useLegal()
  const legalItems = [
    { label: 'Terms & Conditions', onOpen: openTerms },
    { label: 'Privacy Policy', onOpen: openPrivacy },
    { label: 'Refund Policy', onOpen: openRefund },
    { label: 'Shipping Policy', onOpen: openShipping },
    { label: 'Payment Terms', onOpen: openPayment },
  ]

  return (
    <footer className="mt-auto bg-brand-charcoal">
      <div className="mx-auto max-w-[1400px] px-5 py-16 md:px-8 lg:px-10 lg:py-20">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-12 md:gap-10 lg:gap-14">
          <div className="md:col-span-4">
            <BrandLogo to="/" variant="footer" />
            <p className="mt-8 max-w-md font-body text-[14px] font-normal leading-[1.65] text-brand-mist">
              Bangalore&apos;s integrated interior company. Design, manufacturing, materials and finance — under one
              roof.
            </p>
            <div className="mt-8 flex flex-wrap gap-2">
              <span className="inline-flex items-center rounded-full border border-brand-brass/60 px-3.5 py-1.5 font-body text-[10px] font-medium uppercase tracking-[0.14em] text-brand-brass-light">
                ISO 9001
              </span>
              <span className="inline-flex items-center rounded-full border border-brand-brass/60 px-3.5 py-1.5 font-body text-[10px] font-medium uppercase tracking-[0.14em] text-brand-brass-light">
                ISO 45001
              </span>
            </div>
            <div className="mt-6 flex gap-5">
              <a
                href={SOCIAL.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className={socialIconClass}
                aria-label="Maywood Interiors on Instagram"
              >
                <Instagram size={20} strokeWidth={1.5} />
              </a>
              <a
                href={SOCIAL.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className={socialIconClass}
                aria-label="Maywood Interiors on Facebook"
              >
                <Facebook size={20} strokeWidth={1.5} />
              </a>
              <a
                href={SOCIAL.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className={socialIconClass}
                aria-label="Maywood Interiors on LinkedIn"
              >
                <Linkedin size={20} strokeWidth={1.5} />
              </a>
              <a
                href={SOCIAL.youtube}
                target="_blank"
                rel="noopener noreferrer"
                className={socialIconClass}
                aria-label="Maywood Interiors on YouTube"
              >
                <Youtube size={20} strokeWidth={1.5} />
              </a>
            </div>
          </div>

          <div className="md:col-span-2">
            <h3 className={columnTitleClass}>Solutions</h3>
            <ul className="space-y-3">
              {solutionsLinks.map(({ label, to }) => (
                <li key={label}>
                  <Link to={to} className={footerLinkClass}>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-2">
            <h3 className={columnTitleClass}>Company</h3>
            <ul className="space-y-3">
              {companyLinks.map(({ label, to }) => (
                <li key={label}>
                  <Link to={to} className={footerLinkClass}>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-2">
            <h3 className={columnTitleClass}>Legal</h3>
            <ul className="space-y-3">
              {legalItems.map(({ label, onOpen }) => (
                <li key={label}>
                  <button
                    type="button"
                    onClick={onOpen}
                    className={[footerLinkClass, 'w-full text-left'].join(' ')}
                  >
                    {label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-2">
            <h3 className={columnTitleClass}>Contact</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/contact" className={footerLinkClass}>
                  Contact us
                </Link>
              </li>
              <li>
                <a href="tel:+919606977677" className={footerLinkClass}>
                  +91 96069 77677
                </a>
              </li>
              <li>
                <a href="mailto:hello@maywoodinteriors.com" className={footerLinkClass}>
                  hello@maywoodinteriors.com
                </a>
              </li>
              <li>
                <p className="font-body text-[13px] leading-relaxed text-brand-mist-light">
                  34, 4th Cross Rd, RR Nagar via,
                  <span className="mt-1 block text-brand-mist">Uttarahalli Main Rd, Vaddara Palya,</span>
                  <span className="mt-1 block text-brand-mist">Kodipur, Bengaluru - 560061</span>
                </p>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-[rgba(184,150,90,0.15)]">
        <div className="mx-auto flex max-w-[1400px] flex-col gap-2 px-5 py-6 md:px-8 lg:px-10">
          <p className="text-center font-body text-[12px] text-brand-mist md:text-left">
            © 2026 Maywood Interiors Private Limited. All rights reserved. | GST: [ADD GST NUMBER]
          </p>
          <div className="flex justify-center md:justify-end">
            <Link
              to="/admin"
              className="font-body text-[11px] text-[rgba(255,255,255,0.2)] transition-colors hover:text-[rgba(255,255,255,0.35)]"
            >
              Admin
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
