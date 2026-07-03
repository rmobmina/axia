import { useNavigate } from 'react-router-dom'
import { Repeat } from 'lucide-react'
import { useRole } from '@/context/RoleContext'
import { cn } from '@/lib/utils'

/**
 * Demo-only role switcher. TODO(backend): remove once real auth exists —
 * roles will come from the session.
 */
export function RoleSwitcher({ tone = 'light' }: { tone?: 'light' | 'dark' }) {
  const { role, setRole } = useRole()
  const navigate = useNavigate()

  const switchTo = role === 'patient' ? 'clinician' : 'patient'

  return (
    <button
      type="button"
      onClick={() => {
        setRole(switchTo)
        navigate(switchTo === 'patient' ? '/patient' : '/clinician')
      }}
      className={cn(
        'inline-flex h-9 cursor-pointer items-center gap-1.5 rounded-full px-3 text-xs font-bold transition-colors',
        tone === 'light'
          ? 'bg-mist-100 text-navy-800 hover:bg-mist-200'
          : 'bg-white/10 text-mist-200 hover:bg-white/20',
      )}
      title="Demo: switch between the patient and clinician experience"
    >
      <Repeat className="size-3.5" aria-hidden="true" />
      <span className="hidden sm:inline">View as</span> {switchTo}
    </button>
  )
}
