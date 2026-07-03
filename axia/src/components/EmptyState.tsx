import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface EmptyStateProps {
  icon: ReactNode
  title: string
  description: string
  action?: ReactNode
  className?: string
}

export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-mist-200 bg-mist-50/60 px-6 py-12 text-center',
        className,
      )}
    >
      <span className="mb-3 inline-flex size-12 items-center justify-center rounded-2xl bg-mist-100 text-mist-600 [&_svg]:size-6">
        {icon}
      </span>
      <h3 className="text-base font-bold text-ink-900">{title}</h3>
      <p className="mt-1 max-w-sm text-sm text-ink-400">{description}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  )
}
