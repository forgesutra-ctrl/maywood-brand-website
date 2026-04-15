import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

const MotionSpan = motion.span

const ease = [0.16, 1, 0.3, 1]

const allowedTags = new Set(['h1', 'h2', 'h3'])

export default function AnimatedText({ text, tag = 'h2', className = '', getWordClassName }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-12% 0px' })
  const words = text.trim().split(/\s+/).filter(Boolean)
  const Tag = allowedTags.has(tag) ? tag : 'h2'
  const n = words.length

  return (
    <Tag ref={ref} className={['flex flex-wrap', className].join(' ')}>
      {words.map((word, i) => (
        <span key={`${word}-${i}`} className="inline-block overflow-hidden pb-[0.06em]">
          <MotionSpan
            className={['inline-block', getWordClassName?.(word, i, n)].filter(Boolean).join(' ')}
            initial={{ y: 24, opacity: 0 }}
            animate={inView ? { y: 0, opacity: 1 } : { y: 24, opacity: 0 }}
            transition={{
              duration: 0.7,
              ease,
              delay: i * 0.06,
            }}
          >
            {word}
            {i < words.length - 1 ? '\u00A0' : ''}
          </MotionSpan>
        </span>
      ))}
    </Tag>
  )
}
