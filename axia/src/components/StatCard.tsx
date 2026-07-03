import type { ReactNode } from 'react'
import { ArrowDownRight, ArrowUpRight, Minus } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface StatCardProps {
  label: string
  value: string | number
  unit?: string
  /** Signed change; direction of "good" controlled by `betterWhen`. */
  delta?: number
  deltaLabel?: string
  betterWhen?: 'higher' | 'lower'
  icon?: ReactNode
  className?: string
}

/**
 * Stat tile — a headline number with an optional trend chip.
 * Follows dataviz guidance: value in ink (never series color), status color
 * reserved for the delta chip, always paired with a directional icon.
 */
export function StatCard({
  label,
  value,
  unit,
  delta,
  deltaLabel,
  betterWhen = 'higher',
  icon,
  className,
}: StatCardProps) {
  const hasDelta = delta !== undefined && delta !== 0
  const improved = delta !== undefined && (betterWhen === 'higher' ? delta > 0 : delta < 0)

  return (
    <Card className={cn('p-5', className)}>
      <div className="flex items-start justify-between gap-2">
        <p className="text-sm font-semibold text-ink-400">{label}</p>
        {icon && <span className="text-mist-500 [&_svg]:size-5">{icon}</span>}
      </div>
      <p className="mt-2 text-3xl font-bold tracking-tight text-ink-900">
        {value}
        {unit && <span className="ml-1 text-base font-semibold text-ink-400">{unit}</span>}
      </p>
      {delta !== undefined && (
        <p
          className={cn(
            'mt-2 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-bold',
            !hasDelta && 'bg-mist-100 text-ink-600',
            hasDelta && improved && 'bg-good-100 text-good-700',
            hasDelta && !improved && 'bg-alert-100 text-alert-700',
          )}
        >
          {!hasDelta ? (
            <Minus className="size-3.5" aria-hidden="true" />
          ) : delta > 0 ? (
            <ArrowUpRight className="size-3.5" aria-hidden="true" />
          ) : (
            <ArrowDownRight className="size-3.5" aria-hidden="true" />
          )}
          {hasDelta ? `${delta > 0 ? '+' : ''}${delta}` : 'No change'}
          {deltaLabel && <span className="font-semibold text-current/80">{deltaLabel}</span>}
        </p>
      )}
    </Card>
  )
}
