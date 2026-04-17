import { useEffect, useState } from 'react'
import { IMAGES } from '../../config/images'

export default function HeroImageCarousel({ className = '' }) {
  const slides = IMAGES.heroCarousel
  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (slides.length <= 1) return undefined
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % slides.length)
    }, 5500)
    return () => window.clearInterval(id)
  }, [slides.length])

  return (
    <div
      className={[
        'relative h-full min-h-[45vh] w-full overflow-hidden sm:min-h-[50vh] lg:min-h-0',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      role="region"
      aria-label="Featured Maywood interiors"
    >
      {slides.map((slide, i) => (
        <img
          key={slide.src}
          src={slide.src}
          alt={slide.alt}
          loading="eager"
          className={[
            'absolute inset-0 h-full w-full object-cover object-center transition-opacity duration-[900ms] ease-out',
            i === index ? 'opacity-100' : 'opacity-0',
          ].join(' ')}
        />
      ))}
    </div>
  )
}
