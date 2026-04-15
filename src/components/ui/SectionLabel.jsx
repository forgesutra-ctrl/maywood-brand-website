export default function SectionLabel({ children, light = false, className = '' }) {
  const accent = light ? '#D4B483' : '#B8965A'

  return (
    <div
      className={['flex items-center gap-3', className].join(' ')}
      role="presentation"
    >
      <span
        className="h-px w-6 shrink-0 rounded-full"
        style={{ backgroundColor: accent }}
        aria-hidden
      />
      <span
        className="font-body text-[11px] font-medium uppercase leading-none tracking-[0.22em]"
        style={{ color: accent }}
      >
        {children}
      </span>
    </div>
  )
}
