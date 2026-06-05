import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { GradientBorder } from '../../components/ui/GradientBorder'

describe('GradientBorder', () => {
  it('should render children content', () => {
    render(
      <GradientBorder>
        <div>Test Content</div>
      </GradientBorder>
    )
    
    expect(screen.getByText('Test Content')).toBeInTheDocument()
  })

  it('should apply default gradient colors', () => {
    const { container } = render(
      <GradientBorder>
        <div>Content</div>
      </GradientBorder>
    )
    
    const borderContainer = container.firstChild as HTMLElement
    const style = window.getComputedStyle(borderContainer)
    const gradientColors = style.getPropertyValue('--gradient-colors')
    
    expect(gradientColors).toContain('#8b5cf6')
    expect(gradientColors).toContain('#a78bfa')
    expect(gradientColors).toContain('#c4b5fd')
  })

  it('should apply custom gradient colors', () => {
    const customColors = ['#ff0000', '#00ff00', '#0000ff']
    const { container } = render(
      <GradientBorder colors={customColors}>
        <div>Content</div>
      </GradientBorder>
    )
    
    const borderContainer = container.firstChild as HTMLElement
    const style = window.getComputedStyle(borderContainer)
    const gradientColors = style.getPropertyValue('--gradient-colors')
    
    expect(gradientColors).toBe('#ff0000, #00ff00, #0000ff')
  })

  it('should apply default animation duration of 3000ms', () => {
    const { container } = render(
      <GradientBorder>
        <div>Content</div>
      </GradientBorder>
    )
    
    const borderContainer = container.firstChild as HTMLElement
    const style = window.getComputedStyle(borderContainer)
    const duration = style.getPropertyValue('--animation-duration')
    
    expect(duration).toBe('3000ms')
  })

  it('should apply custom animation duration', () => {
    const { container } = render(
      <GradientBorder duration={5000}>
        <div>Content</div>
      </GradientBorder>
    )
    
    const borderContainer = container.firstChild as HTMLElement
    const style = window.getComputedStyle(borderContainer)
    const duration = style.getPropertyValue('--animation-duration')
    
    expect(duration).toBe('5000ms')
  })

  it('should apply default border width of 2px', () => {
    const { container } = render(
      <GradientBorder>
        <div>Content</div>
      </GradientBorder>
    )
    
    const borderContainer = container.firstChild as HTMLElement
    const style = window.getComputedStyle(borderContainer)
    const width = style.getPropertyValue('--border-width')
    
    expect(width).toBe('2px')
  })

  it('should apply custom border width', () => {
    const { container } = render(
      <GradientBorder width={4}>
        <div>Content</div>
      </GradientBorder>
    )
    
    const borderContainer = container.firstChild as HTMLElement
    const style = window.getComputedStyle(borderContainer)
    const width = style.getPropertyValue('--border-width')
    
    expect(width).toBe('4px')
  })

  it('should apply gradient-border-container class', () => {
    const { container } = render(
      <GradientBorder>
        <div>Content</div>
      </GradientBorder>
    )
    
    const borderContainer = container.firstChild as HTMLElement
    expect(borderContainer).toHaveClass('gradient-border-container')
  })

  it('should apply additional custom className', () => {
    const { container } = render(
      <GradientBorder className="custom-class">
        <div>Content</div>
      </GradientBorder>
    )
    
    const borderContainer = container.firstChild as HTMLElement
    expect(borderContainer).toHaveClass('gradient-border-container')
    expect(borderContainer).toHaveClass('custom-class')
  })

  it('should accept duration between 2000ms and 4000ms as per requirements', () => {
    const { container: container1 } = render(
      <GradientBorder duration={2000}>
        <div>Content</div>
      </GradientBorder>
    )
    
    const { container: container2 } = render(
      <GradientBorder duration={4000}>
        <div>Content</div>
      </GradientBorder>
    )
    
    const style1 = window.getComputedStyle(container1.firstChild as HTMLElement)
    const style2 = window.getComputedStyle(container2.firstChild as HTMLElement)
    
    expect(style1.getPropertyValue('--animation-duration')).toBe('2000ms')
    expect(style2.getPropertyValue('--animation-duration')).toBe('4000ms')
  })

  it('should render with multiple children', () => {
    render(
      <GradientBorder>
        <h2>Title</h2>
        <p>Description</p>
      </GradientBorder>
    )
    
    expect(screen.getByText('Title')).toBeInTheDocument()
    expect(screen.getByText('Description')).toBeInTheDocument()
  })
})
