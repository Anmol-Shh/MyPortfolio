import { type ReactNode } from 'react'

interface GlassmorphismCardProps {
  children: ReactNode
  blur?: number
  className?: string
}

/**
 * GlassmorphismCard component with frosted glass effect
 * 
 * Implements glassmorphism effect with:
 * - backdrop-filter blur for frosted glass appearance
 * - Theme-aware backgrounds: light (rgba(255,255,255,0.7)), dark (rgba(15,23,42,0.7))
 * - Border opacity: light (0.2), dark (0.1)
 * - Fallback to solid background with reduced opacity for browsers without backdrop-filter support
 * 
 * **Validates: Requirements 2.3**
 * 
 * @param children - Content to render inside the card
 * @param blur - Blur amount in pixels (default: 12)
 * @param className - Additional CSS classes to apply
 */
export function GlassmorphismCard({ 
  children, 
  blur = 12,
  className = '' 
}: GlassmorphismCardProps) {
  return (
    <div
      className={`glassmorphism-card ${className}`}
      style={{
        // @ts-expect-error - CSS custom property for blur amount
        '--blur-amount': `${blur}px`,
      }}
    >
      {children}
    </div>
  )
}
