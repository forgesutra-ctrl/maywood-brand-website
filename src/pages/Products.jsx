import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import ProcessSection from '../components/sections/ProcessSection'
import SectionLabel from '../components/ui/SectionLabel'
import AnimatedText from '../components/ui/AnimatedText'
import { buttonClasses } from '../lib/buttonStyles'
import { ProductsBrassCta } from '../components/products/ProductSubPage'

const MotionLink = motion(Link)

const tapTransition = { type: 'tween', duration: 0.15, ease: [0.16, 1, 0.3, 1] }
const motionEase = [0.16, 1, 0.3, 1]

const stripeStyle = {
  backgroundImage: `repeating-linear-gradient(
    45deg,
    #E8E2D8,
    #E8E2D8 4px,
    #DDD7CC 4px,
    #DDD7CC 8px
  )`,
}

function CardFrameIcon({ className = '' }) {
  return (
    <svg
      className={className}
      width="40"
      height="40"
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <rect x="6" y="8" width="28" height="24" rx="1" stroke="currentColor" strokeWidth="1.25" />
      <path
        d="M10 28 L16 20 L22 26 L28 18 L32 24"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="14" cy="14" r="2" fill="currentColor" />
    </svg>
  )
}

const categories = [
  {
    to: '/products/home-interiors',
    tag: 'Residential',
    title: 'Home Interiors',
    desc: 'Kitchens, wardrobes, living rooms, home offices — complete home transformations built to last.',
  },
  {
    to: '/products/corporate-spaces',
    tag: 'Commercial',
    title: 'Corporate & Office Spaces',
    desc: 'From startup studios to enterprise campuses — workspaces that reflect your culture and scale.',
  },
  {
    to: '/products/spas-salons',
    tag: 'Wellness',
    title: 'Spas & Salons',
    desc: 'Sensory environments that build loyalty. Material choices that withstand daily professional use.',
  },
  {
    to: '/products/retail-spaces',
    tag: 'Retail',
    title: 'Retail Spaces',
    desc: 'Fit-outs designed to maximize footfall, dwell time, and brand recall across every touchpoint.',
  },
  {
    to: '/products/hotels-cafes',
    tag: 'Hospitality',
    title: 'Hotels, Cafes & Restaurants',
    desc: 'Atmosphere is revenue. We design and build immersive hospitality environments across Bangalore.',
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
      <section className="flex min-h-[60vh] flex-col justify-center bg-brand-charcoal px-6 py-32 lg:px-24">
        <div className="mx-auto w-full max-w-[1400px]">
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

          <MotionLink
            to="/instant-quote"
            className={['mt-12 inline-flex', buttonClasses('primary')].join(' ')}
            whileTap={{ scale: 0.98 }}
            transition={tapTransition}
          >
            Get Instant Quote
          </MotionLink>
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
                  <div className="relative h-[280px] overflow-hidden" style={stripeStyle}>
                    <div
                      className="absolute inset-0 bg-brand-brass opacity-0 transition-opacity duration-300 group-hover:opacity-[0.08]"
                      aria-hidden
                    />
                    <div className="relative flex h-full flex-col items-center justify-center gap-3 text-brand-mist-light">
                      <CardFrameIcon className="opacity-90" />
                    </div>
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
