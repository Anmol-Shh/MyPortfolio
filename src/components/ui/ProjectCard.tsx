import { useState } from 'react'
import { motion } from 'framer-motion'
import type { Project, TechTag } from '../../types'
import { microInteractions, microTransitions } from '../../lib/animations'
import { useReducedMotion } from '../../hooks/useReducedMotion'

interface ProjectCardProps {
  project: Project
  featured?: boolean
}

const tagCategoryColors: Record<TechTag['category'], string> = {
  language: 'border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-500/30 dark:bg-blue-500/10 dark:text-blue-300',
  framework: 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-300',
  tool: 'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-300',
  cloud: 'border-violet-200 bg-violet-50 text-violet-700 dark:border-violet-500/30 dark:bg-violet-500/10 dark:text-violet-300',
}

export function ProjectCard({ project, featured = false }: ProjectCardProps) {
  const [tilt, setTilt] = useState({ x: 0, y: 0 })
  const [isHovered, setIsHovered] = useState(false)
  const prefersReducedMotion = useReducedMotion()

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientY - rect.top) / rect.height - 0.5) * 15
    const y = -((e.clientX - rect.left) / rect.width - 0.5) * 15
    setTilt({ x, y })
  }

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 })
    setIsHovered(false)
  }

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      animate={{ 
        rotateX: tilt.x, 
        rotateY: tilt.y,
        scale: isHovered ? 1.02 : 1
      }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      style={{ perspective: 1000, transformStyle: 'preserve-3d' }}
      className={`group relative overflow-hidden rounded-2xl border border-slate-200 bg-white transition-shadow duration-200 dark:border-slate-700/50 dark:bg-slate-800/60 ${
        isHovered ? 'shadow-2xl' : 'shadow-lg'
      } ${
        featured ? 'col-span-full' : ''
      }`}
      data-project-id={project.id}
      data-project-name={project.name}
    >
      {/* Hover overlay */}
      <motion.div
        aria-hidden="true"
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.2 }}
        className="pointer-events-none absolute inset-0 bg-gradient-to-br from-violet-50/80 to-purple-50/40 dark:from-violet-600/10 dark:to-purple-600/5"
      />

      {/* Glow border on hover */}
      <motion.div
        aria-hidden="true"
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.2 }}
        className="pointer-events-none absolute -inset-px rounded-2xl border border-violet-300 dark:border-violet-500/40"
      />

      <div className={`p-6 ${featured ? 'sm:p-8' : ''}`}>
        {/* Header */}
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            {featured && (
              <span className="mb-2 inline-block rounded-full bg-violet-100 px-3 py-0.5 text-xs font-semibold text-violet-700 dark:bg-violet-500/20 dark:text-violet-300">
                Featured Project
              </span>
            )}
            <h3 className={`font-bold tracking-tight text-slate-900 dark:text-white ${featured ? 'text-2xl sm:text-3xl' : 'text-xl'}`}>
              {project.name}
            </h3>
          </div>

          {/* Links */}
          <div className="flex shrink-0 items-center gap-2">
            <motion.a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`View ${project.name} on GitHub (opens in new tab)`}
              whileHover={prefersReducedMotion ? undefined : microInteractions.icon.hover}
              whileTap={prefersReducedMotion ? undefined : microInteractions.icon.tap}
              transition={microTransitions.fast}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition-colors duration-150 hover:border-violet-400 hover:text-violet-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 dark:border-slate-600 dark:text-slate-400 dark:hover:border-violet-500 dark:hover:text-violet-400"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
              </svg>
            </motion.a>

            {project.liveUrl && (
              <motion.a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`View ${project.name} live demo (opens in new tab)`}
                whileHover={prefersReducedMotion ? undefined : microInteractions.icon.hover}
                whileTap={prefersReducedMotion ? undefined : microInteractions.icon.tap}
                transition={microTransitions.fast}
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition-colors duration-150 hover:border-violet-400 hover:text-violet-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 dark:border-slate-600 dark:text-slate-400 dark:hover:border-violet-500 dark:hover:text-violet-400"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                  <polyline points="15 3 21 3 21 9" />
                  <line x1="10" y1="14" x2="21" y2="3" />
                </svg>
              </motion.a>
            )}
          </div>
        </div>

        {/* Description */}
        <p className="mb-5 text-sm leading-relaxed text-slate-600 dark:text-slate-400 sm:text-base">
          {project.description}
        </p>

        {/* Tech stack tags */}
        <ul
          className="flex flex-wrap gap-2"
          role="list"
          aria-label={`Technologies used in ${project.name}`}
        >
          {project.techStack.map((tag) => (
            <li
              key={tag.name}
              className={`rounded-lg border px-3 py-1 text-xs font-medium ${tagCategoryColors[tag.category]}`}
            >
              {tag.name}
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  )
}
