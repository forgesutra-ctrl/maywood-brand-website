import { useEffect, useRef, useState } from 'react'

const LERP = 0.12
const DESKTOP_QUERY = '(min-width: 768px)'

function isInteractive(el) {
  if (!el || !(el instanceof Element)) return false
  return Boolean(
    el.closest(
      'a[href], button, input[type="submit"], input[type="button"], [role="button"], label[for], select, summary, [data-cursor-hover]',
    ),
  )
}

export default function CustomCursor() {
  const [enabled, setEnabled] = useState(false)
  const dotRef = useRef(null)
  const ringRef = useRef(null)
  const target = useRef({ x: 0, y: 0 })
  const ringPos = useRef({ x: 0, y: 0 })
  const hovering = useRef(false)
  const raf = useRef(0)
  const ringInit = useRef(false)

  useEffect(() => {
    const mq = window.matchMedia(DESKTOP_QUERY)
    const apply = () => {
      const on = mq.matches
      setEnabled(on)
      document.body.classList.toggle('custom-cursor-on', on)
    }
    apply()
    mq.addEventListener('change', apply)
    return () => {
      mq.removeEventListener('change', apply)
      document.body.classList.remove('custom-cursor-on')
    }
  }, [])

  useEffect(() => {
    if (!enabled) return

    const onMove = (e) => {
      target.current = { x: e.clientX, y: e.clientY }
      if (!ringInit.current) {
        ringPos.current = { x: e.clientX, y: e.clientY }
        ringInit.current = true
      }
      const under = document.elementFromPoint(e.clientX, e.clientY)
      hovering.current = isInteractive(under)
      if (ringRef.current) {
        ringRef.current.classList.toggle('cursor-ring--hover', hovering.current)
      }
    }

    const loop = () => {
      ringPos.current.x += (target.current.x - ringPos.current.x) * LERP
      ringPos.current.y += (target.current.y - ringPos.current.y) * LERP

      const dx = target.current.x
      const dy = target.current.y
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${dx}px, ${dy}px, 0) translate(-50%, -50%)`
      }
      if (ringRef.current) {
        const rx = ringPos.current.x
        const ry = ringPos.current.y
        ringRef.current.style.transform = `translate3d(${rx}px, ${ry}px, 0) translate(-50%, -50%)`
      }
      raf.current = requestAnimationFrame(loop)
    }

    window.addEventListener('mousemove', onMove, { passive: true })
    raf.current = requestAnimationFrame(loop)

    return () => {
      window.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(raf.current)
    }
  }, [enabled])

  if (!enabled) return null

  return (
    <>
      <div
        ref={ringRef}
        className="cursor-ring pointer-events-none fixed left-0 top-0 z-[10000] h-9 w-9 rounded-full border border-[#B8965A] opacity-40 transition-[width,height,background-color,border-color,opacity] duration-200 ease-out will-change-transform"
        style={{ borderWidth: '1px' }}
        aria-hidden
      />
      <div
        ref={dotRef}
        className="pointer-events-none fixed left-0 top-0 z-[10001] h-2 w-2 rounded-full bg-[#B8965A] will-change-transform"
        aria-hidden
      />
      <style>{`
        .cursor-ring--hover {
          width: 56px !important;
          height: 56px !important;
          opacity: 1 !important;
          background-color: rgba(184, 150, 90, 0.15) !important;
          border-color: rgba(184, 150, 90, 0.45) !important;
        }
      `}</style>
    </>
  )
}
