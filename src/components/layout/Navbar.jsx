import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronDown, X, Menu } from 'lucide-react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import BrandLogo from '../ui/BrandLogo'
import { useScrolled } from '../../hooks/useScrolled'
import { buttonClasses } from '../../lib/buttonStyles'

const MotionLink = motion(Link)

const SOLUTIONS_ITEMS = [
  { label: 'Home Interiors', to: '/products/home-interiors' },
  { label: 'Corporate & Office Spaces', to: '/products/corporate-spaces' },
  { label: 'Spas & Salons', to: '/products/spas-salons' },
  { label: 'Retail Spaces', to: '/products/retail-spaces' },
  { label: 'Hotels, Cafes & Restaurants', to: '/products/hotels-cafes' },
]

const ABOUT_ITEMS = [
  { label: 'Experience Centers', to: '/experience-centers' },
  { label: 'Maywood Process', to: '/project-studio' },
  { label: 'The Team', to: '/about#team' },
  { label: 'Awards & Certifications', to: '/about#awards' },
  { label: 'Portfolio', to: '/portfolio' },
  { label: 'Contact', to: '/about#contact' },
]

const DIRECT_NAV = [
  { label: 'Maywood Finance', to: '/finance' },
  { label: 'Manufacturing', to: '/manufacturing' },
  { label: 'Maywood Ply', to: '/maywood-plys' },
  { label: 'Partner Program', to: '/partners' },
]

const dropdownPanelClass =
  'min-w-[260px] rounded-sm border border-[rgba(184,150,90,0.45)] bg-[#1a1612] py-2 shadow-[0_24px_48px_-12px_rgba(0,0,0,0.45)]'

const dropdownLinkClass = (isActive) =>
  [
    'block px-5 py-2.5 font-body text-[12px] font-normal leading-snug transition-colors duration-200',
    isActive ? 'text-brand-brass' : 'text-brand-ivory hover:text-brand-brass',
  ].join(' ')

const topLinkClass = (isActive) =>
  [
    'flex items-center gap-1 font-body text-[10px] uppercase tracking-[0.08em] transition-colors duration-200 xl:text-[11px] xl:tracking-[0.1em]',
    isActive ? 'text-brand-brass' : 'text-brand-mist hover:text-brand-brass',
  ].join(' ')

function parseHashRoute(to) {
  const i = to.indexOf('#')
  if (i === -1) return { pathname: to, hash: '' }
  return { pathname: to.slice(0, i), hash: to.slice(i) }
}

function isSolutionsActive(pathname) {
  return pathname.startsWith('/products')
}

function isAboutParentActive(pathname) {
  return (
    pathname === '/about' ||
    pathname === '/experience-centers' ||
    pathname === '/project-studio' ||
    pathname === '/portfolio'
  )
}

function isDropdownItemActive(location, to) {
  const { pathname, hash } = parseHashRoute(to)
  if (hash) {
    return location.pathname === pathname && location.hash === hash
  }
  return location.pathname === pathname
}

export default function Navbar() {
  const scrolled = useScrolled(80)
  const location = useLocation()
  const [desktopOpen, setDesktopOpen] = useState(null)
  const closeTimer = useRef(null)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [mobileSolutionsOpen, setMobileSolutionsOpen] = useState(false)
  const [mobileAboutOpen, setMobileAboutOpen] = useState(false)

  const clearCloseTimer = useCallback(() => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current)
      closeTimer.current = null
    }
  }, [])

  const openDesktop = useCallback(
    (key) => {
      clearCloseTimer()
      setDesktopOpen(key)
    },
    [clearCloseTimer],
  )

  const scheduleCloseDesktop = useCallback(() => {
    clearCloseTimer()
    closeTimer.current = setTimeout(() => setDesktopOpen(null), 140)
  }, [clearCloseTimer])

  useEffect(() => {
    return () => clearCloseTimer()
  }, [clearCloseTimer])

  useEffect(() => {
    const id = requestAnimationFrame(() => {
      setMobileOpen(false)
      setMobileSolutionsOpen(false)
      setMobileAboutOpen(false)
    })
    return () => cancelAnimationFrame(id)
  }, [location.pathname, location.hash])

  useEffect(() => {
    if (!mobileOpen) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [mobileOpen])

  const solutionsTriggerActive = isSolutionsActive(location.pathname)
  const aboutTriggerActive = isAboutParentActive(location.pathname)

  return (
    <motion.header
      className={[
        'relative sticky top-[2px] w-full border-b border-transparent transition-[border-color,background-color] duration-300 ease-out',
        mobileOpen ? 'z-[10030]' : 'z-[9997]',
      ].join(' ')}
      animate={{
        backgroundColor: scrolled ? '#F7F3ED' : 'rgba(247, 243, 237, 0)',
        borderBottomColor: scrolled ? 'rgba(184, 150, 90, 0.2)' : 'rgba(184, 150, 90, 0)',
      }}
      style={{ borderBottomWidth: scrolled ? 0.5 : 0 }}
    >
      <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-3 px-5 py-4 md:px-8 lg:px-10">
        <BrandLogo to="/" variant="navbar" />

        <nav
          className="absolute left-1/2 top-1/2 hidden min-w-0 max-w-[min(100%,920px)] -translate-x-1/2 -translate-y-1/2 lg:block xl:max-w-[min(100%,1080px)]"
          aria-label="Primary"
          onMouseLeave={scheduleCloseDesktop}
        >
          <ul className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 xl:gap-x-3">
            <li
              className="relative"
              onMouseEnter={() => openDesktop('solutions')}
              onFocusCapture={() => openDesktop('solutions')}
            >
              <button
                type="button"
                className={topLinkClass(solutionsTriggerActive)}
                aria-expanded={desktopOpen === 'solutions'}
                aria-haspopup="true"
                onClick={() => setDesktopOpen((k) => (k === 'solutions' ? null : 'solutions'))}
              >
                Solutions
                <ChevronDown className="h-3.5 w-3.5 shrink-0 opacity-80" strokeWidth={1.5} aria-hidden />
              </button>
              <AnimatePresence>
                {desktopOpen === 'solutions' && (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.2, ease: [0.33, 1, 0.68, 1] }}
                    className="absolute left-1/2 top-full z-[10010] w-max max-w-[min(100vw-32px,320px)] -translate-x-1/2 pt-2"
                    onMouseEnter={() => openDesktop('solutions')}
                  >
                    <ul className={dropdownPanelClass} role="list">
                      {SOLUTIONS_ITEMS.map((item) => (
                        <li key={item.to}>
                          <NavLink
                            to={item.to}
                            className={({ isActive }) =>
                              dropdownLinkClass(isActive || isDropdownItemActive(location, item.to))
                            }
                            onClick={() => setDesktopOpen(null)}
                          >
                            {item.label}
                          </NavLink>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                )}
              </AnimatePresence>
            </li>

            {DIRECT_NAV.map(({ label, to }) => (
              <li key={to}>
                <NavLink to={to} className={({ isActive }) => topLinkClass(isActive)}>
                  {label}
                </NavLink>
              </li>
            ))}

            <li
              className="relative"
              onMouseEnter={() => openDesktop('about')}
              onFocusCapture={() => openDesktop('about')}
            >
              <button
                type="button"
                className={topLinkClass(aboutTriggerActive)}
                aria-expanded={desktopOpen === 'about'}
                aria-haspopup="true"
                onClick={() => setDesktopOpen((k) => (k === 'about' ? null : 'about'))}
              >
                About Us
                <ChevronDown className="h-3.5 w-3.5 shrink-0 opacity-80" strokeWidth={1.5} aria-hidden />
              </button>
              <AnimatePresence>
                {desktopOpen === 'about' && (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.2, ease: [0.33, 1, 0.68, 1] }}
                    className="absolute left-1/2 top-full z-[10010] w-max max-w-[min(100vw-32px,300px)] -translate-x-1/2 pt-2"
                    onMouseEnter={() => openDesktop('about')}
                  >
                    <ul className={dropdownPanelClass} role="list">
                      {ABOUT_ITEMS.map((item) => (
                        <li key={item.to}>
                          <NavLink
                            to={item.to}
                            className={({ isActive }) =>
                              dropdownLinkClass(isActive || isDropdownItemActive(location, item.to))
                            }
                            onClick={() => setDesktopOpen(null)}
                          >
                            {item.label}
                          </NavLink>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                )}
              </AnimatePresence>
            </li>
          </ul>
        </nav>

        <div className="flex shrink-0 items-center gap-1 md:gap-3">
          <MotionLink
            to="/instant-quote"
            className={buttonClasses('ctaPrimary', 'hidden whitespace-nowrap lg:inline-flex focus-visible:ring-offset-[#F7F3ED]')}
            whileTap={{ scale: 0.98 }}
            transition={{ type: 'tween', duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
          >
            INSTANT QUOTE
          </MotionLink>

          <button
            type="button"
            className="flex h-11 w-11 items-center justify-center rounded-sm text-brand-charcoal transition-colors hover:text-brand-brass focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-brass lg:hidden"
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((o) => !o)}
          >
            {mobileOpen ? <X className="h-5 w-5" strokeWidth={1.15} /> : <Menu className="h-5 w-5" strokeWidth={1.15} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[10020] bg-[#1a1612] lg:hidden"
            role="dialog"
            aria-modal="true"
            aria-label="Site navigation"
          >
            <div className="flex h-full min-h-0 flex-col pt-[76px]">
              <div className="min-h-0 flex-1 overflow-y-auto px-5 pb-4">
                <div className="border-b border-[rgba(184,150,90,0.25)]">
                  <button
                    type="button"
                    className="flex w-full items-center justify-between py-4 text-left font-body text-[11px] font-medium uppercase tracking-[0.12em] text-brand-ivory"
                    aria-expanded={mobileSolutionsOpen}
                    onClick={() => setMobileSolutionsOpen((v) => !v)}
                  >
                    Solutions
                    <ChevronDown
                      className={['h-4 w-4 text-brand-brass transition-transform', mobileSolutionsOpen ? 'rotate-180' : ''].join(
                        ' ',
                      )}
                      strokeWidth={1.5}
                      aria-hidden
                    />
                  </button>
                  <AnimatePresence initial={false}>
                    {mobileSolutionsOpen && (
                      <motion.ul
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.22, ease: [0.33, 1, 0.68, 1] }}
                        className="overflow-hidden border-t border-[rgba(184,150,90,0.15)]"
                      >
                        {SOLUTIONS_ITEMS.map((item) => (
                          <li key={item.to} className="border-b border-[rgba(184,150,90,0.1)] last:border-b-0">
                            <NavLink
                              to={item.to}
                              onClick={() => setMobileOpen(false)}
                              className={({ isActive }) =>
                                [
                                  'block py-3.5 pl-3 font-body text-[13px] leading-snug transition-colors',
                                  isActive || isDropdownItemActive(location, item.to)
                                    ? 'text-brand-brass'
                                    : 'text-brand-mist-light hover:text-brand-brass',
                                ].join(' ')
                              }
                            >
                              {item.label}
                            </NavLink>
                          </li>
                        ))}
                      </motion.ul>
                    )}
                  </AnimatePresence>
                </div>

                {DIRECT_NAV.map(({ label, to }) => (
                  <div key={to} className="border-b border-[rgba(184,150,90,0.25)]">
                    <NavLink
                      to={to}
                      onClick={() => setMobileOpen(false)}
                      className={({ isActive }) =>
                        [
                          'block py-4 font-body text-[11px] font-medium uppercase tracking-[0.12em] transition-colors',
                          isActive ? 'text-brand-brass' : 'text-brand-ivory hover:text-brand-brass',
                        ].join(' ')
                      }
                    >
                      {label}
                    </NavLink>
                  </div>
                ))}

                <div className="border-b border-[rgba(184,150,90,0.25)]">
                  <button
                    type="button"
                    className="flex w-full items-center justify-between py-4 text-left font-body text-[11px] font-medium uppercase tracking-[0.12em] text-brand-ivory"
                    aria-expanded={mobileAboutOpen}
                    onClick={() => setMobileAboutOpen((v) => !v)}
                  >
                    About Us
                    <ChevronDown
                      className={['h-4 w-4 text-brand-brass transition-transform', mobileAboutOpen ? 'rotate-180' : ''].join(' ')}
                      strokeWidth={1.5}
                      aria-hidden
                    />
                  </button>
                  <AnimatePresence initial={false}>
                    {mobileAboutOpen && (
                      <motion.ul
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.22, ease: [0.33, 1, 0.68, 1] }}
                        className="overflow-hidden border-t border-[rgba(184,150,90,0.15)]"
                      >
                        {ABOUT_ITEMS.map((item) => (
                          <li key={item.to} className="border-b border-[rgba(184,150,90,0.1)] last:border-b-0">
                            <NavLink
                              to={item.to}
                              onClick={() => setMobileOpen(false)}
                              className={({ isActive }) =>
                                [
                                  'block py-3.5 pl-3 font-body text-[13px] leading-snug transition-colors',
                                  isActive || isDropdownItemActive(location, item.to)
                                    ? 'text-brand-brass'
                                    : 'text-brand-mist-light hover:text-brand-brass',
                                ].join(' ')
                              }
                            >
                              {item.label}
                            </NavLink>
                          </li>
                        ))}
                      </motion.ul>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              <div className="shrink-0 border-t border-[rgba(184,150,90,0.25)] bg-[#1a1612] px-5 py-5">
                <MotionLink
                  to="/instant-quote"
                  className={buttonClasses('ctaPrimary', 'w-full justify-center focus-visible:ring-offset-[#1a1612]')}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: 'tween', duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
                  onClick={() => setMobileOpen(false)}
                >
                  INSTANT QUOTE
                </MotionLink>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}
