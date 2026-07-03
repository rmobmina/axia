import { NavLink, Outlet } from 'react-router-dom'
import { ClipboardList, Home, LineChart, ScanSearch, UserRound } from 'lucide-react'
import { Logo } from '@/components/Logo'
import { RoleSwitcher } from '@/components/RoleSwitcher'
import { Avatar } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'

const NAV = [
  { to: '/patient', label: 'Home', icon: Home, end: true },
  { to: '/patient/plan', label: 'My Plan', icon: ClipboardList },
  { to: '/patient/assessments', label: 'Assessments', icon: ScanSearch },
  { to: '/patient/progress', label: 'Progress', icon: LineChart },
  { to: '/patient/profile', label: 'Profile', icon: UserRound },
]

/**
 * Patient shell: calm paper background, top bar + desktop inline nav,
 * large-target bottom tab bar on mobile.
 */
export function PatientLayout() {
  return (
    <div className="min-h-svh bg-paper pb-24 md:pb-10">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:rounded-lg focus:bg-navy-700 focus:px-4 focus:py-2 focus:text-white"
      >
        Skip to content
      </a>

      <header className="sticky top-0 z-40 border-b border-mist-200/70 bg-white/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
          <Logo />

          <nav aria-label="Primary" className="hidden md:block">
            <ul className="flex items-center gap-1">
              {NAV.map(({ to, label, icon: Icon, end }) => (
                <li key={to}>
                  <NavLink
                    to={to}
                    end={end}
                    className={({ isActive }) =>
                      cn(
                        'inline-flex h-11 items-center gap-2 rounded-xl px-4 text-sm font-semibold transition-colors',
                        isActive
                          ? 'bg-navy-700 text-white'
                          : 'text-ink-600 hover:bg-mist-100 hover:text-navy-800',
                      )
                    }
                  >
                    <Icon className="size-4.5" aria-hidden="true" />
                    {label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-3">
            <RoleSwitcher />
            <Avatar name="Maya Torres" />
          </div>
        </div>
      </header>

      <main id="main" className="mx-auto max-w-6xl px-4 pt-6 sm:px-6">
        <Outlet />
      </main>

      {/* Mobile bottom tab bar — large touch targets */}
      <nav
        aria-label="Primary"
        className="fixed inset-x-0 bottom-0 z-40 border-t border-mist-200 bg-white/95 backdrop-blur md:hidden"
      >
        <ul className="mx-auto flex max-w-md items-stretch justify-between px-2 pt-1 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
          {NAV.map(({ to, label, icon: Icon, end }) => (
            <li key={to} className="flex-1">
              <NavLink
                to={to}
                end={end}
                className={({ isActive }) =>
                  cn(
                    'flex min-h-14 flex-col items-center justify-center gap-0.5 rounded-xl text-[11px] font-semibold',
                    isActive ? 'text-navy-700' : 'text-ink-400',
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    <span
                      className={cn(
                        'inline-flex h-7 items-center justify-center rounded-full px-4',
                        isActive && 'bg-mist-100',
                      )}
                    >
                      <Icon className="size-5" aria-hidden="true" />
                    </span>
                    {label}
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  )
}
