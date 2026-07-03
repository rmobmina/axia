import { cn } from '@/lib/utils'

/**
 * Axia brand mark — a joint node with a motion arc, nodding to the
 * pose-tracking core of the product.
 */
export function LogoMark({ className }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        'inline-flex size-9 items-center justify-center rounded-xl bg-navy-700',
        className,
      )}
    >
      <svg viewBox="0 0 24 24" className="size-5.5" fill="none">
        <path
          d="M4 19 A 13 13 0 0 1 19 5"
          stroke="#8DA9C4"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeDasharray="1 4.4"
        />
        <path d="M6 19 L12 7 L18 19" stroke="white" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="12" cy="7" r="2.6" fill="#EEF4ED" />
      </svg>
    </span>
  )
}

export function Logo({ tone = 'light', className }: { tone?: 'light' | 'dark'; className?: string }) {
  return (
    <span className={cn('inline-flex items-center gap-2.5', className)}>
      <LogoMark />
      <span
        className={cn(
          'text-xl font-bold tracking-tight',
          tone === 'light' ? 'text-navy-950' : 'text-white',
        )}
      >
        Axia
      </span>
    </span>
  )
}
