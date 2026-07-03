import { cn } from '@/lib/utils'

/** Loading placeholder block. */
export function Skeleton({ className }: { className?: string }) {
  return <div aria-hidden="true" className={cn('animate-pulse rounded-xl bg-mist-100', className)} />
}

export function CardSkeleton({ lines = 3 }: { lines?: number }) {
  return (
    <div className="rounded-2xl border border-mist-200/70 bg-white p-5 shadow-card">
      <Skeleton className="mb-4 h-5 w-1/3" />
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton key={i} className="mb-2.5 h-4" />
      ))}
    </div>
  )
}
