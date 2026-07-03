import { cn, initials } from '@/lib/utils'

interface AvatarProps {
  name: string
  className?: string
  /** Visual tone — dark for use on navy surfaces. */
  tone?: 'light' | 'dark'
}

export function Avatar({ name, className, tone = 'light' }: AvatarProps) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        'inline-flex size-10 shrink-0 items-center justify-center rounded-full text-sm font-bold',
        tone === 'light' ? 'bg-mist-200 text-navy-800' : 'bg-white/15 text-mist-100',
        className,
      )}
    >
      {initials(name)}
    </span>
  )
}
