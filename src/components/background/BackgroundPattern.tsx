import { useMemo } from 'react'
import type { Theme } from '../../types'

interface BackgroundPatternProps {
  theme: Theme
  pattern: 'dots' | 'grid' | 'noise'
  opacity?: number
}

/**
 * Subtle background pattern component that adapts to theme.
 * Supports dots, grid, and noise pattern variants.
 * 
 * **Validates: Requirements 7.1**
 * 
 * @param theme - Current theme (light/dark)
 * @param pattern - Pattern type: dots, grid, or noise
 * @param opacity - Pattern opacity (default: 0.05)
 */
export function BackgroundPattern({ 
  theme, 
  pattern, 
  opacity = 0.05 
}: BackgroundPatternProps) {
  const isDark = theme === 'dark'
  
  // Generate pattern styles based on type and theme
  const patternStyle = useMemo(() => {
    const baseColor = isDark ? '255, 255, 255' : '0, 0, 0'
    
    switch (pattern) {
      case 'dots':
        return {
          backgroundImage: `radial-gradient(circle, rgba(${baseColor}, ${opacity}) 1px, transparent 1px)`,
          backgroundSize: '24px 24px',
        }
      
      case 'grid':
        return {
          backgroundImage: `
            linear-gradient(rgba(${baseColor}, ${opacity}) 1px, transparent 1px),
            linear-gradient(90deg, rgba(${baseColor}, ${opacity}) 1px, transparent 1px)
          `,
          backgroundSize: '24px 24px',
        }
      
      case 'noise':
        // For noise, we'll use a combination of multiple small gradients
        // to create a subtle texture effect
        return {
          backgroundImage: `
            radial-gradient(circle at 20% 50%, rgba(${baseColor}, ${opacity * 0.5}) 0%, transparent 50%),
            radial-gradient(circle at 80% 80%, rgba(${baseColor}, ${opacity * 0.3}) 0%, transparent 50%),
            radial-gradient(circle at 40% 20%, rgba(${baseColor}, ${opacity * 0.4}) 0%, transparent 50%)
          `,
          backgroundSize: '100% 100%',
        }
      
      default:
        return {}
    }
  }, [pattern, opacity, isDark])

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 -z-10"
      style={patternStyle}
    />
  )
}
