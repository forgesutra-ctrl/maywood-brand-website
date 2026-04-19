/** Default / form / non-hero buttons (legacy sizing + ring offset ivory) */
export const buttonBaseClass =
  'inline-flex cursor-pointer select-none items-center justify-center border-0 font-body text-[12px] font-medium uppercase leading-none tracking-[0.12em] transition-[opacity,background-color,border-color,color,transform] duration-[250ms] ease-out focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-brass focus-visible:ring-offset-2 focus-visible:ring-offset-brand-ivory disabled:pointer-events-none disabled:opacity-40'

/**
 * Shared base for sitewide “Get Instant Quote” / “Book Free Consultation” pair:
 * 13px, tracking 0.1em, px 28 py 14, sharp corners, 1px border (color from variant).
 */
export const ctaBaseClass =
  'inline-flex cursor-pointer select-none items-center justify-center font-body text-[13px] font-medium uppercase leading-none tracking-[0.1em] transition-[background-color,border-color,color,opacity] duration-[250ms] ease-out focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B8965A] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-40 rounded-none border border-solid px-[28px] py-[14px]'

export const buttonVariantClass = {
  primary:
    'bg-[#B8965A] text-[#1C1915] hover:opacity-[0.85] active:opacity-[0.85]',
  /** Gold filled — matches hero “Get Instant Quote” */
  ctaPrimary:
    'border-[#B8965A] bg-[#B8965A] text-[#1a1612] hover:border-[#B8965A] hover:bg-[#A07840] active:bg-[#A07840]',
  /** Gold outline — matches hero “Book Free Consultation” */
  ctaSecondary:
    'border-[#B8965A] bg-transparent text-[#B8965A] hover:border-[#B8965A] hover:bg-[rgba(184,150,90,0.1)] hover:text-[#B8965A]',
  dark: 'bg-[#1C1915] text-[#D4B483] hover:bg-[#2E2B26]',
  ghost:
    'border-[0.5px] border-current bg-transparent text-inherit hover:border-[#B8965A]',
}

export function buttonClasses(variant = 'primary', className = '') {
  const isCta = variant === 'ctaPrimary' || variant === 'ctaSecondary'
  const base = isCta ? ctaBaseClass : buttonBaseClass
  const sizing = isCta ? '' : 'rounded-[2px] px-9 py-[14px]'
  const variantClass = buttonVariantClass[variant] ?? buttonVariantClass.primary
  return [base, sizing, variantClass, className].filter(Boolean).join(' ')
}
