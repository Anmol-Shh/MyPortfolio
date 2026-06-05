import { useRef } from 'react'
import { motion } from 'framer-motion'
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver'

interface WordRevealProps {
  text: string
  className?: string
  as?: 'h1' | 'h2' | 'h3' | 'p'
  staggerDelay?: number
}

/**
 * Splits text into words and reveals each one with a staggered slide-up animation
 * when the element enters the viewport.
 */
export function WordReveal({
  text,
  className = '',
  as: Tag = 'h2',
  staggerDelay = 0.07,
}: WordRevealProps) {
  const ref = useRef<HTMLElement>(null)
  const isVisible = useIntersectionObserver(ref as React.RefObject<Element>, { threshold: 0.3 })

  const words = text.split(' ')

  return (
    <Tag
      ref={ref as React.RefObject<HTMLHeadingElement>}
      className={`pb-2 ${className}`}
      aria-label={text}
    >
      {words.map((word, i) => (
        <span key={i} className="inline-block overflow-hidden">
          <motion.span
            className="inline-block"
            initial={{ y: '110%', opacity: 0 }}
            animate={isVisible ? { y: 0, opacity: 1 } : { y: '110%', opacity: 0 }}
            transition={{
              duration: 0.55,
              delay: i * staggerDelay,
              ease: [0.33, 1, 0.68, 1],
            }}
          >
            {word}
          </motion.span>
          {i < words.length - 1 && <span className="inline-block">&nbsp;</span>}
        </span>
      ))}
    </Tag>
  )
}
