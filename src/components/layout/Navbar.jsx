import { CloseButton, Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/react'
import { motion } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { Link, NavLink } from 'react-router-dom'
import BrandLogo from '../ui/BrandLogo'
import { useScrolled } from '../../hooks/useScrolled'
import { buttonClasses } from '../../lib/buttonStyles'

const MotionLink = motion(Link)

const navItems = [
  { label: 'Products & Services', to: '/products' },
  { label: 'Experience Centers', to: '/experience-centers' },
  { label: 'Portfolio', to: '/portfolio' },
  { label: 'Finance', to: '/maywood-finance' },
  { label: 'Manufacturing', to: '/manufacturing' },
  { label: 'Partners', to: '/partners' },
  { label: 'About', to: '/about' },
]

const linkClass = ({ isActive }) =>
  [
    'font-body text-[11px] uppercase tracking-[0.1em] transition-colors duration-200',
    isActive ? 'text-brand-brass' : 'text-brand-mist hover:text-brand-brass',
  ].join(' ')

export default function Navbar() {
  const scrolled = useScrolled(80)

  return (
    <motion.header
      className="relative sticky top-[2px] z-[9997] w-full border-b border-transparent transition-[border-color,background-color] duration-300 ease-out"
      animate={{
        backgroundColor: scrolled ? '#F7F3ED' : 'rgba(247, 243, 237, 0)',
        borderBottomColor: scrolled ? 'rgba(184, 150, 90, 0.2)' : 'rgba(184, 150, 90, 0)',
      }}
      style={{ borderBottomWidth: scrolled ? 0.5 : 0 }}
    >
      <div className="mx-auto flex max-w-[1400px] items-center justify-between px-5 py-4 md:px-8 lg:px-10">
        <BrandLogo to="/" variant="navbar" withNavWordmark />

        <nav
          className="absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 md:block"
          aria-label="Primary"
        >
          <ul className="flex items-center gap-6 lg:gap-8 xl:gap-10">
            {navItems.map(({ label, to }) => (
              <li key={to}>
                <NavLink to={to} className={linkClass}>
                  {label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-1 md:gap-4">
          <MotionLink
            to="/instant-quote"
            className={buttonClasses('dark', 'hidden md:inline-flex')}
            whileTap={{ scale: 0.98 }}
            transition={{ type: 'tween', duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
          >
            Instant Quote
          </MotionLink>

          <Disclosure as="div" className="md:hidden">
            {({ open }) => (
              <>
                <DisclosureButton
                  className="flex h-11 w-11 items-center justify-center rounded-sm text-brand-charcoal transition-colors hover:text-brand-brass focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-brass"
                  aria-label={open ? 'Close menu' : 'Open menu'}
                >
                  {open ? <X className="h-5 w-5" strokeWidth={1.15} /> : <Menu className="h-5 w-5" strokeWidth={1.15} />}
                </DisclosureButton>

                <div className="overflow-hidden">
                  <DisclosurePanel
                    transition
                    className="absolute left-0 right-0 top-full origin-top border-b border-[rgba(184,150,90,0.15)] bg-[#F7F3ED] shadow-[0_28px_56px_-16px_rgba(28,25,21,0.14)] transition duration-200 ease-out data-[closed]:-translate-y-2 data-[closed]:opacity-0 md:hidden"
                  >
                    <div className="px-5 py-6">
                      <ul className="flex flex-col gap-0 border-t border-brand-ivory-deep/70 pt-5">
                        {navItems.map(({ label, to }) => (
                          <li key={to} className="border-b border-brand-ivory-deep/40 last:border-b-0">
                            <CloseButton
                              as={Link}
                              to={to}
                              className="block w-full py-3.5 text-left font-body text-[11px] uppercase tracking-[0.1em] text-brand-mist transition-colors hover:text-brand-brass focus:outline-none focus-visible:text-brand-brass"
                            >
                              {label}
                            </CloseButton>
                          </li>
                        ))}
                      </ul>
                      <div className="mt-8">
                        <CloseButton
                          as={Link}
                          to="/instant-quote"
                          className={buttonClasses('dark', 'w-full active:scale-[0.98]')}
                        >
                          Instant Quote
                        </CloseButton>
                      </div>
                    </div>
                  </DisclosurePanel>
                </div>
              </>
            )}
          </Disclosure>
        </div>
      </div>
    </motion.header>
  )
}
