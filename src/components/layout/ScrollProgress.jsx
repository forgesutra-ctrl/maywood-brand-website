import { useEffect, useState } from 'react'

export default function ScrollProgress() {
  const [widthPct, setWidthPct] = useState(0)

  useEffect(() => {
    const update = () => {
      const el = document.documentElement
      const max = el.scrollHeight - el.clientHeight
      const pct = max <= 0 ? 0 : (el.scrollTop / max) * 100
      setWidthPct(Math.min(100, Math.max(0, pct)))
    }
    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update, { passive: true })
    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [])

  return (
    <div
      className="pointer-events-none fixed left-0 top-0 z-[9998] h-0.5 w-full overflow-hidden bg-transparent"
      role="progressbar"
      aria-valuenow={Math.round(widthPct)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label="Page scroll progress"
    >
      <div
        className="h-full bg-[#B8965A] transition-[width] duration-[50ms] ease-linear"
        style={{ width: `${widthPct}%` }}
      />
    </div>
  )
}
