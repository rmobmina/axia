import { Link } from 'react-router-dom'
import { CheckCheck, ChevronRight, Flag } from 'lucide-react'
import { useApi } from '@/hooks/useApi'
import { api } from '@/services/api'
import { patientById } from '@/mocks/patients'
import { exerciseById } from '@/mocks/exercises'
import { formatDateFull } from '@/lib/utils'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar } from '@/components/ui/avatar'
import { Skeleton } from '@/components/ui/skeleton'
import { EmptyState } from '@/components/EmptyState'

export function ReviewsPage() {
  const { data: sessions } = useApi(() => api.listSessions())

  const queue = (sessions ?? [])
    .filter((s) => !s.reviewed)
    .sort((a, b) => Number(b.flagged) - Number(a.flagged) || b.date.localeCompare(a.date))
  const done = (sessions ?? []).filter((s) => s.reviewed)

  return (
    <div className="space-y-6 pb-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-ink-900 sm:text-3xl">Session reviews</h1>
        <p className="mt-1 text-ink-600">
          {sessions ? `${queue.length} submissions waiting · flagged sessions first` : 'Loading queue…'}
        </p>
      </div>

      <div className="space-y-2.5">
        {!sessions && Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-20" />)}
        {queue.map((s) => {
          const patient = patientById(s.patientId)
          const ex = exerciseById(s.exerciseId)
          return (
            <Link key={s.id} to={`/clinician/reviews/${s.id}`} className="group block">
              <Card className="flex flex-wrap items-center gap-4 p-4 transition-shadow group-hover:shadow-card-lg">
                <Avatar name={patient.name} />
                <div className="min-w-44 flex-1">
                  <p className="font-bold text-ink-900">{patient.name}</p>
                  <p className="text-sm text-ink-400">
                    {ex.name} · {formatDateFull(s.date)}
                  </p>
                </div>
                <p className="text-sm text-ink-600 tabular-nums">
                  {s.repsCompleted}/{s.targetReps} reps
                </p>
                <p className="text-sm text-ink-600 tabular-nums">form {s.formScore}/100</p>
                {s.flagged && (
                  <Badge variant="alert">
                    <Flag aria-hidden="true" /> {s.flagReason ?? 'Flagged'}
                  </Badge>
                )}
                <ChevronRight
                  className="ml-auto size-5 text-mist-400 transition-transform group-hover:translate-x-0.5"
                  aria-hidden="true"
                />
              </Card>
            </Link>
          )
        })}
        {sessions && queue.length === 0 && (
          <EmptyState
            icon={<CheckCheck aria-hidden="true" />}
            title="Review queue is clear"
            description="New patient submissions will appear here as they come in."
          />
        )}
      </div>

      {done.length > 0 && (
        <Card>
          <CardContent className="p-5">
            <h2 className="mb-3 text-sm font-bold tracking-wide text-ink-400 uppercase">
              Recently reviewed
            </h2>
            <div className="space-y-1.5">
              {done.map((s) => (
                <Link
                  key={s.id}
                  to={`/clinician/reviews/${s.id}`}
                  className="flex items-center justify-between gap-3 rounded-lg px-3 py-2 text-sm hover:bg-mist-50"
                >
                  <span className="font-semibold text-ink-600">
                    {patientById(s.patientId).name} · {exerciseById(s.exerciseId).name}
                  </span>
                  <span className="text-xs text-ink-400">{formatDateFull(s.date)}</span>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
