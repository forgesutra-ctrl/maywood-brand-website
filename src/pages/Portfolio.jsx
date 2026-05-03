import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import SectionLabel from '../components/ui/SectionLabel'
import AnimatedText from '../components/ui/AnimatedText'
import { buttonClasses } from '../lib/buttonStyles'
import { PORTFOLIO_UPDATED_EVENT } from '../utils/portfolioProjectsStore'
import { supabase } from '../utils/supabaseClient'
import { track } from '../utils/tracking'

const MotionLink = motion(Link)

const tapTransition = { type: 'tween', duration: 0.15, ease: [0.16, 1, 0.3, 1] }

const CATEGORIES = [
  'Kitchens',
  'Wardrobes',
  'TV Units',
  'Pooja Rooms',
  'Spas',
  'Cafes & Restaurants',
  'Offices',
]

/** Section DOM ids / pill activation keys */
const CATEGORY_SECTION_ID = {
  Kitchens: 'kitchens',
  Wardrobes: 'wardrobes',
  'TV Units': 'tv-units',
  'Pooja Rooms': 'pooja-rooms',
  Spas: 'spas',
  'Cafes & Restaurants': 'cafes-restaurants',
  Offices: 'offices',
}

const CONTENT_ANCHOR_ID = 'portfolio-directory'

/** @param {{ item: Record<string, unknown>; onOpen: () => void }} props */
function PortfolioImageCard({ item, onOpen }) {
  const src = typeof item.image_url === 'string' ? item.image_url : ''
  const title =
    typeof item.name === 'string' && item.name.trim().length > 0 ? item.name.trim() : 'Maywood Interiors'

  return (
    <button
      type="button"
      onClick={onOpen}
      className={[
        'group relative shrink-0 cursor-pointer overflow-hidden rounded-xl border-0 bg-transparent p-0 text-left',
        'w-[260px] sm:w-[320px]',
      ].join(' ')}
      style={{ aspectRatio: '4 / 3' }}
    >
      <div className="absolute inset-0 overflow-hidden rounded-xl bg-[#e8e4de]">
        <img
          src={src}
          alt=""
          loading="lazy"
          decoding="async"
          className="block h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          onError={(e) => {
            e.currentTarget.src = '/assets/images/fallback.jpg'
          }}
        />
        <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
            <span className="font-body text-[15px] font-medium text-white">{title}</span>
          </div>
        </div>
      </div>
    </button>
  )
}

/** @param {{ categoryLabel: string; items: Record<string, unknown>[]; onOpenLightbox: (categoryLabel: string, items: Record<string, unknown>[], index: number) => void }} props */
function CategoryCarousel({ categoryLabel, items, onOpenLightbox }) {
  const scrollerRef = useRef(/** @type {HTMLDivElement | null} */ (null))

  const scrollPrev = () => {
    scrollerRef.current?.scrollBy({ left: -340, behavior: 'smooth' })
  }
  const scrollNext = () => {
    scrollerRef.current?.scrollBy({ left: 340, behavior: 'smooth' })
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={scrollPrev}
        className="absolute left-0 top-1/2 z-[2] hidden h-10 w-10 -translate-x-4 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-lg hover:bg-neutral-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c9a465] md:flex"
        aria-label={`Previous ${categoryLabel} projects`}
      >
        <ChevronLeft className="h-5 w-5 text-[#1a1612]" strokeWidth={2} aria-hidden />
      </button>
      <button
        type="button"
        onClick={scrollNext}
        className="absolute right-0 top-1/2 z-[2] hidden h-10 w-10 translate-x-4 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-lg hover:bg-neutral-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c9a465] md:flex"
        aria-label={`Next ${categoryLabel} projects`}
      >
        <ChevronRight className="h-5 w-5 text-[#1a1612]" strokeWidth={2} aria-hidden />
      </button>
      <div
        ref={scrollerRef}
        className="flex gap-4 overflow-x-auto scroll-smooth pb-4 no-scrollbar"
      >
        {items.map((item, index) => (
          <PortfolioImageCard
            key={String(item.id ?? index)}
            item={item}
            onOpen={() => onOpenLightbox(categoryLabel, items, index)}
          />
        ))}
      </div>
    </div>
  )
}

function LoadingSkeletonRow() {
  return (
    <div className="flex gap-4 overflow-hidden pb-4">
      {[0, 1, 2].map((k) => (
        <div
          key={k}
          className="h-[240px] w-[260px] shrink-0 animate-pulse rounded-xl bg-[#e8e4de] sm:w-[320px]"
        />
      ))}
    </div>
  )
}

export default function Portfolio() {
  const [rows, setRows] = useState(/** @type {Record<string, unknown>[]} */ ([]))
  const [loading, setLoading] = useState(true)
  const [fetchError, setFetchError] = useState(/** @type {string | null} */ (null))
  const [activePillKey, setActivePillKey] = useState(/** @type {'all' | string } */ ('all'))
  const [lightbox, setLightbox] = useState(
    /** @type {{ categoryLabel: string; items: Record<string, unknown>[]; index: number } | null} */ (null),
  )

  const loadPortfolio = useCallback(async () => {
    setLoading(true)
    setFetchError(null)
    const { data, error } = await supabase
      .from('portfolio_projects')
      .select('*')
      .order('created_at', { ascending: false })
    if (error) {
      console.error('portfolio_projects:', error)
      setFetchError(error.message || 'Could not load portfolio.')
      setRows([])
      setLoading(false)
      return
    }
    const safe = (data || []).filter(
      (row) =>
        row &&
        typeof row.image_url === 'string' &&
        String(row.image_url).trim() !== '',
    )
    setRows(safe)
    setLoading(false)
  }, [])

  useEffect(() => {
    void loadPortfolio()
    const onPortfolio = () => {
      void loadPortfolio()
    }
    window.addEventListener(PORTFOLIO_UPDATED_EVENT, onPortfolio)
    const onVis = () => {
      if (document.visibilityState === 'visible') void loadPortfolio()
    }
    document.addEventListener('visibilitychange', onVis)
    return () => {
      window.removeEventListener(PORTFOLIO_UPDATED_EVENT, onPortfolio)
      document.removeEventListener('visibilitychange', onVis)
    }
  }, [loadPortfolio])

  const grouped = useMemo(() => {
    /** @type {Record<string, Record<string, unknown>[]>} */
    const next = {}
    CATEGORIES.forEach((cat) => {
      next[cat] = []
    })
    rows.forEach((item) => {
      const cat = typeof item.category === 'string' && item.category.trim() ? item.category.trim() : 'Other'
      if (next[cat]) next[cat].push(item)
    })
    return next
  }, [rows])

  const hasAnyDisplayed = useMemo(
    () => CATEGORIES.some((c) => (grouped[c]?.length ?? 0) > 0),
    [grouped],
  )

  const scrollToAnchor = useCallback((id) => {
    if (id === CONTENT_ANCHOR_ID) {
      document.getElementById(CONTENT_ANCHOR_ID)?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      })
      return
    }
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [])

  const onPillClick = useCallback(
    (key, domId) => {
      setActivePillKey(key)
      scrollToAnchor(domId)
    },
    [scrollToAnchor],
  )

  const openLightbox = useCallback((categoryLabel, items, index) => {
    setLightbox({ categoryLabel, items, index })
  }, [])

  const closeLightbox = useCallback(() => setLightbox(null), [])

  const lbItems = lightbox?.items ?? []
  const lbIndex =
    lightbox && lbItems.length
      ? Math.min(Math.max(0, lightbox.index), lbItems.length - 1)
      : 0
  const lbSrc =
    lightbox && lbItems[lbIndex] && typeof lbItems[lbIndex].image_url === 'string'
      ? lbItems[lbIndex].image_url
      : ''

  const goLbPrev = useCallback(() => {
    setLightbox((prev) => {
      if (!prev?.items?.length) return prev
      const n = prev.items.length
      return { ...prev, index: (prev.index - 1 + n) % n }
    })
  }, [])

  const goLbNext = useCallback(() => {
    setLightbox((prev) => {
      if (!prev?.items?.length) return prev
      const n = prev.items.length
      return { ...prev, index: (prev.index + 1) % n }
    })
  }, [])

  useEffect(() => {
    if (!lightbox) return
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prevOverflow
    }
  }, [lightbox])

  useEffect(() => {
    if (!lightbox || !lbItems.length) return
    const onKey = (e) => {
      if (e.key === 'Escape') closeLightbox()
      if (e.key === 'ArrowLeft') goLbPrev()
      if (e.key === 'ArrowRight') goLbNext()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [lightbox, lbItems.length, closeLightbox, goLbPrev, goLbNext])

  const pillBase =
    'shrink-0 rounded-full px-5 py-2 font-body text-xs font-medium uppercase tracking-wider transition-colors'
  const pillInactive = `${pillBase} border border-[#c9a465]/40 bg-transparent text-[#3a3530]`
  const pillActive = `${pillBase} border border-[#1a1612] bg-[#1a1612] text-white`

  return (
    <main className="flex-1">
      <section className="relative flex min-h-[52vh] flex-col justify-center overflow-hidden bg-brand-charcoal px-6 py-28 lg:min-h-[58vh] lg:px-24 lg:py-36">
        <div className="relative z-[1] mx-auto w-full max-w-[1400px]">
          <SectionLabel light>Our Work</SectionLabel>
          <AnimatedText
            text="Spaces we've built."
            tag="h1"
            getWordClassName={(_w, i, n) => (i >= n - 1 ? 'italic text-[#D4B483]' : '')}
            className="mt-8 max-w-[900px] font-display text-[clamp(36px,6vw,58px)] font-light leading-[1.06] text-brand-ivory"
          />
        </div>
      </section>

      <nav
        className="sticky top-[64px] z-10 flex gap-3 overflow-x-auto border-b border-[#c9a465]/20 bg-[#faf9f7]/90 px-6 py-4 backdrop-blur-sm no-scrollbar"
        aria-label="Portfolio categories"
      >
        <button
          type="button"
          onClick={() => onPillClick('all', CONTENT_ANCHOR_ID)}
          className={activePillKey === 'all' ? pillActive : pillInactive}
        >
          All
        </button>
        {CATEGORIES.map((cat) => {
          const slug = CATEGORY_SECTION_ID[cat]
          return (
            <button
              key={cat}
              type="button"
              onClick={() => onPillClick(slug, slug)}
              className={activePillKey === slug ? pillActive : pillInactive}
            >
              {cat}
            </button>
          )
        })}
      </nav>

      <div id={CONTENT_ANCHOR_ID}>
        {!loading && fetchError ? (
          <section className="px-6 py-16 lg:px-16">
            <p className="text-center font-body text-sm text-red-700">{fetchError}</p>
          </section>
        ) : null}

        {loading ? (
          <section className="px-6 py-12 lg:px-16">
            <LoadingSkeletonRow />
          </section>
        ) : !fetchError && !hasAnyDisplayed ? (
          <section className="px-6 py-20 lg:px-16">
            <div className="mx-auto flex max-w-lg flex-col items-center text-center">
              <p className="font-body text-[17px] font-normal leading-relaxed text-[#3a3530]">
                Our portfolio is coming soon. Visit our experience center to see our work in person.
              </p>
              <Link
                to="/instant-quote"
                className={[buttonClasses('primary', 'mt-8 px-8 py-4 text-[11px] tracking-wider uppercase')].join(
                  ' ',
                )}
              >
                Book a Visit
              </Link>
            </div>
          </section>
        ) : (
          CATEGORIES.map((cat) => {
            const bucket = grouped[cat] || []
            if (bucket.length === 0) return null
            const sectionId = CATEGORY_SECTION_ID[cat]
            const countLabel = `${bucket.length} ${bucket.length === 1 ? 'PROJECT' : 'PROJECTS'}`
            return (
              <section key={cat} id={sectionId} className="scroll-mt-24 px-6 py-12 lg:px-16">
                <h2 className="font-serif text-3xl font-light leading-tight text-[#1a1612]">{cat}</h2>
                <p className="mb-6 font-body text-xs uppercase tracking-widest text-[#c9a465]">{countLabel}</p>
                <CategoryCarousel categoryLabel={cat} items={bucket} onOpenLightbox={openLightbox} />
              </section>
            )
          })
        )}
      </div>

      <section className="bg-brand-brass px-6 py-16 lg:px-24 lg:py-28">
        <div className="mx-auto max-w-[900px] text-center">
          <AnimatedText
            text="Ready to build your space?"
            tag="h2"
            getWordClassName={(_w, i, n) => (i >= n - 2 ? 'italic' : '')}
            className="mx-auto justify-center font-display text-[clamp(30px,4vw,54px)] font-light leading-[1.06] text-brand-charcoal"
          />
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <MotionLink
              to="/instant-quote"
              onClick={() => track.quoteClick()}
              className={buttonClasses('ctaPrimary', 'focus-visible:ring-offset-brand-brass')}
              whileTap={{ scale: 0.98 }}
              transition={tapTransition}
            >
              Get Instant Quote
            </MotionLink>
          </div>
        </div>
      </section>

      {lightbox && lbItems.length > 0 && lbSrc ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 px-4 py-10"
          role="dialog"
          aria-modal="true"
          aria-label="Portfolio image"
          onClick={closeLightbox}
        >
          <button
            type="button"
            onClick={closeLightbox}
            className="absolute right-5 top-5 z-[2] border-0 bg-transparent p-2 text-3xl font-light text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
            aria-label="Close"
          >
            ×
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              goLbPrev()
            }}
            className="absolute left-3 top-1/2 z-[2] flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-white md:left-8"
            aria-label="Previous image"
          >
            <ChevronLeft className="h-8 w-8" strokeWidth={1.15} />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              goLbNext()
            }}
            className="absolute right-3 top-1/2 z-[2] flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-white md:right-8"
            aria-label="Next image"
          >
            <ChevronRight className="h-8 w-8" strokeWidth={1.15} />
          </button>
          <div className="relative max-h-[90vh] max-w-[90vw]" onClick={(e) => e.stopPropagation()}>
            <img
              src={lbSrc}
              alt=""
              className="max-h-[90vh] max-w-[90vw] rounded-lg object-contain"
              onError={(e) => {
                e.currentTarget.src = '/assets/images/fallback.jpg'
              }}
            />
          </div>
        </div>
      ) : null}
    </main>
  )
}
