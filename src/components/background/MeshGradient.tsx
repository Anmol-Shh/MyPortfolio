import { useMemo } from 'react'
import type { Theme } from '../../types'

interface MeshGradientProps {
  theme: Theme
  colorStops?: string[]
  animationDuration?: number
}

/**
 * Animated mesh gradient overlay component for the Hero section.
 * Creates a multi-stop radial gradient with smooth CSS keyframe animation.
 * Adapts colors based on theme and uses GPU acceleration for performance.
 * 
 * **Validates: Requirements 1.4, 1.5**
 * 
 * @param theme - Current theme (light/dark)
 * @param colorStops - Array of color values for gradient stops (optional)
 * @param animationDuration - Animation duration in milliseconds (default: 8000ms)
 */
export function MeshGradient({ 
  theme, 
  colorStops,
  animationDuration = 8000 
}: MeshGradientProps) {
  const isDark = theme === 'dark'
  
  // Theme-aware default color stops
  const defaultColorStops = useMemo(() => {
    if (isDark) {
      return [
        'rgba(139, 92, 246, 0.15)',  // violet-400
        'rgba(99, 102, 241, 0.12)',   // indigo-500
        'rgba(168, 85, 247, 0.1)',    // purple-500
      ]
    } else {
      return [
        'rgba(139, 92, 246, 0.08)',   // violet-400
        'rgba(99, 102, 241, 0.06)',   // indigo-500
        'rgba(168, 85, 247, 0.05)',   // purple-500
      ]
    }
  }, [isDark])

  const colors = colorStops || defaultColorStops

  // Generate multiple radial gradient layers for mesh effect
  const gradientStyle = useMemo(() => {
    return {
      backgroundImage: `
        radial-gradient(ellipse at 20% 30%, ${colors[0]} 0%, transparent 50%),
        radial-gradient(ellipse at 80% 20%, ${colors[1]} 0%, transparent 50%),
        radial-gradient(ellipse at 40% 80%, ${colors[2]} 0%, transparent 50%),
        radial-gradient(ellipse at 90% 70%, ${colors[0]} 0%, transparent 50%)
      `,
      backgroundSize: '200% 200%',
      backgroundPosition: '0% 0%',
      willChange: 'background-position',
      animation: `meshGradientMove ${animationDuration}ms ease-in-out infinite`,
      // Fallback solid color for browsers without gradient support
      backgroundColor: isDark ? 'rgba(139, 92, 246, 0.05)' : 'rgba(139, 92, 246, 0.03)',
    }
  }, [colors, animationDuration, isDark])

  return (
    <>
      {/* Inject keyframes animation */}
      <style>{`
        @keyframes meshGradientMove {
          0%, 100% {
            background-position: 0% 0%;
          }
          25% {
            background-position: 100% 50%;
          }
          50% {
            background-position: 100% 100%;
          }
          75% {
            background-position: 50% 50%;
          }
        }
      `}</style>
      
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
        style={gradientStyle}
      />
    </>
  )
}
