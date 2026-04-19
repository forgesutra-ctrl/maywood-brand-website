import { useCallback, useEffect, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const INTERVAL_MS = 3000

export default function PortfolioCarouselMini({ images, alt }) {
  const [index, setIndex] = useState(0)
  const [hover, setHover] = useState(false)

  const go = useCallback(
    (delta) => {
      setIndex((i) => (i + delta + images.length) % images.length)
    },
    [images.length]
  )

  useEffect(() => {
    if (hover || images.length <= 1) return undefined
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % images.length)
    }, INTERVAL_MS)
    return () => window.clearInterval(id)
  }, [hover, images.length])

  return (
    <div
      className="group relative h-[220px] w-full max-w-full overflow-hidden"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      role="img"
      aria-label={alt}
    >
      {images.map((src, i) => (
        <img
          key={src}
          src={src}
          alt=""
          loading={i === 0 ? 'eager' : 'lazy'}
          draggable={false}
          className={[
            'absolute inset-0 h-full w-full object-cover object-[center_28%] block transition-opacity duration-500 ease-out',
            i === index ? 'z-[1] opacity-100' : 'z-0 opacity-0',
          ].join(' ')}
          onError={(e) => {
            e.currentTarget.src = '/assets/images/fallback.jpg'
          }}
        />
      ))}

      {images.length > 1 && (
        <>
          <div className="pointer-events-none absolute bottom-2 left-1/2 z-[3] flex -translate-x-1/2 gap-1.5">
            {images.map((_, i) => (
              <span
                key={i}
                className={[
                  'h-1.5 w-1.5 rounded-full transition-colors duration-300',
                  i === index ? 'bg-white' : 'bg-white/45',
                ].join(' ')}
                aria-hidden
              />
            ))}
          </div>

          <button
            type="button"
            tabIndex={-1}
            aria-hidden
            className="pointer-events-none absolute left-2 top-1/2 z-[3] flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-black/45 text-white opacity-0 shadow-sm transition-opacity duration-200 hover:bg-black/60 group-hover:pointer-events-auto group-hover:opacity-100"
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              go(-1)
            }}
          >
            <ChevronLeft className="h-5 w-5" strokeWidth={1.75} />
          </button>
          <button
            type="button"
            tabIndex={-1}
            aria-hidden
            className="pointer-events-none absolute right-2 top-1/2 z-[3] flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-black/45 text-white opacity-0 shadow-sm transition-opacity duration-200 hover:bg-black/60 group-hover:pointer-events-auto group-hover:opacity-100"
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              go(1)
            }}
          >
            <ChevronRight className="h-5 w-5" strokeWidth={1.75} />
          </button>
        </>
      )}
    </div>
  )
}
