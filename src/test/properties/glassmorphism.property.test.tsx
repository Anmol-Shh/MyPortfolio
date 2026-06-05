import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import * as fc from 'fast-check'
import { GlassmorphismCard } from '../../components/ui/GlassmorphismCard'

/**
 * Property-based tests for GlassmorphismCard component
 * **Validates: Requirements 2.3**
 */
describe('GlassmorphismCard - Property Tests', () => {
  /**
   * Property: The component should always render with glassmorphism-card class
   * regardless of blur value
   */
  it('should always apply glassmorphism-card class for any blur value', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: 100 }),
        (blur) => {
          const { container } = render(
            <GlassmorphismCard blur={blur}>
              <p>Content</p>
            </GlassmorphismCard>
          )
          
          const card = container.firstChild as HTMLElement
          expect(card).toHaveClass('glassmorphism-card')
        }
      ),
      { numRuns: 100 }
    )
  })

  /**
   * Property: The blur amount CSS variable should always match the provided blur prop
   */
  it('should set --blur-amount CSS variable to match blur prop', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: 100 }),
        (blur) => {
          const { container } = render(
            <GlassmorphismCard blur={blur}>
              <p>Content</p>
            </GlassmorphismCard>
          )
          
          const card = container.firstChild as HTMLElement
          expect(card).toHaveStyle({ '--blur-amount': `${blur}px` })
        }
      ),
      { numRuns: 100 }
    )
  })

  /**
   * Property: The component should preserve all children regardless of blur value
   */
  it('should render children content for any blur value', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: 100 }),
        fc.string({ minLength: 1, maxLength: 50 }).filter(s => s.trim().length > 0),
        (blur, content) => {
          const { container } = render(
            <GlassmorphismCard blur={blur}>
              <p>{content}</p>
            </GlassmorphismCard>
          )
          
          const card = container.firstChild as HTMLElement
          expect(card).toBeInTheDocument()
          expect(card.textContent).toBe(content)
        }
      ),
      { numRuns: 50 }
    )
  })

  /**
   * Property: Additional className should always be preserved alongside glassmorphism-card
   */
  it('should preserve additional className with glassmorphism-card class', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: 100 }),
        fc.string({ minLength: 1, maxLength: 30 }).filter(s => /^[a-z-]+$/.test(s)),
        (blur, className) => {
          const { container } = render(
            <GlassmorphismCard blur={blur} className={className}>
              <p>Content</p>
            </GlassmorphismCard>
          )
          
          const card = container.firstChild as HTMLElement
          expect(card).toHaveClass('glassmorphism-card')
          expect(card).toHaveClass(className)
        }
      ),
      { numRuns: 50 }
    )
  })

  /**
   * Property: Component should handle edge case blur values (0, very large numbers)
   */
  it('should handle edge case blur values without errors', () => {
    fc.assert(
      fc.property(
        fc.oneof(
          fc.constant(0),
          fc.integer({ min: 1, max: 10 }),
          fc.integer({ min: 50, max: 200 })
        ),
        (blur) => {
          const { container } = render(
            <GlassmorphismCard blur={blur}>
              <p>Content</p>
            </GlassmorphismCard>
          )
          
          const card = container.firstChild as HTMLElement
          expect(card).toBeInTheDocument()
          expect(card).toHaveStyle({ '--blur-amount': `${blur}px` })
        }
      ),
      { numRuns: 100 }
    )
  })

  /**
   * Property: Component should render nested children structures correctly
   */
  it('should render nested children structures', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: 50 }),
        fc.uniqueArray(fc.string({ minLength: 1, maxLength: 20 }).filter(s => s.trim().length > 0), { minLength: 1, maxLength: 5 }),
        (blur, texts) => {
          const { container } = render(
            <GlassmorphismCard blur={blur}>
              <div>
                {texts.map((text, i) => (
                  <p key={i}>{text}</p>
                ))}
              </div>
            </GlassmorphismCard>
          )
          
          const card = container.firstChild as HTMLElement
          expect(card).toBeInTheDocument()
          // Check that all texts are present in the card's text content
          const cardText = card.textContent || ''
          texts.forEach(text => {
            expect(cardText).toContain(text)
          })
        }
      ),
      { numRuns: 30 }
    )
  })
})
