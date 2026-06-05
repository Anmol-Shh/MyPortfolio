import { useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver'
import { useScrollReveal } from '../../hooks/useScrollReveal'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import { createSectionRevealTimeline, microInteractions, microTransitions } from '../../lib/animations'
import { BackgroundPattern } from '../background/BackgroundPattern'
import { SectionLabel } from '../ui/SectionLabel'
import { WordReveal } from '../ui/WordReveal'
import { ContactForm } from '../ui/ContactForm'
import { portfolioData } from '../../data/portfolio'
import { useTheme } from '../../hooks/useTheme'

export function Contact() {
  const sectionRef = useRef<HTMLElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const isVisible = useIntersectionObserver(sectionRef, { threshold: 0.1 })
  const { ref: scrollRevealRef, isVisible: sectionRevealed } = useScrollReveal({ threshold: 0.08, once: true })
  const prefersReducedMotion = useReducedMotion()
  const { theme } = useTheme()

  // Combine refs
  const setRefs = (node: HTMLElement | null) => {
    (sectionRef as React.MutableRefObject<HTMLElement | null>).current = node
    ;(scrollRevealRef as React.MutableRefObject<Element | null>).current = node
  }

  useEffect(() => {
    if (isVisible && containerRef.current) {
      const tl = createSectionRevealTimeline(containerRef, 0.12)
      tl.play()
      return () => { tl.kill() }
    }
  }, [isVisible])

  const { contact } = portfolioData

  return (
    <motion.section
      id="contact"
      ref={setRefs}
      aria-label="Contact Anmol Sharma"
      className="relative bg-white py-24 dark:bg-slate-900"
      initial={prefersReducedMotion ? false : { opacity: 0, y: 40 }}
      animate={sectionRevealed || prefersReducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      <BackgroundPattern theme={theme} pattern="noise" opacity={0.05} />
      <div ref={containerRef} className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">

        <div className="reveal-animate mb-2">
          <SectionLabel number="05" title="Contact" />
        </div>

        <div className="reveal-animate mb-4">
          <WordReveal
            text="Get in Touch"
            className="text-4xl font-black tracking-tight text-slate-900 dark:text-white sm:text-5xl lg:text-6xl"
          />
        </div>

        <p className="reveal-animate mb-16 max-w-xl text-base leading-relaxed text-slate-500 dark:text-slate-400">
          Have an opportunity or just want to say hi? My inbox is always open.
        </p>

        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left — contact info */}
          <div className="reveal-animate space-y-8">
            <div>
              <h3 className="mb-6 text-xl font-bold tracking-tight text-slate-900 dark:text-white">Direct Contact</h3>
              <ul className="space-y-4" role="list">
                {/* Email */}
                <li className="flex items-center gap-4">
                  <span aria-hidden="true" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-100 text-violet-600 dark:bg-violet-500/20 dark:text-violet-400">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                      <polyline points="22,6 12,13 2,6" />
                    </svg>
                  </span>
                  <a
                    href={`mailto:${contact.email}`}
                    className="text-sm text-slate-600 transition-colors duration-150 hover:text-violet-600 dark:text-slate-300 dark:hover:text-violet-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500"
                  >
                    {contact.email}
                  </a>
                </li>

                {/* Phone */}
                <li className="flex items-center gap-4">
                  <span aria-hidden="true" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-100 text-violet-600 dark:bg-violet-500/20 dark:text-violet-400">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
                    </svg>
                  </span>
                  <a
                    href={`tel:${contact.phone.replace(/[^+\d]/g, '')}`}
                    className="text-sm text-slate-600 transition-colors duration-150 hover:text-violet-600 dark:text-slate-300 dark:hover:text-violet-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500"
                  >
                    {contact.phone}
                  </a>
                </li>
              </ul>
            </div>

            {/* Social links */}
            <div>
              <h3 className="mb-4 text-xl font-bold tracking-tight text-slate-900 dark:text-white">Find Me Online</h3>
              <div className="flex gap-3">
                <motion.a
                  href={contact.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Anmol Sharma on LinkedIn (opens in new tab)"
                  whileHover={prefersReducedMotion ? undefined : microInteractions.icon.hover}
                  whileTap={prefersReducedMotion ? undefined : microInteractions.icon.tap}
                  transition={microTransitions.fast}
                  className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 text-slate-500 transition-all duration-150 hover:border-violet-400 hover:text-violet-600 dark:border-slate-700/50 dark:text-slate-400 dark:hover:border-violet-500 dark:hover:text-violet-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </motion.a>

                <motion.a
                  href={contact.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Anmol Sharma on GitHub (opens in new tab)"
                  whileHover={prefersReducedMotion ? undefined : microInteractions.icon.hover}
                  whileTap={prefersReducedMotion ? undefined : microInteractions.icon.tap}
                  transition={microTransitions.fast}
                  className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 text-slate-500 transition-all duration-150 hover:border-violet-400 hover:text-violet-600 dark:border-slate-700/50 dark:text-slate-400 dark:hover:border-violet-500 dark:hover:text-violet-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
                  </svg>
                </motion.a>
              </div>
            </div>
          </div>

          {/* Right — contact form */}
          <div className="reveal-animate">
            <ContactForm />
          </div>
        </div>
      </div>
    </motion.section>
  )
}
