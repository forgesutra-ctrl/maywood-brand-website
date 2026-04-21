import AnimatedText from '../components/ui/AnimatedText'

const ui = 'font-[system-ui,-apple-system,sans-serif] text-[#1a1612]'

function PmsPanelProjectTracking() {
  const rows = [
    { name: 'Sharma Residence', pct: 72, color: '#22c55e', w: '72%' },
    { name: 'TechCorp Office', pct: 45, color: '#3b82f6', w: '45%' },
    { name: 'Kodipur Villa', pct: 89, color: '#c9a465', w: '89%' },
  ]
  return (
    <div
      className={`flex h-[200px] w-full flex-col rounded-lg bg-[#e8e6e3] p-2 ${ui}`}
      aria-hidden
    >
      <div className="mb-1.5 flex items-center justify-between border-b border-[#1a1612]/10 pb-1.5">
        <span className="text-[10px] font-semibold">All Projects</span>
        <span
          className="rounded px-1.5 py-0.5 text-[8px] font-semibold"
          style={{ backgroundColor: 'rgba(59,130,246,0.15)', color: '#3b82f6' }}
        >
          Active: 3
        </span>
      </div>
      <div className="flex min-h-0 flex-1 flex-col justify-between gap-1.5">
        {rows.map(({ name, pct, color, w }) => (
          <div key={name} className="rounded-md bg-white px-2 py-1.5 shadow-sm">
            <div className="flex items-center justify-between gap-1">
              <span className="truncate text-[9px] font-medium">{name}</span>
              <span className="shrink-0 text-[9px] font-semibold tabular-nums">{pct}%</span>
            </div>
            <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-[#1a1612]/8">
              <div className="h-full rounded-full" style={{ width: w, backgroundColor: color }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function PmsPanelMaterialOrders() {
  return (
    <div
      className={`flex h-[200px] w-full flex-col rounded-lg bg-[#e8e6e3] p-2 ${ui}`}
      aria-hidden
    >
      <div className="mb-1.5 flex items-center justify-between border-b border-[#1a1612]/10 pb-1.5">
        <span className="text-[10px] font-semibold">Orders</span>
        <span
          className="rounded px-1.5 py-0.5 text-[8px] font-semibold"
          style={{ backgroundColor: 'rgba(34,197,94,0.15)', color: '#22c55e' }}
        >
          Delivered
        </span>
      </div>
      <div className="min-h-0 flex-1 rounded-md bg-white p-2 shadow-sm">
        <p className="text-[8px] font-semibold leading-tight">PO-2025-1247 | Sharma Interiors Pvt Ltd</p>
        <p className="mt-1 text-[8px] font-medium" style={{ color: '#22c55e' }}>
          Status: Delivered
        </p>
        <div className="mt-2 border-t border-[#1a1612]/8 pt-1.5">
          <div className="flex justify-between border-b border-[#1a1612]/6 py-1 text-[8px]">
            <span className="text-[#1a1612]/80">Cement</span>
            <span className="font-medium">150 bags</span>
          </div>
          <div className="flex justify-between py-1 text-[8px]">
            <span className="text-[#1a1612]/80">TMT Bar</span>
            <span className="font-medium">20 units</span>
          </div>
        </div>
      </div>
    </div>
  )
}

function PmsPanelTeamAttendance() {
  return (
    <div
      className={`flex h-[200px] w-full flex-col rounded-lg bg-[#e8e6e3] p-2 ${ui}`}
      aria-hidden
    >
      <div className="mb-1.5 flex flex-wrap items-center justify-between gap-1 border-b border-[#1a1612]/10 pb-1.5">
        <span className="text-[10px] font-semibold">Attendance</span>
        <div className="flex items-center gap-1.5 text-[8px] font-semibold">
          <span style={{ color: '#22c55e' }}>38 Present</span>
          <span className="text-[#1a1612]/30">|</span>
          <span style={{ color: '#ef4444' }}>4 Absent</span>
        </div>
      </div>
      <div className="flex min-h-0 flex-1 flex-col gap-1.5">
        <div className="flex items-start gap-1.5 rounded-md bg-white p-1.5 shadow-sm">
          <div
            className="mt-0.5 h-7 w-7 shrink-0 rounded-full"
            style={{
              background: 'linear-gradient(135deg,#c9a465,#8b7355)',
            }}
          />
          <div className="min-w-0 flex-1">
            <p className="truncate text-[8px] font-semibold">Praveen — Designer</p>
            <p className="mt-0.5 text-[7px] font-medium" style={{ color: '#22c55e' }}>
              ● Present
            </p>
            <p className="mt-0.5 text-[7px] text-[#1a1612]/65">Punch In: 9:00AM</p>
          </div>
        </div>
        <div className="flex items-start gap-1.5 rounded-md bg-white p-1.5 shadow-sm">
          <div
            className="mt-0.5 h-7 w-7 shrink-0 rounded-full"
            style={{
              background: 'linear-gradient(135deg,#64748b,#475569)',
            }}
          />
          <div className="min-w-0 flex-1">
            <p className="truncate text-[8px] font-semibold">Anish Sharma — Site Supervisor</p>
            <p className="mt-0.5 text-[7px] font-medium" style={{ color: '#ef4444' }}>
              ● Absent
            </p>
            <button
              type="button"
              tabIndex={-1}
              className="mt-1 rounded border border-[#3b82f6]/40 bg-[#3b82f6]/10 px-1.5 py-0.5 text-[7px] font-semibold text-[#2563eb]"
            >
              Request Punch In
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function PmsPanelPayroll() {
  return (
    <div
      className={`flex h-[200px] w-full flex-col rounded-lg bg-[#e8e6e3] p-2 ${ui}`}
      aria-hidden
    >
      <div className="mb-1.5 flex items-center justify-between border-b border-[#1a1612]/10 pb-1.5">
        <span className="text-[10px] font-semibold">Payroll</span>
        <span
          className="rounded px-1.5 py-0.5 text-[8px] font-semibold"
          style={{ backgroundColor: 'rgba(34,197,94,0.15)', color: '#22c55e' }}
        >
          Paid
        </span>
      </div>
      <div className="min-h-0 flex-1 rounded-md bg-white p-2 shadow-sm">
        <p className="text-[9px] font-bold">Total Amount Paid: ₹5,200</p>
        <div className="mt-2 space-y-1.5 border-t border-[#1a1612]/8 pt-1.5">
          <div className="flex flex-col gap-0.5 rounded bg-[#f8f7f5] px-1.5 py-1 text-[7px] leading-snug">
            <span className="font-semibold">Praveen — Designer — 25 days — ₹1,200</span>
            <span className="font-medium" style={{ color: '#22c55e' }}>
              Credited
            </span>
          </div>
          <div className="flex flex-col gap-0.5 rounded bg-[#f8f7f5] px-1.5 py-1 text-[7px] leading-snug">
            <span className="font-semibold">Emily — Project Manager — 23 days — ₹2,000</span>
            <span className="font-medium" style={{ color: '#22c55e' }}>
              Credited
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

const PMS_CARDS = [
  { id: 'project-tracking', label: 'Project Tracking', Panel: PmsPanelProjectTracking },
  { id: 'material-orders', label: 'Material Orders', Panel: PmsPanelMaterialOrders },
  { id: 'team-attendance', label: 'Team Attendance', Panel: PmsPanelTeamAttendance },
  { id: 'manpower-payroll', label: 'Manpower & Payroll', Panel: PmsPanelPayroll },
]

function PmsMarqueeCards({ stripKey }) {
  return (
    <>
      {PMS_CARDS.map(({ id, label, Panel }) => (
        <div
          key={`${stripKey}-${id}`}
          className="flex w-[280px] shrink-0 flex-col rounded-xl bg-white p-3 shadow-[0_8px_30px_-8px_rgba(28,25,21,0.12),0_2px_8px_-4px_rgba(28,25,21,0.08)]"
        >
          <Panel />
          <p className="mt-3 text-center font-body text-[13px] font-medium text-brand-charcoal">{label}</p>
        </div>
      ))}
    </>
  )
}

export default function ProjectStudio() {
  return (
    <main className="flex-1">
      {/* Hero — two columns, light cream */}
      <section className="flex min-h-[max(600px,70vh)] items-center bg-[#faf9f7] py-20">
        <div className="mx-auto grid w-full max-w-[1400px] grid-cols-1 items-center gap-12 px-6 lg:grid-cols-2 lg:gap-16 lg:px-24">
          <div className="flex max-w-xl flex-col justify-center lg:max-w-none">
            <div className="flex flex-col gap-3">
              <div className="h-px w-14 shrink-0 bg-brand-brass" aria-hidden />
              <p className="font-body text-[11px] font-medium uppercase leading-none tracking-[0.22em] text-brand-brass">
                MAYWOOD PROCESS
              </p>
            </div>

            <AnimatedText
              text="A Process You Can Trust. Powered by Technology."
              tag="h1"
              getWordClassName={(_w, i, n) => (i >= n - 3 ? 'italic text-brand-brass' : '')}
              className="mt-8 font-display text-[clamp(32px,4.2vw,52px)] font-light leading-[1.06] text-[#1a1612]"
            />

            <p className="mt-6 max-w-[540px] font-body text-[15px] font-normal leading-relaxed text-brand-mist">
              Every Maywood project is managed through a structured process and AI-driven project management—ensuring
              transparency, speed, and complete control.
            </p>
          </div>

          <div className="flex w-full justify-center lg:justify-end">
            <img
              src="/assets/images/maywood-process-diagram.svg"
              alt="Maywood process cycle: Marketing, Sales, Design, Pre-Production, Production, Post-Production, Installation, and Post-Installation."
              className="h-auto w-full max-w-full rounded-xl object-contain shadow-[0_24px_60px_-24px_rgba(26,22,18,0.22),0_8px_24px_-12px_rgba(26,22,18,0.12)] lg:max-w-[560px]"
            />
          </div>
        </div>
      </section>

      {/* Project management systems — infinite marquee */}
      <section className="bg-[#faf9f7] px-0 py-16 lg:py-22">
        <div className="mx-auto max-w-[1400px] px-6 text-center lg:px-24">
          <h2 className="font-display text-[clamp(26px,3.2vw,40px)] font-normal leading-snug text-brand-charcoal">
            Managed by Advanced Project Management Systems
          </h2>
          <p className="mx-auto mt-4 max-w-[640px] font-body text-[15px] font-normal leading-relaxed text-brand-mist">
            We use cutting-edge, AI-enabled tools to plan, track, and manage every stage of your project in real time.
          </p>
        </div>

        <div className="process-pms-marquee-mask mt-12 w-full overflow-hidden" data-hide-custom-cursor>
          <div className="process-pms-marquee-track">
            <div className="flex shrink-0 gap-5 pr-5">
              <PmsMarqueeCards stripKey="a" />
            </div>
            <div className="flex shrink-0 gap-5 pr-5" aria-hidden>
              <PmsMarqueeCards stripKey="b" />
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
