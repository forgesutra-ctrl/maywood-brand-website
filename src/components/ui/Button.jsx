import { forwardRef } from 'react'
import { motion } from 'framer-motion'
import { buttonClasses } from '../../lib/buttonStyles'

const MotionButton = motion.button

const motionEase = [0.16, 1, 0.3, 1]

const Button = forwardRef(function Button(
  { variant = 'primary', children, onClick, className = '', type = 'button', ...rest },
  ref,
) {
  return (
    <MotionButton
      ref={ref}
      type={type}
      onClick={onClick}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'tween', duration: 0.15, ease: motionEase }}
      className={buttonClasses(variant, className)}
      {...rest}
    >
      {children}
    </MotionButton>
  )
})

export default Button
