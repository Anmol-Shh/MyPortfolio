/**
 * Unit tests for Navbar component
 * Validates: Requirements 9.4, 9.5, 9.6
 */
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Navbar, NAV_ITEMS } from '../../components/layout/Navbar'

// Mock framer-motion to avoid animation complexity in tests
vi.mock('framer-motion', () => ({
  motion: {
    a: ({ children, ...props }: React.HTMLAttributes<HTMLAnchorElement> & { href?: string; onClick?: React.MouseEventHandler<HTMLAnchorElement>; 'aria-current'?: string }) => <a {...props}>{children}</a>,
    div: ({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
      <div {...props}>{children}</div>
    ),
    span: ({ children, ...props }: React.HTMLAttributes<HTMLSpanElement>) => (
      <span {...props}>{children}</span>
    ),
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}))

const defaultProps = {
  items: NAV_ITEMS,
  activeSection: 'hero',
  onThemeToggle: vi.fn(),
  theme: 'dark' as const,
}

describe('Navbar', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('active section highlight', () => {
    it('marks the active section link with aria-current="page"', () => {
      render(<Navbar {...defaultProps} activeSection="about" />)
      const aboutLink = screen.getAllByRole('link', { name: /about/i })[0]
      expect(aboutLink).toHaveAttribute('aria-current', 'page')
    })

    it('does not mark inactive links with aria-current', () => {
      render(<Navbar {...defaultProps} activeSection="about" />)
      const skillsLinks = screen.getAllByRole('link', { name: /skills/i })
      skillsLinks.forEach((link) => {
        expect(link).not.toHaveAttribute('aria-current', 'page')
      })
    })

    it('updates active link when activeSection prop changes', () => {
      const { rerender } = render(<Navbar {...defaultProps} activeSection="hero" />)

      // Initially hero is active
      const heroLinks = screen.getAllByRole('link', { name: /home/i })
      expect(heroLinks[0]).toHaveAttribute('aria-current', 'page')

      // Change to projects
      rerender(<Navbar {...defaultProps} activeSection="projects" />)
      const projectsLinks = screen.getAllByRole('link', { name: /projects/i })
      expect(projectsLinks[0]).toHaveAttribute('aria-current', 'page')

      // Hero should no longer be active
      const heroLinksAfter = screen.getAllByRole('link', { name: /home/i })
      expect(heroLinksAfter[0]).not.toHaveAttribute('aria-current', 'page')
    })
  })

  describe('hamburger menu', () => {
    it('hamburger button is visible', () => {
      render(<Navbar {...defaultProps} />)
      const hamburger = screen.getByRole('button', { name: /open menu/i })
      expect(hamburger).toBeInTheDocument()
    })

    it('opens mobile menu when hamburger is clicked', () => {
      render(<Navbar {...defaultProps} />)
      const hamburger = screen.getByRole('button', { name: /open menu/i })

      fireEvent.click(hamburger)

      expect(screen.getByRole('dialog', { name: /mobile navigation menu/i })).toBeInTheDocument()
    })

    it('closes mobile menu when hamburger is clicked again', () => {
      render(<Navbar {...defaultProps} />)
      const hamburger = screen.getByRole('button', { name: /open menu/i })

      // Open
      fireEvent.click(hamburger)
      expect(screen.getByRole('dialog')).toBeInTheDocument()

      // Close
      fireEvent.click(screen.getByRole('button', { name: /close menu/i }))
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    })

    it('hamburger button has correct aria-expanded state', () => {
      render(<Navbar {...defaultProps} />)
      const hamburger = screen.getByRole('button', { name: /open menu/i })

      expect(hamburger).toHaveAttribute('aria-expanded', 'false')
      fireEvent.click(hamburger)
      expect(screen.getByRole('button', { name: /close menu/i })).toHaveAttribute('aria-expanded', 'true')
    })
  })

  describe('navigation links', () => {
    it('renders all nav items', () => {
      render(<Navbar {...defaultProps} />)
      NAV_ITEMS.forEach((item) => {
        const links = screen.getAllByRole('link', { name: new RegExp(item.label, 'i') })
        expect(links.length).toBeGreaterThan(0)
      })
    })

    it('calls scrollIntoView when a nav link is clicked', () => {
      render(<Navbar {...defaultProps} />)

      // Create a mock section element
      const mockSection = document.createElement('div')
      mockSection.id = 'about'
      mockSection.scrollIntoView = vi.fn()
      document.body.appendChild(mockSection)

      const aboutLinks = screen.getAllByRole('link', { name: /about/i })
      fireEvent.click(aboutLinks[0])

      expect(mockSection.scrollIntoView).toHaveBeenCalledWith({
        behavior: 'smooth',
        block: 'start',
      })

      document.body.removeChild(mockSection)
    })
  })

  describe('theme toggle', () => {
    it('renders the theme toggle button', () => {
      render(<Navbar {...defaultProps} />)
      expect(screen.getByRole('button', { name: /switch to light theme/i })).toBeInTheDocument()
    })

    it('calls onThemeToggle when theme button is clicked', () => {
      const onThemeToggle = vi.fn()
      render(<Navbar {...defaultProps} onThemeToggle={onThemeToggle} />)

      fireEvent.click(screen.getByRole('button', { name: /switch to light theme/i }))
      expect(onThemeToggle).toHaveBeenCalledTimes(1)
    })
  })
})
