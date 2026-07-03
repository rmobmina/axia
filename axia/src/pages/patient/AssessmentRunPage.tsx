import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Loader2, Play, X } from 'lucide-react'
import { assessmentById, latestResultFor } from '@/mocks/assessments'
import { DEMO_PATIENT_ID } from '@/context/RoleContext'
import type { AssessmentType } from '@/types'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { SkeletonGuide } from '@/components/skeleton/SkeletonGuide'
import { CameraPlaceholder } from '@/components/CameraPlaceholder'

/**
 * Guided assessment capture flow:
 * instructions → countdown → recording → processing → results.
 *
 * TODO(cv-pipeline): the recording phase currently runs a plain timer with
 * rotating prompts. The real flow uploads the captured video, enqueues an
 * analysis job (FastAPI + async queue), polls for completion, then routes to
 * the freshly computed result instead of the latest mock.
 */

type Phase = 'instructions' | 'countdown' | 'recording' | 'processing'

const PROMPTS: Record<AssessmentType, string[]> = {
  gait: ['Walk at your normal pace', 'Keep looking ahead, not down', 'Nice steady rhythm', 'Turn and walk back'],
  'sit-to-stand': ['Stand fully upright each time', 'Try not to use your hands', 'Push evenly through both legs', 'Last one — finish strong'],
  balance: ['Fix your eyes on one spot', 'Breathe normally', 'You’re doing well — keep holding', 'Nearly there'],
  'shoulder-rom': ['Raise both arms slowly', 'Go only as high as comfortable', 'Hold for a moment at the top', 'Lower with control'],
}

export function AssessmentRunPage() {
  const { type } = useParams()
  const navigate = useNavigate()
  const assessment = useMemo(() => assessmentById(type as AssessmentType), [type])

  const [phase, setPhase] = useState<Phase>('instructions')
  const [count, setCount] = useState(3)
  const [elapsed, setElapsed] = useState(0)

  // Countdown 3-2-1
  useEffect(() => {
    if (phase !== 'countdown') return
    if (count <= 0) {
      setPhase('recording')
      return
    }
    const id = setTimeout(() => setCount((c) => c - 1), 1000)
    return () => clearTimeout(id)
  }, [phase, count])

  // Recording timer
  useEffect(() => {
    if (phase !== 'recording') return
    if (elapsed >= assessment.captureSeconds) {
      setPhase('processing')
      return
    }
    const id = setTimeout(() => setElapsed((e) => e + 1), 1000)
    return () => clearTimeout(id)
  }, [phase, elapsed, assessment.captureSeconds])

  // Fake analysis, then route to the latest result for this assessment type.
  useEffect(() => {
    if (phase !== 'processing') return
    const id = setTimeout(() => {
      const latest = latestResultFor(DEMO_PATIENT_ID, assessment.id)
      navigate(
        latest
          ? `/patient/assessments/${assessment.id}/results/${latest.id}`
          : `/patient/assessments/${assessment.id}/results/baseline`,
        { replace: true },
      )
    }, 2600)
    return () => clearTimeout(id)
  }, [phase, assessment.id, navigate])

  const prompts = PROMPTS[assessment.id]
  const prompt = prompts[Math.min(Math.floor((elapsed / assessment.captureSeconds) * prompts.length), prompts.length - 1)]

  return (
    <div className="flex min-h-svh flex-col bg-paper">
      <header className="sticky top-0 z-30 border-b border-mist-200/70 bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-5xl items-center gap-4 px-4 sm:px-6">
          <Button
            variant="ghost"
            size="icon"
            aria-label="Exit assessment"
            onClick={() => navigate('/patient/assessments')}
          >
            <X aria-hidden="true" />
          </Button>
          <div className="min-w-0 flex-1">
            <h1 className="truncate text-lg font-bold text-ink-900">{assessment.name}</h1>
            <p className="text-xs font-semibold text-ink-400">{assessment.durationLabel} · guided check-in</p>
          </div>
          <Badge variant="accent" className="capitalize">{phase}</Badge>
        </div>
      </header>

      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-6 sm:px-6">
        {phase === 'instructions' && (
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-2xl bg-white p-4 shadow-card">
              <p className="px-1 pb-2 text-sm font-bold text-ink-900">What it looks like</p>
              <div className="h-72 rounded-xl bg-mist-50 sm:h-80">
                <SkeletonGuide poseId={assessment.poseId} label={`Demonstration of ${assessment.name}`} />
              </div>
            </div>
            <div className="flex flex-col gap-4">
              <div className="rounded-2xl bg-white p-6 shadow-card">
                <h2 className="text-base font-bold text-ink-900">Set up in 4 steps</h2>
                <ol className="mt-3 space-y-3">
                  {assessment.steps.map((step, i) => (
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
              <div className="rounded-2xl bg-mist-100/70 p-4 text-sm leading-relaxed text-ink-600">
                <span className="font-bold text-navy-800">Measures: </span>
                {assessment.measures.join(' · ')}
              </div>
              <Button size="lg" className="w-full" onClick={() => setPhase('countdown')}>
                <Play aria-hidden="true" /> I’m ready — start countdown
              </Button>
            </div>
          </div>
        )}

        {(phase === 'countdown' || phase === 'recording') && (
          <div className="grid gap-5 lg:grid-cols-2">
            <div className="h-80 sm:h-96">
              <CameraPlaceholder
                state={phase === 'countdown' ? 'countdown' : 'recording'}
                countdownValue={count}
              />
            </div>
            <div className="flex flex-col gap-4">
              <div className="flex-1 rounded-2xl bg-white p-4 shadow-card">
                <p className="px-1 pb-2 text-sm font-bold text-ink-900">Follow along</p>
                <div className="h-56 rounded-xl bg-mist-50 sm:h-64">
                  <SkeletonGuide
                    poseId={assessment.poseId}
                    playing={phase === 'recording'}
                    label={`Demonstration of ${assessment.name}`}
                  />
                </div>
              </div>

              {phase === 'recording' && (
                <>
                  <div className="rounded-2xl bg-white p-5 shadow-card">
                    <div className="flex items-center justify-between text-sm font-semibold text-ink-400">
                      <span>Recording</span>
                      <span className="tabular-nums">
                        {elapsed}s / {assessment.captureSeconds}s
                      </span>
                    </div>
                    <Progress
                      value={(elapsed / assessment.captureSeconds) * 100}
                      className="mt-2"
                      aria-label="Recording progress"
                    />
                  </div>
                  <AnimatePresence mode="wait">
                    <motion.p
                      key={prompt}
                      role="status"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      className="rounded-2xl bg-navy-700 p-4 text-center text-lg font-bold text-white"
                    >
                      {prompt}
                    </motion.p>
                  </AnimatePresence>
                </>
              )}
            </div>
          </div>
        )}

        {phase === 'processing' && (
          <div className="flex min-h-[50vh] flex-col items-center justify-center text-center">
            <motion.span
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-flex size-20 items-center justify-center rounded-full bg-mist-100"
            >
              <Loader2 className="size-10 animate-spin text-navy-700" aria-hidden="true" />
            </motion.span>
            <h2 className="mt-5 text-2xl font-bold text-ink-900">Analyzing your movement…</h2>
            <p className="mt-2 max-w-sm text-ink-600">
              Measuring your {assessment.measures[0].toLowerCase()} and comparing with your last
              check-in.
            </p>
          </div>
        )}
      </main>
    </div>
  )
}
