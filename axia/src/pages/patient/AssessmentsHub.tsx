import { Link, useNavigate } from 'react-router-dom'
import { CalendarClock, ChevronRight, Clock, Play } from 'lucide-react'
import { useApi } from '@/hooks/useApi'
import { api } from '@/services/api'
import { DEMO_PATIENT_ID } from '@/context/RoleContext'
import { DEMO_TODAY } from '@/mocks/patients'
import { latestResultFor } from '@/mocks/assessments'
import { formatDate } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { SkeletonGuide } from '@/components/skeleton/SkeletonGuide'

export function AssessmentsHub() {
  const navigate = useNavigate()
  const { data: assessments } = useApi(() => api.listAssessments())
  const { data: due } = useApi(() => api.getAssessmentDue(DEMO_PATIENT_ID))

  return (
    <div className="space-y-6 pb-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-ink-900 sm:text-3xl">Assessments</h1>
        <p className="mt-1 max-w-2xl text-ink-600">
          Short movement check-ins that measure how your mobility is changing. Your camera guides
          you through each one — results go straight to your clinician.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {!assessments &&
          Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-64" />)}
        {assessments?.map((a) => {
          const isDue = due?.type === a.id
          const last = latestResultFor(DEMO_PATIENT_ID, a.id)
          return (
            <Card key={a.id} className="flex flex-col overflow-hidden">
              <div className="flex items-start gap-4 p-5">
                <div className="h-28 w-24 shrink-0 rounded-xl bg-mist-50 p-1 ring-1 ring-mist-200">
                  <SkeletonGuide poseId={a.poseId} playing={false} showTargetArc={false} label={`${a.name} preview`} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="font-bold text-ink-900">{a.name}</h2>
                    {isDue && (
                      <Badge variant="warn">
                        <CalendarClock aria-hidden="true" />
                        Due {due!.due === DEMO_TODAY ? 'today' : formatDate(due!.due)}
                      </Badge>
                    )}
                  </div>
                  <p className="mt-1 text-sm leading-relaxed text-ink-600">{a.purpose}</p>
                  <p className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-ink-400">
                    <Clock className="size-3.5" aria-hidden="true" /> {a.durationLabel}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-1.5 px-5">
                {a.measures.map((m) => (
                  <Badge key={m} variant="outline">
                    {m}
                  </Badge>
                ))}
              </div>

              <div className="mt-auto flex items-center justify-between gap-3 p-5">
                {last ? (
                  <Link
                    to={`/patient/assessments/${a.id}/results/${last.id}`}
                    className="inline-flex items-center gap-1 text-sm font-bold text-navy-700 hover:underline"
                  >
                    Last result · {formatDate(last.date)}
                    <ChevronRight className="size-4" aria-hidden="true" />
                  </Link>
                ) : (
                  <span className="text-sm font-semibold text-ink-400">No results yet</span>
                )}
                <Button
                  variant={isDue ? 'primary' : 'secondary'}
                  onClick={() => navigate(`/patient/assessments/${a.id}/run`)}
                >
                  <Play aria-hidden="true" /> Start
                </Button>
              </div>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
