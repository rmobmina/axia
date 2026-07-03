import { cn } from '@/lib/utils'

interface SymmetryBarProps {
  /** 0–100: how balanced left/right sides are (100 = perfectly even). */
  value: number
  /** Threshold below which we visually flag the asymmetry. */
  target?: number
  className?: string
}

/**
 * Left/right symmetry meter. A centered marker on a soft track — reads as
 * "how close to even" rather than a race between sides.
 */
export function SymmetryBar({ value, target = 80, className }: SymmetryBarProps) {
  const clamped = Math.max(0, Math.min(100, value))
  const ok = clamped >= target
  return (
    <div className={cn('space-y-1.5', className)}>
      <div className="flex items-center justify-between text-xs font-semibold text-ink-400">
        <span>Left</span>
        <span className={cn('text-sm font-bold', ok ? 'text-good-700' : 'text-warn-700')}>
          {clamped}% even
        </span>
        <span>Right</span>
      </div>
      <div className="relative h-3 rounded-full bg-mist-100">
        {/* Target zone around center */}
        <div
          className="absolute inset-y-0 rounded-full bg-mist-200/80"
          style={{ left: `${50 - (100 - target) / 2}%`, width: `${100 - target}%` }}
        />
        {/* Center line */}
        <div className="absolute inset-y-0 left-1/2 w-0.5 -translate-x-1/2 rounded bg-mist-400" />
        {/* Marker: distance from center encodes asymmetry */}
        <div
          className={cn(
            'absolute top-1/2 size-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow-card',
            ok ? 'bg-good-600' : 'bg-warn-600',
          )}
          style={{ left: `${50 + (100 - clamped) / 2}%` }}
        />
      </div>
    </div>
  )
}
