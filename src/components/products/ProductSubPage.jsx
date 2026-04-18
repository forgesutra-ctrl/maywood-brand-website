import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import ProcessSection from '../sections/ProcessSection'
import SectionLabel from '../ui/SectionLabel'
import AnimatedText from '../ui/AnimatedText'
import { buttonBaseClass, buttonClasses } from '../../lib/buttonStyles'

const MotionLink = motion(Link)

const tapTransition = { type: 'tween', duration: 0.15, ease: [0.16, 1, 0.3, 1] }

export function ProductsBrassCta() {
  return (
    <section className="bg-brand-brass px-6 py-20 text-center lg:px-24">
      <div className="mx-auto max-w-[720px]">
        <AnimatedText
          text="Not sure where to start?"
          tag="h2"
          className="mx-auto justify-center font-display text-[clamp(30px,4vw,44px)] font-light leading-[1.08] text-brand-charcoal"
        />
        <p className="mx-auto mt-6 max-w-md font-body text-[15px] font-normal leading-relaxed text-brand-charcoal/70">
          Talk to a Maywood designer — free, no obligation.
        </p>
        <div className="mx-auto mt-10 flex w-full max-w-sm flex-col gap-4 sm:max-w-none sm:flex-row sm:justify-center">
          <MotionLink
            to="/instant-quote"
            className={['inline-flex w-full justify-center sm:w-auto', buttonClasses('primary')].join(' ')}
            whileTap={{ scale: 0.98 }}
            transition={tapTransition}
          >
            Get Instant Quote
          </MotionLink>
          <MotionLink
            to="/experience-centers"
            className={[
              buttonBaseClass,
              'inline-flex w-full justify-center rounded-[2px] px-9 py-[14px] sm:w-auto',
              'border border-[rgba(28,25,21,0.45)] bg-transparent text-brand-charcoal hover:border-brand-charcoal',
              'focus-visible:ring-offset-brand-brass',
            ].join(' ')}
            whileTap={{ scale: 0.98 }}
            transition={tapTransition}
          >
            Book free consultation
          </MotionLink>
        </div>
      </div>
    </section>
  )
}

export default function ProductSubPage({
  breadcrumbName,
  categoryTag,
  heroHeadline,
  heroItalicFromIndex,
  heroSubtext,
  heroImageSrc,
  heroImageAlt,
  heroOverlayClassName = 'bg-[#1C1915]/70',
  overviewHeading,
  overviewBody,
  overviewFeatures,
  overviewImageSrc,
  overviewImageAlt,
  scopeAnimatedTitle,
  scopeCards,
  processSectionId = 'process-products',
}) {
  return (
    <main className="flex-1">
      <section className="relative flex min-h-[65vh] flex-col justify-center overflow-hidden px-6 py-16 lg:px-24 lg:py-32">
        <img
          src={heroImageSrc}
          alt={heroImageAlt}
          loading="eager"
          className="absolute inset-0 w-full h-full object-cover object-center block"
          onError={(e) => {
            e.currentTarget.src = '/assets/images/fallback.jpg'
          }}
        />
        <div className={['absolute inset-0', heroOverlayClassName].filter(Boolean).join(' ')} aria-hidden />
        <div className="relative z-[2] mx-auto w-full max-w-[1400px]">
          <nav className="font-body text-[11px] font-normal text-brand-mist-light" aria-label="Breadcrumb">
            <Link to="/products" className="transition-colors hover:text-brand-brass-light">
              Products & Services
            </Link>
            <span className="mx-1.5 text-brand-mist" aria-hidden>
              →
            </span>
            <span className="text-brand-ivory/80">{breadcrumbName}</span>
          </nav>

          <SectionLabel light className="mt-8">
            {categoryTag}
          </SectionLabel>

          <AnimatedText
            text={heroHeadline}
            tag="h1"
            getWordClassName={(_w, i) => (i >= heroItalicFromIndex ? 'italic text-[#D4B483]' : '')}
            className="mt-8 max-w-[1000px] font-display text-[clamp(38px,5vw,58px)] font-light leading-[1.06] text-brand-ivory"
          />

          <p className="mt-6 max-w-[480px] font-body text-[15px] font-normal leading-[1.85] text-brand-mist-light">
            {heroSubtext}
          </p>

          <div className="mt-10 flex w-full max-w-xl flex-col gap-4 sm:max-w-none sm:flex-row sm:items-center">
            <MotionLink
              to="/instant-quote"
              className={buttonClasses('primary', 'w-full justify-center sm:w-auto')}
              whileTap={{ scale: 0.98 }}
              transition={tapTransition}
            >
              Get Instant Quote
            </MotionLink>
            <MotionLink
              to="/experience-centers"
              className={buttonClasses('ghost', 'w-full justify-center text-brand-brass-light hover:border-brand-brass-light sm:w-auto')}
              whileTap={{ scale: 0.98 }}
              transition={tapTransition}
            >
              Book free consultation
            </MotionLink>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 bg-brand-ivory lg:grid-cols-2">
        <div className="relative min-h-[360px] max-w-full overflow-hidden lg:min-h-[480px]">
          <img
            src={overviewImageSrc}
            alt={overviewImageAlt}
            loading="lazy"
            className="w-full h-full min-h-[480px] object-cover object-[center_30%] block"
            onError={(e) => {
              e.currentTarget.src = '/assets/images/fallback.jpg'
            }}
          />
        </div>
        <div className="flex flex-col justify-center px-6 py-16 lg:px-12 lg:py-20 xl:pr-24">
          <SectionLabel>What We Offer</SectionLabel>
          <h2 className="mt-6 font-display text-[clamp(28px,3.5vw,36px)] font-normal leading-[1.12] text-brand-charcoal">
            {overviewHeading}
          </h2>
          <p className="mt-6 font-body text-[14px] font-normal leading-[1.9] text-brand-mist">{overviewBody}</p>
          <ul className="mt-8 space-y-4">
            {overviewFeatures.map((line) => (
              <li key={line} className="flex gap-3 font-body text-[13px] font-normal leading-relaxed text-brand-charcoal">
                <span className="shrink-0 font-display text-brand-brass" aria-hidden>
                  —
                </span>
                <span>{line}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="bg-brand-ivory-deep px-6 py-16 lg:px-24 lg:py-28">
        <div className="mx-auto max-w-[1400px]">
          <SectionLabel>Scope of Work</SectionLabel>
          <AnimatedText
            text={scopeAnimatedTitle}
            tag="h2"
            className="mt-6 max-w-[900px] font-display text-[clamp(30px,4vw,44px)] font-light leading-[1.08] text-brand-charcoal"
          />
          <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-3 md:gap-8">
            {scopeCards.map((card) => (
              <article
                key={card.title}
                className="overflow-hidden rounded-[2px] border-[0.5px] border-brand-brass-pale bg-brand-ivory"
              >
                <div className="relative h-[180px] w-full max-w-full overflow-hidden">
                  <img
                    src={card.imageSrc}
                    alt={card.imageAlt}
                    loading="lazy"
                    className="w-full h-full object-cover object-[center_28%] block"
                    onError={(e) => {
                      e.currentTarget.src = '/assets/images/fallback.jpg'
                    }}
                  />
                </div>
                <div className="p-8">
                  <h3 className="font-display text-[20px] font-normal leading-snug text-brand-charcoal">{card.title}</h3>
                  <p className="mt-3 font-body text-[13px] font-normal leading-relaxed text-brand-mist">{card.body}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <ProcessSection sectionId={processSectionId} />
      <ProductsBrassCta />
    </main>
  )
}
