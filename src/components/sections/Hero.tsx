import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { HeroBackground } from '../background/HeroBackground'
import { MeshGradient } from '../background/MeshGradient'
import { BackgroundPattern } from '../background/BackgroundPattern'
import { createHeroEntranceTimeline, microInteractions, microTransitions } from '../../lib/animations'
import { TextScramble } from '../ui/TextScramble'
import { MagneticButton } from '../ui/MagneticButton'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import { portfolioData } from '../../data/portfolio'
import type { Theme } from '../../types'

interface HeroProps {
  theme: Theme
}

const ROLES = ['Software Engineer', 'Backend Developer', 'Problem Solver', 'DSA Enthusiast']

/**
 * Full-viewport hero section with scramble text, magnetic CTAs,
 * staggered entrance animation, and interactive particle background.
 * Requirements: 1.1–1.6, 7.2, 7.3, 7.4, 7.5, 7.7
 */
export function Hero({ theme }: HeroProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const { name, resumeUrl } = portfolioData
  const prefersReducedMotion = useReducedMotion()

  useEffect(() => {
    const tl = createHeroEntranceTimeline(containerRef)
    tl.play()
    return () => { tl.kill() }
  }, [])

  const handleScrollToProjects = (e: React.MouseEvent) => {
    e.preventDefault()
    document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const [firstName, lastName] = name.split(' ')

  return (
    <section
      id="hero"
      aria-label="Hero section"
      className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-50 dark:bg-slate-950"
    >
      <HeroBackground theme={theme} />
      <MeshGradient theme={theme} />
      <BackgroundPattern theme={theme} pattern="dots" opacity={0.05} />

      {/* Bottom gradient fade */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-slate-50/90 dark:to-slate-950/80" />

      {/* Content */}
      <div
        ref={containerRef}
        className="relative z-10 mx-auto max-w-5xl px-4 py-24 text-center sm:px-6 lg:px-8"
      >
        {/* Eyebrow */}
        <p className="hero-animate mb-6 inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-violet-600 dark:text-violet-400">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-violet-500 dark:bg-violet-400" aria-hidden="true" />
          Available for opportunities
        </p>

        {/* Name — enhanced typography scale (h1) */}
        <h1 className="hero-animate mb-4 text-6xl font-black leading-none tracking-tight drop-shadow-lg sm:text-8xl lg:text-9xl">
          <span className="block text-slate-900 dark:text-white">{firstName}</span>
          <span className="block bg-gradient-to-r from-pink-400 via-violet-400 to-purple-400 bg-clip-text text-transparent">
            {lastName}
          </span>
        </h1>

        {/* Scramble role */}
        <div className="hero-animate mb-8 flex items-center justify-center gap-3 text-2xl font-semibold text-slate-600 dark:text-slate-300 sm:text-3xl">
          <span className="text-slate-400 dark:text-slate-500">/</span>
          <TextScramble
            texts={ROLES}
            interval={2400}
            scrambleDuration={500}
            className="min-w-[250px] text-center font-mono text-xl sm:text-xl lg:text-2xl"
          />
          <span className="text-slate-400 dark:text-slate-500">/</span>
        </div>

        {/* Tagline — body large typography */}
        <p className="hero-animate mx-auto mb-12 max-w-xl text-lg leading-relaxed text-slate-600 dark:text-slate-400">
          Building scalable backend systems with clean code and sharp problem-solving.
        </p>

        {/* CTA buttons — micro-interactions applied */}
        <div className="hero-animate flex flex-col items-center justify-center gap-4 sm:flex-row">
          <motion.div
            whileHover={prefersReducedMotion ? undefined : microInteractions.button.hover}
            whileTap={prefersReducedMotion ? undefined : microInteractions.button.tap}
            transition={microTransitions.fast}
          >
            <MagneticButton
              as="a"
              href="#projects"
              onClick={handleScrollToProjects}
              strength={0.4}
              className="group relative inline-flex min-h-[48px] items-center justify-center overflow-hidden rounded-full bg-violet-600 px-8 py-3 text-sm font-semibold text-white shadow-md transition-shadow duration-150 hover:shadow-lg hover:bg-violet-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-50 dark:focus-visible:ring-offset-slate-950"
            >
              <span aria-hidden="true" className="absolute inset-0 -z-10 rounded-full bg-violet-400 opacity-0 blur-xl transition-opacity duration-150 group-hover:opacity-30" />
              View My Projects
              <svg className="ml-2 h-4 w-4 transition-transform duration-150 group-hover:translate-x-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
              </svg>
            </MagneticButton>
          </motion.div>

          <motion.div
            whileHover={prefersReducedMotion ? undefined : microInteractions.button.hover}
            whileTap={prefersReducedMotion ? undefined : microInteractions.button.tap}
            transition={microTransitions.fast}
          >
            <MagneticButton
              as="a"
              href={resumeUrl}
              download
              strength={0.4}
              className="inline-flex min-h-[48px] items-center justify-center rounded-full border border-slate-300 bg-white/50 px-8 py-3 text-sm font-semibold text-slate-700 backdrop-blur-sm transition-all duration-150 hover:border-violet-500 hover:bg-white hover:text-slate-900 dark:border-slate-600 dark:bg-transparent dark:text-slate-300 dark:hover:border-violet-500 dark:hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-50 dark:focus-visible:ring-offset-slate-950"
            >
              Download Resume
            </MagneticButton>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <div
          aria-hidden="true"
          className="hero-animate mt-20 flex flex-col items-center gap-2"
          style={{ animation: 'bounce 2s ease-in-out infinite' }}
        >
          <span className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-600">Scroll</span>
          <div className="h-10 w-px bg-gradient-to-b from-slate-400 to-transparent dark:from-slate-600" />
        </div>
      </div>
    </section>
  )
}
