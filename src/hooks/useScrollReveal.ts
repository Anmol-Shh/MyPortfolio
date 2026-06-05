import { useState, useEffect, useRef, type RefObject } from 'react'

/**
 * Options for configuring scroll reveal behavior.
 */
export interface ScrollRevealOptions {
  /**
   * Threshold at which the element is considered visible (0-1).
   * 0 = as soon as any pixel is visible
   * 1 = entire element must be visible
   * @default 0.1
   */
  threshold?: number | number[]
  
  /**
   * Margin around the root element for intersection detection.
   * Can be used to trigger animations before element enters viewport.
   * @default '0px'
   */
  rootMargin?: string
  
  /**
   * Whether the animation should only trigger once.
   * If true, element stays visible after first reveal.
   * @default true
   */
  once?: boolean
  
  /**
   * Root element for intersection observation.
   * @default null (viewport)
   */
  root?: Element | null
}

/**
 * Hook for scroll-triggered reveal animations.
 * Uses IntersectionObserver to detect when an element enters the viewport.
 * 
 * @param {ScrollRevealOptions} options - Configuration options
 * @returns {{ ref: RefObject<Element>, isVisible: boolean }} - Ref to attach to element and visibility state
 * 
 * @example
 * ```tsx
 * function RevealSection() {
 *   const { ref, isVisible } = useScrollReveal({ threshold: 0.2, once: true })
 *   
 *   return (
 *     <div ref={ref} className={isVisible ? 'opacity-100' : 'opacity-0'}>
 *       Content that reveals on scroll
 *     </div>
 *   )
 * }
 * ```
 * 
 * @example
 * ```tsx
 * // With Framer Motion
 * function AnimatedSection() {
 *   const { ref, isVisible } = useScrollReveal()
 *   
 *   return (
 *     <motion.div
 *       ref={ref}
 *       initial={{ opacity: 0, y: 40 }}
 *       animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
 *       transition={{ duration: 0.6 }}
 *     >
 *       Content
 *     </motion.div>
 *   )
 * }
 * ```
 */
export function useScrollReveal(options: ScrollRevealOptions = {}): {
  ref: RefObject<Element | null>
  isVisible: boolean
} {
  const {
    threshold = 0.1,
    rootMargin = '0px',
    once = true,
    root = null,
  } = options

  const ref = useRef<Element>(null)
  const [isVisible, setIsVisible] = useState(false)
  const hasAnimated = useRef(false)

  useEffect(() => {
    const element = ref.current
    
    // Don't observe if element doesn't exist or has already animated (when once=true)
    if (!element || (once && hasAnimated.current)) {
      return
    }

    // Check if IntersectionObserver is supported
    if (typeof IntersectionObserver === 'undefined') {
      // Fallback: make element immediately visible
      setIsVisible(true)
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0]
        
        if (entry.isIntersecting) {
          setIsVisible(true)
          
          if (once) {
            hasAnimated.current = true
            observer.disconnect()
          }
        } else if (!once) {
          // If not "once", allow element to hide again when scrolling away
          setIsVisible(false)
        }
      },
      {
        threshold,
        rootMargin,
        root,
      },
    )

    observer.observe(element)

    return () => {
      observer.disconnect()
    }
  }, [threshold, rootMargin, once, root])

  return { ref, isVisible }
}
