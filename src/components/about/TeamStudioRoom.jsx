import { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react'
import { ChevronDown, X } from 'lucide-react'
import {
  AnimatePresence,
  motion,
  useInView,
  useReducedMotion,
} from 'framer-motion'

/** @typedef {'director' | 'designer' | 'operations' | 'crm' | 'factory'} TeamPose */
/** @typedef {'leadership' | 'design' | 'operations' | 'crm' | 'factory'} MobileDept */

/**
 * @typedef {'directors' | 'design' | 'operations' | 'factory' | 'lounge'} StudioZone
 */

/**
 * @typedef {Object} StudioPerson
 * @property {string} id
 * @property {string} name
 * @property {string} role
 * @property {string} deptLabel
 * @property {MobileDept} mobileDept
 * @property {StudioZone} zone
 * @property {string} quote
 * @property {TeamPose} pose
 * @property {string} decor
 * @property {number} x — local SVG x (zone viewBox units)
 * @property {number} y — local SVG y (feet position)
 * @property {number} walkDelay
 * @property {string} avatarSrc — panel photo only (floor plan uses silhouette)
 */

/** @type {StudioPerson[]} */
const STUDIO_TEAM = [
  {
    id: 'priyanka',
    name: 'Priyanka Ram Pujari',
    role: 'Director',
    deptLabel: 'Leadership',
    mobileDept: 'leadership',
    zone: 'directors',
    quote: 'Every space has a story. We just help tell it.',
    pose: 'director',
    decor: 'Potted brass planter — calm authority.',
    x: 56,
    y: 170,
    walkDelay: 0.05,
    avatarSrc: '/assets/images/team/priyanka-ram-pujari.jpg',
  },
  {
    id: 'vibhav',
    name: 'Vibhav Kashyap',
    role: 'Director',
    deptLabel: 'Leadership',
    mobileDept: 'leadership',
    zone: 'directors',
    quote: 'Design is 10% inspiration, 90% execution.',
    pose: 'director',
    decor: 'Leather-bound studio library spine.',
    x: 100,
    y: 174,
    walkDelay: 0.12,
    avatarSrc: '/assets/images/team/vibhav-kashyap.jpg',
  },
  {
    id: 'chethana',
    name: 'Chethana Rajshekhar',
    role: 'Director – Business Development',
    deptLabel: 'Leadership',
    mobileDept: 'leadership',
    zone: 'directors',
    quote: 'The best clients become our biggest advocates.',
    pose: 'director',
    decor: "Warm lamplight over the directors' desk.",
    x: 144,
    y: 170,
    walkDelay: 0.18,
    avatarSrc: '/assets/images/team/chethana-rajshekhar.jpg',
  },
  {
    id: 'sushma',
    name: 'Sushma K J',
    role: 'Designs Manager',
    deptLabel: 'Design',
    mobileDept: 'design',
    zone: 'design',
    quote: 'I design spaces people never want to leave.',
    pose: 'designer',
    decor: 'Folded blueprint corner and material chip.',
    x: 72,
    y: 166,
    walkDelay: 0.22,
    avatarSrc: '/assets/images/team/sushma-kj.jpg',
  },
  {
    id: 'aashik',
    name: 'Aashik Varma',
    role: 'Junior Designer',
    deptLabel: 'Design',
    mobileDept: 'design',
    zone: 'design',
    quote: "Every line I draw becomes someone's wall.",
    pose: 'designerScreen',
    decor: 'Mood-board pins and a calibrated screen glow.',
    x: 154,
    y: 158,
    walkDelay: 0.28,
    avatarSrc: '/assets/images/team/aashik-varma.jpg',
  },
  {
    id: 'arbeen',
    name: 'Arbeen Taj',
    role: 'AM COO',
    deptLabel: 'Operations & Management',
    mobileDept: 'operations',
    zone: 'operations',
    quote: "If it's not on the timeline, it's not happening.",
    pose: 'operations',
    decor: 'Timeline strip and status LEDs.',
    x: 50,
    y: 96,
    walkDelay: 0.14,
    avatarSrc: '/assets/images/team/arbeen-taj.jpg',
  },
  {
    id: 'mithra',
    name: 'Mithravinda VN',
    role: 'Operations Manager',
    deptLabel: 'Operations & Management',
    mobileDept: 'operations',
    zone: 'operations',
    quote: 'Operations is invisible when it works perfectly.',
    pose: 'operations',
    decor: 'Whiteboard grid — everything accounted for.',
    x: 150,
    y: 96,
    walkDelay: 0.2,
    avatarSrc: '/assets/images/team/mithravinda-vn.jpg',
  },
  {
    id: 'shravan',
    name: 'Shravan K Pujari',
    role: 'Projects Manager',
    deptLabel: 'Operations & Management',
    mobileDept: 'operations',
    zone: 'operations',
    quote: 'A project delivered on time is a project delivered with respect.',
    pose: 'operations',
    decor: 'Dual monitors, crisp cable trays.',
    x: 100,
    y: 168,
    walkDelay: 0.26,
    avatarSrc: '/assets/images/team/shravan-k-pujari.jpg',
  },
  {
    id: 'swathi',
    name: 'Swathi P',
    role: 'CRM Associate',
    deptLabel: 'CRM & Marketing',
    mobileDept: 'crm',
    zone: 'lounge',
    quote: "Happy clients don't just come back — they bring everyone they know.",
    pose: 'crm',
    decor: 'Soft lounge chair and client folio.',
    x: 54,
    y: 172,
    walkDelay: 0.3,
    avatarSrc: '/assets/images/team/swathi-p.jpg',
  },
  {
    id: 'lakshmi',
    name: 'Lakshmi KS',
    role: 'CRM Associate',
    deptLabel: 'CRM & Marketing',
    mobileDept: 'crm',
    zone: 'lounge',
    quote: "I'm the voice between the client's dream and our team's execution.",
    pose: 'crm',
    decor: 'Ceramic coffee set on oak.',
    x: 100,
    y: 108,
    walkDelay: 0.34,
    avatarSrc: '/assets/images/team/lakshmi-ks.jpg',
  },
  {
    id: 'nikhil',
    name: 'Nikhil Y',
    role: 'Social Media Associate',
    deptLabel: 'CRM & Marketing',
    mobileDept: 'crm',
    zone: 'lounge',
    quote: "If it's not on Instagram, did it even happen?",
    pose: 'crm',
    decor: 'Ring light halo — content, captured.',
    x: 146,
    y: 172,
    walkDelay: 0.38,
    avatarSrc: '/assets/images/team/nikhil-y.jpg',
  },
  {
    id: 'sankar',
    name: 'Sankar Jana',
    role: 'Production Manager',
    deptLabel: 'Factory & Production',
    mobileDept: 'factory',
    zone: 'factory',
    quote: 'The factory never lies — quality shows in every joint.',
    pose: 'factory',
    decor: 'Production clipboard and stopwatch.',
    x: 52,
    y: 108,
    walkDelay: 0.16,
    avatarSrc: '/assets/images/team/sankar-jana.jpg',
  },
  {
    id: 'dipankar',
    name: 'Dipankar Giri',
    role: 'Senior Machine Operator',
    deptLabel: 'Factory & Production',
    mobileDept: 'factory',
    zone: 'factory',
    quote: "Precision isn't a skill here. It's a habit.",
    pose: 'factoryTool',
    decor: 'Calibrated machine readout.',
    x: 118,
    y: 92,
    walkDelay: 0.24,
    avatarSrc: '/assets/images/team/dipankar-giri.jpg',
  },
  {
    id: 'amarnath',
    name: 'Amarnath Barai',
    role: 'Machine Operator',
    deptLabel: 'Factory & Production',
    mobileDept: 'factory',
    zone: 'factory',
    quote: 'The machine does the cutting. The craftsman does the thinking.',
    pose: 'factory',
    decor: 'Edge banding offcuts — proof of progress.',
    x: 200,
    y: 86,
    walkDelay: 0.32,
    avatarSrc: '/assets/images/team/amarnath-barai.jpg',
  },
  {
    id: 'sudip',
    name: 'Sudip',
    role: 'Factory Support Staff',
    deptLabel: 'Factory & Production',
    mobileDept: 'factory',
    zone: 'factory',
    quote: "No detail is too small when it's someone's home.",
    pose: 'factory',
    decor: 'Stacked material carts, ready to move.',
    x: 288,
    y: 102,
    walkDelay: 0.36,
    avatarSrc: '/assets/images/team/sudip.jpg',
  },
  {
    id: 'susanta',
    name: 'Susanta Midya',
    role: 'Senior Carpenter',
    deptLabel: 'Factory & Production',
    mobileDept: 'factory',
    zone: 'factory',
    quote: 'Wood has memory. A good carpenter respects that.',
    pose: 'factoryTool',
    decor: 'Hand plane silhouette — old craft, new spaces.',
    x: 200,
    y: 168,
    walkDelay: 0.4,
    avatarSrc: '/assets/images/team/susanta-midya.jpg',
  },
]

/** @type {{ key: string; label: string; zone: StudioZone }[]} */
const MOBILE_DEPT_ACCORDION = [
  { key: 'directors', label: "Directors' Corner", zone: 'directors' },
  { key: 'design', label: 'Design Studio', zone: 'design' },
  { key: 'operations', label: 'Operations Hub', zone: 'operations' },
  { key: 'lounge', label: 'Client Lounge', zone: 'lounge' },
  { key: 'factory', label: 'Factory Floor', zone: 'factory' },
]

const TEAM_STATS_MOBILE = [
  { value: '16', label: 'Team Members' },
  { value: '4', label: 'Departments' },
  { value: '9', label: 'Years' },
  { value: '1', label: 'Vision' },
]

const TICKER_TEXT =
  '16 TEAM MEMBERS • 4 DEPARTMENTS • 9 YEARS • 500+ PROJECTS DELIVERED • 1 SHARED VISION •'

const ROOM_COLORS = {
  floor: '#f5f0eb',
  wall: '#ede8e0',
  furniture: '#6B4226',
  furnitureLight: '#8B5A3C',
  gold: '#B8965A',
  concrete: '#8B8B8B',
  concreteDark: '#6e6e6e',
  silhouette: '#2D2D2D',
  panel: '#fbf9f5',
}

function Silhouette({ pose, active }) {
  const fill = active ? ROOM_COLORS.gold : ROOM_COLORS.silhouette

  switch (pose) {
    case 'director':
      return (
        <g fill={fill}>
          <circle cx="14" cy="7" r="5.5" />
          <path d="M8 14c0-1 1-2 6-2s6 1 6 2l2 14H6l2-14z" opacity="0.98" />
          <path d="M18 14l10-6 1.5 3.5L19 17z" />
          <ellipse cx="14" cy="30" rx="9" ry="3.5" />
        </g>
      )
    case 'designer':
      return (
        <g fill={fill}>
          <circle cx="14" cy="8" r="5" />
          <path d="M10 13l8 2 6-8 2 2-7 12H7l-1-6 4-2z" />
          <path d="M6 28h16v3H6z" opacity="0.85" />
        </g>
      )
    case 'designerScreen':
      return (
        <g fill={fill}>
          <rect x="20" y="4" width="10" height="18" rx="1" opacity="0.35" />
          <circle cx="12" cy="9" r="5" />
          <path d="M8 15l4 2 2 12H6l-2-8 4-6z" />
          <rect x="4" y="28" width="20" height="3" rx="1" opacity="0.8" />
        </g>
      )
    case 'operations':
      return (
        <g fill={fill}>
          <circle cx="14" cy="8" r="5" />
          <path d="M10 14h8l1 16H9l1-16z" />
          <path d="M22 6h12v14H22V6z" opacity="0.4" />
          <path d="M9 30h10v3H9z" opacity="0.9" />
        </g>
      )
    case 'crm':
      return (
        <g fill={fill}>
          <circle cx="14" cy="8" r="5" />
          <path d="M9 14h10l1 14H8l1-14z" />
          <path
            d="M3 10c2-4 6-4 8-2"
            fill="none"
            stroke={fill}
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          <ellipse cx="14" cy="30" rx="10" ry="3.5" />
        </g>
      )
    case 'factoryTool':
      return (
        <g fill={fill}>
          <circle cx="14" cy="8" r="5" />
          <path d="M10 14h8l1 17H9l1-17z" />
          <path d="M22 18l8 2v8l-8-3v-7z" opacity="0.9" />
          <rect x="8" y="31" width="12" height="2.5" rx="0.5" />
        </g>
      )
    case 'factory':
    default:
      return (
        <g fill={fill}>
          <circle cx="14" cy="8" r="5" />
          <path d="M10 14h8l1 17H9l1-17z" />
          <path d="M7 31h14v3H7z" opacity="0.85" />
        </g>
      )
  }
}

function GoldGlowFilter({ id }) {
  return (
    <filter id={id} x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="2.2" result="b" />
      <feMerge>
        <feMergeNode in="b" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>
  )
}

/**
 * @param {{
 *   label: string
 *   zoneClassName?: string
 *   cellClassName?: string
 *   viewBox: string
 *   glowId: string
 *   zone: StudioZone
 *   lightsOn: boolean
 *   reduceMotion: boolean | null
 *   hoveredId: string | null
 *   selectedId: string | null
 *   setHoveredId: (id: string | null) => void
 *   selectPerson: (id: string) => void
 *   clearRoomSelection: () => void
 *   children?: import('react').ReactNode
 * }} props
 */
function RoomZoneCell({
  label,
  zoneClassName = '',
  cellClassName = '',
  viewBox,
  glowId,
  zone,
  lightsOn,
  reduceMotion,
  hoveredId,
  selectedId,
  setHoveredId,
  selectPerson,
  clearRoomSelection,
  children,
}) {
  const people = STUDIO_TEAM.filter((p) => p.zone === zone)
  return (
    <div
      className={[
        'relative flex min-h-[280px] flex-col border border-[rgba(184,150,90,0.2)] p-6',
        zoneClassName,
        cellClassName,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <p className="relative z-[2] mb-2 shrink-0 font-body text-[11px] font-semibold uppercase tracking-[0.14em] text-[#B8965A]">
        {label}
      </p>
      <svg
        viewBox={viewBox}
        className="relative z-[1] h-full min-h-[200px] w-full flex-1 touch-manipulation"
        preserveAspectRatio="xMidYMid meet"
        role="presentation"
        onClick={clearRoomSelection}
      >
        <defs>
          <GoldGlowFilter id={glowId} />
        </defs>
        {children}
        {people.map((person) => {
          const isHot = hoveredId === person.id || selectedId === person.id
          return (
            <StudioPersonMarker
              key={person.id}
              person={person}
              isHot={isHot}
              lightsOn={lightsOn}
              reduceMotion={reduceMotion}
              filterId={glowId}
              onHover={(v) => setHoveredId(v ? person.id : null)}
              onPick={() => selectPerson(person.id)}
            />
          )
        })}
      </svg>
    </div>
  )
}

export default function TeamStudioRoom() {
  const reduceMotion = useReducedMotion()
  const sectionRef = useRef(null)
  const inView = useInView(sectionRef, { amount: 0.2, once: true })
  const [lightsOn, setLightsOn] = useState(false)
  const [hoveredId, setHoveredId] = useState(null)
  const [selectedId, setSelectedId] = useState(null)
  const [mobileOpenDeptKey, setMobileOpenDeptKey] = useState(/** @type {string | null} */ ('directors'))
  const [sheetPerson, setSheetPerson] = useState(/** @type {StudioPerson | null} */ (null))
  const titleId = useId()
  const rootId = useId().replace(/:/g, '')
  const glow = useMemo(
    () => ({
      directors: `${rootId}-g-dir`,
      design: `${rootId}-g-des`,
      operations: `${rootId}-g-ops`,
      factory: `${rootId}-g-fab`,
      lounge: `${rootId}-g-lng`,
    }),
    [rootId],
  )

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
    return STUDIO_TEAM.find((p) => p.id === id) ?? null
  }, [hoveredId, selectedId])

  const selectPerson = useCallback((id) => {
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
        <p className="font-body text-[11px] font-semibold uppercase tracking-[0.2em] text-[#8B6914]">
          The Room They Built
        </p>
        <p className="mt-3 font-body text-[11px] font-semibold uppercase tracking-[0.18em] text-brand-mist">
          OUR TEAM
        </p>
        <h2
          id={titleId}
          className="mt-4 max-w-[920px] font-display text-[clamp(30px,4vw,52px)] font-light leading-[1.06] text-brand-charcoal"
        >
          The people behind every space.
        </h2>
        <p className="mt-4 max-w-[640px] font-body text-[15px] font-normal leading-relaxed text-brand-mist">
          Designers, builders, managers and creators — every Maywood project is touched by this team.
        </p>
        <motion.p
          className="mt-3 max-w-[640px] font-display text-[18px] font-light italic text-[#8B6914] lg:text-[20px]"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: lightsOn ? 1 : 0, y: lightsOn ? 0 : 8 }}
          transition={{ duration: reduceMotion ? 0 : 0.7, delay: reduceMotion ? 0 : 0.35, ease: [0.22, 1, 0.36, 1] }}
        >
          Step inside the Maywood studio.
        </motion.p>

        {/* Tablet + desktop: interactive room (desktop grid unchanged at lg+) */}
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
                {/* Tablet 768–1023: 2-column floor plan */}
                <div
                  className="grid grid-cols-2 gap-3 lg:hidden"
                  role="img"
                  aria-label="Floor plan of the Maywood studio: five zones with team members"
                >
                  <RoomZoneCell
                    label="Directors' Corner"
                    cellClassName="col-span-2"
                    zoneClassName="bg-[#f5f0eb]"
                    viewBox="0 0 200 200"
                    glowId={glow.directors}
                    zone="directors"
                    lightsOn={lightsOn}
                    reduceMotion={reduceMotion}
                    hoveredId={hoveredId}
                    selectedId={selectedId}
                    setHoveredId={setHoveredId}
                    selectPerson={selectPerson}
                    clearRoomSelection={clearRoomSelection}
                  >
                    <rect width="200" height="200" fill={ROOM_COLORS.floor} />
                    <circle cx="34" cy="46" r="14" fill={ROOM_COLORS.furniture} opacity="0.22" />
                    <rect x="146" y="36" width="38" height="92" rx="2" fill={ROOM_COLORS.furnitureLight} opacity="0.38" />
                    <rect x="38" y="116" width="124" height="36" rx="3" fill={ROOM_COLORS.furniture} opacity="0.5" />
                  </RoomZoneCell>

                  <RoomZoneCell
                    label="Design Studio"
                    zoneClassName="bg-[#f5f0eb]"
                    viewBox="0 0 200 200"
                    glowId={glow.design}
                    zone="design"
                    lightsOn={lightsOn}
                    reduceMotion={reduceMotion}
                    hoveredId={hoveredId}
                    selectedId={selectedId}
                    setHoveredId={setHoveredId}
                    selectPerson={selectPerson}
                    clearRoomSelection={clearRoomSelection}
                  >
                    <rect width="200" height="200" fill={ROOM_COLORS.floor} />
                    <rect x="136" y="40" width="46" height="56" rx="2" fill={ROOM_COLORS.furniture} opacity="0.35" />
                    <rect x="32" y="104" width="136" height="44" rx="2" fill={ROOM_COLORS.furniture} opacity="0.42" />
                    <rect x="46" y="114" width="36" height="22" rx="1" fill={ROOM_COLORS.gold} opacity="0.18" />
                    <rect x="92" y="112" width="40" height="20" rx="1" fill="#2D6A6A" opacity="0.16" />
                  </RoomZoneCell>

                  <RoomZoneCell
                    label="Operations Hub"
                    zoneClassName="bg-[#f5f0eb]"
                    viewBox="0 0 200 200"
                    glowId={glow.operations}
                    zone="operations"
                    lightsOn={lightsOn}
                    reduceMotion={reduceMotion}
                    hoveredId={hoveredId}
                    selectedId={selectedId}
                    setHoveredId={setHoveredId}
                    selectPerson={selectPerson}
                    clearRoomSelection={clearRoomSelection}
                  >
                    <rect width="200" height="200" fill={ROOM_COLORS.floor} />
                    <rect x="20" y="38" width="62" height="36" rx="2" fill={ROOM_COLORS.furniture} opacity="0.45" />
                    <rect x="118" y="38" width="62" height="36" rx="2" fill={ROOM_COLORS.furniture} opacity="0.45" />
                    <rect x="26" y="90" width="148" height="10" rx="2" fill={ROOM_COLORS.furnitureLight} opacity="0.4" />
                  </RoomZoneCell>

                  <RoomZoneCell
                    label="Factory Floor"
                    zoneClassName="bg-[#d6d6d4]"
                    viewBox="0 0 400 200"
                    glowId={glow.factory}
                    zone="factory"
                    lightsOn={lightsOn}
                    reduceMotion={reduceMotion}
                    hoveredId={hoveredId}
                    selectedId={selectedId}
                    setHoveredId={setHoveredId}
                    selectPerson={selectPerson}
                    clearRoomSelection={clearRoomSelection}
                  >
                    <rect width="400" height="200" fill={ROOM_COLORS.concrete} opacity="0.35" />
                    <path
                      d="M0 0 H400 V200 H0 Z"
                      fill="none"
                      stroke={ROOM_COLORS.concreteDark}
                      strokeWidth="1.5"
                      strokeDasharray="5 5"
                      opacity="0.35"
                    />
                    <rect x="24" y="36" width="108" height="30" rx="2" fill={ROOM_COLORS.furniture} opacity="0.4" />
                    <rect x="268" y="36" width="108" height="30" rx="2" fill={ROOM_COLORS.furniture} opacity="0.4" />
                    <rect x="176" y="34" width="48" height="34" rx="2" fill={ROOM_COLORS.furnitureLight} opacity="0.42" />
                    <rect x="118" y="118" width="164" height="22" rx="2" fill={ROOM_COLORS.furniture} opacity="0.36" />
                  </RoomZoneCell>

                  <RoomZoneCell
                    label="Client Lounge"
                    zoneClassName="bg-[#ede8e0]"
                    viewBox="0 0 200 200"
                    glowId={glow.lounge}
                    zone="lounge"
                    lightsOn={lightsOn}
                    reduceMotion={reduceMotion}
                    hoveredId={hoveredId}
                    selectedId={selectedId}
                    setHoveredId={setHoveredId}
                    selectPerson={selectPerson}
                    clearRoomSelection={clearRoomSelection}
                  >
                    <rect width="200" height="200" fill={ROOM_COLORS.wall} opacity="0.45" />
                    <ellipse cx="56" cy="156" rx="34" ry="18" fill={ROOM_COLORS.furniture} opacity="0.3" />
                    <ellipse cx="144" cy="156" rx="34" ry="18" fill={ROOM_COLORS.furniture} opacity="0.3" />
                    <rect x="86" y="122" width="28" height="18" rx="2" fill={ROOM_COLORS.furnitureLight} opacity="0.38" />
                  </RoomZoneCell>
                </div>

                {/* Desktop 1024+: original 3-column grid */}
                <div
                  className="hidden min-h-0 grid-cols-3 grid-rows-[minmax(280px,auto)_minmax(280px,auto)] gap-3 lg:grid"
                  role="img"
                  aria-label="Floor plan of the Maywood studio: five zones with team members"
                >
                  <RoomZoneCell
                    label="Directors' Corner"
                    zoneClassName="bg-[#f5f0eb]"
                    viewBox="0 0 200 200"
                    glowId={glow.directors}
                    zone="directors"
                    lightsOn={lightsOn}
                    reduceMotion={reduceMotion}
                    hoveredId={hoveredId}
                    selectedId={selectedId}
                    setHoveredId={setHoveredId}
                    selectPerson={selectPerson}
                    clearRoomSelection={clearRoomSelection}
                  >
                    <rect width="200" height="200" fill={ROOM_COLORS.floor} />
                    <circle cx="34" cy="46" r="14" fill={ROOM_COLORS.furniture} opacity="0.22" />
                    <rect x="146" y="36" width="38" height="92" rx="2" fill={ROOM_COLORS.furnitureLight} opacity="0.38" />
                    <rect x="38" y="116" width="124" height="36" rx="3" fill={ROOM_COLORS.furniture} opacity="0.5" />
                  </RoomZoneCell>

                  <RoomZoneCell
                    label="Design Studio"
                    zoneClassName="bg-[#f5f0eb]"
                    viewBox="0 0 200 200"
                    glowId={glow.design}
                    zone="design"
                    lightsOn={lightsOn}
                    reduceMotion={reduceMotion}
                    hoveredId={hoveredId}
                    selectedId={selectedId}
                    setHoveredId={setHoveredId}
                    selectPerson={selectPerson}
                    clearRoomSelection={clearRoomSelection}
                  >
                    <rect width="200" height="200" fill={ROOM_COLORS.floor} />
                    <rect x="136" y="40" width="46" height="56" rx="2" fill={ROOM_COLORS.furniture} opacity="0.35" />
                    <rect x="32" y="104" width="136" height="44" rx="2" fill={ROOM_COLORS.furniture} opacity="0.42" />
                    <rect x="46" y="114" width="36" height="22" rx="1" fill={ROOM_COLORS.gold} opacity="0.18" />
                    <rect x="92" y="112" width="40" height="20" rx="1" fill="#2D6A6A" opacity="0.16" />
                  </RoomZoneCell>

                  <RoomZoneCell
                    label="Operations Hub"
                    zoneClassName="bg-[#f5f0eb]"
                    viewBox="0 0 200 200"
                    glowId={glow.operations}
                    zone="operations"
                    lightsOn={lightsOn}
                    reduceMotion={reduceMotion}
                    hoveredId={hoveredId}
                    selectedId={selectedId}
                    setHoveredId={setHoveredId}
                    selectPerson={selectPerson}
                    clearRoomSelection={clearRoomSelection}
                  >
                    <rect width="200" height="200" fill={ROOM_COLORS.floor} />
                    <rect x="20" y="38" width="62" height="36" rx="2" fill={ROOM_COLORS.furniture} opacity="0.45" />
                    <rect x="118" y="38" width="62" height="36" rx="2" fill={ROOM_COLORS.furniture} opacity="0.45" />
                    <rect x="26" y="90" width="148" height="10" rx="2" fill={ROOM_COLORS.furnitureLight} opacity="0.4" />
                  </RoomZoneCell>

                  <RoomZoneCell
                    label="Factory Floor"
                    cellClassName="col-span-2"
                    zoneClassName="bg-[#d6d6d4]"
                    viewBox="0 0 400 200"
                    glowId={glow.factory}
                    zone="factory"
                    lightsOn={lightsOn}
                    reduceMotion={reduceMotion}
                    hoveredId={hoveredId}
                    selectedId={selectedId}
                    setHoveredId={setHoveredId}
                    selectPerson={selectPerson}
                    clearRoomSelection={clearRoomSelection}
                  >
                    <rect width="400" height="200" fill={ROOM_COLORS.concrete} opacity="0.35" />
                    <path
                      d="M0 0 H400 V200 H0 Z"
                      fill="none"
                      stroke={ROOM_COLORS.concreteDark}
                      strokeWidth="1.5"
                      strokeDasharray="5 5"
                      opacity="0.35"
                    />
                    <rect x="24" y="36" width="108" height="30" rx="2" fill={ROOM_COLORS.furniture} opacity="0.4" />
                    <rect x="268" y="36" width="108" height="30" rx="2" fill={ROOM_COLORS.furniture} opacity="0.4" />
                    <rect x="176" y="34" width="48" height="34" rx="2" fill={ROOM_COLORS.furnitureLight} opacity="0.42" />
                    <rect x="118" y="118" width="164" height="22" rx="2" fill={ROOM_COLORS.furniture} opacity="0.36" />
                  </RoomZoneCell>

                  <RoomZoneCell
                    label="Client Lounge"
                    zoneClassName="bg-[#ede8e0]"
                    viewBox="0 0 200 200"
                    glowId={glow.lounge}
                    zone="lounge"
                    lightsOn={lightsOn}
                    reduceMotion={reduceMotion}
                    hoveredId={hoveredId}
                    selectedId={selectedId}
                    setHoveredId={setHoveredId}
                    selectPerson={selectPerson}
                    clearRoomSelection={clearRoomSelection}
                  >
                    <rect width="200" height="200" fill={ROOM_COLORS.wall} opacity="0.45" />
                    <ellipse cx="56" cy="156" rx="34" ry="18" fill={ROOM_COLORS.furniture} opacity="0.3" />
                    <ellipse cx="144" cy="156" rx="34" ry="18" fill={ROOM_COLORS.furniture} opacity="0.3" />
                    <rect x="86" y="122" width="28" height="18" rx="2" fill={ROOM_COLORS.furnitureLight} opacity="0.38" />
                  </RoomZoneCell>
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
                          src={activePerson.avatarSrc}
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
                          {activePerson.deptLabel}
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
              const people = STUDIO_TEAM.filter((p) => p.zone === dept.zone)
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
                                src={person.avatarSrc}
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
                      src={sheetPerson.avatarSrc}
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
                      {sheetPerson.deptLabel}
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

        {/* Ticker */}
        <div className="relative mt-14 overflow-hidden rounded-sm bg-[#1a1612] py-4">
          {reduceMotion ? (
            <p className="px-6 text-center font-body text-[11px] font-semibold uppercase tracking-[0.2em] text-[#B8965A]">
              {TICKER_TEXT}
            </p>
          ) : (
            <div
              className="team-ticker-track font-body text-[11px] font-semibold uppercase tracking-[0.2em] text-[#B8965A]"
              aria-hidden
            >
              <span className="pr-12">{TICKER_TEXT}</span>
              <span className="pr-12">{TICKER_TEXT}</span>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

/**
 * @param {{
 *   person: StudioPerson
 *   isHot: boolean
 *   lightsOn: boolean
 *   reduceMotion: boolean | null
 *   filterId: string
 *   onHover: (v: boolean) => void
 *   onPick: () => void
 * }} props
 */
function StudioPersonMarker({ person, isHot, lightsOn, reduceMotion, filterId, onHover, onPick }) {
  const delay = person.walkDelay
  const walk = reduceMotion ? 0 : 40

  return (
    <g
      role="button"
      tabIndex={0}
      style={{ cursor: 'pointer' }}
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
    >
      <g transform={`translate(${person.x}, ${person.y})`}>
        <motion.g
          initial={reduceMotion ? false : { opacity: 0, y: walk }}
          animate={{
            opacity: lightsOn || reduceMotion ? 1 : 0,
            y: 0,
          }}
          transition={{
            delay: reduceMotion ? 0 : delay,
            duration: reduceMotion ? 0 : 0.65,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          <motion.circle
            cx="0"
            cy="-38"
            r={isHot ? 5.5 : 3.8}
            fill="#B8965A"
            filter={isHot ? `url(#${filterId})` : undefined}
            initial={false}
            animate={{
              scale: reduceMotion
                ? 1
                : !lightsOn
                  ? 1
                  : isHot
                    ? [1, 1.2, 1]
                    : [1, 1.35, 1],
            }}
            transition={
              reduceMotion || !lightsOn
                ? { duration: 0 }
                : isHot
                  ? { duration: 0.85, repeat: Infinity, ease: 'easeInOut' }
                  : {
                      delay: delay + 0.45,
                      duration: 0.55,
                      times: [0, 0.5, 1],
                      ease: 'easeInOut',
                    }
            }
          />
          <g transform="translate(-14, -22)">
            <Silhouette pose={person.pose} active={isHot} />
          </g>
          <circle cx="0" cy="0" r="22" fill="transparent" />
        </motion.g>
      </g>
    </g>
  )
}
