import { useState, useEffect } from 'react'
import Particles from '@tsparticles/react'
import { loadSlim } from '@tsparticles/slim'
import { tsParticles } from '@tsparticles/engine'
import type { Theme } from '../../types'
import { useParallaxScroll } from '../../hooks/useParallaxScroll'

interface HeroBackgroundProps {
  theme: Theme
}

/**
 * Interactive particle field background for the Hero section.
 * Particles within 60px of the cursor are repelled.
 * Falls back to a CSS gradient animation if canvas fails to initialize.
 * Requirements: 1.1, 1.2, 1.3, 1.4
 */
export function HeroBackground({ theme }: HeroBackgroundProps) {
  const [initFailed, setInitFailed] = useState(false)
  const [engineLoaded, setEngineLoaded] = useState(false)
  const parallaxOffset = useParallaxScroll(0.3)

  useEffect(() => {
    loadSlim(tsParticles)
      .then(() => setEngineLoaded(true))
      .catch(() => setInitFailed(true))
  }, [])

  const isDark = theme === 'dark'
  const particleColor = isDark ? '#a78bfa' : '#7c3aed'
  const linkColor = isDark ? '#6d28d9' : '#8b5cf6'

  const options = {
    background: { color: { value: 'transparent' } },
    fpsLimit: 60,
    interactivity: {
      events: {
        onHover: { enable: true, mode: 'repulse' },
      },
      modes: {
        repulse: { distance: 60, duration: 0.4 },
      },
    },
    particles: {
      color: { 
        value: particleColor,
        animation: {
          enable: true,
          speed: 1,
          sync: true,
        }
      },
      links: {
        color: linkColor,
        distance: 120,
        enable: true,
        opacity: 0.3,
        width: 1,
      },
      move: {
        direction: 'none' as const,
        enable: true,
        outModes: { default: 'bounce' as const },
        random: false,
        speed: 0.8,
        straight: false,
      },
      number: {
        density: { enable: true },
        value: 80,
      },
      opacity: { 
        value: 0.4,
        animation: {
          enable: true,
          speed: 0.5,
          minimumValue: 0.3,
          sync: false,
        }
      },
      shape: { type: 'circle' },
      size: { value: { min: 1, max: 4 } },
    },
    detectRetina: true,
  }

  // CSS gradient fallback
  if (initFailed) {
    return (
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 animate-gradient-shift"
        style={{
          background: isDark
            ? 'radial-gradient(ellipse at 20% 50%, rgba(139,92,246,0.15) 0%, transparent 50%), radial-gradient(ellipse at 80% 20%, rgba(99,102,241,0.1) 0%, transparent 50%)'
            : 'radial-gradient(ellipse at 20% 50%, rgba(139,92,246,0.1) 0%, transparent 50%), radial-gradient(ellipse at 80% 20%, rgba(99,102,241,0.08) 0%, transparent 50%)',
        }}
      />
    )
  }

  if (!engineLoaded) return null

  return (
    <div 
      className="absolute inset-0 -z-10 transition-transform duration-300 ease-out"
      style={{ transform: `translateY(${parallaxOffset}px)` }}
    >
      <Particles
        id="hero-particles"
        options={options}
        className="absolute inset-0 transition-opacity duration-300"
        style={{ opacity: 1 }}
      />
    </div>
  )
}
