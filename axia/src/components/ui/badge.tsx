import type { HTMLAttributes } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold whitespace-nowrap [&_svg]:size-3.5',
  {
    variants: {
      variant: {
        default: 'bg-mist-100 text-navy-800',
        navy: 'bg-navy-700 text-white',
        accent: 'bg-mist-400/25 text-navy-700',
        outline: 'border border-mist-300 bg-white text-ink-600',
        good: 'bg-good-100 text-good-700',
        warn: 'bg-warn-100 text-warn-700',
        alert: 'bg-alert-100 text-alert-700',
        onDark: 'bg-white/12 text-mist-200',
      },
    },
    defaultVariants: { variant: 'default' },
  },
)

export interface BadgeProps
  extends HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />
}
