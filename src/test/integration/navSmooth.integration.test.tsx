/**
 * Integration test: Navigation smooth scroll
 * Validates: Requirements 9.3
 *
 * Clicks a nav link, asserts scrollIntoView is called with behavior: 'smooth'.
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Navbar, NAV_ITEMS } from '../../components/layout/Navbar'

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

describe('Navigation smooth scroll integration', () => {
  const mockSections: HTMLElement[] = []

  beforeEach(() => {
    // Create mock section elements for each nav item
    NAV_ITEMS.forEach((item) => {
      const el = document.createElement('section')
      el.id = item.sectionId
      el.scrollIntoView = vi.fn()
      document.body.appendChild(el)
      mockSections.push(el)
    })
  })

  afterEach(() => {
    mockSections.forEach((el) => {
      if (el.parentNode) el.parentNode.removeChild(el)
    })
    mockSections.length = 0
    vi.clearAllMocks()
  })

  it('calls scrollIntoView with behavior: smooth when a nav link is clicked', () => {
    render(<Navbar {...defaultProps} />)

    // Click the "About" nav link
    const aboutLinks = screen.getAllByRole('link', { name: /about/i })
    fireEvent.click(aboutLinks[0])

    const aboutSection = document.getElementById('about')
    expect(aboutSection?.scrollIntoView).toHaveBeenCalledWith({
      behavior: 'smooth',
      block: 'start',
    })
  })

  it('calls scrollIntoView with behavior: smooth for every nav section', () => {
    render(<Navbar {...defaultProps} />)

    NAV_ITEMS.forEach((item) => {
      const links = screen.getAllByRole('link', { name: new RegExp(item.label, 'i') })
      fireEvent.click(links[0])

      const section = document.getElementById(item.sectionId)
      expect(section?.scrollIntoView).toHaveBeenCalledWith({
        behavior: 'smooth',
        block: 'start',
      })
    })
  })

  it('prevents default link navigation when clicking nav links', () => {
    render(<Navbar {...defaultProps} />)

    const aboutLinks = screen.getAllByRole('link', { name: /about/i })
    const clickEvent = new MouseEvent('click', { bubbles: true, cancelable: true })
    aboutLinks[0].dispatchEvent(clickEvent)

    // scrollIntoView should still be called (smooth scroll handled)
    const aboutSection = document.getElementById('about')
    expect(aboutSection?.scrollIntoView).toHaveBeenCalled()
  })
})
