/**
 * Unit tests for SkillBadge component
 * Validates: Requirements 5.3, 5.4
 */
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { SkillBadge } from '../../components/ui/SkillBadge'

vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
      <div {...props}>{children}</div>
    ),
  },
}))

describe('SkillBadge', () => {
  describe('label rendering', () => {
    it('renders the skill name', () => {
      render(<SkillBadge name="Java" category="languages" />)
      expect(screen.getByText('Java')).toBeInTheDocument()
    })

    it('renders the skill name for each category', () => {
      const categories = ['languages', 'backend', 'tools', 'core-cs'] as const
      categories.forEach((category) => {
        const { unmount } = render(
          <SkillBadge name={`Skill-${category}`} category={category} />,
        )
        expect(screen.getByText(`Skill-${category}`)).toBeInTheDocument()
        unmount()
      })
    })
  })

  describe('icon rendering', () => {
    it('renders icon element when icon prop is provided', () => {
      const { container } = render(
        <SkillBadge name="Java" icon="devicon-java-plain" category="languages" />,
      )
      const icon = container.querySelector('i.devicon-java-plain')
      expect(icon).toBeInTheDocument()
    })

    it('does not render icon element when icon prop is omitted', () => {
      const { container } = render(
        <SkillBadge name="DSA" category="core-cs" />,
      )
      expect(container.querySelector('i')).not.toBeInTheDocument()
    })

    it('icon has aria-hidden attribute', () => {
      const { container } = render(
        <SkillBadge name="Python" icon="devicon-python-plain" category="languages" />,
      )
      const icon = container.querySelector('i')
      expect(icon).toHaveAttribute('aria-hidden', 'true')
    })
  })

  describe('category class application', () => {
    it('applies languages category class', () => {
      const { container } = render(
        <SkillBadge name="Java" category="languages" />,
      )
      const badge = container.firstChild as HTMLElement
      expect(badge.className).toContain('skill-badge--languages')
    })

    it('applies backend category class', () => {
      const { container } = render(
        <SkillBadge name="Laravel" category="backend" />,
      )
      const badge = container.firstChild as HTMLElement
      expect(badge.className).toContain('skill-badge--backend')
    })

    it('applies tools category class', () => {
      const { container } = render(
        <SkillBadge name="Git" category="tools" />,
      )
      const badge = container.firstChild as HTMLElement
      expect(badge.className).toContain('skill-badge--tools')
    })

    it('applies core-cs category class', () => {
      const { container } = render(
        <SkillBadge name="DSA" category="core-cs" />,
      )
      const badge = container.firstChild as HTMLElement
      expect(badge.className).toContain('skill-badge--core-cs')
    })
  })

  describe('accessibility', () => {
    it('renders with a data-testid or class for identification', () => {
      const { container } = render(<SkillBadge name="Java" category="languages" />)
      const badge = container.querySelector('.skill-badge')
      expect(badge).toBeInTheDocument()
    })
  })
})
