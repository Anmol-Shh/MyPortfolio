import { useEffect, useRef } from 'react'
import gsap from 'gsap'

interface PreloaderProps {
  onComplete: () => void
}

const MAX_DISPLAY_MS = 5000
const RADIUS = 120
const CIRCUMFERENCE = 2 * Math.PI * RADIUS
const OUTER_RADIUS = 148
const SIZE = (OUTER_RADIUS + 24) * 2

/**
 * Enhanced circular ring preloader:
 * - Outer dashed ring slowly counter-rotates (CSS animation)
 * - Main ring strokes 0→100% with violet-to-pink gradient + glow
 * - Orbiting dot travels the ring edge in sync with progress
 * - "AS" initials bounce in at center
 * - Percentage counter below
 * - At 100%: particle burst from ring edge, then scale-fade exit
 */
export function Preloader({ onComplete }: PreloaderProps) {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<SVGCircleElement>(null)
  const glowRingRef = useRef<SVGCircleElement>(null)
  const orbitDotRef = useRef<SVGCircleElement>(null)
  const orbitGlowRef = useRef<SVGCircleElement>(null)
  const initialsRef = useRef<HTMLDivElement>(null)
  const counterRef = useRef<HTMLSpanElement>(null)
  const particlesRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    document.body.style.overflow = 'hidden'

    if (ringRef.current) {
      ringRef.current.style.strokeDasharray = `${CIRCUMFERENCE}`
      ringRef.current.style.strokeDashoffset = `${CIRCUMFERENCE}`
    }
    if (glowRingRef.current) {
      glowRingRef.current.style.strokeDasharray = `${CIRCUMFERENCE}`
      glowRingRef.current.style.strokeDashoffset = `${CIRCUMFERENCE}`
    }

    const cx = SIZE / 2
    const cy = SIZE / 2

    const ctx = gsap.context(() => {
      const tl = gsap.timeline()

      // ── Phase 1: Ring + orbiting dot + counter (0→100 over 2.2s) ─────────
      const counterObj = { val: 0 }

      tl.to(counterObj, {
        val: 100,
        duration: 2.2,
        ease: 'power1.inOut',
        onUpdate: () => {
          const v = Math.floor(counterObj.val)
          const progress = v / 100
          const offset = CIRCUMFERENCE * (1 - progress)

          // Ring stroke
          if (ringRef.current) ringRef.current.style.strokeDashoffset = `${offset}`
          if (glowRingRef.current) glowRingRef.current.style.strokeDashoffset = `${offset}`

          // Counter
          if (counterRef.current) counterRef.current.textContent = `${v}`

          // Orbiting dot — travels the ring edge
          // Ring starts at 3 o'clock (right side) because SVG is rotated -90°
          // So dot starts at angle 0 (right) and travels clockwise
          const angle = progress * 2 * Math.PI  // 0 = right, goes clockwise
          const dotX = cx + RADIUS * Math.cos(angle)
          const dotY = cy + RADIUS * Math.sin(angle)
          if (orbitDotRef.current) {
            orbitDotRef.current.setAttribute('cx', `${dotX}`)
            orbitDotRef.current.setAttribute('cy', `${dotY}`)
          }
          if (orbitGlowRef.current) {
            orbitGlowRef.current.setAttribute('cx', `${dotX}`)
            orbitGlowRef.current.setAttribute('cy', `${dotY}`)
          }
        },
      })

      // ── Phase 2: Initials bounce in at 0.3s ──────────────────────────────
      tl.fromTo(
        initialsRef.current,
        { opacity: 0, scale: 0.5 },
        { opacity: 1, scale: 1, duration: 0.6, ease: 'back.out(2)' },
        0.3,
      )

      // ── Phase 3: Hold at 100% ─────────────────────────────────────────────
      tl.to({}, { duration: 0.25 })

      // ── Phase 4: Particle burst from ring edge ────────────────────────────
      tl.add(() => {
        const container = particlesRef.current
        if (!container) return
        const colors = ['#8b5cf6', '#a78bfa', '#ec4899', '#f472b6', '#c084fc', '#ffffff', '#7c3aed']
        const containerRect = container.getBoundingClientRect()
        const originX = containerRect.width / 2
        const originY = containerRect.height / 2

        for (let i = 0; i < 32; i++) {
          const dot = document.createElement('div')
          const size = Math.random() * 5 + 2
          const angle = (i / 32) * Math.PI * 2
          // Start at ring edge
          const startX = originX + RADIUS * Math.cos(angle)
          const startY = originY + RADIUS * Math.sin(angle)
          const dist = 60 + Math.random() * 80

          dot.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            border-radius: 50%;
            background: ${colors[Math.floor(Math.random() * colors.length)]};
            left: ${startX}px;
            top: ${startY}px;
            transform: translate(-50%, -50%);
            pointer-events: none;
          `
          container.appendChild(dot)

          gsap.fromTo(
            dot,
            { opacity: 1, scale: 1 },
            {
              x: Math.cos(angle) * dist,
              y: Math.sin(angle) * dist,
              opacity: 0,
              scale: 0,
              duration: 0.6 + Math.random() * 0.3,
              ease: 'power2.out',
              onComplete: () => dot.remove(),
            },
          )
        }
      })

      // Ring pulse on completion
      tl.to(
        [ringRef.current, glowRingRef.current],
        { attr: { 'stroke-width': 6 }, duration: 0.12, yoyo: true, repeat: 1, ease: 'power2.out' },
        '<',
      )

      // ── Phase 5: Scale-fade exit ──────────────────────────────────────────
      tl.to(
        wrapperRef.current,
        { opacity: 0, scale: 1.1, duration: 0.55, ease: 'power2.in' },
        '+=0.3',
      )

      tl.add(() => {
        document.body.style.overflow = ''
        onComplete()
      })
    })

    const maxTimer = setTimeout(() => {
      document.body.style.overflow = ''
      onComplete()
    }, MAX_DISPLAY_MS)

    return () => {
      clearTimeout(maxTimer)
      document.body.style.overflow = ''
      ctx.revert()
    }
  }, [onComplete])

  return (
    <div
      ref={wrapperRef}
      role="status"
      aria-label="Loading portfolio"
      aria-live="polite"
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden"
      style={{ background: '#020617' }}
    >
      {/* ── Mesh gradient ─────────────────────────────────────────────────── */}
      <div
        aria-hidden="true"
        className="absolute inset-0 animate-mesh-shift pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse 70% 70% at 50% 50%, rgba(109,40,217,0.22) 0%, transparent 65%),
            radial-gradient(ellipse 50% 40% at 20% 30%, rgba(139,92,246,0.12) 0%, transparent 55%),
            radial-gradient(ellipse 40% 50% at 80% 70%, rgba(236,72,153,0.09) 0%, transparent 55%)
          `,
        }}
      />

      {/* ── Ring SVG ──────────────────────────────────────────────────────── */}
      <div className="relative flex items-center justify-center">
        {/* Particle burst container — same size as SVG, centered */}
        <div
          ref={particlesRef}
          aria-hidden="true"
          className="absolute pointer-events-none"
          style={{ width: SIZE, height: SIZE, left: 0, top: 0 }}
        />

        <svg
          width={SIZE}
          height={SIZE}
          viewBox={`0 0 ${SIZE} ${SIZE}`}
          fill="none"
          aria-hidden="true"
          style={{ transform: 'rotate(-90deg)' }}
        >
          <defs>
            <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#7c3aed" />
              <stop offset="45%" stopColor="#a78bfa" />
              <stop offset="100%" stopColor="#ec4899" />
            </linearGradient>
            <linearGradient id="dotGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f0abfc" />
              <stop offset="100%" stopColor="#ffffff" />
            </linearGradient>
            <filter id="ringGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="5" result="blur" />
              <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
            <filter id="dotGlow" x="-100%" y="-100%" width="300%" height="300%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
          </defs>

          {/* Outer dashed ring — counter-rotates via CSS */}
          <circle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={OUTER_RADIUS}
            stroke="rgba(139,92,246,0.15)"
            strokeWidth="1"
            strokeDasharray="4 10"
            style={{
              transformOrigin: `${SIZE / 2}px ${SIZE / 2}px`,
              animation: 'spin-reverse 12s linear infinite',
            }}
          />

          {/* Track ring */}
          <circle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={RADIUS}
            stroke="rgba(255,255,255,0.05)"
            strokeWidth="3"
          />

          {/* Glow ring */}
          <circle
            ref={glowRingRef}
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={RADIUS}
            stroke="url(#ringGrad)"
            strokeWidth="4"
            strokeLinecap="round"
            filter="url(#ringGlow)"
            style={{ strokeDasharray: CIRCUMFERENCE, strokeDashoffset: CIRCUMFERENCE }}
          />

          {/* Main ring */}
          <circle
            ref={ringRef}
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={RADIUS}
            stroke="url(#ringGrad)"
            strokeWidth="3"
            strokeLinecap="round"
            style={{ strokeDasharray: CIRCUMFERENCE, strokeDashoffset: CIRCUMFERENCE }}
          />

          {/* Orbiting dot glow */}
          <circle
            ref={orbitGlowRef}
            cx={SIZE / 2}
            cy={SIZE / 2 - RADIUS}
            r={8}
            fill="rgba(192,132,252,0.4)"
            filter="url(#dotGlow)"
          />

          {/* Orbiting dot */}
          <circle
            ref={orbitDotRef}
            cx={SIZE / 2}
            cy={SIZE / 2 - RADIUS}
            r={5}
            fill="url(#dotGrad)"
          />
        </svg>

        {/* Initials — centered, not rotated */}
        <div
          ref={initialsRef}
          className="absolute inset-0 flex items-center justify-center select-none pointer-events-none"
          style={{ opacity: 0 }}
          aria-hidden="true"
        >
          <span
            className="font-black leading-none"
            style={{ fontSize: 'clamp(3rem, 8vw, 5rem)', letterSpacing: '-0.02em' }}
          >
            <span className="text-white">A</span>
            <span
              className="bg-clip-text text-transparent"
              style={{ backgroundImage: 'linear-gradient(135deg, #a78bfa, #ec4899)' }}
            >S</span>
          </span>
        </div>
      </div>

      {/* ── Counter ───────────────────────────────────────────────────────── */}
      <div
        className="mt-8 flex items-baseline gap-1 select-none pointer-events-none"
        aria-hidden="true"
      >
        <span
          ref={counterRef}
          className="font-mono font-black text-white tabular-nums"
          style={{ fontSize: 'clamp(1.5rem, 4vw, 2.5rem)' }}
        >
          0
        </span>
        <span className="font-mono text-sm font-bold text-slate-500">%</span>
      </div>

      <span className="sr-only">Loading portfolio, please wait</span>
    </div>
  )
}
