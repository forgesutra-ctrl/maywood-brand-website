import { Link } from 'react-router-dom'
import { IconInstagram, IconLinkedin, IconYoutube } from '../ui/BrandSocialIcons'

const solutionsLinks = [
  { label: 'Home Interiors', to: '/products' },
  { label: 'Corporate Spaces', to: '/products' },
  { label: 'Retail & Hospitality', to: '/products' },
  { label: 'Spas & Salons', to: '/products' },
]

const companyLinks = [
  { label: 'Manufacturing', to: '/manufacturing' },
  { label: 'Maywood Plys', to: '/maywood-plys' },
  { label: 'Finance', to: '/maywood-finance' },
  { label: 'Partner Program', to: '/partners' },
  { label: 'Experience Centers', to: '/experience-centers' },
]

const columnTitleClass =
  'mb-5 font-body text-[10px] font-medium uppercase tracking-[0.22em] text-brand-brass'

const footerLinkClass =
  'block font-body text-[13px] leading-relaxed text-brand-mist-light transition-colors duration-200 hover:text-brand-brass-light'

const socialWrap =
  'flex h-10 w-10 items-center justify-center rounded-full border border-brand-brass/35 text-brand-mist-light transition-colors duration-200 hover:border-brand-brass-light hover:text-brand-brass-light'

export default function Footer() {
  return (
    <footer className="mt-auto bg-brand-charcoal">
      <div className="mx-auto max-w-[1400px] px-5 py-16 md:px-8 lg:px-10 lg:py-20">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-12 md:gap-10 lg:gap-14">
          <div className="md:col-span-5">
            <Link to="/" className="group inline-block text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-brass focus-visible:ring-offset-2 focus-visible:ring-offset-brand-charcoal">
              <span className="block font-display text-[20px] font-light uppercase leading-tight tracking-[0.2em] text-brand-ivory transition-opacity duration-300 group-hover:opacity-90">
                MAYWOOD
              </span>
              <span className="mt-1 block font-body text-[9px] font-normal uppercase tracking-[0.3em] text-brand-mist-light">
                INTERIORS
              </span>
            </Link>
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

          <div className="md:col-span-3">
            <h3 className={columnTitleClass}>Contact</h3>
            <ul className="space-y-3">
              <li>
                <a href="tel:+910000000000" className={footerLinkClass}>
                  +91 00000 00000
                </a>
              </li>
              <li>
                <a href="mailto:hello@maywoodinteriors.com" className={footerLinkClass}>
                  hello@maywoodinteriors.com
                </a>
              </li>
              <li>
                <p className="font-body text-[13px] leading-relaxed text-brand-mist-light">
                  Indiranagar Studio · Whitefield Gallery
                  <span className="mt-1 block text-brand-mist">Bangalore, India</span>
                </p>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-[rgba(184,150,90,0.15)]">
        <div className="mx-auto flex max-w-[1400px] flex-col items-center justify-between gap-6 px-5 py-6 md:flex-row md:px-8 lg:px-10">
          <p className="text-center font-body text-[12px] text-brand-mist md:text-left">
            © {new Date().getFullYear()} Maywood Interiors. All rights reserved.
          </p>
          <div className="flex items-center gap-3">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className={socialWrap}
              aria-label="Maywood Interiors on Instagram"
            >
              <IconInstagram className="h-[18px] w-[18px]" />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className={socialWrap}
              aria-label="Maywood Interiors on LinkedIn"
            >
              <IconLinkedin className="h-[18px] w-[18px]" />
            </a>
            <a
              href="https://youtube.com"
              target="_blank"
              rel="noopener noreferrer"
              className={socialWrap}
              aria-label="Maywood Interiors on YouTube"
            >
              <IconYoutube className="h-[18px] w-[18px]" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
