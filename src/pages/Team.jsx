import TeamStudioRoom from '../components/about/TeamStudioRoom'

export default function Team() {
  return (
    <main className="flex-1 bg-[#f5f0eb]">
      <section
        className="flex min-h-[280px] flex-col justify-center bg-[#1a1612] px-8 py-20 lg:px-24"
        aria-labelledby="team-hero-title"
      >
        <div className="mx-auto w-full max-w-3xl text-center">
          <p className="mb-3 text-xs uppercase tracking-[0.2em] text-[#c9a465]">THE MAYWOOD TEAM</p>
          <div className="mx-auto mb-5 h-px w-12 bg-[#c9a465]" aria-hidden />
          <h1
            id="team-hero-title"
            className="font-serif text-5xl font-light leading-tight text-white"
          >
            The People Behind Maywood
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-center text-sm text-white/60">
            Experts in every department. Committed to every detail.
          </p>
        </div>
      </section>
      <TeamStudioRoom />
      <div className="bg-[#f5f0eb] px-6 pb-10 pt-2">
        <div className="mx-auto max-w-2xl border-t border-b border-[#c9a465] py-10 text-center">
          <p className="font-display text-xl font-normal italic leading-relaxed text-brand-charcoal/80">
            A structured system. A strong team. Consistent execution. Recognized. Certified. Trusted.
          </p>
        </div>
        <p className="mx-auto mt-4 max-w-2xl text-center font-body text-[13px] font-normal leading-relaxed text-brand-mist">
          Maywood combines structured processes with industry-recognized standards—ensuring quality, safety, and consistency
          across every project.
        </p>
      </div>
    </main>
  )
}
