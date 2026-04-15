export const buttonBaseClass =
  'inline-flex cursor-pointer select-none items-center justify-center border-0 font-body text-[12px] font-medium uppercase leading-none tracking-[0.12em] transition-[opacity,background-color,border-color,color,transform] duration-[250ms] ease-out focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-brass focus-visible:ring-offset-2 focus-visible:ring-offset-brand-ivory disabled:pointer-events-none disabled:opacity-40'

export const buttonVariantClass = {
  primary:
    'bg-[#B8965A] text-[#1C1915] hover:opacity-[0.85] active:opacity-[0.85]',
  dark: 'bg-[#1C1915] text-[#D4B483] hover:bg-[#2E2B26]',
  ghost:
    'border-[0.5px] border-current bg-transparent text-inherit hover:border-[#B8965A]',
}

export function buttonClasses(variant = 'primary', className = '') {
  return [
    buttonBaseClass,
    'rounded-[2px] px-9 py-[14px]',
    buttonVariantClass[variant] ?? buttonVariantClass.primary,
    className,
  ]
    .filter(Boolean)
    .join(' ')
}
