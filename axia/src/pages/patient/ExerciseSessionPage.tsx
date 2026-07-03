import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import {
  AlertTriangle,
  CheckCircle2,
  Info,
  Pause,
  Play,
  RotateCcw,
  ShieldCheck,
  SkipForward,
  X,
} from 'lucide-react'
import { exerciseById } from '@/mocks/exercises'
import { planByPatientId } from '@/mocks/plans'
import { DEMO_PATIENT_ID } from '@/context/RoleContext'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { SkeletonGuide } from '@/components/skeleton/SkeletonGuide'
import { CameraPlaceholder } from '@/components/CameraPlaceholder'
import { cn } from '@/lib/utils'

/**
 * Guided exercise session player.
 *
 * The rep/set state machine is real; the *sensing* is simulated — reps
 * advance on a timer and coaching cues rotate from the exercise's cue list.
 * TODO(cv-pipeline): drive `rep`, form feedback, and rep quality from live
 * pose tracking instead of the interval timer. The phase machine
 * (intro → active ⇄ rest → done) stays as-is.
 */

type Phase = 'intro' | 'active' | 'rest'

const REST_SECONDS = 15
const SECONDS_PER_REP = 3.5

export function ExerciseSessionPage() {
  const { exerciseId } = useParams()
  const navigate = useNavigate()
  const exercise = useMemo(() => exerciseById(exerciseId!), [exerciseId])
  const planItem = useMemo(
    () => planByPatientId(DEMO_PATIENT_ID).items.find((i) => i.exerciseId === exerciseId),
    [exerciseId],
  )
  const reps = planItem?.reps ?? exercise.defaultReps
  const sets = planItem?.sets ?? exercise.defaultSets

  const [phase, setPhase] = useState<Phase>('intro')
  const [paused, setPaused] = useState(false)
  const [set, setSet] = useState(1)
  const [rep, setRep] = useState(0)
  const [restLeft, setRestLeft] = useState(REST_SECONDS)
  const tick = useRef(0)

  const finish = () => navigate(`/patient/exercise/${exercise.id}/summary`)

  // Simulated rep clock. TODO(cv-pipeline): replace with pose-detected reps.
  useEffect(() => {
    if (phase !== 'active' || paused) return
    const id = setInterval(() => {
      tick.current += 0.5
      if (tick.current >= SECONDS_PER_REP) {
        tick.current = 0
        setRep((r) => r + 1)
      }
    }, 500)
    return () => clearInterval(id)
  }, [phase, paused])

  // Set / rest transitions
  useEffect(() => {
    if (phase === 'active' && rep >= reps) {
      if (set >= sets) {
        finish()
      } else {
        setPhase('rest')
        setRestLeft(REST_SECONDS)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rep, phase, reps, set, sets])

  useEffect(() => {
    if (phase !== 'rest' || paused) return
    const id = setInterval(() => setRestLeft((s) => s - 1), 1000)
    return () => clearInterval(id)
  }, [phase, paused])

  useEffect(() => {
    if (phase === 'rest' && restLeft <= 0) {
      setSet((s) => s + 1)
      setRep(0)
      tick.current = 0
      setPhase('active')
    }
  }, [restLeft, phase])

  const cue = exercise.coachingCues[rep % exercise.coachingCues.length]
  const cueIsPositive = /great|nice|excellent|strong|smooth|well done/i.test(cue)

  const overallProgress =
    ((set - 1) * reps + Math.min(rep, reps)) / (sets * reps) * 100

  return (
    <div className="flex min-h-svh flex-col bg-paper">
      {/* Session header */}
      <header className="sticky top-0 z-30 border-b border-mist-200/70 bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center gap-4 px-4 sm:px-6">
          <Button
            variant="ghost"
            size="icon"
            aria-label="Exit session"
            onClick={() => navigate('/patient/plan')}
          >
            <X aria-hidden="true" />
          </Button>
          <div className="min-w-0 flex-1">
            <h1 className="truncate text-lg font-bold text-ink-900">{exercise.name}</h1>
            <p className="text-xs font-semibold text-ink-400">
              {sets} sets × {reps} reps
              {exercise.holdSeconds ? ` · ${exercise.holdSeconds}s hold` : ''}
              {exercise.tempo ? ` · ${exercise.tempo}` : ''}
            </p>
          </div>
          {phase !== 'intro' && (
            <Badge variant="navy" className="px-3 py-1.5 text-sm tabular-nums">
              Set {set} of {sets}
            </Badge>
          )}
        </div>
        {phase !== 'intro' && (
          <Progress
            value={overallProgress}
            className="h-1.5 rounded-none bg-mist-100"
            aria-label="Exercise progress"
          />
        )}
      </header>

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 sm:px-6">
        {phase === 'intro' ? (
          /* ---------------- Intro / instructions ---------------- */
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-2xl bg-white p-4 shadow-card">
              <div className="flex items-center justify-between px-1 pb-2">
                <p className="text-sm font-bold text-ink-900">Watch the movement guide</p>
                <Badge variant="accent">Demo loop</Badge>
              </div>
              <div className="h-72 rounded-xl bg-mist-50 sm:h-80">
                <SkeletonGuide poseId={exercise.poseId} label={`Demonstration of ${exercise.name}`} />
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <div className="rounded-2xl bg-white p-6 shadow-card">
                <h2 className="text-base font-bold text-ink-900">How to do it</h2>
                <ol className="mt-3 space-y-3">
                  {exercise.instructions.map((step, i) => (
                    <li key={i} className="flex gap-3 text-[15px] leading-relaxed text-ink-600">
                      <span
                        aria-hidden="true"
                        className="mt-0.5 inline-flex size-6 shrink-0 items-center justify-center rounded-full bg-mist-100 text-xs font-bold text-navy-700"
                      >
                        {i + 1}
                      </span>
                      {step}
                    </li>
                  ))}
                </ol>
              </div>

              <div className="flex items-start gap-3 rounded-2xl border border-warn-600/25 bg-warn-100/60 p-4">
                <ShieldCheck className="mt-0.5 size-5 shrink-0 text-warn-700" aria-hidden="true" />
                <div>
                  <p className="text-sm font-bold text-warn-700">Safety first</p>
                  <p className="mt-0.5 text-sm leading-relaxed text-ink-600">{exercise.safetyNote}</p>
                </div>
              </div>

              <Button size="lg" className="w-full" onClick={() => setPhase('active')}>
                <Play aria-hidden="true" /> Begin exercise
              </Button>
            </div>
          </div>
        ) : (
          /* ---------------- Active session ---------------- */
          <div className="grid gap-5 lg:grid-cols-2">
            {/* Guide panel */}
            <div className="rounded-2xl bg-white p-4 shadow-card">
              <div className="flex items-center justify-between px-1 pb-2">
                <p className="text-sm font-bold text-ink-900">Movement guide</p>
                <Badge variant="accent">
                  {exercise.holdSeconds ? `Hold ${exercise.holdSeconds}s at top` : 'Match this pace'}
                </Badge>
              </div>
              <div className="h-64 rounded-xl bg-mist-50 sm:h-72">
                <SkeletonGuide
                  poseId={exercise.poseId}
                  playing={phase === 'active' && !paused}
                  label={`Demonstration of ${exercise.name}`}
                />
              </div>
            </div>

            {/* Camera + status panel */}
            <div className="flex flex-col gap-4">
              <div className="h-48 sm:h-56">
                <CameraPlaceholder state={phase === 'active' && !paused ? 'recording' : 'idle'} />
              </div>

              {/* Rep counter / rest countdown */}
              <div className="rounded-2xl bg-white p-5 text-center shadow-card" aria-live="polite">
                {phase === 'rest' ? (
                  <>
                    <p className="text-sm font-bold tracking-wide text-ink-400 uppercase">Rest</p>
                    <p className="mt-1 text-5xl font-bold text-ink-900 tabular-nums">{restLeft}s</p>
                    <p className="mt-1 text-sm font-semibold text-ink-400">
                      Next: set {set + 1} of {sets}
                    </p>
                    <Button
                      variant="secondary"
                      className="mt-3"
                      onClick={() => setRestLeft(0)}
                    >
                      Skip rest
                    </Button>
                  </>
                ) : (
                  <>
                    <p className="text-sm font-bold tracking-wide text-ink-400 uppercase">
                      {paused ? 'Paused' : 'Rep'}
                    </p>
                    <p className="mt-1 text-5xl font-bold text-ink-900 tabular-nums">
                      {Math.min(rep + 1, reps)}
                      <span className="text-2xl font-semibold text-ink-400"> / {reps}</span>
                    </p>
                  </>
                )}
              </div>

              {/* Live coaching feedback (mocked) */}
              {phase === 'active' && (
                <AnimatePresence mode="wait">
                  <motion.div
                    key={cue}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.25 }}
                    role="status"
                    className={cn(
                      'flex items-start gap-3 rounded-2xl p-4',
                      cueIsPositive
                        ? 'border border-good-600/25 bg-good-100/70'
                        : 'border border-mist-300/60 bg-mist-100/80',
                    )}
                  >
                    {cueIsPositive ? (
                      <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-good-700" aria-hidden="true" />
                    ) : (
                      <Info className="mt-0.5 size-5 shrink-0 text-navy-700" aria-hidden="true" />
                    )}
                    <div>
                      <p className={cn('text-xs font-bold uppercase tracking-wide', cueIsPositive ? 'text-good-700' : 'text-navy-700')}>
                        Live coaching
                      </p>
                      <p className="mt-0.5 text-[15px] font-semibold text-ink-900">{cue}</p>
                    </div>
                  </motion.div>
                </AnimatePresence>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Big, always-visible session controls */}
      {phase !== 'intro' && (
        <footer className="sticky bottom-0 border-t border-mist-200/70 bg-white/95 backdrop-blur">
          <div className="mx-auto flex max-w-6xl items-center justify-center gap-3 px-4 py-3 sm:gap-4 sm:px-6">
            <Button
              variant="outline"
              size="lg"
              onClick={() => {
                setRep(0)
                tick.current = 0
              }}
            >
              <RotateCcw aria-hidden="true" />
              <span className="hidden sm:inline">Restart set</span>
            </Button>
            <Button
              size="iconLg"
              className="px-10"
              aria-label={paused ? 'Resume' : 'Pause'}
              onClick={() => setPaused((p) => !p)}
            >
              {paused ? <Play aria-hidden="true" /> : <Pause aria-hidden="true" />}
            </Button>
            <Button variant="outline" size="lg" onClick={finish}>
              <SkipForward aria-hidden="true" />
              <span className="hidden sm:inline">Finish early</span>
            </Button>
          </div>
        </footer>
      )}

      {/* Gentle reminder if paused a while */}
      {paused && (
        <div className="pointer-events-none fixed inset-x-0 top-20 z-40 flex justify-center px-4">
          <div className="flex items-center gap-2 rounded-full bg-navy-950/90 px-4 py-2 text-sm font-semibold text-white shadow-card-lg">
            <AlertTriangle className="size-4 text-mist-300" aria-hidden="true" />
            Session paused — take your time
          </div>
        </div>
      )}
    </div>
  )
}
