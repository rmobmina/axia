import { useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Award, CheckCircle2, ChevronRight, Home, Ruler, Send, Star, Trophy } from 'lucide-react'
import { exerciseById } from '@/mocks/exercises'
import { planByPatientId } from '@/mocks/plans'
import { DEMO_PATIENT_ID } from '@/context/RoleContext'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { StatCard } from '@/components/StatCard'
import { SymmetryBar } from '@/components/charts/SymmetryBar'

/**
 * Post-exercise summary.
 * TODO(cv-pipeline): metrics below are generated deterministically from the
 * exercise targets; replace with the analysis output for the recorded video
 * (POST /api/sessions response).
 */
export function SessionSummaryPage() {
  const { exerciseId } = useParams()
  const navigate = useNavigate()
  const exercise = useMemo(() => exerciseById(exerciseId!), [exerciseId])
  const plan = planByPatientId(DEMO_PATIENT_ID)
  const item = plan.items.find((i) => i.exerciseId === exerciseId)
  const [sent, setSent] = useState(false)

  const reps = item?.reps ?? exercise.defaultReps
  const sets = item?.sets ?? exercise.defaultSets

  // Believable mock metrics derived from the exercise definition.
  const metrics = useMemo(() => {
    const targetRom =
      exercise.poseId === 'shoulder-abduction' ? 160 : exercise.poseId === 'squat' ? 45 : 70
    return {
      repsCompleted: reps * sets,
      avgRom: Math.round(targetRom * 0.92),
      bestRom: Math.round(targetRom * 1.01),
      targetRom,
      symmetry: 84,
      formScore: 82,
      notes: [
        exercise.coachingCues[1] ?? 'Keep your pace steady.',
        'Range held up well across all sets.',
      ],
    }
  }, [exercise, reps, sets])

  // Next unfinished exercise in today's plan.
  const nextItem = plan.items.find(
    (i) => i.dueToday && i.status !== 'completed' && i.exerciseId !== exerciseId,
  )

  return (
    <div className="min-h-svh bg-paper">
      <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        {/* Celebration header */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', stiffness: 260, damping: 20 }}
          className="text-center"
        >
          <span className="inline-flex size-20 items-center justify-center rounded-full bg-good-100">
            <Trophy className="size-10 text-good-700" aria-hidden="true" />
          </span>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-ink-900">Session complete!</h1>
          <p className="mt-2 text-ink-600">
            {exercise.name} · {sets} sets × {reps} reps
          </p>
          <Badge variant="good" className="mt-3 px-3 py-1.5 text-sm">
            <Award aria-hidden="true" /> Consistency badge earned — 5 days in a row
          </Badge>
        </motion.div>

        {/* Metrics */}
        <div className="mt-8 grid grid-cols-2 gap-4">
          <StatCard
            label="Reps completed"
            value={metrics.repsCompleted}
            unit={`/ ${reps * sets}`}
            icon={<CheckCircle2 aria-hidden="true" />}
          />
          <StatCard
            label="Average range"
            value={metrics.avgRom}
            unit="°"
            delta={3}
            deltaLabel="vs last"
            icon={<Ruler aria-hidden="true" />}
          />
          <StatCard
            label="Best rep"
            value={metrics.bestRom}
            unit="°"
            icon={<Star aria-hidden="true" />}
          />
          <StatCard
            label="Form score"
            value={metrics.formScore}
            unit="/100"
            delta={4}
            deltaLabel="vs last"
            icon={<Award aria-hidden="true" />}
          />
        </div>

        {/* Symmetry */}
        <Card className="mt-4">
          <CardContent className="p-5">
            <p className="mb-3 text-sm font-bold text-ink-900">Left / right symmetry</p>
            <SymmetryBar value={metrics.symmetry} />
          </CardContent>
        </Card>

        {/* Form notes */}
        <Card className="mt-4">
          <CardContent className="p-5">
            <p className="mb-3 text-sm font-bold text-ink-900">Coach’s notes from this session</p>
            <ul className="space-y-2">
              {metrics.notes.map((n) => (
                <li key={n} className="flex items-start gap-2.5 text-sm leading-relaxed text-ink-600">
                  <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-mist-500" aria-hidden="true" />
                  {n}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="mt-8 space-y-3">
          <Button
            size="lg"
            variant={sent ? 'success' : 'primary'}
            className="w-full"
            onClick={() => setSent(true)}
            disabled={sent}
          >
            {sent ? (
              <>
                <CheckCircle2 aria-hidden="true" /> Sent to Dr. Raman
              </>
            ) : (
              <>
                <Send aria-hidden="true" /> Send to clinician
              </>
            )}
          </Button>
          {nextItem ? (
            <Button
              size="lg"
              variant="secondary"
              className="w-full"
              onClick={() => navigate(`/patient/exercise/${nextItem.exerciseId}`)}
            >
              Next: {exerciseById(nextItem.exerciseId).name}
              <ChevronRight aria-hidden="true" />
            </Button>
          ) : null}
          <Button size="lg" variant="ghost" className="w-full" onClick={() => navigate('/patient')}>
            <Home aria-hidden="true" /> Back to home
          </Button>
        </div>
      </main>
    </div>
  )
}
