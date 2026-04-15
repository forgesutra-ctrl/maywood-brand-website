const stripeStyle = {
  backgroundImage: `repeating-linear-gradient(
    45deg,
    #E8E2D8,
    #E8E2D8 4px,
    #DDD7CC 4px,
    #DDD7CC 8px
  )`,
}

function FrameIcon({ className = '' }) {
  return (
    <svg
      className={className}
      width="40"
      height="40"
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <rect x="6" y="8" width="28" height="24" rx="1" stroke="currentColor" strokeWidth="1.25" />
      <path
        d="M10 28 L16 20 L22 26 L28 18 L32 24"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="14" cy="14" r="2" fill="currentColor" />
    </svg>
  )
}

export default function ImagePlaceholder({ label, className = '' }) {
  return (
    <div
      className={[
        'flex w-full min-h-[160px] flex-col items-center justify-center gap-3 px-4 py-8 text-brand-mist-light',
        className,
      ].join(' ')}
      style={stripeStyle}
    >
      <FrameIcon className="text-brand-mist-light opacity-90" />
      <p className="max-w-[220px] text-center font-body text-[11px] font-medium uppercase tracking-[0.14em] text-brand-mist-light">
        {label}
      </p>
    </div>
  )
}
