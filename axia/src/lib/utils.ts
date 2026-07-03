import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const DATE_FMT = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' })
const DATE_FMT_FULL = new Intl.DateTimeFormat('en-US', {
  weekday: 'short',
  month: 'short',
  day: 'numeric',
})

/** "2026-07-03" -> "Jul 3" */
export function formatDate(iso: string) {
  return DATE_FMT.format(new Date(`${iso}T12:00:00`))
}

/** "2026-07-03" -> "Fri, Jul 3" */
export function formatDateFull(iso: string) {
  return DATE_FMT_FULL.format(new Date(`${iso}T12:00:00`))
}

/** 95 -> "1:35" */
export function formatSeconds(total: number) {
  const m = Math.floor(total / 60)
  const s = Math.round(total % 60)
  return `${m}:${String(s).padStart(2, '0')}`
}

export function initials(name: string) {
  return name
    .split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}
