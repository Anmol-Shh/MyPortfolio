import { useEffect, useRef } from 'react'

/**
 * Custom cursor — small dot + trailing ring that follows the mouse.
 * The ring lags behind with a lerp for a smooth trailing effect.
 * Hidden on touch devices.
 */
export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const dot = dotRef.current
    const ring = ringRef.current
    if (!dot || !ring) return

    let mouseX = -100
    let mouseY = -100
    let ringX = -100
    let ringY = -100
    let rafId: number
    let isHovering = false

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX
      mouseY = e.clientY
    }

    const onMouseEnter = () => {
      dot.style.opacity = '1'
      ring.style.opacity = '1'
    }

    const onMouseLeave = () => {
      dot.style.opacity = '0'
      ring.style.opacity = '0'
    }

    // Scale up ring on interactive elements
    const onMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (target.closest('a, button, [role="button"], input, textarea')) {
        if (!isHovering) {
          isHovering = true
          ring.style.transform = `translate(-50%, -50%) scale(1.8)`
          ring.style.borderColor = 'rgba(167, 139, 250, 0.8)'
          dot.style.transform = `translate(-50%, -50%) scale(0.5)`
        }
      } else {
        if (isHovering) {
          isHovering = false
          ring.style.borderColor = 'rgba(167, 139, 250, 0.5)'
          dot.style.transform = `translate(-50%, -50%) scale(1)`
        }
      }
    }

    const animate = () => {
      // Dot follows instantly
      dot.style.left = `${mouseX}px`
      dot.style.top = `${mouseY}px`

      // Ring lerps toward mouse
      ringX += (mouseX - ringX) * 0.12
      ringY += (mouseY - ringY) * 0.12
      ring.style.left = `${ringX}px`
      ring.style.top = `${ringY}px`

      if (!isHovering) {
        ring.style.transform = `translate(-50%, -50%) scale(1)`
      }

      rafId = requestAnimationFrame(animate)
    }

    document.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mouseenter', onMouseEnter)
    document.addEventListener('mouseleave', onMouseLeave)
    document.addEventListener('mouseover', onMouseOver)
    rafId = requestAnimationFrame(animate)

    return () => {
      document.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mouseenter', onMouseEnter)
      document.removeEventListener('mouseleave', onMouseLeave)
      document.removeEventListener('mouseover', onMouseOver)
      cancelAnimationFrame(rafId)
    }
  }, [])

  return (
    <>
      {/* Dot */}
      <div
        ref={dotRef}
        aria-hidden="true"
        className="pointer-events-none fixed z-[9999] hidden h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-400 opacity-0 transition-opacity duration-300 md:block"
        style={{ top: -100, left: -100 }}
      />
      {/* Ring */}
      <div
        ref={ringRef}
        aria-hidden="true"
        className="pointer-events-none fixed z-[9998] hidden h-9 w-9 -translate-x-1/2 -translate-y-1/2 rounded-full border border-violet-400/50 opacity-0 transition-[transform,border-color,opacity] duration-300 md:block"
        style={{ top: -100, left: -100 }}
      />
    </>
  )
}
