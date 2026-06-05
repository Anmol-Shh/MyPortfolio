interface SectionLabelProps {
  number: string  // e.g. "01"
  title: string   // e.g. "ABOUT"
}

/**
 * Decorative section number + title label shown in the top-left corner of sections.
 * Inspired by the numbered section style seen in premium portfolios.
 */
export function SectionLabel({ number, title }: SectionLabelProps) {
  return (
    <div
      aria-hidden="true"
      className="mb-4 flex items-center gap-3"
    >
      <span className="font-mono text-xs font-bold text-violet-500">{number}</span>
      <span className="h-px flex-1 max-w-[40px] bg-violet-500/40" />
      <span className="text-xs font-bold uppercase tracking-[0.3em] text-slate-600">{title}</span>
    </div>
  )
}
