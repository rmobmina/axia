import { useNavigate } from 'react-router-dom'
import { CalendarDays, Play } from 'lucide-react'
import { useApi } from '@/hooks/useApi'
import { api } from '@/services/api'
import { DEMO_PATIENT_ID } from '@/context/RoleContext'
import { exerciseById, REGION_LABELS } from '@/mocks/exercises'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { PlanItemStatusBadge } from '@/components/StatusBadge'
import { SkeletonGuide } from '@/components/skeleton/SkeletonGuide'
import type { PlanItem } from '@/types'
import { cn } from '@/lib/utils'

function DifficultyDots({ level }: { level: 1 | 2 | 3 }) {
  return (
    <span className="inline-flex items-center gap-1" aria-label={`Difficulty ${level} of 3`}>
      {[1, 2, 3].map((i) => (
        <span
          key={i}
          aria-hidden="true"
          className={cn('size-1.5 rounded-full', i <= level ? 'bg-navy-700' : 'bg-mist-200')}
        />
      ))}
    </span>
  )
}

function ExerciseCard({ item }: { item: PlanItem }) {
  const navigate = useNavigate()
  const ex = exerciseById(item.exerciseId)
  return (
    <Card className="flex flex-col">
      <div className="flex items-start gap-4 p-5 pb-3">
        <div className="h-24 w-20 shrink-0 rounded-xl bg-mist-50 p-1 ring-1 ring-mist-200">
          <SkeletonGuide
            poseId={ex.poseId}
            playing={false}
            showTargetArc={false}
            label={`${ex.name} preview`}
          />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-bold text-ink-900">{ex.name}</h3>
            <PlanItemStatusBadge status={item.status} />
          </div>
          <p className="mt-1 line-clamp-2 text-sm text-ink-400">{ex.summary}</p>
          <div className="mt-2.5 flex flex-wrap items-center gap-2">
            <Badge variant="accent">{REGION_LABELS[ex.region]}</Badge>
            <Badge variant="outline">
              {item.sets} × {item.reps}
              {item.holdSeconds ? ` · ${item.holdSeconds}s hold` : ''}
            </Badge>
            <Badge variant="outline">{item.frequency}</Badge>
            <DifficultyDots level={ex.difficulty} />
          </div>
        </div>
      </div>
      <div className="mt-auto flex items-center justify-between gap-3 px-5 pb-5">
        <p className="text-xs font-semibold text-ink-400">{ex.tempo ?? ''}</p>
        <Button
          onClick={() => navigate(`/patient/exercise/${ex.id}`)}
          variant={item.status === 'completed' ? 'secondary' : 'primary'}
        >
          <Play aria-hidden="true" />
          {item.status === 'completed' ? 'Do again' : 'Start exercise'}
        </Button>
      </div>
    </Card>
  )
}

export function PlanPage() {
  const { data: plan } = useApi(() => api.getPlan(DEMO_PATIENT_ID))

  const today = plan?.items.filter((i) => i.dueToday) ?? []
  const thisWeek = plan?.items.filter((i) => !i.dueToday) ?? []

  return (
    <div className="space-y-6 pb-6">
      <h1 className="text-2xl font-bold tracking-tight text-ink-900 sm:text-3xl">My Plan</h1>

      {/* Plan overview */}
      {plan ? (
        <Card className="border-0 bg-navy-700 text-white">
          <CardContent className="p-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-xs font-bold tracking-wide text-mist-300 uppercase">
                  Assigned plan
                </p>
                <h2 className="mt-1 text-xl font-bold">{plan.name}</h2>
                <p className="mt-1 text-sm text-mist-200">{plan.focus}</p>
              </div>
              <Badge variant="onDark" className="px-3 py-1.5">
                <CalendarDays aria-hidden="true" /> {plan.stage}
              </Badge>
            </div>
            <p className="mt-4 rounded-xl bg-white/10 p-3.5 text-sm leading-relaxed text-mist-100">
              <span className="font-bold text-white">Note from Dr. Raman: </span>
              {plan.clinicianNote}
            </p>
          </CardContent>
        </Card>
      ) : (
        <Skeleton className="h-44" />
      )}

      {/* Due today */}
      <section aria-labelledby="due-today">
        <h2 id="due-today" className="mb-3 text-lg font-bold text-ink-900">
          Due today{' '}
          <span className="text-sm font-semibold text-ink-400">
            · {today.filter((i) => i.status === 'completed').length} of {today.length} done
          </span>
        </h2>
        <div className="grid gap-4 md:grid-cols-2">
          {!plan && Array.from({ length: 2 }).map((_, i) => <Skeleton key={i} className="h-44" />)}
          {today.map((item) => (
            <ExerciseCard key={item.exerciseId} item={item} />
          ))}
        </div>
      </section>

      {/* Later this week */}
      {thisWeek.length > 0 && (
        <section aria-labelledby="this-week">
          <h2 id="this-week" className="mb-3 text-lg font-bold text-ink-900">
            Later this week
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            {thisWeek.map((item) => (
              <ExerciseCard key={item.exerciseId} item={item} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
