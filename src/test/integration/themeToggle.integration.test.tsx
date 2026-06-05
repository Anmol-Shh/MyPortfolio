/**
 * Integration test: Theme toggle
 * Validates: Requirements 10.3, 10.4
 *
 * Clicks the toggle button, asserts dark class on <html> changes,
 * asserts localStorage is updated.
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Navbar, NAV_ITEMS } from '../../components/layout/Navbar'
import { useTheme } from '../../hooks/useTheme'

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

/**
 * Wrapper component that wires useTheme into Navbar for integration testing.
 */
function ThemedNavbar() {
  const { theme, toggle } = useTheme()
  return (
    <Navbar
      items={NAV_ITEMS}
      activeSection="hero"
      onThemeToggle={toggle}
      theme={theme}
    />
  )
}

describe('Theme toggle integration', () => {
  beforeEach(() => {
    localStorage.clear()
    document.documentElement.classList.remove('dark')
  })

  afterEach(() => {
    localStorage.clear()
    document.documentElement.classList.remove('dark')
    vi.restoreAllMocks()
  })

  it('adds dark class to <html> when toggling from light to dark', () => {
    // Start in light mode
    localStorage.setItem('portfolio-theme', 'light')
    render(<ThemedNavbar />)

    expect(document.documentElement.classList.contains('dark')).toBe(false)

    // Click the theme toggle
    const toggleBtn = screen.getByRole('button', { name: /switch to dark theme/i })
    fireEvent.click(toggleBtn)

    expect(document.documentElement.classList.contains('dark')).toBe(true)
  })

  it('removes dark class from <html> when toggling from dark to light', () => {
    // Start in dark mode
    localStorage.setItem('portfolio-theme', 'dark')
    render(<ThemedNavbar />)

    expect(document.documentElement.classList.contains('dark')).toBe(true)

    // Click the theme toggle
    const toggleBtn = screen.getByRole('button', { name: /switch to light theme/i })
    fireEvent.click(toggleBtn)

    expect(document.documentElement.classList.contains('dark')).toBe(false)
  })

  it('persists theme preference to localStorage after toggle', () => {
    localStorage.setItem('portfolio-theme', 'dark')
    render(<ThemedNavbar />)

    const toggleBtn = screen.getByRole('button', { name: /switch to light theme/i })
    fireEvent.click(toggleBtn)

    expect(localStorage.getItem('portfolio-theme')).toBe('light')
  })

  it('restores theme from localStorage on re-render', () => {
    localStorage.setItem('portfolio-theme', 'dark')
    const { unmount } = render(<ThemedNavbar />)
    expect(document.documentElement.classList.contains('dark')).toBe(true)

    unmount()
    document.documentElement.classList.remove('dark')

    // Re-render — should restore dark from localStorage
    render(<ThemedNavbar />)
    expect(document.documentElement.classList.contains('dark')).toBe(true)
  })
})
