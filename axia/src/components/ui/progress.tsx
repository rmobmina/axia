import { cn } from '@/lib/utils'

interface ProgressProps {
  /** 0–100 */
  value: number
  className?: string
  barClassName?: string
  'aria-label'?: string
}

export function Progress({ value, className, barClassName, ...aria }: ProgressProps) {
  const clamped = Math.max(0, Math.min(100, value))
  return (
    <div
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(clamped)}
      aria-label={aria['aria-label']}
      className={cn('h-2.5 w-full overflow-hidden rounded-full bg-mist-100', className)}
    >
      <div
        className={cn('h-full rounded-full bg-navy-700 transition-[width] duration-500', barClassName)}
        style={{ width: `${clamped}%` }}
      />
    </div>
  )
}
