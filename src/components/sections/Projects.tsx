import { useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver'
import { useScrollReveal } from '../../hooks/useScrollReveal'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import { createSectionRevealTimeline } from '../../lib/animations'
import { BackgroundPattern } from '../background/BackgroundPattern'
import { SectionLabel } from '../ui/SectionLabel'
import { WordReveal } from '../ui/WordReveal'
import { ProjectCard } from '../ui/ProjectCard'
import { portfolioData } from '../../data/portfolio'
import { useTheme } from '../../hooks/useTheme'

/**
 * Projects section — asymmetric bento-style layout.
 * Featured project (Moonlit Threads) spans full width.
 * Requirements: 7.1, 7.4
 */
export function Projects() {
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
      const tl = createSectionRevealTimeline(containerRef, 0.15)
      tl.play()
      return () => { tl.kill() }
    }
  }, [isVisible])

  const { projects } = portfolioData
  const featuredProjects = projects.filter((p) => p.featured)
  const regularProjects = projects.filter((p) => !p.featured)

  return (
    <motion.section
      id="projects"
      ref={setRefs}
      aria-label="Featured projects"
      className="relative bg-slate-50 py-24 dark:bg-slate-950"
      initial={prefersReducedMotion ? false : { opacity: 0, y: 40 }}
      animate={sectionRevealed || prefersReducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      <BackgroundPattern theme={theme} pattern="grid" opacity={0.05} />
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Section label */}
        <div className="reveal-animate mb-2">
          <SectionLabel number="04" title="Projects" />
        </div>

        {/* Section heading */}
        <div className="reveal-animate mb-16">
          <WordReveal
            text="Featured Projects"
            className="text-4xl font-black tracking-tight text-slate-900 dark:text-white sm:text-5xl lg:text-6xl"
          />
        </div>

        <div ref={containerRef}>
          {/* Featured projects — full width */}
          {featuredProjects.length > 0 && (
            <div className="reveal-animate mb-6 space-y-6">
              {featuredProjects.map((project) => (
                <ProjectCard key={project.id} project={project} featured />
              ))}
            </div>
          )}

          {/* Regular projects — asymmetric grid */}
          {regularProjects.length > 0 && (
            <div
              className={`reveal-animate grid gap-6 ${
                regularProjects.length === 1
                  ? 'grid-cols-1 md:grid-cols-2'
                  : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
              }`}
            >
              {regularProjects.map((project, index) => (
                <div
                  key={project.id}
                  className={
                    // Give the first regular project a slightly larger footprint
                    index === 0 && regularProjects.length >= 2
                      ? 'md:col-span-2 lg:col-span-1'
                      : ''
                  }
                >
                  <ProjectCard project={project} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.section>
  )
}
