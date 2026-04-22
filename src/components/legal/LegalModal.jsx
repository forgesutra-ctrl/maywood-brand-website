import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'

/**
 * @param {object} props
 * @param {boolean} props.isOpen
 * @param {() => void} props.onClose
 * @param {string} props.title
 * @param {string} [props.titleId]
 * @param {import('react').ReactNode} props.children
 */
export default function LegalModal({ isOpen, onClose, title, titleId = 'legal-modal-title', children }) {
  useEffect(() => {
    if (!isOpen) return
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [isOpen, onClose])

  useEffect(() => {
    if (!isOpen) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [isOpen])

  if (typeof document === 'undefined') return null

  return createPortal(
    <AnimatePresence>
      {isOpen ? (
        <motion.div
          key="legal-modal-overlay"
          className="fixed inset-0 z-[10050] flex items-center justify-center bg-black/70 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
        >
          <motion.div
            className="flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-xl bg-[#faf9f7] shadow-2xl"
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.2, ease: [0.33, 1, 0.68, 1] }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex w-full flex-shrink-0 items-center justify-between gap-3 bg-[#1a1612] px-8 py-5">
              <span className="shrink-0 text-left text-xs font-normal uppercase tracking-widest text-[#c9a465]">
                Legal document
              </span>
              <h2
                id={titleId}
                className="min-w-0 flex-1 text-center font-serif text-xl font-light text-white"
              >
                {title}
              </h2>
              <button
                type="button"
                onClick={onClose}
                className="w-8 shrink-0 text-right text-2xl font-light leading-none text-white transition-colors hover:text-[#c9a465]"
                aria-label="Close"
              >
                ×
              </button>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto px-8 py-8">{children}</div>

            <div className="flex flex-shrink-0 items-center justify-between bg-[#f0ece6] px-8 py-4">
              <p className="text-xs text-[#888]">
                Maywood Interiors Private Limited | CIN: U74999KA2025PTC123456
              </p>
              <button
                type="button"
                onClick={onClose}
                className="rounded-sm border border-[#c9a465] px-3 py-1.5 text-xs font-medium text-[#b8965a] transition-colors hover:bg-[#c9a465]/10"
              >
                Close
              </button>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>,
    document.body,
  )
}
