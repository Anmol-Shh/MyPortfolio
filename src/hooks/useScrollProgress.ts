import { useState, useEffect } from 'react'

/**
 * Pure computation — exported for property-based testing.
 * Computes scroll progress clamped to [0, 1].
 */
export function computeScrollProgress(
  scrollY: number,
  scrollHeight: number,
  innerHeight: number,
): number {
  const maxScroll = scrollHeight - innerHeight
  if (maxScroll <= 0) return 0
  const raw = scrollY / maxScroll
  return Math.min(1, Math.max(0, raw))
}

/**
 * Returns a value in [0, 1] representing how far the user has scrolled
 * through the page. Updates on every scroll event (passive listener).
 */
export function useScrollProgress(): number {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY
      const scrollHeight = document.documentElement.scrollHeight
      const innerHeight = window.innerHeight
      setProgress(computeScrollProgress(scrollY, scrollHeight, innerHeight))
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    // Compute initial value
    handleScroll()

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return progress
}
