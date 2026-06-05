interface MarqueeTickerProps {
  items?: string[]
  speed?: number // px per second
  direction?: 'left' | 'right'
  className?: string
}

const DEFAULT_ITEMS = [
  'AVAILABLE FOR WORK',
  'SOFTWARE ENGINEER',
  'BACKEND DEVELOPER',
  'PROBLEM SOLVER',
  'JAVA · PYTHON · LARAVEL',
  '150+ DSA PROBLEMS',
  'OPEN TO OPPORTUNITIES',
]

/**
 * Infinite horizontal scrolling ticker strip.
 * Pure CSS animation — no JS scroll needed.
 */
export function MarqueeTicker({
  items = DEFAULT_ITEMS,
  direction = 'left',
  className = '',
}: MarqueeTickerProps) {
  // Duplicate items for seamless loop
  const allItems = [...items, ...items, ...items]

  return (
    <div
      className={`relative overflow-hidden border-y border-slate-200 bg-slate-100/80 py-3 dark:border-slate-800 dark:bg-slate-900/50 ${className}`}
      aria-hidden="true"
    >
      <div
        className={`flex whitespace-nowrap ${
          direction === 'left' ? 'animate-marquee-left' : 'animate-marquee-right'
        }`}
      >
        {allItems.map((item, i) => (
          <span
            key={i}
            className="mx-6 inline-flex items-center gap-3 text-xs font-bold uppercase tracking-[0.25em] text-slate-400 dark:text-slate-500"
          >
            <span className="text-violet-500 dark:text-violet-500">✦</span>
            {item}
          </span>
        ))}
      </div>
    </div>
  )
}
