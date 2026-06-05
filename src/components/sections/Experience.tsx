import { useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver'
import { useScrollReveal } from '../../hooks/useScrollReveal'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import { createTimelineDrawTimeline } from '../../lib/animations'
import { BackgroundPattern } from '../background/BackgroundPattern'
import { SectionLabel } from '../ui/SectionLabel'
import { WordReveal } from '../ui/WordReveal'
import { portfolioData } from '../../data/portfolio'
import { useTheme } from '../../hooks/useTheme'
import type { ExperienceRole } from '../../types'

interface ExperienceCardProps {
  role: ExperienceRole
  index: number
}

function ExperienceCard({ role, index }: ExperienceCardProps) {
  const isEven = index % 2 === 0

  return (
    <div
      className="timeline-card relative flex gap-0"
      data-company={role.company}
      data-title={role.title}
      data-period={role.period}
      data-location={role.location}
    >
      {/* Left column — even indices (0, 2, 4…) */}
      <div className="hidden md:flex md:w-1/2 md:justify-end md:pr-8">
        {isEven && <RoleCard role={role} />}
      </div>

      {/* Center dot */}
      <div className="relative flex shrink-0 flex-col items-center px-0">
        <div className="z-10 flex h-4 w-4 items-center justify-center rounded-full border-2 border-violet-500 bg-white shadow-lg shadow-violet-500/30 dark:bg-slate-950" />
      </div>

      {/* Right column — odd indices (1, 3, 5…) */}
      <div className="hidden md:block md:w-1/2 md:pl-8">
        {!isEven && <RoleCard role={role} />}
      </div>

      {/* Mobile — always full width */}
      <div className="flex-1 md:hidden">
        <RoleCard role={role} />
      </div>
    </div>
  )
}

function CurrentBadge() {
  return (
    <motion.span
      className="relative inline-flex items-center gap-1.5 rounded-full border border-violet-400/50 bg-violet-100 px-3 py-1 text-xs font-semibold text-violet-700 shadow-md shadow-violet-500/50 dark:border-violet-500/40 dark:bg-violet-500/20 dark:text-violet-300"
      aria-label="Current role"
      animate={{
        boxShadow: [
          '0 4px 6px rgba(139, 92, 246, 0.3)',
          '0 4px 14px rgba(139, 92, 246, 0.6)',
          '0 4px 6px rgba(139, 92, 246, 0.3)',
        ],
      }}
      transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
    >
      {/* Animated pulse dot */}
      <span className="relative flex h-2 w-2" aria-hidden="true">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-violet-500 opacity-75 dark:bg-violet-400" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-violet-600 dark:bg-violet-400" />
      </span>
      Current
    </motion.span>
  )
}

function RoleCard({ role }: { role: ExperienceRole }) {
  const prefersReducedMotion = useReducedMotion()
  const isCurrent = role.period.includes('Current')

  return (
    <motion.article
      className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xl dark:border-slate-700/50 dark:bg-slate-800/60"
      aria-label={`${role.title} at ${role.company}`}
      whileHover={
        prefersReducedMotion
          ? undefined
          : {
              y: -8,
              scale: 1.01,
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)',
            }
      }
      transition={{ duration: 0.2, ease: 'easeOut' }}
    >
      <div className="mb-4">
        <div className="mb-1 flex flex-wrap items-center gap-2">
          <h3 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">{role.title}</h3>
          {isCurrent && <CurrentBadge />}
        </div>
        <p className="font-semibold text-violet-600 dark:text-violet-400">{role.company}</p>
        <div className="mt-1 flex flex-wrap gap-3 text-sm text-slate-500 dark:text-slate-400">
          <span>{role.period}</span>
          <span aria-hidden="true">·</span>
          <span>{role.location}</span>
        </div>
      </div>
      <ul className="space-y-2" role="list" aria-label="Key achievements">
        {role.achievements.map((achievement, i) => (
          <li key={i} className="flex items-start gap-2 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
            <span aria-hidden="true" className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-violet-500 dark:bg-violet-400" />
            {achievement}
          </li>
        ))}
      </ul>
    </motion.article>
  )
}

/**
 * Experience section — vertical timeline on desktop, stacked cards on mobile.
 * Roles displayed in reverse-chronological order.
 * Requirements: 6.1–6.5
 */
export function Experience() {
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
      const tl = createTimelineDrawTimeline(containerRef)
      tl.play()
      return () => { tl.kill() }
    }
  }, [isVisible])

  // Already in reverse-chronological order in data (ASPIA 2025 → WebMark 2024)
  const { experience } = portfolioData

  return (
    <motion.section
      id="experience"
      ref={setRefs}
      aria-label="Work experience"
      className="relative bg-white py-24 dark:bg-slate-900"
      initial={prefersReducedMotion ? false : { opacity: 0, y: 40 }}
      animate={sectionRevealed || prefersReducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      <BackgroundPattern theme={theme} pattern="noise" opacity={0.05} />
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        {/* Section label */}
        <div className="mb-2">
          <SectionLabel number="03" title="Experience" />
        </div>

        {/* Section heading */}
        <div className="mb-16">
          <WordReveal
            text="Work Experience"
            className="text-4xl font-black tracking-tight text-slate-900 dark:text-white sm:text-5xl lg:text-6xl"
          />
        </div>

        {/* Timeline */}
        <div ref={containerRef} className="relative">
          {/* Vertical line — desktop only */}
          <div
            aria-hidden="true"
            className="timeline-line absolute left-1/2 top-0 hidden h-full w-0.5 -translate-x-1/2 bg-gradient-to-b from-violet-500 via-purple-500 to-transparent md:block"
          />

          {/* Role cards */}
          <div className="space-y-10">
            {experience.map((role, index) => (
              <ExperienceCard key={role.company} role={role} index={index} />
            ))}
          </div>
        </div>
      </div>
    </motion.section>
  )
}
