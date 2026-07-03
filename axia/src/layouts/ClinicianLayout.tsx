import { NavLink, Outlet } from 'react-router-dom'
import { ClipboardCheck, LayoutDashboard, Settings, Users, FolderKanban } from 'lucide-react'
import { Logo } from '@/components/Logo'
import { RoleSwitcher } from '@/components/RoleSwitcher'
import { Avatar } from '@/components/ui/avatar'
import { CLINICIAN } from '@/mocks/patients'
import { cn } from '@/lib/utils'

const NAV = [
  { to: '/clinician', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/clinician/patients', label: 'Patients', icon: Users },
  { to: '/clinician/plans', label: 'Plans', icon: FolderKanban },
  { to: '/clinician/reviews', label: 'Reviews', icon: ClipboardCheck },
  { to: '/clinician/settings', label: 'Settings', icon: Settings },
]

/**
 * Clinician shell: deep-navy sidebar on desktop (analytical, organized),
 * compact top bar with horizontal nav on mobile.
 */
export function ClinicianLayout() {
  return (
    <div className="min-h-svh bg-mist-50 lg:pl-64">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:rounded-lg focus:bg-navy-700 focus:px-4 focus:py-2 focus:text-white"
      >
        Skip to content
      </a>

      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col bg-navy-950 lg:flex">
        <div className="flex h-16 items-center px-5">
          <Logo tone="dark" />
        </div>
        <nav aria-label="Primary" className="flex-1 px-3 py-4">
          <ul className="space-y-1">
            {NAV.map(({ to, label, icon: Icon, end }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  end={end}
                  className={({ isActive }) =>
                    cn(
                      'flex h-11 items-center gap-3 rounded-xl px-3.5 text-sm font-semibold transition-colors',
                      isActive
                        ? 'bg-navy-700 text-white'
                        : 'text-mist-300 hover:bg-white/8 hover:text-white',
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
        <div className="border-t border-white/10 p-4">
          <div className="flex items-center gap-3">
            <Avatar name={CLINICIAN.name} tone="dark" />
            <div className="min-w-0">
              <p className="truncate text-sm font-bold text-white">{CLINICIAN.name}</p>
              <p className="truncate text-xs text-mist-400">{CLINICIAN.credentials}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile / tablet top bar */}
      <header className="sticky top-0 z-40 border-b border-mist-200 bg-navy-950 lg:hidden">
        <div className="flex h-14 items-center justify-between px-4">
          <Logo tone="dark" />
          <div className="flex items-center gap-2">
            <RoleSwitcher tone="dark" />
            <Avatar name={CLINICIAN.name} tone="dark" className="size-9" />
          </div>
        </div>
        <nav aria-label="Primary" className="overflow-x-auto px-2 pb-2">
          <ul className="flex gap-1">
            {NAV.map(({ to, label, icon: Icon, end }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  end={end}
                  className={({ isActive }) =>
                    cn(
                      'inline-flex h-10 items-center gap-2 rounded-lg px-3.5 text-sm font-semibold whitespace-nowrap',
                      isActive ? 'bg-navy-700 text-white' : 'text-mist-300',
                    )
                  }
                >
                  <Icon className="size-4" aria-hidden="true" />
                  {label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </header>

      {/* Desktop top strip */}
      <div className="sticky top-0 z-30 hidden h-16 items-center justify-end gap-3 border-b border-mist-200 bg-white/90 px-6 backdrop-blur lg:flex">
        <RoleSwitcher />
      </div>

      <main id="main" className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
        <Outlet />
      </main>
    </div>
  )
}
