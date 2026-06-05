import { type ReactNode } from 'react'

interface GradientBorderProps {
  children: ReactNode
  colors?: string[]
  duration?: number
  width?: number
  className?: string
}

/**
 * GradientBorder component with animated gradient border effect
 * 
 * Implements animated border using:
 * - ::before pseudo-element for the animated border layer
 * - conic-gradient for smooth color transitions
 * - CSS keyframes animation (background-position)
 * - Configurable duration and colors
 * - Theme-aware default colors
 * - border-radius matching parent container
 * 
 * **Validates: Requirements 2.4, 2.5**
 * 
 * @param children - Content to render inside the bordered container
 * @param colors - Array of gradient colors (default: theme-aware violet/purple gradient)
 * @param duration - Animation duration in milliseconds (default: 3000ms)
 * @param width - Border width in pixels (default: 2)
 * @param className - Additional CSS classes to apply to the container
 */
export function GradientBorder({ 
  children, 
  colors = ['#8b5cf6', '#a78bfa', '#c4b5fd', '#8b5cf6'],
  duration = 3000,
  width = 2,
  className = '' 
}: GradientBorderProps) {
  const gradientColors = colors.join(', ')
  
  return (
    <div
      className={`gradient-border-container ${className}`}
      style={{
        // @ts-expect-error - CSS custom properties for gradient configuration
        '--gradient-colors': gradientColors,
        '--animation-duration': `${duration}ms`,
        '--border-width': `${width}px`,
      }}
    >
      {children}
    </div>
  )
}
