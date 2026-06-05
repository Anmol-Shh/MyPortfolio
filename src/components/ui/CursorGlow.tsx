import { useEffect, useRef } from 'react'

/**
 * A large radial gradient that follows the mouse across the entire page,
 * creating a subtle ambient glow effect.
 */
export function CursorGlow() {
  const glowRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const glow = glowRef.current
    if (!glow) return

    let rafId: number
    let targetX = -500
    let targetY = -500
    let currentX = -500
    let currentY = -500

    const onMouseMove = (e: MouseEvent) => {
      targetX = e.clientX
      targetY = e.clientY
    }

    const animate = () => {
      currentX += (targetX - currentX) * 0.06
      currentY += (targetY - currentY) * 0.06
      glow.style.left = `${currentX}px`
      glow.style.top = `${currentY}px`
      rafId = requestAnimationFrame(animate)
    }

    window.addEventListener('mousemove', onMouseMove)
    rafId = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      cancelAnimationFrame(rafId)
    }
  }, [])

  return (
    <div
      ref={glowRef}
      aria-hidden="true"
      className="pointer-events-none fixed z-0 hidden -translate-x-1/2 -translate-y-1/2 rounded-full md:block"
      style={{
        width: 600,
        height: 600,
        background: 'radial-gradient(circle, rgba(139,92,246,0.06) 0%, transparent 70%)',
        top: -500,
        left: -500,
      }}
    />
  )
}
