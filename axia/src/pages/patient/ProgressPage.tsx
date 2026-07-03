import { useMemo, useState } from 'react'
import { Award, CalendarCheck, Flame, Medal, Ruler, TrendingUp } from 'lucide-react'
import { useApi } from '@/hooks/useApi'
import { api } from '@/services/api'
import { DEMO_PATIENT_ID } from '@/context/RoleContext'
import { exerciseById, REGION_LABELS } from '@/mocks/exercises'
import { formatDate } from '@/lib/utils'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { StatCard } from '@/components/StatCard'
import { AdherenceBars } from '@/components/charts/AdherenceBars'
import { TrendChart } from '@/components/charts/TrendChart'
import { SymmetryBar } from '@/components/charts/SymmetryBar'
import { cn } from '@/lib/utils'
import type { Milestone } from '@/types'

const MILESTONE_ICONS: Record<Milestone['icon'], typeof Flame> = {
  streak: Flame,
  rom: Ruler,
  sessions: CalendarCheck,
  assessment: TrendingUp,
}

export function ProgressPage() {
  const { data: progress } = useApi(() => api.getWeeklyProgress(DEMO_PATIENT_ID))
  const { data: milestones } = useApi(() => api.getMilestones(DEMO_PATIENT_ID))
  const { data: sessions } = useApi(() => api.listSessions(DEMO_PATIENT_ID))

  const [regionFilter, setRegionFilter] = useState<string>('all')

  const regions = useMemo(() => {
    const set = new Set(sessions?.map((s) => exerciseById(s.exerciseId).region))
    return ['all', ...set]
  }, [sessions])

  const filteredSessions =
    sessions?.filter(
      (s) => regionFilter === 'all' || exerciseById(s.exerciseId).region === regionFilter,
    ) ?? []

  const latest = progress?.[progress.length - 1]
  const first = progress?.[0]

  return (
    <div className="space-y-6 pb-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-ink-900 sm:text-3xl">Progress</h1>
        <p className="mt-1 text-ink-600">Six weeks of steady work — here’s what it’s adding up to.</p>
      </div>

      {/* Headline stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          label="Mobility score"
          value={latest?.mobilityScore ?? '—'}
          unit="/100"
          delta={latest && first ? latest.mobilityScore - first.mobilityScore : undefined}
          deltaLabel="6 wks"
          icon={<TrendingUp aria-hidden="true" />}
        />
        <StatCard
          label="Knee range"
          value={latest?.romDeg ?? '—'}
          unit="°"
          delta={latest && first ? latest.romDeg - first.romDeg : undefined}
          deltaLabel="6 wks"
          icon={<Ruler aria-hidden="true" />}
        />
        <StatCard
          label="Sessions done"
          value={progress?.reduce((sum, w) => sum + w.sessionsCompleted, 0) ?? '—'}
          icon={<CalendarCheck aria-hidden="true" />}
        />
        <StatCard
          label="Pain level"
          value={latest?.painLevel ?? '—'}
          unit="/10"
          delta={latest && first ? latest.painLevel - first.painLevel : undefined}
          betterWhen="lower"
          deltaLabel="6 wks"
          icon={<Award aria-hidden="true" />}
        />
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Rehab adherence</CardTitle>
            <p className="text-sm text-ink-400">Share of assigned sessions completed each week</p>
          </CardHeader>
          <CardContent>
            {progress ? <AdherenceBars data={progress} /> : <Skeleton className="h-52" />}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Knee range of motion</CardTitle>
            <p className="text-sm text-ink-400">Average extension range per week</p>
          </CardHeader>
          <CardContent>
            {progress ? (
              <TrendChart
                data={progress}
                xKey="weekOf"
                series={[{ key: 'romDeg', label: 'Range', color: 'var(--color-chart-1)' }]}
                unit="°"
                height={220}
                yDomain={[35, 75]}
              />
            ) : (
              <Skeleton className="h-52" />
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Mobility score trend</CardTitle>
            <p className="text-sm text-ink-400">Composite of range, symmetry, and assessment results</p>
          </CardHeader>
          <CardContent>
            {progress ? (
              <TrendChart
                data={progress}
                xKey="weekOf"
                series={[{ key: 'mobilityScore', label: 'Mobility score', color: 'var(--color-chart-1)' }]}
                height={220}
                yDomain={[45, 80]}
              />
            ) : (
              <Skeleton className="h-52" />
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Current symmetry</CardTitle>
            <p className="text-sm text-ink-400">Left / right balance across recent sessions</p>
          </CardHeader>
          <CardContent className="space-y-5 pt-4">
            <SymmetryBar value={84} />
            <p className="rounded-xl bg-good-100/70 p-3.5 text-sm leading-relaxed text-ink-600">
              <span className="font-bold text-good-700">Improvement summary: </span>
              Your operated leg is carrying noticeably more load than three weeks ago — loading
              symmetry rose from 71% to 84%, and your knee range is up 22° since week one.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Milestones */}
      <section aria-labelledby="milestones-heading">
        <h2 id="milestones-heading" className="mb-3 text-lg font-bold text-ink-900">
          Milestones
        </h2>
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {!milestones && Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-32" />)}
          {milestones?.map((m) => {
            const Icon = MILESTONE_ICONS[m.icon]
            return (
              <Card key={m.id} className="p-5 text-center">
                <span className="inline-flex size-11 items-center justify-center rounded-full bg-mist-100 text-navy-700">
                  <Icon className="size-5.5" aria-hidden="true" />
                </span>
                <p className="mt-2.5 font-bold text-ink-900">{m.label}</p>
                <p className="mt-1 text-xs leading-relaxed text-ink-400">{m.detail}</p>
                <p className="mt-2 text-xs font-semibold text-mist-600">{formatDate(m.achievedOn)}</p>
              </Card>
            )
          })}
        </div>
      </section>

      {/* Session history with region filter */}
      <Card>
        <CardHeader className="flex-row flex-wrap items-center justify-between gap-3">
          <CardTitle className="flex items-center gap-2">
            <Medal className="size-5 text-mist-500" aria-hidden="true" /> Completed sessions
          </CardTitle>
          <div role="group" aria-label="Filter by body area" className="flex flex-wrap gap-1.5">
            {regions.map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRegionFilter(r)}
                aria-pressed={regionFilter === r}
                className={cn(
                  'h-9 cursor-pointer rounded-full px-3.5 text-sm font-semibold transition-colors',
                  regionFilter === r
                    ? 'bg-navy-700 text-white'
                    : 'bg-mist-100 text-ink-600 hover:bg-mist-200',
                )}
              >
                {r === 'all' ? 'All' : REGION_LABELS[r]}
              </button>
            ))}
          </div>
        </CardHeader>
        <CardContent className="space-y-2">
          {!sessions && Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-14" />)}
          {filteredSessions.map((s) => {
            const ex = exerciseById(s.exerciseId)
            return (
              <div
                key={s.id}
                className="flex flex-wrap items-center gap-x-4 gap-y-1 rounded-xl border border-mist-200/70 bg-mist-50/50 px-4 py-3"
              >
                <p className="min-w-32 font-bold text-ink-900">{ex.name}</p>
                <Badge variant="accent">{REGION_LABELS[ex.region]}</Badge>
                <p className="text-sm text-ink-400">
                  {s.repsCompleted}/{s.targetReps} reps · form {s.formScore}/100
                </p>
                <p className="ml-auto text-sm font-semibold text-ink-400">{formatDate(s.date)}</p>
              </div>
            )
          })}
        </CardContent>
      </Card>
    </div>
  )
}
