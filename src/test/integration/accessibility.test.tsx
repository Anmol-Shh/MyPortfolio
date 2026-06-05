/**
 * Accessibility tests using axe-core via jest-axe
 * Validates: Requirements 11.5
 *
 * Runs axe on each section component and asserts zero violations
 * in both dark and light themes.
 */
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render } from '@testing-library/react'
import { axe, toHaveNoViolations } from 'jest-axe'

expect.extend(toHaveNoViolations)

// ── Mocks ────────────────────────────────────────────────────────────────────

vi.mock('framer-motion', () => ({
  motion: {
    a: ({ children, ...props }: React.HTMLAttributes<HTMLAnchorElement> & { href?: string; download?: boolean; target?: string; rel?: string }) => <a {...props}>{children}</a>,
    article: ({ children, ...props }: React.HTMLAttributes<HTMLElement>) => <article {...props}>{children}</article>,
    div: ({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) => <div {...props}>{children}</div>,
    li: ({ children, ...props }: React.HTMLAttributes<HTMLLIElement>) => <li {...props}>{children}</li>,
    section: ({ children, ...props }: React.HTMLAttributes<HTMLElement>) => <section {...props}>{children}</section>,
    span: ({ children, ...props }: React.HTMLAttributes<HTMLSpanElement>) => <span {...props}>{children}</span>,
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}))

vi.mock('@tsparticles/react', () => ({
  default: () => <div data-testid="particles" aria-hidden="true" />,
}))

vi.mock('@tsparticles/slim', () => ({
  loadSlim: vi.fn().mockResolvedValue(undefined),
}))

vi.mock('@tsparticles/engine', () => ({
  tsParticles: {},
}))

vi.mock('../../lib/animations', () => ({
  createPreloaderTimeline: () => ({ play: vi.fn(), kill: vi.fn(), progress: vi.fn(), eventCallback: vi.fn() }),
  createHeroEntranceTimeline: () => ({ play: vi.fn(), kill: vi.fn() }),
  createSectionRevealTimeline: () => ({ play: vi.fn(), kill: vi.fn() }),
  createTimelineDrawTimeline: () => ({ play: vi.fn(), kill: vi.fn() }),
  microInteractions: {
    button: { rest: {}, hover: { scale: 1.05, y: -2 }, tap: { scale: 0.95 } },
    link: { rest: {}, hover: { x: 4 }, tap: { scale: 0.98 } },
    card: { rest: {}, hover: { y: -8, scale: 1.02 }, tap: { scale: 0.98 } },
    badge: { rest: {}, hover: { y: -6, scale: 1.05, rotate: -2 }, tap: { scale: 0.95 } },
    icon: { rest: {}, hover: { scale: 1.15, rotate: 5 }, tap: { scale: 0.9 } },
  },
  microTransitions: {
    fast: { duration: 0.15, ease: 'easeOut' },
    normal: { duration: 0.3, ease: 'easeOut' },
    spring: { type: 'spring', stiffness: 300, damping: 20 },
  },
  SHADOW_DEPTH: {
    none: 'none',
    sm: '0 1px 2px rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px rgba(0, 0, 0, 0.07)',
    lg: '0 10px 15px rgba(0, 0, 0, 0.1)',
    xl: '0 20px 25px rgba(0, 0, 0, 0.15)',
    '2xl': '0 25px 50px rgba(0, 0, 0, 0.25)',
  },
  ANIMATION_DURATION: { instant: 0, fast: 150, normal: 300, medium: 600, slow: 800, verySlow: 1200 },
  ANIMATION_EASING: { easeOut: 'cubic-bezier(0.33, 1, 0.68, 1)', power2Out: 'power2.out', power2InOut: 'power2.inOut' },
  STAGGER_DELAY: { fast: 60, normal: 100, medium: 150, slow: 200 },
}))

vi.mock('../../hooks/useIntersectionObserver', () => ({
  useIntersectionObserver: () => true,
}))

vi.mock('../../lib/emailjs', () => ({
  sendContactEmail: vi.fn(),
  EmailDeliveryError: class extends Error {},
  EmailTimeoutError: class extends Error {},
}))

// ── Imports (after mocks) ─────────────────────────────────────────────────────

import { Navbar, NAV_ITEMS } from '../../components/layout/Navbar'
import { Hero } from '../../components/sections/Hero'
import { About } from '../../components/sections/About'
import { Skills } from '../../components/sections/Skills'
import { Experience } from '../../components/sections/Experience'
import { Projects } from '../../components/sections/Projects'
import { Contact } from '../../components/sections/Contact'
import { ContactForm } from '../../components/ui/ContactForm'

// ── Helpers ───────────────────────────────────────────────────────────────────

async function checkA11y(ui: React.ReactElement) {
  const { container } = render(ui)
  const results = await axe(container)
  expect(results).toHaveNoViolations()
}

// ── Tests ─────────────────────────────────────────────────────────────────────

describe('Accessibility — zero axe violations', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    document.documentElement.classList.remove('dark')
  })

  describe('Navbar', () => {
    it('has no violations in light theme', async () => {
      await checkA11y(
        <Navbar items={NAV_ITEMS} activeSection="hero" onThemeToggle={vi.fn()} theme="light" />,
      )
    })

    it('has no violations in dark theme', async () => {
      document.documentElement.classList.add('dark')
      await checkA11y(
        <Navbar items={NAV_ITEMS} activeSection="hero" onThemeToggle={vi.fn()} theme="dark" />,
      )
    })
  })

  describe('Hero section', () => {
    it('has no violations in light theme', async () => {
      await checkA11y(<Hero theme="light" />)
    })

    it('has no violations in dark theme', async () => {
      document.documentElement.classList.add('dark')
      await checkA11y(<Hero theme="dark" />)
    })
  })

  describe('About section', () => {
    it('has no violations in light theme', async () => {
      await checkA11y(<About />)
    })

    it('has no violations in dark theme', async () => {
      document.documentElement.classList.add('dark')
      await checkA11y(<About />)
    })
  })

  describe('Skills section', () => {
    it('has no violations in light theme', async () => {
      await checkA11y(<Skills />)
    })

    it('has no violations in dark theme', async () => {
      document.documentElement.classList.add('dark')
      await checkA11y(<Skills />)
    })
  })

  describe('Experience section', () => {
    it('has no violations in light theme', async () => {
      await checkA11y(<Experience />)
    })

    it('has no violations in dark theme', async () => {
      document.documentElement.classList.add('dark')
      await checkA11y(<Experience />)
    })
  })

  describe('Projects section', () => {
    it('has no violations in light theme', async () => {
      await checkA11y(<Projects />)
    })

    it('has no violations in dark theme', async () => {
      document.documentElement.classList.add('dark')
      await checkA11y(<Projects />)
    })
  })

  describe('Contact section', () => {
    it('has no violations in light theme', async () => {
      await checkA11y(<Contact />)
    })

    it('has no violations in dark theme', async () => {
      document.documentElement.classList.add('dark')
      await checkA11y(<Contact />)
    })
  })

  describe('ContactForm', () => {
    it('has no violations in light theme', async () => {
      await checkA11y(<ContactForm />)
    })

    it('has no violations in dark theme', async () => {
      document.documentElement.classList.add('dark')
      await checkA11y(<ContactForm />)
    })
  })
})
