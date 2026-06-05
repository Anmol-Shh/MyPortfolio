import type { RefObject } from 'react'
import gsap from 'gsap'

// ============================================================================
// Animation Configuration Constants
// ============================================================================

/**
 * Standard animation durations in milliseconds.
 * Use these constants for consistent timing across the application.
 */
export const ANIMATION_DURATION = {
  instant: 0,
  fast: 150,
  normal: 300,
  medium: 600,
  slow: 800,
  verySlow: 1200,
} as const

/**
 * Standard easing functions for animations.
 * These provide consistent motion curves throughout the application.
 */
export const ANIMATION_EASING = {
  easeOut: 'cubic-bezier(0.33, 1, 0.68, 1)',
  easeIn: 'cubic-bezier(0.32, 0, 0.67, 0)',
  easeInOut: 'cubic-bezier(0.65, 0, 0.35, 1)',
  spring: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  power2Out: 'power2.out',
  power3Out: 'power3.out',
  power2InOut: 'power2.inOut',
} as const

/**
 * Stagger delays for sequential animations in milliseconds.
 */
export const STAGGER_DELAY = {
  fast: 60,
  normal: 100,
  medium: 150,
  slow: 200,
} as const

/**
 * Performance budget constants.
 * Target 60fps = 16.67ms per frame.
 */
export const PERFORMANCE_BUDGET = {
  maxFrameTime: 16.67, // 60fps
  targetFPS: 60,
  maxAnimations: 10,
  maxParticles: 100,
} as const

// ============================================================================
// Shadow Depth Hierarchy
// ============================================================================

/**
 * Consistent shadow depths for elevation hierarchy.
 * Use these for cards, buttons, and other elevated elements.
 */
export const SHADOW_DEPTH = {
  none: 'none',
  sm: '0 1px 2px rgba(0, 0, 0, 0.05)',
  md: '0 4px 6px rgba(0, 0, 0, 0.07)',
  lg: '0 10px 15px rgba(0, 0, 0, 0.1)',
  xl: '0 20px 25px rgba(0, 0, 0, 0.15)',
  '2xl': '0 25px 50px rgba(0, 0, 0, 0.25)',
} as const

/**
 * Glow shadow variants for interactive elements.
 * These adapt to theme colors and provide visual feedback.
 */
export const GLOW_SHADOW = {
  violet: {
    sm: '0 0 10px rgba(139, 92, 246, 0.3)',
    md: '0 0 20px rgba(139, 92, 246, 0.4)',
    lg: '0 0 30px rgba(139, 92, 246, 0.5)',
  },
  purple: {
    sm: '0 0 10px rgba(168, 85, 247, 0.3)',
    md: '0 0 20px rgba(168, 85, 247, 0.4)',
    lg: '0 0 30px rgba(168, 85, 247, 0.5)',
  },
  pink: {
    sm: '0 0 10px rgba(236, 72, 153, 0.3)',
    md: '0 0 20px rgba(236, 72, 153, 0.4)',
    lg: '0 0 30px rgba(236, 72, 153, 0.5)',
  },
} as const

// ============================================================================
// Reusable Animation Variants for Micro-Interactions
// ============================================================================

/**
 * Framer Motion animation variants for common micro-interactions.
 * Use these with motion components for consistent behavior.
 */
export const microInteractions = {
  button: {
    rest: { scale: 1, y: 0 },
    hover: { scale: 1.05, y: -2 },
    tap: { scale: 0.95, y: 0 },
  },
  link: {
    rest: { x: 0 },
    hover: { x: 4 },
    tap: { scale: 0.98 },
  },
  card: {
    rest: { y: 0, scale: 1 },
    hover: { y: -8, scale: 1.02 },
    tap: { scale: 0.98 },
  },
  badge: {
    rest: { y: 0, scale: 1, rotate: 0 },
    hover: { y: -6, scale: 1.05, rotate: -2 },
    tap: { scale: 0.95 },
  },
  icon: {
    rest: { scale: 1, rotate: 0 },
    hover: { scale: 1.15, rotate: 5 },
    tap: { scale: 0.9 },
  },
} as const

/**
 * Transition configurations for micro-interactions.
 * Provides consistent timing and easing for interactive elements.
 */
export const microTransitions = {
  fast: {
    duration: ANIMATION_DURATION.fast / 1000, // Convert to seconds for Framer Motion
    ease: 'easeOut',
  },
  normal: {
    duration: ANIMATION_DURATION.normal / 1000,
    ease: 'easeOut',
  },
  spring: {
    type: 'spring' as const,
    stiffness: 300,
    damping: 20,
  },
} as const

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Calculate stagger delay for sequential animations.
 * @param index - The index of the element in the sequence
 * @param baseDelay - Base delay in seconds
 * @returns Total delay in seconds
 */
export function calculateStaggerDelay(index: number, baseDelay: number): number {
  return index * baseDelay
}

/**
 * Get animation configuration based on reduced motion preference.
 * @param prefersReducedMotion - Whether user prefers reduced motion
 * @returns Animation configuration object
 */
export function getAnimationConfig(options: { prefersReducedMotion: boolean }): {
  duration: number
  shouldAnimate: boolean
} {
  if (options.prefersReducedMotion) {
    return {
      duration: 0,
      shouldAnimate: false,
    }
  }
  return {
    duration: ANIMATION_DURATION.normal,
    shouldAnimate: true,
  }
}

/** Apply visible fallback styles when GSAP fails to load. */
function applyFallback(container: Element): void {
  const elements = container.querySelectorAll<HTMLElement>('*')
  container instanceof HTMLElement && Object.assign(container.style, { opacity: '1', transform: 'none' })
  elements.forEach((el) => {
    Object.assign(el.style, { opacity: '1', transform: 'none' })
  })
}

/**
 * Creates the preloader entrance + exit timeline.
 * NOTE: The new Preloader component manages its own GSAP context internally.
 * This function is kept for backward compatibility with tests.
 */
export function createPreloaderTimeline(
  containerRef: RefObject<Element | null>,
): gsap.core.Timeline {
  const tl = gsap.timeline({ paused: true })

  try {
    const container = containerRef.current
    if (!container) return tl

    const letters = container.querySelectorAll('.preloader-letter')

    if (letters.length > 0) {
      tl.fromTo(
        letters,
        { opacity: 0, y: 40, scale: 0.8 },
        { opacity: 1, y: 0, scale: 1, duration: 0.6, stagger: 0.15, ease: 'power3.out' },
      )
        .to(letters, { opacity: 1, duration: 0.4 }, '+=0.3')
        .to(container, { opacity: 0, duration: 0.3 }, '+=0.2')
    }
  } catch {
    if (containerRef.current) applyFallback(containerRef.current)
  }

  return tl
}

/**
 * Creates the hero section entrance timeline.
 * Staggers name, title, tagline, and CTA into view within 1200ms.
 */
export function createHeroEntranceTimeline(
  containerRef: RefObject<Element | null>,
): gsap.core.Timeline {
  const tl = gsap.timeline({ paused: true })

  try {
    const container = containerRef.current
    if (!container) return tl

    const elements = container.querySelectorAll('.hero-animate')

    gsap.set(elements, { opacity: 0, y: 60 })

    tl.to(elements, {
      opacity: 1,
      y: 0,
      duration: 0.7,
      stagger: 0.18,
      ease: 'power3.out',
    })
  } catch {
    if (containerRef.current) applyFallback(containerRef.current)
  }

  return tl
}

/**
 * Creates a generic scroll-triggered section reveal timeline.
 * Fades and slides child elements up with a configurable stagger.
 */
export function createSectionRevealTimeline(
  containerRef: RefObject<Element | null>,
  staggerDelay = 0.1,
): gsap.core.Timeline {
  const tl = gsap.timeline({ paused: true })

  try {
    const container = containerRef.current
    if (!container) return tl

    const elements = container.querySelectorAll('.reveal-animate')

    gsap.set(elements, { opacity: 0, y: 40 })

    tl.to(elements, {
      opacity: 1,
      y: 0,
      duration: 0.6,
      stagger: staggerDelay,
      ease: 'power2.out',
    })
  } catch {
    if (containerRef.current) applyFallback(containerRef.current)
  }

  return tl
}

/**
 * Creates the experience timeline draw animation.
 * Draws the vertical line from top to bottom, then fades in role cards.
 * Enhanced with longer duration (1200ms) and staggered card reveals (150ms).
 */
export function createTimelineDrawTimeline(
  containerRef: RefObject<Element | null>,
): gsap.core.Timeline {
  const tl = gsap.timeline({ paused: true })

  try {
    const container = containerRef.current
    if (!container) return tl

    const line = container.querySelector('.timeline-line')
    const cards = container.querySelectorAll('.timeline-card')

    if (line) {
      gsap.set(line, { scaleY: 0, transformOrigin: 'top' })
      // Enhanced: Increased duration from 800ms to 1200ms per requirements
      tl.to(line, { scaleY: 1, duration: 1.2, ease: ANIMATION_EASING.power2InOut })
    }

    if (cards.length > 0) {
      gsap.set(cards, { opacity: 0, x: -30, scale: 0.95 })
      // Enhanced: Stagger reduced from 200ms to 150ms, added scale animation
      tl.to(
        cards,
        { 
          opacity: 1, 
          x: 0, 
          scale: 1,
          duration: 0.5, 
          stagger: STAGGER_DELAY.medium / 1000, // 150ms
          ease: ANIMATION_EASING.power2Out 
        },
        '-=0.3',
      )
    }
  } catch {
    if (containerRef.current) applyFallback(containerRef.current)
  }

  return tl
}
