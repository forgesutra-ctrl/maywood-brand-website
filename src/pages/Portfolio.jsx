import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import SectionLabel from '../components/ui/SectionLabel'
import AnimatedText from '../components/ui/AnimatedText'
import { buttonClasses } from '../lib/buttonStyles'
import { projectImages as fallbackImages } from '../data/projectImages'
import { PORTFOLIO_UPDATED_EVENT } from '../utils/portfolioProjectsStore'
import { supabase } from '../utils/supabaseClient'

const MotionLink = motion(Link)

const tapTransition = { type: 'tween', duration: 0.15, ease: [0.16, 1, 0.3, 1] }

async function fetchGalleryItems() {
  const { data, error } = await supabase
    .from('portfolio_projects')
    .select('image_url')
    .order('created_at', { ascending: false })
  if (error) {
    console.error('portfolio_projects:', error)
    return { fromAdmin: false, items: fallbackImages }
  }
  if (data?.length) {
    return { fromAdmin: true, items: data.map((p) => ({ src: p.image_url })) }
  }
  return { fromAdmin: false, items: fallbackImages }
}

export default function Portfolio() {
  const [{ fromAdmin, items }, setGallery] = useState({ fromAdmin: false, items: fallbackImages })
  const [lightboxIndex, setLightboxIndex] = useState(null)

  useEffect(() => {
    const sync = async () => {
      setGallery(await fetchGalleryItems())
    }
    sync()
    const onPortfolio = () => {
      sync()
    }
    window.addEventListener(PORTFOLIO_UPDATED_EVENT, onPortfolio)
    const onVis = () => {
      if (document.visibilityState === 'visible') sync()
    }
    document.addEventListener('visibilitychange', onVis)
    return () => {
      window.removeEventListener(PORTFOLIO_UPDATED_EVENT, onPortfolio)
      document.removeEventListener('visibilitychange', onVis)
    }
  }, [])

  const showComingSoon = !fromAdmin

  useEffect(() => {
    if (lightboxIndex === null) return
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prevOverflow
    }
  }, [lightboxIndex])

  useEffect(() => {
    if (lightboxIndex === null) return
    const onKeyDown = (e) => {
      if (e.key === 'Escape') setLightboxIndex(null)
      if (e.key === 'ArrowLeft') {
        setLightboxIndex((i) => (i - 1 + items.length) % items.length)
      }
      if (e.key === 'ArrowRight') {
        setLightboxIndex((i) => (i + 1) % items.length)
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [lightboxIndex, items.length])

  const openAt = (index) => setLightboxIndex(index)
  const goPrev = () => setLightboxIndex((i) => (i - 1 + items.length) % items.length)
  const goNext = () => setLightboxIndex((i) => (i + 1) % items.length)

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

      <section className="bg-brand-ivory px-5 py-16 md:px-8 lg:px-10 lg:py-24">
        <div className="mx-auto max-w-[1400px]">
          {showComingSoon ? (
            <p className="mb-10 text-center font-body text-[15px] leading-relaxed text-brand-mist">
              Portfolio coming soon. Check back shortly.
            </p>
          ) : null}
          <div className="columns-1 gap-4 sm:columns-2 lg:columns-3 lg:gap-5">
            {items.map(({ src }, index) => (
              <button
                key={`${src}-${index}`}
                type="button"
                onClick={() => openAt(index)}
                className="mb-4 w-full break-inside-avoid rounded-[2px] border-0 bg-transparent p-0 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-brass focus-visible:ring-offset-2 focus-visible:ring-offset-brand-ivory"
              >
                <div className="aspect-[4/5] w-full overflow-hidden rounded-[2px] bg-brand-ivory-deep">
                  <img
                    src={src}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    className="block h-full w-full object-cover object-[center_28%]"
                    onError={(e) => {
                      e.currentTarget.src = '/assets/images/fallback.jpg'
                    }}
                  />
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

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
              className={buttonClasses('ctaPrimary', 'focus-visible:ring-offset-brand-brass')}
              whileTap={{ scale: 0.98 }}
              transition={tapTransition}
            >
              Get Instant Quote
            </MotionLink>
          </div>
        </div>
      </section>

      {lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-[10050] flex items-center justify-center bg-brand-charcoal/95 px-4 py-16"
          role="dialog"
          aria-modal="true"
          aria-label="Project image"
          onClick={() => setLightboxIndex(null)}
        >
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              setLightboxIndex(null)
            }}
            className="absolute right-4 top-4 z-[10051] flex h-11 w-11 items-center justify-center rounded-[2px] text-brand-ivory transition-colors hover:text-brand-brass-light focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-brass md:right-8 md:top-8"
            aria-label="Close"
          >
            <X className="h-6 w-6" strokeWidth={1.25} />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              goPrev()
            }}
            className="absolute left-2 top-1/2 z-[10051] flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-[2px] text-brand-ivory transition-colors hover:text-brand-brass-light focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-brass md:left-6"
            aria-label="Previous image"
          >
            <ChevronLeft className="h-8 w-8" strokeWidth={1.15} />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              goNext()
            }}
            className="absolute right-2 top-1/2 z-[10051] flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-[2px] text-brand-ivory transition-colors hover:text-brand-brass-light focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-brass md:right-6"
            aria-label="Next image"
          >
            <ChevronRight className="h-8 w-8" strokeWidth={1.15} />
          </button>
          <div
            className="relative max-h-[90vh] max-w-[min(96vw,1400px)] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={items[lightboxIndex].src}
              alt=""
              className="block h-full max-h-[90vh] w-full max-w-full object-cover object-center"
              onError={(e) => {
                e.currentTarget.src = '/assets/images/fallback.jpg'
              }}
            />
          </div>
        </div>
      )}
    </main>
  )
}
