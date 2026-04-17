import { Link } from 'react-router-dom'
import SectionLabel from '../components/ui/SectionLabel'
import AnimatedText from '../components/ui/AnimatedText'
import { buttonClasses } from '../lib/buttonStyles'
import { IMAGES } from '../config/images'

export default function MaywoodPlys() {
  return (
    <main className="flex-1">
      <section className="relative flex min-h-[60vh] flex-col justify-center overflow-hidden px-6 py-24 lg:px-24">
        <img
          src={IMAGES.kitchens.hero}
          alt="Modular kitchen design — Maywood Interiors Bangalore"
          loading="eager"
          className="absolute inset-0 h-full w-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-[#1C1915]/70" aria-hidden />
        <div className="relative z-[2] mx-auto w-full max-w-[1400px]">
          <SectionLabel light>Maywood Plys</SectionLabel>
          <AnimatedText
            text="In-house plywood. Better pricing. Full traceability."
            tag="h1"
            getWordClassName={(_w, i) => (i >= 3 ? 'italic text-[#D4B483]' : '')}
            className="mt-8 max-w-[900px] font-display text-[clamp(36px,5vw,56px)] font-light leading-[1.08] text-brand-ivory"
          />
          <p className="mt-6 max-w-[520px] font-body text-[15px] font-normal leading-[1.85] text-brand-mist-light">
            Our own plywood range cuts supplier markups and gives every Maywood project a consistent, certified core — from
            kitchens to commercial fit-outs.
          </p>
          <Link to="/#consultation" className={['mt-10 inline-flex', buttonClasses('primary')].join(' ')}>
            Talk to a Materials Specialist
          </Link>
        </div>
      </section>

      <section className="grid grid-cols-1 bg-brand-ivory lg:grid-cols-2">
        <div className="relative min-h-[360px] max-w-full overflow-hidden lg:min-h-[480px]">
          <img
            src={IMAGES.wardrobes.hero}
            alt="Wardrobe interior — Maywood Interiors Bangalore"
            loading="lazy"
            className="h-full w-full min-h-[480px] object-cover object-center"
          />
        </div>
        <div className="flex flex-col justify-center px-6 py-16 lg:px-12 lg:py-20 xl:pr-24">
          <SectionLabel>Why Maywood Plys</SectionLabel>
          <h2 className="mt-6 font-display text-[clamp(28px,3.5vw,36px)] font-normal leading-[1.12] text-brand-charcoal">
            Grade you can specify. Supply you can trust.
          </h2>
          <p className="mt-6 font-body text-[14px] font-normal leading-[1.9] text-brand-mist">
            We manufacture and season our own boards, so moisture content, bonding and dimensional stability stay within
            tight tolerances — the foundation for furniture that lasts in Bangalore&apos;s climate.
          </p>
        </div>
      </section>

      <section className="bg-brand-ivory-deep px-6 py-20 lg:px-24">
        <div className="mx-auto max-w-[1100px]">
          <SectionLabel>Grades &amp; Finishes</SectionLabel>
          <AnimatedText
            text="One source. Every project."
            tag="h2"
            className="mt-6 font-display text-[clamp(28px,4vw,40px)] font-light leading-[1.1] text-brand-charcoal"
          />
          <div className="relative mt-12 aspect-[16/9] max-h-[520px] w-full overflow-hidden">
            <img
              src={IMAGES.livingRooms.wide}
              alt="Living and dining interior — Maywood Interiors Bangalore"
              loading="lazy"
              className="h-full w-full object-cover object-center"
            />
          </div>
        </div>
      </section>
    </main>
  )
}
