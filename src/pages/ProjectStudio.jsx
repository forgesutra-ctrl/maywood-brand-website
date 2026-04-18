import SectionLabel from '../components/ui/SectionLabel'
import AnimatedText from '../components/ui/AnimatedText'

export default function ProjectStudio() {
  return (
    <main className="flex-1">
      <section className="flex min-h-[70vh] flex-col justify-center bg-brand-charcoal px-6 py-32 lg:px-24">
        <div className="mx-auto max-w-[640px] text-center">
          <SectionLabel light>Maywood Project Studio</SectionLabel>
          <AnimatedText
            text="Coming Soon"
            tag="h1"
            className="mt-8 justify-center font-display text-[clamp(36px,6vw,56px)] font-light leading-[1.06] text-brand-ivory"
          />
          <p className="mt-8 font-body text-[15px] font-normal leading-relaxed text-brand-mist-light">
            We&apos;re preparing something new — our end-to-end project journey, tools, and resources in one place.
          </p>
        </div>
      </section>
    </main>
  )
}
