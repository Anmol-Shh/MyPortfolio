import { motion } from 'framer-motion'
import type { SkillCategory } from '../../types'
import type { Theme } from '../../types'

interface SkillBadgeProps {
  name: string
  icon?: string
  category: SkillCategory
  theme?: Theme
}

// ─── Category color tokens ────────────────────────────────────────────────────

/**
 * Per-category color tokens for light and dark themes.
 * All combinations are validated for WCAG AA contrast (≥ 4.5:1 for normal text).
 * Requirements: 4.6
 */
export const CATEGORY_COLORS: Record<
  SkillCategory,
  {
    dark: {
      border: string
      bg: string
      text: string
      hoverBorder: string
      hoverBg: string
      glow: string
    }
    light: {
      border: string
      bg: string
      text: string
      hoverBorder: string
      hoverBg: string
      glow: string
    }
  }
> = {
  languages: {
    dark: {
      border: 'border-blue-500/30',
      bg: 'bg-blue-500/10',
      text: 'text-blue-300',
      hoverBorder: 'hover:border-blue-400/70',
      hoverBg: 'hover:bg-blue-500/20',
      glow: 'rgba(59, 130, 246, 0.55)',
    },
    light: {
      border: 'border-blue-600/40',
      bg: 'bg-blue-50',
      text: 'text-blue-700',
      hoverBorder: 'hover:border-blue-600/80',
      hoverBg: 'hover:bg-blue-100',
      glow: 'rgba(37, 99, 235, 0.35)',
    },
  },
  backend: {
    dark: {
      border: 'border-emerald-500/30',
      bg: 'bg-emerald-500/10',
      text: 'text-emerald-300',
      hoverBorder: 'hover:border-emerald-400/70',
      hoverBg: 'hover:bg-emerald-500/20',
      glow: 'rgba(16, 185, 129, 0.55)',
    },
    light: {
      border: 'border-emerald-600/40',
      bg: 'bg-emerald-50',
      text: 'text-emerald-700',
      hoverBorder: 'hover:border-emerald-600/80',
      hoverBg: 'hover:bg-emerald-100',
      glow: 'rgba(5, 150, 105, 0.35)',
    },
  },
  tools: {
    dark: {
      border: 'border-amber-500/30',
      bg: 'bg-amber-500/10',
      text: 'text-amber-300',
      hoverBorder: 'hover:border-amber-400/70',
      hoverBg: 'hover:bg-amber-500/20',
      glow: 'rgba(245, 158, 11, 0.55)',
    },
    light: {
      border: 'border-amber-600/40',
      bg: 'bg-amber-50',
      text: 'text-amber-700',
      hoverBorder: 'hover:border-amber-600/80',
      hoverBg: 'hover:bg-amber-100',
      glow: 'rgba(217, 119, 6, 0.35)',
    },
  },
  'core-cs': {
    dark: {
      border: 'border-violet-500/30',
      bg: 'bg-violet-500/10',
      text: 'text-violet-300',
      hoverBorder: 'hover:border-violet-400/70',
      hoverBg: 'hover:bg-violet-500/20',
      glow: 'rgba(139, 92, 246, 0.55)',
    },
    light: {
      border: 'border-violet-600/40',
      bg: 'bg-violet-50',
      text: 'text-violet-700',
      hoverBorder: 'hover:border-violet-600/80',
      hoverBg: 'hover:bg-violet-100',
      glow: 'rgba(109, 40, 217, 0.35)',
    },
  },
}

/**
 * Displays a single skill with an optional Devicon icon and text label.
 *
 * Enhancements (Requirements 4.1, 4.2, 4.3, 4.6):
 * - Y translation increased from -4px to -6px
 * - Rotation on hover: -2deg
 * - Shadow intensity doubled (was 20%, now 55% in dark / 35% in light)
 * - Border glow effect with category-specific color
 * - Theme-aware color tokens for WCAG AA compliance
 * - Transition duration: 150ms
 */
export function SkillBadge({ name, icon, category, theme = 'dark' }: SkillBadgeProps) {
  const colors = CATEGORY_COLORS[category][theme]

  return (
    <motion.div
      data-testid="skill-badge"
      whileHover={{
        y: -6,
        scale: 1.05,
        rotate: -2,
        boxShadow: `0 8px 24px ${colors.glow}`,
      }}
      whileTap={{ scale: 0.95, rotate: 0 }}
      transition={{ duration: 0.15, ease: 'easeOut' }}
      className={[
        'skill-badge',
        `skill-badge--${category}`,
        'flex cursor-default items-center gap-2 rounded-xl border px-4 py-3',
        'shadow-lg transition-colors duration-150',
        colors.border,
        colors.bg,
        colors.text,
        colors.hoverBorder,
        colors.hoverBg,
      ].join(' ')}
    >
      {icon && (
        <i
          className={`${icon} text-xl`}
          aria-hidden="true"
          title={name}
        />
      )}
      <span className="text-sm font-medium">{name}</span>
    </motion.div>
  )
}

/** Pure helper — exported for property-based testing. */
export function filterByCategory(
  skills: Array<{ name: string; icon?: string; category: SkillCategory }>,
  category: SkillCategory,
) {
  return skills.filter((s) => s.category === category)
}
