import { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react'
import { ChevronDown, X } from 'lucide-react'
import {
  AnimatePresence,
  motion,
  useInView,
  useReducedMotion,
} from 'framer-motion'

const teamMembers = [
  {
    id: 1,
    name: 'Vibhav Kashyap',
    role: 'Director',
    department: "Directors' Corner",
    gender: 'male',
    quote: 'Every space we design is a reflection of our commitment to excellence.',
    left: '18%',
    top: '22%',
  },
  {
    id: 2,
    name: 'Priyanka Ram Pujari',
    role: 'Director',
    department: "Directors' Corner",
    gender: 'female',
    quote: 'Leadership is about building systems that outlast individuals.',
    left: '11%',
    top: '24%',
  },
  {
    id: 3,
    name: 'Chethana Rajshekhar',
    role: 'Director – Business Development',
    department: "Directors' Corner",
    gender: 'female',
    quote: 'Relationships are the foundation of every great business.',
    left: '25%',
    top: '23%',
  },
  {
    id: 4,
    name: 'Aashik Varma',
    role: 'Junior Designer',
    department: 'Design Studio',
    gender: 'male',
    quote: 'Good design begins with listening.',
    left: '41%',
    top: '21%',
  },
  {
    id: 5,
    name: 'Sushma K J',
    role: 'Designs Manager',
    department: 'Design Studio',
    gender: 'female',
    quote: 'Design is where function meets feeling.',
    left: '48%',
    top: '20%',
  },
  {
    id: 6,
    name: 'Shravan K Pujari',
    role: 'Projects Manager',
    department: 'Operations Hub',
    gender: 'male',
    quote: 'A project well planned is a project half delivered.',
    left: '68%',
    top: '20%',
  },
  {
    id: 7,
    name: 'Mithravinda VN',
    role: 'Operations Manager',
    department: 'Operations Hub',
    gender: 'female',
    quote: 'Consistency in operations creates trust in outcomes.',
    left: '76%',
    top: '22%',
  },
  {
    id: 8,
    name: 'Nikhil Y',
    role: 'Social Media Associate',
    department: 'Sales & Marketing',
    gender: 'male',
    quote: 'Every story we tell builds the brand.',
    left: '46%',
    top: '38%',
  },
  {
    id: 9,
    name: 'Swathi P',
    role: 'CRM Associate',
    department: 'Sales & Marketing',
    gender: 'female',
    quote: 'Every client interaction is an opportunity to build trust.',
    left: '53%',
    top: '36%',
  },
  {
    id: 10,
    name: 'Lakshmi KS',
    role: 'CRM Associate',
    department: 'Client Lounge',
    gender: 'female',
    quote: 'Happy clients are our greatest achievement.',
    left: '11%',
    top: '46%',
  },
  {
    id: 11,
    name: 'Arbeen Taj',
    role: 'AM - COO',
    department: 'Client Lounge',
    gender: 'female',
    quote: 'Operations excellence is the backbone of every great project.',
    left: '18%',
    top: '48%',
  },
  {
    id: 12,
    name: 'Sankar Jana',
    role: 'Production Manager',
    department: 'Factory Floor',
    gender: 'male',
    quote: 'Precision on the factory floor defines quality in the final room.',
    left: '12%',
    top: '67%',
  },
  {
    id: 13,
    name: 'Dipankar Giri',
    role: 'Senior Machine Operator',
    department: 'Factory Floor',
    gender: 'male',
    quote: 'Craftsmanship is a skill built over years, not days.',
    left: '33%',
    top: '68%',
  },
  {
    id: 14,
    name: 'Amarnath Barai',
    role: 'Machine Operator',
    department: 'Factory Floor',
    gender: 'male',
    quote: 'Every cut matters. Every joint counts.',
    left: '56%',
    top: '62%',
  },
  {
    id: 15,
    name: 'Sudip',
    role: 'Factory Support Staff',
    department: 'Factory Floor',
    gender: 'male',
    quote: "No detail is too small when it's someone's home.",
    left: '62%',
    top: '70%',
  },
  {
    id: 16,
    name: 'Susanta Midya',
    role: 'Senior Carpenter',
    department: 'Factory Floor',
    gender: 'male',
    quote: 'Wood speaks when hands listen.',
    left: '82%',
    top: '64%',
  },
  {
    id: 18,
    name: 'Kumaravel',
    role: 'Senior Carpenter',
    department: 'Factory Floor',
    gender: 'male',
    quote: 'Precision in every cut. Pride in every finish.',
    photo: '/assets/images/team/kumaravel.jpg',
    left: '91%',
    top: '57%',
  },
  {
    id: 19,
    name: 'Sitesh Kumar',
    role: 'Junior Carpenter',
    department: 'Factory Floor',
    gender: 'male',
    quote: 'Every piece of wood has a story. I help tell it.',
    photo: '/assets/images/team/sitesh-kumar.jpg',
    left: '38%',
    top: '60%',
  },
]

/** Headshot paths for the detail panel (not part of the client-provided `teamMembers` list). */
const AVATAR_BY_MEMBER_ID = {
  1: '/assets/images/team/vibhav-kashyap.jpg',
  2: '/assets/images/team/priyanka-ram-pujari.jpg',
  3: '/assets/images/team/chethana-rajshekhar.jpg',
  4: '/assets/images/team/aashik-varma.jpg',
  5: '/assets/images/team/sushma-kj.jpg',
  6: '/assets/images/team/shravan-k-pujari.jpg',
  7: '/assets/images/team/mithravinda-vn.jpg',
  8: '/assets/images/team/nikhil-y.jpg',
  9: '/assets/images/team/swathi-p.jpg',
  10: '/assets/images/team/lakshmi-ks.jpg',
  11: '/assets/images/team/arbeen-taj.jpg',
  12: '/assets/images/team/sankar-jana.jpg',
  13: '/assets/images/team/dipankar-giri.jpg',
  14: '/assets/images/team/amarnath-barai.jpg',
  15: '/assets/images/team/sudip.jpg',
  16: '/assets/images/team/susanta-midya.jpg',
  18: '/assets/images/team/kumaravel.jpg',
  19: '/assets/images/team/sitesh-kumar.jpg',
}

/** @type {{ key: string; label: string }[]} */
const MOBILE_DEPT_ACCORDION = [
  { key: 'directors', label: "Directors' Corner" },
  { key: 'design', label: 'Design Studio' },
  { key: 'operations', label: 'Operations Hub' },
  { key: 'sales', label: 'Sales & Marketing' },
  { key: 'lounge', label: 'Client Lounge' },
  { key: 'factory', label: 'Factory Floor' },
]

const TEAM_STATS_MOBILE = [
  { value: '16', label: 'Team Members' },
  { value: '4', label: 'Departments' },
  { value: '9', label: 'Years' },
  { value: '1', label: 'Vision' },
]



/**
 * @param {typeof teamMembers[number]} member
 * @returns {import('react').CSSProperties}
 */
function teamHotspotButtonStyle(member) {
  if (member.gender === 'male') {
    return {
      position: 'absolute',
      left: member.left,
      top: member.top,
      width: '14px',
      height: '14px',
      borderRadius: '50%',
      backgroundColor: '#1a1612',
      border: '2.5px solid #c9a465',
      cursor: 'pointer',
      transform: 'translate(-50%, -50%)',
      zIndex: 10,
      boxShadow: '0 0 0 4px rgba(201,164,101,0.25)',
    }
  }
  return {
    position: 'absolute',
    left: member.left,
    top: member.top,
    width: '14px',
    height: '14px',
    borderRadius: '50%',
    backgroundColor: '#c9a465',
    border: '2.5px solid white',
    cursor: 'pointer',
    transform: 'translate(-50%, -50%)',
    zIndex: 10,
    boxShadow: '0 0 0 4px rgba(201,164,101,0.25)',
  }
}

/**
 * @param {{
 *   person: (typeof teamMembers)[number]
 *   isHot: boolean
 *   lightsOn: boolean
 *   reduceMotion: boolean | null
 *   onHover: (v: boolean) => void
 *   onPick: () => void
 * }} props
 */
function TeamFloorHotspotMarker({ person, isHot, lightsOn, reduceMotion, onHover, onPick }) {
  const delay = person.id * 0.02
  return (
    <motion.button
      type="button"
      tabIndex={0}
      aria-label={`${person.name}, ${person.role}`}
      data-active={isHot ? 'true' : 'false'}
      className="touch-manipulation border-0 p-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B8965A] focus-visible:ring-offset-2 focus-visible:ring-offset-[#f5f0eb]"
      style={teamHotspotButtonStyle(person)}
      initial={reduceMotion ? false : { opacity: 0 }}
      animate={{ opacity: lightsOn || reduceMotion ? 1 : 0 }}
      transition={{
        delay: reduceMotion ? 0 : delay,
        duration: reduceMotion ? 0 : 0.65,
        ease: [0.22, 1, 0.36, 1],
      }}
      onMouseEnter={() => onHover(true)}
      onMouseLeave={() => onHover(false)}
      onFocus={() => onHover(true)}
      onBlur={() => onHover(false)}
      onClick={(e) => {
        e.stopPropagation()
        onPick()
      }}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          e.stopPropagation()
          onPick()
        }
      }}
    />
  )
}

export default function TeamStudioRoom() {
  const reduceMotion = useReducedMotion()
  const sectionRef = useRef(null)
  const inView = useInView(sectionRef, { amount: 0.2, once: true })
  const [lightsOn, setLightsOn] = useState(false)
  const [hoveredId, setHoveredId] = useState(/** @type {number | null} */ (null))
  const [selectedId, setSelectedId] = useState(/** @type {number | null} */ (null))
  const [mobileOpenDeptKey, setMobileOpenDeptKey] = useState(/** @type {string | null} */ ('directors'))
  const [sheetPerson, setSheetPerson] = useState(/** @type {(typeof teamMembers)[number] | null} */ (null))
  const titleId = useId()

  useEffect(() => {
    if (!inView) return
    if (reduceMotion) {
      setLightsOn(true)
      return
    }
    const t = window.setTimeout(() => setLightsOn(true), 180)
    return () => window.clearTimeout(t)
  }, [inView, reduceMotion])

  const activePerson = useMemo(() => {
    const id = hoveredId ?? selectedId
    return teamMembers.find((p) => p.id === id) ?? null
  }, [hoveredId, selectedId])

  const selectPerson = useCallback((/** @type {number} */ id) => {
    setSelectedId(id)
  }, [])

  const clearRoomSelection = useCallback(() => {
    setSelectedId(null)
    setHoveredId(null)
  }, [])

  const closeSheet = useCallback(() => setSheetPerson(null), [])

  useEffect(() => {
    if (!sheetPerson) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e) => {
      if (e.key === 'Escape') closeSheet()
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener('keydown', onKey)
    }
  }, [sheetPerson, closeSheet])

  return (
    <section
      ref={sectionRef}
      id="team"
      className="scroll-mt-28 bg-[#f5f0eb] px-6 py-24 lg:px-24 lg:py-32"
      aria-labelledby={titleId}
    >
      <div className="mx-auto max-w-[1400px]">
        <h2
          id={titleId}
          className="max-w-[920px] font-display text-[clamp(30px,4vw,52px)] font-light leading-[1.06] text-brand-charcoal"
        >
          The People Behind Maywood
        </h2>
        <p className="mt-4 max-w-[720px] font-body text-[15px] font-normal leading-relaxed text-brand-mist">
          It takes hundreds of people—designers, engineers, factory teams, and vendors—to deliver every project. Here are
          some of the key people who&apos;ve been part of that journey from the beginning.
        </p>

        {/* Tablet + desktop: isometric floor plan image with hotspots + detail panel */}
        <div className="mt-14 hidden md:block">
          <motion.div
            className="relative w-full overflow-hidden rounded-[12px] border border-[rgba(184,150,90,0.3)] bg-[#f5f0eb] shadow-[0_40px_80px_-40px_rgba(26,22,18,0.45)]"
            initial={false}
            animate={{ opacity: 1 }}
          >
            <motion.div
              className="pointer-events-none absolute inset-0 z-[2] rounded-[12px] bg-[#0d0b09]"
              initial={{ opacity: reduceMotion ? 0 : 1 }}
              animate={{ opacity: lightsOn ? 0 : reduceMotion ? 0 : 0.88 }}
              transition={{ duration: reduceMotion ? 0 : 1.15, ease: [0.22, 1, 0.36, 1] }}
            />
            <div className="relative z-[1] grid grid-cols-1 lg:grid-cols-[1fr_min(380px,34%)]">
              <div className="min-w-0 p-3">
                <div
                  className="relative w-full"
                  role="img"
                  aria-label="Floor plan of the Maywood studio: office and factory with team members"
                >
                  <img
                    src="/assets/images/team-floorplan.png"
                    alt="Maywood Team"
                    className="block h-auto w-full object-contain"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 cursor-default" onClick={clearRoomSelection} role="presentation">
                    {teamMembers.map((person) => {
                      const isHot = hoveredId === person.id || selectedId === person.id
                      return (
                        <TeamFloorHotspotMarker
                          key={person.id}
                          person={person}
                          isHot={isHot}
                          lightsOn={lightsOn}
                          reduceMotion={reduceMotion}
                          onHover={(v) => setHoveredId(v ? person.id : null)}
                          onPick={() => selectPerson(person.id)}
                        />
                      )
                    })}
                  </div>
                </div>
              </div>

              <aside className="relative z-[3] flex min-h-[420px] flex-col border-t border-[#d9d0c4] bg-[#fbf9f5] lg:border-l lg:border-t-0">
                <div className="flex flex-1 flex-col justify-center px-6 py-8 lg:px-8">
                  <AnimatePresence mode="wait">
                    {activePerson ? (
                      <motion.div
                        key={activePerson.id}
                        initial={reduceMotion ? false : { opacity: 0, x: 28 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={reduceMotion ? undefined : { opacity: 0, x: 16 }}
                        transition={{ duration: reduceMotion ? 0 : 0.45, ease: [0.22, 1, 0.36, 1] }}
                        className="flex flex-col items-center text-center"
                      >
                        <img
                          src={AVATAR_BY_MEMBER_ID[activePerson.id]}
                          alt={activePerson.name}
                          className="h-[120px] w-[120px] shrink-0 rounded-full border-[3px] border-[#B8965A] object-cover object-[center_top]"
                        />
                        <h3 className="mt-6 font-display text-[28px] font-light leading-tight text-[#B8965A]">
                          {activePerson.name}
                        </h3>
                        <p className="mt-2 font-body text-[11px] font-semibold uppercase tracking-[0.16em] text-brand-charcoal">
                          {activePerson.role}
                        </p>
                        <span className="mt-3 inline-block rounded-full border border-[#B8965A]/40 bg-[#B8965A]/10 px-3 py-1 font-body text-[9px] font-semibold uppercase tracking-[0.12em] text-[#6B4E0F]">
                          {activePerson.department}
                        </span>
                        <p className="mt-6 max-w-sm font-body text-[14px] font-normal italic leading-relaxed text-brand-mist">
                          &ldquo;{activePerson.quote}&rdquo;
                        </p>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="empty"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex flex-col items-center justify-center text-center"
                      >
                        <svg
                          className="h-14 w-14 text-[#B8965A]/55"
                          viewBox="0 0 48 48"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          aria-hidden
                        >
                          <circle cx="16" cy="18" r="6" stroke="currentColor" strokeWidth="1.5" />
                          <path
                            d="M8 38c0-6 5.4-10 12-10s12 4 12 10"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                          />
                          <circle cx="32" cy="17" r="5" stroke="currentColor" strokeWidth="1.5" />
                          <path
                            d="M26 36c1.2-4.5 4.8-7.5 9-8.2"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                          />
                        </svg>
                        <p className="mt-6 max-w-[240px] font-body text-[14px] font-normal leading-relaxed text-[#B8965A]/65">
                          Hover over a team member to meet them
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </aside>
            </div>
          </motion.div>
        </div>

        {/* Mobile: department accordion + stats (< md) */}
        <div className="mt-12 md:hidden">
          <div className="space-y-0">
            {MOBILE_DEPT_ACCORDION.map((dept) => {
              const expanded = mobileOpenDeptKey === dept.key
              const people = teamMembers.filter((p) => p.department === dept.label)
              return (
                <div key={dept.key}>
                  <button
                    type="button"
                    onClick={() => setMobileOpenDeptKey(expanded ? null : dept.key)}
                    className="flex w-full items-center justify-between gap-3 border-b border-[rgba(184,150,90,0.35)] py-4 text-left"
                    aria-expanded={expanded}
                  >
                    <span className="font-body text-[12px] font-semibold uppercase tracking-[0.16em] text-[#B8965A]">
                      {dept.label}
                    </span>
                    <ChevronDown
                      className={[
                        'h-5 w-5 shrink-0 text-[#B8965A] transition-transform duration-300',
                        expanded ? 'rotate-180' : '',
                      ].join(' ')}
                      strokeWidth={1.75}
                      aria-hidden
                    />
                  </button>
                  <AnimatePresence initial={false}>
                    {expanded ? (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: reduceMotion ? 0 : 0.32, ease: [0.22, 1, 0.36, 1] }}
                        className="overflow-hidden"
                      >
                        <div className="flex gap-3 overflow-x-auto pb-5 pt-1 [-webkit-overflow-scrolling:touch]">
                          {people.map((person) => (
                            <button
                              key={person.id}
                              type="button"
                              onClick={() => setSheetPerson(person)}
                              className="flex w-[140px] shrink-0 flex-col items-center text-center focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B8965A] focus-visible:ring-offset-2"
                            >
                              <img
                                src={AVATAR_BY_MEMBER_ID[person.id]}
                                alt={person.name}
                                className="h-20 w-20 rounded-full border-2 border-[#B8965A] object-cover object-[center_top]"
                              />
                              <span className="mt-3 font-body text-[13px] font-bold leading-snug text-brand-charcoal">
                                {person.name}
                              </span>
                              <span className="mt-1 font-body text-[11px] font-semibold uppercase leading-snug tracking-[0.1em] text-[#B8965A]">
                                {person.role}
                              </span>
                            </button>
                          ))}
                        </div>
                      </motion.div>
                    ) : null}
                  </AnimatePresence>
                </div>
              )
            })}
          </div>

          <div className="mt-10 rounded-sm bg-[#1a1612] px-5 py-10">
            <div className="grid grid-cols-2 gap-8">
              {TEAM_STATS_MOBILE.map(({ value, label }) => (
                <div key={label} className="text-center">
                  <p className="font-display text-[clamp(36px,10vw,48px)] font-light leading-none text-[#B8965A]">
                    {value}
                  </p>
                  <p className="mt-3 font-body text-[10px] font-medium uppercase tracking-[0.16em] text-brand-mist-light">
                    {label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <AnimatePresence>
          {sheetPerson ? (
            <>
              <motion.button
                type="button"
                key="sheet-overlay"
                className="fixed inset-0 z-[60] cursor-default border-0 bg-black/50 p-0"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: reduceMotion ? 0 : 0.25 }}
                aria-label="Close profile"
                onClick={closeSheet}
              />
              <motion.div
                key="sheet"
                role="dialog"
                aria-modal="true"
                aria-labelledby="team-sheet-title"
                className="fixed bottom-0 left-0 right-0 z-[61] flex max-h-[60vh] flex-col rounded-t-[20px] bg-[#f5f0eb] px-6 pb-8 pt-3 shadow-[0_-12px_40px_rgba(0,0,0,0.18)]"
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                transition={{ type: 'tween', duration: reduceMotion ? 0 : 0.36, ease: [0.22, 1, 0.36, 1] }}
                drag="y"
                dragConstraints={{ top: 0, bottom: 120 }}
                dragElastic={0.15}
                onDragEnd={(_, info) => {
                  if (info.offset.y > 72 || info.velocity.y > 450) closeSheet()
                }}
              >
                <div className="mx-auto mb-2 h-1.5 w-10 shrink-0 rounded-full bg-brand-charcoal/15" aria-hidden />
                <div className="relative min-h-0 flex-1 overflow-y-auto overscroll-contain py-8">
                  <button
                    type="button"
                    onClick={closeSheet}
                    className="absolute right-0 top-2 rounded p-1 text-brand-mist hover:text-brand-charcoal focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B8965A]"
                    aria-label="Close"
                  >
                    <X className="h-5 w-5" strokeWidth={1.5} />
                  </button>
                  <div className="flex flex-col items-center px-2 text-center">
                    <img
                      src={AVATAR_BY_MEMBER_ID[sheetPerson.id]}
                      alt={sheetPerson.name}
                      className="h-[100px] w-[100px] shrink-0 rounded-full border-[3px] border-[#B8965A] object-cover object-[center_top]"
                    />
                    <h3
                      id="team-sheet-title"
                      className="mt-5 font-display text-[26px] font-light leading-tight text-[#B8965A]"
                    >
                      {sheetPerson.name}
                    </h3>
                    <p className="mt-2 font-body text-[11px] font-semibold uppercase tracking-[0.16em] text-brand-charcoal">
                      {sheetPerson.role}
                    </p>
                    <span className="mt-3 inline-block rounded-full border border-[#B8965A]/40 bg-[#B8965A]/10 px-3 py-1 font-body text-[9px] font-semibold uppercase tracking-[0.12em] text-[#6B4E0F]">
                      {sheetPerson.department}
                    </span>
                    <p className="mt-6 max-w-md border-l-2 border-[#B8965A] pl-4 text-left font-body text-[14px] font-normal italic leading-relaxed text-brand-mist">
                      &ldquo;{sheetPerson.quote}&rdquo;
                    </p>
                  </div>
                </div>
              </motion.div>
            </>
          ) : null}
        </AnimatePresence>

      </div>
    </section>
  )
}
