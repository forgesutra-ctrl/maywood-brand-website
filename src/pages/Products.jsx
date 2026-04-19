import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import ProcessSection from '../components/sections/ProcessSection'
import SectionLabel from '../components/ui/SectionLabel'
import AnimatedText from '../components/ui/AnimatedText'
import { buttonClasses } from '../lib/buttonStyles'
import { ProductsBrassCta } from '../components/products/ProductSubPage'
import { IMAGES } from '../config/images'

const MotionLink = motion(Link)

const tapTransition = { type: 'tween', duration: 0.15, ease: [0.16, 1, 0.3, 1] }
const motionEase = [0.16, 1, 0.3, 1]

const categories = [
  {
    to: '/products/home-interiors',
    tag: 'Residential',
    title: 'Home Interiors',
    desc: 'Kitchens, wardrobes, living rooms, home offices — complete home transformations built to last.',
    imageSrc: IMAGES.livingRooms.hero,
    imageAlt: 'Premium Indian living room interior — Maywood Interiors Bangalore',
  },
  {
    to: '/products/corporate-spaces',
    tag: 'Commercial',
    title: 'Corporate & Office Spaces',
    desc: 'From startup studios to enterprise campuses — workspaces that reflect your culture and scale.',
    imageSrc: IMAGES.corporate.hero,
    imageAlt: 'Corporate office interior — Maywood Interiors Bangalore',
  },
  {
    to: '/products/spas-salons',
    tag: 'Wellness',
    title: 'Spas & Salons',
    desc: 'Sensory environments that build loyalty. Material choices that withstand daily professional use.',
    imageSrc: IMAGES.spas.hero,
    imageAlt: 'Spa reception — Maywood Interiors Bangalore',
  },
  {
    to: '/products/retail-spaces',
    tag: 'Retail',
    title: 'Retail Spaces',
    desc: 'Fit-outs designed to maximize footfall, dwell time, and brand recall across every touchpoint.',
    imageSrc: '/assets/images/generated/retail-storefront-facade.png',
    imageAlt: 'Hospitality lounge interior — Maywood Interiors Bangalore',
  },
  {
    to: '/products/hotels-cafes',
    tag: 'Hospitality',
    title: 'Hotels, Cafes & Restaurants',
    desc: 'Atmosphere is revenue. We design and build immersive hospitality environments across Bangalore.',
    imageSrc: '/assets/images/generated/hospitality-event-spaces.png',
    imageAlt: 'Office breakout lounge — Maywood Interiors Bangalore',
  },
]

const cardVariants = {
  rest: {},
  hover: {},
}

const bottomBarVariants = {
  rest: { scaleX: 0 },
  hover: { scaleX: 1, transition: { duration: 0.35, ease: motionEase } },
}

export default function Products() {
  return (
    <main className="flex-1">
      <section className="relative flex min-h-[60vh] flex-col justify-center overflow-hidden px-6 py-32 lg:px-24">
        <img
          src="/assets/images/products-hero.png"
          alt=""
          loading="eager"
          decoding="async"
          className="absolute inset-0 z-0 h-full w-full object-cover object-center"
          onError={(e) => {
            e.currentTarget.src = '/assets/images/fallback.jpg'
          }}
        />
        <div className="absolute inset-0 z-0 bg-black/70" aria-hidden />
        <div className="relative z-10 mx-auto w-full max-w-[1400px]">
          <SectionLabel light>Products & Services</SectionLabel>

          <AnimatedText
            text="Everything interiors. Nothing outsourced."
            tag="h1"
            getWordClassName={(_w, i) => (i >= 2 ? 'italic text-[#D4B483]' : '')}
            className="mt-8 max-w-[1100px] font-display text-[62px] font-light leading-[1.06] text-brand-ivory max-lg:text-[clamp(40px,8vw,62px)]"
          />

          <p className="mt-8 max-w-[500px] font-body text-[15px] font-normal leading-[1.85] text-brand-mist-light">
            From a single modular kitchen to a complete commercial fit-out — Maywood handles design, manufacturing and
            installation in-house.
          </p>

          <div className="mt-12 flex w-full max-w-xl flex-col gap-4 sm:max-w-none sm:flex-row sm:items-center">
            <MotionLink
              to="/instant-quote"
              className={['inline-flex w-full justify-center sm:w-auto', buttonClasses('ctaPrimary', 'focus-visible:ring-offset-[#1C1915]')].join(' ')}
              whileTap={{ scale: 0.98 }}
              transition={tapTransition}
            >
              Get Instant Quote
            </MotionLink>
            <MotionLink
              to="/experience-centers"
              className={['inline-flex w-full justify-center sm:w-auto', buttonClasses('ctaSecondary', 'focus-visible:ring-offset-[#1C1915]')].join(' ')}
              whileTap={{ scale: 0.98 }}
              transition={tapTransition}
            >
              Book free consultation
            </MotionLink>
          </div>
        </div>
      </section>

      <section className="bg-brand-ivory px-6 py-32 lg:px-24">
        <div className="mx-auto max-w-[1400px]">
          <SectionLabel>Our Segments</SectionLabel>
          <AnimatedText
            text="Choose your space type."
            tag="h2"
            className="mt-6 max-w-[900px] font-display text-[clamp(30px,4vw,48px)] font-light leading-[1.08] text-brand-charcoal"
          />

          <ul className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-6">
            {categories.map((c, i) => (
              <motion.li
                key={c.to}
                className={[
                  'md:col-span-2',
                  i === 3 ? 'md:col-start-2' : '',
                  i === 4 ? 'md:col-start-4' : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
                initial="rest"
                whileHover="hover"
                variants={cardVariants}
              >
                <Link to={c.to} className="group relative block h-full bg-brand-ivory text-left">
                  <div className="relative h-[280px] max-w-full overflow-hidden">
                    <img
                      src={c.imageSrc}
                      alt={c.imageAlt}
                      loading="lazy"
                      className="w-full h-full object-cover object-[center_28%] block"
                      onError={(e) => {
                        e.currentTarget.src = '/assets/images/fallback.jpg'
                      }}
                    />
                    <div
                      className="absolute inset-0 bg-brand-brass opacity-0 transition-opacity duration-300 group-hover:opacity-[0.08]"
                      aria-hidden
                    />
                  </div>
                  <div className="p-8">
                    <p className="font-body text-[10px] font-medium uppercase tracking-[0.18em] text-brand-brass">
                      {c.tag}
                    </p>
                    <h3 className="mt-3 font-display text-[26px] font-normal leading-snug text-brand-charcoal">
                      {c.title}
                    </h3>
                    <p className="mt-3 font-body text-[13px] font-normal leading-[1.8] text-brand-mist">{c.desc}</p>
                    <span className="mt-5 inline-block font-body text-[12px] font-medium uppercase tracking-[0.14em] text-brand-brass transition-opacity group-hover:opacity-80">
                      Explore →
                    </span>
                  </div>
                  <motion.div
                    className="pointer-events-none absolute bottom-0 left-0 right-0 h-0.5 origin-left bg-brand-brass"
                    variants={bottomBarVariants}
                  />
                </Link>
              </motion.li>
            ))}
          </ul>
        </div>
      </section>

      <ProcessSection sectionId="process-products" />
      <ProductsBrassCta />
    </main>
  )
}
