import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Activity,
  ArrowRight,
  CalendarCheck,
  CheckCircle2,
  Flame,
  MessageSquareText,
  Play,
  Ruler,
  Scale,
} from 'lucide-react'
import { useApi } from '@/hooks/useApi'
import { api } from '@/services/api'
import { DEMO_PATIENT_ID } from '@/context/RoleContext'
import { DEMO_TODAY } from '@/mocks/patients'
import { exerciseById } from '@/mocks/exercises'
import { assessmentById } from '@/mocks/assessments'
import { formatDateFull, formatDate } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Skeleton } from '@/components/ui/skeleton'
import { StatCard } from '@/components/StatCard'
import { PlanItemStatusBadge } from '@/components/StatusBadge'
import { SkeletonGuide } from '@/components/skeleton/SkeletonGuide'
import { AdherenceBars } from '@/components/charts/AdherenceBars'

function greeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 18) return 'Good afternoon'
  return 'Good evening'
}

export function PatientDashboard() {
  const navigate = useNavigate()
  const patientId = DEMO_PATIENT_ID

  const { data: patient } = useApi(() => api.getPatient(patientId))
  const { data: plan } = useApi(() => api.getPlan(patientId))
  const { data: streak } = useApi(() => api.getStreak(patientId))
  const { data: progress } = useApi(() => api.getWeeklyProgress(patientId))
  const { data: notes } = useApi(() => api.listNotes(patientId))
  const { data: due } = useApi(() => api.getAssessmentDue(patientId))

  const todayItems = plan?.items.filter((i) => i.dueToday) ?? []
  const doneToday = todayItems.filter((i) => i.status === 'completed').length
  const nextItem = todayItems.find((i) => i.status !== 'completed')
  const nextExercise = nextItem ? exerciseById(nextItem.exerciseId) : null
  const latestClinicianNote = notes?.find((n) => n.from === 'clinician')
  const dueAssessment = due ? assessmentById(due.type) : null
  const latestWeek = progress?.[progress.length - 1]

  return (
    <div className="space-y-6 pb-6">
      {/* Greeting */}
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-ink-400">{formatDateFull(DEMO_TODAY)}</p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-ink-900 sm:text-3xl">
            {greeting()}, {patient ? patient.name.split(' ')[0] : '…'}
          </h1>
        </div>
        {streak !== null && streak > 0 && (
          <Badge variant="warn" className="px-3 py-1.5 text-sm">
            <Flame aria-hidden="true" /> {streak}-day streak
          </Badge>
        )}
      </div>

      {/* Continue session hero */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <Card className="overflow-hidden border-0 bg-navy-800 text-white shadow-card-lg">
          <div className="grid gap-0 sm:grid-cols-[1fr_180px]">
            <div className="p-6 sm:p-7">
              <p className="text-xs font-bold tracking-wide text-mist-300 uppercase">
                Today’s session
              </p>
              {plan ? (
                <>
                  <h2 className="mt-2 text-xl font-bold sm:text-2xl">
                    {nextExercise
                      ? `Next up: ${nextExercise.name}`
                      : 'All done for today — great work!'}
                  </h2>
                  <p className="mt-1.5 text-sm text-mist-300">
                    {doneToday} of {todayItems.length} exercises completed
                    {nextItem &&
                      ` · ${nextItem.sets} sets × ${nextItem.reps}${nextItem.holdSeconds ? ` · hold ${nextItem.holdSeconds}s` : ''}`}
                  </p>
                  <Progress
                    value={todayItems.length ? (doneToday / todayItems.length) * 100 : 0}
                    className="mt-4 bg-white/15"
                    barClassName="bg-mist-400"
                    aria-label="Today's session progress"
                  />
                  <div className="mt-5 flex flex-wrap gap-3">
                    {nextExercise ? (
                      <Button
                        size="lg"
                        className="bg-white text-navy-800 hover:bg-mist-100 active:bg-mist-200"
                        onClick={() => navigate(`/patient/exercise/${nextExercise.id}`)}
                      >
                        <Play aria-hidden="true" /> Continue today’s session
                      </Button>
                    ) : (
                      <Button
                        size="lg"
                        className="bg-white text-navy-800 hover:bg-mist-100"
                        onClick={() => navigate('/patient/progress')}
                      >
                        See your progress <ArrowRight aria-hidden="true" />
                      </Button>
                    )}
                    <Button size="lg" variant="ghostOnDark" onClick={() => navigate('/patient/plan')}>
                      View full plan
                    </Button>
                  </div>
                </>
              ) : (
                <div className="mt-3 space-y-3">
                  <Skeleton className="h-7 w-2/3 bg-white/15" />
                  <Skeleton className="h-4 w-1/2 bg-white/15" />
                  <Skeleton className="h-12 w-56 bg-white/15" />
                </div>
              )}
            </div>
            <div className="hidden items-center justify-center bg-navy-950/40 p-4 sm:flex">
              <SkeletonGuide
                poseId={nextExercise?.poseId ?? 'idle'}
                tone="dark"
                label={nextExercise ? `Demonstration of ${nextExercise.name}` : 'Movement guide'}
                showTargetArc={false}
              />
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Snapshot stats */}
      <section aria-labelledby="snapshot-heading">
        <h2 id="snapshot-heading" className="sr-only">
          Mobility snapshot
        </h2>
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <StatCard
            label="Mobility score"
            value={patient?.mobilityScore ?? '—'}
            unit="/100"
            delta={patient?.mobilityDelta}
            deltaLabel="30 days"
            icon={<Activity aria-hidden="true" />}
          />
          <StatCard
            label="Knee range"
            value={latestWeek?.romDeg ?? '—'}
            unit="°"
            delta={
              progress && progress.length > 1
                ? latestWeek!.romDeg - progress[progress.length - 2].romDeg
                : undefined
            }
            deltaLabel="wk"
            icon={<Ruler aria-hidden="true" />}
          />
          <StatCard
            label="This week"
            value={latestWeek ? `${latestWeek.sessionsCompleted}/${latestWeek.sessionsAssigned}` : '—'}
            unit="sessions"
            icon={<CheckCircle2 aria-hidden="true" />}
          />
          <StatCard
            label="Symmetry"
            value={84}
            unit="%"
            delta={3}
            deltaLabel="wk"
            icon={<Scale aria-hidden="true" />}
          />
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Today's plan */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle>Today’s plan</CardTitle>
            <Link
              to="/patient/plan"
              className="inline-flex items-center gap-1 text-sm font-bold text-navy-700 hover:underline"
            >
              My Plan <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </CardHeader>
          <CardContent className="space-y-2.5">
            {!plan &&
              Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-16" />)}
            {todayItems.map((item) => {
              const ex = exerciseById(item.exerciseId)
              return (
                <div
                  key={item.exerciseId}
                  className="flex items-center gap-4 rounded-xl border border-mist-200/70 bg-mist-50/50 p-3"
                >
                  <div className="size-12 shrink-0 rounded-xl bg-white p-1 ring-1 ring-mist-200">
                    <SkeletonGuide poseId={ex.poseId} playing={false} showTargetArc={false} label="" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-bold text-ink-900">{ex.name}</p>
                    <p className="text-sm text-ink-400">
                      {item.sets} sets × {item.reps}
                      {item.holdSeconds ? ` · ${item.holdSeconds}s hold` : ''}
                    </p>
                  </div>
                  <PlanItemStatusBadge status={item.status} />
                  {item.status !== 'completed' && (
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => navigate(`/patient/exercise/${ex.id}`)}
                      aria-label={`Start ${ex.name}`}
                    >
                      <Play aria-hidden="true" /> Start
                    </Button>
                  )}
                </div>
              )
            })}
          </CardContent>
        </Card>

        <div className="space-y-6">
          {/* Upcoming check-in */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarCheck className="size-4.5 text-mist-500" aria-hidden="true" />
                Upcoming check-in
              </CardTitle>
            </CardHeader>
            <CardContent>
              {dueAssessment && due ? (
                <>
                  <p className="font-bold text-ink-900">{dueAssessment.name}</p>
                  <p className="mt-0.5 text-sm text-ink-400">
                    Due {due.due === DEMO_TODAY ? 'today' : formatDate(due.due)} ·{' '}
                    {dueAssessment.durationLabel}
                  </p>
                  <p className="mt-2 text-sm text-ink-600">{dueAssessment.purpose}</p>
                  <Button
                    className="mt-4 w-full"
                    onClick={() => navigate(`/patient/assessments/${dueAssessment.id}/run`)}
                  >
                    Start assessment
                  </Button>
                </>
              ) : (
                <Skeleton className="h-24" />
              )}
            </CardContent>
          </Card>

          {/* Clinician note */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquareText className="size-4.5 text-mist-500" aria-hidden="true" />
                From your clinician
              </CardTitle>
            </CardHeader>
            <CardContent>
              {latestClinicianNote ? (
                <>
                  <p className="text-sm leading-relaxed text-ink-600">
                    “{latestClinicianNote.text}”
                  </p>
                  <p className="mt-3 text-xs font-semibold text-ink-400">
                    {latestClinicianNote.authorName} · {formatDate(latestClinicianNote.date)}
                  </p>
                </>
              ) : (
                <Skeleton className="h-20" />
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Weekly progress */}
      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <div>
            <CardTitle>Weekly adherence</CardTitle>
            <p className="mt-0.5 text-sm text-ink-400">Share of assigned sessions completed</p>
          </div>
          <Link
            to="/patient/progress"
            className="inline-flex items-center gap-1 text-sm font-bold text-navy-700 hover:underline"
          >
            All progress <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </CardHeader>
        <CardContent>
          {progress ? <AdherenceBars data={progress} /> : <Skeleton className="h-52" />}
        </CardContent>
      </Card>
    </div>
  )
}
