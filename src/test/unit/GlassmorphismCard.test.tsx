import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { GlassmorphismCard } from '../../components/ui/GlassmorphismCard'

describe('GlassmorphismCard', () => {
  it('should render children content', () => {
    render(
      <GlassmorphismCard>
        <p>Test content</p>
      </GlassmorphismCard>
    )
    
    expect(screen.getByText('Test content')).toBeInTheDocument()
  })

  it('should apply glassmorphism-card class', () => {
    const { container } = render(
      <GlassmorphismCard>
        <p>Content</p>
      </GlassmorphismCard>
    )
    
    const card = container.firstChild as HTMLElement
    expect(card).toHaveClass('glassmorphism-card')
  })

  it('should apply default blur amount of 12px', () => {
    const { container } = render(
      <GlassmorphismCard>
        <p>Content</p>
      </GlassmorphismCard>
    )
    
    const card = container.firstChild as HTMLElement
    expect(card).toHaveStyle({ '--blur-amount': '12px' })
  })

  it('should apply custom blur amount when provided', () => {
    const { container } = render(
      <GlassmorphismCard blur={20}>
        <p>Content</p>
      </GlassmorphismCard>
    )
    
    const card = container.firstChild as HTMLElement
    expect(card).toHaveStyle({ '--blur-amount': '20px' })
  })

  it('should accept and apply additional className', () => {
    const { container } = render(
      <GlassmorphismCard className="custom-class">
        <p>Content</p>
      </GlassmorphismCard>
    )
    
    const card = container.firstChild as HTMLElement
    expect(card).toHaveClass('glassmorphism-card')
    expect(card).toHaveClass('custom-class')
  })

  it('should render complex children', () => {
    render(
      <GlassmorphismCard>
        <div>
          <h2>Title</h2>
          <p>Description</p>
          <button>Action</button>
        </div>
      </GlassmorphismCard>
    )
    
    expect(screen.getByText('Title')).toBeInTheDocument()
    expect(screen.getByText('Description')).toBeInTheDocument()
    expect(screen.getByText('Action')).toBeInTheDocument()
  })

  it('should handle zero blur amount', () => {
    const { container } = render(
      <GlassmorphismCard blur={0}>
        <p>Content</p>
      </GlassmorphismCard>
    )
    
    const card = container.firstChild as HTMLElement
    expect(card).toHaveStyle({ '--blur-amount': '0px' })
  })

  it('should handle large blur amounts', () => {
    const { container } = render(
      <GlassmorphismCard blur={50}>
        <p>Content</p>
      </GlassmorphismCard>
    )
    
    const card = container.firstChild as HTMLElement
    expect(card).toHaveStyle({ '--blur-amount': '50px' })
  })
})
