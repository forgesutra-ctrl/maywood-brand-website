import { Link } from 'react-router-dom'
import SectionLabel from '../components/ui/SectionLabel'
import AnimatedText from '../components/ui/AnimatedText'
import { IMAGES } from '../config/images'

const STATS = [
  { value: '9 Years', label: 'In Business' },
  { value: '500+', label: 'Projects Completed' },
  { value: '200+', label: 'Team Members' },
  { value: '3', label: 'Business Verticals' },
]

export default function AboutUs() {
  return (
    <main className="flex-1">
      <section className="relative flex min-h-[65vh] flex-col justify-center overflow-hidden bg-brand-charcoal px-6 py-32 lg:px-24">
        <div className="mx-auto grid w-full max-w-[1400px] grid-cols-1 items-center gap-12 lg:grid-cols-[3fr_2fr] lg:gap-16">
          <div className="relative z-[1]">
            <SectionLabel light>About Maywood</SectionLabel>
            <AnimatedText
              text="We build spaces. We've been doing it since 2015."
              tag="h1"
              getWordClassName={(_w, i) => (i >= 7 ? 'italic text-[#D4B483]' : '')}
              className="mt-8 max-w-[900px] font-display text-[58px] font-light leading-[1.06] text-brand-ivory max-lg:text-[clamp(36px,8vw,58px)]"
            />
            <p className="mt-8 max-w-[480px] font-body text-[15px] font-normal leading-[1.85] text-brand-mist-light">
              Maywood started as a single design studio in Bangalore. Today we are a vertically integrated interior company —
              with our own plywood, our own factory, our own finance arm, and a team of 200+ people. The obsession with
              quality hasn&apos;t changed.
            </p>
          </div>
          <div className="relative z-[1] min-h-[360px] overflow-hidden lg:min-h-[460px]">
            <img
              src={IMAGES.livingRooms.wide}
              alt="Living and dining interior — Maywood Interiors Bangalore"
              loading="eager"
              className="w-full h-full min-h-[360px] object-cover object-[center_30%] block lg:min-h-[460px]"
              onError={(e) => {
                e.currentTarget.src = '/assets/images/fallback.jpg'
              }}
            />
          </div>
        </div>
      </section>

      <section className="bg-brand-ivory px-6 py-32 lg:px-24">
        <div className="mx-auto max-w-[1400px]">
          <SectionLabel>Our Story</SectionLabel>
          <AnimatedText
            text="From one studio to one roof."
            tag="h2"
            getWordClassName={(_w, i) => (i >= 4 ? 'italic' : '')}
            className="mt-6 max-w-[900px] font-display text-[clamp(30px,4vw,48px)] font-light leading-[1.08] text-brand-charcoal"
          />

          <div className="mt-14 grid grid-cols-1 gap-10 lg:grid-cols-[3fr_2fr] lg:gap-16 lg:items-start">
            <div>
              <p className="font-display text-[20px] font-normal leading-[1.75] text-brand-charcoal">
                Maywood began in 2015 with a simple conviction: that Bangalore deserved an interior company that could be held
                accountable end to end. Not a firm that designed and then handed you to contractors. Not a brand that sold you
                materials and left you to figure out the rest.
              </p>
            </div>
            <div className="font-body text-[13px] font-normal leading-[1.9] text-brand-mist">
              <p>
                We started with home interiors. Then we built our manufacturing facility to take control of quality and
                timelines. Then we launched Maywood Plys — our own plywood range — to own the material supply chain. Then
                Maywood Finance, to remove the budget barrier entirely.
              </p>
              <p className="mt-6">
                Today, every project that leaves Maywood is touched only by Maywood people — from the first design sketch to
                the final coat of polish. That&apos;s the difference.
              </p>
              <p className="mt-6">
                See how that scope maps to homes, offices, and hospitality on our{' '}
                <Link
                  to="/products"
                  className="text-brand-brass underline-offset-2 transition-colors hover:text-brand-charcoal hover:underline"
                >
                  products and services hub
                </Link>
                .
              </p>
              <p className="mt-6">
                Meet the{' '}
                <Link to="/team" className="text-brand-brass underline-offset-2 transition-colors hover:text-brand-charcoal hover:underline">
                  people and leadership
                </Link>{' '}
                behind our work, and read about our{' '}
                <Link
                  to="/awards-certifications"
                  className="text-brand-brass underline-offset-2 transition-colors hover:text-brand-charcoal hover:underline"
                >
                  industry recognition and ISO certifications
                </Link>
                .
              </p>
            </div>
          </div>

          <div className="relative mt-14 aspect-[21/9] max-h-[420px] w-full min-h-[200px] overflow-hidden">
            <img
              src="/assets/images/generated/about-design-studio.png"
              alt="Corporate reception — Maywood Interiors Bangalore"
              loading="lazy"
              className="w-full h-full object-cover object-[center_28%] block"
              onError={(e) => {
                e.currentTarget.src = '/assets/images/fallback.jpg'
              }}
            />
          </div>
        </div>
      </section>

      <section className="bg-brand-brass px-6 py-24 lg:px-24">
        <div className="mx-auto max-w-[1400px]">
          <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
            {STATS.map(({ value, label }) => (
              <div key={label} className="text-center">
                <p className="font-display text-[64px] font-light leading-none text-brand-charcoal">{value}</p>
                <p className="mt-4 font-body text-[11px] font-medium uppercase tracking-[0.18em] text-brand-charcoal/65">
                  {label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
