import { useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver'
import { useScrollReveal } from '../../hooks/useScrollReveal'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import { BackgroundPattern } from '../background/BackgroundPattern'
import { SkillBadge, filterByCategory, CATEGORY_COLORS } from '../ui/SkillBadge'
import { SectionLabel } from '../ui/SectionLabel'
import { WordReveal } from '../ui/WordReveal'
import { portfolioData } from '../../data/portfolio'
import { useTheme } from '../../hooks/useTheme'
import type { SkillCategory } from '../../types'
import gsap from 'gsap'

const CATEGORY_LABELS: Record<SkillCategory, string> = {
  languages: 'Languages',
  backend: 'Backend',
  tools: 'Tools',
  'core-cs': 'Core CS',
}

/**
 * Gradient backgrounds for each category section.
 * Subtle, theme-aware gradients that reinforce category identity.
 * Requirements: 4.5
 */
const CATEGORY_SECTION_GRADIENTS: Record<
  SkillCategory,
  { dark: string; light: string }
> = {
  languages: {
    dark: 'from-blue-500/5 via-transparent to-transparent',
    light: 'from-blue-50/80 via-transparent to-transparent',
  },
  backend: {
    dark: 'from-emerald-500/5 via-transparent to-transparent',
    light: 'from-emerald-50/80 via-transparent to-transparent',
  },
  tools: {
    dark: 'from-amber-500/5 via-transparent to-transparent',
    light: 'from-amber-50/80 via-transparent to-transparent',
  },
  'core-cs': {
    dark: 'from-violet-500/5 via-transparent to-transparent',
    light: 'from-violet-50/80 via-transparent to-transparent',
  },
}

/**
 * Underline accent colors for animated category headers.
 * Requirements: 4.5
 */
const CATEGORY_UNDERLINE_COLORS: Record<SkillCategory, string> = {
  languages: 'bg-blue-500',
  backend: 'bg-emerald-500',
  tools: 'bg-amber-500',
  'core-cs': 'bg-violet-500',
}

/**
 * Skills section — grouped badges with staggered entrance animation.
 *
 * Enhancements:
 * - Gradient backgrounds per category section (Req 4.5)
 * - Animated underline on category headers (Req 4.5)
 * - Increased spacing between categories (Req 4.5)
 * - Scale (0.9→1) + rotation (5deg→0) entrance animation (Req 4.4)
 * - power2.out easing, 60ms stagger maintained (Req 4.4)
 * - Theme-aware category colors passed to SkillBadge (Req 4.6)
 */
export function Skills() {
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
    if (!isVisible || !containerRef.current) return

    const badges = containerRef.current.querySelectorAll('.skill-badge')

    // Enhanced entrance: scale 0.9→1, rotation 5deg→0, opacity 0→1, y 20→0
    // Requirements: 4.4 — power2.out easing, 60ms stagger
    gsap.set(badges, { opacity: 0, y: 20, scale: 0.9, rotation: 5 })
    gsap.to(badges, {
      opacity: 1,
      y: 0,
      scale: 1,
      rotation: 0,
      duration: 0.4,
      stagger: 0.06, // 60ms between each badge
      ease: 'power2.out',
    })
  }, [isVisible])

  const { skills, problemSolvingStats } = portfolioData
  const categories: SkillCategory[] = ['languages', 'backend', 'tools', 'core-cs']

  return (
    <motion.section
      id="skills"
      ref={setRefs}
      aria-label="Technical skills"
      className="relative bg-slate-50 py-24 dark:bg-slate-950"
      initial={prefersReducedMotion ? false : { opacity: 0, y: 40 }}
      animate={sectionRevealed || prefersReducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      <BackgroundPattern theme={theme} pattern="dots" opacity={0.05} />
      <div
        ref={containerRef}
        className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8"
      >
        {/* Section label */}
        <div className="mb-2">
          <SectionLabel number="02" title="Skills" />
        </div>

        {/* Section heading */}
        <div className="mb-16">
          <WordReveal
            text="Technical Skills"
            className="text-4xl font-black tracking-tight text-slate-900 dark:text-white sm:text-5xl lg:text-6xl"
          />
        </div>

        {/* Skill groups — increased spacing (space-y-14 vs space-y-10) */}
        <div className="space-y-14">
          {categories.map((category) => {
            const categorySkills = filterByCategory(skills, category)
            if (categorySkills.length === 0) return null

            const gradients = CATEGORY_SECTION_GRADIENTS[category]
            const gradient = theme === 'dark' ? gradients.dark : gradients.light
            const underlineColor = CATEGORY_UNDERLINE_COLORS[category]
            const headerTextColor =
              theme === 'dark'
                ? CATEGORY_COLORS[category].dark.text
                : CATEGORY_COLORS[category].light.text

            return (
              <div
                key={category}
                className={`rounded-2xl bg-gradient-to-r p-5 ${gradient}`}
              >
                {/* Category header with animated underline */}
                <div className="mb-5 inline-block">
                  <h3
                    className={`text-xs font-bold uppercase tracking-widest ${headerTextColor}`}
                  >
                    {CATEGORY_LABELS[category]}
                  </h3>
                  {/* Animated underline — grows from left on section visibility */}
                  <div
                    className={`mt-1 h-0.5 w-full origin-left rounded-full ${underlineColor} transition-transform duration-500 ${
                      isVisible ? 'scale-x-100' : 'scale-x-0'
                    }`}
                    aria-hidden="true"
                  />
                </div>

                <ul
                  className="flex flex-wrap gap-3"
                  role="list"
                  aria-label={`${CATEGORY_LABELS[category]} skills`}
                >
                  {categorySkills.map((skill) => (
                    <li key={skill.name} className="list-none">
                      <SkillBadge
                        name={skill.name}
                        icon={skill.icon}
                        category={skill.category}
                        theme={theme}
                      />
                    </li>
                  ))}
                </ul>
              </div>
            )
          })}
        </div>

        {/* Problem-solving stats callout */}
        <div className="mt-16 flex justify-center">
          <div
            className="flex items-center gap-4 rounded-2xl border border-violet-300/50 bg-violet-50 px-8 py-5 dark:border-violet-500/20 dark:bg-violet-500/5"
            role="note"
            aria-label="Problem solving statistics"
          >
            <span aria-hidden="true" className="text-3xl">🧩</span>
            <p className="text-base font-semibold text-slate-700 dark:text-slate-200 sm:text-lg">
              {problemSolvingStats}
            </p>
          </div>
        </div>
      </div>
    </motion.section>
  )
}
