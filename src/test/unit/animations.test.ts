import { describe, it, expect } from 'vitest'
import {
  ANIMATION_DURATION,
  ANIMATION_EASING,
  STAGGER_DELAY,
  PERFORMANCE_BUDGET,
  SHADOW_DEPTH,
  GLOW_SHADOW,
  microInteractions,
  microTransitions,
  calculateStaggerDelay,
  getAnimationConfig,
} from '../../lib/animations'

describe('Animation Constants', () => {
  describe('ANIMATION_DURATION', () => {
    it('should have all required duration constants', () => {
      expect(ANIMATION_DURATION.instant).toBe(0)
      expect(ANIMATION_DURATION.fast).toBe(150)
      expect(ANIMATION_DURATION.normal).toBe(300)
      expect(ANIMATION_DURATION.medium).toBe(600)
      expect(ANIMATION_DURATION.slow).toBe(800)
      expect(ANIMATION_DURATION.verySlow).toBe(1200)
    })

    it('should have durations in ascending order', () => {
      expect(ANIMATION_DURATION.instant).toBeLessThan(ANIMATION_DURATION.fast)
      expect(ANIMATION_DURATION.fast).toBeLessThan(ANIMATION_DURATION.normal)
      expect(ANIMATION_DURATION.normal).toBeLessThan(ANIMATION_DURATION.medium)
      expect(ANIMATION_DURATION.medium).toBeLessThan(ANIMATION_DURATION.slow)
      expect(ANIMATION_DURATION.slow).toBeLessThan(ANIMATION_DURATION.verySlow)
    })
  })

  describe('ANIMATION_EASING', () => {
    it('should have all required easing functions', () => {
      expect(ANIMATION_EASING.easeOut).toBeDefined()
      expect(ANIMATION_EASING.easeIn).toBeDefined()
      expect(ANIMATION_EASING.easeInOut).toBeDefined()
      expect(ANIMATION_EASING.spring).toBeDefined()
      expect(ANIMATION_EASING.power2Out).toBeDefined()
      expect(ANIMATION_EASING.power3Out).toBeDefined()
      expect(ANIMATION_EASING.power2InOut).toBeDefined()
    })

    it('should have valid cubic-bezier format for CSS easings', () => {
      const cubicBezierPattern = /^cubic-bezier\([\d.]+,\s*[-\d.]+,\s*[\d.]+,\s*[\d.]+\)$/
      expect(ANIMATION_EASING.easeOut).toMatch(cubicBezierPattern)
      expect(ANIMATION_EASING.easeIn).toMatch(cubicBezierPattern)
      expect(ANIMATION_EASING.easeInOut).toMatch(cubicBezierPattern)
      expect(ANIMATION_EASING.spring).toMatch(cubicBezierPattern)
    })
  })

  describe('STAGGER_DELAY', () => {
    it('should have all required stagger delays', () => {
      expect(STAGGER_DELAY.fast).toBe(60)
      expect(STAGGER_DELAY.normal).toBe(100)
      expect(STAGGER_DELAY.medium).toBe(150)
      expect(STAGGER_DELAY.slow).toBe(200)
    })

    it('should have delays in ascending order', () => {
      expect(STAGGER_DELAY.fast).toBeLessThan(STAGGER_DELAY.normal)
      expect(STAGGER_DELAY.normal).toBeLessThan(STAGGER_DELAY.medium)
      expect(STAGGER_DELAY.medium).toBeLessThan(STAGGER_DELAY.slow)
    })
  })

  describe('PERFORMANCE_BUDGET', () => {
    it('should have correct 60fps frame time', () => {
      expect(PERFORMANCE_BUDGET.maxFrameTime).toBeCloseTo(16.67, 2)
      expect(PERFORMANCE_BUDGET.targetFPS).toBe(60)
    })

    it('should have reasonable animation and particle limits', () => {
      expect(PERFORMANCE_BUDGET.maxAnimations).toBe(10)
      expect(PERFORMANCE_BUDGET.maxParticles).toBe(100)
    })
  })

  describe('SHADOW_DEPTH', () => {
    it('should have all shadow depth levels', () => {
      expect(SHADOW_DEPTH.none).toBe('none')
      expect(SHADOW_DEPTH.sm).toBeDefined()
      expect(SHADOW_DEPTH.md).toBeDefined()
      expect(SHADOW_DEPTH.lg).toBeDefined()
      expect(SHADOW_DEPTH.xl).toBeDefined()
      expect(SHADOW_DEPTH['2xl']).toBeDefined()
    })

    it('should have valid CSS shadow format', () => {
      const shadowPattern = /^\d+\s+\d+px\s+\d+px\s+rgba\(\d+,\s*\d+,\s*\d+,\s*[\d.]+\)$/
      expect(SHADOW_DEPTH.sm).toMatch(shadowPattern)
      expect(SHADOW_DEPTH.md).toMatch(shadowPattern)
      expect(SHADOW_DEPTH.lg).toMatch(shadowPattern)
    })
  })

  describe('GLOW_SHADOW', () => {
    it('should have glow shadows for all color variants', () => {
      expect(GLOW_SHADOW.violet).toBeDefined()
      expect(GLOW_SHADOW.purple).toBeDefined()
      expect(GLOW_SHADOW.pink).toBeDefined()
    })

    it('should have all size variants for each color', () => {
      const colors = ['violet', 'purple', 'pink'] as const
      colors.forEach((color) => {
        expect(GLOW_SHADOW[color].sm).toBeDefined()
        expect(GLOW_SHADOW[color].md).toBeDefined()
        expect(GLOW_SHADOW[color].lg).toBeDefined()
      })
    })
  })
})

describe('Micro-Interactions', () => {
  describe('microInteractions', () => {
    it('should have all interaction types', () => {
      expect(microInteractions.button).toBeDefined()
      expect(microInteractions.link).toBeDefined()
      expect(microInteractions.card).toBeDefined()
      expect(microInteractions.badge).toBeDefined()
      expect(microInteractions.icon).toBeDefined()
    })

    it('should have rest, hover, and tap states for buttons', () => {
      expect(microInteractions.button.rest).toBeDefined()
      expect(microInteractions.button.hover).toBeDefined()
      expect(microInteractions.button.tap).toBeDefined()
    })

    it('should scale up on hover and down on tap', () => {
      expect(microInteractions.button.hover.scale).toBeGreaterThan(1)
      expect(microInteractions.button.tap.scale).toBeLessThan(1)
    })

    it('should have negative Y translation on hover for lift effect', () => {
      expect(microInteractions.button.hover.y).toBeLessThan(0)
      expect(microInteractions.card.hover.y).toBeLessThan(0)
      expect(microInteractions.badge.hover.y).toBeLessThan(0)
    })
  })

  describe('microTransitions', () => {
    it('should have all transition types', () => {
      expect(microTransitions.fast).toBeDefined()
      expect(microTransitions.normal).toBeDefined()
      expect(microTransitions.spring).toBeDefined()
    })

    it('should convert durations to seconds for Framer Motion', () => {
      expect(microTransitions.fast.duration).toBe(ANIMATION_DURATION.fast / 1000)
      expect(microTransitions.normal.duration).toBe(ANIMATION_DURATION.normal / 1000)
    })

    it('should have spring configuration', () => {
      expect(microTransitions.spring.type).toBe('spring')
      expect(microTransitions.spring.stiffness).toBeDefined()
      expect(microTransitions.spring.damping).toBeDefined()
    })
  })
})

describe('Animation Utilities', () => {
  describe('calculateStaggerDelay', () => {
    it('should calculate correct stagger delay', () => {
      expect(calculateStaggerDelay(0, 0.1)).toBe(0)
      expect(calculateStaggerDelay(1, 0.1)).toBe(0.1)
      expect(calculateStaggerDelay(5, 0.1)).toBe(0.5)
      expect(calculateStaggerDelay(10, 0.15)).toBe(1.5)
    })

    it('should handle zero base delay', () => {
      expect(calculateStaggerDelay(5, 0)).toBe(0)
    })

    it('should handle negative index gracefully', () => {
      expect(calculateStaggerDelay(-1, 0.1)).toBe(-0.1)
    })
  })

  describe('getAnimationConfig', () => {
    it('should return zero duration when reduced motion is preferred', () => {
      const config = getAnimationConfig({ prefersReducedMotion: true })
      expect(config.duration).toBe(0)
      expect(config.shouldAnimate).toBe(false)
    })

    it('should return normal duration when reduced motion is not preferred', () => {
      const config = getAnimationConfig({ prefersReducedMotion: false })
      expect(config.duration).toBe(ANIMATION_DURATION.normal)
      expect(config.shouldAnimate).toBe(true)
    })
  })
})
