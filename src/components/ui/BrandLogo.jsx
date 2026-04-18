import { Link } from 'react-router-dom'
import { BRAND } from '../../config/brand'

const imgClass = {
  navbar: 'h-12 w-auto object-contain object-left sm:h-14 md:h-16',
  footer: 'h-12 w-auto object-contain object-left max-w-[220px] sm:h-[52px] sm:max-h-[52px]',
}

/**
 * Site wordmark / monogram image.
 * @param {object} props
 */
export default function BrandLogo({ to = '/', variant = 'navbar', className = '' }) {
  const imgLayoutClass = variant === 'footer' ? 'w-full h-full shrink-0 block' : 'shrink-0 block'

  const img = (
    <img
      src={BRAND.logoSrc}
      alt={BRAND.logoAlt}
      width={320}
      height={96}
      decoding="async"
      className={[imgClass[variant] ?? imgClass.navbar, imgLayoutClass].join(' ')}
      onError={(e) => {
        e.currentTarget.src = '/assets/images/fallback.jpg'
      }}
    />
  )

  const inner =
    variant === 'footer' ? (
      <span className="inline-block rounded-[2px] bg-brand-ivory p-2 ring-1 ring-white/10">{img}</span>
    ) : (
      img
    )

  if (!to) {
    return <span className={className}>{inner}</span>
  }

  return (
    <Link
      to={to}
      className={[
        'group relative z-10 min-w-0 shrink-0 transition-opacity duration-300 hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-brass focus-visible:ring-offset-2',
        variant === 'navbar' ? 'focus-visible:ring-offset-transparent' : 'focus-visible:ring-offset-brand-charcoal',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {inner}
    </Link>
  )
}
