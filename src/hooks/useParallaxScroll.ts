import { useState, useEffect } from 'react'

/**
 * Hook that returns a scroll offset value for parallax effects.
 * The offset is calculated by multiplying the scroll position by the speed factor.
 * 
 * @param speed - Parallax speed multiplier (default: 0.5). Lower values create slower parallax effect.
 * @returns Current parallax offset value
 * 
 * @example
 * const offset = useParallaxScroll(0.3)
 * // Apply offset to transform: `translateY(${offset}px)`
 */
export function useParallaxScroll(speed: number = 0.5): number {
  const [offset, setOffset] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      setOffset(window.scrollY * speed)
    }

    // Initial calculation
    handleScroll()

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [speed])

  return offset
}
