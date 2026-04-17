import { Link } from 'react-router-dom'
import { BRAND } from '../../config/brand'

const imgClass = {
  navbar: 'h-12 w-auto object-contain object-left sm:h-14 md:h-16',
  footer: 'h-12 w-auto max-w-[220px] sm:h-[52px] sm:max-h-[52px]',
}

/**
 * Site wordmark + monogram. Use everywhere the old “MAYWOOD / INTERIORS” text lockup appeared.
 * @param {object} props
 * @param {boolean} [props.withNavWordmark] — header only: larger mark + “Maywood / Interiors” beside it
 */
export default function BrandLogo({ to = '/', variant = 'navbar', withNavWordmark = false, className = '' }) {
  const useNavLockup = withNavWordmark && variant === 'navbar'

  const img = (
    <img
      src={BRAND.logoSrc}
      alt={useNavLockup ? '' : BRAND.logoAlt}
      width={320}
      height={96}
      decoding="async"
      aria-hidden={useNavLockup ? true : undefined}
      className={[imgClass[variant] ?? imgClass.navbar, 'shrink-0'].join(' ')}
    />
  )

  let inner
  if (variant === 'footer') {
    inner = <span className="inline-block rounded-[2px] bg-brand-ivory p-2 ring-1 ring-white/10">{img}</span>
  } else if (useNavLockup) {
    inner = (
      <span className="flex min-w-0 items-center gap-3 sm:gap-4">
        {img}
        <span className="flex min-w-0 flex-col justify-center leading-tight">
          <span className="font-display text-[clamp(18px,2.4vw,24px)] font-light uppercase tracking-[0.14em] text-brand-charcoal">
            Maywood
          </span>
          <span className="mt-0.5 font-body text-[9px] font-normal uppercase tracking-[0.28em] text-brand-mist sm:text-[10px]">
            Interiors
          </span>
        </span>
      </span>
    )
  } else {
    inner = img
  }

  if (!to) {
    return <span className={className}>{inner}</span>
  }

  return (
    <Link
      to={to}
      aria-label={useNavLockup ? 'Maywood Interiors — home' : undefined}
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
