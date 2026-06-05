import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ThemeToggle } from '../ui/ThemeToggle'
import { microInteractions, microTransitions } from '../../lib/animations'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import type { Theme } from '../../types'

export interface NavItem {
  label: string
  href: string
  sectionId: string
}

interface NavbarProps {
  items: NavItem[]
  activeSection: string
  onThemeToggle: () => void
  theme: Theme
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Home', href: '#hero', sectionId: 'hero' },
  { label: 'About', href: '#about', sectionId: 'about' },
  { label: 'Skills', href: '#skills', sectionId: 'skills' },
  { label: 'Experience', href: '#experience', sectionId: 'experience' },
  { label: 'Projects', href: '#projects', sectionId: 'projects' },
  { label: 'Contact', href: '#contact', sectionId: 'contact' },
]

export { NAV_ITEMS }

/**
 * Fixed navigation bar.
 * - Highlights active section via IntersectionObserver
 * - Applies backdrop blur after 80px scroll
 * - Collapses to hamburger on < 768px
 * Requirements: 9.1–9.7
 */
export function Navbar({ items, activeSection, onThemeToggle, theme }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const mobileMenuRef = useRef<HTMLDivElement>(null)
  const prefersReducedMotion = useReducedMotion()

  // Track scroll position for backdrop blur
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 80)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close mobile menu on resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setIsMobileOpen(false)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = isMobileOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isMobileOpen])

  const handleNavClick = (sectionId: string) => {
    setIsMobileOpen(false)
    const el = document.getElementById(sectionId)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/90 backdrop-blur-md shadow-lg dark:bg-slate-900/80'
          : 'bg-transparent'
      }`}
    >
      <nav
        className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8"
        aria-label="Main navigation"
      >
        {/* Logo / Brand */}
        <a
          href="#hero"
          onClick={(e) => { e.preventDefault(); handleNavClick('hero') }}
          className="text-xl font-bold tracking-tight text-slate-900 dark:text-white"
          aria-label="Anmol Sharma — back to top"
        >
          <span className="text-violet-400">A</span>S
        </a>

        {/* Desktop nav links */}
        <ul className="hidden items-center gap-1 md:flex" role="list">
          {items.map((item) => (
            <li key={item.sectionId}>
              <motion.a
                href={item.href}
                onClick={(e) => { e.preventDefault(); handleNavClick(item.sectionId) }}
                aria-current={activeSection === item.sectionId ? 'page' : undefined}
                whileHover={prefersReducedMotion ? undefined : microInteractions.link.hover}
                whileTap={prefersReducedMotion ? undefined : microInteractions.link.tap}
                transition={microTransitions.fast}
                className={`relative px-3 py-2 text-sm font-medium transition-colors duration-200 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 ${
                  activeSection === item.sectionId
                    ? 'text-violet-600 dark:text-violet-400'
                    : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white'
                }`}
              >
                {item.label}
                {activeSection === item.sectionId && (
                  <motion.span
                    layoutId="nav-active-indicator"
                    className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-violet-400"
                  />
                )}
              </motion.a>
            </li>
          ))}
        </ul>

        {/* Right side: theme toggle + hamburger */}
        <div className="flex items-center gap-2">
          <ThemeToggle theme={theme} onThemeToggle={onThemeToggle} />

          {/* Hamburger button — mobile only */}
          <button
            type="button"
            className="flex h-11 w-11 items-center justify-center rounded-md text-slate-600 hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white md:hidden"
            aria-label={isMobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isMobileOpen}
            aria-controls="mobile-menu"
            onClick={() => setIsMobileOpen((prev) => !prev)}
          >
            <span className="sr-only">{isMobileOpen ? 'Close menu' : 'Open menu'}</span>
            <motion.div
              animate={isMobileOpen ? 'open' : 'closed'}
              className="flex h-5 w-5 flex-col items-center justify-center gap-1.5"
            >
              <motion.span
                variants={{ open: { rotate: 45, y: 8 }, closed: { rotate: 0, y: 0 } }}
                transition={{ duration: 0.2 }}
                className="block h-0.5 w-5 rounded-full bg-current"
              />
              <motion.span
                variants={{ open: { opacity: 0, scaleX: 0 }, closed: { opacity: 1, scaleX: 1 } }}
                transition={{ duration: 0.2 }}
                className="block h-0.5 w-5 rounded-full bg-current"
              />
              <motion.span
                variants={{ open: { rotate: -45, y: -8 }, closed: { rotate: 0, y: 0 } }}
                transition={{ duration: 0.2 }}
                className="block h-0.5 w-5 rounded-full bg-current"
              />
            </motion.div>
          </button>
        </div>
      </nav>

      {/* Mobile full-screen overlay menu */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            id="mobile-menu"
            ref={mobileMenuRef}
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="fixed inset-0 z-30 flex flex-col items-center justify-center bg-white dark:bg-slate-900 md:hidden"
            role="dialog"
            aria-modal="true"
            aria-label="Mobile navigation menu"
          >
            <ul className="flex flex-col items-center gap-6" role="list">
              {items.map((item) => (
                <li key={item.sectionId}>
                  <a
                    href={item.href}
                    onClick={(e) => { e.preventDefault(); handleNavClick(item.sectionId) }}
                    aria-current={activeSection === item.sectionId ? 'page' : undefined}
                    className={`text-2xl font-semibold transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 ${
                      activeSection === item.sectionId
                        ? 'text-violet-600 dark:text-violet-400'
                        : 'text-slate-700 hover:text-slate-900 dark:text-slate-200 dark:hover:text-white'
                    }`}
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
