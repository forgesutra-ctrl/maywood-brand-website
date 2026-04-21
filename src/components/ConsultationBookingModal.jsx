import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { CheckCircle2, X } from 'lucide-react'
import { saveConsultationBooking } from '../utils/adminDataStore'

const TIME_SLOTS = [
  '10:00 AM – 11:00 AM',
  '11:00 AM – 12:00 PM',
  '12:00 PM – 1:00 PM',
  '2:00 PM – 3:00 PM',
  '3:00 PM – 4:00 PM',
  '4:00 PM – 5:00 PM',
]

const CENTERS = [
  'Koramangala Experience Center',
  'Whitefield Experience Center',
  "I'd prefer a home visit",
]

const inputClass =
  'w-full border-0 border-b border-brand-charcoal-soft/30 bg-transparent py-2 font-body text-[15px] text-brand-charcoal shadow-none outline-none ring-0 transition-colors placeholder:text-brand-mist/60 focus:border-brand-brass focus:ring-0'

const labelClass =
  'mb-2 block font-body text-[11px] font-semibold uppercase tracking-[0.14em] text-brand-brass'

export default function ConsultationBookingModal({ isOpen, onClose, prefillName, prefillPhone, prefillEmail }) {
  const [submitted, setSubmitted] = useState(false)
  const [consult, setConsult] = useState(() => ({
    fullName: (prefillName || '').trim(),
    phone: (prefillPhone || '').trim(),
    email: (prefillEmail || '').trim(),
    date: '',
    timeSlot: '',
    center: '',
    note: '',
  }))

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

  const handleSubmit = async (e) => {
    e.preventDefault()
    await saveConsultationBooking({
      name: consult.fullName.trim(),
      phone: consult.phone.trim(),
      email: consult.email.trim(),
      preferredDate: consult.date,
      timeSlot: consult.timeSlot,
      preferredCenter: consult.center,
      projectNote: consult.note,
    })
    setSubmitted(true)
  }

  return createPortal(
    <AnimatePresence>
      {isOpen ? (
        <motion.div
          key="consult-overlay"
          role="presentation"
          aria-hidden={!isOpen}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4"
          onClick={onClose}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="consultation-modal-title"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="relative max-h-[90vh] w-[95vw] max-w-[520px] overflow-y-auto rounded-sm bg-brand-ivory px-6 pb-8 pt-10 sm:px-8"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={onClose}
              className="absolute right-4 top-4 rounded-sm p-1 text-brand-charcoal transition-colors hover:bg-brand-ivory-deep hover:text-brand-brass"
              aria-label="Close"
            >
              <X className="h-5 w-5" strokeWidth={1.75} aria-hidden />
            </button>

            {!submitted ? (
              <>
                <p className="font-body text-[10px] font-semibold uppercase tracking-[0.2em] text-brand-brass">
                  BOOK A CONSULTATION
                </p>
                <h2
                  id="consultation-modal-title"
                  className="mt-3 font-display text-[clamp(26px,4vw,34px)] font-light leading-tight text-brand-charcoal"
                >
                  Let&apos;s talk about your space.
                </h2>
                <p className="mt-2 font-body text-[14px] leading-relaxed text-brand-mist">
                  Our designer will call you within 24 hours.
                </p>

                <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                  <label className="block">
                    <span className={labelClass}>Full Name</span>
                    <input
                      type="text"
                      name="fullName"
                      value={consult.fullName}
                      onChange={(e) => setConsult((p) => ({ ...p, fullName: e.target.value }))}
                      className={inputClass}
                      required
                      autoComplete="name"
                    />
                  </label>
                  <label className="block">
                    <span className={labelClass}>Phone Number</span>
                    <input
                      type="tel"
                      name="phone"
                      value={consult.phone}
                      onChange={(e) => setConsult((p) => ({ ...p, phone: e.target.value }))}
                      className={inputClass}
                      required
                      autoComplete="tel"
                    />
                  </label>
                  <label className="block">
                    <span className={labelClass}>Email Address</span>
                    <input
                      type="email"
                      name="email"
                      value={consult.email}
                      onChange={(e) => setConsult((p) => ({ ...p, email: e.target.value }))}
                      className={inputClass}
                      required
                      autoComplete="email"
                    />
                  </label>
                  <label className="block">
                    <span className={labelClass}>Preferred Date</span>
                    <input
                      type="date"
                      name="date"
                      value={consult.date}
                      onChange={(e) => setConsult((p) => ({ ...p, date: e.target.value }))}
                      className={inputClass}
                      required
                    />
                  </label>
                  <label className="block">
                    <span className={labelClass}>Preferred Time Slot</span>
                    <select
                      name="timeSlot"
                      value={consult.timeSlot}
                      onChange={(e) => setConsult((p) => ({ ...p, timeSlot: e.target.value }))}
                      className={`${inputClass} cursor-pointer`}
                      required
                    >
                      <option value="">Select a time</option>
                      {TIME_SLOTS.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="block">
                    <span className={labelClass}>Preferred Center</span>
                    <select
                      name="center"
                      value={consult.center}
                      onChange={(e) => setConsult((p) => ({ ...p, center: e.target.value }))}
                      className={`${inputClass} cursor-pointer`}
                      required
                    >
                      <option value="">Select a center</option>
                      {CENTERS.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="block">
                    <span className={labelClass}>
                      Brief note about your project <span className="font-normal normal-case text-brand-mist">(optional)</span>
                    </span>
                    <textarea
                      name="note"
                      rows={3}
                      value={consult.note}
                      onChange={(e) => setConsult((p) => ({ ...p, note: e.target.value }))}
                      className={`${inputClass} resize-y`}
                    />
                  </label>

                  <button
                    type="submit"
                    className="mt-2 w-full rounded-[2px] bg-[#B8965A] px-6 py-[14px] font-body text-[12px] font-medium uppercase tracking-[0.12em] text-[#1C1915] transition-opacity hover:opacity-90"
                  >
                    Confirm consultation
                  </button>
                </form>
              </>
            ) : (
              <div className="flex flex-col items-center px-2 pb-4 pt-6 text-center">
                <CheckCircle2 className="h-14 w-14 text-green-600" strokeWidth={1.5} aria-hidden />
                <p className="mt-6 font-body text-[16px] font-normal leading-relaxed text-brand-charcoal">
                  You&apos;re all set! We&apos;ll call you within 24 hours to confirm.
                </p>
                <button
                  type="button"
                  onClick={onClose}
                  className="mt-8 w-full rounded-[2px] border border-brand-charcoal/25 bg-transparent px-6 py-[14px] font-body text-[12px] font-medium uppercase tracking-[0.12em] text-brand-charcoal transition-colors hover:border-brand-brass hover:text-brand-brass sm:max-w-[240px]"
                >
                  Close
                </button>
              </div>
            )}
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>,
    document.body,
  )
}
