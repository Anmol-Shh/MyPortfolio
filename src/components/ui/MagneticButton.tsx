import { useRef, type ReactNode } from 'react'

interface MagneticButtonProps {
  children: ReactNode
  className?: string
  strength?: number // 0–1, how strong the magnetic pull is
  as?: 'button' | 'a'
  href?: string
  download?: boolean
  onClick?: (e: React.MouseEvent) => void
  type?: 'button' | 'submit' | 'reset'
  'aria-label'?: string
}

/**
 * Wraps any button/link with a magnetic pull effect.
 * The element shifts toward the cursor when hovered within its bounds.
 */
export function MagneticButton({
  children,
  className = '',
  strength = 0.35,
  as: Tag = 'button',
  href,
  download,
  onClick,
  type = 'button',
  'aria-label': ariaLabel,
}: MagneticButtonProps) {
  const ref = useRef<HTMLButtonElement & HTMLAnchorElement>(null)

  const handleMouseMove = (e: React.MouseEvent) => {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    const dx = (e.clientX - cx) * strength
    const dy = (e.clientY - cy) * strength
    el.style.transform = `translate(${dx}px, ${dy}px)`
  }

  const handleMouseLeave = () => {
    const el = ref.current
    if (!el) return
    el.style.transform = 'translate(0px, 0px)'
    el.style.transition = 'transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
  }

  const handleMouseEnter = () => {
    const el = ref.current
    if (!el) return
    el.style.transition = 'transform 0.1s ease-out'
  }

  const sharedProps = {
    ref,
    className,
    onMouseMove: handleMouseMove,
    onMouseLeave: handleMouseLeave,
    onMouseEnter: handleMouseEnter,
    onClick,
    'aria-label': ariaLabel,
  }

  if (Tag === 'a') {
    return (
      <a
        {...(sharedProps as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
        ref={ref as React.RefObject<HTMLAnchorElement>}
        href={href}
        download={download}
      >
        {children}
      </a>
    )
  }

  return (
    <button
      {...(sharedProps as React.ButtonHTMLAttributes<HTMLButtonElement>)}
      ref={ref as React.RefObject<HTMLButtonElement>}
      type={type}
    >
      {children}
    </button>
  )
}
