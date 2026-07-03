import { useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowLeft, CheckCircle2, Eye, Minus, Plus, Trash2 } from 'lucide-react'
import { EXERCISES, exerciseById, REGION_LABELS } from '@/mocks/exercises'
import { patientById } from '@/mocks/patients'
import { api } from '@/services/api'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/input'
import { Avatar } from '@/components/ui/avatar'
import { SkeletonGuide } from '@/components/skeleton/SkeletonGuide'
import { cn } from '@/lib/utils'
import type { PlanItem } from '@/types'

const FREQUENCIES = ['Daily', '3x / week', '2x / week']

/** Stepper with big +/- targets, keyboard accessible. */
function Stepper({
  label,
  value,
  onChange,
  min = 1,
  max = 60,
  step = 1,
}: {
  label: string
  value: number
  onChange: (v: number) => void
  min?: number
  max?: number
  step?: number
}) {
  return (
    <div className="flex items-center gap-2">
      <span className="w-14 text-xs font-semibold text-ink-400">{label}</span>
      <div className="flex items-center rounded-xl bg-mist-100">
        <button
          type="button"
          aria-label={`Decrease ${label}`}
          className="flex size-9 cursor-pointer items-center justify-center rounded-l-xl text-navy-800 hover:bg-mist-200 disabled:opacity-40"
          onClick={() => onChange(Math.max(min, value - step))}
          disabled={value <= min}
        >
          <Minus className="size-4" aria-hidden="true" />
        </button>
        <span className="w-9 text-center text-sm font-bold text-ink-900 tabular-nums">{value}</span>
        <button
          type="button"
          aria-label={`Increase ${label}`}
          className="flex size-9 cursor-pointer items-center justify-center rounded-r-xl text-navy-800 hover:bg-mist-200 disabled:opacity-40"
          onClick={() => onChange(Math.min(max, value + step))}
          disabled={value >= max}
        >
          <Plus className="size-4" aria-hidden="true" />
        </button>
      </div>
    </div>
  )
}

export function AssignPlanPage() {
  const { patientId } = useParams()
  const navigate = useNavigate()
  const patient = patientById(patientId!)

  const [region, setRegion] = useState<string>('all')
  const [items, setItems] = useState<PlanItem[]>([])
  const [note, setNote] = useState('')
  const [showPreview, setShowPreview] = useState(false)
  const [state, setState] = useState<'editing' | 'saving' | 'saved'>('editing')

  const regions = useMemo(() => ['all', ...new Set(EXERCISES.map((e) => e.region))], [])
  const library = EXERCISES.filter((e) => region === 'all' || e.region === region)

  const addExercise = (exerciseId: string) => {
    const ex = exerciseById(exerciseId)
    setItems((prev) => [
      ...prev,
      {
        exerciseId,
        reps: ex.defaultReps,
        sets: ex.defaultSets,
        holdSeconds: ex.holdSeconds,
        frequency: 'Daily',
        status: 'not-started',
        dueToday: true,
      },
    ])
  }

  const updateItem = (exerciseId: string, patch: Partial<PlanItem>) =>
    setItems((prev) => prev.map((i) => (i.exerciseId === exerciseId ? { ...i, ...patch } : i)))

  const removeItem = (exerciseId: string) =>
    setItems((prev) => prev.filter((i) => i.exerciseId !== exerciseId))

  const assign = async () => {
    setState('saving')
    await api.assignPlan({
      id: `plan-${Date.now()}`,
      patientId: patient.id,
      name: `${patient.program} — updated`,
      focus: 'Clinician-updated plan',
      stage: 'Week 1',
      startDate: new Date().toISOString().slice(0, 10),
      weeks: 8,
      items,
      clinicianNote: note,
    })
    setState('saved')
    setTimeout(() => navigate(`/clinician/patients/${patient.id}`), 1400)
  }

  return (
    <div className="space-y-6 pb-6">
      <div className="flex flex-wrap items-center gap-4">
        <Link
          to={`/clinician/patients/${patient.id}`}
          className="inline-flex size-11 items-center justify-center rounded-xl text-navy-800 hover:bg-mist-100"
          aria-label={`Back to ${patient.name}`}
        >
          <ArrowLeft className="size-5" aria-hidden="true" />
        </Link>
        <Avatar name={patient.name} />
        <div className="flex-1">
          <h1 className="text-2xl font-bold tracking-tight text-ink-900">Assign exercise plan</h1>
          <p className="text-sm text-ink-400">
            {patient.name} · {patient.condition}
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Exercise library */}
        <Card>
          <CardHeader>
            <CardTitle>Exercise library</CardTitle>
            <div role="group" aria-label="Filter by body region" className="mt-2 flex flex-wrap gap-1.5">
              {regions.map((r) => (
                <button
                  key={r}
                  type="button"
                  aria-pressed={region === r}
                  onClick={() => setRegion(r)}
                  className={cn(
                    'h-9 cursor-pointer rounded-full px-3.5 text-sm font-semibold transition-colors',
                    region === r
                      ? 'bg-navy-700 text-white'
                      : 'bg-mist-100 text-ink-600 hover:bg-mist-200',
                  )}
                >
                  {r === 'all' ? 'All' : REGION_LABELS[r]}
                </button>
              ))}
            </div>
          </CardHeader>
          <CardContent className="max-h-130 space-y-2 overflow-y-auto">
            {library.map((ex) => {
              const added = items.some((i) => i.exerciseId === ex.id)
              return (
                <div
                  key={ex.id}
                  className="flex items-center gap-3 rounded-xl border border-mist-200/70 p-3"
                >
                  <div className="size-12 shrink-0 rounded-lg bg-mist-50 p-0.5 ring-1 ring-mist-200">
                    <SkeletonGuide poseId={ex.poseId} playing={false} showTargetArc={false} label="" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold text-ink-900">{ex.name}</p>
                    <p className="truncate text-xs text-ink-400">
                      {REGION_LABELS[ex.region]} · {ex.summary}
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant={added ? 'secondary' : 'outline'}
                    disabled={added}
                    onClick={() => addExercise(ex.id)}
                    aria-label={added ? `${ex.name} added` : `Add ${ex.name}`}
                  >
                    {added ? <CheckCircle2 aria-hidden="true" /> : <Plus aria-hidden="true" />}
                    {added ? 'Added' : 'Add'}
                  </Button>
                </div>
              )
            })}
          </CardContent>
        </Card>

        {/* Plan under construction */}
        <div className="space-y-4">
          <Card>
            <CardHeader className="flex-row items-center justify-between">
              <CardTitle>
                New plan{' '}
                <span className="text-sm font-semibold text-ink-400">
                  · {items.length} exercise{items.length === 1 ? '' : 's'}
                </span>
              </CardTitle>
              <Button variant="ghost" size="sm" onClick={() => setShowPreview((v) => !v)}>
                <Eye aria-hidden="true" /> {showPreview ? 'Hide' : 'Patient'} preview
              </Button>
            </CardHeader>
            <CardContent className="space-y-3">
              {items.length === 0 && (
                <p className="rounded-xl border-2 border-dashed border-mist-200 bg-mist-50/60 p-6 text-center text-sm text-ink-400">
                  Add exercises from the library to build {patient.name.split(' ')[0]}’s plan.
                </p>
              )}
              <AnimatePresence initial={false}>
                {items.map((item) => {
                  const ex = exerciseById(item.exerciseId)
                  return (
                    <motion.div
                      key={item.exerciseId}
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="rounded-xl border border-mist-200/70 p-4">
                        <div className="flex items-center justify-between gap-2">
                          <p className="font-bold text-ink-900">{ex.name}</p>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="size-9 text-alert-600 hover:bg-alert-100"
                            aria-label={`Remove ${ex.name}`}
                            onClick={() => removeItem(item.exerciseId)}
                          >
                            <Trash2 className="size-4" aria-hidden="true" />
                          </Button>
                        </div>
                        <div className="mt-2 flex flex-wrap gap-x-6 gap-y-2.5">
                          <Stepper
                            label="Sets"
                            value={item.sets}
                            max={6}
                            onChange={(v) => updateItem(item.exerciseId, { sets: v })}
                          />
                          <Stepper
                            label="Reps"
                            value={item.reps}
                            max={30}
                            onChange={(v) => updateItem(item.exerciseId, { reps: v })}
                          />
                          {item.holdSeconds !== undefined && (
                            <Stepper
                              label="Hold (s)"
                              value={item.holdSeconds}
                              max={60}
                              onChange={(v) => updateItem(item.exerciseId, { holdSeconds: v })}
                            />
                          )}
                        </div>
                        <div
                          role="group"
                          aria-label={`${ex.name} frequency`}
                          className="mt-3 flex flex-wrap gap-1.5"
                        >
                          {FREQUENCIES.map((f) => (
                            <button
                              key={f}
                              type="button"
                              aria-pressed={item.frequency === f}
                              onClick={() => updateItem(item.exerciseId, { frequency: f })}
                              className={cn(
                                'h-8 cursor-pointer rounded-full px-3 text-xs font-semibold transition-colors',
                                item.frequency === f
                                  ? 'bg-navy-700 text-white'
                                  : 'bg-mist-100 text-ink-600 hover:bg-mist-200',
                              )}
                            >
                              {f}
                            </button>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </AnimatePresence>
            </CardContent>
          </Card>

          {/* Patient preview */}
          {showPreview && items.length > 0 && (
            <Card className="border-mist-300 bg-paper">
              <CardHeader>
                <CardTitle className="text-sm">
                  What {patient.name.split(' ')[0]} will see
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {items.map((item) => {
                  const ex = exerciseById(item.exerciseId)
                  return (
                    <div
                      key={item.exerciseId}
                      className="flex items-center gap-3 rounded-xl bg-white p-3 shadow-card"
                    >
                      <div className="size-11 shrink-0 rounded-lg bg-mist-50 p-0.5 ring-1 ring-mist-200">
                        <SkeletonGuide poseId={ex.poseId} playing={false} showTargetArc={false} label="" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-bold text-ink-900">{ex.name}</p>
                        <p className="text-xs text-ink-400">
                          {item.sets} sets × {item.reps}
                          {item.holdSeconds ? ` · ${item.holdSeconds}s hold` : ''} · {item.frequency}
                        </p>
                      </div>
                      <Badge variant="outline">To do</Badge>
                    </div>
                  )
                })}
                {note.trim() && (
                  <p className="rounded-xl bg-navy-700 p-3.5 text-sm leading-relaxed text-mist-100">
                    <span className="font-bold text-white">Note from Dr. Raman: </span>
                    {note}
                  </p>
                )}
              </CardContent>
            </Card>
          )}

          {/* Note + assign */}
          <Card>
            <CardContent className="p-5">
              <label htmlFor="plan-note" className="mb-2 block text-sm font-bold text-ink-900">
                Note to patient
              </label>
              <Textarea
                id="plan-note"
                rows={3}
                placeholder="e.g. Focus on control this phase — shallow and pain-free beats deep and sore."
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
              <Button
                size="lg"
                className="mt-4 w-full"
                disabled={items.length === 0 || state !== 'editing'}
                variant={state === 'saved' ? 'success' : 'primary'}
                onClick={assign}
              >
                {state === 'saved' ? (
                  <>
                    <CheckCircle2 aria-hidden="true" /> Plan assigned to {patient.name.split(' ')[0]}
                  </>
                ) : state === 'saving' ? (
                  'Assigning…'
                ) : (
                  `Assign plan (${items.length})`
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
