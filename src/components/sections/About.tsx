import { useRef, useEffect, useState } from 'react'
import { motion, type Variants, type Transition } from 'framer-motion'
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver'
import { useScrollReveal } from '../../hooks/useScrollReveal'
import { useParallaxScroll } from '../../hooks/useParallaxScroll'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import { createSectionRevealTimeline, microInteractions, microTransitions, SHADOW_DEPTH } from '../../lib/animations'
import { BackgroundPattern } from '../background/BackgroundPattern'
import { SectionLabel } from '../ui/SectionLabel'
import { WordReveal } from '../ui/WordReveal'
import { MagneticButton } from '../ui/MagneticButton'
import { AnimatedPhotoFrame } from '../ui/AnimatedPhotoFrame'
import { portfolioData } from '../../data/portfolio'
import { useTheme } from '../../hooks/useTheme'

const PLACEHOLDER_SVG =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400' viewBox='0 0 400 400'%3E%3Crect width='400' height='400' fill='%231e1b4b'/%3E%3Ccircle cx='200' cy='160' r='70' fill='%234c1d95'/%3E%3Cellipse cx='200' cy='340' rx='120' ry='80' fill='%234c1d95'/%3E%3C/svg%3E"

// ─── Decorative shapes ────────────────────────────────────────────────────────

interface DecorativeShape {
  id: string
  className: string
  style: React.CSSProperties
  parallaxSpeed: number
}

const DECORATIVE_SHAPES: DecorativeShape[] = [
  {
    id: 'circle-top-right',
    className: 'absolute rounded-full bg-gradient-to-br from-violet-500 to-purple-600',
    style: {
      width: 256,
      height: 256,
      top: -64,
      right: -64,
      opacity: 0.07,
    },
    parallaxSpeed: 0.08,
  },
  {
    id: 'square-bottom-left',
    className: 'absolute bg-gradient-to-tr from-purple-600 to-violet-400',
    style: {
      width: 128,
      height: 128,
      bottom: 80,
      left: -32,
      opacity: 0.06,
      clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
    },
    parallaxSpeed: 0.12,
  },
  {
    id: 'circle-mid-left',
    className: 'absolute rounded-full bg-gradient-to-br from-violet-400 to-pink-500',
    style: {
      width: 64,
      height: 64,
      top: '40%',
      left: 24,
      opacity: 0.08,
    },
    parallaxSpeed: 0.06,
  },
  {
    id: 'square-top-center',
    className: 'absolute bg-gradient-to-br from-purple-500 to-violet-600',
    style: {
      width: 80,
      height: 80,
      top: 48,
      left: '45%',
      opacity: 0.05,
      clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
      transform: 'rotate(15deg)',
    },
    parallaxSpeed: 0.1,
  },
]

// Framer Motion variants for staggered entrance of decorative shapes
const decorativeContainerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
    },
  },
}

const decorativeItemVariants: Variants = {
  hidden: { opacity: 0, scale: 0.6 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.6, ease: [0.33, 1, 0.68, 1] },
  },
}

// ─── Component ────────────────────────────────────────────────────────────────

export function About() {
  const sectionRef = useRef<HTMLElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const isVisible = useIntersectionObserver(sectionRef, { threshold: 0.15 })
  const { ref: scrollRevealRef, isVisible: sectionRevealed } = useScrollReveal({ threshold: 0.1, once: true })
  const [imgSrc, setImgSrc] = useState(portfolioData.about.photoUrl)
  const { theme } = useTheme()
  const prefersReducedMotion = useReducedMotion()

  // Parallax offsets for each decorative shape (different speeds for depth)
  const parallax1 = useParallaxScroll(DECORATIVE_SHAPES[0].parallaxSpeed)
  const parallax2 = useParallaxScroll(DECORATIVE_SHAPES[1].parallaxSpeed)
  const parallax3 = useParallaxScroll(DECORATIVE_SHAPES[2].parallaxSpeed)
  const parallax4 = useParallaxScroll(DECORATIVE_SHAPES[3].parallaxSpeed)

  const parallaxOffsets = [parallax1, parallax2, parallax3, parallax4]

  useEffect(() => {
    if (isVisible && containerRef.current) {
      const tl = createSectionRevealTimeline(containerRef, 0.12)
      tl.play()
      return () => { tl.kill() }
    }
  }, [isVisible])

  const { about, resumeUrl } = portfolioData

  // Education card hover animation — respects reduced motion
  const eduCardHover = prefersReducedMotion
    ? {}
    : { y: -4, boxShadow: `0 8px 24px rgba(139, 92, 246, 0.2), ${SHADOW_DEPTH.xl}` }

  const eduCardTransition: Transition = { duration: 0.15, ease: 'easeOut' }

  // Combine sectionRef and scrollRevealRef
  const setRefs = (node: HTMLElement | null) => {
    (sectionRef as React.MutableRefObject<HTMLElement | null>).current = node
    ;(scrollRevealRef as React.MutableRefObject<Element | null>).current = node
  }

  return (
    <motion.section
      id="about"
      ref={setRefs}
      aria-label="About Anmol Sharma"
      className="relative overflow-hidden bg-white py-24 dark:bg-slate-900"
      initial={prefersReducedMotion ? false : { opacity: 0, y: 40 }}
      animate={sectionRevealed || prefersReducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      {/* Decorative floating shapes */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        variants={prefersReducedMotion ? {} : decorativeContainerVariants}
        initial="hidden"
        animate={isVisible ? 'visible' : 'hidden'}
      >
        {DECORATIVE_SHAPES.map((shape, index) => (
          <motion.div
            key={shape.id}
            aria-hidden="true"
            className={shape.className}
            variants={prefersReducedMotion ? {} : decorativeItemVariants}
            style={{
              ...shape.style,
              // Apply parallax offset (negate for upward movement on scroll)
              transform: prefersReducedMotion
                ? (shape.style.transform ?? undefined)
                : `translateY(${-parallaxOffsets[index]}px)${shape.style.transform ? ` ${shape.style.transform}` : ''}`,
              // Slightly higher opacity in dark mode for visibility
              opacity: theme === 'dark'
                ? (shape.style.opacity as number) * 1.4
                : shape.style.opacity,
            }}
          />
        ))}
      </motion.div>

      <BackgroundPattern theme={theme} pattern="grid" opacity={0.05} />
      <div ref={containerRef} className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">

        <div className="reveal-animate mb-2">
          <SectionLabel number="01" title="About" />
        </div>

        <div className="reveal-animate mb-16">
          <WordReveal
            text="Get to know me"
            className="text-4xl font-black tracking-tight text-slate-900 dark:text-white sm:text-5xl lg:text-6xl"
          />
        </div>

        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Photo — Task 12.4: use AnimatedPhotoFrame */}
          <div className="reveal-animate flex justify-center lg:justify-start">
            <AnimatedPhotoFrame
              src={imgSrc}
              alt="Anmol Sharma — professional photo"
              onError={() => setImgSrc(PLACEHOLDER_SVG)}
            />
          </div>

          {/* Content */}
          <div className="space-y-8">
            <div className="reveal-animate">
              <p className="text-base leading-relaxed text-slate-600 dark:text-slate-300 sm:text-lg">{about.bio}</p>
            </div>

            {/* Education cards — Task 12.2: motion.li with lift + glow */}
            <div className="reveal-animate">
              <h3 className="mb-4 text-xl font-bold tracking-tight text-slate-900 dark:text-white">Education</h3>
              <ul className="space-y-4" role="list">
                {about.education.map((edu, i) => (
                  <motion.li
                    key={i}
                    whileHover={eduCardHover}
                    transition={eduCardTransition}
                    className="flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4 transition-colors duration-150 hover:border-violet-300 dark:border-slate-700/50 dark:bg-slate-800/50 dark:hover:border-violet-500/30"
                  >
                    <span aria-hidden="true" className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-violet-100 text-violet-600 dark:bg-violet-500/20 dark:text-violet-400">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 10v6M2 10l10-5 10 5-10 5z" /><path d="M6 12v5c3 3 9 3 12 0v-5" />
                      </svg>
                    </span>
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-white">{edu.institution}</p>
                      <p className="text-sm text-slate-600 dark:text-slate-400">{edu.degree}</p>
                      <p className="text-sm text-slate-500">{edu.period}{edu.grade ? ` · ${edu.grade}` : ''}</p>
                    </div>
                  </motion.li>
                ))}
              </ul>
            </div>

            <div className="reveal-animate">
              <motion.div
                whileHover={prefersReducedMotion ? undefined : microInteractions.button.hover}
                whileTap={prefersReducedMotion ? undefined : microInteractions.button.tap}
                transition={microTransitions.fast}
                className="inline-block"
              >
                <MagneticButton
                  as="a"
                  href={resumeUrl}
                  download
                  strength={0.3}
                  className="inline-flex min-h-[44px] items-center gap-2 rounded-full bg-violet-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-500/25 transition-all duration-150 hover:bg-violet-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-slate-900"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" />
                  </svg>
                  Download Resume
                </MagneticButton>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  )
}
