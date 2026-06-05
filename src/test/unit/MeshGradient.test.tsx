import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { MeshGradient } from '../../components/background/MeshGradient'

describe('MeshGradient', () => {
  describe('Rendering', () => {
    it('should render without crashing', () => {
      const { container } = render(<MeshGradient theme="dark" />)
      expect(container.querySelector('div[aria-hidden="true"]')).toBeInTheDocument()
    })

    it('should apply aria-hidden attribute', () => {
      const { container } = render(<MeshGradient theme="light" />)
      const element = container.querySelector('div[aria-hidden="true"]')
      expect(element).toHaveAttribute('aria-hidden', 'true')
    })

    it('should apply pointer-events-none class', () => {
      const { container } = render(<MeshGradient theme="dark" />)
      const element = container.querySelector('div[aria-hidden="true"]')
      expect(element).toHaveClass('pointer-events-none')
    })

    it('should apply absolute positioning and z-index', () => {
      const { container } = render(<MeshGradient theme="light" />)
      const element = container.querySelector('div[aria-hidden="true"]')
      expect(element).toHaveClass('absolute', 'inset-0', '-z-10')
    })
  })

  describe('Theme Adaptation', () => {
    it('should use darker colors for dark theme', () => {
      const { container } = render(<MeshGradient theme="dark" />)
      const element = container.querySelector('div[aria-hidden="true"]') as HTMLElement
      const bgImage = element.style.backgroundImage
      
      // Dark theme should have higher opacity values
      expect(bgImage).toContain('0.15')
      expect(bgImage).toContain('0.12')
      expect(bgImage).toContain('0.1')
    })

    it('should use lighter colors for light theme', () => {
      const { container } = render(<MeshGradient theme="light" />)
      const element = container.querySelector('div[aria-hidden="true"]') as HTMLElement
      const bgImage = element.style.backgroundImage
      
      // Light theme should have lower opacity values
      expect(bgImage).toContain('0.08')
      expect(bgImage).toContain('0.06')
      expect(bgImage).toContain('0.05')
    })

    it('should update colors when theme changes', () => {
      const { container, rerender } = render(<MeshGradient theme="light" />)
      const element = container.querySelector('div[aria-hidden="true"]') as HTMLElement
      
      const lightBg = element.style.backgroundImage
      expect(lightBg).toContain('0.08')
      
      rerender(<MeshGradient theme="dark" />)
      
      const darkBg = element.style.backgroundImage
      expect(darkBg).toContain('0.15')
    })
  })

  describe('Custom Color Stops', () => {
    it('should accept custom color stops', () => {
      const customColors = [
        'rgba(255, 0, 0, 0.5)',
        'rgba(0, 255, 0, 0.5)',
        'rgba(0, 0, 255, 0.5)',
      ]
      
      const { container } = render(
        <MeshGradient theme="dark" colorStops={customColors} />
      )
      const element = container.querySelector('div[aria-hidden="true"]') as HTMLElement
      const bgImage = element.style.backgroundImage
      
      expect(bgImage).toContain('rgba(255, 0, 0, 0.5)')
      expect(bgImage).toContain('rgba(0, 255, 0, 0.5)')
      expect(bgImage).toContain('rgba(0, 0, 255, 0.5)')
    })
  })

  describe('Animation Configuration', () => {
    it('should use default animation duration of 8000ms', () => {
      const { container } = render(<MeshGradient theme="dark" />)
      const element = container.querySelector('div[aria-hidden="true"]') as HTMLElement
      
      expect(element.style.animation).toContain('8000ms')
    })

    it('should accept custom animation duration', () => {
      const { container } = render(
        <MeshGradient theme="dark" animationDuration={5000} />
      )
      const element = container.querySelector('div[aria-hidden="true"]') as HTMLElement
      
      expect(element.style.animation).toContain('5000ms')
    })

    it('should apply will-change for GPU acceleration', () => {
      const { container } = render(<MeshGradient theme="dark" />)
      const element = container.querySelector('div[aria-hidden="true"]') as HTMLElement
      
      expect(element.style.willChange).toBe('background-position')
    })

    it('should apply ease-in-out easing', () => {
      const { container } = render(<MeshGradient theme="dark" />)
      const element = container.querySelector('div[aria-hidden="true"]') as HTMLElement
      
      expect(element.style.animation).toContain('ease-in-out')
    })

    it('should apply infinite animation', () => {
      const { container } = render(<MeshGradient theme="dark" />)
      const element = container.querySelector('div[aria-hidden="true"]') as HTMLElement
      
      expect(element.style.animation).toContain('infinite')
    })
  })

  describe('Gradient Configuration', () => {
    it('should create multiple radial gradient layers', () => {
      const { container } = render(<MeshGradient theme="dark" />)
      const element = container.querySelector('div[aria-hidden="true"]') as HTMLElement
      const bgImage = element.style.backgroundImage
      
      // Should have 4 radial gradient layers
      const gradientCount = (bgImage.match(/radial-gradient/g) || []).length
      expect(gradientCount).toBe(4)
    })

    it('should position gradients at different locations', () => {
      const { container } = render(<MeshGradient theme="dark" />)
      const element = container.querySelector('div[aria-hidden="true"]') as HTMLElement
      const bgImage = element.style.backgroundImage
      
      expect(bgImage).toContain('at 20% 30%')
      expect(bgImage).toContain('at 80% 20%')
      expect(bgImage).toContain('at 40% 80%')
      expect(bgImage).toContain('at 90% 70%')
    })

    it('should set background size to 200%', () => {
      const { container } = render(<MeshGradient theme="dark" />)
      const element = container.querySelector('div[aria-hidden="true"]') as HTMLElement
      
      expect(element.style.backgroundSize).toBe('200% 200%')
    })

    it('should set initial background position', () => {
      const { container } = render(<MeshGradient theme="dark" />)
      const element = container.querySelector('div[aria-hidden="true"]') as HTMLElement
      
      expect(element.style.backgroundPosition).toBe('0% 0%')
    })
  })

  describe('Fallback Support', () => {
    it('should provide fallback background color for dark theme', () => {
      const { container } = render(<MeshGradient theme="dark" />)
      const element = container.querySelector('div[aria-hidden="true"]') as HTMLElement
      
      expect(element.style.backgroundColor).toBe('rgba(139, 92, 246, 0.05)')
    })

    it('should provide fallback background color for light theme', () => {
      const { container } = render(<MeshGradient theme="light" />)
      const element = container.querySelector('div[aria-hidden="true"]') as HTMLElement
      
      expect(element.style.backgroundColor).toBe('rgba(139, 92, 246, 0.03)')
    })
  })

  describe('Keyframes Injection', () => {
    it('should inject keyframes animation style', () => {
      const { container } = render(<MeshGradient theme="dark" />)
      const styleElement = container.querySelector('style')
      
      expect(styleElement).toBeInTheDocument()
      expect(styleElement?.textContent).toContain('@keyframes meshGradientMove')
    })

    it('should define animation keyframes with correct stops', () => {
      const { container } = render(<MeshGradient theme="dark" />)
      const styleElement = container.querySelector('style')
      const content = styleElement?.textContent || ''
      
      expect(content).toContain('0%, 100%')
      expect(content).toContain('25%')
      expect(content).toContain('50%')
      expect(content).toContain('75%')
    })

    it('should animate background-position in keyframes', () => {
      const { container } = render(<MeshGradient theme="dark" />)
      const styleElement = container.querySelector('style')
      const content = styleElement?.textContent || ''
      
      expect(content).toContain('background-position')
    })
  })
})
