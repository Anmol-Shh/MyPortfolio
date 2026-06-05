import { useScrollProgress } from '../../hooks/useScrollProgress'

/**
 * A thin fixed bar at the top of the viewport whose width reflects
 * how far the user has scrolled through the page.
 * Requirements: 3.3
 */
export function ScrollProgressIndicator() {
  const progress = useScrollProgress()

  return (
    <div
      role="progressbar"
      aria-label="Page scroll progress"
      aria-valuenow={Math.round(progress * 100)}
      aria-valuemin={0}
      aria-valuemax={100}
      className="fixed top-0 left-0 z-50 h-[3px] bg-gradient-to-r from-violet-500 via-purple-500 to-pink-500 transition-[width] duration-100 ease-out"
      style={{ width: `${progress * 100}%` }}
    />
  )
}
