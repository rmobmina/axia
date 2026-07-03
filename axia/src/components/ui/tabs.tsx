import { createContext, useContext, useId, useState, type ReactNode } from 'react'
import { cn } from '@/lib/utils'

/** Lightweight accessible tabs (shadcn-style API, no Radix dependency). */

interface TabsContextValue {
  value: string
  setValue: (v: string) => void
  idBase: string
}

const TabsContext = createContext<TabsContextValue | null>(null)

export function Tabs({
  defaultValue,
  className,
  children,
}: {
  defaultValue: string
  className?: string
  children: ReactNode
}) {
  const [value, setValue] = useState(defaultValue)
  const idBase = useId()
  return (
    <TabsContext.Provider value={{ value, setValue, idBase }}>
      <div className={className}>{children}</div>
    </TabsContext.Provider>
  )
}

export function TabsList({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <div
      role="tablist"
      className={cn('inline-flex flex-wrap gap-1 rounded-xl bg-mist-100 p-1', className)}
    >
      {children}
    </div>
  )
}

export function TabsTrigger({
  value,
  children,
  className,
}: {
  value: string
  children: ReactNode
  className?: string
}) {
  const ctx = useContext(TabsContext)!
  const selected = ctx.value === value
  return (
    <button
      type="button"
      role="tab"
      id={`${ctx.idBase}-tab-${value}`}
      aria-selected={selected}
      aria-controls={`${ctx.idBase}-panel-${value}`}
      onClick={() => ctx.setValue(value)}
      className={cn(
        'rounded-lg px-4 py-2 text-sm font-semibold transition-colors cursor-pointer',
        selected ? 'bg-white text-navy-800 shadow-card' : 'text-ink-400 hover:text-navy-800',
        className,
      )}
    >
      {children}
    </button>
  )
}

export function TabsContent({
  value,
  children,
  className,
}: {
  value: string
  children: ReactNode
  className?: string
}) {
  const ctx = useContext(TabsContext)!
  if (ctx.value !== value) return null
  return (
    <div
      role="tabpanel"
      id={`${ctx.idBase}-panel-${value}`}
      aria-labelledby={`${ctx.idBase}-tab-${value}`}
      className={className}
    >
      {children}
    </div>
  )
}
