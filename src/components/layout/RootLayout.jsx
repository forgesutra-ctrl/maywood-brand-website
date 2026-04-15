import { AnimatePresence, motion as motionPrim } from 'framer-motion'
import { Outlet, useLocation } from 'react-router-dom'
import CustomCursor from './CustomCursor'
import Footer from './Footer'
import GrainOverlay from './GrainOverlay'
import Navbar from './Navbar'
import ScrollProgress from './ScrollProgress'

const MotionDiv = motionPrim.div

const pageVariants = {
  initial: { opacity: 0, y: 16 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: [0.33, 1, 0.68, 1] },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.2 },
  },
}

export default function RootLayout() {
  const location = useLocation()

  return (
    <div className="flex min-h-screen flex-col font-body text-brand-charcoal">
      <GrainOverlay />
      <ScrollProgress />
      <CustomCursor />
      <Navbar />
      <AnimatePresence mode="wait">
        <MotionDiv
          key={location.pathname}
          className="flex min-h-0 flex-1 flex-col"
          variants={pageVariants}
          initial="initial"
          animate="animate"
          exit="exit"
        >
          <Outlet />
        </MotionDiv>
      </AnimatePresence>
      <Footer />
    </div>
  )
}
