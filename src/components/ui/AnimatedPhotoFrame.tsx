import { motion } from 'framer-motion'
import { useReducedMotion } from '../../hooks/useReducedMotion'

interface AnimatedPhotoFrameProps {
  src: string
  alt: string
  onError?: () => void
}

/**
 * AnimatedPhotoFrame component with 3D hover effect and pulsing gradient border.
 *
 * Features:
 * - 3D rotation on hover: rotateY 5deg, rotateZ 2deg
 * - Scale 1.03 on hover
 * - Animated gradient border that pulses opacity 0.4 → 0.8 → 0.4 over 3000ms
 * - Shadow depth increase on hover
 * - Floating badge with role/company info
 * - Respects prefers-reduced-motion
 *
 * Requirements: 5.1, 5.2, 5.3
 */
export function AnimatedPhotoFrame({ src, alt, onError }: AnimatedPhotoFrameProps) {
  const prefersReducedMotion = useReducedMotion()

  const hoverAnimation = prefersReducedMotion
    ? {}
    : { scale: 1.03, rotateY: 5, rotateZ: 2 }

  const hoverTransition = prefersReducedMotion
    ? { duration: 0 }
    : { duration: 0.2, ease: 'easeOut' }

  return (
    <motion.div
      whileHover={hoverAnimation}
      transition={hoverTransition}
      className="group relative"
      style={{ perspective: 1000 }}
    >
      {/* Pulsing gradient border — always visible, pulses continuously */}
      <div
        aria-hidden="true"
        className={`animated-photo-border absolute -inset-[3px] rounded-2xl bg-gradient-to-br from-violet-500 via-purple-500 to-pink-500 ${prefersReducedMotion ? 'opacity-60' : ''}`}
      />

      {/* Hover glow layer */}
      <div
        aria-hidden="true"
        className="absolute -inset-1 rounded-2xl bg-gradient-to-br from-violet-600 to-purple-600 opacity-0 blur-md transition-opacity duration-200 group-hover:opacity-50"
      />

      {/* Photo */}
      <img
        src={src}
        alt={alt}
        onError={onError}
        width={400}
        height={400}
        loading="lazy"
        className="relative h-72 w-72 rounded-2xl object-cover shadow-2xl transition-shadow duration-200 group-hover:shadow-[0_20px_40px_rgba(139,92,246,0.35)] sm:h-80 sm:w-80"
      />

      {/* Floating badge */}
      <div className="absolute -bottom-4 -right-4 rounded-xl border border-slate-200 bg-white px-4 py-2 shadow-xl dark:border-slate-700 dark:bg-slate-800">
        <p className="text-xs font-bold text-violet-600 dark:text-violet-400">Software Engineer</p>
        <p className="text-xs text-slate-500 dark:text-slate-400">ASPIA Infotech · 2025</p>
      </div>
    </motion.div>
  )
}
