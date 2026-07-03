import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import type { Role } from '@/types'

/**
 * Mock auth / role switching for the demo.
 *
 * TODO(backend): replace with a real auth provider (session token from
 * FastAPI, role claims, current patient/clinician identity from the API).
 */

const STORAGE_KEY = 'axia.role'

/** The signed-in demo patient (Maya Torres) — see src/mocks/patients.ts. */
export const DEMO_PATIENT_ID = 'p-maya'

interface RoleContextValue {
  role: Role | null
  setRole: (role: Role | null) => void
}

const RoleContext = createContext<RoleContextValue>({
  role: null,
  setRole: () => {},
})

export function RoleProvider({ children }: { children: ReactNode }) {
  const [role, setRoleState] = useState<Role | null>(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved === 'patient' || saved === 'clinician' ? saved : null
  })

  useEffect(() => {
    if (role) localStorage.setItem(STORAGE_KEY, role)
    else localStorage.removeItem(STORAGE_KEY)
  }, [role])

  return (
    <RoleContext.Provider value={{ role, setRole: setRoleState }}>
      {children}
    </RoleContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useRole() {
  return useContext(RoleContext)
}
