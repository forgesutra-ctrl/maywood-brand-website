import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { buttonBaseClass } from '../lib/buttonStyles'

const MotionLink = motion(Link)

const tapTransition = { type: 'tween', duration: 0.15, ease: [0.16, 1, 0.3, 1] }

const PLYWOOD_SPECS = [
  { spec: 'Thickness', detail: '16mm' },
  { spec: 'Size', detail: '8ft x 4ft (2440 x 1220 mm)' },
  { spec: 'Glue Type', detail: 'MUF – Melamine Urea Formaldehyde' },
  { spec: 'Core Material', detail: '11 Layers Semi Hardwood' },
  { spec: 'Face / Back Veneer', detail: 'Okuma' },
  { spec: 'Grade', detail: 'MR – Moisture Resistant' },
  { spec: 'Standard', detail: 'IS: 303' },
  { spec: 'CML No.', detail: 'CM/L-6400083602' },
]

const PLYWOOD_BADGES = [
  { icon: '🛡', label: 'Termite Proof' },
  { icon: '💧', label: 'Moisture Resistant' },
  { icon: '🔗', label: 'Strong Bonded' },
]

export default function MaywoodPlysSection() {
  return (
    <section className="bg-[#f5f0eb] px-6 py-20 lg:px-24">
      <div className="mx-auto grid max-w-[1400px] grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-x-20 lg:gap-y-12">
        <div className="min-w-0">
          <span className="inline-block font-body text-[11px] font-medium uppercase tracking-[0.22em] text-brand-brass">
            MAYWOOD PLYS
          </span>
          <h2 className="mt-4 font-display text-[clamp(32px,4vw,48px)] font-light leading-[1.08] text-brand-charcoal">
            Our wood. Your home.
          </h2>
          <p className="mt-6 max-w-[520px] font-body text-[15px] font-normal leading-[1.85] text-brand-mist">
            Every Maywood project is built on Maywood Plys — our own ISI-certified plywood manufactured in-house. No
            middlemen, no markups, no compromises on grade.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            {PLYWOOD_BADGES.map(({ icon, label }) => (
              <span
                key={label}
                className="inline-flex items-center gap-2 rounded-full border border-brand-brass bg-brand-ivory/60 px-4 py-2.5 font-body text-[12px] font-medium text-brand-charcoal"
              >
                <span className="text-[15px] leading-none text-brand-brass" aria-hidden>
                  {icon}
                </span>
                {label}
              </span>
            ))}
          </div>

          <div className="mt-10 overflow-hidden rounded-sm border border-brand-brass-pale/50">
            <table className="w-full border-collapse text-left font-body text-[13px]">
              <tbody>
                {PLYWOOD_SPECS.map((row, i) => (
                  <tr
                    key={row.spec}
                    className={i % 2 === 0 ? 'bg-brand-charcoal/[0.03]' : 'bg-brand-charcoal/[0.06]'}
                  >
                    <th
                      scope="row"
                      className="w-[38%] border-b border-brand-brass-pale/25 py-3 pl-4 pr-3 font-medium text-brand-charcoal sm:w-[32%] sm:py-3.5 sm:pl-5"
                    >
                      {row.spec}
                    </th>
                    <td className="border-b border-brand-brass-pale/25 py-3 pr-4 font-normal text-brand-mist sm:py-3.5 sm:pr-5">
                      {row.detail}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <MotionLink
            to="/maywood-plys"
            className={[
              buttonBaseClass,
              'mt-10 rounded-full border border-brand-brass bg-transparent px-8 py-[14px] font-body text-[11px] font-semibold uppercase tracking-[0.14em] text-brand-charcoal transition-colors hover:bg-brand-brass/10 focus-visible:ring-offset-[#f5f0eb]',
            ].join(' ')}
            whileTap={{ scale: 0.98 }}
            transition={tapTransition}
          >
            LEARN MORE ABOUT MAYWOOD PLYS
          </MotionLink>
        </div>

        <div className="flex min-w-0 justify-center lg:justify-end">
          <div
            className="relative max-w-[min(100%,420px)] shadow-[0_28px_64px_-16px_rgba(28,25,21,0.28),0_12px_24px_-12px_rgba(184,150,90,0.15)]"
            style={{ transform: 'rotate(2.5deg)' }}
          >
            <img
              src="/images/maywood-premium-plywood-label.png"
              alt="Maywood Premium Plywood product label — ISI certified specifications"
              loading="lazy"
              className="block w-full rounded-sm border border-brand-brass-pale/40 bg-brand-ivory"
              onError={(e) => {
                e.currentTarget.src = '/assets/images/fallback.jpg'
              }}
            />
          </div>
        </div>
      </div>
    </section>
  )
}
