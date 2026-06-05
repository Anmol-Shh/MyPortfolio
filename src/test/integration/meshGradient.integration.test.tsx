import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { MeshGradient } from '../../components/background/MeshGradient'

describe('MeshGradient Integration', () => {
  it('should render correctly in a Hero section context', () => {
    const { container } = render(
      <div className="relative min-h-screen">
        <MeshGradient theme="dark" />
        <div className="relative z-10">
          <h1>Hero Content</h1>
        </div>
      </div>
    )

    const gradient = container.querySelector('div[aria-hidden="true"]')
    expect(gradient).toBeInTheDocument()
    expect(gradient).toHaveClass('-z-10')
  })

  it('should work alongside other background components', () => {
    const { container } = render(
      <div className="relative">
        <MeshGradient theme="dark" />
        <div 
          className="absolute inset-0 -z-20" 
          style={{ backgroundColor: '#000' }}
        />
      </div>
    )

    const gradient = container.querySelector('div[aria-hidden="true"]')
    expect(gradient).toBeInTheDocument()
  })

  it('should maintain performance with GPU acceleration', () => {
    const { container } = render(<MeshGradient theme="dark" />)
    const element = container.querySelector('div[aria-hidden="true"]') as HTMLElement
    
    // Verify GPU acceleration properties
    expect(element.style.willChange).toBe('background-position')
    expect(element.style.animation).toContain('ease-in-out')
  })

  it('should adapt to theme changes smoothly', () => {
    const { container, rerender } = render(<MeshGradient theme="light" />)
    const element = container.querySelector('div[aria-hidden="true"]') as HTMLElement
    
    const lightBg = element.style.backgroundImage
    const lightFallback = element.style.backgroundColor
    
    rerender(<MeshGradient theme="dark" />)
    
    const darkBg = element.style.backgroundImage
    const darkFallback = element.style.backgroundColor
    
    // Verify theme adaptation
    expect(lightBg).not.toBe(darkBg)
    expect(lightFallback).not.toBe(darkFallback)
  })

  it('should maintain contrast with foreground content', () => {
    const { container } = render(
      <div className="relative">
        <MeshGradient theme="dark" />
        <div className="relative z-10 text-white">
          <p>Foreground text</p>
        </div>
      </div>
    )

    const gradient = container.querySelector('div[aria-hidden="true"]') as HTMLElement
    const bgImage = gradient.style.backgroundImage
    
    // Verify low opacity for contrast
    expect(bgImage).toMatch(/0\.\d+/)
  })
})
