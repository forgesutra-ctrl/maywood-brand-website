import { useCallback, useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'

const GALLERY_IMAGES = Array.from({ length: 10 }, (_, i) => {
  const n = String(i + 1).padStart(2, '0')
  return `/assets/images/experience-center/gallery-${n}.png`
})

/** Varied aspect boxes for a masonry-style column layout */
const TILE_ASPECT = ['4/3', '3/4', '1/1', '5/4', '3/5', '4/5', '1/1', '4/3', '3/4', '5/4']

export default function ExperienceCenterPhotoGallery() {
  const [activeIndex, setActiveIndex] = useState(null)

  const close = useCallback(() => setActiveIndex(null), [])

  const goPrev = useCallback(() => {
    setActiveIndex((i) => {
      if (i === null) return null
      return i === 0 ? GALLERY_IMAGES.length - 1 : i - 1
    })
  }, [])

  const goNext = useCallback(() => {
    setActiveIndex((i) => {
      if (i === null) return null
      return i === GALLERY_IMAGES.length - 1 ? 0 : i + 1
    })
  }, [])

  useEffect(() => {
    if (activeIndex === null) return
    const onKey = (e) => {
      if (e.key === 'Escape') close()
      if (e.key === 'ArrowLeft') goPrev()
      if (e.key === 'ArrowRight') goNext()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [activeIndex, close, goPrev, goNext])

  useEffect(() => {
    if (activeIndex === null) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [activeIndex])

  return (
    <>
      <div className="columns-1 gap-4 sm:columns-2 lg:columns-3 lg:gap-5">
        {GALLERY_IMAGES.map((src, i) => (
          <div key={src} className="mb-4 break-inside-avoid sm:mb-5">
            <button
              type="button"
              onClick={() => setActiveIndex(i)}
              className="block w-full overflow-hidden rounded-sm outline-none ring-offset-2 ring-offset-brand-ivory transition-opacity hover:opacity-95 focus-visible:ring-2 focus-visible:ring-brand-brass"
            >
              <div
                className="relative w-full overflow-hidden rounded-sm"
                style={{ aspectRatio: TILE_ASPECT[i % TILE_ASPECT.length] }}
              >
                <img
                  src={src}
                  alt=""
                  loading="lazy"
                  className="absolute inset-0 block h-full w-full object-cover object-center"
                />
              </div>
            </button>
          </div>
        ))}
      </div>

      {activeIndex !== null
        ? createPortal(
            <div
              role="presentation"
              className="fixed inset-0 z-[200] flex items-center justify-center bg-black/90 p-4"
              onClick={close}
            >
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  close()
                }}
                className="absolute right-4 top-4 rounded-sm p-2 text-white/90 transition-colors hover:bg-white/10 hover:text-white"
                aria-label="Close gallery"
              >
                <X className="h-6 w-6" strokeWidth={1.75} aria-hidden />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  goPrev()
                }}
                className="absolute left-2 top-1/2 z-10 -translate-y-1/2 rounded-sm p-3 text-white/90 transition-colors hover:bg-white/10 hover:text-white sm:left-6"
                aria-label="Previous image"
              >
                <ChevronLeft className="h-10 w-10" strokeWidth={1.25} aria-hidden />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  goNext()
                }}
                className="absolute right-2 top-1/2 z-10 -translate-y-1/2 rounded-sm p-3 text-white/90 transition-colors hover:bg-white/10 hover:text-white sm:right-6"
                aria-label="Next image"
              >
                <ChevronRight className="h-10 w-10" strokeWidth={1.25} aria-hidden />
              </button>
              <div
                role="dialog"
                aria-modal="true"
                className="relative max-h-[90vh] max-w-[min(100%,1200px)]"
                onClick={(e) => e.stopPropagation()}
              >
                <img
                  src={GALLERY_IMAGES[activeIndex]}
                  alt=""
                  className="max-h-[90vh] w-full object-contain"
                />
              </div>
            </div>,
            document.body,
          )
        : null}
    </>
  )
}
