import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronRight, Search, UserRoundSearch } from 'lucide-react'
import { useApi } from '@/hooks/useApi'
import { api } from '@/services/api'
import { formatDate } from '@/lib/utils'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Progress } from '@/components/ui/progress'
import { Avatar } from '@/components/ui/avatar'
import { Skeleton } from '@/components/ui/skeleton'
import { RiskBadge } from '@/components/StatusBadge'
import { Sparkline } from '@/components/charts/Sparkline'
import { EmptyState } from '@/components/EmptyState'
import { cn } from '@/lib/utils'
import type { RiskLevel } from '@/types'

const RISK_FILTERS: { value: RiskLevel | 'all'; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'high', label: 'High risk' },
  { value: 'moderate', label: 'Moderate' },
  { value: 'low', label: 'Low risk' },
]

export function PatientsListPage() {
  const { data: patients } = useApi(() => api.listPatients())
  const [query, setQuery] = useState('')
  const [risk, setRisk] = useState<RiskLevel | 'all'>('all')

  const filtered = useMemo(
    () =>
      (patients ?? []).filter(
        (p) =>
          (risk === 'all' || p.riskLevel === risk) &&
          (p.name.toLowerCase().includes(query.toLowerCase()) ||
            p.condition.toLowerCase().includes(query.toLowerCase())),
      ),
    [patients, query, risk],
  )

  return (
    <div className="space-y-5 pb-6">
      <h1 className="text-2xl font-bold tracking-tight text-ink-900 sm:text-3xl">Patients</h1>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative w-full max-w-sm">
          <Search
            className="pointer-events-none absolute top-1/2 left-3.5 size-4.5 -translate-y-1/2 text-ink-400"
            aria-hidden="true"
          />
          <Input
            type="search"
            placeholder="Search by name or condition…"
            aria-label="Search patients"
            className="pl-10"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <div role="group" aria-label="Filter by risk level" className="flex flex-wrap gap-1.5">
          {RISK_FILTERS.map((f) => (
            <button
              key={f.value}
              type="button"
              aria-pressed={risk === f.value}
              onClick={() => setRisk(f.value)}
              className={cn(
                'h-10 cursor-pointer rounded-full px-4 text-sm font-semibold transition-colors',
                risk === f.value
                  ? 'bg-navy-700 text-white'
                  : 'bg-white text-ink-600 ring-1 ring-mist-200 hover:bg-mist-50',
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Patient cards */}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {!patients && Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-48" />)}
        {filtered.map((p) => (
          <Link key={p.id} to={`/clinician/patients/${p.id}`} className="group">
            <Card className="h-full p-5 transition-shadow group-hover:shadow-card-lg">
              <div className="flex items-start gap-3">
                <Avatar name={p.name} />
                <div className="min-w-0 flex-1">
                  <p className="flex items-center gap-1 font-bold text-ink-900">
                    {p.name}
                    <ChevronRight
                      className="size-4 text-mist-400 transition-transform group-hover:translate-x-0.5"
                      aria-hidden="true"
                    />
                  </p>
                  <p className="truncate text-sm text-ink-400">{p.condition}</p>
                </div>
                <RiskBadge level={p.riskLevel} />
              </div>

              <div className="mt-4 space-y-1.5">
                <div className="flex justify-between text-xs font-semibold text-ink-400">
                  <span>7-day adherence</span>
                  <span className="text-ink-900 tabular-nums">{p.adherence7d}%</span>
                </div>
                <Progress
                  value={p.adherence7d}
                  aria-label={`${p.name} adherence`}
                  barClassName={p.adherence7d < 60 ? 'bg-warn-600' : 'bg-navy-700'}
                />
              </div>

              <div className="mt-4 flex items-end justify-between">
                <div>
                  <p className="text-xs font-semibold text-ink-400">Mobility score</p>
                  <p className="text-xl font-bold text-ink-900 tabular-nums">
                    {p.mobilityScore}
                    <span className="text-sm font-semibold text-ink-400">/100</span>
                  </p>
                </div>
                <Sparkline values={p.mobilityTrend} improving={p.mobilityDelta >= 0} />
              </div>

              <p className="mt-3 border-t border-mist-100 pt-3 text-xs text-ink-400">
                {p.program} · last active {formatDate(p.lastActiveDate)}
              </p>
            </Card>
          </Link>
        ))}
      </div>

      {patients && filtered.length === 0 && (
        <EmptyState
          icon={<UserRoundSearch aria-hidden="true" />}
          title="No patients match"
          description="Try a different name, condition, or risk filter."
        />
      )}
    </div>
  )
}
