import { useState, useEffect } from 'react'

/**
 * Hook to detect user's reduced motion preference.
 * Respects the `prefers-reduced-motion` media query for accessibility.
 * 
 * @returns {boolean} True if user prefers reduced motion, false otherwise
 * 
 * @example
 * ```tsx
 * function AnimatedComponent() {
 *   const prefersReducedMotion = useReducedMotion()
 *   
 *   return (
 *     <motion.div
 *       animate={{ opacity: 1 }}
 *       transition={{ duration: prefersReducedMotion ? 0 : 0.3 }}
 *     >
 *       Content
 *     </motion.div>
 *   )
 * }
 * ```
 */
export function useReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  useEffect(() => {
    // Check if matchMedia is supported
    if (typeof window === 'undefined' || !window.matchMedia) {
      return
    }

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    
    // Set initial value
    setPrefersReducedMotion(mediaQuery.matches)

    // Listen for changes
    const handleChange = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches)
    }

    // Modern browsers
    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  return prefersReducedMotion
}
