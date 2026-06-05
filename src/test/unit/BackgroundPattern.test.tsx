import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { BackgroundPattern } from '../../components/background/BackgroundPattern'

describe('BackgroundPattern', () => {
  it('should render dots pattern with correct styles', () => {
    const { container } = render(
      <BackgroundPattern theme="light" pattern="dots" opacity={0.05} />
    )
    
    const patternDiv = container.firstChild as HTMLElement
    expect(patternDiv).toBeInTheDocument()
    expect(patternDiv).toHaveAttribute('aria-hidden', 'true')
    expect(patternDiv).toHaveClass('pointer-events-none', 'absolute', 'inset-0', '-z-10')
  })

  it('should render grid pattern with correct styles', () => {
    const { container } = render(
      <BackgroundPattern theme="dark" pattern="grid" opacity={0.05} />
    )
    
    const patternDiv = container.firstChild as HTMLElement
    expect(patternDiv).toBeInTheDocument()
    expect(patternDiv).toHaveAttribute('aria-hidden', 'true')
  })

  it('should render noise pattern with correct styles', () => {
    const { container } = render(
      <BackgroundPattern theme="light" pattern="noise" opacity={0.05} />
    )
    
    const patternDiv = container.firstChild as HTMLElement
    expect(patternDiv).toBeInTheDocument()
    expect(patternDiv).toHaveAttribute('aria-hidden', 'true')
  })

  it('should adapt to dark theme', () => {
    const { container } = render(
      <BackgroundPattern theme="dark" pattern="dots" opacity={0.05} />
    )
    
    const patternDiv = container.firstChild as HTMLElement
    const style = patternDiv.style
    
    // Dark theme should use white color (255, 255, 255)
    expect(style.backgroundImage).toContain('255, 255, 255')
  })

  it('should adapt to light theme', () => {
    const { container } = render(
      <BackgroundPattern theme="light" pattern="dots" opacity={0.05} />
    )
    
    const patternDiv = container.firstChild as HTMLElement
    const style = patternDiv.style
    
    // Light theme should use black color (0, 0, 0)
    expect(style.backgroundImage).toContain('0, 0, 0')
  })

  it('should use custom opacity', () => {
    const { container } = render(
      <BackgroundPattern theme="light" pattern="dots" opacity={0.1} />
    )
    
    const patternDiv = container.firstChild as HTMLElement
    const style = patternDiv.style
    
    // Should contain the custom opacity value
    expect(style.backgroundImage).toContain('0.1')
  })

  it('should use default opacity when not provided', () => {
    const { container } = render(
      <BackgroundPattern theme="light" pattern="dots" />
    )
    
    const patternDiv = container.firstChild as HTMLElement
    const style = patternDiv.style
    
    // Should contain the default opacity value (0.05)
    expect(style.backgroundImage).toContain('0.05')
  })

  it('should have correct background size for dots pattern', () => {
    const { container } = render(
      <BackgroundPattern theme="light" pattern="dots" />
    )
    
    const patternDiv = container.firstChild as HTMLElement
    expect(patternDiv.style.backgroundSize).toBe('24px 24px')
  })

  it('should have correct background size for grid pattern', () => {
    const { container } = render(
      <BackgroundPattern theme="light" pattern="grid" />
    )
    
    const patternDiv = container.firstChild as HTMLElement
    expect(patternDiv.style.backgroundSize).toBe('24px 24px')
  })
})
